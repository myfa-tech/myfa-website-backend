import mongoose from 'mongoose';

import Recipient from './recipient';

const UserKPIs = mongoose.Schema({
  // default id
  spent: Number,
  services: {
    relatives: Number,
    self: Number,
  },
});

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
  wallet: Number,
  GoogleAccess: Boolean,
  kpis: UserKPIs,
  newsletter: Boolean,
  cgu: Boolean,
  emailConfirmed: Boolean,
  recipients: [Recipient],
});

export default UserSchema;
