
// Count the number of occurences of an object in an array, depending on a certain field
const countBy = (collection, field, value) => collection.filter(item => item[field] === value).length;

export default countBy;
