import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import StockSchema from '../schemas/stocks';
import { getBasketsByStatus } from './baskets';

const JWT_SECRET = process.env.JWT_SECRET;

const fetchStocks = async (req, res, next) => {
  try {
    const stocksModel = mongoose.model('stocks', StockSchema);
    const results = await Promise.all([
      getBasketsByStatus(['paid', 'preparing']),
      stocksModel.find({}),
    ]);
    const baskets = results[0];
    const stocks = results[1];

    const items = baskets.reduce((acc, curr) => {
      if (curr.type === 'myfa' && typeof curr.items[0] !== 'string') {
        return Object.values(curr.items).reduce(
          (basketAcc, basketCurr) => [...basketAcc, ...basketCurr.map(it => it.label)], acc
        );
      } else {
        return [...acc, ...curr.items];
      }
    }, []);

    items.forEach(it => {
      const stockIndex = stocks.findIndex(stock => stock.label === it);

      if (stockIndex < 0) {
        stocks.push({
          label: it,
          need: 1,
          have: 0,
        });
      } else if (!!stocks[stockIndex].need) {
        stocks[stockIndex] = {
          ...(stocks[stockIndex]._doc || stocks[stockIndex]),
          need: stocks[stockIndex].need + 1,
        };
      } else {
        stocks[stockIndex] = {
          ...(stocks[stockIndex]._doc || stocks[stockIndex]),
          need: 1,
        };
      }
    });

    const stocksToReturn = stocks.map((stock, index) => {
      const smallBaskets = ['fruits', 'ramadan_fruits', 'ramadan_sugar'];

      if (typeof stock.need === 'undefined') {
        if (stock.label === 'grand panier') {
          return ({ ...stock._doc, need: baskets.filter(b => !smallBaskets.includes(b.type)).length });
        } else if (stock.label === 'petit panier') {
          return ({ ...stock._doc, need: baskets.filter(b => smallBaskets.includes(b.type)).length });
        } else {
          return ({ ...stock._doc, need: 0 });
        }
      } else {
        return stock;
      }
    });

    res.status(200).send(stocksToReturn);
  } catch (e) {
    console.log(e);
  }
};

const updateStock = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo.admin) {
      res.status(401);
      res.send('wrong token');
    }

    let { label, have } = req.body;
		const stocksModel = mongoose.model('stocks', StockSchema);

    await stocksModel.update({ label }, { have });

    res.status(201).send('updated');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

export { fetchStocks, updateStock };
