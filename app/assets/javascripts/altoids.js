/*  Custom javascript for application  */
function set_cookie ( cookie_name, cookie_value, lifespan_in_days, valid_domain ) // Need to define get_cookie at beginning since it is used before DOM is loaded.
{
    // http://www.thesitewizard.com/javascripts/cookies.shtml
    var domain_string = valid_domain ?
                       ("; domain=" + valid_domain) : '' ;
    document.cookie = cookie_name +
                       "=" + encodeURIComponent( cookie_value ) +
                       "; max-age=" + 60 * 60 *
                       24 * lifespan_in_days +
                       "; path=/" + domain_string ;
}

function get_cookie ( cookie_name ) // Need to define get_cookie at beginning since it is used before DOM is loaded.
{
    // http://www.thesitewizard.com/javascripts/cookies.shtml
    var cookie_string = document.cookie ;

    if (cookie_string.length != 0) {
        var cookie_value = cookie_string.match (
                        '(^|;)[\s]*' +
                        cookie_name +
                        '=([^;]*)' );
		if (cookie_value != null)
		{
			return decodeURIComponent ( cookie_value[2] ) ;
		}
		else
		{
			return '' ;
		}
    }
    return '' ;
}

if (get_cookie( 'device_size' ) == '') // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
{
	setScreenSizeCookie(function(){
		window.location.reload(); // call back used to reload the page after cookie has been set with function setScreenSizeCookie()
	});
}
else
{

//  TESTING COOKIES FOR SCREEN SIZE
//delete_cookie('device_size');

	$(function() { //on DOM ready
//		alert("DOM ready");

			// load jquery used for mobile version
//			if (get_cookie( 'device_size' ) == 'xs')
			if (get_cookie( 'device_size' ) == 'md' || get_cookie( 'device_size' ) == 'xs') // for development only
			{
				show_sort_filter_panel(); // controls display of sort & filter panel
				
				$('.slide-left').on('click', function(){ // slides screen content to the left to reveal menu options
				
					var slideContent = $('.slide-content');
					var button = $(this).data('button');
/*					
					slideContent.animate({
						// slideContent.outerWidth() : width of .slide-content (including padding and margin)
						// $(this).outerWidth() - 15*2 : width of navbar-toggle button + left margin (15px) + right margin (15px)
						// parseInt : parses a string and returns an integer.  In this case, the '10' is the radix indicating use of the decimal system
						left: parseInt(slideContent.css('left'),10) == 0 ? - (slideContent.outerWidth()-$(this).outerWidth() - 15*2):0 //Ternary operator: "If the left css property equals zero, move the element to the left as many pixels as it is wide (including padding and border), otherwise, move it back to zero"
					});
*/
					// If the left css property equals zero, move the element to the left as many pixels as it is wide (including padding and border).					
					if (parseInt(slideContent.css('left'),10) == 0)
					{
						if (button == 'login')
						{
							$('#log_in_form').css('display', 'block');
						}
						else
						{
							$('#sign_up_form').css('display', 'block');
						}
						// open slider to reveal hidden content
						slideContent.animate({
							left: -(slideContent.outerHeight())
							}, 
							function(){
								slideContent.css('z-index', 0);
							}
						);
						$('#log_in_button').text('  Close  '); // modify text in "Log in" button to "Close"
					}
					else // Otherwise, close slider
					{
						slideContent.css('z-index', 10);
						slideContent.animate({
							left: 0
							},
							function(){
								$('#log_in_form, #sign_up_form').css('display', 'none');
							}
						);
						$('#log_in_button').text('Log in'); // modify text in "Close" button to "Log in"
					}
					
				});
			}

			if ($('div.alert').length) // fading out flash message alerts
			{
//				alert('TEXT: ' + $('div.alert').text().indexOf('Please fix the errors below')); // problem with "creating a free account" from mobile splash page
				if ($('div.alert').text().indexOf('Please fix the errors below') >= 0) // problem with "creating a free account" from mobile splash page
				{
					$('.sign_up_button').trigger("click");
				}
				setTimeout(function(){
					$("div.alert").fadeTo(5000, 0).slideUp(500, function(){
						$(this).remove();
					});
				});	
			}
			
			if ($('.carousel').length) // defining carousel interval and play/pause videos in carousel
			{
				carousel_behavior();
			}

			if ($('.dotdotdot').length) // adding ellipsis to end of truncated text
			{
				limit_captions(function(){
					$( ".active.item" ).each(function( index ) { // callback for remove .active class to all items in carousel except the first - allows dotdotdot to complete execution first
						if(index != 0){
							$(this).removeClass('active');
						}
					});
				});
			}
			
			if ($('#venue_event_start_date').length)
			{
				calendar_datepicker(); // plugin
			}
			
			if ($('#endless_list').length)
			{
//	TESTING GEOLOCATION PERMISSION MODAL
//localStorage.clear();
//sessionStorage.clear();
/* The case where checkLocalStorage('geolocation_permissions') == 'undefined' was not working for Chrome mobile - missing geolocation_permissions modal???
				switch(checkLocalStorage('geolocation_permissions')) // Check to see if geolocation permissions modal should be displayed.  LocalStorage variables are stored as text
				{
					case 'undefined': // user is shown geolocation permissions modal unless he has clicked "Yes" or "Not Now" buttons in a previous session.
						var Modal = ModalPrompt();
						Modal.initiate('geolocation_permissions');
						Modal.hide_action_on('geolocation_permissions');
						break;
					case 'true': // user has seen modal for geolocation permissions and has clicked "Yes" or "Not Now" buttons - no need to show modal again.
						var user_location = html5_geolocation();
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
*/
						var user_location = html5_geolocation();
						user_location.initiate( // calls html5 geolocation to access user location
							function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
								get_list('home','event', user_location.latitude(), user_location.longitude());	// load venues - passing user's latitude and longitude to server 
							},
							function(){ // gets list of venues immediately in case user doesn't set geolocation permission in browser
								get_list('home','event', '', '');	// load venues without passing user's latitude and longitude to server 
							}
						);
				
				sort_list(); // bind sort buttons
				video_behavior(); // binds play button to thumbnail videos
			}
			
			if ($('.pagination').length)
			{
				endless_scroll();
			}
			
	}); // DOM READY
	$(document).on('page:load', page_load_functions); // Additional page events are needed or else Turbolinks may prevent some functions from loading - https://github.com/rails/turbolinks
	$(document).on('page:update', page_update_functions); // Additional page events are needed or else Turbolinks may prevent some functions from loading - https://github.com/rails/turbolinks
} // INITIAL IF STATEMENT FOR CHECKING SCREEN SIZE COOKIE

