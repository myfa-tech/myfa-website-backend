
class BasketFactory {
  baskets = {
    fruits: {
      name: 'Fruits',
      type: 'fruits',
      realPrice: 5.99,
      reduction: 16,
      price: 4.99,
    },
    legumes: {
      name: 'Légumes',
      type: 'legumes',
      realPrice: 11.99,
      reduction: 16,
      price: 9.99,
    },
    sauces: {
      name: 'Sauces',
      type: 'sauces',
      realPrice: 23.99,
      reduction: 8,
      price: 21.99,
    },
    myfa: {
      name: 'MYFA',
      type: 'myfa',
      realPrice: 27.99,
      reduction: 7,
      price: 25.99,
    }
  };

  constructor (basketType, userInfo, order) {
    this.basket = {
      ...this.baskets[basketType],
      createdAt: Date.now(),
      recipient: order.recipient,
      status: 'pending',
      orderRef: order.ref,
      items: order.baskets[basketType].items || {},
      userEmail: userInfo.email,
    }
  }

  getBasket = () => {
    return this.basket;
  };
};

export default BasketFactory;
