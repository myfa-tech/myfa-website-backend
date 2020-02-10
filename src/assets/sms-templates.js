const createMessage = (templateId, user) => {
  if (templateId === 'paid-basket') {
    return `
      Bonjour,\n\nVotre proche ${user.firstname} ${user.lastname} vous a fait parvenir un panier via MYFA.\n\nMYFA est la nouvelle solution permettant à vos proches de vous faire plaisir tout au long de l'année.\n\nNotre équipe vous contactera pour régler les modalités de livraison.\n\nAu plaisir,\n\nL'équipe MYFA
    `;
  }
};

export { createMessage };
