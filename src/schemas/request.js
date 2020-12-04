import mongoose from 'mongoose';

const User = mongoose.Schema({
	// default id
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
});

const Request = mongoose.Schema({
	// default id
  user: User,
  status: String,
  createdAt: Date,
  type: String,
  price: Number,
  details: String,
  contact: User,
});

export default Request;
