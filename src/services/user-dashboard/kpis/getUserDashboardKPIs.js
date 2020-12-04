import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import subMonths from 'date-fns/subMonths';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';

import RequestSchema from '../../../schemas/request';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const requestModel = mongoose.model('requests', RequestSchema);

const getUserDasboardKPIs = async (req, res, next) => {
  const params = req.query;

  const promises = [];
  let token = (req.headers.authorization || '').split(' ')[1];
  let userInfo = jwt.verify(token, JWT_SECRET);

  let periodLimitLow;
  let periodLimitHigh;
  let date = new Date();

  if (params.period === 'last-month') {
    date = subMonths(date, 1);
    periodLimitLow = startOfMonth(date);
    periodLimitHigh = endOfMonth(date);
  } else if (params.period === 'year') {
    periodLimitLow = startOfYear(date);
    periodLimitHigh = endOfYear(date);
  } else {
    periodLimitLow = startOfMonth(date);
    periodLimitHigh = endOfMonth(date);
  }

  const rules = [
    { collection: 'requests', filter: { 'user.email': userInfo.email, status: { $in: ['paid', 'delivered', 'preparing'] }, createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh } }, id: 'spent', type: 'sum', model: requestModel },
    { collection: 'requests', filter: { 'user.email': userInfo.email, status: { $in: ['paid', 'delivered', 'preparing'] }, type: { $in: ['Alimentaire', 'Cadeau', 'Santé'] }, createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh } }, id: 'relatives_services', type: 'count', model: requestModel },
    { collection: 'requests', filter: { 'user.email': userInfo.email, status: { $in: ['paid', 'delivered', 'preparing'] }, type: {$regex : "Batiment.*"}, createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh } }, id: 'self_services', type: 'count', model: requestModel },
  ];

  rules.forEach(rule => {
    if (rule.type === 'count') {
      const agg = rule.model.aggregate([{ $match: rule.filter }]);
      promises.push(agg.count(rule.id).exec());
    } else if (rule.type === 'sum') {
      const agg = rule.model.aggregate([
        {
          $match: rule.filter,
        },
        {
          $group: {
            _id: 1,
            spent: { $sum: '$price' },
          },
        },
      ]);
      promises.push(agg.exec());
    }
  });

  const responses = await Promise.all(promises);

  const enhancedResponses = responses.reduce((acc, curr) => ({ ...acc, ...curr[0] }), {});

  res.status(200).send(enhancedResponses);
};

export default getUserDasboardKPIs;
