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
//TESTING GEOLOCATION PERMISSION MODAL	
//localStorage.clear();
//alert('localstorage: ' + checkLocalStorage('geoPermissionsModal'));		
		switch(checkLocalStorage('geoPermissionsModal')) // Check to see if geolocation permissions modal should be displayed.  LocalStorage variables are stored as text
		{
			case 'undefined': // user is shown geolocation permissions modal unless he has clicked "Yes" or "Not Now" buttons in a previous session.
				var Modal = geolocationPermissionsPrompt();
				Modal.initiate();
				Modal.hide_action_on();
				break;
			case 'true': // user has seen modal for geolocation permissions and has clicked "Yes" or "Not Now" buttons - no need to show modal again.
				var user_location = Location();
				user_location.initiate( // calls html5 geolocation to access user location
					function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
						get_list('home','event', user_location.latitude(), user_location.longitude());	// load venues - passing user's latitude and longitude to server 
					},
					function(){ // gets list of venues immediately in case user doesn't set geolocation permission in browser
						get_list('home','event', '', '');	// load venues without passing user's latitude and longitude to server 
					}
				);
				break;
		}
		sort_list(); // bind sort buttons
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
checkLocalStorage - retrieves the value of variables stored in LocalStorage or if the variable doesn't exist, returns "undefined"

LocalStorage Variables:
1.  geoPermissionsModal - controls if the user will be shown the geolocation permissions Modal window.
	a.  true - user has viewed modal and will not be shown Modal again.
	b.  undefined - user has not viewed modal and will be shown the Modal.
	
*/
function checkLocalStorage(variable){
    if(typeof localStorage[variable] == "undefined")
	{
        return "undefined";
	}	
    else
	{
        return localStorage[variable];
	}	
}



/* *****
get_list - sends a GET request via ajax to the server, passing in the following parameters:
1. url - specifies the controller action along with url variables such as page(for pagination).  If no url is specified, the default value is the home action (for the sessions controller)
2. sort_order - specifies the sort order of venues, events, or specials.  Possible values include: 
	a. name_asc (venue name ascending order)
	b. name_desc (venue name in descending order)
	c. neighborhood (neighborhood in ascending order)
	d. distance (distance of venue from user in ascending order)
	e. event (start day/time of an event in chronological order)
3. latitude - user's latitude (may be blank)
4. longitude - user's longitude (may be blank)
*/
function get_list(url, sort_order, latitude, longitude){
	$.get(url,
		{sort_order: sort_order, latitude: latitude, longitude: longitude},
		function(){ // Success callback
//			alert( "Success");
		}, 
		"script"
	)
}



/* *****
sort_list - provides functionality for sort buttons on the home page by grabbing value of the data-sort custom attribute.

Possible values of data-sort:
	1. name_asc (venue name ascending order)
	2. name_desc (venue name in descending order)
	3. neighborhood (neighborhood in ascending order)
	4. distance (distance of venue from user in ascending order)
	5. event (start day/time of an event in chronological order)
*/
function sort_list(){
	$('#name_desc').hide()
	$('.sort').on('click', function(){
		var url = $(this).attr('href');
		var sort_order = $(this).data('sort'); // grabs the value of the custom attribute, data-sort

//		alert(sort_order);

		// switch statement used in conjunction with sortButtonToggle to toggle the A-Z, Z-A sort button
		switch(sort_order)
		{
			case 'name_asc':
				if ($('#name_asc').attr('class').search('active') >= 0 ) // search method returns position of string if found, else returns -1
				{ // element is active
					sort_order = sortButtonToggle(sort_order, 'name_desc');
				}
				else
				{ // element is not active
					sort_order = sortButtonToggle('name_desc', sort_order)
				}
				break;
			case 'name_desc':
				if ($('#name_desc').attr('class').search('active') >= 0 ) // search method returns position of string if found, else returns -1
				{ // element is active
					sort_order = sortButtonToggle(sort_order, 'name_asc');
				}
				else
				{ // element is not active
					sort_order = sortButtonToggle('name_asc', sort_order);
				}
				break;
		}
				var user_location = Location();
				user_location.initiate( // calls html5 geolocation to access user location
					function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
						get_list(url, sort_order, user_location.latitude(), user_location.longitude()); // load venues - passing user's latitude and longitude to server
					},
					function(){ // gets list of venues immediately in case user doesn't set geolocation permission in browser
						get_list(url, sort_order, '', ''); // load venues - passing user's latitude and longitude to server
					}
				);
	
	});
}



/* *****
sortButtonToggle - Toggles between the A-Z and Z-A sort button while controlling active states as well.  Returns the value of inverse_button to 
dictate the sort order of venues.
*/
function sortButtonToggle(sort_button, inverse_button){
	$('.sort').removeClass('active');
	$('#' + sort_button).hide();
	$('#' + inverse_button).show(1, function(){ // need a minimal amount of time to specify callback to occur subsequently
		$('#' + inverse_button).addClass('active');					
	});
	return inverse_button;
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