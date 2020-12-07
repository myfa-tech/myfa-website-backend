import mongoose from 'mongoose';

import RequestSchema from '../../../../schemas/request';

const requestModel = mongoose.model('requests', RequestSchema);

const getSpentKPI = async (userEmail, periodLimitLow, periodLimitHigh) => {
  const agg = requestModel.aggregate([
    {
      $match: {
        'user.email': userEmail,
        status: { $in: ['paid', 'delivered', 'preparing'] },
        createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh },
      }
    },
    {
      $group: {
        _id: null,
        spent: { $sum: '$price' },
      },
    },
  ]);

  const result = await agg.exec();

  return { spent: result[0] ? result[0].spent : 0 };
};

export default getSpentKPI;
