import mongoose from 'mongoose';

import Recipient from './recipient';
import Basket from './basket';
import Product from './product';

const Products = mongoose.Schema({
	items: [Product],
	recipient: Recipient,
	message: String,
});

const Cart = mongoose.Schema({
	// default id
	orderRef: String,
	name: String,
	reason: String,
	count: String,
	userEmail: String,
	type: String,
	status: String,
	price: Number,
	baskets: [Basket],
	products: Products,
	createdAt: Date,
});

export default Cart;
