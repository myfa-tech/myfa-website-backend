import mongoose from 'mongoose';

import RatingSchema from '../schemas/rating';

const findRatings = async (req, res, next) => {
  try {
    const size = Number(req.query.size) || 10;
    const from = ((Number(req.query.page) || 1) - 1) * size;

		const ratingsModel = mongoose.model('ratings', RatingSchema);

    const results = await Promise.all([
      ratingsModel.find({}, ratingsModel).sort({ createdAt: -1 }).skip(from).limit(size),
      ratingsModel.estimatedDocumentCount(),
    ]);

    let totalPages = Math.ceil(results[1] / size);

    console.log(results[0]);

    let ratings = results[0].map(({ _doc: rating}) => ({ ...rating, user: { ...rating.user._doc, lastname: `${rating.user._doc.lastname.substr(0, 1)}.` }}));

    console.log(ratings);

    if (totalPages > 0) {
      res.status(200);
      res.json({ ratings, totalPages });
    } else {
      res.status(404);
      res.send('not found');
    }
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

const saveRating = async (req, res, next) => {
	try {
    const rating = req.body;
		const ratingsModel = mongoose.model('ratings', RatingSchema);

    rating.createdAt = Date.now();

    await ratingsModel.create(rating);

    console.log({ 'rating created': rating });

    res.status(201);
    res.send({ rating });
	} catch (e) {
		console.log(e);
		throw new Error('something went wrong');
	}
};

export { findRatings, saveRating };
