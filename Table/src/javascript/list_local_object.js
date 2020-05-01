/*
 * NOTE: This file mostly handles rendering dynamic elements
 * More on dynamic elements in documentation
*/

// Global const that represents time it takes for server to respond
const serverResponseTime = require('./const_serverResponseTime.js');

// Form for adding a new good to the page
const Good = require('./good_local_object.js');

// These three are vidget for converting price number into pointed dollar string format and vice versa

// The body of the vidget
const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;

// Function that puts semis after each digit
const putSemi = require('./price_vidget/vidget_price.js').putSemi;

// Function that cleans string preparing it to be parsed into float
const cleanPriceString = require('./price_vidget/vidget_price.js').cleanPriceString;

// Row local object that represent table row
// Contains delete and description modals
const Row = require('./row_local_object.js');

// Abstract class from which FormGood class inherits
const Form = require('./abstract_class_form/abstract_class_form.js');

// Class for good' data modal, from which subclasses FormAdd and FormEdit inherit
class FormGood extends Form {
  
  /*
   * good -- associated with the form good local object
   * jQueryModalFade -- jQuery object of modal fade html element, which prevents interacting with the page during async processes
   * jQueryModalAwait -- jQuery object of modal note html element, which shows during async processes
   * modalWindow -- id of the future html container element
   * jQueryTrigger -- jQuery object of html element, that envokes event interacting with the form
   * jQueryTemplate -- jQuery object of lodash template
   * citiesTemplate -- id of the cities lodah template
  */
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp){
    super(jQueryModalFade, jQueryModalAwait);

    this.good = good;
    this.jQueryTemplate = jQueryTemplate;

    // If constructor got good object extract values from it
    // If not, set them to empty strings
    this.name = good ? this.good.name : '';
    this.email = good ? this.good.email : '';
    this.count = good ? this.good.count : '';
    this.price = good ? this.good.price : '';

    this._render(modalWindow);
    

  }


  _render(id, citiesTemp) {
    
    // By default the form is rendered empty
    $(_.template(this.jQueryTemplate.html())({
      modalId: id,
      email: '',
      name: '',
      count: '',
      price: '$',
      saveId: 'save_add',
      cancelId: 'cancel_add',
    })).appendTo('.main');
  }

  // This method defines notes fields with jQuery object of notes, which indicate invalid input
  _defineNotes() {
    this.jQueryNotes = {};
    this.jQueryNotes.nameShort = this.jQueryElement.find('.invalid_name_short'); 
    this.jQueryNotes.nameLong = this.jQueryElement.find('.invalid_name_long'); 
    this.jQueryNotes.email = this.jQueryElement.find('.invalid_email'); 
    this.jQueryNotes.count = this.jQueryElement.find('.invalid_count');
    this.jQueryNotes.price = this.jQueryElement.find('.invalid_price');
  }

  // This method dictates format to count and price inputs
  inputsFormat() {

    // On input
    this.jQueryCount.on('input', ( function(){

      // RegExp to find non-numerical chars
      const nonDigitRegExp = /\D/;
     
      // Non-numerical chars are prohibited to input
      $(this).val($(this).val().replace(nonDigitRegExp,''));
      

    }));

    // On input
    this.jQueryPrice.on('input', (function(){
      
      // RegExp to find non-numerical and non-dot chars
      const nonDigitRegExp = /[^0-9.]/;

      // Prohibites chars are replaced with empty string
      $(this).val($(this).val().replace(nonDigitRegExp,''));

      // Basically this code allows only one dot in the field
      // The dot can be 'moved' forward, but not backwards -- that's kinda an issue tbh
      // NOTE: Think how to rewrite this to deal with 'past' and 'present' dot
      if($(this).val().match(/\./g)){
          
          if($(this).val().match(/\./g).length > 1){
          
            const valArray = $(this).val().split('');
            valArray[valArray.indexOf('.')] = '';
            $(this).val(valArray.join(''));
          }
      }
    
    }));
    
    // During focus
    this.jQueryPrice.focus(function(){

      // Dollar sign is hid
      let regExpDollar = /\$/;

      $(this).val($(this).val().replace(/\,/g, ''));
      $(this).val($(this).val().replace(regExpDollar, ''));
    });

    // Out of focus
    this.jQueryPrice.blur(function(){

      
      let regExpDollar = /\$/;

      // Semis are put to divide digits
      if(!isNaN(parseFloat($(this).val()))){
        $(this).val(putSemi($(this).val()));

        // And dollar sign is added to the beggining of the string
        if(!$(this).val().match(regExpDollar)){
          $(this).val('$'.concat($(this).val()));
        }
      }

      // This code deletes all dots except one
      const strayDotRegExp = /\.(?!\d)/g;

      $(this).val($(this).val().replace(strayDotRegExp,''));
      
      if($(this).val().charAt(0) === '.'){
        $(this).val($(this).val().slice(1));
      }
    });
    
  }

  // Modal window is being shown
  open() {
    this.modal.jQueryModalFade.addClass('modal_fade_trick');
    this.modal.jQueryModalWindow.css('display', 'block');
    this.jQueryName.focus();
  }

  // Modal window is being hid
  cancel() {
    this.modal.jQueryModalFade.removeClass('modal_fade_trick');
    this.modal.jQueryModalWindow.css('display', 'none');
    this.clear();
    this.clearInvalid();
    this.hideNotes();
    if(!this.good){
      this.initPlaceholders();
    }
  }

  // During async processes certain modals are shown
  loading() {
    this.modal.jQueryModalFade.addClass('modal_fade_trick');
    this.modal.jQueryModalAwait.css('display', 'block');
    this.modal.jQueryModalWindow.css('display', 'none');
  }

  // After async those modals are hid again
  endLoading() {
    this.modal.jQueryModalFade.removeClass('modal_fade_trick');
    this.modal.jQueryModalAwait.css('display', 'none');
  }

  // This method clears form after redacting. Successful or canceled alike.
  clear() {
    this.jQueryName.val('');
    this.jQueryEmail.val('');
    this.jQueryCount.val('');
    this.jQueryPrice.val('$');

    this.jQueryCities.selectAll.prop('checked', false);
    this.jQueryCities.cities.prop('checked', false);

    this.clearInvalid();
    this.hideNotes();
  }

  // This method clears 'invalid' class from inputs
  clearInvalid() {

    this.jQueryInputs.forEach((element)=>{
      element.removeClass('invalid');
    });
  
  }

  // This method shows notes indicating invalid input
  // It operates by recognizing class of the input (and in the case of the name -- length of the value)
  // Thus showing only related notes
  showNotes(input) {
    
    if(input.hasClass('name')){
  
      this.jQueryNotes.nameShort.addClass('hidden');
      this.jQueryNotes.nameLong.addClass('hidden');
      if(input.val().length < 5){
        this.jQueryNotes.nameShort.removeClass('hidden');
      } else {
        his.jQueryNotes.nameLong.removeClass('hidden');
      }
    } else {
      if(input.hasClass('supplier_email')){
        this.jQueryNotes.email.removeClass('hidden');
      } else {
        if(input.hasClass('count')){
          this.jQueryNotes.count.removeClass('hidden');
        }
        else {
          this.jQueryNotes.price.removeClass('hidden');
        }
      }
    }

  }

  // This method does backward process to showNotes
  // But due to some features (two notes specifically for 'name' input)
  // It's more concise than its' counterpart
  hideNote(input) {
    let name = input.attr('name');

    if(name === 'name'){
      this.jQueryNotes.nameShort.addClass('hidden');
      this.jQueryNotes.nameLong.addClass('hidden');
    } else {
      this.jQueryNotes[name].addClass('hidden');
    }

  }

  // This method hides all notes of invalid input
  hideNotes() {
    for(let note in this.jQueryNotes){
      this.jQueryNotes[note].addClass('hidden');
    }
  }

  // Checks if name's value is correct
  isNameValid(name) {
    let workString = name;
    let regExpOnlySpaces = /\S/;
    
    if(!workString.match(regExpOnlySpaces)){
      return false;
    }
    if(workString.length > 15 || workString.length < 5){
      return false;
    }
  
    return true;
  
  }

  // Checks if email's value is correct
  isEmailValid(email){
    
    // Long and scary RegExp. Didn't come up with it, found in the net
    // Seems to work!
    let regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if(email.match(regExpEmail)){
      return true;
    } else {
      return false;
    };
  
  }


  /* 
   * NOTE: I am aware that these two can be presented by one method
   * But I'll take responsibilty to say that in terms of further development
   * It's more far-sighted to leave them separated
  */ 

  // Checks if count's value is correct
  isCountValid(count) {

    if(isNaN(parseInt(count))){
      return false;
    }
  
    if(count.length > 0){
      return true;
    } else {
      return false;
    }

  }

  // Checks if price's value is correct
  isPriceValid(price){

    if(isNaN(parseFloat(price))){
      return false;
    }
  
    if(price.length > 0){
      return true;
    } else {
      return false;
    }
  };
  

  // This method is envoked during 'submit' event
  submit() {

    // Referring to parent abstract class method, which checks if input values are (not) their placeholders' values
    // If they are, the values are set to empty strings
    this.checkPlaceholders();

    // This array exist to support older pattern
    let forms = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    
    // Same here
    let validation = [this.isNameValid(forms[0].val()), this.isEmailValid(forms[1].val()), this.isCountValid(forms[2].val()), this.isPriceValid(cleanPriceString(forms[3].val()))];
  
    // If all values are valid
    if(validation.every((element)=>{return element;})){

      // Array with city checkboxes jQuery elements
      let cities = this.jQueryElement.find('.city').toArray();

      // Array in which we push flags depending on checkboxes values
      let delivery = [];
  
      // Pushing flags
      cities.forEach((city)=>{
        delivery.push($(city).prop('checked') ? true : false);
      });
      
      // Async process of adding the new good
      const addPromise = LIST.add(new Good(
                this.jQueryName.val(),
                this.jQueryEmail.val(),
                this.jQueryCount.val(),
                priceConverter(this.jQueryPrice.val()), 
                delivery.slice(0, 3), 
                delivery.slice(3, 5), 
                delivery.slice(5, 9), 
      ))
            
      // Async process starts
      this.loading();
  
      // When it resolved proceed
      addPromise.then((resolved) => {

        // New good in the list, re-render table
        LIST.render();

        // Hidding modals
        this.endLoading();

        // Clearing form
        this.clear();
        this.clearInvalid();

        // Setting placeholders back
        this.initPlaceholders();
      }  
      );
  
     
  
  
    } else {

      // Clear invalid classes before setting anew
      this.clearInvalid();

      // If an input didn't come through validation
      // Through *note(s) methods indicating notes are shown
      validation.forEach((element, index)=>{
        if(!element){
          forms[index].addClass('invalid');
          this.showNotes(forms[index]);
        } else {
          this.hideNote(forms[index]);
        }
      });
  
      // Focusing in the first invalid input field
      forms[validation.indexOf(false)].focus();
    }
  }
 
  // Method append delivery checbox inputs to modal form
  appendDelivery(citiesTemp) {
    
    // Subfunction, appends one pair country-cities checkboxes to the form
    const renderCities = (country, cityNames=[], allChecked) => {

    /*
     * country -- name of the country
     * cityNames -- 3 city names
     * allChecked -- true if delivery is made to each city of the list
    */      
    
    // flags indicating that delivery is possible for this city
    let delivery = [];
  
    if(this.good){
      for(let city in this.good.delivery[country]){
        delivery.push(this.good.delivery[country][city]);
      }
    }
   
    // Appending form
    $(_.template($(citiesTemp).html())({
      country: country,
      city_1: cityNames[0],
      city_2: cityNames[1],
      city_3: cityNames[2],
      class_1: cityNames[0].toLowerCase(),
      class_2: cityNames[1].toLowerCase(),
      class_3: cityNames[2].toLowerCase(),
      attr_1: delivery[0] ? 'checked' : null,
      attr_2: delivery[1] ? 'checked' : null,
      attr_3: delivery[2] ? 'checked' : null,
      attr_4: allChecked ? 'checked' : null,
    })).appendTo(this.jQueryElement.find('.cities'));
    };
    
    // Appending forms for each country
    renderCities('russia', ['Moscow', 'Saratov', 'SPb'], this.good ? this.good.allCities('russia') : false);
    renderCities('belorus', ['Minsk', 'Hotlany', 'Bobruysk'], this.good ? this.good.allCities('belorus') : false);
    renderCities('usa', ['NY', 'Washington', 'Boston'], this.good ? this.good.allCities('usa') : false);

  
    // Options array of country select form
    let countries = this.jQueryElement.find('.countries').children();
  
    countries = countries.toArray();
  
    // Forming new array, containing cities for each country in respecitve order
    const cities = countries.map((country)=>{
  
      let citiesClass = ' .'+$(country).attr('class')+'_cities';
      return this.jQueryElement.find(citiesClass);
  
    });
  
    // The first option is shown by default
    $(cities[0]).removeClass('hidden');
  
    // Subfunction which realizes mechanism of corresponding rendering of pair: 
    // option[class=country] --> checkbox[class=country_cities]
    const migrate = (toCountry) => {
  
      $(toCountry).click(() => {
  
        cities.forEach((country)=>{
          $(country).addClass('hidden');
        });
  
        const citiesClass = '.'+$(toCountry).attr('class')+'_cities';
        this.jQueryElement.find(citiesClass).removeClass('hidden');
    
      });
    }
  
    // Setting handlers for all options
    countries.forEach((country)=>{
      migrate(country);
    });
  
        
    // If select_all checkbox is clicked, all checboxes in the option get 'checked' attribute
    const selectAll = (countrySelectAll) => {
      $(countrySelectAll).click(() => {
        $(countrySelectAll).parent().siblings().children('.city').prop('checked', $(countrySelectAll).prop('checked'));
      });
    }
  
    // Applying selectAll to each select_all element
    cities.forEach((country)=>{
      selectAll($(country).find('.select_all')); 
    })
  }

}

