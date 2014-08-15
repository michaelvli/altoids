/*  Custom javascript for application

Description:
This file contains custom functionality for the application.  Major functionality includes:
1.  Checks for detectDevice cookie (NOT IN THIS FILE - keep reading) - allows application to identify user's device so it can serve the 
	appropriate versions (desktop, tablet, or mobile) versions of a page.  Located in the file, detectDevice.js, 
	this function is executed prior to the code in this file since it needs to be performed before the DOM is
	loaded.  See 'assets/javascript/detectDevice.js' for more info.
2.  initSlideToggler - slides screens horizontally and vertically
3.  initVideoBehavior - binds play button to images and toggles visibility between thumbnails and playing video

	
Plugins:
1.  jquery.cookie
	Source: https://github.com/carhartl/jquery-cookie/tree/v1.4.1
	Type: Jquery plugin
2.  jquery.dotdotdot
	Source: http://dotdotdot.frebsite.nl/
	Type: Jquery plugin
3.  Jquery Datepicker
	Source: http://api.jqueryui.com/datepicker/ 
	Type: From jquery-ui-rails gem
3.  Modernizr
	Source:  https://github.com/russfrisch/modernizr-rails
	Type: Ruby Gem
4.  Turbolinks 
	Notes: Turbolinks fires events on document to provide hooks into the lifecycle of the page -
		page:before-change a Turbolinks-enabled link has been clicked (see below for more details)
		page:fetch starting to fetch a new target page
		page:receive the page has been fetched from the server, but not yet parsed
		page:change the page has been parsed and changed to the new version and on DOMContentLoaded
		page:update is triggered whenever page:change is PLUS on jQuery's ajaxSucess, if jQuery is available (otherwise you can manually trigger it when calling XMLHttpRequest in your own code)
		page:load is fired at the end of the loading process.

	Source: https://github.com/rails/turbolinks
	Type: Ruby Gem
	
*/


$(function() {
//	alert("DOM READY");	
	load_DOM_functions();			
});

//  See file heading for page lifecycle events associated with Turbolinks
//	$(document).on('page:before-change', page_before_change_functions); // a Turbolinks-enabled link has been clicked
//	$(document).on('page:fetch', page_fetch_functions); // starting to fetch a new target page
//	$(document).on('page:receive', page_receive_functions); // the page has been fetched from the server, but not yet parsed
//	$(document).on('page:change', page_change_functions); // is triggered by page:change - https://github.com/rails/turbolinks
	$(document).on('page:update', page_update_functions); // is triggered by page:change PLUS on jQuery's ajaxSucess, if jQuery is available (otherwise you can manually trigger it when calling XMLHttpRequest in your own code) - https://github.com/rails/turbolinks
//	$(document).on('page:load', page_load_functions); // is fired at the end of the loading process. - https://github.com/rails/turbolinks
		
function page_before_change_functions(){
	alert("page_before_change");
}
function page_fetch_functions(){
	alert("page_fetch");
}
function page_receive_functions(){
	alert("page_receive");
}
function page_change_functions(){
	alert("page_change");
}
function page_update_functions(){
//	alert("page_update");
	if ($('.dotdotdot').length){
		truncateText();
	}
}

function page_load_functions(){
	alert("page_load");
}

function sortButtonUpdate(sort_order){
	$('.sort').removeClass('active'); // removes highlighted buttons
	$('#' + sort_order).addClass('active'); // highlights the previous sort button
}



function load_DOM_functions(){
// DEVELOPMENT ONLY - need to remove desktop (and maybe tablet) from the if statement below 
	// Mobile functions only:
	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
//	if ($.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	{
		initSlideToggler();
		hijackMenuButtons();
		getTearsheet();
		initTouchButtons();
		initTearsheetIconButtons();
		initTearsheetEvents();
	}

// DEVELOPMENT ONLY - need to remove pohne (and maybe tablet) from the if statement below 	
	// Desktop functions only:
