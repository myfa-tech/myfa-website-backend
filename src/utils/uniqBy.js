const uniqBy = (arrayToFilter, field) => {
  if (!!arrayToFilter) {
    for (let i=0; i<arrayToFilter.length; i++) {
      for (let j=0; j<arrayToFilter.length; j++) {
        if (arrayToFilter[i][field] === arrayToFilter[j][field] && i !== j) {
          arrayToFilter = arrayToFilter.splice(j, 1);
        }
      }
    }
  }

  return [...arrayToFilter];
};

export default uniqBy;
