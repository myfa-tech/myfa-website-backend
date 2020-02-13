
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

    const rules = [
      { section: 'general', collection: 'users', filter: {}, type: 'count', id: 'nb_users', label: 'utilisateurs', model: userModel },
      { section: 'general', collection: 'baskets', filter: { status: 'paid', type: 'fruits' }, id: 'nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { status: 'paid', type: 'legumes' }, id: 'nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { status: 'paid', type: 'sauces' }, id: 'nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { status: 'paid', type: 'myfa' }, id: 'nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },

      { section: 'week', collection: 'users', filter: { createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_users', type: 'count', label: 'utilisateurs', model: userModel },
      { section: 'week', collection: 'baskets', filter: { status: 'paid', type: 'fruits', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { status: 'paid', type: 'legumes', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { status: 'paid', type: 'sauces', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { status: 'paid', type: 'myfa', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },

      { section: 'month', collection: 'users', filter: { createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_users', type: 'count', label: 'utilisateurs', model: userModel },
      { section: 'month', collection: 'baskets', filter: { status: 'paid', type: 'fruits', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_fruits_baskets', type: 'count', label: 'paniers fruits', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { status: 'paid', type: 'legumes', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_legumes_baskets', type: 'count', label: 'paniers legumes', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { status: 'paid', type: 'sauces', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_sauces_baskets', type: 'count', label: 'paniers sauces', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { status: 'paid', type: 'myfa', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_myfa_baskets', type: 'count', label: 'paniers myfa', model: basketModel },
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