//	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	if ($.cookie( 'deviceType' ) == 'desktop')
	{
		enableHover();
	}
	
	// Ubiquitous functions
	if ($('.dotdotdot').length)
	{
		truncateText(function(){
			initCarouselActiveSlide();
		});
	}
	if ($('#myCarousel').length) // defining carousel interval and play/pause videos in carousel
	{
		initCarouselBehavior();
	}	
	if ($('#venues').length)
	{
		var user_location = html5_geolocation();
		user_location.initiate( // calls html5 geolocation to access user location
			function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
				loadContent('home','event', user_location.latitude(), user_location.longitude());	// load venues - passing user's latitude and longitude to server 
			},
			function(){ // gets list of venues immediately in case user doesn't set geolocation permission in browser
				loadContent('home','event', '', '');	// load venues without passing user's latitude and longitude to server 
			}
		);
		endlessScroll(); // creates delegated event for endless scrolling
	}
	
	initVideoBehavior(); // binds play button to thumbnail videos
	
	if ($('div.alert').length) // fading out flash message alerts
	{
		fadeOutFlashes();	
	}
	
	if ($('#venue_event_start_date').length)
	{
//		calendar_datepicker(); // plugin
	}	
}



/* ***************************************************************************************** */


function initCarouselActiveSlide(){
	$( ".active.item" ).each(function( index ) { // callback for remove .active class to all items in carousel except the first - allows dotdotdot to complete execution first
		if(index != 0){
			$(this).removeClass('active');
		}
	});
}


			
/* *****
Function: initTouchButtons

Functionality: "Lights up" link buttons (i.e. website, call, event buttons) when clicked and "turns off" 
when not.  Non-link buttons (i.e. map, hours, features) are toggled by bootstrap javascript, using: 
a) data-toggle="collapse" and b) data-target="#map"

Note: Bootstrap has javascript that uses toggle buttons and collapsed content, using data attributes, a) data-toggle="collapse" and 
b) data-target="#map".  This functionality does not meet the needs of this application as content needs to be hidden AND shown individually.
Bootstrap's functionality does not allow for individual control of the hiding and showing of specific content (i.e. maps, features, hours).

Platform: mobile
*/
function initTouchButtons(){
	$('#tearsheet').on('touchstart mousedown', '.btn', function(event){
		 $(this).addClass('active');
	});
	$('#tearsheet').on('touchend mouseup', '.btn', function(event){
		 $(this).removeClass('active');
	});
}

function enableHover(){
	$('#tearsheet').on('mouseenter', '.btn', function(e){
		 $(this).addClass('hoverClass');
	});
	$('#tearsheet').on('mouseleave', '.btn', function(e){
		 $(this).removeClass('hoverClass');
	});
}

/* *****
Function name: getTearsheets

Purpose: Binds event "buttons" on the sessions/event_list.html.erb to take user to a venue tearsheet

Platform: mobile
*/
function getTearsheet(){
	if ($('#events').length)
	{
		$('#events').on('click', 'a.btn-glass', function(event){
			var url = $(this).attr('href') // get the url of the venue website
			updateDynamicPage(url);
			event.preventDefault();
		});
	}
}



/* *****
Function name: initTearsheetIconButtons

Purpose: Binds the following button icons on the tearsheet:
1.  Map - toggles map while hiding hours and features
2.  Hours - toggles hours while hiding map and features
3.  Features - toggles features while hiding hours and map
4.  Website - opens up another browser window to take user to venue website
5.  Call - calls the venue

Note: Bootstrap has javascript that uses toggle buttons and collapsed content, using data attributes, a) data-toggle="collapse" and 
b) data-target="#map".  This functionality is not meet the needs of this application as content needs to be hidden AND shown individually.
Bootstrap's functionality does not allow for individual control of the hiding and showing of specific content (i.e. maps, features, hours).

Platform: mobile
*/
function initTearsheetIconButtons(){
	// controls sliding action to show hidden content (i.e. map, features, or hours)
	$('#tearsheet .btn-group').on('click', '.btn', function(event){
		var button = $(this).data('button'); // find out which button was pressed
		
		if (button == 'website' || button == 'get_directions')  // open the link in a new browser window
		{
			var website = $(this).attr('href') // get the url of the venue website
			window.open(website);  // opens a new browser window
		}
		else if (button == 'phone')
		{
			var phone_number = $(this).attr('href') // get the hyperlink which contains the phone number
			window.location = phone_number; // dials the phone number listed in the link within the same window
		}		
		else
		{			
			$('#' + button).slideToggle(100, function(){ // slide toggles the button pressed
				if($(this).is(':visible') == false) // checks if toggled content (i.e. map, features, or hours) is visible or hidden
				{
					$('#tearsheet .btn').removeClass('active'); //  if toggled content is hidden, then corresponding tearsheet button should not be "lit"
				}
			});
			
			$('#tearsheet .container.collapse').not('#' + button).slideUp(100) // close content that is not selected by the user
		}	
		event.preventDefault(); // stop browser from loading a hyperlink
	});
}



