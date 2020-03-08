import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_API_SECRET);

const createPayment = async (req, res, next) => {
  try {
    const { baskets, user } = req.body;

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: Object.keys(baskets).map(key => ({
        name: baskets[key].label,
        description: baskets[key].description,
        images: [`https://www.myfa.fr/${baskets[key].img}`],
        amount: baskets[key].singlePrice,
        currency: 'eur',
        quantity: baskets[key].qty,
      })),
      success_url: 'https://example.com/success', // @TODO : change this
      cancel_url: 'https://example.com/cancel', // @TODO : change this
    });

    res.status(201);
    res.send({ id: session.id });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('something wrong happened');
  }
};

export { createPayment };
