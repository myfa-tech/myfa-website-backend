
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import RequestSchema from '../schemas/request';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const saveRequest = async (req, res, next) => {
  try {
    const request = req.body;
		const requestsModel = mongoose.model('requests', RequestSchema);

		request.createdAt = Date.now();

    await requestsModel.create(request);

    console.log({ 'request created': request });

    if (NODE_ENV !== 'development') {
      await saveContact('new-request', request.user.email);
    } else {
      console.log('NODE_ENV is development - request confirmed email not sent');
    }

    res.status(201);
    res.send({ request });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const updateRequest = async (req, res, next) => {
  try {
    const request = req.body;
		const requestsModel = mongoose.model('requests', RequestSchema);

		request.createdAt = Date.now();

    console.log({ 'request updated': request });

    await requestsModel.updateOne({ id: request.id }, request);

    res.status(201);
    res.send({ request });
  } catch (e) {
    console.log(e);
		throw new Error('something went wrong');
  }
};

export { saveRequest, updateRequest };
