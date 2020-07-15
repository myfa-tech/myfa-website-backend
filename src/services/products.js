
import allProducts from '../assets/detailsProducts';

const getProducts = (req, res, next) => {
  try {
    const bestsellers = req.query.bestsellers;
    let products = allProducts;

    if (!!bestsellers) {
      products = products.filter(p => p.bestseller);
    }

    res.status(200).send({ products });
	} catch (e) {
		console.log(e)
		res.status(500).end();
	}
};

const getProductsByCategory = (req, res, next) => {
  try {
    const category = req.params.category;
    let products = allProducts.filter(p => p.category === category);

    if (!!products.length) {
      res.status(200).send({ products });
    }

    res.status(404).send(products);
	} catch (e) {
		console.log(e)
		res.status(500).end();
	}
};

export { getProducts, getProductsByCategory };
