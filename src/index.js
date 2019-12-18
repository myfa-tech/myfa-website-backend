import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { confirmPayment, requestPayment } from './services/lydia'
import { findBasket, saveBasket } from './services/baskets'
import { saveMember as saveMemberOnMailchimp } from './services/mailchimp'

dotenv.config()

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

var whitelist = [
  'http://localhost:8000',
  'https://www.myfa.fr',
  'https://myfa.fr',
  'https://5dfa6324ed9aea0008a28ebb--compassionate-varahamihira-d667c0.netlify.com',
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

  app.get('/lydia/confirm', confirmPayment)

  app.post('/mailchimp', saveMemberOnMailchimp)

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`))
}

db.once('open', run)
