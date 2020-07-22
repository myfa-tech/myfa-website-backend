
import mongoose from 'mongoose';

const Basket = mongoose.Schema({
	// default id
	name: String,
  labelTranslate: String,
  category: String,
  imgAlt: String,
  qty: Number,
  bestseller: Boolean,
  price: Number,
  priceCFA: Number,
});

export default Basket;