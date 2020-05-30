
import regularBaskets from '../assets/baskets';
import customBasket from '../assets/customBasket';
import ramadanBaskets from '../assets/ramadanBaskets';

class BasketFactory {
  baskets = [...regularBaskets, ...ramadanBaskets, customBasket];

  constructor (basket, userInfo, order, stripeIntentId = '') {
    this.structure = this.baskets.find(b => b.type === basket.type);

    this.basket = {
      name: this.structure.name,
      type: this.structure.type,
      label: this.structure.label,
      price: this.structure.price,
      priceCFA: this.structure.priceCFA,
      createdAt: Date.now(),
      recipient: basket.recipient,
      status: 'pending',
      orderRef: order.ref,
      items: this.structure.items || basket.items || {},
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
