
import mongoose from 'mongoose';
import UserSchema from '../schemas/user';
import RequestSchema from '../schemas/request';

import { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from '../utils/dates';

const userModel = mongoose.model('users', UserSchema);
const requestModel = mongoose.model('requests', RequestSchema);

const fetchKPIs = async (req, res, next) => {
  try {
    const promises = [];
    const monthFirstDay = getFirstDayOfCurrentMonth(new Date());
    const monthLastDay = getLastDayOfCurrentMonth(new Date());

    const rules = [
      { section: 'general', collection: 'users', filter: {}, type: 'count', id: 'nb_users', label: 'utlsatrs', model: userModel },
      { section: 'general', collection: 'requests', filter: { $or: [{ status: 'pending' }, { status: null }] }, id: 'nb_pending_requests', type: 'count', label: 'En attente', model: requestModel },
      { section: 'general', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Santé' }, id: 'nb_paid_health_requests', type: 'count', label: 'Santé', model: requestModel },
      { section: 'general', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Batiment' }, id: 'nb_paid_building_requests', type: 'count', label: 'Batiment', model: requestModel },
      { section: 'general', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Alimentaire' }, id: 'nb_paid_foods_requests', type: 'count', label: 'Alimentaire', model: requestModel },
      { section: 'general', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Cadeau' }, id: 'nb_paid_gift_requests', type: 'count', label: 'Cadeau', model: requestModel },

      { section: 'month', collection: 'requests', filter: { $or: [{ status: 'pending' }, { status: null }], createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_pending_requests', type: 'count', label: 'En attente', model: requestModel },
      { section: 'month', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Santé', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_health_requests', type: 'count', label: 'Santé', model: requestModel },
      { section: 'month', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Batiment', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_building_requests', type: 'count', label: 'Batiment', model: requestModel },
      { section: 'month', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Alimentaire', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_foods_requests', type: 'count', label: 'Alimentaire', model: requestModel },
      { section: 'month', collection: 'requests', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'Cadeau', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_gift_requests', type: 'count', label: 'Cadeau', model: requestModel },
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
      id: rule.id,
      section: rule.section,
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
