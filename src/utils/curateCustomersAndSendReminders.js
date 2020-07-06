
import { getDminus30Baskets, getUserLatestBasket } from '../services/baskets';
import uniq from './uniq';
import { sendD30Reminders } from '../services/mailjet';

const curateCustomersAndSendReminders = async () => {
  let baskets = await getDminus30Baskets();
  const userEmails = uniq(baskets.map(b => b.user.email));

  const usersLatestsBaskets = await Promise.all(userEmails.map(async (email) => {
    return await getUserLatestBasket(email);
  }));

  baskets = baskets.filter(basket => {
    let userLastBasket = usersLatestsBaskets.find(b => b.user.email === basket.user.email);

    return (String(basket._id) === String(userLastBasket._id));
  });

  const usersToBeReminded = baskets.map(b => b.user);

  console.log('emails to be reminded: ');
  console.log(usersToBeReminded.map(u => u.email));

  if (!!usersToBeReminded.length) {
    await sendD30Reminders(usersToBeReminded);
  }
};

export default curateCustomersAndSendReminders;
