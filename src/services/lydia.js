
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import basketSchema from '../schemas/basket'
import Lydia from '../utils/Lydia'

dotenv.config()

const VENDOR_TOKEN = process.env.VENDOR_TOKEN
const BACKEND_URL = 'https://myfa-website-backend.herokuapp.com/lydia';

const requestPayment = async (req, res, next) => {
	try {
		const lydia = new Lydia()
		let orderRef = req.body.order.ref;

		delete req.body.order;

		let payload = {
			...req.body,
			confirm_url: `${BACKEND_URL}/confirm_payment?order_ref=${orderRef}`,
			cancel_url: `${BACKEND_URL}/cancel_payment?order_ref=${orderRef}`,
			vendor_token: VENDOR_TOKEN,
		};

		const result = await lydia.requestPayment(payload);

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
			throw new Error('Missing order_ref');
		}

		let orderRef = req.query.order_ref

		const basketsModel = mongoose.model('baskets', basketSchema)
		const result = await basketsModel.updateMany({ orderRef }, { status: 'paid' })

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

const cancelPayment = async (req, res, next) => {
	try {
		if (!req.query.order_ref) {
			throw new Error()
		}

		let orderRef = req.query.order_ref

		const basketsModel = mongoose.model('baskets', basketSchema)
		const result = await basketsModel.updateMany({ orderRef }, { status: 'canceled' })

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

export { cancelPayment, confirmPayment, requestPayment }
