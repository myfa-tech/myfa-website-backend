
const containsObjectByField = (arr, object, field) => arr.findIndex((other) => JSON.stringify(other[field]) === JSON.stringify(object[field])) >= 0;

const uniqBy = (collection, field) => {
  const newCollection = [];

  collection.forEach((item) => {
    if (!containsObjectByField(newCollection, item, field)) {
      newCollection.push(item);
    }
  });

  return newCollection;
};

export default uniqBy;
