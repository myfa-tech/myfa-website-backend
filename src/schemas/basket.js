import mongoose from 'mongoose'

const Basket = mongoose.Schema({
	// default id
	orderRef: String,
	name: String,
	reason: String,
	userEmail: String,
	paid: Boolean,
	price: Number,
	avatar: String,
	dateCreated: Number,
})

export default Basket
