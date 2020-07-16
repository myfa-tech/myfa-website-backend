import mongoose from 'mongoose';

import Recipient from './recipient';
import Basket from './basket';
import Product from './product';

const Cart = mongoose.Schema({
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
	baskets: [Basket],
	products: [Product],
	createdAt: Date,
});

export default Cart;
