import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import RequestSchema from '../../../schemas/request';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const getUserRequests = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    const requestsModel = mongoose.model('requests', RequestSchema);

    const query = requestsModel.find({ 'user.email': userInfo.email }).sort({ createdAt: -1 });
    query.collection(requestsModel.collection);
    query.select({ password: 0 });

    const requests = await query.exec();

    res.status(200);
    res.json({ requests });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

export default getUserRequests;
