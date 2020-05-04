
import regularBaskets from '../assets/baskets';
import customBasket from '../assets/customBasket';
import ramadanBaskets from '../assets/ramadanBaskets';

class BasketFactory {
  baskets = [...regularBaskets, ...ramadanBaskets, customBasket];

  constructor (basketType, userInfo, order, stripeIntentId = '') {
    this.structure = this.baskets.find(b => b.type === basketType);

    this.basket = {
      name: this.structure.name,
      type: this.structure.type,
      label: this.structure.label,
      price: order.baskets[basketType].singlePrice * order.baskets[basketType].qty || this.structure.price,
      priceCFA: this.structure.priceCFA,
      createdAt: Date.now(),
      recipient: order.recipient,
      status: 'pending',
      orderRef: order.ref,
      items: order.baskets[basketType].items || this.structure.items || {},
      user: userInfo,
      stripeIntentId,
      message: order.message,
    };
  }

  getBasket = () => {
    return this.basket;
  };
};

export default BasketFactory;
