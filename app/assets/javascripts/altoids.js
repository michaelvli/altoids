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
	$(document).on('page:change', page_change_functions); // is triggered by page:change - https://github.com/rails/turbolinks
//	$(document).on('page:update', page_update_functions); // is triggered by page:change PLUS on jQuery's ajaxSucess, if jQuery is available (otherwise you can manually trigger it when calling XMLHttpRequest in your own code) - https://github.com/rails/turbolinks
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
//	alert("page_change");
	// Bootstrap plugin that controls the interval for advancing the carousel - http://getbootstrap.com/javascript/#carousel
	$('.carousel').carousel({
		interval: 5000
	});
	
	if ($('#venues').length){
		loadContent('home'); // default parameters for getting venues, sorted by events
	}
	
	calendar_datepicker(); // plugin
	
	initCarouselVideos(); // plays videos in carousel
	truncateText(function(){
		// Removes .active class to all items in carousel except the first - allows dotdotdot to complete execution first
		$( ".active.item" ).each(function( index ) {
			if(index != 0){
				$(this).removeClass('active');
			}
		});	
	});
}
function page_update_functions(){
	alert("page_update");
}

function page_load_functions(){
	alert("page_load");
}

function load_DOM_functions(){	

// DEVELOPMENT ONLY - need to remove desktop (and maybe tablet) from the if statement below 
	// Mobile functions only:
//	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	if ($.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	{	
		initSlideToggler();  // enables mobile screen to toggle left/right to show menu or up/down to show filters
		hijackMenuButtons();
		initPopState(); // 1) binds popstate event, 2) loads url contents via ajax
		getTearsheet();
		initTouchButtons();
		initTearsheetIconButtons();
		initTearsheetEvents();
		initApplyFilterButton();	
	}

// DEVELOPMENT ONLY - need to remove pohne (and maybe tablet) from the if statement below 	
	// Desktop functions only:
//	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	if ($.cookie( 'deviceType' ) == 'desktop')
	{
		initCarouselVideos(); // play/pause videos in carousel
		enableHover();
		initSortFilterButtons();
	}
	
	// Ubiquitous functions
	truncateText(function(){
		// Removes .active class to all items in carousel except the first - allows dotdotdot to complete execution first
		$( ".active.item" ).each(function( index ) {
			if(index != 0){
				$(this).removeClass('active');
			}
		});	
	});
	initVideoUpload();
	initVideoBehavior(); // binds play button to thumbnail videos
	initVideoButtonBehavior(); // binds edit and update buttons for video index
	fadeOutFlashes(); // fading out flash message alerts
	initPopover( function(){
		$(document).on('click', '#showGeolocationInstructions', function(){
			$('#mainModal').showModal({
				title: "Geolocation Enablement",
				body: "<p>To share your location, you will need to: </p>"
			});
		});
	}); // initialize popover	
	endlessScroll(); // creates delegated event for endless scrolling
	calendar_datepicker(); // plugin
	
}




/* ***************************************************************************************** */

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
	$(document).on('touchstart mousedown', '#tearsheet .btn, #menu .btn', function(event){
		 $(this).addClass('active');
	});
	$(document).on('touchend mouseup', '#tearsheet .btn, #menu .btn', function(event){
		 $(this).removeClass('active');
	});
}

function enableHover(){
	$(document).on('mouseenter', '#tearsheet .btn', function(e){
		 $(this).addClass('hoverClass');
	});
	$(document).on('mouseleave', '#tearsheet .btn', function(e){
		 $(this).removeClass('hoverClass');
	});
}

