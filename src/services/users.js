import mongoose from 'mongoose';
import shajs from 'sha.js';
import jwt from 'jsonwebtoken';

import UserSchema from '../schemas/user';

const JWT_SECRET = process.env.JWT_SECRET

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

const saveUser = async (req, res, next) => {
	try {
    const user = req.body;
		const usersModel = mongoose.model('users', UserSchema);

    const userExists = await usersModel.exists({ email: user.email });

    if (userExists) {
      res.status(409);
      res.send('user already exists');
      return;
    }

    user.password = shajs('sha256').update(user.password).digest('hex')
		user.createdAt = Date.now();

    await usersModel.create(user);

    console.log({ 'user created': user });

    delete user.password;

    let token = jwt.sign({ email: user.email }, JWT_SECRET);

    res.status(201);
    res.send({ user, token });
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

const updateUserByEmail = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);
    const email = req.body.email || '';
    let token = (req.headers.authorization || '').split(' ')[1];
    if (!token) {
      res.status(403);
      res.send('forbidden');
    }

    let userInfo = jwt.verify(token, JWT_SECRET);

    if (userInfo.email === email || userInfo.admin) {
      await usersModel.updateOne({ email }, req.body);
      res.status(201);
      res.send({ updated: req.body });
    } else {
      console.log('forbidden token');
      res.status(403);
      res.send('forbidden');
    }
	} catch (e) {
		console.log(e);
		res.status(500);
    res.send('something went wrong');
	}
}

export { getUsers, saveUser, updateUserByEmail };
