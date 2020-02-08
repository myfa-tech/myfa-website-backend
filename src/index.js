import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { confirmPayment, requestPayment } from './services/lydia'
import { findBasket, saveBasketsFromOrder, getBaskets, getBasketsByEmail, countBaskets } from './services/baskets'
import { saveMember as saveMemberOnMailchimp } from './services/mailchimp'
import { login } from './services/dashboardUsers'
import { fetchKPIs } from './services/kpis'
import { getUsers, loginUser, saveUser, updateUserByEmail, updateUserPassword, verifyUserPassword } from './services/users'
import { verifyAdminJWT, verifyJWT } from './utils/verifyJWT'

dotenv.config()

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

var whitelist = [
  'http://localhost:8000',
  'https://www.myfa.fr',
  'https://myfa.fr',
  'https://5e01bf4592a2100007bfb71d--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e258e3b02b1b6000c4e8718--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e2835038fdcd800080eed79--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e29cad38ea070000ab41718--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e2f20b3938ba3000c04754e--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e32aa3b83cd120008e07f50--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e32b84ddae0a1000855589f--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3454d014dbe800088cdd0d--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e36c14af3a2520009634276--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e394f7911c1fe0008f0608e--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e399df91dfec00009a137ac--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3a8f87c35f380008e2590b--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3bfe6fe3f7ae000836d73a--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3c4f0fbf1296000845ba79--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3c526c5bb1a50009a0725e--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3e9a8a2cc1ae00070300ed--compassionate-varahamihira-d667c0.netlify.com',
  'https://5e3eb106ef3b03000aae18df--compassionate-varahamihira-d667c0.netlify.com',
]

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(`${origin} was blocked by CORS`)
    }
  }
}

app.use(cors(corsOptions))

app.use(express.json())
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:')) // Add Sentry

const run = () => {
  app.use(express.static('public'))

  app.get('/lydia/confirm', confirmPayment)

  app.post('/mailchimp', saveMemberOnMailchimp)

  app.post('/dashboard/login', login)

  app.post('/users', saveUser)

  app.post('/users/login', loginUser)

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

  app.use(verifyAdminJWT)

  app.get('/baskets/count', countBaskets)

  app.get('/dashboard/kpis', fetchKPIs)

  app.get('/dashboard/users', getUsers)

  app.get('/dashboard/baskets', getBaskets)

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`))
}

db.once('open', run)
