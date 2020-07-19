const baskets = [
  {
    name: 'Fruits',
    type: 'fruits',
    category: 'baskets',
    label: 'Panier Fruits 🍌',
    labelTranslate: 'home_page.baskets.fruits_title',
    active: true,
    homeDescTranslate: 'home_page.baskets.fruits_home_description',
    imgAlt: 'panier fruits',
    price: 5.99,
    priceCFA: 3900,
    description: 'Le panier Fruits rassemble jusqu\'à 6 kilos de saveurs dont vous pouvez faire profiter vos proches.',
    descriptionTranslate: 'home_page.baskets.fruits_description',
    itemsTranslate: [
      { label: 'bananas', qty: 1 },
      { label: 'oranges', qty: 1 },
      { label: 'coconut', qty: 1 },
      { label: 'pineapple', qty: 1 },
      { label: 'mangoes', qty: 1 },
      { label: 'avocados', qty: 1 },
    ],
  },
  {
    name: 'Beauté',
    type: 'beauty',
    category: 'baskets',
    label: 'Panier Beauté ✨',
    labelTranslate: 'home_page.baskets.beauty_title',
    active: true,
    homeDescTranslate: 'home_page.baskets.beauty_home_description',
    imgAlt: 'panier beauté',
    price: 21.99,
    priceCFA: 14400,
    description: 'Avec ce panier rempli de produits aux bienfaits bénéfiques pour votre santé autant que votre beauté, prendre soin de vous n’a jamais été aussi plaisant.',
    descriptionTranslate: 'home_page.baskets.beauty_description',
    itemsTranslate: [
      { label: 'karite', qty: 1 },
      { label: 'cocoa_butter', qty: 1 },
      { label: 'bissap', qty: 2 },
      { label: 'kinkeliba', qty: 1 },
      { label: 'black_soap', qty: 2 },
      { label: 'honey', qty: 1 },
    ],
  },
  {
    name: 'Chocolat',
    type: 'chocolate',
    category: 'baskets',
    label: 'Panier Chocolat 🍫',
    labelTranslate: 'home_page.baskets.chocolate_title',
    active: true,
    homeDescTranslate: 'home_page.baskets.chocolate_home_description',
    imgAlt: 'panier chocolat',
    price: 59.99,
    priceCFA: 39300,
    description: 'Dans ce panier, retrouvez toutes les saveurs chocolatées de la Côte d\'Ivoire.',
    descriptionTranslate: 'home_page.baskets.chocolate_description',
    itemsTranslate: [
      { label: 'mona_lysa', qty: 1 },
      { label: 'white_zephyr', qty: 1 },
      { label: 'ruby', qty: 1 },
      { label: 'crispearls', qty: 1 },
      { label: 'superior_lactee', qty: 1 },
      { label: 'caramel_almond', qty: 1 },
      { label: 'gold', qty: 1 },
      { label: 'ruben', qty: 1 },
      { label: 'ocoa', qty: 1 },
      { label: 'eale_choco_tablette', qty: 2 },
      { label: 'tabletine', qty: 3 },
      { label: 'tofi_mylane', qty: 2 },
    ],
  },
];

export default baskets;
