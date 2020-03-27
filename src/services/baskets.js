
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { getUserByEmail } from './users';
import { sendMessage } from './nexmo';

import Basket from '../utils/basketFactory';
import BasketSchema from '../schemas/basket';

import {
  getFirstDayOfCurrentMonth,
  getLastDayOfCurrentMonth,
  getMondayOfCurrentWeek,
  getSundayOfCurrentWeek,
} from '../utils/dates';

const JWT_SECRET = process.env.JWT_SECRET;

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

const updateBasketById = async (req, res, next) => {
	try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo.admin) {
      res.status(401);
      res.send('wrong token');
    }

    let { id, editFields } = req.body;
		const basketsModel = mongoose.model('baskets', BasketSchema);

    if (editFields.status === 'delivered') {
      editFields.deliveredAt = new Date();
    }

    const basket = await basketsModel.findOneAndUpdate({ _id: id }, editFields);

    if (editFields.status === 'delivered') {
      const user = await getUserByEmail(basket.userEmail);

      if (!!user.phone) {
        await sendMessage(basket.recipient, user, 'delivered-basket');
      }
    }

    if (!!basket) {
			res.status(201);
			res.send({ ...basket._doc, ...editFields });
		} else {
			res.status(204);
			res.send('Document not updated');
		}
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong');
	}
};

const saveBasketsFromOrder = async (order, userInfo, stripeIntentId) => {
	try {
    const baskets = [];

    Object.keys(order.baskets).forEach(basketType => {
      for (let i=0; i<order.baskets[basketType].qty; i++) {
        baskets.push(new Basket(basketType, userInfo, order, stripeIntentId).getBasket());
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
    const query = req.query || {};
    let filter = {};

    if (query.time_filter === 'month') {
      const monthFirstDay = getFirstDayOfCurrentMonth(new Date());
      const monthLastDay = getLastDayOfCurrentMonth(new Date());

      filter.createdAt = { $gte: monthFirstDay, $lte: monthLastDay };
    } else if (query.time_filter === 'week') {
      const weekMonday = getMondayOfCurrentWeek(new Date());
      const weekSunday = getSundayOfCurrentWeek(new Date());

      filter.createdAt = { $gte: weekMonday, $lte: weekSunday };
    } else if (query.time_filter === 'today') {
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const tomorrow = new Date(new Date(today).setDate(new Date().getDate() + 1));

      filter.createdAt = { $gte: today, $lte: tomorrow };
    } else if (!!query.time_filter) {
      res.status(400);
      res.send('wrong param');
      return;
    }

    const baskets = await basketsModel.find(filter, basketsModel);

    res.status(200);
    res.json({ baskets });
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

export { countBaskets, findBasket, getBaskets, getBasketsByEmail, saveBasket, saveBasketsFromOrder, updateBasketById };
