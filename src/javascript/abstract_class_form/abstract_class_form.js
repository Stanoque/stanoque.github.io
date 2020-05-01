
// This is abstract class from which all form classes inherit
module.exports = class Form {

  /*
    * jQueryModalFade -- jQuery object of modal fade html element, which prevents interacting with the page during async processes
    * jQueryModalAwait -- jQuery object of modal note html element, which shows during async processes
    * jQueryElement -- jQuery object of the form 
   */
  constructor(jQueryModalFade=null, jQueryModalAwait=null, jQueryElement=null){

    this.jQueryElement = jQueryElement;

    // Finding submit button/input
    if(jQueryElement){
      this.jQuerySubmit = jQueryElement.find('[type="submit"]');
    }

    // Incapsulating modals into one
    this.modal = {
      jQueryModalFade: jQueryModalFade,
      jQueryModalAwait: jQueryModalAwait,
    }

  }

  // This method puts placeholders into each text-like input based on their 'name' attribute
  initPlaceholders(){
    this.jQueryElement.find('input').toArray().forEach((element)=>{
      if($(element).attr('type') !== 'checkbox' && $(element).attr('type') !== 'button' && $(element).attr('type') !== 'submit'){
        $(element).addPlaceholder('Enter '+$(element).attr('name')+'...');
      }
    });
  } 

  // This method empties values of the input if they are equal to it's placeholder attribute
  checkPlaceholders(){
    this.jQueryElement.find('input').toArray().forEach((element)=>{
      if($(element).attr('type') !== 'checkbox' && $(element).attr('type') !== 'button' && $(element).attr('type') !== 'submit'){
        if($(element).val() === $(element).attr('my_placeholder')){
          $(element).val('');
        }
      }
    });
  }
  
}