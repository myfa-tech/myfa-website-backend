
import baskets from '../assets/baskets';
import customBasket from '../assets/customBasket';

class BasketFactory {
  baskets = [...baskets, customBasket];

  constructor (basketType, userInfo, order, stripeIntentId) {
    this.structure = baskets.find(b => b.type === basketType);

    this.basket = {
      name: this.structure.name,
      type: this.structure.type,
      price: this.structure.price,
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