/* 	
Additional page events are needed or else Turbolinks may prevent some functions from loading - https://github.com/rails/turbolinks
 */

function page_load_functions(){
//	alert('5');			

	if ($('#venue_event_start_date').length)
	{
		calendar_datepicker(); // plugin
	}
	if ($('.pagination').length)
	{
		endless_scroll();
	}
	if ($('.dotdotdot').length) // adding ellipsis to end of truncated text
	{
		limit_captions(function(){
			$( ".active.item" ).each(function( index ) { // callback for remove .active class to all items in carousel except the first - allows dotdotdot to complete execution first
				if(index != 0){
					$(this).removeClass('active');
				}
			});
		});
	}
}

function page_update_functions(){
	if ($('.dotdotdot').length && $('.carousel').length == 0) // Need to make sure there is no carousel or else limit_captions() will write over the original dotdotdot for the carousel -prob because the .active class has been stripped already.
	{
//alert('3');
		limit_captions(); // plugin
	}
}



/* ***************************************************************************************** */

function setScreenSizeCookie(callback){

//	alert("width: " + screen.width + " height: " + screen.height);
	var days_before_expiring = 365 * 10;
	var device_size;
	if (screen.width < 768)
	{
	//	alert("mobile " + "width: " + screen.width + " height: " + screen.height);
		device_size = 'xs'
	}
//	else if (screen.width < 992) {
//		alert("tablet " + "width: " + screen.width + " height: " + screen.height);
//		document.cookie="device_size=sm";
//	}
	else
	{
//		alert("laptop "  + "width: " + screen.width + " height: " + screen.height);	
		device_size = 'md'
	}
	set_cookie('device_size', device_size, days_before_expiring);
	callback();
}



