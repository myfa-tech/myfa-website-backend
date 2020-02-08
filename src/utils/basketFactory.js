
import mongoose from 'mongoose';
import BasketSchema from '../schemas/basket';

class BasketFactory {
  baskets = {
    fruits: {
      name: 'Fruits',
      type: 'fruits',
      realPrice: 5.99,
      reduction: 20,
      price: 4.99,
    },
    legumes: {
      name: 'Légumes',
      type: 'legumes',
      realPrice: 11.99,
      reduction: 20,
      price: 9.99,
    },
    sauces: {
      name: 'Sauces',
      type: 'sauces',
      realPrice: 23.99,
      reduction: 8,
      price: 0.99, // 21.99,
    },
    myfa: {
      name: 'MYFA',
      type: 'myfa',
      realPrice: 27.99,
      reduction: 7,
      price: 25.99,
    }
  };

  constructor (basketType, userInfo, recipient, ref) {
    this.basket = {
      ...this.baskets[basketType],
      createdAt: Date.now(),
      recipient,
      status: 'pending',
      orderRef: ref,
      userEmail: userInfo.email,
    }
  }

  getBasket = () => {
    return this.basket;
  };
};

export default BasketFactory;
