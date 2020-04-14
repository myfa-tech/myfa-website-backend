
import baskets from '../assets/baskets';
import customBasket from '../assets/customBasket';

class TranslatedBasketFactory {
  baskets = [...baskets, customBasket];

  constructor (basket) {
    this.structure = baskets.find(b => b.type === basket.type);

    this.basket = {
      ...basket,
      labelTranslate: this.structure.labelTranslate,
      homeDescTranslate: this.structure.homeDescTranslate,
      descriptionTranslate: this.structure.descriptionTranslate,
    }
  }

  getBasket = () => {
    return this.basket;
  };
};

export default TranslatedBasketFactory;
