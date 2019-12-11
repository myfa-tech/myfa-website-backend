import express from 'express'
import cors from 'cors'

import { requestPayment } from './services/lydia'
import { saveMember as saveMemberOnMailchimp } from './services/mailchimp'
const PORT = process.env.PORT || 8080

const app = express()

var whitelist = ['http://localhost:3000', 'https://www.myfa.fr', 'https://myfa.fr']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback('Not allowed by CORS')
    }
  }
}

app.use(cors(corsOptions))

app.use(express.json())

const run = () => {
  app.use(express.static('public'))

  app.post('/lydia/pay', requestPayment)

  app.post('/mailchimp', saveMemberOnMailchimp)

  app.listen(PORT, () => console.log(`Magic is happening on port ${PORT}`))
}

run()
