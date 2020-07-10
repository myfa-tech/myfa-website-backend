import mongoose from 'mongoose';

import Recipient from './recipient';
import ReducedUser from './reduceduser';

const BasketItem = mongoose.Schema({
	// default id
	label: String,
	qty: Number,
});

const Basket = mongoose.Schema({
	// default id
	orderRef: String,
	category: String,
	name: String,
	reason: String,
	count: String,
	userEmail: String,
	user: ReducedUser,
	type: String,
	category: String,
	status: String,
	recipient: Recipient,
	price: Number,
	priceCFA: Number,
	label: String,
	avatar: String,
	zone: String,
	itemsTranslate: [BasketItem],
	createdAt: Date,
	deliveredAt: { type: String, default: ' ' },
	stripeIntentId: String,
	message: { type: String, default: ' ' },
	comment: { type: String, default: ' ' },
});

export default Basket;
