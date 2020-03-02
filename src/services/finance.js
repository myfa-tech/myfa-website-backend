import mongoose from 'mongoose';
import dotenv from 'dotenv';

import FinanceRequestSchema from '../schemas/financeRequest';
import { sendEmailToFinance } from './mailjet';

dotenv.config();

const getFinanceRequests = async (req, res, next) => {
  try {
		const financeRequestsModel = mongoose.model('finance-requests', FinanceRequestSchema);
    const requests = await financeRequestsModel.find({}, financeRequestsModel);

    res.status(200);
    res.json({ requests });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const updateFinanceRequestById = async (req, res, next) => {
  try {
    const financeRequestsModel = mongoose.model('finance-requests', FinanceRequestSchema);
    const { id } = req.query;

    if (!id) {
      res.status(400);
      res.json('missing id field in query');
      return;
    }

    await financeRequestsModel.updateOne({ _id: id }, req.body);

    if (req.body.status === 'pinged' && process.env.NODE_ENV !== 'development') {
      sendEmailToFinance();
    }

    res.status(201);
    res.send('request updated');
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: 'something failed on our side' });
  }
};

const saveRequest = async (req, res, next) => {
  try {
    const request = req.body;
		const financeRequestsModel = mongoose.model('finance-requests', FinanceRequestSchema);

    request.createdAt = Date.now();
    request.status = 'pending';

    if (!request.comment) {
      request.comment = '';
    }

    await financeRequestsModel.create(request);

    if (process.env.NODE_ENV !== 'development') {
      sendEmailToFinance();
    } else {
      console.log('NODE_ENV is development - email to finance not sent');
    }

    res.status(201);
    res.send({ request });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const removeFinanceRequest = async (req, res, next) => {
  try {
    const financeRequestsModel = mongoose.model('finance-requests', FinanceRequestSchema);
    const { id } = req.query;

    if (!id) {
      res.status(400);
      res.json('missing id field in query');
      return;
    }

    await financeRequestsModel.deleteOne({ _id: id });

    res.status(204);
    res.send('request deleted');
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: 'something failed on our side' });
  }
};

export { getFinanceRequests, removeFinanceRequest, saveRequest, updateFinanceRequestById };
