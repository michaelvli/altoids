/*  Custom javascript for application  */

$(function() { //on DOM ready
//	alert("DOM ready");

	if ($('.carousel').length)
	{
		carousel_behavior(); // plugin
	}	
	if ($('#venue_event_start_date').length)
	{
		calendar_datepicker(); // plugin
	}
	
	if ($('#endless_list').length)
	{
	
		sort_list();
/*	
		$('#myModal').modal('show'); // Modal prompts user for geolocation permission
		$('#myModal .btn').on('click', function(){ // Captures user's response to modal message
			var response = $(this).data("share_location");
			if (response == 'yes')
			{
				var user_location = Location();
				user_location.initiate( // calls html5 geolocation to access user location
					function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
						alert('latitude: ' + user_location.latitude()+ ' ' + 'longitude: ' + user_location.longitude());
					}
				);
			}
			else
			{
				alert("no location")				
			}
		});
		$('#myModal').on('hide.bs.modal', function (e) {
			alert("hiding modal") //means user said "no" to location sharing or closed modal without responding
		})
*/
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


/* 	
Additional page events are needed or else Turbolinks may prevent some functions from loading - https://github.com/rails/turbolinks
 */

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


/* ***************************************************************************************** */

/* *****
sort_list - provides functionality for sort buttons on the home page by grabbing value of the data-sort custom attribute.

Possible values of data-sort: 
1. distance
2. name asc
3. name desc
4. neighborhoods.name asc, name asc
5. venue_events.start_time asc, name asc
*/
function sort_list(){

	$('.sort').on('click', function(){
		var url = $(this).attr('href');
		var sort_order = $(this).data('sort'); // grabs the value of the custom attribute, data-sort
 alert(sort_order);
		
		var user_location = Location(sort_order);
		user_location.initiate( // calls html5 geolocation to access user location
			function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
//					alert('latitude: ' + user_location.latitude()+ ' ' + 'longitude: ' + user_location.longitude());
				$.get(url,
					{sort_order: sort_order, latitude: user_location.latitude(), longitude: user_location.longitude()},
					function(){
//							alert( "Success - called function sort_list - used geolocation );
					}, 
					"script"
				)
			}
		);
	});
}


/* *****
Endless scroll - uses ajax to load additional pagination elements as user scrolls down 
From Ryan Bates - http://railscasts.com/episodes/114-endless-page-revised
*/ 
function endless_scroll(){
		// Ensures additional videos are loaded incrementally (vs. a large number at once):
		$(window).scroll(function(){
			var url = $('.pagination .next_page').attr('href'); // global variable - http://learn.jquery.com/javascript-101/scope/

			// 1. Check if url is available (url should not be available until results have been retrieved)
			// 2. Check if user has scrolled near bottom of page
			// 3. Check if initial set of venues (loaded by function locate_user) has been loaded
			if ((url) && $('#endless_list').children().length > 0 && $(window).scrollTop() > $(document).height() - $(window).height() - 100)
			{
//alert(url);
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



/* *****
carousel_behavior - defines carousel behavior in terms of 1)frequency of carousel advancing videos, 2)start/stop of active video
*/
function carousel_behavior(){
	// Bootstrap plugin that controls the interval for advancing the carousel - http://getbootstrap.com/javascript/#carousel
	$('.carousel').carousel({
		interval: 10000
	});
	
	// start playing first video
	$('div.carousel-inner').find('.active').children('video').get(0).play();
	
	// start/pause videos based on when carousel slides
	$('.carousel').on('slid.bs.carousel', function () {
//		alert("slide method completed");
		
		/* 	play(); active video
			1) Find the descendants of 'div.carousel-inner' that have the class, 'active'. "Find" method is recursive, looking at all levels below
			2) Get the descendants of the elements returned from step #1.  "Children" method looks only one level deep, making if faster than the "find" method.
			3) Get the DOM element of the jQuery object returned from step #2.  In this case, the element is an HTML video element.  A jQuery object is an array-like structure of DOM elements.
			4) Play is a method that is used on DOM elements (not jQuery objects).  The HTML video element is played.
		*/	
		$('div.carousel-inner').find('.active').children('video').get(0).play(); 
		
		/* 	pause(); all inactive videos
			1) Find the descendants of 'div.carousel-inner' that have the class, 'item'. "Find" method is recursive, looking at all levels below
			2) Get the descendants of the elements returned from step #1.
			3) From the elements returned from step #2, remove those that have the class, 'active'.
			4) Because there may be multiple elements from step #3, cycle through each of them to perform the following:
				a) "Children" method looks only one level deep for descendents with the video tag
				b) Get the DOM element of the jQuery object returned from step #a.  In this case, the element is an HTML video element.  A jQuery object is an array-like structure of DOM elements.
				c) Pause is a method that is used on DOM elements (not jQuery objects).  The HTML video element is paused.
		*/
		$('div.carousel-inner').find('.item').not('.active').each(function(){ 
			$(this).children("video").get(0).pause();											
		});
	});
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