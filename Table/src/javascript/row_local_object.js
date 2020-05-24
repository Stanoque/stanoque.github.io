
// Price vidget 
const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;

// Object corresponding to table row
module.exports = function Row(template, whereTo, number, good){

  /*
   * template -- row lodash template 
   * whereTo -- where to append new row (just id)
   * number -- index of the corresponding good local object in list local object
   * good -- corresponding good local object
  */

  this.good = good;
  this.number = number;

  $(template({
    idRow: 'table_row_'+number,
    name: this.good.name,
    price: priceConverter(this.good.price),
    count: this.good.count,
    idName: 'description_'+number,
    idEdit: 'edit_'+number,
    idDelete: 'delete_'+number,
  })).appendTo(whereTo);


  // row jQuery object 
  this.jQueryElement = $('#table_row_'+number);

  // if count parameter is longer than two, than count badge in the row will wrap
  if(this.good.count.length > 2) {
    this.jQueryElement.find('.badge').parent().removeClass('col-1');
    this.jQueryElement.find('.badge').parent().addClass('col-12');
  }

  // Object that contains description modal parameters
  this.modalDescription = {};

  // Object that cointains delete modal parameters
  this.modalDelete = {};
  

  // Method that renders modal description and invaluates this.modalDescription
  this.defineModalDescription = (template, element, close) => {

    $(template({
        descriptionId: element,
        name: good.name,
        description: good.description,
        closeId: close,
        
    })).appendTo('#table_body');

    // jQuery object of the modal
    this.modalDescription.jQueryElement = $('#'+element);

    // jQuery object of the close button
    this.modalDescription.jQueryClose = $('#'+close);

    // Setting click event to open the modal on good's name
    this.jQueryElement.find('#description_'+number).click(() => {
      $("#modal_fade").addClass("modal_fade_trick");
      this.modalDescription.jQueryElement.css("display", "block");
    });
    
    // And to close on the close button
    this.modalDescription.jQueryClose.click(()=>{
      $("#modal_fade").removeClass("modal_fade_trick");
      this.modalDescription.jQueryElement.css("display", "none");
    });

  }

  // Method that renders modal delete and invaluates this.modalDelete
  this.defineModalDelete = (template, element, yes, no) => {

    $(template({
      deleteId: element,
      name: good.name,
      idYes: yes,
      idNo: no,
    })).appendTo('#table_body');

    // jQuery object of the modal
    this.modalDelete.jQueryElement = $('#'+element);

    // jQuery object of the confirming delete button
    this.modalDelete.jQueryYes = $('#'+yes);

    // jQuery object of the canceling delete button
    this.modalDelete.jQueryNo = $('#'+no);

    // Setting click event on delete button in the row
    $('#delete_'+this.number).click(() => {
      $('#modal_fade').addClass('modal_fade_trick');
      this.modalDelete.jQueryElement.css('display', 'block');
    });

    // And cancel on the cancel delete button
    this.modalDelete.jQueryNo.click(() => {
      $('#modal_fade').removeClass('modal_fade_trick');
      this.modalDelete.jQueryElement.css('display', 'none');
    }); 

  }
  

  // Hide this row
  this.hide = () => {
    this.jQueryElement.addClass('hidden');
    this.jQueryElement.children().addClass('hidden');
  }

  // Show this row
  this.show = () => {
    this.jQueryElement.removeClass('hidden');
    this.jQueryElement.children().removeClass('hidden');
  }
}
 
