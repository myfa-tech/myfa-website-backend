import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  // defualt id
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  password: String,
  createdAt: Date, // should be a timestamp
  bday: Date, // should be a timestamp
  countryCode: String,
});

export default UserSchema;
