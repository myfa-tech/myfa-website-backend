import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import subMonths from 'date-fns/subMonths';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';

import RequestSchema from '../../../schemas/request';
import UserSchema from '../../../schemas/user';
import getSatisfiedRelativedKPI from './utils/getSatisfiedRelativedKPI';
import getRelativesServicesKPI from './utils/getRelativesServicesKPI';
import getSelfServicesKPI from './utils/getSelfServicesKPI';
import getSpentKPI from './utils/getSpentKPI';
import getWalletKPI from './utils/getWalletKPI';
import getSpendingSectorsKPI from './utils/getSpendingSectorsKPI';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const requestModel = mongoose.model('requests', RequestSchema);
const userModel = mongoose.model('users', UserSchema);

const getUserDasboardKPIs = async (req, res, next) => {
  const params = req.query;

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

  const responses = await Promise.all([
    getSatisfiedRelativedKPI(userInfo.email, periodLimitLow, periodLimitHigh),
    getRelativesServicesKPI(userInfo.email, periodLimitLow, periodLimitHigh),
    getSelfServicesKPI(userInfo.email, periodLimitLow, periodLimitHigh),
    getSpentKPI(userInfo.email, periodLimitLow, periodLimitHigh),
    getWalletKPI(userInfo.email),
    getSpendingSectorsKPI(userInfo.email, periodLimitLow, periodLimitHigh),
  ]);

  const enhancedResponses = responses.reduce((acc, curr) => ({ ...acc, ...curr }), {});

  res.status(200).send(enhancedResponses);
};

export default getUserDasboardKPIs;
