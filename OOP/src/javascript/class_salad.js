/*
 * OPTIONS' NAMES
*/

const SALAD_CEASER_NAME = require('./consts_food_params.js').SALAD_CEASER_NAME;
const SALAD_OLIVIE_NAME = require('./consts_food_params.js').SALAD_OLIVIE_NAME;

// Importing FOOD object (considering it abstract class)
const FOOD = require('./abstract_class_food.js').FOOD;

// Constructor for drinks objects
module.exports.Salad = function(option) {
  
  this.type = 'salad';

  // Option is 'cola' by default
  this.option = option || 'ceaser';

  // Depending on the chosen option, parameters are founded automatically in the prototype
  this.price = this._definePrice(this.option);
  this.calories = this._defineCalories(this.option);


}

// Setting prototype
module.exports.Salad.prototype = FOOD;
