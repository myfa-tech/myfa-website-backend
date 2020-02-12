import mongoose from 'mongoose';

import Recipient from './recipient';

const UserSchema = mongoose.Schema({
  // defualt id
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  password: String,
  createdAt: Date, // should be a timestamp
  bday: Date, // should be a timestamp
  country: String,
  FBAccess: Boolean,
  cgu: Boolean,
  recipients: [Recipient],
});

export default UserSchema;
