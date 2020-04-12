import { getAllCarts, deleteCarts } from "../services/cart";
import { sendCartReminders } from "../services/mailjet";

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

  const emailsToBeReminded = carts
    .filter((c, index, self) => (!emailsOfCartsToRemove.includes(c.userEmail) && self.indexOf(c.userEmail) === index))
    .map(c => ({ 'Email': c.userEmail}));

  console.log('emails to be reminded: ');
  console.log(emailsToBeReminded);

  await sendCartReminders(emailsToBeReminded);
};

export default curateCartsAndSendReminders;
