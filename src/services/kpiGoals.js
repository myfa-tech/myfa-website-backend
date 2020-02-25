import mongoose from 'mongoose';
import KpiGoalSchema from '../schemas/kpiGoal';

const fetchGoals = async (req, res, next) => {
  try {
    const goalsModel = mongoose.model('kpi-goals', KpiGoalSchema);
    const goals = await goalsModel.find();

    res.status(200);
    res.json(goals);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: 'something failed on our side' });
  }
};

const updateGoalById = async (req, res, next) => {
  try {
    const goalsModel = mongoose.model('kpi-goals', KpiGoalSchema);
    const { id } = req.query;

    if (!id) {
      res.status(400);
      res.json('missing id field in query');
      return;
    }

    await goalsModel.updateOne({ id }, req.body);
    res.status(201);
    res.send('goal updated');
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: 'something failed on our side' });
  }
}

export { fetchGoals, updateGoalById };
