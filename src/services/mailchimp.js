import Mailchimp from 'mailchimp-api-v3'
 
const mailchimpAPIKey  = '4c8e36828bdf708259a9803abdbdafcb-us3' // Add API KEY
const newsletterListID = 'de0afe373d'

const mailchimp = new Mailchimp(mailchimpAPIKey)

const saveMember = (req, res, next) => {
  const { email, mergeFields } = req.body

  if (!email || !mergeFields) {
    res.status(400)
    res.send('missing field')
    return
  }

  mailchimp.post(`/lists/${newsletterListID}/members`, {
    email_address: email,
    status: 'subscribed',
    merge_fields: mergeFields
  }).then((results) => {
    res.status(200)
    res.json({ message: 'user saved' })
  }).catch((err) => {
    console.log(err)
    res.status(500)
    res.send('something went wrong')
  })
}

export { saveMember }
