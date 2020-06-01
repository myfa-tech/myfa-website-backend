import mongoose from 'mongoose';
import shajs from 'sha.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Facebook } from 'fb';

import { sendEmailAddressConfirmationEmail, sendWelcomeEmail, sendResetPasswordEmail, saveContact } from './mailjet';
import {
  getFirstDayOfCurrentMonth,
  getLastDayOfCurrentMonth,
  getMondayOfCurrentWeek,
  getSundayOfCurrentWeek,
} from '../utils/dates';
import exploitMagicLink from '../utils/exploitMagicLink';
import verifyMagicLink from '../utils/verifyMagicLink';

import UserSchema from '../schemas/user';
import BasketSchema from '../schemas/basket';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const FB_APP_ID = process.env.FB_APP_ID;
const NODE_ENV = process.env.NODE_ENV;

const FB = new Facebook({ appId: FB_APP_ID, appSecret: FB_APP_SECRET, version: 'v2.4' });

const fetchUser = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo) {
      res.status(404);
      res.send('user not found');
      return;
    }

    const usersModel = mongoose.model('users', UserSchema);
    const user = await usersModel.findOne({ email: userInfo.email });

    res.status(200);
    res.send(user);
  } catch(e) {
    console.log(e);
    res.status(500);
    res.send('something went wrong');
  }
};

const getUsers = async (req, res, next) => {
  try {
    const promises = [];
    const httpQuery = req.query || {};
    let filter = {};

    const usersModel = mongoose.model('users', UserSchema);
    const basketsModel = mongoose.model('baskets', BasketSchema);

    if (httpQuery.time_filter === 'month') {
      const monthFirstDay = getFirstDayOfCurrentMonth(new Date());
      const monthLastDay = getLastDayOfCurrentMonth(new Date());

      filter.createdAt = { $gte: monthFirstDay, $lte: monthLastDay };
    } else if (httpQuery.time_filter === 'week') {
      const weekMonday = getMondayOfCurrentWeek(new Date());
      const weekSunday = getSundayOfCurrentWeek(new Date());

      filter.createdAt = { $gte: weekMonday, $lte: weekSunday };
    } else if (httpQuery.time_filter === 'today') {
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const tomorrow = new Date(new Date(today).setDate(new Date().getDate() + 1));

      filter.createdAt = { $gte: today, $lte: tomorrow };
    } else if (!!httpQuery.time_filter) {
      res.status(400);
      res.send('wrong param');
      return;
    }

    const query = usersModel.find(filter).sort({ createdAt: -1 });
    query.collection(usersModel.collection);
    query.select({ password: 0 });

    const users = await query.exec();

    users.forEach(user => {
      promises.push(basketsModel.countDocuments({
        $and: [
          { $or: [ { userEmail: user.email }, { 'user.email': user.email }]},
          { status: { $in: ['paid', 'preparing', 'delivered'] }},
        ]
      }));
    });

    const counts = await Promise.all(promises);

    const enhancedUsers = users.map((user, index) => ({
      ...user._doc,
      qtyPaidBaskets: counts[index],
    }));

    res.status(200);
    res.json({ users: enhancedUsers });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const deleteUser = async (req, res, next) => {
  try {
    const usersModel = mongoose.model('users', UserSchema);
    const userEmail = req.body.email;

    let token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      res.status(401);
      res.send('forbidden');
      return;
    }

    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo) {
      res.status(404);
      res.send('user not found');
      return;
    } else if (userEmail !== userInfo.email) {
      res.status(401);
      res.send('forbidden');
      return;
    }

    await usersModel.deleteOne({ email: userInfo.email });

    res.status(200);
    res.send('success');
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('something went wrong');
  }
};

