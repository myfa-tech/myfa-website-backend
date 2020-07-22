
import allProducts from '../assets/detailsProducts';

const getProducts = (req, res, next) => {
  try {
    const bestsellers = req.query.bestsellers;
    const category = req.query.category;
    const name = req.query.name;

    if (!!name) {
      let product = allProducts.find(p => p.name === name);

      res.status(200).send({ product });
    } else {
      let products = allProducts;

      if (!!category) {
        products = products.filter(p => p.category === category);
      }

      if (!!bestsellers) {
        products = products.filter(p => p.bestseller);
      }

      res.status(200).send({ products });
    }
	} catch (e) {
		console.log(e)
		res.status(500).end();
	}
};

export { getProducts };
