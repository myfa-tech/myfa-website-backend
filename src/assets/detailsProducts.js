const products = [
  {
    name: 'palm_oil',
    labelTranslate: "ingredients.palm_oil",
    category: 'grocery_salt',
    img: 'palm_oil',
    imgAlt: 'palm oil bottle',
    bestseller: false,
    price: 3.11,
    priceCFA: 2035,
  },
  {
    name: 'plantain',
    labelTranslate: "ingredients.plantain",
    category: 'grocery-salty',
    imgAlt: 'plantain',
    bestseller: false,
    price: 0.99,
    priceCFA: 649,
  },
  {
    name: 'gombos',
    labelTranslate: "ingredients.gombos",
    category: 'veggies',
    imgAlt: 'gombo',
    bestseller: false,
    price: 0.30,
    priceCFA: 193.9,
  },
  {
    name: 'sugar',
    labelTranslate: "ingredients.sugar",
    category: 'grocery-sweet',
    imgAlt: 'sugar pack',
    bestseller: true,
    price: 1.43,
    priceCFA: 935,
  },
  {
    name: 'soup',
    labelTranslate: "ingredients.soup",
    category: 'grocery-salty',
    imgAlt: 'soup pack',
    bestseller: false,
    price: 2.18,
    priceCFA: 1430,
  },
  {
    name: 'tea_bags',
    labelTranslate: "ingredients.tea_bags",
    category: 'grocery-sweet',
    imgAlt: 'tea bags',
    bestseller: false,
    price: 0.50,
    priceCFA: 330,
  },
  {
    name: 'vqr',
    labelTranslate: "ingredients.vqr",
    category: 'grocery-salty',
    imgAlt: 'VacheQuiRit pack',
    bestseller: false,
    price: 1.26,
    priceCFA: 825,
  },
  {
    name: 'juice',
    labelTranslate: "ingredients.juice",
    category: 'grocery-sweet',
    imgAlt: '1L juice tetrapack',
    bestseller: false,
    price: 1.93,
    priceCFA: 1265,
  },
  {
    name: '1_apple',
    labelTranslate: "ingredients.1_apple",
    category: 'fruits',
    imgAlt: 'apples',
    bestseller: false,
    price: 0.99,
    priceCFA: 656,
  },
  {
    name: 'mil',
    labelTranslate: "ingredients.mil",
    category: 'grocery-sweet',
    imgAlt: 'milet porridge',
    bestseller: false,
    price: 1.63,
    priceCFA: 1067,
  },
  {
    name: 'bonnet_rouge',
    labelTranslate: "ingredients.bonnet_rouge",
    category: 'grocery-sweet',
    imgAlt: 'bonnet rouge',
    bestseller: false,
    price: 1.43,
    priceCFA: 935,
  },
  {
    name: 'onions',
    labelTranslate: "ingredients.onions",
    category: 'veggies',
    imgAlt: 'oignons',
    bestseller: false,
    price: 1.36,
    priceCFA: 890,
  },
  {
    name: 'mangoes',
    labelTranslate: "ingredients.mangoes",
    category: 'fruits',
    imgAlt: 'mangues',
    bestseller: false,
    price: 1.01,
    priceCFA: 660,
  },
  {
    name: 'maggie',
    labelTranslate: "ingredients.maggie",
    category: 'grocery-salty',
    imgAlt: '50 Maggie cubes',
    bestseller: false,
    price: 2.52,
    priceCFA: 1650,
  },
  {
    name: 'tomatoes',
    labelTranslate: "ingredients.tomatoes",
    category: 'fruits',
    imgAlt: 'tomates',
    bestseller: false,
    price: 1.99,
    priceCFA: 1309,
  },
  {
    name: 'lemon',
    labelTranslate: "ingredients.lemon",
    category: 'fruits',
    imgAlt: 'lemon',
    bestseller: false,
    price: 1.33,
    priceCFA: 869,
  },
  {
    name: 'peanut_paste',
    labelTranslate: "ingredients.peanut_paste",
    category: 'grocery-sweet',
    imgAlt: 'peanut paste',
    bestseller: false,
    price: 4.20,
    priceCFA: 2750,
  },
  {
    name: 'salt',
    labelTranslate: "ingredients.salt",
    category: 'grocery-salty',
    imgAlt: 'salt',
    bestseller: false,
    price: 0.50,
    priceCFA: 330,
  },
  {
    name: 'pepper_powder',
    labelTranslate: "ingredients.pepper_powder",
    category: 'grocery-salty',
    imgAlt: 'pepper powder',
    bestseller: false,
    price: 3.36,
    priceCFA: 2200,
  },
  {
    name: 'ginger_powder',
    labelTranslate: "ingredients.ginger_powder",
    category: 'grocery-salty',
    imgAlt: 'ginger powder',
    bestseller: false,
    price: 4.74,
    priceCFA: 3108,
  },
  {
    name: 'garlic',
    labelTranslate: "ingredients.garlic",
    category: 'grocery-salty',
    imgAlt: 'garlice',
    bestseller: false,
    price: 1.05,
    priceCFA: 685,
  },
  {
    name: 'bananas',
    labelTranslate: "ingredients.bananas",
    category: 'fruits',
    imgAlt: 'bananas',
    bestseller: false,
    price: 0.54,
    priceCFA: 352,
  },
  {
    name: 'oranges',
    labelTranslate: "ingredients.oranges",
    category: 'fruits',
    imgAlt: 'oranges',
    bestseller: false,
    price: 0.59,
    priceCFA: 385,
  },
  {
    name: 'coconut',
    labelTranslate: "ingredients.coconut",
    category: 'fruits',
    imgAlt: 'coconut',
    bestseller: false,
    price: 0.34,
    priceCFA: 220,
  },
  {
    name: 'pineapple',
    labelTranslate: "ingredients.pineapple",
    category: 'fruits',
    imgAlt: 'pineapple',
    bestseller: false,
    price: 0.84,
    priceCFA: 550,
  },
  {
    name: 'avocados',
    labelTranslate: "ingredients.avocados",
    category: 'fruits',
    imgAlt: 'avocados',
    bestseller: false,
    price: 1.26,
    priceCFA: 825,
  },
  {
    name: 'carots',
    labelTranslate: "ingredients.carots",
    category: 'veggies',
    imgAlt: 'carots',
    bestseller: false,
    price: 1.66,
    priceCFA: 1089,
  },
  {
    name: 'potatoes',
    labelTranslate: "ingredients.potatoes",
    category: 'veggies',
    imgAlt: 'potatoes',
    bestseller: false,
    price: 0.59,
    priceCFA: 385,
  },
  {
    name: 'yam',
    labelTranslate: "ingredients.yam",
    category: 'veggies',
    imgAlt: 'yam',
    bestseller: false,
    price: 0.59,
    priceCFA: 389,
  },
  {
    name: 'red_cabbage',
    labelTranslate: "ingredients.red_cabbage",
    category: 'veggies',
    imgAlt: 'red cabbage',
    bestseller: false,
    price: 3.83,
    priceCFA: 2511,
  },
  {
    name: 'french_beans',
    labelTranslate: "ingredients.french_beans",
    category: 'veggies',
    imgAlt: 'french beance',
    bestseller: false,
    price: 1.48,
    priceCFA: 968,
  },
  {
    name: 'karite',
    labelTranslate: "ingredients.karite",
    category: 'healthy',
    imgAlt: 'karite',
    bestseller: true,
    price: 0.84,
    priceCFA: 550,
  },
  {
    name: 'cocoa_butter',
    labelTranslate: "ingredients.cocoa_butter",
    category: 'healthy',
    imgAlt: 'cocoa butter',
    bestseller: false,
    price: 2.18,
    priceCFA: 1430,
  },
  {
    name: 'bissap',
    labelTranslate: "ingredients.bissap",
    category: 'grocery-sweet',
    imgAlt: 'bissap leafs',
    bestseller: false,
    price: 1.85,
    priceCFA: 1210,
  },
  {
    name: 'kinkeliba',
    labelTranslate: "ingredients.kinkeliba",
    category: 'healthy',
    imgAlt: 'kinkeliba leafs',
    bestseller: false,
    price: 0.34,
    priceCFA: 220,
  },
  {
    name: 'black_soap',
    labelTranslate: "ingredients.black_soap",
    category: 'healthy',
    imgAlt: 'black soap',
    bestseller: false,
    price: 3.34,
    priceCFA: 2189,
  },
  {
    name: 'honey',
    labelTranslate: "ingredients.honey",
    category: 'grocery-sweet',
    imgAlt: 'honey',
    bestseller: false,
    price: 3.99,
    priceCFA: 2613,
  },
  {
    name: 'margarine',
    labelTranslate: "ingredients.margarine",
    category: 'grocery-salty',
    imgAlt: 'margarine',
    bestseller: false,
    price: 1.68,
    priceCFA: 1100,
  },
  {
    name: 'coffee',
    labelTranslate: "ingredients.coffee",
    category: 'grocery-sweet',
    imgAlt: 'coffee tin',
    bestseller: false,
    price: 3.02,
    priceCFA: 1980,
  },
  {
    name: 'spread_chocolate',
    labelTranslate: "ingredients.spread_chocolate",
    category: 'grocery-sweet',
    imgAlt: 'chocolat à tartiner',
    bestseller: false,
    price: 4.76,
    priceCFA: 3119,
  },
  {
    name: 'tomato_puree',
    labelTranslate: "ingredients.tomato_puree",
    category: 'grocery-salty',
    imgAlt: 'tomato puree',
    bestseller: false,
    price: 3.53,
    priceCFA: 2310,
  },
  {
    name: 'milk_powder',
    labelTranslate: "ingredients.milk_powder",
    category: 'grocery-sweet',
    imgAlt: 'lait en poudre',
    bestseller: false,
    price: 4.03,
    priceCFA: 2640,
  },
  {
    name: 'oil',
    labelTranslate: "ingredients.oil",
    category: 'grocery-salty',
    imgAlt: 'cooking oil',
    bestseller: true,
    price: 3.53,
    priceCFA: 2310,
  },
  {
    name: 'black_pepper',
    labelTranslate: "ingredients.black_pepper",
    category: 'grocery-salty',
    imgAlt: 'black pepper',
    bestseller: false,
    price: 7.22,
    priceCFA: 4730,
  },
  {
    name: 'hot_chili',
    labelTranslate: "ingredients.hot_chili",
    category: 'veggies',
    imgAlt: 'piment fort',
    bestseller: false,
    price: 2.12,
    priceCFA: 1386,
  },
  {
    name: 'local_rice_25',
    labelTranslate: "ingredients.local_rice_25",
    category: 'grocery-salty',
    imgAlt: 'rice bag 25 kilos',
    bestseller: true,
    price: 18.89,
    priceCFA: 12375,
  },
  {
    name: 'local_rice_10',
    labelTranslate: "ingredients.local_rice_10",
    category: 'grocery-salty',
    imgAlt: 'rice biag 10 kilos',
    bestseller: false,
    price: 7.89,
    priceCFA: 5170,
  },
  {
    name: 'attieke',
    labelTranslate: "ingredients.attieke",
    category: 'grocery-salty',
    imgAlt: 'attieke',
    bestseller: false,
    price: 0.84,
    priceCFA: 550,
  },
  {
    name: 'white_zephyr',
    labelTranslate: "ingredients.white_zephyr",
    category: 'grocery-sweet',
    imgAlt: 'white zephyr chocolate',
    bestseller: false,
    price: 1.68,
    priceCFA: 1100,
  },
  {
    name: 'ruby',
    labelTranslate: "ingredients.ruby",
    category: 'grocery-sweet',
    imgAlt: 'ruby chocolate',
    bestseller: false,
    price: 4.20,
    priceCFA: 2750,
  },
  {
    name: 'superior_lactee',
    labelTranslate: "ingredients.superior_lactee",
    category: 'grocery-sweet',
    imgAlt: 'superior lactee chocolate',
    bestseller: false,
    price: 1.68,
    priceCFA: 1100,
  },
  {
    name: 'almonds',
    labelTranslate: "ingredients.caramel_almond",
    category: 'grocery-sweet',
    imgAlt: 'caramelized almond',
    bestseller: false,
    price: 4.20,
    priceCFA: 2750,
  },
  {
    name: 'gold',
    labelTranslate: "ingredients.gold",
    category: 'grocery-sweet',
    imgAlt: 'gold chocolate',
    bestseller: false,
    price: 2.52,
    priceCFA: 1650,
  },
  {
    name: 'ocoa',
    labelTranslate: "ingredients.ocoa",
    category: 'grocery-sweet',
    imgAlt: 'ocoa chocolate',
    bestseller: false,
    price: 2.50,
    priceCFA: 1650,
  },
  {
    name: 'poulet_pac',
    labelTranslate: "ingredients.poulet_pac",
    category: 'meat',
    imgAlt: 'poulet PAC',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'poulet effile',
    labelTranslate: "ingredients.poulet_effile",
    category: 'meat',
    imgAlt: 'poulet effile',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'entrecote',
    labelTranslate: "ingredients.entrecote",
    category: 'meat',
    imgAlt: 'entrecote meat',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'cotes',
    labelTranslate: "ingredients.cotes",
    category: 'meat',
    imgAlt: 'cotes meat',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'bavette',
    labelTranslate: "ingredients.bavette",
    category: 'meat',
    imgAlt: 'bavette meat',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'epaule_agneau',
    labelTranslate: "ingredients.epaule_agneau",
    category: 'meat',
    imgAlt: 'epaule agneau meat',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'carpe_rouge',
    labelTranslate: "ingredients.carpe_rouge",
    category: 'meat',
    imgAlt: 'carpe rouge poisson',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'grosse_sole',
    labelTranslate: "ingredients.grosse_sole",
    category: 'meat',
    imgAlt: 'grosse sole poisson',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'filet_saumon',
    labelTranslate: "ingredients.filet_saumon",
    category: 'meat',
    imgAlt: 'filet saumon poisson',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'dorade_locale',
    labelTranslate: "ingredients.dorade_locale",
    category: 'meat',
    imgAlt: 'dorade locale poisson',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'carpe_noire',
    labelTranslate: "ingredients.carpe_noire",
    category: 'meat',
    imgAlt: 'carpe noire poisson',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
  {
    name: 'sardine',
    labelTranslate: "ingredients.sardine",
    category: 'meat',
    imgAlt: 'sardine poisson',
    bestseller: false,
    price: 12.25,
    priceCFA: 8027,
  },
];

export default products;
