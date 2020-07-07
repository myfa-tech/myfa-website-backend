
import pleasureBaskets from '../assets/pleasureBaskets';
import packs from '../assets/packs';
import ramadanBaskets from '../assets/ramadanBaskets';

class BasketFactory {
  baskets = [...pleasureBaskets, ...packs, ...ramadanBaskets];

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
      promo: basket.promo,
      user: userInfo,
      stripeIntentId,
      message: basket.message,
    };
  }

  getBasket = () => {
    return this.basket;
  };
};

export default BasketFactory;
