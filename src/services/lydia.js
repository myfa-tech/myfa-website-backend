import Lydia from '../utils/Lydia'

const requestPayment = async (req, res, next) => {
	try {
		const lydia = new Lydia()
		const result = await lydia.requestPayment(req.body)

		res.status(200)
		res.json(result.data)
	} catch (e) {
		console.log(e)
		res.status(400)
		res.json({ error: 'something went wrong' })
	}
}

export { requestPayment }
