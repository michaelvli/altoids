/*  Custom javascript for application  */

$(function() { //on DOM ready
//	alert("DOM ready");
	if ($('#venue_event_start_date').length)
	{
		calendar_datepicker(); // plugin
	}
	if ($('.pagination').length)
	{
		endless_scroll();
	}
	if ($('.text_wrapper').length)
	{
		limit_captions(); // plugin
	}	
});

// Need to respond to appropriate page actions or else else Turbolinks may prevent some functions from loading - https://github.com/rails/turbolinks
$(document).on('page:load', page_load_functions);
$(document).on('page:update', page_update_functions);

function page_load_functions(){
	if ($('#venue_event_start_date').length)
	{
		calendar_datepicker(); // plugin
	}
	if ($('.pagination').length)
	{
		endless_scroll();
	}
	if ($('.text_wrapper').length)
	{
		limit_captions(); // plugin
	}
}

function page_update_functions(){
	if ($('.text_wrapper').length)
	{
		limit_captions(); // plugin
	}
}
	
/* *****
jQuery.dotdotdot - https://github.com/BeSite/jQuery.dotdotdot
Shortens captions by appending three periods
*/
function limit_captions(){
	$('.text_wrapper').dotdotdot({
        // configuration goes here
    });
}


/* *****
Jquery Datepicker - From jquery-ui-rails gem: http://api.jqueryui.com/datepicker/
For API options, see http://api.jqueryui.com/datepicker/
*/
function calendar_datepicker(){
	$('#venue_event_start_date').datepicker({dateFormat: 'M d, yy (D)', minDate: 0});
}


/* *****
Endless scroll - uses ajax to load additional pagination elements as user scrolls down 
From Ryan Bates - http://railscasts.com/episodes/114-endless-page-revised
*/ 
function endless_scroll(){
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