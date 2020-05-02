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


// Additional class for storagin position html-element and reference to corresponding food item
function Position(jQueryElement, foodItem) {
  
  // jQuery object of the html element
  this.jQueryElement = jQueryElement;

  // Reference to the corresponding food item
  this.foodItem = foodItem;
}

// Local object handling dynamic elements
module.exports.ORDER = {
  
  // Array in which food items are storaged
  collection: [],

  // Forms. These are used to initialize position adding forms
  hamburgersForm: $('.aside__burgers_form'),
  saladsForm: $('.aside__salads_form'),
  drinksForm: $('.aside__drinks_form'),

  // This could come in handy
  forms: [this.hamburgersForm, this.saladForm, this.drinksForm],

  // Template for adding position html element
  positionTemplate: _.template($('#position_template').html()),


  // Overriding (defining) myForEach for ORDER LO
  myForEach(callback) {
    this.collection.myForEach(callback);
  },

  // Pushes item to the collection and re-renders 
  add(item) {
    this.collection.push(item);
    this.render();
  },

  // Delets item from the collection and re-renders
  delete(item) {
    this.collection.splice(this.collection.indexOf(item), 1);
    this.render();
  },

  // Calculates total price of the order vie 'reduce' method
  totalPrice() {
    return this.collection.reduce(function(accumulator, current){
      return accumulator + current.getPrice();
    }, 0)
  },

  // Calculates total calories of the order via 'reduce' method
  totalCalories() {
    return this.collection.reduce(function(accumulator, current){
      return accumulator + current.getCalories();
    }, 0)
  },

  // Initializes position adding form
  // NOTE: Maybe it's better to incapsulate this method as function into 'render' method
  inputInit(form, input, text){
    form.find(input).val(text);
    form.find(input).siblings('label').text(text.myCapitalize());
  },

  // Main method that initializes food adding forms, and render dynamic elements (positions) into page
  render() { 
    

    /*
     * Initializing position adding forms
    */

    // Hamburgers (+stuffings)
    this.inputInit(this.hamburgersForm, '#size--big', BURGER_BIG_NAME);
    this.inputInit(this.hamburgersForm, '#size--small', BURGER_SM_NAME);
    this.inputInit(this.hamburgersForm, '#stuffing--cheese', STUFF_CHEESE_NAME);
    this.inputInit(this.hamburgersForm, '#stuffing--salad',  STUFF_SALAD_NAME);
    this.inputInit(this.hamburgersForm, '#stuffing--potato', STUFF_POTATO_NAME);

    // Salads
    this.inputInit(this.saladsForm, '#salad--ceaser', SALAD_CEASER_NAME);
    this.inputInit(this.saladsForm, '#salad--olivie', SALAD_OLIVIE_NAME);

    // Drinks
    this.inputInit(this.drinksForm, '#drink--coffee', DRINK_COFFEE_NAME);
    this.inputInit(this.drinksForm, '#drink--cola', DRINK_COLA_NAME);

    // Thus ES5 functions can find info storaged in this (meaning ORDER)
    const positionTemplate = this.positionTemplate;

    // Thus ES5 function can understand what should be meant by 'this'
    // There are other paths to solve this, but I'll stick to that
    const absoluteThis = this;

    // Emptiing order list before rendering it anew
    $('#positions').empty();

    // Rendering position html elements where they belong
    this.collection.myForEach(function(element, index){

      $(positionTemplate({

        // ID of the each position is 'position_<corresponding_item_index_in_collection>' 
        id: 'position_'+index,

        // 'myCapitalize' method is defined directly in String.prototype in index.js
        // It turns first letter to upper case
        description: element.getName().myCapitalize(),
        parameters: element.getParameters(),
      })
      ).appendTo('#positions')

      // Writing position object to corresponding food item
      element.position = new Position($('#position_'+index), element);
      
      // Handler for clicking delete position button event 
      const deleteHandler = function() {
        this.delete(element);
        this.render();
      }

      // Apparently binding context to the handler
      element.position.jQueryElement.find('.position_delete').click(deleteHandler.bind(absoluteThis));

    })

    // Clear button delets all positions from the order
    $('#clear').click(function(){
      absoluteThis.myForEach(function(element){
        absoluteThis.delete(element);
      })
    })

    // Submit is 'Commit' button. It's meaning that order is paid
    $('.content__form').submit(function(event){
      event.preventDefault();
      $('button').attr('disabled', true);
    })
    
    // Calculating and rendering total price and total calories
    $('#total_price').html('Total price: '.concat(this.collection.length > 0 ? this.totalPrice() : '0') + 'tg');
    $('#total_calories').text('Total calories: '.concat(this.collection.length > 0 ? this.totalCalories() : '0') + 'cal');
  },

}