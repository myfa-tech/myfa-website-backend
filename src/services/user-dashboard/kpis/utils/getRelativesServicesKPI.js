import mongoose from 'mongoose';

import RequestSchema from '../../../../schemas/request';

const requestModel = mongoose.model('requests', RequestSchema);

const getRelativesServicesKPI = async (userEmail, periodLimitLow, periodLimitHigh) => {
  const agg = requestModel.aggregate([{ $match: {
    'user.email': userEmail,
    status: { $in: ['paid', 'delivered', 'preparing'] },
    type: { $in: ['Alimentaire', 'Cadeau', 'Santé'] },
    createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh },
  }}]);

  const result = await agg.count('relatives_services').exec();

  return result[0] || { relatives_services: 0 };
};

export default getRelativesServicesKPI;
