
import mongoose from 'mongoose'

const saveBasket = async (req) => {
	try {
		const { basket } = req.body
		const basketsModel = mongoose.model('baskets', BasketSchema)

		basket.createdAt = Date.now()

		await basketsModel.create(basket)
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

export { saveBasket }