// Subclass for adding new element
module.exports.FormAdd = class FormAdd extends FormGood {

  // All comments considering parent class are also true for this class
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp, LIST){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);

    this.that = '#' + modalWindow;
    
    this.modal.jQueryModalWindow = $('#'+ modalWindow);
    this.jQueryElement = this.modal.jQueryModalWindow.find('form');
  
    this.appendDelivery(citiesTemp);

    // jQuery objects corresponding to html inputs
    this.jQueryName = this.jQueryElement.find('input.name');
    this.jQueryEmail = this.jQueryElement.find('input.supplier_email');
    this.jQueryCount = this.jQueryElement.find('input.count');
    this.jQueryPrice = this.jQueryElement.find('input.price');

    // Array to support older patterns
    this.jQueryInputs = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];

    // Notes indicating invalid input
    this.jQueryNotes = this.jQueryElement.find('.note');

    // Delivery checkbox form
    this.jQueryCities = {};
    this.jQueryCities.selectAll = this.jQueryElement.find('input.select_all');
    this.jQueryCities.cities = this.jQueryElement.find('input.city');

    // Formatting inputs
    this.inputsFormat();

    // Defining each note separately
    this._defineNotes();

    // Setting placeholders
    this.initPlaceholders();

    // jQueryTrigger starts interacting with the form
    this.jQueryTrigger = jQueryTrigger;
    this.jQueryTrigger.click(()=>{this.open()});

    // On submit
    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit()
    });

    // Canceling without any changes
    this.jQueryCancel = this.jQueryElement.find('.cancel');
    this.jQueryCancel.click(()=>{this.cancel()});
    
  }

}