/* *****
Function name: initTearsheetEvents

Purpose: Allow user to toggle between full and partial event descriptions listed on venue tearsheets.

Notes: Initially, the event descriptions will be truncated by the function truncate_text(), triggered by the .dotdotdot class.  
Using a callback with dotdotdot, this function toggles between original and truncated content.  Using the callback allows for 
a smoother transition between original and truncated context (i.e. to prevent content from "jumping").

Platform: mobile
*/
function initTearsheetEvents(){
	// enables the event buttons (i.e. event date, name, description) to toggle between the partial and full description (as well as start vs start/end times) of an event
	$('#tearsheet .btn-group-vertical').on('click', 'a.btn-glass', function(event){
		var event_container = $(this).find('.container');
		var start_stop_time = event_container.find('.event-time.collapse');
		var event_description = event_container.find('.dotdotdot');

		// fade out description first
		event_description.fadeOut(200);

		if (start_stop_time.css('display') == 'none') // event container is "closed" - (1) only truncated event description is displayed and (2) event start and stop times are hidden
		{ 
			event_container.find('.event-time').not('collapse').fadeOut(200); // fade out start time under the date icon
			start_stop_time.fadeIn(200); // fade in start and stop time under event name/above description
			event_container.css('height', 'auto'); // adjust height of container to enclose full description
			
			$(this).find('.dotdotdot').dotdotdot({
				watch: true, //	Whether to update the ellipsis as the window resizes: true/'window'
				callback	: function( isTruncated, orgContent ) {	
//					alert("truncation: " + isTruncated);
//					alert("content" + orgContent.text());
					$(this).empty().append( orgContent ); // append original content after deleting truncated text
					event_description.fadeIn(200); // fades in the event description after dotdotdot has resized everything... smoother transition when using fadeIn as a callback.
				}//	Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string).
			});
		}
		else // event container is "closed" - (1) full event description is displayed and (2) event start and stop times are showing
		{
			event_container.css('height', '7.5em'); // adjust height of container to enclose full description
			event_container.find('.event-time').fadeIn(200); // fades in both event times - 1) start time under date icon, 2) start/end times under event name/above event description
			start_stop_time.fadeOut(200); // fades out start/end times under event name/above event description

			$(this).find('.dotdotdot').dotdotdot({
				watch: true, //	Whether to update the ellipsis as the window resizes: true/'window'
				callback	: function( isTruncated, orgContent ) {	
					event_description.fadeIn(200);  // fades in the event description after dotdotdot has resized everything... smoother transition when using fadeIn as a callback.
				}//	Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string).
			});
		}

		event.preventDefault(); // stop browser from loading a hyperlink
	});
}



/* *****
Function: truncateText

Functionality: 
1.  Uses the jQuery plugin dotdotdot to truncated captions by appending three periods
2.  Removes blank lines if no truncation has occurred - Venue description may be too short so does not need to be truncated.  In this case, 
	there will be blank lines under the short description before the tearsheet icon buttons.  This	looks funny so the following if statement 
	removes blank lines if there are any by setting height to auto when a description has not been truncated.

Source: jQuery.dotdotdot - http://dotdotdot.frebsite.nl/
*/
function truncateText(callback){
//alert("Captions are screwing up because pictures haven't been fully loaded yet by the time dotdotdot executes - need to call dotdotdot after pictures have been loaded");
	$('.dotdotdot').dotdotdot({
		watch: true, //	Whether to update the ellipsis as the window resizes: true/'window'
		callback: function( isTruncated, orgContent ){
			var dotdotdotParent = $(this).parent(); // gets the parent of the selector
//			alert("truncation: " + isTruncated);
//			alert("content" + orgContent.text());

			// checks for "venue-description" class, using toLowerCase to make case insensitive
			// check for truncation
			if (dotdotdotParent.attr("class").toLowerCase().indexOf("venue-description") >= 0 && isTruncated == false)
			{
				$(dotdotdotParent).css('height', 'auto'); // adjust the height to auto not have a bunch of extra blank lines beneath	
			}
			
			if (callback != null)
			{
				callback();
			}	
		}
    });
}



