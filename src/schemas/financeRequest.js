import mongoose from 'mongoose';

const FinanceRequest = mongoose.Schema({
	// default id
  label: String,
  price: String,
  userEmail: String,
  createdAt: Date,
  comment: String,
  status: String,
});

export default FinanceRequest;
