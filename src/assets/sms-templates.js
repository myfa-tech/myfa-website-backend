const createMessage = (templateId, user) => {
  if (templateId === 'paid-basket') {
    return `
      Bonjour,\n\nVotre proche ${user.firstname} ${user.lastname} vous a fait parvenir un panier via MYFA.\n\nMYFA est la nouvelle solution permettant à vos proches de vous faire plaisir tout au long de l'année : la livraison se fera le mois prochain par Doris et Florian, co-fondateurs de MYFA.\n\nNous prendrons contact avec vous pour régler les modalités de livraison.\n\nAu plaisir,\n\nL'équipe MYFA
    `;
  }
};

export { createMessage };
