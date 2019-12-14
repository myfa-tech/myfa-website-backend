
import mongoose from 'mongoose'

import basketSchema from '../schemas/basket'
import Lydia from '../utils/Lydia'

const requestPayment = async (req, res, next) => {
	try {
		const lydia = new Lydia()

		delete req.body.basket
		
		const result = await lydia.requestPayment(req.body)

		res.status(200)
		res.json(result.data)
	} catch (e) {
		console.log(e)
		res.status(400)
		res.json({ error: 'something went wrong' })
	}
}

const confirmPayment = async (req, res, next) => {
	try {
		if (!req.query.order_ref) {
			throw new Error()
		}

		let orderRef = req.query.order_ref

		const basketsModel = mongoose.model('baskets', basketSchema)
		const result = await basketsModel.updateOne({ orderRef }, { paid: true })
		
		console.log(`${result.n} matched - ${result.nModified} modified.`)

		if (result.nModified) {
			res.status(201)
			res.send('Document updated')
		} else {
			res.status(204)
			res.send('Document not updated')
		}
	} catch (e) {
		console.log(e)
		res.status(500)
		res.send('Something went wrong while trying to update document')
	}
}

export { confirmPayment, requestPayment }