/* *****
Function: initSlideToggler - binds buttons that cause the page to slide left, revealing:
	1) the navigation menu 
	2) new user sign up form
	3) user log in fields

Source: http://www.learningjquery.com/2009/02/slide-elements-in-different-directions/

Platform: mobile only
*/				
function initSlideToggler(){
	// Vertical sliding
	$('.slideToggler-vert').on('click', function(){
		var button = $(this).data('button');
		$('.slideToggler').not('.collapse').toggle(1); // toggle only the .slideToggler elements that are visible (i.e. menu icon but not back arrow icon)
		$('.slideToggler-vert' ).toggle(1); // (i.e. down arrow icon)
		$('.footer-fixed-bottom').toggle(); // switches between the "filter" and "apply filters" button
		$('#filter-container, #dynamic-content' ).slideToggle(); // #dynamic_content needs to be toggled so #filter-container can slide over it
		$('html, body').animate({ scrollTop: 0 }, 0); // take user to top of screen
	});

	// Horizontal sliding
	$('.slideToggler').on('click', function(){
		var slideContent = $('#main-content');
		var collapsibleContent = $('.collapsible');
		var button = $(this).data('button');		

		if (parseInt(slideContent.css('left'),10) == 0)
		{  // open slider to reveal hidden content
			$(collapsibleContent).not(button).hide();
			$(button).show();
			
			slideContent.animate({
				left: -(slideContent.outerHeight())
				},
				function(){
					$('.slideToggler-vert').not('.collapse').toggle(); // toggle only the .slideToggler-vert elements that are visible
					$('.slideToggler').toggle();					
				}
			);
		}
		else // Otherwise, close slider
		{
			$(collapsibleContent).hide();
			slideContent.animate({
				left: 0
				},
				function(){
					$('.slideToggler').toggle();
					$('.slideToggler-vert').not('.collapse').toggle(); // toggle only the .slideToggler-vert elements that are visible
				}
			);
		}
	});
}


	
/* *****
Function: hijackMenuButtons - binds buttons that cause the page to slide left, revealing 1) the navigation menu, 2) new user sign up form, or 3) user log in fields.

Platform: mobile only
*/
function hijackMenuButtons(){
	
	if (Modernizr.history){ // checks for html5 history.pushstate is supported
//		console.log("history.pushState is supported");
		$('#menu a.btn').on('click', function(event){
			var url = $(this).attr('href') // get the url of the venue website			
			updateDynamicPage(url);
			event.preventDefault();
		});
	}
	else
	{
//		console.log("history.pushState is NOT supported");
		alert("history.pushState is NOT supported");
	}
}



/* *****
Function: updateDynamicPage

Functionality:
1) loads ajax content, and 
2) synchronizes it with browser history, enabling use of forward and back buttons in the browser

Source: http://css-tricks.com/rethinking-dynamic-page-replacing-content/
Platform: mobile only
*/
function updateDynamicPage(url){
	// change the url without a page refresh and add a history entry.
	history.pushState(null, null, url);

	// load the content
	loadContent(url);
	
	$(window).bind('popstate', function(){
	   url = location.pathname.replace(/^.*[\\\/]/, ''); //get filename only
	   loadContent(url);
	});
}


/* *****
Function: hijackMenuButtons - binds buttons that cause the page to slide left, revealing 1) the navigation menu, 2) new user sign up form, or 3) user log in fields.

Platform: desktop and mobile
*/
function loadContent(url, sort_order, latitude, longitude){
	var sort_order = sort_order || '',
		latitude = latitude || '',
		longitude = longitude || '';
		
	$.get(	url,
			{sort_order: sort_order, latitude: latitude, longitude: longitude},
			function(){
				$('#back_arrow:visible').trigger('click'); //ensures content is hidden before menu slides back
				
			},
			"script"
	);
}











