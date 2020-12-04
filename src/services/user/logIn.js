import mongoose from 'mongoose';
import shajs from 'sha.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import UserSchema from '../../schemas/user';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const logIn = async (req, res, next) => {
  try {
    const creds = req.body;
    const userModel = mongoose.model('users', UserSchema);

    if (!creds.email || !creds.password) {
      res.status(400);
      res.send('missing field(s)');
      return;
    }

    creds.password = shajs('sha256').update(creds.password).digest('hex');

    const user = await userModel.findOne({ email: creds.email, password: creds.password });

    if (!!user) {
      let token = jwt.sign({ email: user.email }, JWT_SECRET);

      delete user.password;

      res.status(200);
      res.send({ user, token });
    } else {
      res.status(404);
      res.send('wrong email or password');
    }
  } catch (e) {
    console.log(e);
		throw new Error('something went wrong');
  }
};

export default logIn;
