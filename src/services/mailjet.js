import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import shajs from 'sha.js';

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

const sendEmailAddressConfirmationEmail = async (user) => {
  let hash = shajs('sha256').update(user.firstname).digest('hex')
  let link = `https://www.myfa.fr/email_confirmation?${user.email}&${hash}`;

  try {
    await mailjet.post('send', {'version': 'v3.1'})
      .request({
        'Messages': [
          {
            'From': {
              'Email': 'infos@myfa.fr',
              'Name': 'MYFA'
            },
            'To': [{ 'Email': user.email }],
            'TemplateID': 1255237,
            'TemplateLanguage': true,
            'Subject': `${user.firstname}, confirmez votre adresse email`,
            'Variables': {
              'firstname': user.firstname,
              'confirmation_link': link,
            },
          },
        ],
      });

    console.log('Email confirmation sent to :', user.email);
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const sendResetPasswordEmail = async (host, user) => {
  try {
    let hash = shajs('sha256').update(`${user.firstname}--${user.email}`).digest('hex');
    let link = `https://${host}/reset_password/password?email=${user.email}&link=${hash}`;

    await mailjet.post('send', {'version': 'v3.1'})
      .request({
        'Messages': [
          {
            'From': {
              'Email': 'infos@myfa.fr',
              'Name': 'MYFA'
            },
            'To': [{ 'Email': user.email }],
            'TemplateID': 1336327,
            'TemplateLanguage': true,
            'Subject': 'Changez de mot de passe',
            'Variables': {
              'firstname': user.firstname,
              'magic_link': link,
            },
          },
        ],
      });

    console.log('Password reset email sent to :', user.email);
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
            "To": [{ "Email": baskets[0].userEmail || baskets[0].user.email }],
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

    console.log('Confirmation email sent to :', baskets[0].userEmail || baskets[0].user.email);
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const sendCartReminders = async (emails) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('ENV is development - reminder mail not sent');
    } else {
      const promises = emails.map(email => mailjet.post("send", {'version': 'v3.1'})
        .request({
          "Messages": [
            {
              "From": {
                "Email": "infos@myfa.fr",
                "Name": "MYFA"
              },
              "To": [email],
              "TemplateID": 1341411,
              "TemplateLanguage": true,
              "Subject": "Votre commande vous attend sur myfa.fr",
              "Variables": {
                "order_link": 'https://www.myfa.fr/cart/',
              },
            },
          ],
        })
      );

      await Promise.all(promises);
    }

    console.log('Reminder emails sent to :', emails);
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const sendD30Reminders = async (users) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('ENV is development - reminder mail not sent');
    } else {
      const promises = users.map(user => mailjet.post("send", {'version': 'v3.1'})
        .request({
          "Messages": [
            {
              "From": {
                "Email": "infos@myfa.fr",
                "Name": "MYFA"
              },
              "To": [{ 'Email': user.email }],
              "TemplateID": 1516098,
              "TemplateLanguage": true,
              "Subject": `${user.firstname}, tout va bien ? Rassurez-nous. 🥺`,
              "Variables": {
                "order_link": 'https://www.myfa.fr/cart/',
              },
            },
          ],
        })
      );

      await Promise.all(promises);
    }

    console.log('Reminder emails sent to :', users.map(u => u.email));
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const sendDeliveryRateReminders = async (user) => {
  try {
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('ENV is development - reminder mail not sent');
    // } else {
      await mailjet.post("send", {'version': 'v3.1'})
        .request({
          "Messages": [
            {
              "From": {
                "Email": "infos@myfa.fr",
                "Name": "MYFA"
              },
              "To": [{ 'Email': user.email }],
              "TemplateID": 1515911,
              "TemplateLanguage": true,
              "Subject": `${user.firstname}, votre avis compte ! ✅`,
              "Variables": {
                "firstname": user.firstname,
              },
            },
          ],
        });
    // }

    console.log('Rating emails sent to :', user.email);
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

    await saveContact(listName, req.body.email);

    res.status(201);
    res.send('saved');
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const saveContact = async (listName, email) => {
  let listId = getContactsListId(listName);
  let contactEmail = email;

  await mailjet.post('contactslist', {'version': 'v3'})
    .id(listId)
    .action('managecontact')
    .request({
      'Email': contactEmail,
      'Action': 'addforce',
      'IsExcludedFromCampaigns': 'false',
    });
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

export {
  addContactToList,
  saveContact,
  sendEmailAddressConfirmationEmail,
  sendEmailToFinance,
  sendDeliveryRateReminders,
  sendD30Reminders,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendCartReminders,
  sendResetPasswordEmail,
};
