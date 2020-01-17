import mongoose from 'mongoose';

import UserSchema from '../schemas/user';

const getUsers = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);

    const query = usersModel.find();
    query.collection(usersModel.collection);
    query.select({ password: 0 });

    const users = await query.exec();

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
