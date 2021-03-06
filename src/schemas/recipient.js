import mongoose from 'mongoose';

const RecipientSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  relation: String,
  otherRelation: String,
  address: String,
  email: String,
  country: String,
  zone: String,
  phone: String,
});

export default RecipientSchema;