/* *****
Function name: getTearsheets

Purpose: Binds event "buttons" on the sessions/event_list.html.erb to take user to a venue tearsheet

Platform: mobile
*/
function getTearsheet(){
	$(document).on('click', '#events a.btn-glass', function(event){
		var url = $(this).attr('href') // get the url of the venue website
		
		// change the url without a page refresh and add a history entry.
		history.pushState(null, null, url);

		// load the content
		loadContent(url);
		
		event.preventDefault();
	});
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
	$(document).on('click', '#tearsheet .btn-group .btn', function(event){
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
	$(document).on('click', '#tearsheet .btn-group-vertical a.btn-glass', function(event){
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
	$(document).on('click', '#filter_button, #apply_filters_button, #down_arrow', function(){ // select for .slideToggler-vert elements - but using ID in delegated event handling is faster than using Class
		var button = $(this).data('button');
		$('.slideToggler').not('.collapse').toggle(1); // toggle only the .slideToggler elements that are visible (i.e. menu icon but not back arrow icon)
		$('.slideToggler-vert' ).toggle(1); // (i.e. down arrow icon)
		$('.footer-fixed-bottom').toggle(); // switches between the "filter" and "apply filters" button
		$('#filter-container, #dynamic-content' ).slideToggle(); // #dynamic_content needs to be toggled so #filter-container can slide over it
		$('html, body').animate({ scrollTop: 0 }, 0); // take user to top of screen
	});

	// Horizontal sliding
	$(document).on('click', '#menu_button, #back_arrow, #log_in, #sign_up', function(){ // select for .slideToggler elements - but using ID in delegated event handling is faster than using Class
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
		$(document).on('click', '#menu a.btn', function(event){
			var url = $(this).attr('href'); // get the url of the venue website			
			
			// change the url without a page refresh and add a history entry.
			history.pushState(null, null, url);

			// load the content
			loadContent(url);
	
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
Function: initPopState

Browser inconsistency:
1.  http://stackoverflow.com/questions/4688164/window-bind-popstate - The HTML5 spec states that popstate 
	should not fire on page load. Firefox 4 and Chrome 34 got this right but Safari mobile and Chrome mobile seems to fire 
	popstate on page load (which actually is good for us).

Source: http://css-tricks.com/rethinking-dynamic-page-replacing-content/
Platform: mobile only
*/
function initPopState(){
	$(window).on('popstate', function(){
	   url = location.pathname.replace(/^.*[\\\/]/, ''); //get filename only
//	   console.log("called popstate: " + url);
	   loadContent(url);
	});
}



/* *****
Function: initVideoBehavior - plays, unhides, hides videos from thumbnails

Platform: desktop and mobile
*/
function initVideoBehavior(){
	// use selector within "on" method to bind to dynamically retrieved (via AJAX) play buttons 
	// found in "#main-content" container.
	// Click events don't bubble to the "document" level on apple touch devices so need to add "touch" 
	// events: http://stackoverflow.com/questions/10165141/jquery-on-and-delegate-doesnt-work-on-ipad
	$(document).on('click touchend', '#main-content .glyphicon-play-circle', function(){
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
Function initCarouselVideos - defines carousel behavior in terms of:
1)frequency of carousel advancing videos, 
2)start/stop of active video

Platform: desktop only
*/
function initCarouselVideos(){
	var first_video = $('div.carousel-inner').find('.active').children('video');
	
	if (first_video.length > 0){
		// start playing first video
		first_video.get(0).play();
		
		// start/pause videos based on when carousel finishes sliding
		$('.carousel').on('slid.bs.carousel', function () {
			var video = $('div.carousel-inner').find('.active').children('video');
			/* 	play active video
				1) Find the descendants of 'div.carousel-inner' that have the class, 'active'. "Find" method is recursive, looking at all levels below
				2) Get the descendants of the elements returned from step #1.  "Children" method looks only one level deep, making if faster than the "find" method.
				3) Get the DOM element of the jQuery object returned from step #2.  In this case, the element is an HTML video element.  A jQuery object is an array-like structure of DOM elements.
				4) Play is a method that is used on DOM elements (not jQuery objects).  The HTML video element is played.
			*/

			video.get(0).play(); 
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
	1.  Use "activeRequest" variable to control calling function multiple times in the case the user scrolls 
		down too quickly (which results in duplicate results retrieved).
*/ 
function endlessScroll(){
		// Ensures additional videos are loaded incrementally (vs. a large number at once):
		$(window).scroll(function(event){
			var url = $('.pagination .next_page').attr('href'); // global variable - http://learn.jquery.com/javascript-101/scope/

			// 1. Check if url is available (url should not be available until results have been retrieved)
			// 2. Check if user has scrolled near bottom of page
			// 3. Check if initial set of venues (loaded by function locate_user) has been loaded		
//			console.log($(window).scrollTop() + " : " + $(document).height() + " : " + $(window).height())
			var activeRequest = false; // holds the status of the .get() request to make sure only one request is sent out at a time
			if ((url) && $('#venues').children().length > 0 && !activeRequest && $(window).scrollTop() > $(document).height() - $(window).height() - 200)
			{
				activeRequest = true;  // .get() request is about to be called
				$('.pagination').html('<br><h4>Loading...</h4>');
				$.get(	url,
						{scroll: true},
						function(){
//							alert( "Success: endless_scroll " );
							activeRequest = false; // .get() request is finished
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
2.  latitude - 
3.  longitude -
	
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



/* *****
Function: initApplyFilterButton - binds the "Apply Filters" button which is displayed when user is on the 
sort and filter from a mobile device.

Platform: mobile
*/
function initApplyFilterButton(){
	// Search form - using "Apply Filters" button
	$(document).on('click', '#apply_filters_button', function(){
		var url = $('#sortFilter_form').attr('action'); // gets the action attribute of #sortFilter_form which seems to be the home_path

		serializedData = getCleanSerializedData(url);  // remove redundant parameters from combining form and url variables
		// url is from the form and shouldn't contain sort_order (i.e. /home) 
		// thus, to add serializedData, we need to use a question mark vs. an ampersand
		url = url + '?' + serializedData; 
	
		sort_order = getURLParameters(url, 'sort_order');
		if (sort_order == 'distance')
		{
			
			getGeolocation(function(){				
				loadContent(url); // retrieve venue list based on sort_order		
			});
		}
		else
		{
			loadContent(url); // retrieve venue list based on sort_order		
		}
	});
}



function initPopover(callback){
	// Initializing popover prior to binding to click handler or else popover will require two clicks - http://stackoverflow.com/questions/12333585/twitter-bootstrappopovers-are-not-showing-up-on-first-click-but-show-up-on-seco
	// Because the "trigger" option is set to manual, activate popover using:
	//		$('#distance').popover('toggle');
	// This popover is triggered in html5_geolocation.js during the error callback when user denies geolocation permission
	$('#distance').popover({trigger: 'manual',
							delay: {show: 0, hide: 0}, // doesn't work when trigger is set to "manual"
							content: "Requires location sharing. <a id='showGeolocationInstructions' href='#'>More</a>",
							placement: 'top',
							html: 'true'
	});
	
	$('#distance').on('shown.bs.popover', function(){
		setTimeout(function(){
			$('#distance').popover('hide');
		}, 3000);
	});
	
	callback();
}



/* *****
Function: initSortFilterButtons - provides functionality for 
	1.  sort buttons on the home page by grabbing value of the data-sort custom attribute.
	2.  search field

Possible values of data-sort:
	1. name_asc (venue name ascending order)
	2. name_desc (venue name in descending order)
	3. neighborhood (neighborhood in ascending order)
	4. distance (distance of venue from user in ascending order)
	5. event (start day/time of an event in chronological order)

Platform: desktop	
*/
function initSortFilterButtons(){	
//	if (checkSessionStorage('previousSort') == 'undefined')
//	{
//		sessionStorage['previousSort'] = 'event'; //default value is "Featured" on screen
//	}
							
	// Search form - instant response (i.e. not using "Apply Filters" button)
	$(document).on('click', '.filter', function(){
		var url = $('#sortFilter_form').attr('action'); // gets the action attribute of #sortFilter_form which seems to be the home_path		
		var serializedData = getCleanSerializedData(url);  // remove redundant parameters from combining form and url variables
		loadContent(url, serializedData);
	});
  
	// Sort buttons
	$(document).on('click', '.sort', function(){
		var url = $(this).attr('href'), // url contains parameters specifying sort, search, etc.
			sort_order = '',
//			sort_order = $(this).data('sort'), // grabs the value of the custom attribute, data-sort
			serializedData = getCleanSerializedData(url);  // remove redundant parameters from combining form and url variables

		// url is from the link and contains sort_order (i.e. /home?sort_order='neighborhood') 
		// thus, to add serializedData, we need to use an ampersand vs. a question mark
		url = url + '&' + serializedData;  // adds serialized form parameters (such as sort_order) to the url
		
		sort_order = getURLParameters(url, 'sort_order'); // get the value of the url parameter, sort_order

		if (sort_order == 'distance')
		{
			// check if user has seen geolocation permission modal or if user has enabled or disabled geopermission
			// only scenarios where geolocation permission modal is shown:
			// 1.  User has not seen the modal before
			// 2.  User did not enable or disable geolocation (i.e. user did not answer the geolocation prompt from browser)
			if (checkSessionStorage("geoPermission") == "undefined") 
			{
				$('#mainModal').showModal({
					title: "Geolocation Permission",
					body: "<p>Geolocation needed to see how far venues are from you.  To enable geolocation, click the 'Enable Geolocation' button and enable geolocation.</p>",
					primaryBtn: "Enable Geolocation",
					callback: showGeoPermissionModal()
				});
			}
			else
			{
				getGeolocation(function(){				
					loadContent(url); // retrieve venue list based on sort_order
				});
			}	
		}
		else
		{
			loadContent(url); // retrieve venue list based on sort_order		
		}
	});
}


function showGeoPermissionModal(){
	
	$('#btn-primary').on('click', function(){ // bind "Enable Geolocation" button
		getGeolocation(function(){				
			loadContent(url); // retrieve venue list based on sort_order
		});
		$('#mainModal').modal("hide");
		$('#btn-primary').off();
	});
	
	// unbind Enable Geolocation button if user clicks the close or "X" button
	$('#btn-default, #close').on('click', function(){
		$('#btn-primary').off();
	});
	
	// unbind Enable Geolocation button if user presses escape, backspace, and enter keys
	$('#mainModal').keyup(function(event){
		// keyCodes: escape = 27, backspace = 8 , enter = 13
		if (event.keyCode == 27 || event.keyCode == 8 || event.keyCode == 13){ 
			$('#btn-primary').off(); 
		}
	})
}



/* *****
Function: loadContent

Description: Uses AJAX to load dynamic content.  loadContent() also manipulates the data (i.e. serializedData)
that accompanies .get(), adding items such as latitude and longitude while excluding redundant parameters such
as sort_order.

Notes:
1.  url - can contain url parameters such as sort_order, search, latitude, longitude
	
2.  When using .get(url, data, callback(), 'script'), parameters can be passed within the "url" or "data" 
	arguments.  Thus, certain parameters such as sort_order from the user clicking on a url link or submitting 
	a form (as hidden or visible parameters).  Parameters from a form are serialized (using .serialize() method)
	before being added to the url.  Thus, we need to remove redundant parameters when using .serialize().  To
	prevent redundant url variables, make sure the selector for the .serialize() method follows the following form:
	
		$("#sortFilter_form input[name!='sort_order']").serialize();

	The statement above says serialize all parameters, hidden and visible, from the form, #sortFilter_form with
	the exception of the sort_order parameter.


Platform: desktop and mobile
*/
function loadContent(url, serializedData){
	var latitude = checkSessionStorage('latitude'), 
		longitude = checkSessionStorage('longitude'),
		serializeData = serializedData || '';
		
	// add latitude and longitude information if it exists to the serialized data
	if (latitude != 'undefined' &&  longitude!= 'undefined')
	{
		var userLocation = {latitude: latitude, longitude: longitude};
		serializedData = serializedData + '&' + $.param( userLocation ); // $.param creates a serialized representation of the userLocation object		
	}
	
	// use AJAX to retrieve dynamic content, passing the url and serialized (and redundant-free) parameters
	$.get(	url,
		serializedData,
		function(){
			$('#back_arrow:visible').trigger('click'); //ensures content is hidden before menu slides back
		},
		"script"
	);
}



/* *****
Function: getCleanSerializedData()

Description: 
1.  Returns serialized string of parameters, ready to be added to a url
2.  Removing redundant variables found in the form, #sortFilter_form, and url input.

Inputs:
1.  url

Platform: desktop and mobile
*/
function getCleanSerializedData(url){
	var serializedData = $("#sortFilter_form").serialize(), // serializes all parameters from the form, #sortFilter_form
	paramNamesArray = getURLParameters(url),
	excludeSelector = ''; // getURLParameters returns an array of the names of url parameters
		
	// remove redundant url parameters
	$.each(paramNamesArray, function(index, value){	// cycle through all names of URL parameters 
		position = serializedData.indexOf(value); //  see if any parameters match those in serializedData variable.
		if (position > 0){ // if there is a match
			excludeSelector = excludeSelector + "input[name!='" + value + "'] " // add the variable to the selector in order to exclude the extraneous parameter
		}
	})
	excludeSelector = excludeSelector.trim(); // removes whitespace at beginning and end
	
	serializedData = $("#sortFilter_form " + excludeSelector).serialize(); // create a serialized list of parameters from the form, #sortFilter_form, excluding those already found in the passed url
	return serializedData;
}



/*
Function: getURLParameters

Description:
1.  Returns an array of the names (but not values) of url parameters.
2.  Returns the value of a single url parameter

Notes:
1.  url - can contain url parameters such as sort_order, search, latitude, longitude
	
2.  When using .get(url, data, callback(), 'script'), parameters can be passed within the "url" or "data" 
	arguments.  Thus, certain parameters such as sort_order from the user clicking on a url link or submitting 
	a form (as hidden or visible parameters).  Parameters from a form are serialized (using .serialize() method)
	before being added to the url.  Thus, we need to remove redundant parameters when using .serialize().  To
	prevent redundant url variables, make sure the selector for the .serialize() method follows the following form:
	
		$("#sortFilter_form input[name!='sort_order']").serialize();

	The statement above says serialize all parameters, hidden and visible, from the form, #sortFilter_form with
	the exception of the sort_order parameter.
	
	Thus, because of this function, url parameters have priority of form parameters (hidden and visible).


Platform: desktop and mobile
*/



function getURLParameters(url, paramSearch){
	var urlArray = url.split("?"), // create a url Array where the [0] element is the href while the [1] element contains the paramters
		paramNamesArray = [], // array that holds the names (without values) of each parameter in the url
		paramSearch = paramSearch || '', // the specific url parameter that is being searched for
		paramValue = ''; // holds the value of the url parameter that matches paramSearch
		
	if (urlArray[1] != undefined) // check to make sure that there are url parameters
	{
		entireParamsString = urlArray[1].toString(); // 2nd array element has all the parameter names and values
		
		entireParamsArray = entireParamsString.split("&"); // use array to hold all paramaters (name and value)
		
		// store only the name (without the value) of each parameter in a new array
		$.each(entireParamsArray, function(index, value) {
			paramName = value.toString().split("=")[0].toString(); // separate the name of the parameter from its value
			if (paramName == paramSearch)
			{
				paramValue = value.toString().split("=")[1].toString(); // separate the value of the parameter from its name
				return paramValue;
			}
			paramNamesArray.push(paramName); // push the name of the parameter into a new array
		});
	}
	if (paramValue != '')
	{
		return paramValue; // returns value of a specific parameter in the url
	}
	else
	{
		return paramNamesArray; // returns an array of parameter names found in the url
	}	
}



function getGeolocation(callback){
		var user_location = html5_geolocation();
		user_location.initiate( // calls html5 geolocation to access user location
			function(){
				sessionStorage['latitude'] = user_location.latitude();
				sessionStorage['longitude'] = user_location.longitude();
				callback();
			}
		);
}

/* *****
Jquery Datepicker - From jquery-ui-rails gem: http://api.jqueryui.com/datepicker/
For API options, see http://api.jqueryui.com/datepicker/
*/
function calendar_datepicker(){
	$('#venue_event_start_date').datepicker({dateFormat: 'M d, yy (D)', minDate: 0});
}


function initVideoUpload() {
	$(document).on('click', '#new_video span', function(){
		$('#new_video span').fileupload({
			dataType: "script", // a script ("videos/create.js.erb") from the server will be executed after the file uploads
			progressInterval: 100,
			// add function is triggered each time a video is added, providing an object, "data", which can be used to fetch information such as the file object (files.[0])
			add: function (e, data) { 
				types = /(\.|\/)(mp4|mov)$/i;
				file = data.files[0];
				if (types.test(file.type) || types.test(file.name))
				{
					data.context = $(tmpl("template-upload", data.files[0]));
					$('#progress-bar-anchor').append(data.context);
					data.submit(); // triggers uploading of the file
				}
				else
				{
					alert("#{file.name} is not a .mp4 or .mov video file")
				}
			},
			progress: function (e, data) { // progress callback function which updates the progress bar
				if (data.context)
				{	
					// Bootstrap-ProgressBar Plugin: http://www.jqueryrain.com/?Y6ZaxIid
					$('.progress .progress-bar').progressbar({
						display_text: 'fill',
						done: function(){
							$('#preloader').delay(1000).show();
						}
					});
		
	//				Using Bootstrap-ProgressBar (above) instead of code below:
	//				progress = parseInt(data.loaded / data.total* 100, 10);
	//				data.context.find('.progress-bar').css('width', progress + '%').text(progress + "%"); // find the progress bar and change the width value
				}
			},
			done: function(e, data){ // called when file is finished uploading
				if (data.context)
				{
					$('#preloader').slideUp(500);
					data.context.slideUp(500); // remove progress bar
					$('#mainModal').showModal({
						title: "Notification",
						body: "<p>Your video is now processing.  We will send you a notification when it's ready to view.</p>"
					});				
				}	
			},
			fail: function(e, data){
				$('#preloader').slideUp(500);
				data.context.remove(); // remove progress bar
				$('#mainModal').showModal({
					title: "Alert",
					body: "<p>Video failed to upload.</p>",
					callback:	function(){
						
					}
					
					
				});
				console.log("Upload failed:");
				console.log(data);
			}	
		});
	});	
}


function initVideoButtonBehavior(){
	$('.video_watch_button,.video_edit_button, .video_delete_button').off('click'); // removes delegated events as well
	
	// bind "watch" button from videos/index.html.erb
	$(document).on('click', '.video_watch_button', function(event){
		var url = $(this).attr('href'); // url contains parameters specifying video id, etc.
		var videoName = $(this).data("video");
		var preloader = $("#mainModal .preloader");
		var modalBodyContent = $("#mainModal .modal-body-content");
		
		modalBodyContent.hide(); // clear content, if any, from previous modal opened.
		preloader.show();
		
		// Open empty modal
		$('#mainModal').showModal({
			title: videoName,
			body: "",
			callback: function(){
			}
		});

		// Get video (ultimately, from an Amazon S3 object - in show action of video controller)
		$.get(	url,
			"",
			function(){
				var video = $(modalBodyContent).find('video').get(0);
				video.oncanplay = function(){
					$("#btn-default").on('click', function(){
						video.pause();
					});
					preloader.hide();
					modalBodyContent.fadeIn(500);
					video.play();
				}	
			},
			"script"
		);
				
		event.preventDefault();
	});
	
	// bind "edit" button from videos/index.html.erb
	$(document).on('click', '.video_edit_button', function(event){
		var url = $(this).attr('href'); // url contains parameters specifying video id, etc.

		$.get(	url,
			"",
			function(){
//				alert("success callback");
			},
			"script"
		);
	
		event.preventDefault();
	});
	
	// bind "delete" button from videos/index.html.erb
	$(document).on('click', '.video_delete_button', function(event){
		var url = $(this).attr('href'); // url contains parameters specifying video id, etc.
		var videoName = $(this).data("video");
		var videoID = url.replace("/videos/", "");
		var video_selector = ".video_" + videoID;

		$('#mainModal').showModal({
			title: "Video: " + videoName,
			body: "<p>Are you sure you want to delete this video?</p>",
			defaultBtn: "Cancel",
			primaryBtn: "Delete",
			callback: function(){
				$("#btn-primary").off('click');
				$("#btn-primary").on('click', function(){
					$("#mainModal").modal("hide"); // hide modal
					$(video_selector).slideUp(500);	// video thumbnail row is faded out but not deleted until after controller executes destroy action	
					
					// List of ajax events: http://api.jquery.com/Ajax_Events/
					$.ajax({
						type: "DELETE", // The type of request to make ("POST" or "GET"), default is "GET". Note: Other HTTP request methods, such as PUT and DELETE, can also be used here, but they are not supported by all browsers.
						url: url,
						data: "",
						success: function(){
//							alert("sweet success!!!");
						},
						error: function(){
								$('#mainModal').showModal({
									title: "Notification",
									body: "<p>Your video can not be deleted at this time.</p>"
								});
								$(video_selector).slideDown(500);
						},
						dataType: "script"
					}); // $.ajax
					
				}); // $("#btn-primary")
			} // callback
		}); // $('#mainModal')
		
		event.preventDefault();
	});
}