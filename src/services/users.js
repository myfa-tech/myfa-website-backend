import mongoose from 'mongoose';

import UserSchema from '../schemas/user';

const getUsers = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);

    const users = await usersModel.find({}, usersModel);

    if (!!users) {
      res.status(200);
      res.json({ users });
    } else {
      res.status(404);
      res.send('not found');
    }
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

export { getUsers };
