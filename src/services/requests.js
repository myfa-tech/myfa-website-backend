
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { sendRequestConfirmationEmail } from '../services/mailjet';
import RequestSchema from '../schemas/request';
import { postNewRequestMessage } from './slack';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const getRequests = async (req, res, next) => {
  try {
    const httpQuery = req.query || {};
    let filter = {};

    const requestsModel = mongoose.model('requests', RequestSchema);

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

    const query = requestsModel.find(filter).sort({ createdAt: -1 });
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

const saveRequest = async (req, res, next) => {
  try {
    const request = req.body;
		const requestsModel = mongoose.model('requests', RequestSchema);

    request.createdAt = Date.now();
    request.status = 'pending';

    await requestsModel.create(request);

    const createdRequest = await requestsModel.findOne({ 'user.firstname': request.user.firstname, 'user.lastname': request.user.lastname });

    // if (NODE_ENV !== 'development') {
      // await sendRequestConfirmationEmail(request.user);
      // await postNewRequestMessage(request);
    // } else {
    //   console.log('NODE_ENV is development - request confirmed email not sent');
      await postNewRequestMessage(request, { test: true });
    // }

    console.log({ 'request created': createdRequest });

    res.status(201);
    res.send({ request: createdRequest });
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

    await requestsModel.updateOne({ _id: request._id }, request);

    res.status(201);
    res.send({ request });
  } catch (e) {
    console.log(e);
		throw new Error('something went wrong');
  }
};

export { getRequests, saveRequest, updateRequest };
