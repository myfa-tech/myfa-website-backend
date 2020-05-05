import mongoose from 'mongoose';

const StocksSchema = mongoose.Schema({
  // defualt id
  label: String,
  have: Number,
});

export default StocksSchema;
