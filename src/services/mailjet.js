import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

const mailjet = Mailjet.connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const sendWelcomeEmail = async (recipient) => {
  try {
    await mailjet.post('send').request({
      FromEmail: 'infos@myfa.fr',
      FromName: 'MYFA',
      Subject: `${recipient.firstname}, bienvenue dans la MYFA !`,
      'Mj-TemplateID': '1219463',
      'Mj-TemplateLanguage': 'true',
      Recipients: [{ Email: recipient.email }],
    });
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

export { sendWelcomeEmail };
