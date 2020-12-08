import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { countBaskets, getBaskets, createOrderManually } from './services/baskets';
import { addContactToList } from './services/mailjet';
import { login } from './services/dashboardUsers';
import { fetchKPIs } from './services/kpis';
import {
  confirmUserEmail,
  deleteUser,
  fetchUser,
  getUsers,
  loginFBUser,
  loginGoogleUser,
  loginUser,
  saveUser,
  updateUserByEmail,
  updateUserPassword,
  verifyUserPassword,
  resetPassword,
  resetPasswordSendMagicLink
} from './services/users';
import { verifyAdminJWT, verifyJWT } from './utils/verifyJWT';
import { fetchGoals, updateGoalById } from './services/kpiGoals';
import { fetchArticles, fetchSingleArticle } from './services/contentful';
import { getJobFile } from './services/jobs';
import { findRatings, saveRating } from './services/ratings';
import { getRequests, saveRequest, updateRequest } from './services/requests';
import getUserDashboardKPIs from './services/user-dashboard/kpis/getUserDashboardKPIs'
import logIn from './services/user/logIn';
import signIn from './services/user/signIn';
import getUserRequests from './services/user-dashboard/requests/getUserRequests';

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
  '/jobs/stage_myfa_bizdev.pdf',
], cors(corsOptions)));

app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:')); // Add Sentry

const run = () => {
  app.use(express.static('public'));

  app.post('/newsletter/member', (req, res, next) => addContactToList(req, res, 'newsletter'));

  app.post('/dashboard/login', login);

  app.post('/users', signIn);

  app.post('/users/login', logIn);

  // app.post('/users/facebook-login', loginFBUser);

  // app.post('/users/google-login', loginGoogleUser);

  app.post('/users/email/confirm', confirmUserEmail);

  // app.post('/users/password/magic_link', resetPasswordSendMagicLink);

  // app.post('/users/password/reset', resetPassword);

  app.get('/ratings', findRatings);

  app.post('/ratings', saveRating);

  app.get('/blog/articles', fetchArticles);

  app.get('/blog/articles/:id', fetchSingleArticle);

  app.get('/jobs/:filename', getJobFile);

  app.post('/requests', saveRequest);

  app.put('/requests', updateRequest);

  app.use(verifyJWT);

  app.get('/users', fetchUser);

  app.put('/users', updateUserByEmail);

  app.get('/users/requests', getUserRequests);

  app.post('/users/password/verify', verifyUserPassword);

  app.put('/users/password', updateUserPassword);

  app.put('/users/delete', deleteUser);

  app.get('/user-dashboard/kpis', getUserDashboardKPIs);

  app.use(verifyAdminJWT);

  app.get('/dashboard/baskets/count', countBaskets);

  app.get('/dashboard/kpis', fetchKPIs);

  app.get('/dashboard/requests', getRequests);

  app.get('/dashboard/goals', fetchGoals);

  app.put('/dashboard/goals', updateGoalById);

  app.get('/dashboard/users', getUsers);

  app.post('/dashboard/orders/manually', createOrderManually);

  app.get('/dashboard/baskets', getBaskets);

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`));
};

db.once('open', run);
