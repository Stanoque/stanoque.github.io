
// Importing ORDER local object. It handles dynamic elements
const ORDER = require('./src/javascript/order_local_object.js').ORDER;

// Importing food classes
const Hamburger = require('./src/javascript/class_hamburger.js').Hamburger;
const Stuffing = require('./src/javascript/class_hamburger.js').Stuffing;
const Salad = require('./src/javascript/class_salad.js').Salad;
const Drink = require('./src/javascript/class_drink.js').Drink;


// Not sure if 'forEach' method is ES6, but I wrote my polyfill
Object.defineProperty(Array.prototype, 'myForEach', {

  value: function(callback){

    for(let i = 0; i < this.length; i++){

      // Invoking callback with apparent context
      callback.call(this, this[i], i);
    }

  },

  enumerable: false,
});


// This method turn first letter in the string to upper case
Object.defineProperty(String.prototype, 'myCapitalize', {

  value: function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
  },

  enumerable: false,
});

const SELECT = $('#select');

// <option> html elements from <select>
const OPTIONS = $('#select option').toArray();

// Forms for adding a certain food
const FOODS = $('.food').toArray();

// Aside section of the page to chose desirable position and it's parameters
const ASIDE = $('aside');

SELECT.change( function(){

  //All forms are hidden
  FOODS.myForEach(function(element){

    $(element).addClass('hidden');

  })

  // Except for the needed one
  ASIDE.find('.'+SELECT.find(':selected').val()).removeClass('hidden');

});

// Setting options to show corresponding foods forms
// NOTE: This event listener DOES NOT WORK ON MOBILE VERSION
// OPTIONS.myForEach(function(element){
 
//   $(element).click(function(){

//     // All forms are hidden
//     FOODS.myForEach(function(element){

//       $(element).addClass('hidden');

//     })

//     // Except for the needed one
//     ASIDE.find('.'+$(element).val()).removeClass('hidden');

//   })
// });


// Hamburger adding form submition
$('.aside__burgers_form').submit( function(event) {

  event.preventDefault();
  
  // Forming new Hamburger object (with stuffing object inside) initialized with checked radio-buttons
  // And adding it to the order 
  ORDER.add(new Hamburger($('.aside__burgers_form').find('.size_radio:checked').val(),
            new Stuffing($('.aside__burgers_form').find('.stuffing_radio:checked').val())));

});


// Salad adding form submition
$('.aside__salads_form').submit( function(event) {

  event.preventDefault();

  // Forming new Salad object initialized with checked radio-buttons and adding it to the order
  ORDER.add(new Salad($('.aside__salads_form').find(':checked').val()));

});


// Drink adding form submition
$('.aside__drinks_form').submit( function(event) {

  event.preventDefault();

  // Forming new Drink object initialized with checked radio-buttons and adding it to the order
  ORDER.add(new Drink($('.aside__drinks_form').find(':checked').val()));

});

// First render to initialize dynamic elements
ORDER.render();