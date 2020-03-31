
class BasketFactory {
  baskets = {
    fruits: {
      name: 'Fruits',
      type: 'fruits',
      price: 5.99,
    },
    legumes: {
      name: 'Légumes',
      type: 'legumes',
      price: 12.99,
    },
    sauces: {
      name: 'Sauces',
      type: 'sauces',
      price: 23.99,
    },
    myfa: {
      name: 'MYFA',
      type: 'myfa',
      price: 25.99,
    }
  };

  constructor (basketType, userInfo, order, stripeIntentId) {
    this.basket = {
      ...this.baskets[basketType],
      createdAt: Date.now(),
      recipient: order.recipient,
      status: 'pending',
      orderRef: order.ref,
      items: order.baskets[basketType].items || {},
      userEmail: userInfo.email,
      stripeIntentId,
      message: order.message,
    }
  }

  getBasket = () => {
    return this.basket;
  };
};

export default BasketFactory;
