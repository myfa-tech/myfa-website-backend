
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

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

const verifyAdminJWT = (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo.admin) {
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
