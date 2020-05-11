const availableBases = [
  { id: 'bapl', type: 'bases', label: 'Bananes plantain (1kg)', labelTranslate: '1kg_plantain' },
  { id: 'boat', type: 'bases', label: '2 boules d’attiéké', labelTranslate: '2_attiekes' },
];

const availableFruits = [
  { id: 'bana', type: 'fruits', label: 'Bananes (1kg)', labelTranslate: '1kg_bananas' },
  { id: 'noco', type: 'fruits', label: '1 Noix de coco', labelTranslate: '1_coconut' },
  { id: 'mang', type: 'fruits', label: 'Mangues (1kg)', labelTranslate: '1kg_mangos' },
  { id: 'oran', type: 'fruits', label: 'Oranges (1kg)', labelTranslate: '1kg_oranges' },
];

const availableVeggies = [
  { id: 'pote', type: 'veggies', label: 'Pomme de terre (2kg)', labelTranslate: '2kg_potatoes' },
  { id: 'oibl', type: 'veggies', label: 'Oignons rouges (1kg)', labelTranslate: '1kg_red_onions' },
  { id: 'caro', type: 'veggies', label: 'Carottes (1kg)', labelTranslate: '1kg_carots' },
  { id: 'igna', type: 'veggies', label: 'Ignames (1kg)', labelTranslate: '1kg_yams' },
  { id: 'hari', type: 'veggies', label: 'Haricots verts (400g)', labelTranslate: '400g_french_beans' },
];

const availableSauces = [
  { id: 'hupa', type: 'sauces', label: 'Huile de palme (1btl)', labelTranslate: '1L_palm_oil' },
  { id: 'gomb', type: 'sauces', label: 'Gombos (250g)', labelTranslate: '250g_gombos' },
  { id: 'oibl', type: 'sauces', label: 'Oignons rouges (1kg)', labelTranslate: '1kg_red_onions' },
  { id: 'cuep', type: 'sauces', label: '50 Cubes d’épices', labelTranslate: '50_maggie_10gr' },
  { id: 'popo', type: 'sauces', label: 'Pourdre de poisson (40g)', labelTranslate: '40g_fish_pouder' },
  { id: 'goai', type: 'sauces', label: '4 Gousses d’ail', labelTranslate: '4_garlics' },
  { id: 'toma', type: 'sauces', label: 'Tomates (1kg)', labelTranslate: '1kg_tomatoes' },
  { id: 'citr', type: 'sauces', label: 'Citrons (1kg)', labelTranslate: '1kg_lime' },
  { id: 'paar', type: 'sauces', label: 'Pate d’arachide (1 pot)', labelTranslate: '425g_peanut_paste' },
  { id: 'seba', type: 'sauces', label: 'Sel baleine (200g)', labelTranslate: '200g_salt' },
  { id: 'pomo', type: 'sauces', label: 'Poivre moulu (50g)', labelTranslate: '50g_pepper_pouder' },
  { id: 'grak', type: 'sauces', label: 'Graines d’akpi (70g)', labelTranslate: '70g_akpi' },
  { id: 'gimo', type: 'sauces', label: 'Gingembre moulu (30g)', labelTranslate: '30g_ginger_pouder' },
];

const availableSupps = [
  { id: 'bapl', type: 'supps', label: 'Bananes plantain (1kg)', labelTranslate: '1kg_plantain' },
  { id: 'boat', type: 'supps', label: '2 boules d’attiéké', labelTranslate: '2_attiekes' },
  { id: 'bana', type: 'supps', label: 'Bananes (1kg)', labelTranslate: '1kg_bananas' },
  { id: 'noco', type: 'supps', label: '1 Noix de coco', labelTranslate: '1_coconut' },
  { id: 'mang', type: 'supps', label: 'Mangues (1kg)', labelTranslate: '1kg_mangos' },
  { id: 'oran', type: 'supps', label: 'Oranges (1kg)', labelTranslate: '1kg_oranges' },
  { id: 'caro', type: 'supps', label: 'Carottes (1kg)', labelTranslate: '1kg_carots' },
  { id: 'igna', type: 'supps', label: 'Ignames (1kg)', labelTranslate: '1kg_yams' },
  { id: 'pote', type: 'supps', label: 'Pommes de terre (2kg)', labelTranslate: '2kg_potatoes' },
  { id: 'oibl', type: 'supps', label: 'Oignons rouges (1kg)', labelTranslate: '1kg_red_onions' },
  { id: 'hari', type: 'supps', label: 'Haricots verts (400g)', labelTranslate: '400g_french_beans' },
  { id: 'gimo', type: 'supps', label: 'Gingembre moulu (30g)', labelTranslate: '30g_ginger_pouder' },
  { id: 'hupa', type: 'supps', label: 'Huile de palme (1btl)', labelTranslate: '1L_palm_oil' },
  { id: 'gomb', type: 'supps', label: 'Gombos (250g)', labelTranslate: '250g_gombos' },
  { id: 'cuep', type: 'supps', label: '50 Cubes d’épices', labelTranslate: '50_maggie_10gr' },
  { id: 'popo', type: 'supps', label: 'Pourdre de poisson (40g)', labelTranslate: '40g_fish_pouder' },
  { id: 'goai', type: 'supps', label: '4 Gousses d’ail', labelTranslate: '4_garlics' },
  { id: 'toma', type: 'supps', label: 'Tomates (1kg)', labelTranslate: '1kg_tomatoes' },
  { id: 'citr', type: 'supps', label: 'Citrons (1kg)', labelTranslate: '1kg_lime' },
  { id: 'paar', type: 'supps', label: 'Pate d’arachide (1 pot)', labelTranslate: '425g_peanut_paste' },
  { id: 'seba', type: 'supps', label: 'Sel baleine (200g)', labelTranslate: '200g_salt' },
  { id: 'pomo', type: 'supps', label: 'Poivre moulu (50g)', labelTranslate: '50g_pepper_pouder' },
  { id: 'grak', type: 'supps', label: 'Graines d’akpi (70g)', labelTranslate: '70g_akpi' },
];

const customBasketDetails = {
  name: 'MYFA',
  type: 'myfa',
  label: 'Panier MYFA 🙌🏾',
  labelTranslate: 'home_page.baskets.myfa_basket_title',
  homeDesc: 'À vous de le composer !',
  homeDescTranslate: 'home_page.baskets.myfa_basket_home_description',
  imgAlt: 'panier myfa',
  price: 25.99,
  priceCFA: 17000,
  description: 'Avec ce panier, on vous laisse faire la composition qui convient le mieux à vos proches. Vous pouvez y mettre un peu de chaque panier et bien plus encore !',
  descriptionTranslate: 'home_page.baskets.myfa_basket_description',
  availableBases,
  availableFruits,
  availableVeggies,
  availableSauces,
  availableSupps,
};

export default customBasketDetails;
