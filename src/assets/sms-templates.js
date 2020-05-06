
import { getUserByEmail } from '../services/users';

const createMessage = async (templateId, infos) => {
  if (templateId === 'paid-basket') {
    return `
      Bonjour,\n\nVotre proche ${infos.firstname} ${infos.lastname} vous a fait parvenir un panier via MYFA.\n\nMYFA est la nouvelle solution permettant a vos proches de vous faire plaisir tout au long de l'annee. Nous prendrons contact avec vous pour determiner les modalites de livraison.\n\nAu plaisir,\n\nL'equipe MYFA
    `;
  } else if (templateId === 'delivered-basket') {
    return `
      Bonjour,\n\nNous vous confirmons que ${infos.firstname} ${infos.lastname} a bien recu son panier.\n\nMerci pour votre confiance et a bientot.\n\nL'equipe MYFA
    `;
  } else if (templateId === 'delivered-basket-message') {
    let user = {};

    if (!!infos.userEmail) {
      user = await getUserByEmail(infos.userEmail);
    } else {
      user = await getUserByEmail(infos.user.email);
    }

    if (!user) {
      user = infos.user;
    }

    return `
      Bonjour,\n\nVotre proche ${user.firstname} ${user.lastname} vous a adresse ce message :\n\n"${infos.message}"\n\nA bientot,\n\nL'equipe MYFA
    `;
  }
};

export { createMessage };
