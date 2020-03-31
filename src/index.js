import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { confirmPayment } from './services/stripe'
import { countBaskets, findBasket, saveBasketsFromOrder, getBaskets, getBasketsByEmail, updateBasketById } from './services/baskets'
import { addContactToList } from './services/mailjet';
import { login } from './services/dashboardUsers'
import { fetchKPIs } from './services/kpis'
import { confirmUserEmail, deleteUser, fetchUser, getUsers, loginFBUser, loginGoogleUser, loginUser, saveUser, updateUserByEmail, updateUserPassword, verifyUserPassword } from './services/users'
import { verifyAdminJWT, verifyJWT } from './utils/verifyJWT'
import { fetchGoals, updateGoalById } from './services/kpiGoals'
import { getFinanceRequests, removeFinanceRequest, saveRequest, updateFinanceRequestById } from './services/finance';
import { createPayment } from './services/stripe'

dotenv.config()

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

const whitelist = [
  'https://www.myfa.fr',
  'https://myfa.fr',
  'chrome-extension://jddpdjamaalalhlegkelkmckfhhiiijl',
  'chrome-extension://mbgaenpdobndgmhfbcomnghmlnfnhdcn',
  'https://5e54e542eb535600079d3f25--myfa.netlify.com',
  'https://5e5525a442032c000886409f--myfa.netlify.com',
  'https://5e554fb7418db30008037d17--myfa.netlify.com',
  'https://5e58bdb5b9040000085143ae--myfa.netlify.com',
  'https://5e58c3241e08360007514592--myfa.netlify.com',
  'https://5e567b5dd9fd4d000819a910--myfa.netlify.com',
  'https://5e57f98a109d79000748a8ae--myfa.netlify.com',
  'https://5e5d26cc18729c0008dd8e59--myfa.netlify.com',
  'https://5e5e6639023a180007e2cee0--myfa.netlify.com',
  'https://5e5fc726350e620008f9acfa--myfa.netlify.com',
  'https://5e6bcfdfecde450008a5363c--myfa.netlify.com',
  'https://5e793e392bce160008e8a0e4--myfa.netlify.com',
  'https://5e7b703779498a0008696beb--myfa.netlify.com',
  'https://5e7b76a4c981360008cfcf38--myfa.netlify.com',
  'https://5e7e21a5699a11000815791a--myfa.netlify.com',
  'https://5e7e315cb0a7b9000af0a8c4--myfa.netlify.com',
  'https://5e81e9e879dd5d0007d9de82--myfa.netlify.com',
  'https://5e835dafa6b7240007ebd136--myfa.netlify.com',
];

if (process.env.NODE_ENV === 'development') {
  whitelist.push('http://localhost:8000');
  whitelist.push('http://myfa.africa:8000');
}

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(`${origin} was blocked by CORS`);
    }
  }
}

const unless = (paths, middleware) => {
  return (req, res, next) => {
    if (paths.includes(req.path)) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

app.use(unless([
  '/stripe/confirm_payment',
], cors(corsOptions)));

app.use((req, res, next) => {
  if (req.originalUrl === '/stripe/confirm_payment') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:')) // Add Sentry

const run = () => {
  app.use(express.static('public'))

  app.post('/stripe/confirm_payment', bodyParser.raw({ type: 'application/json' }), confirmPayment)

  app.post('/newsletter/member', (req, res, next) => addContactToList(req, res, 'newsletter'))

  app.post('/dashboard/login', login)

  app.post('/users', saveUser)

  app.post('/users/login', loginUser)

  app.post('/users/facebook-login', loginFBUser)

  app.post('/users/google-login', loginGoogleUser)

  app.post('/users/email/confirm', confirmUserEmail)

  app.use(verifyJWT)

  app.post('/stripe/pay', createPayment);

  app.get('/baskets', findBasket)

  app.get('/users', fetchUser)

  app.put('/users', updateUserByEmail)

  app.post('/users/password/verify', verifyUserPassword)

  app.put('/users/password', updateUserPassword)

  app.get('/users/baskets', getBasketsByEmail)

  app.put('/users/delete', deleteUser)

  app.use(verifyAdminJWT)

  app.get('/baskets/count', countBaskets)

  app.get('/dashboard/kpis', fetchKPIs)

  app.get('/dashboard/goals', fetchGoals)

  app.put('/dashboard/goals', updateGoalById)

  app.get('/dashboard/users', getUsers)

  app.get('/dashboard/baskets', getBaskets)

  app.put('/dashboard/baskets', updateBasketById)

  app.get('/dashboard/finance/requests', getFinanceRequests)

  app.post('/dashboard/finance/requests', saveRequest)

  app.put('/dashboard/finance/requests', updateFinanceRequestById)

  app.delete('/dashboard/finance/requests', removeFinanceRequest)

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`))
}

db.once('open', run)
