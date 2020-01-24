
const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const saveMember = (req, res, next) => {
  const firstname = req.body.firstname;
  const email = req.body.email;

  // @TODO: SAVE MEMBER

  const request = mailjet.post('send').request({
    FromEmail: 'doris.somon@gmail.com', // @TODO : changer email
    FromName: 'Dodo',
    Subject: 'Bienvenue dans la mif 🌍',
    'Text-part':
      `Bonjour ${firstname} ! Bienvenue dans la grande famille de Myfa !`,
    'Html-part':
      `<h1>Bonjour ${firstname} !</h1> <p>Bienvenue dans la grande famille de Myfa !</p>`,
    Recipients: [
      { Email: email }
    ],
  });

  request.then((result) => {
    console.log(result.body);
    res.status(200);
    res.json({ message: 'user saved' });
  }).catch(err => {
    console.log(err.statusCode)
  });
}

export { saveMember };
