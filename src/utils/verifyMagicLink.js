
import shajs from 'sha.js';

const verifyMagicLink = (user, magicLink) => {
  let hash = shajs('sha256').update(`${user.firstname}--${user.email}`).digest('hex');

  return (hash == magicLink);
};

export default verifyMagicLink;
