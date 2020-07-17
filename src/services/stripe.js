import Stripe from 'stripe';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { getUserByEmail } from './users';
import { sendMessage } from './nexmo';;
import { sendOrderConfirmationEmail } from './mailjet';
import basketSchema from '../schemas/basket';
import { saveBasketsFromOrder } from './baskets';
import countBy from '../utils/countBy';
import uniqBy from '../utils/uniqBy';
import { usePromo } from './promo';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_API_SECRET);
const JWT_SECRET = process.env.JWT_SECRET;
const PROMO_PERCENTAGE = 10;

const getPrice = (basketPrice, promoActivated) => {
  let price = basketPrice;

  if (promoActivated) {
    price -= (price / PROMO_PERCENTAGE);
    price = price.toFixed(2);
  }

  let literalPrice = String(price);
  let parts = literalPrice.split('.');

  if (parts[1].length === 1) {
    parts[1] = parts[1] + '0';
  }

  literalPrice = parts[0] + parts[1];

  return Number(literalPrice);
};

const createPayment = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);
    const { order, user, success_url } = req.body;
    let promoActivated = false;

    if (userInfo.email !== user.email) {
      res.status(401);
      res.send('Wrong token');
      return;
    }

    let session = { id: 'test' };

    const getImage = (img) => {
      let images = {
        'veggies': 'veggies.jpg',
        'fruits': 'fruits.jpg',
        'myfa': 'myfa.jpg',
        'sauces': 'sauces.jpg',
        'beauty': 'beauty.jpg',
      };

      return images[img] || 'default-product.png';
    };

    if (!!order.promo) {
      let result = await usePromo(order.promo);

      if (result.nModified > 0) {
        // Réduction -10%
        promoActivated = true;
      }
    }

    let lineItems = [];

    if (order.baskets) {
      lineItems = uniqBy(order.baskets, 'type').map((basket) => ({
        name: basket.label,
        description: basket.description,
        images: [`https://www.myfa.fr/${getImage(basket.type)}`],
        amount: getPrice(basket.price, promoActivated),
        currency: 'eur',
        quantity: countBy(order.baskets, 'type', basket.type),
      }));
    }

    if (order.products && order.products.items) {
      lineItems = [...lineItems, ...order.products.items.map(product => ({
        name: product.name,
        description: '',
        images: [`https://www.myfa.fr/${getImage(product.name)}`],
        amount: getPrice(product.price, promoActivated),
        currency: 'eur',
        quantity: 1,
      }))];
    }

    if (!order.isTest) {
      session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url,
        cancel_url: 'https://www.myfa.fr',
      });
    }

    saveBasketsFromOrder(order, user, session.payment_intent);
    // @TODO: saveProductsAsDetailsBasket(order, user, session.payment_intent);

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
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
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

    if (event['type'] === 'payment_intent.succeeded') {
      intent = event.data.object;
      const basketsModel = mongoose.model('baskets', basketSchema);
      const result = await basketsModel.updateMany({ stripeIntentId: intent.id }, { status: 'paid' });

      if (result.nModified) {
        notifyOfPayment(intent.id);
        res.status(201);
        res.send('Document updated');
        return;
      }
    }

    res.sendStatus(200);
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send('Something went wrong while trying to update document');
	}
};

const notifyOfPayment = async (stripeIntentId) => {
	const basketsModel = mongoose.model('baskets', basketSchema);
	const baskets = await basketsModel.find({ stripeIntentId });
	const user = await getUserByEmail(baskets[0].userEmail || baskets[0].user.email);

	await sendOrderConfirmationEmail(user, baskets);
	await sendMessage(user, baskets[0].recipient, 'paid-basket');
};

export { confirmPayment, createPayment };
