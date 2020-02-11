import mongoose from 'mongoose';

import Recipient from './recipient';

const Basket = mongoose.Schema({
	// default id
	orderRef: String,
	name: String,
	reason: String,
	count: String,
	userEmail: String,
	type: String,
	status: String,
	recipient: Recipient,
	price: Number,
	avatar: String,
	zone: String,
	items: Object,
	createdAt: Date,
	deliveredAt: Date,
});

export default Basket;
