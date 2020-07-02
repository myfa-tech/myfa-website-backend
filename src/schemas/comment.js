import mongoose from 'mongoose';

import ReducedUser from './reduceduser';

const Comment = mongoose.Schema({
	// default id
	user: ReducedUser,
  createdAt: Date,
  rating: Number,
  text: String,
});

export default Comment;
