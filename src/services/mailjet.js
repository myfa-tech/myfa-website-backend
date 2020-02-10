import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

const mailjet = Mailjet.connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const getContactsListId = (name) => {
  let lists = {
    'newsletter': 12950,
  };

  return lists[name];
};

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

const addContactToList = async (req, res, listName) => {
  try {
    if (!req.body.email) {
      res.status(400);
      res.send('missing field');
      return;
    }

    let listId = getContactsListId(listName);
    let contactEmail = req.body.email;

    await mailjet.post('contactslist', {'version': 'v3'})
      .id(listId)
      .action('managecontact')
      .request({
        'Email': contactEmail,
        'Action': 'addforce',
        'IsExcludedFromCampaigns': 'false',
      });

    res.status(201);
    res.send('saved');
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
}

export { addContactToList, sendWelcomeEmail };
