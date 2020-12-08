import mongoose from 'mongoose';
import shajs from 'sha.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import UserSchema from '../../schemas/user';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;

const signIn = async (req, res, next) => {
	try {
    const user = req.body;
		const usersModel = mongoose.model('users', UserSchema);

    const userExists = await usersModel.exists({ email: user.email });

    if (userExists) {
      res.status(409);
      res.send('user already exists');
      return;
    }

    user.password = shajs('sha256').update(user.password).digest('hex');
		user.createdAt = Date.now();
    user.emailConfirmed = false;

    await usersModel.create(user);

    console.log({ 'user created': user });

    delete user.password;

    let token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (NODE_ENV !== 'development') {
      let hash = shajs('sha256').update(user.firstname).digest('hex');
      let link = `https://www.myfa.fr/email_confirmation?${user.email}&${hash}`;

      if (!!user.newsletter) {
        await saveContact('newsletter', user.email);
        await saveContact('contact+NL', user.email, user.firstname, user.lastname, link);
      } else {
        await saveContact('contact+NoNL', user.email, user.firstname, user.lastname, link);
      }
    } else {
      console.log('NODE_ENV is development - welcome email not sent');
    }

    res.status(201);
    res.send({ user, token });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

export default signIn;
