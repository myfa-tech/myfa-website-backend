
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

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

import basketsInfos from '../assets/baskets';
import ramadanBasketsInfos from '../assets/ramadanBaskets';
import customBasketInfos from '../assets/customBasket';
import { log } from './operationsLogs';

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
      editFields.deliveredAt = new Date().toLocaleDateString('fr-FR');
    }

    const basket = await basketsModel.findOneAndUpdate({ _id: id }, editFields);

    log(userInfo.email, 'change', 'baskets', JSON.stringify(Object.keys(editFields)), JSON.stringify(Object.values(editFields)));

    if (editFields.status === 'delivered') {
      const user = basket.user || await getUserByEmail(basket.userEmail);

      if (!!user.phone) {
        await sendMessage(basket.recipient, user, 'delivered-basket');

        if (!!basket.message && basket.message !== '' && basket.message !== ' ') {
          await sendMessage(basket, basket.recipient, 'delivered-basket-message');
        }
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

const saveBasketsFromOrder = async (order, userInfo, stripeIntentId = '') => {
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
};

const createOrderManually = async (req, res, next) => {
  try {
    const info = req.body;

    const baskets = [];
    const randomId = uuid();
    const ref = randomId.substr(0, 8);
    const order = {
      recipient: {
        firstname: info.recipient_firstname,
        lastname: info.recipient_lastname,
        phone: info.recipient_phone,
        country: info.recipient_country,
        zone: info.zone,
      },
      user: {
        firstname: info.client_firstname,
        lastname: info.client_lastname,
        phone: info.client_phone,
        country: info.client_country,
      },
      ref,
      message: info.message,
    };

    for (let i=1; i<4; i++) {
      if (!!info[`basket_type_${i}`]) {
        baskets.push(new Basket(info[`basket_type_${i}`], order.user, order).getBasket());
      }
    }

    const basketsModel = mongoose.model('baskets', BasketSchema);
    let promises = [];

    baskets.forEach(basket => {
      promises.push(basketsModel.create(basket));
    });

    await Promise.all(promises);

    res.status(201);
    res.send('created');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

const updateBasketsByOrderRef = async (req, res, next) => {
  try {
    const basketsModel = mongoose.model('baskets', BasketSchema);

    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);
    let { orderRef, editFields } = req.body;

    if (!userInfo.email) {
      res.status(401);
      res.send('wrong token');
    }

    if (!orderRef) {
      res.status(400);
      res.send('missing params');
    }

    await basketsModel.updateMany({ orderRef, $or: [{ userEmail: userInfo.email }, { 'user.email': userInfo.email }]}, editFields);

    res.status(201);
    res.send('updated');
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('something wrong happened');
  }
};

const findBaskets = async (req, res, next) => {
  try {
    if (!req.query.ref) {
      res.status(400);
      res.send('missing param');
    }

    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    const orderRef = req.query.ref;
		const basketsModel = mongoose.model('baskets', BasketSchema);

    const baskets = await basketsModel.find({ orderRef }, basketsModel);

    if (baskets && !(baskets[0].userEmail === userInfo.email
      || (!!baskets[0].user && baskets[0].user.email === userInfo.email)
      || userInfo.admin)
    ) {
      console.log('forbidden token');
      res.status(401);
      res.send('wrong token');
    } else if (baskets) {
      res.status(200)
      res.json({ baskets })
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

    const baskets = await basketsModel.find(filter, basketsModel).sort({ createdAt: -1 });

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
      const baskets = await basketsModel.find({ $or: [{ userEmail: email }, { 'user.email': email }] }, basketsModel);

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

const getHomeBaskets = (req, res, next) => {
  const baskets = [...basketsInfos, customBasketInfos];

  res.status(200);
  res.send({ baskets });
};

const getBasketsByStatus = async (statuses = []) => {
  try {
    const basketsModel = mongoose.model('baskets', BasketSchema);
    const baskets = await basketsModel.find({ status: { $in: statuses }}, basketsModel);

    return baskets;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getRamadanBaskets = (req, res, next) => {
  const baskets = [...ramadanBasketsInfos];

  res.status(200);
  res.send({ baskets });
};

const getCustomBasket = (req, res, next) => {
  res.status(200);
  res.send({ basket: customBasketInfos });
};

export {
  getHomeBaskets,
  createOrderManually,
  getRamadanBaskets,
  getCustomBasket,
  countBaskets,
  getBasketsByStatus,
  findBaskets,
  getBaskets,
  getBasketsByEmail,
  saveBasket,
  saveBasketsFromOrder,
  updateBasketById,
  updateBasketsByOrderRef,
};
