import mongoose from 'mongoose';

import StockSchema from '../schemas/stocks';
import { getBasketsByStatus } from './baskets';

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
      if (curr.type === 'myfa') {
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

    res.status(200).send(stocks);
  } catch (e) {
    console.log(e);
  }
};

export { fetchStocks };
