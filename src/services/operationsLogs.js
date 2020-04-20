import colors from 'colors';

const log = (user, operation, entity, field, newValue, oldValue = null) => {
  const newDate = new Date().toLocaleDateString('fr-FR');
  const log = `${newDate} : [${user}] [${operation}] [${entity}].${field} ${oldValue ? 'from [' + oldValue + ']' : ''} to ${newValue}`;
  console.log(colors.yellow(log));
};

export { log };