
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

export { usePromo };
