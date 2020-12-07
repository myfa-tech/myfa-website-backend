import mongoose from 'mongoose';

import RequestSchema from '../../../../schemas/request';

const requestModel = mongoose.model('requests', RequestSchema);

const getSpendingSectorsKPI = async (userEmail, periodLimitLow, periodLimitHigh) => {
  const agg = requestModel.aggregate([
    {
      $match: {
        'user.email': userEmail,
        status: { $in: ['paid', 'delivered', 'preparing'] },
        createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh },
      },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      },
    },
  ]);

  const result = await agg.exec();

  let values = result.reduce((acc, val) => ({
    ...acc,
    [val._id]: val.count,
  }), {});

  let enhancedResult = { 'spending_sectors': values };

  return enhancedResult;
};

export default getSpendingSectorsKPI;
