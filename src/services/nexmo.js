import dotenv from 'dotenv';
import Nexmo from 'nexmo';

import { createMessage } from '../assets/sms-templates';

dotenv.config();

const API_KEY = process.env.NEXMO_API_KEY;
const API_SECRET = process.env.NEXMO_API_SECRET;

const nexmo = new Nexmo({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});

const makeNumber = (recipient) => {
  let prefix = recipient.country.substr(1);
  let phone = recipient.phone;

  if (prefix === '33' && phone.length > 9) {
    phone = phone.substr(phone.length - 9);
  }

  return prefix + phone;
};

const sendMessage = async (user, recipient, templateName) => {
  try {
    let message = createMessage(templateName, user);
    let recipientNumber = makeNumber(recipient);

    console.log('SMS sent to :', recipientNumber);

    await nexmo.message.sendSms('MYFA', recipientNumber, message);
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

export { sendMessage };