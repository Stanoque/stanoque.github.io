// This simple function just cleans price string from semis and dollars

module.exports = function(price){
  return price.replace(/\,/g, '').replace('$', '');
};