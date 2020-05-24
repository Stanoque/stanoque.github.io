
// Template text for description
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';

// Good local object representing data gotten from the server
module.exports = function Good(name='', email='', count=0, price=0, russia=[], belorus=[], usa=[]) {

  /*
   * name -- name of the product
   * email -- supplier's email
   * count -- amount of stocks
   * price -- price of the product
   * russia, belorus, usa -- arrays containing flags corresponding to each country's each city 
  */

  this.name = name;
  this.email = email;
  this.count = count;
  this.price = price;

  // If true row corresponding to the good won't render
  this.hidden = false;
  
  // Description shown in modal description
  this.description = loremIpsum;
  

  // Info in which city delivery is possible
  // NOTE: Maybe there is a better way of dealing with delivery data storage
  this.delivery = {
    russia: {
      moscow: russia ? russia[0] ? true : false : false,
      saratov: russia ? russia[1] ? true : false : false,
      spb: russia ? russia[2] ? true : false : false,
    },
    belorus: {
      minsk: belorus ? belorus[0] ? true : false : false,
      hotlany: belorus ? belorus[1] ? true : false : false,
      bobruysk: belorus ? belorus[2] ? true : false : false,
    },
    usa: {
      ny: usa ? usa[0] ? true : false : false,
      washington: usa ? usa[1] ? true : false : false,
      boston: usa ? usa[2] ? true : false : false,
    },
  };

  // Transforms object delivery into array in corresponding order
  // NOTE: Can be refactored through ES6 destructuring operator
  this.deliveryToArray = () => {
    let resultArray = [];
    for(let country in this.delivery){
      for(let city in this.delivery[country]){
        resultArray.push(this.delivery[country][city]);
      }
    }
    return resultArray;
  }

  // This method returns true if delivery is possible in every city of the country
  this.allCities = (country) => {
    let toReturn = true;
    for(let city in this.delivery[country]){
      if(!this.delivery[country][city]){
        toReturn = false;
      }
    }
   
    return toReturn;
  };
}