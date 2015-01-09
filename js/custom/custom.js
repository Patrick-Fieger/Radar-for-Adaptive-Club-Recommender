$(function() {
    $(".clubCircle").click(function() {
      $(".tooltip").toggleClass("active"); 
    });

    $(".close").click(function() {
      $(".tooltip .active").removeClass("active"); 
    });
});
