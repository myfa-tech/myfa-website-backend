
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import CartSchema from '../schemas/cart';

const JWT_SECRET = process.env.JWT_SECRET;

const getCart = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo.email) {
      res.status(401);
      res.send('wrong token');
    }

    const cartModel = mongoose.model('cart', CartSchema);
    const cart = await cartModel.findOne({ userEmail: userInfo.email });

    res.status(200);
    res.send({ cart });
	} catch (e) {
    console.log(e);
    res.status(500).end();
	}
};

const createCart = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    const cart = req.body;

    cart.userEmail = userInfo.email;

    if (!userInfo.email) {
      res.status(401);
      res.send('wrong token');
    }

    const cartModel = mongoose.model('cart', CartSchema);
    await cartModel.create(cart);

    res.status(201);
    res.send('created');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

const updateCart = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    const editFields = req.body;

    if (!userInfo.email) {
      res.status(401);
      res.send('wrong token');
    }

    const cartModel = mongoose.model('cart', CartSchema);
    await cartModel.updateOne({ userEmail: userInfo.email }, editFields);

    res.status(201);
    res.send('updated');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

const deleteCart = async (req, res, next) => {
  try {
    let token = (req.headers.authorization || '').split(' ')[1];
    let userInfo = jwt.verify(token, JWT_SECRET);

    if (!userInfo.email) {
      res.status(401);
      res.send('wrong token');
    }

    const cartModel = mongoose.model('cart', CartSchema);
    await cartModel.deleteOne({ userEmail: userInfo.email });

    res.status(204);
    res.send('deleted');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

export {
  createCart,
  deleteCart,
  getCart,
  updateCart,
};
