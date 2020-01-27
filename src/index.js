import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { confirmPayment, requestPayment } from './services/lydia'
import { findBasket, saveBasket, getBaskets, getBasketsByEmail, countBaskets } from './services/baskets'
import { saveMember as saveMemberOnMailchimp } from './services/mailchimp'
import { login } from './services/dashboardUsers'
import { fetchKPIs } from './services/kpis'
import { getUsers, saveUser, updateUserByEmail } from './services/users'
import verifyJWT from './utils/verifyJWT'

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

  app.post('/lydia/pay', async (req, res, next) => {
    await saveBasket(req)
    await requestPayment(req, res, next)
  })

  app.get('/baskets', findBasket)

  app.get('/baskets/count', countBaskets)

  app.get('/lydia/confirm', confirmPayment)

  app.post('/mailchimp', saveMemberOnMailchimp)

  app.post('/dashboard/login', login)

  app.post('/users', saveUser)

  app.use(verifyJWT)

  app.put('/users', updateUserByEmail)

  app.get('/users/baskets', getBasketsByEmail)

  app.get('/dashboard/kpis', fetchKPIs)

  app.get('/dashboard/users', getUsers)

  app.get('/dashboard/baskets', getBaskets)

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`))
}

db.once('open', run)
