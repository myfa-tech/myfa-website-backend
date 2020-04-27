import mongoose from 'mongoose';

import Recipient from './recipient';
import ReducedUser from './reduceduser';

const Basket = mongoose.Schema({
	// default id
	orderRef: String,
	name: String,
	reason: String,
	count: String,
	userEmail: String,
	user: ReducedUser,
	type: String,
	status: String,
	recipient: Recipient,
	price: Number,
	priceCFA: Number,
	label: String,
	avatar: String,
	zone: String,
	items: Object,
	createdAt: Date,
	deliveredAt: { type: String, default: ' ' },
	stripeIntentId: String,
	message: { type: String, default: ' ' },
	comment: { type: String, default: ' ' },
});

export default Basket;
