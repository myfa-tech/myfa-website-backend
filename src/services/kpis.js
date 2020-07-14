
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
      { section: 'general', collection: 'users', filter: {}, type: 'count', id: 'nb_users', label: 'utlsatrs', model: userModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'fruits' }, id: 'nb_paid_fruits_baskets', type: 'count', label: 'pns fruits', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'sauces' }, id: 'nb_paid_sauces_baskets', type: 'count', label: 'pns sauces', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'myfa' }, id: 'nb_paid_myfa_baskets', type: 'count', label: 'pns myfa', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'beauty' }, id: 'nb_paid_beauty_baskets', type: 'count', label: 'pns beaute', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'ramadan_fruits' }, id: 'nb_paid_ramadan_fruits_baskets', type: 'count', label: 'ram fruité', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'ramadan_sugar' }, id: 'nb_paid_ramadan_sugar_baskets', type: 'count', label: 'ram sucré', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'ramadan_full' }, id: 'nb_paid_ramadan_full_baskets', type: 'count', label: 'ram complet', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'veggies' }, id: 'nb_paid_veggies_packs', type: 'count', label: 'pck legumes', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'morning' }, id: 'nb_paid_morning_packs', type: 'count', label: 'pck matinal', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'local_rice' }, id: 'nb_paid_local_rice_packs', type: 'count', label: 'pck riz local', model: basketModel },
      { section: 'general', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'rice_attieke' }, id: 'nb_paid_rice_attieke_packs', type: 'count', label: 'pck riz attieke', model: basketModel },

      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'fruits', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_fruits_baskets', type: 'count', label: 'pns fruits', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'beauty', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_beauty_baskets', type: 'count', label: 'pns beaute', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'chocolate', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_chocolate_baskets', type: 'count', label: 'pns choco', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'veggies', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_veggies_packs', type: 'count', label: 'pck legumes', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'morning', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_morning_packs', type: 'count', label: 'pck matinal', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'local_rice', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_local_rice_packs', type: 'count', label: 'pck riz local', model: basketModel },
      { section: 'week', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'rice_attieke', createdAt: { $gte: weekMonday, $lte: weekSunday } }, id: 'week_nb_paid_rice_attieke_packs', type: 'count', label: 'pck riz attieke', model: basketModel },

      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'fruits', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_fruits_baskets', type: 'count', label: 'pns fruits', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'beauty', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_beauty_baskets', type: 'count', label: 'pns beaute', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'chocolate', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_chocolate_baskets', type: 'count', label: 'pns choco', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'veggies', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_veggies_packs', type: 'count', label: 'pck legumes', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'morning', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_morning_packs', type: 'count', label: 'pck matinal', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'local_rice', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_local_rice_packs', type: 'count', label: 'pck riz local', model: basketModel },
      { section: 'month', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'rice_attieke', createdAt: { $gte: monthFirstDay, $lte: monthLastDay } }, id: 'month_nb_paid_rice_attieke_packs', type: 'count', label: 'pck riz attieke', model: basketModel },

      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'fruits', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_fruits_baskets', type: 'count', label: 'pns fruits', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'veggies', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_veggies_packs', type: 'count', label: 'pns veggies', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'sauces', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_sauces_baskets', type: 'count', label: 'pns sauces', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'myfa', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_myfa_baskets', type: 'count', label: 'pns myfa', model: basketModel },
      { section: 'today', collection: 'baskets', filter: { $or: [{ status: 'paid' }, { status: 'delivered' }, { status: 'preparing' }], type: 'beauty', createdAt: { $gte: today, $lte: tomorrow } }, id: 'today_nb_paid_beauty_baskets', type: 'count', label: 'pns beaute', model: basketModel },


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
