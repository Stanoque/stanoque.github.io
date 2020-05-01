
// This function puts semis after each digit in the price string
module.exports = function(price){

  // Stringifying price and making the function immutable
  let workString = price.toString();

  // Defining tail, which be evaluated with numbers after period (if there are some)
  let tail = '';

  // Cleaning the string from semis
  workString = workString.replace(/\,/g, '');

  // Slicing tail numbers after period sign
  if(workString.indexOf('.') !== -1){
    tail = workString.slice(workString.indexOf('.'));
    workString = workString.slice(0, workString.indexOf('.'));
  }

  // Splittin string into array and reversing it
  workString = workString.split('');
  workString.reverse();
  
  // And just putting semis after each three numbers
  let counter = 0;
  for(let i = 0; i < workString.length; i++){
    if(counter < 3) {
      counter++;
    } else {
      
      workString.splice(i, 0, ',');
      counter = 0;
    }
    
  }
  
  // Reversing back to normal
  workString.reverse();
  
  // Joining array into resulting string
  workString = workString.join('').concat(tail);
  
  return workString;
}