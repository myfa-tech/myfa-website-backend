const packs = [
  {
    name: 'Matinal',
    type: 'morning',
    category: 'packs',
    label: 'Pack Matinal',
    labelTranslate: 'home_page.packs.morning_title',
    active: true,
    homeDescTranslate: 'home_page.packs.morning_home_description',
    imgAlt: 'pack matinal',
    price: 25.30,
    priceCFA: 16600,
    description: 'Grâce au pack matinal, permettez à vos proches de bien démarrer la journée. Certaines marques peuvent différer selon leur disponibilité.',
    descriptionTranslate: 'home_page.packs.morning_description',
    itemsTranslate: [
      { label: 'spread_chocolate', qty: 2 },
      { label: 'coffee', qty: 2 },
      { label: 'margarine', qty: 2 },
    ],
  },
  {
    name: 'Légumes',
    type: 'veggies',
    category: 'packs',
    label: 'Pack Légumes',
    labelTranslate: 'home_page.packs.veggies_title',
    active: true,
    homeDescTranslate: 'home_page.packs.veggies_home_description',
    imgAlt: 'pack légumes',
    price: 34.86,
    priceCFA: 22836,
    description: 'Chez MYFA, nous tenons à mettre en valeur les cultures vivrières qui rentrent dans la consommation locale. Avec ce panier, vous rendez heureux vos proches et les vendeurs/ producteurs avec qui nous sommes en contact direct ! 😉',
    descriptionTranslate: 'home_page.packs.veggies_description',
    itemsTranslate: [
      { label: 'carots', qty: 1 },
      { label: 'potatoes', qty: 2 },
      { label: 'onions', qty: 1 },
      { label: 'yam', qty: 1 },
      { label: 'red_cabbage', qty: 1 },
      { label: 'french_beans', qty: 1 },
      { label: 'local_rice_10', qty: 1 },
      { label: 'oil', qty: 2 },
    ],
  },
  {
    name: 'Familial - Riz local',
    type: 'local_rice',
    category: 'packs',
    label: 'Pack Familial - Riz local',
    labelTranslate: 'home_page.packs.local_rice_title',
    active: true,
    homeDescTranslate: 'home_page.packs.local_rice_home_description',
    imgAlt: 'pack riz local',
    price: 99.00,
    priceCFA: 64850,
    description: 'Imaginé pour une famille de 8 personnes, ce pack est généreusement composé de bons produits pour régaler la famille, avec du riz local 100% ivoirien.',
    descriptionTranslate: 'home_page.packs.local_rice_description',
    itemsTranslate: [
      { label: 'tomato_puree', qty: 1 },
      { label: 'milk_powder', qty: 3 },
      { label: 'oil', qty: 5 },
      { label: 'sugar', qty: 3 },
      { label: 'black_pepper', qty: 1 },
      { label: 'hot_chili', qty: 1 },
      { label: 'local_rice_25', qty: 2 },
    ],
  },
  {
    name: 'Familial - Riz Attieke',
    type: 'rice_attieke',
    category: 'packs',
    label: 'Pack Familial - Riz attieke',
    labelTranslate: 'home_page.packs.rice_attieke_title',
    active: true,
    homeDescTranslate: 'home_page.packs.rice_attieke_home_description',
    imgAlt: 'pack riz local',
    price: 109.00,
    priceCFA: 71400,
    description: 'Imaginé pour une famille de 8 personnes, ce pack est généreusement composé de bons produits pour régaler la famille, avec du riz parfumé et ses boules d\'attieke.',
    descriptionTranslate: 'home_page.packs.rice_attieke_description',
    itemsTranslate: [
      { label: 'tomato_puree', qty: 1 },
      { label: 'milk_powder', qty: 3 },
      { label: 'oil', qty: 5 },
      { label: 'sugar', qty: 3 },
      { label: 'black_pepper', qty: 1 },
      { label: 'hot_chili', qty: 1 },
      { label: 'local_rice_25', qty: 2 },
      { label: 'attieke', qty: 10 },
    ],
  },
];

export default packs;
