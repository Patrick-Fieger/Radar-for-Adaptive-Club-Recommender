$(function() {
    $(document).on('click','.clubCircle._active',function(){
    	$(".tooltip").toggleClass("active"); 
    	$(".clubCircle").removeClass("_active");
    })
    $(document).on('click','.close',function(){
    	$(".tooltip").removeClass("active");
    	$(".clubCircle").toggleClass("_active"); 
    })
});
