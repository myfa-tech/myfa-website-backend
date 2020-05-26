import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cron from 'node-cron';

import { confirmPayment } from './services/stripe'
import { countBaskets, findBaskets, saveBasketsFromOrder, getRamadanBaskets, getBaskets, getBasketsByEmail, updateBasketById, getHomeBaskets, getCustomBasket, getUserCart, updateBasketsByOrderRef, createOrderManually } from './services/baskets'
import { addContactToList } from './services/mailjet';
import { login } from './services/dashboardUsers'
import { fetchKPIs } from './services/kpis'
import { fetchStocks, updateStock } from './services/stocks'
import { confirmUserEmail, deleteUser, fetchUser, getUsers, loginFBUser, loginGoogleUser, loginUser, saveUser, updateUserByEmail, updateUserPassword, verifyUserPassword, resetPassword, resetPasswordSendMagicLink } from './services/users'
import { verifyAdminJWT, verifyJWT } from './utils/verifyJWT';
import { fetchGoals, updateGoalById } from './services/kpiGoals';
import { getFinanceRequests, removeFinanceRequest, saveRequest, updateFinanceRequestById } from './services/finance';
import { createPayment } from './services/stripe';
import { createMobileMoneyPayment } from './services/mobileMoney';
import { deleteCart, getCart, createCart, updateCart } from './services/cart';
import curateCartsAndSendReminders from './utils/curateCartsAndSendReminders';
import { fetchArticles, fetchSingleArticle } from './services/contentful';
import { getJobFile } from './services/jobs';

dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const whitelist = [
  'https://www.myfa.fr',
  'https://myfa.fr',
  'chrome-extension://jddpdjamaalalhlegkelkmckfhhiiijl',
  'chrome-extension://mbgaenpdobndgmhfbcomnghmlnfnhdcn',
  'https://myfa-staging.netlify.com',
  'https://myfa-staging.netlify.app',
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
  '/jobs/stage_myfa_bizdev.pdf',
], cors(corsOptions)));

app.use((req, res, next) => {
  if (req.originalUrl === '/stripe/confirm_payment') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:')); // Add Sentry

const run = () => {
  app.use(express.static('public'));

  app.post('/stripe/confirm_payment', bodyParser.raw({ type: 'application/json' }), confirmPayment);

  app.post('/newsletter/member', (req, res, next) => addContactToList(req, res, 'newsletter'));

  app.post('/dashboard/login', login);

  app.post('/users', saveUser);

  app.post('/users/login', loginUser);

  app.post('/users/facebook-login', loginFBUser);

  app.post('/users/google-login', loginGoogleUser);

  app.post('/users/email/confirm', confirmUserEmail);

  app.post('/users/password/magic_link', resetPasswordSendMagicLink);

  app.post('/users/password/reset', resetPassword);

  app.get('/ramadanbaskets/details', getRamadanBaskets);

  app.get('/baskets/details', getHomeBaskets);

  app.get('/baskets/custom-basket/details', getCustomBasket);

  app.get('/blog/articles', fetchArticles);

  app.get('/blog/articles/:id', fetchSingleArticle);

  app.get('/jobs/:filename', getJobFile);

  app.use(verifyJWT);

  app.post('/stripe/pay', createPayment);

  app.post('/mobile_money/orders', createMobileMoneyPayment);

  app.get('/baskets', findBaskets);

  app.get('/users', fetchUser);

  app.get('/cart', getCart);

  app.post('/cart', createCart);

  app.put('/cart', updateCart);

  app.delete('/cart', deleteCart);

  app.put('/users', updateUserByEmail);

  app.post('/users/password/verify', verifyUserPassword);

  app.put('/users/password', updateUserPassword);

  app.get('/users/baskets', getBasketsByEmail);

  app.put('/users/baskets', updateBasketsByOrderRef);

  app.put('/users/delete', deleteUser);

  app.use(verifyAdminJWT);

  app.get('/baskets/count', countBaskets);

  app.get('/dashboard/kpis', fetchKPIs);

  app.get('/dashboard/goals', fetchGoals);

  app.put('/dashboard/goals', updateGoalById);

  app.get('/dashboard/stocks', fetchStocks);

  app.put('/dashboard/stocks', updateStock);

  app.get('/dashboard/users', getUsers);

  app.post('/dashboard/orders/manually', createOrderManually);

  app.get('/dashboard/baskets', getBaskets);

  app.put('/dashboard/baskets', updateBasketById);

  app.get('/dashboard/finance/requests', getFinanceRequests);

  app.post('/dashboard/finance/requests', saveRequest);

  app.put('/dashboard/finance/requests', updateFinanceRequestById);

  app.delete('/dashboard/finance/requests', removeFinanceRequest);

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`));
};

db.once('open', run);

// CRON Tasks

// seconds minutes heures jours ...
cron.schedule('0 0 14 */2 * *', async () => {
  console.log('CRON task triggered at: ', new Date());
  await curateCartsAndSendReminders();
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});