/* *****
Function: initVideoBehavior - plays, unhides, hides videos from thumbnails

Platform: desktop and mobile
*/
function initVideoBehavior(){
	//  use selector within "on" method to bind to dynamically retrieved (via AJAX) play buttons found in "#main-content" container
	$('#main-content').on('click', '.glyphicon-play-circle', function(){
		var selected_image = $(this).siblings('.thumbnail').first().children('img');
		var selected_video = $(this).siblings('video').first();
		var video_listener = selected_video.get(0);

	// if user pauses/stops video, 1) display image, 2)hide video, 3)restart carousel
	video_listener.addEventListener("pause", function() { 
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
Function initCarouselBehavior - defines carousel behavior in terms of 1)frequency of carousel advancing videos, 2)start/stop of active video

Platform: desktop only
*/
function initCarouselBehavior(){
	// Bootstrap plugin that controls the interval for advancing the carousel - http://getbootstrap.com/javascript/#carousel
	$('.carousel').carousel({
		interval: 5000
	});
	if ($('video').length) // mobile view template for carousel uses thumbnails instead of video
	{
		// start playing first video
		$('div.carousel-inner').find('.active').children('video').get(0).play();
		
		// start/pause videos based on when carousel finishes sliding
		$('.carousel').on('slid.bs.carousel', function () {
			
			/* 	play active video
				1) Find the descendants of 'div.carousel-inner' that have the class, 'active'. "Find" method is recursive, looking at all levels below
				2) Get the descendants of the elements returned from step #1.  "Children" method looks only one level deep, making if faster than the "find" method.
				3) Get the DOM element of the jQuery object returned from step #2.  In this case, the element is an HTML video element.  A jQuery object is an array-like structure of DOM elements.
				4) Play is a method that is used on DOM elements (not jQuery objects).  The HTML video element is played.
			*/
			$('div.carousel-inner').find('.active').children('video').get(0).play(); 
			
			/* 	pause all inactive videos
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
fadeOutFlashes - fades out flash messages displayed to user

Platform: mobile and desktop
*/
function fadeOutFlashes(){
//	alert('TEXT: ' + $('div.alert').text().indexOf('Please fix the errors below')); // problem with "creating a free account" from mobile splash page
	if ($('div.alert').text().indexOf('Please fix the errors below') >= 0) // problem with "creating a free account" from mobile splash page
	{
		$('#sign_up_button').trigger("click");
	}
	setTimeout(function(){
		$("div.alert").slideUp(200, 0, function(){
			$(this).remove();		
		});
	}, 3000);
}



/* *****
Function: endlessScroll - uses ajax to load additional pagination elements as user scrolls down 
From Ryan Bates - http://railscasts.com/episodes/114-endless-page-revised

Notes:
	1.  Use session variable, "endless_scroll_status", to control calling function in the case the user scrolls down too quickly (which results in duplicate results retrieved).
*/ 
function endlessScroll(){

		// Ensures additional videos are loaded incrementally (vs. a large number at once):
		$(window).scroll(function(event){
			var url = $('.pagination .next_page').attr('href'); // global variable - http://learn.jquery.com/javascript-101/scope/

			// 1. Check if url is available (url should not be available until results have been retrieved)
			// 2. Check if user has scrolled near bottom of page
			// 3. Check if initial set of venues (loaded by function locate_user) has been loaded		
//			console.log($(window).scrollTop() + " : " + $(document).height() + " : " + $(window).height())
			if ((url) && $('#venues').children().length > 0 && checkSessionStorage('endless_scroll_status') != 'busy' && $(window).scrollTop() > $(document).height() - $(window).height() - 200)
			{
// alert(url);
				sessionStorage['endless_scroll_status'] = 'busy';				
				$('.pagination').html('<br><h4>Loading...</h4>');
				$.get(	url,
						{scroll: true},
						function(){
//							alert( "Success: endless_scroll " );
							sessionStorage['endless_scroll_status'] = 'ready';
						}, 
						"script"
				)				
			}
			event.preventDefault(); // prevents scrolling to top of the page
		});
		// manually initiate a scroll in case user's viewport might be big enough
		$(window).scroll();
}



/* *****
checkSessionStorage - retrieves the value of variables stored in SessionStorage or if the variable doesn't exist, returns "undefined"

SessionStorage Variables:
1.  previousSort - stores the last sort button (except 'distance') that the user used.
	
	Scenario: user clicks on the 'distance' sort button but has not enabled geolocation permission.  Application will take the user back 
	to the previous sort results and highlight the appropriate sort button (stored by "previousSort").

Related commands:
//sessionStorage.clear();
	
*/
function checkSessionStorage(variable){
    if(typeof sessionStorage[variable] == "undefined")
	{
        return "undefined";
	}	
    else
	{
        return sessionStorage[variable];
	}	
}