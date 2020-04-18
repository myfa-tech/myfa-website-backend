const getRelation = (type) => {
  const relations = {
    AM: 'Ami(e)',
    CO: 'Conjoint(e)',
    EN: 'Enfant',
    FR: 'Frère',
    GM: 'Grand-Mère',
    GP: 'Grand-Père',
    ME: 'Mère',
    NE: 'Neveu',
    NI: 'Nièce',
    ON: 'Oncle',
    PE: 'Père',
    SO: 'Soeur',
    TA: 'Tante',
  };

  return relations[type];
};

export default getRelation;
