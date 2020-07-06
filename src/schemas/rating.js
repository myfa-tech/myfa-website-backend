import mongoose from 'mongoose';

import ReducedUser from './reduceduser';

const Rating = mongoose.Schema({
	// default id
	user: ReducedUser,
  createdAt: Date,
  rating: Number,
  comment: String,
  subject: String,
});

export default Rating;
