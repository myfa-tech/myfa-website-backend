import mongoose from 'mongoose'

import Recipient from './recipient';

const Basket = mongoose.Schema({
	// default id
	orderRef: String,
	name: String,
	reason: String,
	count: String,
	userEmail: String,
	status: String,
	recipient: Recipient,
	price: Number,
	avatar: String,
	zone: String,
	createdAt: Number,
})

export default Basket
