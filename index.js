"use strict";

/*
 * NOTE: This project uses 'browserify' modules through require syntaxis
 * See more on this topic in documentation
*/

// Local object that represents data of a real product gotten from the server
const Good = require('./src/javascript/good_local_object.js');

// Form for adding a new good to the page
const FormAdd = require('./src/javascript/list_local_object.js').FormAdd;

// Form to navigate (search) through goods list
const FormSearch = require('./src/javascript/class_formSearch.js');

// Global const that represents time it takes for server to respond
const serverResponseTime = require('./src/javascript/const_serverResponseTime.js');

// Global object that contains all local good objects
const LIST = require('./src/javascript/list_local_object.js').LIST;

// Initial base of products.
// NOTE: It is possible to generate those.
const initialDatabase = [
  new Good('Lorem ipsum', 'someemail@gmail.com', 3, 100, [true, true, true],[true, true, true],[true, true, true]),
  new Good('Dolor sit amet', 'someeail@gmail.com', 4, 1000, [true, true, true],[false, false, true],[true, true, true]),
  new Good('Ipsum amet', 'smeemail@gmail.com',11, 10, [true, true, true],[false, true, true],[true, true, true]),
  new Good('Lorem sit', 'somemail@gmail.com', 1, 1, [true, true, true],[true, true, true],[true, true, true])
]

// I implemented the placeholder functionality via Object.prototype method more or less for educational purposes
// Maybe it's better to integrate this into Form abstract class
Object.defineProperty(Object.prototype, 'addPlaceholder',{
  value : function(text) {

    // Remembering context for ES6 functions
    const currentElement = this;

    currentElement.val(text);

    // For color
    currentElement.addClass('placeholder');

    // Imitating HTML5 inputs' placeholders
    currentElement.attr('my_placeholder', text);

    // When focused placeholder is hid
    currentElement.focus(()=>{
      currentElement.removeClass('placeholder');
      if(currentElement.val() === text){
        currentElement.val('');
      }
    });

    // When blured placeholder is shown
    currentElement.blur(()=>{
      if(currentElement.val() === ''){
        currentElement.val(text);
        currentElement.addClass('placeholder');
      }
    })

    // When input starts, placeholder is hid 
    currentElement.on('input',()=>{

      // Yup, it looks awful, but really easy to understand: 
      // If input starts (either by entering or deleting) placeholder (or what remains of it) deletes      
      if(currentElement.val().match(currentElement.attr('my_placeholder')) || currentElement.val().match(currentElement.attr('my_placeholder').slice(0, currentElement.attr('my_placeholder').length - 1))){
        currentElement.val(currentElement.val().replace(currentElement.attr('my_placeholder'), ''));
        currentElement.val(currentElement.val().replace(currentElement.attr('my_placeholder').slice(0, currentElement.attr('my_placeholder').length - 1), ''));
        currentElement.removeClass('placeholder');
      }
    });

  },
  enumerable : false
});

/*
 * NOTE: This is global scope (body of index.js file) of the project
 * Only 'static' elements are being rendered here
 * More on 'static' and 'dynamic' elements in documentation
*/


// Rendering form for adding goods
let addForm = new FormAdd(null, $('#modal_fade'), $('#loading'), 'modal_add', $('#good_add'), $('#modal_edit_template'), $('#edit_cities_template'), LIST);

// Rendering form for searching goods
let searchForm = new FormSearch($('#modal_fade'), $('#loading'),  $('#search_form'));

// Triangles regulate sorting direction
$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
  LIST.ascedningName = !LIST.ascedningName;

});

$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
  LIST.ascedningPrice = !LIST.ascedningPrice;
});

// If certain table heads are clicked, the LIST will perfom sorting
$('.sort_name').click(()=>{
  LIST.sortByName();
});

$('.sort_price').click(()=>{
  LIST.sortByPrice();
});


// Showing static modals before inital response
$('#modal_fade').addClass('modal_fade_trick');
$('#loading').css('display', 'block');


// Async initial response from the server
const initialGet = new Promise((resolve, reject) => {
  
    setTimeout( () => {
      initialDatabase.forEach((good)=>{
        LIST.push(good);
        resolve('Initialization successfull');
      })} , serverResponseTime);
    }
);

// Hiding static modals after initial response
initialGet.then( (resolved) => {
    LIST.render();
    $('.loading').css('display', 'none');
    $(".modal_fade").removeClass("modal_fade_trick");
  }
);

// Rendering dynamic elements
LIST.render();