// Subclass for editing form
class FormEdit extends FormGood {
  
  // All comments from parent and sibling classes are true here except if it's said otherwise
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp, renderObject){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);

    this.name = this.good.name;
    this.email = this.good.email;
    this.count = this.good.count;
    this.price = this.good.price;

    // this.that is peculiar field. I can't say if it's still used or meant to be used, but I leave it anyway
    // Basically it is just a jQueryModalWindow id text
    this.that = '#'+'modal_edit_'+modalWindow;

    // What differs here from the parent and sibling classes is the way modalWindow is expected
    // In this subclass it used like a number (index)
    this.modal.jQueryModalWindow = $('#'+'modal_edit_'+modalWindow);

    this.citiesChecboxes = good.deliveryToArray()

    

    this.jQueryElement = this.modal.jQueryModalWindow.find('form');
    this.appendDelivery(citiesTemp);
   
    this.jQueryName = this.jQueryElement.find('input.name');
    this.jQueryEmail = this.jQueryElement.find('input.supplier_email');
    this.jQueryCount = this.jQueryElement.find('input.count');
    this.jQueryPrice = this.jQueryElement.find('input.price');

    this.jQueryInputs = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    this.jQueryNotes = this.jQueryElement.find('.note');

    this.jQueryCities = {};

    this.jQueryCities.selectAll = this.jQueryElement.find('input.select_all');
    this.jQueryCities.cities = this.jQueryElement.find('input.city');

    this.jQueryTrigger = jQueryTrigger;
    this.jQueryTrigger.click(()=>{this.open()});

    this.inputsFormat();
    this._defineNotes();
    
    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit()
    });

    this.jQueryCancel = this.jQueryElement.find('.cancel');
    this.jQueryCancel.click(()=>{this.cancel()});
  }

  _render(number) {
    
    // This is overrided method from the parent classes
    // Instead of empty strings the form is initialized with data from good corresponding to form
    $(_.template(this.jQueryTemplate.html())({
      modalId: 'modal_edit_'+number,
      email: this.good.email,
      name: this.good.name,
      count: this.good.count,
      price: priceConverter(this.good.price),
      saveId: 'modal_save_'+number,
      cancelId: 'modal_cancel_'+number,
    })).appendTo('#table_body');

  }

  clear() {

    // Method clear differs in similiar way as with _render() method -- in leaves fields envalued with good's data
    this.jQueryName.val(this.good.name);
    this.jQueryEmail.val(this.good.email);
    this.jQueryCount.val(this.good.count);
    this.jQueryPrice.val(priceConverter(this.good.price));
    this.jQueryCities.selectAll.find('.russia_all').prop('checked', this.good.allCities('russia'));
    this.jQueryCities.selectAll.find('.belorus_all').prop('checked', this.good.allCities('belorus'));
    this.jQueryCities.selectAll.find('.usa_all').prop('checked', this.good.allCities('usa'));
    this.hideNotes();

    let cities = this.jQueryCities.cities.toArray();
    let delivery = this.good.deliveryToArray();
  
    cities.forEach((element, index)=>{
      $(element).prop('checked', delivery[index]);
    });
  }

  submit() {

    // All comments for this method are true for the parent class, except for one specific place (if validation successful)
    this.checkPlaceholders();
    let forms = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    
    let validation = [this.isNameValid(forms[0].val()), this.isEmailValid(forms[1].val()), this.isCountValid(forms[2].val()), this.isPriceValid(cleanPriceString(forms[3].val()))];
  
    
    if(validation.every((element)=>{return element;})){

      // Due to inability to set promise directly to setter method of the good (too complicated)
      // Promise is formed right here
      const editPromise = new Promise((resolve, reject) => {

        // Function changes corresponding good's data to gotten from inputs values
        setTimeout(()=>{
          this.good.name = this.jQueryName.val();
          this.good.email = this.jQueryEmail.val();
          this.good.count = this.jQueryCount.val();
          this.good.price = priceConverter(this.jQueryPrice.val());
      
          const editCities = () => {
            const countries = [];
            
            for(let country in this.good.delivery) {
              countries.push(country);
            }
  
            countries.forEach( (country)=>{

                for(let city in this.good.delivery[country]){
                  this.good.delivery[country][city] = this.jQueryElement.find('.'+city).prop('checked') ? true : false;
                  console.log(this.good.delivery[country][city]);
                }
            }
            )
          }

          editCities();
          
          resolve('Edit successful');
        }, serverResponseTime);
      
      });

      this.loading();
      editPromise.then((resolved) => {
        this.endLoading()
        this.clear();
        this.clearInvalid();
        LIST.render();
      })
  
    } else {
      this.clearInvalid();
      validation.forEach((element, index)=>{
        if(!element){
          forms[index].addClass('invalid');
          this.showNotes(forms[index]);
        } else {
          this.hideNote(forms[index]);
        }
      });
  
      forms[validation.indexOf(false)].focus();
    }
  }
 

}

