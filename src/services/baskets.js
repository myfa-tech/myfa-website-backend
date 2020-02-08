
import mongoose from 'mongoose';

import BasketSchema from '../schemas/basket';
import Basket from '../utils/basketFactory';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

const saveBasket = async (req) => {
	try {
    const { basket } = req.body
		const basketsModel = mongoose.model('baskets', BasketSchema)

    basket.paid = false
		basket.createdAt = Date.now()

		await basketsModel.create(basket)
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

const saveBasketsFromOrder = async (req) => {
	try {
    const { order } = req.body;
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    const baskets = [];

    Object.keys(order.baskets).forEach(basketType => {
      for (let i=0; i<order.baskets[basketType].qty; i++) {
        baskets.push(new Basket(basketType, userInfo, order.recipient, order.ref).getBasket());
      }
    });

		const basketsModel = mongoose.model('baskets', BasketSchema);
    let promises = [];

    baskets.forEach(basket => {
      promises.push(basketsModel.create(basket));
    });

    await Promise.all(promises);
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

const findBasket = async (req, res, next) => {
  try {
    if (!req.query.ref) {
      res.status(400)
      res.send('missing param')
    }

    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    const orderRef = req.query.ref
		const basketsModel = mongoose.model('baskets', BasketSchema)

    const basket = await basketsModel.findOne({ orderRef }, basketsModel)

    if (basket && !(basket.userEmail === userInfo.email || userInfo.admin)) {
      console.log('forbidden token');
      res.status(401);
      res.send('wrong token');
    } else if (basket) {
      res.status(200)
      res.json({ basket })
    } else {
      res.status(404)
      res.send('not found')
    }
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

const getBaskets = async (req, res, next) => {
  try {
		const basketsModel = mongoose.model('baskets', BasketSchema);
    const params = req.query || {};

    const baskets = await basketsModel.find(params, basketsModel);

    if (!!baskets) {
      res.status(200);
      res.json({ baskets });
    } else {
      res.status(404);
      res.send('not found');
    }
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
}

const getBasketsByEmail = async (req, res, next) => {
  try {
		const basketsModel = mongoose.model('baskets', BasketSchema);
    const email = req.query.email || '';
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (userInfo.email === email || userInfo.admin) {
      const baskets = await basketsModel.find({ userEmail: email }, basketsModel);

      if (!!baskets) {
        res.status(200);
        res.json({ baskets });
      } else {
        res.status(404);
        res.send('not found');
      }
    } else {
      console.log('forbidden token');
      res.status(403);
      res.send('forbidden');
    }
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
}

const countBaskets = async (req, res, next) => {
  const basketsModel = mongoose.model('baskets', BasketSchema);
  const count = await basketsModel.estimatedDocumentCount();

  res.status(200);
  res.send({ count });
}

export { countBaskets, findBasket, getBaskets, getBasketsByEmail, saveBasket, saveBasketsFromOrder };
