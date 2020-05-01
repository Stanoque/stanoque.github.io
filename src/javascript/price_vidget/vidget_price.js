// This file is hub for price vidget (formatting from number to dollar string format and vice versa)

// Function putting semis after each digit
const putSemi = require('./putSemi.js');

// Function cleaning price string from dollar and semi signs
const cleanPriceString = require('./cleanPriceString.js');

// Re-exporting cleanPriceString
module.exports.cleanPriceString = cleanPriceString;

// Re-exporting putSemi
module.exports.putSemi = putSemi;


module.exports.priceConverter = (price) => {

  // Function is immutable
  let workPrice = price;
  
  // If price is number converting it into dollar format
  if(typeof price === 'number') {
    return '$'+putSemi(workPrice);
  } else {
  
  // Otherwise cleaning the string and parsing float
    return parseFloat(cleanPriceString(workPrice));
  }
};
