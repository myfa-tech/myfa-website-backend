
import mongoose from 'mongoose';
import UserSchema from '../schemas/user';
import BasketSchema from '../schemas/basket';

const userModel = mongoose.model('users', UserSchema);
const basketModel = mongoose.model('baskets', BasketSchema);

const fetchKPIs = async (req, res, next) => {
  try {
    const promises = [];
    const rules = [
      { collection: 'users', filter: {}, type: 'count', id: 'nb_users', label: 'nombre d\'utilisateurs', model: userModel },
      { collection: 'baskets', filter: {}, type: 'count', id: 'nb_baskets', label: 'nombre de paniers', model: basketModel },
      { collection: 'baskets', filter: { paid: true }, id: 'nb_paid_baskets', type: 'count', label: 'nombre de paniers payés', model: basketModel },
    ];

    rules.forEach(rule => {
      const agg = rule.model.aggregate([{ $match: rule.filter }]);

      if (rule.type === 'count') {
        promises.push(agg.count(rule.id).exec());
      }
    });

    const responses = await Promise.all(promises);
    const enhancedResponses = responses.reduce((acc, curr) => ({ ...acc, ...curr[0] }), {});

    const result = rules.map(rule => ({
      label: rule.label,
      type: rule.type,
      result: enhancedResponses[rule.id] || 0,
    }))

    res.status(200);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: 'something failed on our side' });
  }
};

export { fetchKPIs };
