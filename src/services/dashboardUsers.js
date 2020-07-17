import mongoose from 'mongoose';
import shajs from 'sha.js';
import jwt from 'jsonwebtoken';

import UserSchema from '../schemas/dashboardUser';

const JWT_SECRET = process.env.JWT_SECRET

const getUserByEmail = async (req, res, next) => {
  try {
    if (!req.query.email) {
      res.status(400);
      res.send('missing param');
    }

    const { email } = req.query;
		const usersModel = mongoose.model('dashboardusers', UserSchema);

    const user = await usersModel.findOne({ email }, usersModel);

    if (!!user) {
      res.status(200);
      res.json({ user });
    } else {
      res.status(404);
      res.send('not found');
    }
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const fetchUserByEmail = async (email) => {
  try {
		const usersModel = mongoose.model('dashboardusers', UserSchema);

    const user = await usersModel.findOne({ email }, usersModel);

    return user;
	} catch (e) {
    console.log(e);
    return null;
	}
};

const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400);
      res.send('missing param');
    }

    const { email } = req.body;
    const password = shajs('sha256').update(req.body.password).digest('hex');

    const usersModel = mongoose.model('dashboardusers', UserSchema);

    const user = await usersModel.findOne({ email, password }, usersModel);

    if (!!user) {
      delete user.password;

      let token = jwt.sign({ email, admin: true }, JWT_SECRET);

      res.status(200);
      res.json({ user, token });
    } else {
      res.status(404);
      res.send('wrong creds');
    }
  } catch (e) {
    console.log(e);
    throw new Error('something went wrong');
  }
}

export { fetchUserByEmail, getUserByEmail, login };
