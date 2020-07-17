
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { fetchUserByEmail } from '../services/dashboardUsers';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    console.log(e);
    res.status(401);
    res.end('wrong token');
  }
}

const verifyAdminJWT = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    let user = await fetchUserByEmail(userInfo.email);

    if (!userInfo.admin || !user || !Object.keys(user).length) {
      throw new Error('wrong token');
    }

    next();
  } catch(e) {
    console.log(e);
    res.status(401);
    res.end('wrong token');
  }
};

export { verifyJWT, verifyAdminJWT };
