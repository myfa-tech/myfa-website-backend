
import mongoose from 'mongoose';
import UserSchema from '../schemas/user';
import BasketSchema from '../schemas/basket';

import { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth, getMondayOfCurrentWeek, getSundayOfCurrentWeek } from '../utils/dates';

const userModel = mongoose.model('users', UserSchema);
const basketModel = mongoose.model('baskets', BasketSchema);

const fetchKPIs = async (req, res, next) => {
  try {
    const promises = [];
    const weekMonday = getMondayOfCurrentWeek(new Date());
    const weekSunday = getSundayOfCurrentWeek(new Date());
    const monthFirstDay = getFirstDayOfCurrentMonth(new Date());
    const monthLastDay = getLastDayOfCurrentMonth(new Date());
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const tomorrow = new Date(new Date(today).setDate(new Date().getDate() + 1));

    const rules = [
      { section: 'general', collection: 'users', filter: {}, type: 'count', id: 'nb_users', label: 'utilisateurs', model: userModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'fruits' }, id: 'nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'legumes' }, id: 'nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'sauces' }, id: 'nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'myfa' }, id: 'nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },

      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'fruits', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'legumes', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'sauces', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'myfa', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },

      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'fruits', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'legumes', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'sauces', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'myfa', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },

      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'fruits', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'legumes', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'sauces', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }], type: 'myfa', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },
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
