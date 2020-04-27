import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  // defualt id
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  country: String,
});

export default UserSchema;
