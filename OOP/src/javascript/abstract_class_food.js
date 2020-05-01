/*
 * OPTIONS' NAMES
*/


// Hamburgers
const BURGER_SM_NAME = require('./consts_food_params.js').BURGER_SM_NAME;
const BURGER_BIG_NAME = require('./consts_food_params.js').BURGER_BIG_NAME;

// Stuffings
const STUFF_CHEESE_NAME = require('./consts_food_params.js').STUFF_CHEESE_NAME;
const STUFF_SALAD_NAME = require('./consts_food_params.js').STUFF_SALAD_NAME;
const STUFF_POTATO_NAME = require('./consts_food_params.js').STUFF_POTATO_NAME;

// Salads
const SALAD_CEASER_NAME = require('./consts_food_params.js').SALAD_CEASER_NAME;
const SALAD_OLIVIE_NAME = require('./consts_food_params.js').SALAD_OLIVIE_NAME;

// Drinks
const DRINK_COLA_NAME = require('./consts_food_params.js').DRINK_COLA_NAME;
const DRINK_COFFEE_NAME = require('./consts_food_params.js').DRINK_COFFEE_NAME;



/*
 * PRICES
*/


const BURGER_SM_PRICE = require('./consts_food_params.js').BURGER_SM_PRICE;
const BURGER_BIG_PRICE = require('./consts_food_params.js').BURGER_BIG_PRICE;

// Stuffings
const STUFF_CHEESE_PRICE = require('./consts_food_params.js').STUFF_CHEESE_PRICE;
const STUFF_SALAD_PRICE = require('./consts_food_params.js').STUFF_SALAD_PRICE;
const STUFF_POTATO_PRICE = require('./consts_food_params.js').STUFF_POTATO_PRICE;

// Salads
const SALAD_CEASER_PRICE = require('./consts_food_params.js').SALAD_CEASER_PRICE;
const SALAD_OLIVIE_PRICE = require('./consts_food_params.js').SALAD_OLIVIE_PRICE;

// Drinks
const DRINK_COLA_PRICE = require('./consts_food_params.js').DRINK_COLA_PRICE;
const DRINK_COFFEE_PRICE = require('./consts_food_params.js').DRINK_COFFEE_PRICE;


/*
 * CALORIES
*/

// Hamburgers
const BURGER_SM_CALS = require('./consts_food_params.js').BURGER_SM_CALS;
const BURGER_BIG_CALS = require('./consts_food_params.js').BURGER_BIG_CALS;

// Stuffings
const STUFF_CHEESE_CALS = require('./consts_food_params.js').STUFF_CHEESE_CALS;
const STUFF_SALAD_CALS = require('./consts_food_params.js').STUFF_SALAD_CALS;
const STUFF_POTATO_CALS = require('./consts_food_params.js').STUFF_POTATO_CALS;

// Salads
const SALAD_CEASER_CALS = require('./consts_food_params.js').SALAD_CEASER_CALS;
const SALAD_OLIVIE_CALS = require('./consts_food_params.js'). SALAD_OLIVIE_CALS;

// Drinks
const DRINK_COLA_CALS = require('./consts_food_params.js').DRINK_COLA_CALS;
const DRINK_COFFEE_CALS = require('./consts_food_params.js').DRINK_COFFEE_CALS;


module.exports.FOOD = {

  // Sets product's price depending on the option of the food
  _definePrice(option) {
    return this._prices[option];
  },

  // Sets product's calories depending on the option of the food
  _defineCalories(option) {
    return this._calories[option];
  },

  // Type is basic type of the food (Hamburger/Salad/Drink)
  getType() {
    return this.type;
  },

  // Option is advanced type of the food (For hamburgers it's size, for drink this is either cola or coffee, etc)
  getOption() {
    return this.option;
  },

  // Name is option + type (and stuffing in case of hamburgers)
  getName() {
    return this.option + ' ' + this.type + (this.stuffing ? ' with ' + this.stuffing.getName() : '');
  },

  // Gettin price. If object is hamburger -- price is calculated via corresponding method
  getPrice() {
    return (this._calculatePrice ? this._calculatePrice() : this.price);
  },

   // Gettin calories. If object is hamburger -- calories are calculated via corresponding method
  getCalories() {
    return (this._calculateCalories ? this._calculateCalories() : this.calories);
  },

  // Parameters are price + calories with measurement units. It takes hamburger's stuffing in consideration too
  getParameters() {
    return (this._calculatePrice ? this._calculatePrice() : this.price) + 'tg' + ' ' 
         + (this._calculateCalories ? this._calculateCalories() : this.calories) + 'cal';
  },

  // getName + getParameters. Mainly for testing matters
  getFullDescription() {
    return this.getName() + ' ' + this.getParameters();
  },

  // Size is method specific for hamburgers. Not sure if it's needed
  geSize() {
    return this.size ? this.size : '';
  },

  // Stuffing is method specific for hamburgers. Not sure if it's needed
  getStuffing() {
    return this.stuffing ? this.stuffing : '';
  },


  // 'Database' with prices for each food option
  _prices: {

    [BURGER_SM_NAME]: BURGER_SM_PRICE,
    [BURGER_BIG_NAME]: BURGER_BIG_PRICE,

    [STUFF_CHEESE_NAME]: STUFF_CHEESE_PRICE,
    [STUFF_SALAD_NAME]: STUFF_SALAD_PRICE,
    [STUFF_POTATO_NAME]: STUFF_POTATO_PRICE,

    [SALAD_CEASER_NAME]: SALAD_CEASER_PRICE,
    [SALAD_OLIVIE_NAME]: SALAD_OLIVIE_PRICE,

    [DRINK_COLA_NAME]: DRINK_COLA_PRICE,
    [DRINK_COFFEE_NAME]: DRINK_COFFEE_PRICE,

  },

  // 'Database' with calories for each food option
  _calories: {

    [BURGER_SM_NAME]: BURGER_SM_CALS,
    [BURGER_BIG_NAME]: BURGER_BIG_CALS,

    [STUFF_CHEESE_NAME]: STUFF_CHEESE_CALS,
    [STUFF_SALAD_NAME]: STUFF_SALAD_CALS,
    [STUFF_POTATO_NAME]: STUFF_POTATO_CALS,

    [SALAD_CEASER_NAME]: SALAD_CEASER_CALS,
    [SALAD_OLIVIE_NAME]: SALAD_OLIVIE_CALS,

    [DRINK_COLA_NAME]: DRINK_COLA_CALS,
    [DRINK_COFFEE_NAME]: DRINK_COFFEE_CALS,
    
  },


}
