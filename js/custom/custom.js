$(function() {
    $( ".slider" ).slider({
      animate: true,
      range: "min",
      value: 0,
      min: 10,
      max: 100,
      step: 10,
                
      //this gets a live reading of the value and prints it on the page
      slide: function( event, ui ) {
        $( "#slider-result" ).html( ui.value );
      },
 
      //this updates the hidden form field so we can submit the data using a form
      change: function(event, ui) {
        $('#hidden').attr('value', ui.value);
      }            
    });



  });