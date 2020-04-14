import { getAllCarts, deleteCarts } from "../services/cart";
import { sendCartReminders } from "../services/mailjet";
import uniqBy from "./uniqBy";

const curateCartsAndSendReminders = async () => {
  const carts = await getAllCarts();

  let date2daysAgo = new Date();
  date2daysAgo.setDate(date2daysAgo.getDate() - 2);

  const emailsOfCartsToRemove = carts
    .filter(c => c.createdAt < date2daysAgo)
    .map(c => c.userEmail);

  console.log('emails to remove: ');
  console.log(emailsOfCartsToRemove);

  await deleteCarts(emailsOfCartsToRemove);

  let emailsToBeReminded = carts
    .filter(c => !emailsOfCartsToRemove.includes(c.userEmail))
    .map(c => ({ 'Email': c.userEmail }));

  emailsToBeReminded = uniqBy(emailsToBeReminded, 'Email');

  console.log('emails to be reminded: ');
  console.log(emailsToBeReminded);

  if (!!emailsToBeReminded.length) {
    await sendCartReminders(emailsToBeReminded);
  }
};

export default curateCartsAndSendReminders;
