import Stripe from 'stripe';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { getUserByEmail } from './users';
import { sendMessage } from './nexmo';;
import { sendOrderConfirmationEmail } from './mailjet';
import basketSchema from '../schemas/basket';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_API_SECRET);

const getPrice = (p) => {
  let literalPrice = String(p);
  literalPrice = literalPrice.replace('.','');

  return Number(literalPrice);
};

const createPayment = async (req, res, next) => {
  try {
    const { order, user, success_url } = req.body;

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: Object.keys(order.baskets).map(key => ({
        name: order.baskets[key].label,
        description: order.baskets[key].description,
        images: [`https://www.myfa.fr/${order.baskets[key].img}`],
        amount: getPrice(order.baskets[key].singlePrice),
        currency: 'eur',
        quantity: order.baskets[key].qty,
      })),
      success_url,
      cancel_url: 'https://www.myfa.fr',
    });

    res.status(201);
    res.send({ id: session.id });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('something wrong happened');
  }
};

const confirmPayment = async (req, res, next) => {
	try {
    const endpointSecret = 'whsec_pIzKY0nhdnWryOJh7gveefwsyuidwwce';
    const sig = req.headers['stripe-signature'];
    const body = req.body;

    let event = null;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      // invalid signature
      res.status(400).end();
      return;
    }

    let intent = null;
    switch (event['type']) {
      case 'payment_intent.succeeded':
        intent = event.data.object;
        console.log("Succeeded:", intent.id);
        console.log(intent);
        break;
      case 'payment_intent.payment_failed':
        intent = event.data.object;
        const message = intent.last_payment_error && intent.last_payment_error.message;
        console.log('Failed:', intent.id, message);
        break;
    }

    res.sendStatus(200);
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send('Something went wrong while trying to update document');
	}
};

const notifyOfPayment = async (orderRef) => {
	const basketsModel = mongoose.model('baskets', basketSchema);
	const baskets = await basketsModel.find({ orderRef });
	const user = await getUserByEmail(baskets[0].userEmail);

	await sendOrderConfirmationEmail(user, baskets);
	await sendMessage(user, baskets[0].recipient, 'paid-basket');
};

export { confirmPayment, createPayment };