/* *****
show_sort_filter_panel - displays sort & filter panel on home page when user clicks on the "filter" button (in footer for mobile page).
*/
function show_sort_filter_panel(){
	$('#show-filters, #cancel-filters, #apply-filters').on('click', function(){
		$('.show-filters-fixed-bottom, .apply-filters-fixed-bottom, #filter-container, #pagination-links, #endless_list').slideToggle(200);
		$('html, body').animate({ scrollTop: 0 }, 0);
	});
	
//	$('#apply-filters').click(function(){
//		$('form').submit();
//	});
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
	$('#name_desc').hide();

	// Initializing popover prior to binding to click handler or else popover will require two clicks - http://stackoverflow.com/questions/12333585/twitter-bootstrappopovers-are-not-showing-up-on-first-click-but-show-up-on-seco
	$('#distance').popover({trigger: 'manual',
							delay: {show: 0, hide: 0},
							content: "Requires location sharing. <a id='geolocation_instructions_link' href='#'>More</a>",
							placement: 'top',
							html: 'true'
	});
	
	if (checkSessionStorage('previousSort') == 'undefined')
	{
		sessionStorage['previousSort'] = 'event'; //default value is "Featured" on screen
	}
	
	$('.sort').on('click', function(){
		var url = $(this).attr('href'); // url is passed to function get_list() for ajax call retrieving list of venues - necessary for capturing pagination and specifying controller action
		var sort_order = $(this).data('sort'); // grabs the value of the custom attribute, data-sort
		
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
		
		// store sort history in case user clicks on 'distance' and geolocation is not enabled (need to take user back to previously clicked sort button)
		// must set sessionStorage['previousSort'] = sort_order AFTER above switch statement - need sort_order value returned by function sortButtonToggle()
		if (sort_order != 'distance')
		{
			sessionStorage['previousSort'] = sort_order;
		}
				
		var user_location = html5_geolocation();
		user_location.initiate( // calls html5 geolocation to access user location
			function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
				if (sort_order == 'distance' && typeof user_location.latitude() == 'undefined' && typeof user_location.longitude() == 'undefined') //geolocation is blocked
				{
					// do nothing in scenario where user sorts by distance and latitude and longitude is not available
				}
				else // geolocation is allowed (and working)
				{
					$('#distance').off('hidden.bs.popover');
					$('#distance').popover('hide');
					get_list(url, sort_order, user_location.latitude(), user_location.longitude()); // load venues - passing user's latitude and longitude to server
				}
			},
			function(){ // Firefox quirk:  geolocation permission is not set (user has selected "Not Now" or ignored permissions).  Hence this anonymous function provides default content which will be replaced if user selects a geolocation permission setting ("Always Allow" or "Never Allow")
				if (sort_order != 'distance')
				{
					get_list(url, sort_order, '', ''); // load venues - without passing user's latitude and longitude to server
				}
				else if (checkLocalStorage('geolocationAuth') == 'undefined')
				{
					preparePopover(); // Binds necessary handlers to the "Requires sharing location" popover message when user sorts by distance.
				}
			}
		);
					
	});
}



