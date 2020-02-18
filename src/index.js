import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { cancelPayment, confirmPayment, requestPayment } from './services/lydia'
import { countBaskets, findBasket, saveBasketsFromOrder, getBaskets, getBasketsByEmail, updateBasketById } from './services/baskets'
import { addContactToList } from './services/mailjet';
import { login } from './services/dashboardUsers'
import { fetchKPIs } from './services/kpis'
import { deleteUser, getUsers, loginFBUser, loginGoogleUser, loginUser, saveUser, updateUserByEmail, updateUserPassword, verifyUserPassword } from './services/users'
import { verifyAdminJWT, verifyJWT } from './utils/verifyJWT'

dotenv.config()

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

const whitelist = [
  'https://www.myfa.fr',
  'https://myfa.fr',
  'chrome-extension://jddpdjamaalalhlegkelkmckfhhiiijl',
  'chrome-extension://mbgaenpdobndgmhfbcomnghmlnfnhdcn',
  'https://5e43b7b9798dfd000a9f6501--myfa.netlify.com',
  'https://5e43efaf96c6180007ef8f60--myfa.netlify.com',
  'https://5e44308a8a8a1e000879730c--myfa.netlify.com',
  'https://5e451908774de80007aa5300--myfa.netlify.com',
  'https://5e452a1482a0a5000b5413c4--myfa.netlify.com',
  'https://5e45711fe4418a000807fba8--myfa.netlify.com',
  'https://5e45829664439b0008916534--myfa.netlify.com',
  'https://5e458a94c89e210008ac8c51--myfa.netlify.com',
  'https://5e47b8b43fad81000818746f--myfa.netlify.com',
  'https://5e47d826c7c7ec000814e64d--myfa.netlify.com',
  'https://5e4c0c147f94030008a9d3b1--myfa.netlify.com',
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

app.use(express.json())
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:')) // Add Sentry

app.use(unless([
  '/lydia/confirm_payment_xx',
  '/lydia/cancel_payment_xx',
], cors(corsOptions)));

const run = () => {
  app.use(express.static('public'))

  app.post('/lydia/confirm_payment_xx', confirmPayment)

  app.post('/lydia/cancel_payment_xx', cancelPayment)

  app.post('/newsletter/member', (req, res, next) => addContactToList(req, res, 'newsletter'))

  app.post('/dashboard/login', login)

  app.post('/users', saveUser)

  app.post('/users/login', loginUser)

  app.post('/users/facebook-login', loginFBUser)

  app.post('/users/google-login', loginGoogleUser)

  app.use(verifyJWT)

  app.post('/lydia/pay', async (req, res, next) => {
    await saveBasketsFromOrder(req)
    await requestPayment(req, res, next)
  })

  app.get('/baskets', findBasket)

  app.put('/users', updateUserByEmail)

  app.post('/users/password/verify', verifyUserPassword)

  app.put('/users/password', updateUserPassword)

  app.get('/users/baskets', getBasketsByEmail)

  app.put('/users/delete', deleteUser)

  app.use(verifyAdminJWT)

  app.get('/baskets/count', countBaskets)

  app.get('/dashboard/kpis', fetchKPIs)

  app.get('/dashboard/users', getUsers)

  app.get('/dashboard/baskets', getBaskets)

  app.put('/dashboard/baskets', updateBasketById)

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`))
}

db.once('open', run)
