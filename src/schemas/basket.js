import mongoose from 'mongoose'

const Basket = mongoose.Schema({
	// default id
	orderRef: String,
	name: String,
	reason: String,
	userEmail: String,
	paid: Boolean,
	recipientPhone: String,
	price: Number,
	avatar: String,
	createdAt: Number,
})

export default Basket
