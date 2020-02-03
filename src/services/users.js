import mongoose from 'mongoose';
import shajs from 'sha.js';
import jwt from 'jsonwebtoken';

import UserSchema from '../schemas/user';
import BasketSchema from '../schemas/basket';

const JWT_SECRET = process.env.JWT_SECRET

const getUsers = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);
    const promises = [];

    if (!userInfo.admin) {
      res.status(401);
      res.send('forbidden');
      return;
    }

    const usersModel = mongoose.model('users', UserSchema);
    const basketsModel = mongoose.model('baskets', BasketSchema);

    const query = usersModel.find();
    query.collection(usersModel.collection);
    query.select({ password: 0 });

    const users = await query.exec();

    users.forEach(user => {
      promises.push(basketsModel.countDocuments({ userEmail: user.email }));
    });

    const counts = await Promise.all(promises);

    const enhancedUsers = users.map((user, index) => ({
      ...user._doc,
      qtyPaidBaskets: counts[index],
    }));

    if (!!enhancedUsers) {
      res.status(200);
      res.json({ users: enhancedUsers });
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
		console.log(e);
		throw new Error('something went wrong');
	}
}

const loginUser = async (req, res, next) => {
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
}

const updateUserByEmail = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);
    const email = req.body.email || '';
    let token = (req.headers.authorization || '').split(' ')[1];
    if (!token) {
      res.status(401);
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

const updateUserPassword = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);
    const email = req.body.email || '';
    let password = req.body.password || '';
    let token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      res.status(401);
      res.send('forbidden');
    }

    password = shajs('sha256').update(password).digest('hex');

    let userInfo = jwt.verify(token, JWT_SECRET);

    if (userInfo.email === email || userInfo.admin) {
      await usersModel.updateOne({ email }, { password });
      res.status(201);
      res.send({ updated: { email, password }});
    } else {
      console.log('forbidden token');
      res.status(401);
      res.send('forbidden');
    }
	} catch (e) {
		console.log(e);
		res.status(500);
    res.send('something went wrong');
	}
}

const verifyUserPassword = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);
    const email = req.body.email || '';
    let password = req.body.password || '';
    let token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      res.status(401);
      res.send('forbidden');
    }

    let userInfo = jwt.verify(token, JWT_SECRET);

    if (userInfo.email !== email && !userInfo.admin) {
      res.status(401);
      res.send('forbidden');
    }

    password = shajs('sha256').update(password).digest('hex');

    const user = await usersModel.findOne({ email, password });

    if (!!user) {
      res.status(200);
      res.send({ success: true });
    } else {
      res.status(404);
      res.send('user not found');
    }
	} catch (e) {
		console.log(e);
		res.status(500);
    res.send('something went wrong');
	}
}

export { getUsers, loginUser, saveUser, updateUserByEmail, updateUserPassword, verifyUserPassword };