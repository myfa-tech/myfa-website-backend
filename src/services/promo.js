
import mongoose from 'mongoose';

import PromoSchema from '../schemas/promos';

const usePromo = async (code) => {
  const promosModel = mongoose.model('promos', PromoSchema);

  try {
    const result = await promosModel.updateOne({ code }, { used: true });
    return result;
  } catch(e) {
    console.log('error using: ', code);
    return {};
  }
};

const testPromoCode = async (req, res, next) => {
  const promosModel = mongoose.model('promos', PromoSchema);
  let code = req.query.code;

  try {
    const promoCode = await promosModel.findOne({ code, used: false });

    if (!!promoCode) {
      res.status(200).send(true);
    }

    res.status(400).send(false);
  } catch(e) {
    console.log(e);
    res.status(500).end();
  }
};

export { testPromoCode, usePromo };
