
import detailsBasket from '../assets/detailsBasket';

class DetailsBasketFactory {
  constructor (order, userInfo, stripeIntentId = '') {
    this.structure = detailsBasket;
    this.price = order.products.items.map(p => p.price).reduce((acc, cur) => acc + cur, 0);
    this.items = order.products.items.map(p => ({ label: p.labelTranslate, qty: p.qty }));

    this.basket = {
      name: this.structure.name,
      type: this.structure.type,
      label: this.structure.label,
      price: this.price,
      createdAt: Date.now(),
      recipient: order.products.recipient,
      status: 'pending',
      orderRef: order.ref,
      itemsTranslate: this.items,
      promo: order.promo,
      user: userInfo,
      stripeIntentId,
      message: order.products.message,
    };
  }

  getBasket = () => {
    return this.basket;
  };
};

export default DetailsBasketFactory;
