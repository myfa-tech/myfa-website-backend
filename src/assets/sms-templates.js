import getRelation from '../utils/getRelation';

const createMessage = (templateId, infos) => {
  if (templateId === 'paid-basket') {
    return `
      Bonjour,\n\nVotre proche ${infos.firstname} ${infos.lastname} vous a fait parvenir un panier via MYFA.\n\nMYFA est la nouvelle solution permettant à vos proches de vous faire plaisir tout au long de l'année. En cette période de lancement, la livraison se fera le mois prochain par Doris et Florian, co-fondateurs de MYFA.\n\nNous prendrons contact avec vous pour déterminer les modalités de livraison.\n\nAu plaisir,\n\nL'équipe MYFA
    `;
  } else if (templateId === 'delivered-basket') {
    return `
      Bonjour,\n\nNous vous confirmons que votre ${getRelation(infos.relation) || 'proche'} a bien reçu son panier.\n\nMerci pour votre confiance et à bientôt.\n\nL'équipe MYFA
    `;
  }
};

export { createMessage };