const getUserByEmail = async (email) => {
  try {
    const usersModel = mongoose.model('users', UserSchema);
    const user = await usersModel.findOne({ email });

    return user;
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const confirmUserEmail = async (req, res, next) => {
  const { email, hash } = req.body;
  const usersModel = mongoose.model('users', UserSchema);

  try {
    const user = await getUserByEmail(email);
    user.hash = shajs('sha256').update(user.firstname).digest('hex');

    if (hash === user.hash) {
      await usersModel.updateOne({ email }, { emailConfirmed: true });
      res.status(200);
      res.send('email confirmed');
    } else {
      res.status(404);
      res.send('wrong infos');
    }
  } catch(e) {

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
    user.emailConfirmed = false;

    await usersModel.create(user);

    console.log({ 'user created': user });

    delete user.password;

    let token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (NODE_ENV !== 'development') {
      if (!!user.newsletter) {
        await saveContact('newsletter', user.email);
      }

      sendWelcomeEmail(user);
      sendEmailAddressConfirmationEmail(user);
    } else {
      console.log('NODE_ENV is development - welcome email not sent');
    }

    res.status(201);
    res.send({ user, token });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
}

const createFBUser = async (creds) => {
  const user = { ...creds };
  const usersModel = mongoose.model('users', UserSchema);

  user.createdAt = Date.now();
  user.FBAccess = true;
  user.emailConfirmed = true;

  await usersModel.create(user);

  console.log({ 'user created': user });

  sendWelcomeEmail(user);

  return user;
};

const createGoogleUser = async (creds) => {
  const user = { ...creds };
  const usersModel = mongoose.model('users', UserSchema);

  user.createdAt = Date.now();
  user.GoogleAccess = true;
  user.emailConfirmed = true;

  await usersModel.create(user);

  console.log({ 'user created': user });

  sendWelcomeEmail(user);

  return user;
};

const verifyFBUser = async (creds) => {
  try {
    if (!!creds.fbToken) {
      const res = await FB.api('me', { fields: 'id, name', access_token: creds.fbToken });
      return (!!res.name);
    } else {
      throw new Error('missing FB token');
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

const verifyGoogleUser = async (creds) => {
  try {
    if (!!creds.googleToken) {
      // @TODO: maybe verify a bit more...
      return true;
    } else {
      throw new Error('missing Google token');
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

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

const loginFBUser = async (req, res, next) => {
  try {
    const creds = req.body;
    const userModel = mongoose.model('users', UserSchema);

    if (!creds.email) {
      res.status(400);
      res.send('missing field(s)');
      return;
    }

    let isFBUserSafe = await verifyFBUser(creds);

    if (!isFBUserSafe) {
      res.status(400);
      res.send('wrong FB login');
      return;
    }

    let token = jwt.sign({ email: creds.email }, JWT_SECRET);

    let user = await userModel.findOne({ email: creds.email });

    if (!!user) {
      delete user.password;
    } else {
      user = await createFBUser(creds);
    }

    res.status(200);
    res.send({ user, token });
  } catch (e) {
    console.log(e);
		throw new Error('something went wrong');
  }
};

const loginGoogleUser = async (req, res, next) => {
  try {
    const creds = req.body;
    const userModel = mongoose.model('users', UserSchema);

    if (!creds.email) {
      res.status(400);
      res.send('missing field(s)');
      return;
    }

    let isGoogleUserSafe = await verifyGoogleUser(creds);

    if (!isGoogleUserSafe) {
      res.status(400);
      res.send('wrong Google login');
      return;
    }

    let token = jwt.sign({ email: creds.email }, JWT_SECRET);

    let user = await userModel.findOne({ email: creds.email });

    if (!!user) {
      delete user.password;
    } else {
      user = await createGoogleUser(creds);
    }

    res.status(200);
    res.send({ user, token });
  } catch (e) {
    console.log(e);
		throw new Error('something went wrong');
  }
};

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
      const userUpdated = await usersModel.findOne({ email });
      res.status(201);
      res.send({ updated: userUpdated });
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

const resetPasswordSendMagicLink = async (req, res, next) => {
  try {
    const usersModel = mongoose.model('users', UserSchema);

    if (!req.body.email || !req.body.host) {
      res.status(400);
      res.send('missing param');
      return;
    }

    const user = await usersModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      res.send('user not found');
      return;
    }

    if (NODE_ENV !== 'development') {
      await sendResetPasswordEmail(req.body.host, user);
    } else {
      console.log('NODE_ENV is development - magic link email not sent');
    }

    res.status(200);
    res.send({ success: true });
  } catch(e) {
    console.log(e);
    res.status(500);
    res.send('something went wrong');
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { url, newPassword } = req.body;
    const usersModel = mongoose.model('users', UserSchema);

    if (!url || !newPassword) {
      res.status(400);
      res.send('missing param');
      return;
    }

    const { email, magicLink } = exploitMagicLink(url);

    const user = await usersModel.findOne({ email });

    if (!user) {
      res.status(404);
      res.send('wrong email');
      return;
    }

    if (!verifyMagicLink(user, magicLink)) {
      res.status(400);
      res.send('wrong params');
      return;
    }

    let password = shajs('sha256').update(newPassword).digest('hex');

    await usersModel.updateOne({ email }, { password });

    res.status(201);
    res.send({ updated: { email }});
  } catch(e) {
    res.status(500);
    res.send('something went wrong');
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
		const usersModel = mongoose.model('users', UserSchema);
    const email = req.body.email || '';
    let password = req.body.password || '';
    let token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      res.status(401);
      res.send('forbidden');
      return;
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
      return;
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

export {
  confirmUserEmail,
  deleteUser,
  fetchUser,
  getUserByEmail,
  getUsers,
  loginFBUser,
  loginGoogleUser,
  loginUser,
  saveUser,
  updateUserByEmail,
  updateUserPassword,
  verifyUserPassword,
  resetPassword,
  resetPasswordSendMagicLink,
};
