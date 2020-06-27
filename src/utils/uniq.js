
const uniq = (collection) => {
  const newCollection =  collection.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  return newCollection;
};

export default uniq;
