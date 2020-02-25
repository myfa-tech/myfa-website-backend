import mongoose from 'mongoose';

const KpiGoal = mongoose.Schema({
  // default id
  id: String,
  value: String,
});

export default KpiGoal;
