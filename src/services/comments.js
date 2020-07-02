import mongoose from 'mongoose';

import CommentSchema from '../schemas/comment';

const findComments = async (req, res, next) => {
  try {
    const size = Number(req.query.size) || 10;
    const from = ((Number(req.query.page) || 1) - 1) * size;

		const commentsModel = mongoose.model('comments', CommentSchema);

    const results = await Promise.all([
      commentsModel.find({}, commentsModel).sort({ createdAt: -1 }).skip(from).limit(size),
      commentsModel.estimatedDocumentCount(),
    ]);

    let totalPages = Math.ceil(results[1] / size);

    if (totalPages > 0) {
      res.status(200)
      res.json({ comments: results[0], totalPages })
    } else {
      res.status(404)
      res.send('not found')
    }
	} catch (e) {
		console.log(e)
		throw new Error('something went wrong')
	}
}

export { findComments };
