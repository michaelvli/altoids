/*  Custom javascript for application  */

$(function() { //on DOM ready
//	alert("DOM ready");
	endless_scroll();
});


/* *****
Endless scroll - uses ajax to load additional pagination elements as user scrolls down  
*/ 
function endless_scroll(){
	// Checks for a pagination element so function isn't called on every page when user scrolls
	if ($('.pagination').length) 
	{

		// Ensures additional videos are loaded incrementally (vs. a large number at once):
		$(window).scroll(function(){
			url = $('.pagination .next_page').attr('href'); // global variable - http://learn.jquery.com/javascript-101/scope/

			// 1. Check if url is available (url should not be available until results have been retrieved)
			// 2. Check if user has scrolled near bottom of page
			if ((url) && $(window).scrollTop() > $(document).height() - $(window).height() - 100)
			{				
				$('.pagination').html('<br><h4>Loading...</h4>');
				$.get(	url,
						{scroll: true},
						function(){
//							alert( "Success: endless_scroll " );
						}, 
						"script"
				)				
			}
		});
		// manually initiate a scroll in case user's viewport might be big enough
		$(window).scroll();
	}	
}