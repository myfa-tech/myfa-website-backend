import mongoose from 'mongoose';

import RequestSchema from '../../../../schemas/request';

const requestModel = mongoose.model('requests', RequestSchema);

const getSelfServicesKPI = async (userEmail, periodLimitLow, periodLimitHigh) => {
  const agg = requestModel.aggregate([{ $match: {
    'user.email': userEmail,
    status: { $in: ['paid', 'delivered', 'preparing'] },
    type: { $regex : "Batiment.*" },
    createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh },
  }}]);

  const result = await agg.count('self_services').exec();

  return result[0] || { self_services: 0 };
};

export default getSelfServicesKPI;
