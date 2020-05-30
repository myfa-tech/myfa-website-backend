
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { saveBasketsFromOrder } from './baskets';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const createMobileMoneyPayment = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);
    const { order, user } = req.body;

    if (userInfo.email !== user.email) {
      res.status(401);
      res.send('Wrong token');
      return;
    }

    await saveBasketsFromOrder(order, user);

    res.status(201);
    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('something wrong happened');
  }
};

export { createMobileMoneyPayment };
