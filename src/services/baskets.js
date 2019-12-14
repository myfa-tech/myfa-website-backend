
import mongoose from 'mongoose'

import BasketSchema from '../schemas/basket'

const saveBasket = async (req) => {
	try {
    const { basket } = req.body
		const basketsModel = mongoose.model('baskets', BasketSchema)

    basket.paid = false
		basket.createdAt = Date.now()

		await basketsModel.create(basket)
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

const findBasket = async (req, res, next) => {
  try {
    if (!req.query.ref) {
      res.status(400)
      res.send('missing param')
    }

    const orderRef = req.query.ref
		const basketsModel = mongoose.model('baskets', BasketSchema)

    const basket = await basketsModel.findOne({ orderRef }, basketsModel)
    
    if (basket) {
      res.status(200)
      res.json({ basket })
    } else {
      res.status(404)
      res.send('not found')
    }
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

export { findBasket, saveBasket }
