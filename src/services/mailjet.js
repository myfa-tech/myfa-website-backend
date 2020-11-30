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

const sendThankYouForOrderingEmail = async (user) => {
  try {
    await mailjet.post("send", {'version': 'v3.1'})
      .request({
        "Messages": [
          {
            "From": {
              "Email": "infos@myfa.fr",
              "Name": "L'équipe MYFA"
            },
            "To": [{ "Email": user.email }],
            "TemplateID": 1974918,
            "TemplateLanguage": true,
            "Subject": `${user.firstname}, merci d'avoir utilisé MYFA !`,
          }
        ]
      });

    console.log('Confirmation email sent to :', user.email);
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

export {
  addContactToList,
  removeContactFromList,
  saveContact,
  sendRequestConfirmationEmail,
  sendThankYouForOrderingEmail,
  sendResetPasswordEmail,
};
