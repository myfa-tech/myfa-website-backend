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

const sendOrderConfirmationEmail = async (user, baskets) => {
  try {
    let orderPrice = baskets.reduce((acc, curr) => acc + curr.price, 0);
    let date = new Date(baskets[0].createdAt).toLocaleDateString('fr-FR');

    await mailjet.post("send", {'version': 'v3.1'})
      .request({
        "Messages": [
          {
            "From": {
              "Email": "infos@myfa.fr",
              "Name": "MYFA"
            },
            "To": [{ "Email": baskets[0].userEmail }],
            "TemplateID": 1224159,
            "TemplateLanguage": true,
            "Subject": "Merci pour votre commande !",
            "Variables": {
              "customerName": user.firstname,
              "price": `${orderPrice} €`,
              "createdAt": `${date}`,
              "ref": `${baskets[0].orderRef}`,
            }
          }
        ]
      });

    console.log('Confirmation email sent to :', baskets[0].userEmail);
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
};

const sendEmailToFinance = async () => {
  try {
    const recipientEmail = 'meschberger.alexandre@gmail.com';

    await mailjet.post('send').request({
      FromEmail: 'infos@myfa.fr',
      FromName: 'MYFA',
      Subject: 'Alexandre, tu as une demande en attente sur le dashboard 🔔',
      'Mj-TemplateID': '1258515',
      'Mj-TemplateLanguage': 'true',
      Recipients: [{ Email: recipientEmail }],
    });

    console.log('Finance request sent to Alex');
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

export { addContactToList, sendEmailToFinance, sendOrderConfirmationEmail, sendWelcomeEmail };
