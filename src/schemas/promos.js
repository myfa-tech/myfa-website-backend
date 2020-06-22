import mongoose from 'mongoose';

const Promo = mongoose.Schema({
	// default id
	code: String,
	used: Boolean,
});

export default Promo;
