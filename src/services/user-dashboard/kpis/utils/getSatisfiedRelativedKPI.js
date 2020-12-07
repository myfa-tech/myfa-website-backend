import mongoose from 'mongoose';

import RequestSchema from '../../../../schemas/request';

const requestModel = mongoose.model('requests', RequestSchema);

// @TODO: améliorer cette fonction
const getSatisfiedRelativedKPI = async (userInfoEmail, periodLimitLow, periodLimitHigh) => {
  const result = await requestModel.find({
    'user.email': userInfoEmail,
    status: { $in: ['paid', 'delivered', 'preparing'] },
    type: { $in: ['Alimentaire', 'Cadeau', 'Santé'] },
    createdAt: { $gte: periodLimitLow, $lte: periodLimitHigh },
  });

  let contacts = result.map(doc => doc.contact);

  let counts = contacts.reduce((acc, curr) => {
    let fullname = `${curr.firstname} ${curr.lastname}`;
    if (acc[fullname]) {
      acc[fullname]++;
    } else {
      acc[fullname] = 1;
    }

    return acc;
  }, {});

  return { satisfied_relatives: counts };
};

export default getSatisfiedRelativedKPI;