// Local object that deals with storaging and manipulating dynamic elements
// Mainly good local objects
function GoodsList() {

  // Collection of the good local objects
  this.collection = [];

  // Directions of the sortings. If true -- ascending
  // Yeah, there is grammar issue, but it is left to support older patterns
  this.ascedningName = true;
  this.ascedningPrice = true;


  // Item pushing override (definiton)
  this.push = (good) => {
    this.collection.push(good);
  };

  // Good deleting definition
  // It is an async process
  this.delete = (good) => {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        this.collection.splice(this.collection.indexOf(good), 1);
        resolve('Good deleted')
      }
    , serverResponseTime);

    }
    
  )};


  // Good adding definition
  // It is an async process
  this.add = (good) => {

    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        this.push(good);
        resolve('Good added')
      }
    , serverResponseTime);

    }

  )};

  // forEach override (definition)
  this.forEach = (callback) => {
    this.collection.forEach(callback);
  };

  // Name field sorting.
  // NOTE: String are 'compared' via localeCompare method
  this.sortByName = () => {
    const callback = this.ascedningName ? ((x, y) => {return ('' + x.name).localeCompare(y.name);}) 
                               : ((x, y) => {return ('' + y.name).localeCompare(x.name);}); 
    this.collection.sort(callback);

    // NOTE: It re-renders automatically after sorting
    this.render();
  };


  // Price field sorting
  this.sortByPrice = () => {
    const callback = this.ascedningPrice ? ((x, y) => {return y.price-x.price;}) : ((x, y) => {return x.price-y.price;}); 
    this.collection.sort(callback);

    // NOTE: It re-renders automatically after sorting
    this.render();
  };

  // Main method of the object, that renders dynamic elements into the page (table)
  this.render = () => {

    // Firstly we empty the table
    $('#table_body').empty();

    // Then, for each good item in the collection we perfom render
    // NOTE: This part can be taken out to a separate renderSelf method, which potentially could help optimize rendering
    // For example: we could re-render only edited part, not all dynamic elements, or just append added element to content.
    this.forEach((good, number) => {

      // Forming new row
      good.row = new Row(_.template($("#row_template").html()), '#table_body', number, good);

      // If good hasn't mached sorting, it is hidden
      if(good.hidden){
        good.row.hide();
      } else {
        good.row.show();
      }
     

      // Forming edit form for the good
      good.formEdit = new FormEdit(good, $('#modal_fade'), $('#loading'), number, $('#edit_'+number), $("#modal_edit_template"), '#edit_cities_template');

      // Forming description modal
      good.row.defineModalDescription(_.template($('#modal_description_template').html()), 'modal_description_'+number, 'modal_description_close_'+number);

      // Forming delete modal
      good.row.defineModalDelete(_.template($('#modal_delete_template').html()), 'modal_delete_'+number, 'yes_'+number, 'no_'+number);
  
      /* 
       * This sets trigger to a 'delete' button to open delete modal
       * Reason for not incapsulating this into row object like modal itself 
       * Is because it manipulates directly with GoodsList data (good local objects)
      */
      
      good.row.modalDelete.jQueryYes.click(() => {
        const deletePromise = this.delete(good);
        deletePromise.then((resolved)=>{
          this.render();
          $('#modal_fade').removeClass('modal_fade_trick');
          $('#loading').css('display', 'none');
        });
        $('#loading').css('display', 'block');
        good.row.modalDelete.jQueryElement.css('display', 'none');
      }); 

    });
    
  };
};

// Forming instance of the GoodsList to export
const LIST = new GoodsList();

module.exports.LIST = LIST;