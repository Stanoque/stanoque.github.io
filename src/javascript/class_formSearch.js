
// Importing Form abstract class
const Form = require('./abstract_class_form/abstract_class_form.js');

// Importing LIST object
const LIST = require('./list_local_object.js').LIST;


// This class inherits from Form abstract class and corresponds to search form static element 
// (consisting from 1 input and 1 submit button)

module.exports = class formSearch extends Form {

   /*
    * jQueryModalFade -- jQuery object of modal fade html element, which prevents interacting with the page during async processes
    * jQueryModalAwait -- jQuery object of modal note html element, which shows during async processes
    * jQueryElement -- jQuery object of the form 
   */

  constructor(jQueryModalFade=null, jQueryModalAwait=null, jQueryElement=null){
    super(jQueryModalFade, jQueryModalAwait, jQueryElement);

    // Setting placeholders
    this.initPlaceholders();
    
    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit();
    })

    // Dealing with features of the search form placeholder -- making the submit event neglecting value equal to placeholder text
    this.jQueryElement.find('input').click(()=>{
      if(this.jQueryElement.find('input').val() === this.jQueryElement.find('input').attr('my_placeholder')){
        this.jQueryElement.find('input').val('');
        this.jQueryElement.find('input').removeClass('placeholder');
      }
    })
  }

  submit(){

    this.checkPlaceholders();

    // RegExp to match to name fields 
    const regExpToFilter = new RegExp(this.jQueryElement.find('input').val(), 'i');

    // If name does not match -- good will be hidden during re-render
    LIST.forEach((good)=>{
      if(!good.name.match(regExpToFilter)){
        good.hidden = true; 
      } else {
        good.hidden = false;
      }
    });

    // Re-rendering
    LIST.render();
    
    // Setting placeholders back
    this.initPlaceholders();
  }
  
}