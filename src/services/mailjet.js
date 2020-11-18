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
    'contact+NL': 10242968,
    'contact+NoNL': 10242971,
    'prospectFB': 10243305,
    'new-request': 10250880,
  };

  return lists[name];
};

const sendUserBasketComment = async (req, res, next) => {;
  try {
    const { firstname, lastname, email, comment, basketType } = req.body;

    await mailjet.post('send', {'version': 'v3.1'})
      .request({
        'Messages': [
          {
            'From': {
              'Email': 'infos@myfa.fr',
              'Name': 'MYFA'
            },
            'To': [{ 'Email': 'infos@myfa.fr' }],
            'TemplateID': 1557971,
            'TemplateLanguage': true,
            'Subject': 'Commentaire utilisateur',
            'Variables': {
              'user_firstname': firstname,
              'user_lastname': lastname,
              'user_email': email,
              'user_comment': comment,
              'basket_type': basketType,
            },
          },
        ],
      });

    console.log('Email comment sent');

    res.status(201).send('sent');
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
    res.status(500).end();
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
    if (process.env.NODE_ENV === 'development') {
      console.log('ENV is development - reminder mail not sent');
    } else {
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
    }

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

    const { email, firstname, lastname, confirmationLink } = req.body;

    await saveContact(listName, email, firstname, lastname, confirmationLink);

    res.status(201);
    res.send('saved');
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const removeContactFromList = async (email, listName) => {
  try {
    let listId = getContactsListId(listName);

    await mailjet
      .post('contact', { 'version': 'v3' })
      .id(email)
      .action('managecontactslists')
      .request({
        'ContactsLists': [
          {
            'Action': 'remove',
            'ListID': listId,
          },
        ],
      });
  } catch (e) {
    // @TODO: deal with error
    console.log(e);
  }
};

const saveContact = async (listName, email, firstname, lastname, confirmationLink) => {
  let listId = getContactsListId(listName);

  let requestBody = {
    'Email': email,
    'Action': 'addforce',
    'IsExcludedFromCampaigns': 'false',
  };

  if (!!firstname) {
    requestBody['firstname'] = firstname;
  }

  if (!!lastname) {
    requestBody['lastname'] = lastname;
  }

  if (!!confirmationLink) {
    requestBody['confirmation_link'] = confirmationLink;
  }

  await mailjet.post('contactslist', {'version': 'v3'})
    .id(listId)
    .action('managecontact')
    .request(requestBody);
};

const sendRequestConfirmationEmail = async (user) => {
  try {
    await mailjet.post('send', { 'version': 'v3.1' }).request({
      "Messages": [
				{
          "From": {
              "Email": "infos@myfa.fr",
              "Name": "L'équipe MYFA"
          },
          "To": [
              {
                  "Email": user.email,
                  "Name": user.firstname,
              }
          ],
          TemplateID: 1907350,
          TemplateLanguage: true,
          "Subject": `${user.firstname}, votre demande est bien enregistrée. On s'appelle prochainement ☎️`,
          "Variables": {
            firstname: user.firstname,
          }
				}
		  ]
    });
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

export {
  addContactToList,
  removeContactFromList,
  saveContact,
  sendEmailToFinance,
  sendRequestConfirmationEmail,
  sendUserBasketComment,
  sendDeliveryRateReminders,
  sendD30Reminders,
  sendOrderConfirmationEmail,
  sendCartReminders,
  sendResetPasswordEmail,
};
