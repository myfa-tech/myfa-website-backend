
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

export { getProducts };