/*  preparePopover - Binds necessary handlers to the "Requires sharing location" popover message when user sorts by distance.  

Handlers are used to:
  1. Show the popover when a user clicks on the 'distance' sort button
  2. Set sort button to previous sort (in the scneario that user sorts by distance but doesn't enable geolocation)
  3. Hides popover after it is shown to user
  4. Open a modal that provides instructions on how to enable geolocation permissions in the brower
  
NOTE: Popover must be initialized prior to the handler (see near the beginning of function sort_list() for how popover was initialized.  
*/
function preparePopover(){
	// bind popover handlers
	$('#distance').on('hidden.bs.popover', function(){ // sets sort button to the previous one
		$('.sort').removeClass('active'); // removes highlighted buttons
		$('#' + sessionStorage['previousSort']).addClass('active'); // highlights the previous sort button
	});
	$('#distance').on('shown.bs.popover', function() { // hides popover 5 seconds after it is shown to user
		setTimeout(function(){
			$('#distance').popover('hide');
		}, 5000);
	});
	
	// show popover which contains a link to geolocation instructions modal - trigger option in popover needs to be set to "manual"
	$('#distance').popover('show');
	
	// bind click handler to geolocation instructions modal
	$('#geolocation_instructions_link').on('click',function(){ // show geolocation instructions modal when user clicks on the "More" link (in popover content).
		$('#geolocation_instructions').modal('show');
		$('#distance').popover('hide'); // Hide popover when modal opens.
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
		interval: 5000
	});
	
	if ($('video').length) // mobile view template for carousel uses thumbnails instead of video
	{

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
}



/* *****
video_behavior - plays, unhides, hides videos from thumbnails
*/
function video_behavior(){
	//  use selector within "on" method to bind to dynamically retrieved (via AJAX) play buttons found in "#endless_list" container
	$('#endless_list').on('click', '.glyphicon-play-circle', function(){
		var selected_image = $(this).siblings('.thumbnail').first().children('img');
		var selected_video = $(this).siblings('video').first();
		var video_listener = selected_video.get(0);

	// if user pauses/stops video, 1) display image, 2)hide video, 3)restart carousel
	video_listener.addEventListener("pause", function() { 
//		alert("paused has been triggered"); 			
		selected_image.css("display", "block");
		selected_video.css("display", "none");
	}, true);
	//  Display the video, hide the image, play the video
	selected_video.css('display', 'block');
	selected_image.css('display', 'none');
	selected_video.get(0).play();		
	});
}



/* *****
checkLocalStorage - retrieves the value of variables stored in LocalStorage or if the variable doesn't exist, returns "undefined"

LocalStorage Variables:
1.  geoPermissionsModal - controls if geolocation permissions Modal window will be shown to user
	a.  true - user has viewed modal and will not be shown Modal again.
	b.  undefined - user has not viewed modal and will be shown the Modal.
2.  geolocationAuth - controls if the "Requires sharing location" popover and geolocation instructions modal will be shown to user
	a.  true - user has viewed popover (but not necessarily modal) and will not be shown popover again.
	b.  undefined - user has not viewed popover and will be shown the Modal.
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
checkSessionStorage - retrieves the value of variables stored in SessionStorage or if the variable doesn't exist, returns "undefined"

SessionStorage Variables:
1.  previousSort - stores the last sort button (except 'distance') that the user used.
	
	Scenario: user clicks on the 'distance' sort button but has not enabled geolocation permission.  Application will take the user back 
	to the previous sort results and highlight the appropriate sort button (stored by "previousSort").

*/
function checkSessionStorage(variable){
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
			// used stored sort history since geolocation is not enabled (takes user back to previously clicked sort button)
			$('.sort').removeClass('active'); // removes highlighted buttons
			$('#' + sort_order).addClass('active'); // highlights the previous sort button
		}, 
		"script"
	)
}


	
/* *****
jQuery.dotdotdot - https://github.com/BeSite/jQuery.dotdotdot
Shortens captions by appending three periods
*/
function limit_captions(callback){
//alert("Captions are screwing up because pictures haven't been fully loaded yet by the time dotdotdot executes - need to call dotdotdot after pictures have been loaded");
	$('.dotdotdot').dotdotdot({
        // configuration goes here
    });
	if (callback != null)
	{
		callback();
	}	
}



/* *****
Jquery Datepicker - From jquery-ui-rails gem: http://api.jqueryui.com/datepicker/
For API options, see http://api.jqueryui.com/datepicker/
*/
function calendar_datepicker(){
	$('#venue_event_start_date').datepicker({dateFormat: 'M d, yy (D)', minDate: 0});
}