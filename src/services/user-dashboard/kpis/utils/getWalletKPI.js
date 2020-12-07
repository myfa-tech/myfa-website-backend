import mongoose from 'mongoose';

import UserSchema from '../../../../schemas/user';

const userModel = mongoose.model('users', UserSchema);

const getWalletKPI = async (userInfoEmail) => {
  const result = await userModel.find({ email: userInfoEmail }, { wallet: 1, _id: 0 });

  return result[0] ? result[0]._doc : { wallet: 0 };
};

export default getWalletKPI;
