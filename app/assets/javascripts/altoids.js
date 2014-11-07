/*  Custom javascript for application

Description:
This file contains custom functionality for the application.  Major functionality includes:
1.  Checks for detectDevice cookie (NOT IN THIS FILE - keep reading) - allows application to identify user's device so it can serve the 
	appropriate versions (desktop, tablet, or mobile) versions of a page.  Located in the file, detectDevice.js, 
	this function is executed prior to the code in this file since it needs to be performed before the DOM is
	loaded.  See 'assets/javascript/detectDevice.js' for more info.
2.  initTogglers - slides screens horizontally and vertically
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
//	$('.carousel').carousel({
//		interval: 5000
//	});

	// loads venue thumbnails	
	if ($('#venues').length){
		loadContent("home"); // default parameters for getting venues, sorted by events
	}
	
//	calendar_datepicker(); // plugin
//	truncateText(function(){
//		initCarousel();
//	});
//	initCarouselVideos(); // plays videos in carousel
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
	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
//	if ($.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	{
		initTogglers();  // enables mobile screen to switch between the four main containers: #menu, #main-content, #slider, and #specific-content
//		hijackMenuButtons();
//		initPopState(); // 1) binds popstate event, 2) loads url contents via ajax
//		getTearsheet();
//		initTouchButtons();
//		initTearsheetIconButtons();
//		initTearsheetEvents();
//		initApplyFilterButton();	
	}

// DEVELOPMENT ONLY - need to remove phone (and maybe tablet) from the if statement below 	
	// Desktop functions only:
//	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	if ($.cookie( 'deviceType' ) == 'desktop')
	{
//		initCarouselVideos(); // play/pause videos in carousel
//		enableHover();
//		initSortFilterButtons();
//		initModals();
//		getTearsheet(); // opens a tearsheet
//		initFilterSortContainer(); // initializes positioning, scrolling, and keyup events related to filter and sort bar
	}
	
	// Ubiquitous functions
	
	// Prepare carousel slider
	truncateText(function(){
		// Removes .active class to all items in carousel except the first - allows dotdotdot to complete execution first
		$( ".active.item" ).each(function( index ) {
			if(index != 0){
				$(this).removeClass('active');
			}
		});	
	});
	
//	initVideoUpload();
//	initVideoBehavior(); // binds play button to thumbnail videos
//	fadeOutFlashes(); // fading out flash message alerts
//	initPopover( function(){
//		$(document).on('click', '#showGeolocationInstructions', function(){
//			$('#mainModal').showModal({
//				title: "Geolocation Enablement",
//				body: "<p>To share your location, you will need to: </p>"
//			});
//		});
//	}); // initialize popover	
//	endlessScroll(); // creates delegated event for endless scrolling
//	calendar_datepicker(); // plugin
	
}


/* ***************************************************************************************** */




/* *****
Function: initTogglers - binds buttons that cause the page to slide left, revealing:
	1) the navigation menu 
	2) new user sign up form
	3) user log in fields

Source: http://www.learningjquery.com/2009/02/slide-elements-in-different-directions/

Platform: mobile only
*/
function initTogglers(){
	var buttonCollection = ".btn-glass, #filter_button, #menu_button, #rightPane, .rightPane, #btn-close";
	var scrolling = false; // Stores whether user is scrolling vs. "pressing" a button.  Default is that the user is scrolling.
	
	// Checks to see if the user is scrolling (vs. "pressing" a button).  If user is scrolling, scrolling will be set to true.
	$(document).on("touchmove", buttonCollection , function(event){
		scrolling = true; // setting scrolling to true will prevent .btn-glass buttons from 1) reaching the .active state and 2) checking the checkbox.
	});

	// Checks to see if the user is "pressing" a button (vs. scrolling).
	$(document).on("touchstart", buttonCollection, function(event){
		scrolling = false; // setting scrolling to false will allow .btn-glass buttons to 1) convert to .active state and 2) checking the checkbox.
	});

	// Vertical sliding for the following pages: 1) sign up form, 2)log in form, and 3) filter and sort menu
	$(document).on('touchend, click', '#sign_up_button, #log_in_button, #filter_button', function(event){
		if (scrolling == false)
		{
			// var url = $(this).attr('href'); // get the url of the venue website
			var page = "#" + $(this).data('page');

			// sets Slider's title
			var sliderTitle = $(this).data('title') || "Filter Results";

			// adds/removes .active state, causing button to flicker
			var button = $(this);
			button.addClass("active"); // adds .active state
			setTimeout(function () {
				button.toggleClass("active"); // removes .active state after 50 ms
			}, 50)

			// only show the appropriate page in the slider
			$('#slider-body').children().hide(); // hide all forms within #slider-body
			$(page).show(); // show the relevant page: 1) #sign_up_form, 2) #log_in_form, or 3) #filter_sort_menu
			
			// close menu
			togglePane({
				pane: "menu",
				state: "close",
				callback: 	function(){
								toggleSlider(sliderTitle); // open vertical slider after menu is closed
							}
			});
		}
		event.preventDefault();
	});	
	
	// toggling slider
	$('#slider').on('touchend, click', '#btn-close', function(){
		if (scrolling == false)
		{
			toggleSlider();
		}	
	});
	
	// toggling menu
	$('#menu_button').on('touchend, click', function(){
		if (scrolling == false)
		{
			togglePane({
				pane: "menu"
			});
		}	
	});

	// toggling rightPane
	$('#back_arrow_button').on('touchend, click', function(){
		if (scrolling == false)
		{
			togglePane();
		}	
	});

	// bind thumbnails of class=".rightPane" to open rightPane
	$(document).on('touchend, click', '.rightPane', function(event){
		if (scrolling == false)
		{
			var url = $(this).attr('href'); // get the url of the button

			togglePane({
				state: "open",
				title: $(this).data("title"),
				callback:
				function(){
					// show preloader
					$("#rightPane_preloader").show();
					loadContent(url); // loadContent(url, [serializedData], [requestMethod]), [] = optional			
				}
			});
		}	
		event.preventDefault();
	});
	
	preLoadContent();
}

/*
Function: bindTouchButtons()

Purpose: 
	
Called by: 
1. views_mobile\sessions\tearsheet.js.erb

Platform: mobile only
*/
function bindTouchButtons(options){
	// Mode has 3 options:
	// 1) toggle_many = multiple buttons can be active at once, 
	// 2) toggle_one = only one button is active at a time, 
	// 3) flash = a single button flashes	
	var settings = $.extend({
		// These are the defaults.
		scope: "document",
		buttonCollection: "",
		mode: "flash", 
		callback: ""
	}, options );
	
	// clear previous bindings
	$(settings.scope).off("touchstart");

	// Checks to see if the user is "pressing" a button (vs. scrolling)
	$(settings.scope).on("touchstart", settings.buttonCollection, function(event){
		var button = $(this);
		/* Bind buttons to discern between touchmove and touchstart; otherwise, user will have trouble scrolling. */
		// Checks to see if the user is scrolling (vs. "pressing" a button).  If user is scrolling, scrolling will be set to true.
		button.on("touchmove", function(){
			button.off("touchend");
		});

		// Bind touchstart functions to sort options to show .active state as well as check appropriate radio button.
		// Using preventDefault and jquery to control hidden radio button to avoid the delay between touching a button
		// and actually seeing the active state of the button (and the hidden radio button being selected)
		button.on("touchend", function(event){

			if (settings.mode == "flash")
			{
				button.addClass("active"); // puts button in .active state
				setTimeout(function () { // setTimeout function creates a slight delay, causing button to flash
					button.toggleClass("active"); // removes .active state
				}, 50);
			}
			else if (settings.mode == "toggle_one")
			{
				$(settings.scope + " " + settings.buttonCollection).not(button).removeClass("active"); // only one sort button can be active at a time
				// setTimeout provides a small delay before putting the button in .active state.
				// without the delay, button will not reach .active state, probably because the previous function 
				// to remove .active state from non-relevant buttons takes too long and javascript is asynchronous.
				setTimeout(function () { 
					button.toggleClass("active"); // toggles .active state 
				}, 0);
			}
			else (settings.mode == "toggle_many")
			{
				button.toggleClass("active"); // puts button in .active state						
			}

			button.off("touchend");

			// execute callback if one was provided
			if (settings.callback != "")
			{
				setTimeout(function() {
					settings.callback.call(button.data("button"));
				}, 0);
			}			
			
			event.preventDefault();
		});
	});	
}



/* *****
Function name: activateTearsheetOptions

Purpose: Binds the following button icons on the tearsheet:
1.  Map - toggles map while hiding hours and features
2.  Hours - toggles hours while hiding map and features
3.  Features - toggles features while hiding hours and map
4.  Website - opens up another browser window to take user to venue website
5.  Call - calls the venue

Note: Bootstrap has javascript that uses toggle buttons and collapsed content, using data attributes, a) data-toggle="collapse" and 
b) data-target="#map".  This functionality is not meet the needs of this application as content needs to be hidden AND shown individually.
Bootstrap's functionality does not allow for individual control of the hiding and showing of specific content (i.e. maps, features, hours).

Called by: 
1. views_mobile\sessions\tearsheet.js.erb

Platform: mobile
*/
function activateTearsheetOptions(button){
	alert(button);
	
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
}













/*
Function: togglePane({pane, state, callback})

Purpose:
1.  Supports the sliding menu by moving "fixed" elements (i.e. main content and the navbar).  
2.  Once the menu is open, this function "locks" the main content by changing the position to "fixed".  This way, the 
main content is not scrollable on touch screens while user scrolls on the open menu.

Note: There is a conflict with #navbar due to the function, initFilterSortContainer().  initFilterSortContainer() is
a desktop function but during development/testing, sometimes all functions are called.  This conflict causes the navbar
to move to the left of the screen when opening the menu from a mobile device (after scrolling on the menu).
Specifically, one of the scroll event in initFilterSortContainer(), sets the "left" position of #navbar to 0.  Once the
mobile and desktop functions are separated, this conflict shouldn't come up.

Platform: mobile only
*/
function togglePane(options){
	var slideContent = $('#main-content, #navbar, #navbar-fixed-bottom'), // the elements that need to "slide"
		mainContent = $('#main-content'),
		screenWidth = mainContent.width(), // get width of the #main-content
		navbarHeight = $('#navbar').outerHeight(), // get height of navbar
		lastSelector = ""; // margins around the menu button,
		

	var settings = $.extend({
		// These are the defaults.
		pane: "rightPane",
		title: "",
		state: "",
		callback: ""
	}, options );

	slideContent.each(function(){
		lastSelector = $(this).attr("id"); // sets lastSelector to the last id selector in slideContent
	}); 

	if (settings.pane == 'menu')
	{
		var menuButton = $('#menu_button'),
			menuButtonWidth = menuButton.outerWidth(),
			margin = menuButton.offset().left, // get margin between edge of navbar and menu button.
			animateLeft = screenWidth - menuButtonWidth - (2 * margin), // redefine animateLeft for menu (since it only partially slides) for float left elements (i.e. menu button)
			animateRight = -screenWidth + menuButtonWidth + (2 * margin); // redefine animateLeft for menu (since it only partially slides) for float right elements (i.e. logo)
	}
	else
	{
		var animateLeft = -screenWidth, // animateLeft sets the left property of the elements (i.e. menu button) of slideContent.  Defaulted for the rightPane (if menu is selected, animateLeft is redefined below).
			animateRight = screenWidth; // animateRight sets the right property of the elements (i.e. logo) of slideContent.  Defaulted for the rightPane (if menu is selected, animateRight is redefined below).	
		$('#rightPane-title').text(settings.title); // insert name of the bar for the title of the rightPane		
	}
	
	// open menu if 1) "state" is not passed in to the function and the menu is closed OR 2) if user manually specified "open"
	if (settings.state == "open" || settings.state == "" && parseInt(mainContent.css('left'),10) == 0)
	{  
		// stores the number of pixels that the user has scrolled from the top in #mainContent prior to opening menu
		// scrollTopPosition is used in conjunction with initialTopPosition in order to "store" the position
		var scrollTopPosition = $(window).scrollTop();

		// menu_button should be in .active state.
		$("#menu_button").addClass("active");
		
		$("#"+settings.pane).show(); // menu/rightPane starts off as display: none;

		// slide menu to the right
		slideContent.animate({
			left: animateLeft, // for float left elements (i.e. menu button)
			right: animateRight // for float right elements (i.e. logo)
			}, 400,
			function(){
				if ($(this).attr("id") == lastSelector)
				{
					// Change css of mainContent in order to "fix" its position so it doesn't move around when user scrolls on the open menu
					mainContent.css('position', 'fixed'); // Need to use "fixed" position in order to prevent user from scrolling #main-content when menu is open
					mainContent.css('top', navbarHeight - scrollTopPosition); // Adjust height of #main-content because it will move under navbar since #main-content's position is changing from "relative" to "fixed"

					// takes user to top of screen
					$('html, body').animate({
						scrollTop: 0 
						}, 0,
						function(){}
					);

					// execute callback if one was provided
					if (settings.callback != "")
					{
						settings.callback.call(this);
					}
				}
			}
		);		
	}
	else // Otherwise, close menu
	{
		// stores the number of pixels that the user has scrolled from the top in #mainContent prior to opening menu
		var initialTopPosition = parseInt(mainContent.css('top'),10) - navbarHeight;

		// menu_button should be in .active state.
		$("#menu_button").removeClass("active");
		
		// slide menu to the left
		slideContent.animate({
			left: 0, // for float left elements (i.e. menu button)
			right: 0 // for float right elements (i.e. logo)
			}, 400,	
			function(){
				if ($(this).attr("id") == lastSelector)
				{
					// return mainContent to css state prior to opening menu
					mainContent.css('position', 'absolute'); // Undo fixed position after menu is closed to #main-content is scrollable again.
					mainContent.css('top', '51px'); // Adjust height of #main-content to place it immediately underneath navbar
					
					$("#"+settings.pane).hide(); // hide menu/rightPane when pane is closing so it doesn't overflow

					// return user to scroll position prior to opening menu					
					$('body').animate({
						scrollTop: -initialTopPosition + 'px'
						}, 0,
						function(){}
					);
					
					// execute callback if one was provided
					if (settings.callback != "")
					{
						settings.callback.call(this);
					}
				}
			}
		);
	}
}


/*
Function: toggleSlider()

Supports the slider pane by
1.  Placing the closed slider at the bottom of the screen or placing the open slider at the top of the screen
2.  Opening the slider or closing the slider
3.  Showing/hiding the appropriate content (slider title, slider body)
4.  binding buttons to appropriate active states as well as checking radio buttons and checkboxes

Platform: mobile only
*/
function toggleSlider(title, callback){
	var slider = $('#slider');
	var sliderTitle = title || "";
	var bar = $('#slider-bar');
	var body = $('#slider-body');
	var mainContent = $('#main-content');
	
	if (sliderTitle != "")
	{
		$('#slider-title').text(sliderTitle);
	}	

	// 	Need to know the bottom of the browser window for 2 reasons:
	//	1. Open slider: This is where the vertical slide "first appears" before sliding up to top of browser window
	// 	2. Close slider: this the destination point to where the vertical slider will disappear as it slides down from top of browser window
	var screenHeight = $(window).outerHeight(); // get the height of the screen, including padding and borders
	
	if (slider.css('display') == 'none') // if slider is closed, then open
	{
		var sliderEndPosition = 0;
		var sliderStartPosition = screenHeight; // get the height of the screen, including padding and borders

		var scrolling = true; // Stores whether user is scrolling vs. "pressing" a button.  Default is that the user is scrolling.

		
		/* Bind buttons to discern between touchmove and touchstart; otherwise, user will have trouble scrolling. */
		// Checks to see if the user is scrolling (vs. "pressing" a button).  If user is scrolling, scrolling will be set to true.
		$("#filter_options, #sort_options").on("touchmove", ".btn-glass", function(event){
			scrolling = true; // setting scrolling to true will prevent .btn-glass buttons from 1) reaching the .active state and 2) checking the checkbox.
		});

		// Checks to see if the user is "pressing" a button (vs. scrolling)
		$("#filter_options, #sort_options").on("touchstart", ".btn-glass", function(event){
			scrolling = false; // setting scrolling to false will allow .btn-glass buttons to 1) convert to .active state and 2) checking the checkbox.
		});
				
		// Bind touchstart functions to sort options to show .active state as well as check appropriate radio button.
		// Using preventDefault and jquery to control hidden radio button to avoid the delay between touching a button
		// and actually seeing the active state of the button (and the hidden radio button being selected)
		$("#sort_options").on("touchend", ".btn-glass", function(event){
			if (scrolling == false) // means user is "pressing" the button (vs. scrolling)
			{
				$("#sort_options .btn-glass").removeClass("active"); // only one sort button can be active at a time
				$(this).addClass("active").find("input:radio").prop("checked", true);
				event.preventDefault();
			}	
		});
		
		// Bind touchend function to filter options to show .active state as well as toggle appropriate checkbox.
		// Note: .preventDefault() stops scrolling when sliding along the filter options.  But need to use 
		// preventDefault and jquery to control checkbox to avoid the delay between touching a button and 
		// actually seeing the checkbox being checked - more responsive UI.
		$("#filter_options").on("touchend", ".btn-glass", function(event){
			if (scrolling == false) // means user is "pressing" the button (vs. scrolling)
			{
				var button = $(this);
				var checkbox = button.addClass("active").find("input:checkbox"); // puts button in .active state
				
				setTimeout(function () {
					button.toggleClass("active"); // removes .active state, causing button to flicker
				}, 50)
		
				// toggle checkbox
				if (checkbox.prop("checked") == true)
				{
					checkbox.prop("checked", false);
				}	
				else
				{
					checkbox.prop("checked", true);
				}
				event.preventDefault();
			}	
		});
	}
	else // if slider is open, then close
	{
		var sliderEndPosition = screenHeight; // get the height of the screen, including padding and borders
		var sliderStartPosition = 0;
		
		$("#apply_filter_navbar").hide(); // hide "apply filters" button - executes before slider starts to close for a smoother UI
		
		$("#sort_options").off("touchend");
		$("#filter_options").off("touchend");
		
		mainContent.show(); // hide content underneath slider in case of overflow
	}
	
	slider.css('top', sliderStartPosition); // sets the top of the slider to the top or bottom of the screen

	bar.css('position', 'relative'); // ensure that .bar within #slider starts off as relative positioning; otherwise, the bar will not "slide down" when closing the slider
	body.css('top', 0); // ensures that .body within #slider is directly under the bar (used when slider is closing); otherwise, body of the slider will be "too far" down from the slider bar
	
	slider.animate({
		'top': sliderEndPosition + 'px', // slides the vertical slider to top or bottom of screen.
		'display': 'show' // shows the contents of the vertical slide as it slides; after animation is over, #slider will revert back to display: none
		}, 400, 
		function(){
			if ($(this).toggle().css('display') == "block") // if slider is open after toggle, hide mainContent
			{
				mainContent.hide();
				$("#apply_filter_navbar").fadeIn(200); // show "apply filters" button - executes after slider is open for a smoother UI
			}

			var barHeight = bar.outerHeight();
			bar.css('position', 'fixed'); // transition from relative to fixed positioning
			body.css('top', barHeight); // move .body within #slider down by the height of the .header; otherwise, body of the slider will run underneath the bar
		}
	);	
}


/* *****
Function: preLoadContent - prepares ajax request by:
	1) getting form action or url href
	2) getting/serializing data from form or url
	3) if necessary, getting geolocation info prior to making ajax request

Pages:
	1) filter_sort_menu.html.erb
	2) log_in.html.erb
	3) sign_up.html.erb
	
Platform: mobile only
*/
function preLoadContent(){
	// .showPreloader class is attached to any submit button that loads new content
	$(document).on("click", ".showPreloader", function(event){
		var page = "#" + $(this).data('page'); // uses ID to get the div that contains the relevant form
		var form = $(page).children("form"); // specifies the form tag within the div specified by the custom data attribute, "page".
		var requestMethod = form.attr("method") || "get"; // Grabs the method attribute specified within the form.  If form does not exist, then the request must be GET since 1) only a form can specify POST method and 2) GET methods can be specified within forms or by urls
		var serializedData = form.serialize() || "";
		var url = form.attr('action') || $(this).attr('href') // get the action attribute from the relevant form, if one exists; otherwise, get the url of the button 
		
//		$("#main_preloader").show();

		toggleSlider(); // close slider

		url = url + '?' + serializedData; 

		sort_order = getURLParameters(url, 'sort_order');
		
		if (sort_order == 'distance')
		{			
			getGeolocation(function(){				
				loadContent(url, serializedData, requestMethod); // loadContent(url, [serializedData], [requestMethod]), [] = optional			
			});
		}
		else
		{
			loadContent(url, serializedData, requestMethod); // loadContent(url, [serializedData], [requestMethod]), [] = optional			
		}
		
		event.preventDefault();
	});
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
	
		$("#form_sortFilter input[name!='sort_order']").serialize();

	The statement above says serialize all parameters, hidden and visible, from the form, #form_sortFilter with
	the exception of the sort_order parameter.


Platform: desktop and mobile
*/
function loadContent(url, serializedData, requestMethod){
	var latitude = checkSessionStorage('latitude'), 
		longitude = checkSessionStorage('longitude'),
		serializeData = serializedData || '',
		requestMethod = requestMethod || "get";
		
	// add latitude and longitude information if it exists to the serialized data
	if (latitude != 'undefined' &&  longitude!= 'undefined')
	{
		var userLocation = {latitude: latitude, longitude: longitude};
		serializedData = serializedData + '&' + $.param( userLocation ); // $.param creates a serialized representation of the userLocation object		
	}
	
	$("#main_preloader").show();
	
	// use AJAX to retrieve dynamic content, passing the url and serialized (and redundant-free) parameters
	if (requestMethod == "get")
	{
		var request = 	$.get(	url,
								serializedData,
								function(){
								},
								"script"
							);
	}
	else
	{
		var request = $.post(	url,
								serializedData,
								function(){
								},
								"script"
							);
	}
	
	request.done(function(){
		fadeInContent();  // ensures thumbnails are fully loaded before preloader.gif fades out
	});
	
	request.fail(function(){
	//	alert("error!");
	});		
}

function fadeInContent(){
	var thumbnailCount = 0,
		loadedImageCount = 0;
		
	thumbnailCount = $(".thumbnail").length;
	
	var refreshId = setInterval(function() { // this code is executed every 500 milliseconds:
						loadedImageCount = 0;
						$(".thumbnail").each(
							function(){
								 if (parseInt($(this).children("img").css("width"), 10) > 200)
								 {
									loadedImageCount = loadedImageCount + 1
								 }
							}
						);
						if (loadedImageCount >= thumbnailCount)
						{
							clearInterval(refreshId);
							$("#main_preloader").fadeOut(400);
						}
					}, 200);
}























function initCarousel(){
	// Removes .active class to all items in carousel except the first - allows dotdotdot to complete execution first
	$( ".active.item" ).each(function( index ) {
		if(index != 0){
			$(this).removeClass('active');
		}
	});	
}


function initFilterSortContainer(){
		placeFilterSortContainer(); // enables the filter/sort bar to scroll horizontally even though it's css position is "fixed"
		
		$(window).resize(function(){ // need to reposition the filter/sort bar every time browser window sizes changes.
			placeFilterSortContainer(); // enables the filter/sort bar to scroll horizontally even though it's css position is "fixed"
		});

		$(window).scroll(function(){
			$('#navbar').css('left',-$(window).scrollLeft()); // enables navbar to scroll horizontally even though it's css position is "fixed" 
			placeFilterSortContainer();  // enables the filter/sort bar to scroll horizontally even though it's css position is "fixed"
		});		
			
		$('#form_sortFilter input').keyup(function () {
			var url = $("#form_sortFilter").attr('action');
			loadContent(url, $('#form_sortFilter').serialize());
			return false;
		});
}

/* *****
Function: placeFilterSortContiner

Functionality:
1.  Positions the Sort/Filter bar on the right side of the page in a fixed position
2.  "Moves" the Sort/Filter bar as the user scrolls left of right to provide the illusion of a fixed position

Notes: Need "fixed" position when user scrolls horizontally but "relative" position when user scrolls vertically - 
this is not possible with CSS.  Thus, need to use a "Fixed" position while using jQuery to provide the illusion of 
"Relative" positioning.  Because a "Fixed" position for the sort/filter bar, application needs to provide a distance from the left 
of the screen every time the user scrolls horizontally or resizes the browser window.  Without this functionality,
the sort/filter bar would be locked on the right side of the page, independent of the rest of the content.  Using
this function, the sort/filter bar will be horizontally positioned relative to the rest of the content while 
vertically, it is fixed.

Platform: desktop
*/
function placeFilterSortContainer(){
	var browserWidth = $(window).width();
	var contentContainerWidth = $('#main-content .container').outerWidth(); // .outerWidth includes padding and border of the element
	var margin = (browserWidth - contentContainerWidth)/2;
	var filterContainerWidth = $('#filter-container').width(); // no padding, margin, or border
	$('#filter-sort').css('width', filterContainerWidth); // .outerWidth includes padding and border of the element
	if (margin > 0)
	{
		$('#filter-sort').css('left', margin + (contentContainerWidth - filterContainerWidth) - 15); // 15px for margin from .col-xs-3 class
	}
	else
	{
		$('#filter-sort').css('left', contentContainerWidth - filterContainerWidth - $(window).scrollLeft() - 15); // 15px for margin from .col-xs-3 class
	}
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

Platform: mobile and desktop
*/
function getTearsheet(){
	$(document).on('click', '#events a.btn-glass', function(event){
		var url = $(this).attr('href') // get the url of the venue website
		
		// change the url without a page refresh and add a history entry.
//		history.pushState(null, null, url);

		// load the content
		loadContent(url);
		
		event.preventDefault();
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
	2.  Manually initiates a scroll event	
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
		var url = $('#form_sortFilter').attr('action'); // gets the action attribute of #form_sortFilter which seems to be the home_path		
		var serializedData = cleanSerializedData(url);  // remove redundant parameters from combining form and url variables
		loadContent(url, serializedData);
	});
  
	// Sort buttons
	$(document).on('click', '.sort', function(){
		var url = $(this).attr('href'), // url contains parameters specifying sort, search, etc.
			sort_order = '',
//			sort_order = $(this).data('sort'), // grabs the value of the custom attribute, data-sort
			serializedData = cleanSerializedData(url);  // remove redundant parameters from combining form and url variables

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
	$('#btn-default, #btn-close').on('click', function(){
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
Function: cleanSerializedData()

Description: 
1.  Returns serialized string of parameters, ready to be added to a url
2.  Removing redundant variables found in the form, #form_sortFilter, and url input.

Inputs:
1.  url

Platform: desktop and mobile
*/
function cleanSerializedData(url){
	var serializedData = $("#form_sortFilter").serialize(), // serializes all parameters from the form, #form_sortFilter 
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
	
	serializedData = $("#form_sortFilter"+ " " + excludeSelector).serialize(); // create a serialized list of parameters from the form, #form_sortFilter, excluding those already found in the passed url
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
	
		$("#form_sortFilter input[name!='sort_order']").serialize();

	The statement above says serialize all parameters, hidden and visible, from the form, #form_sortFilter with
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
							$('#preloader').delay(100).show();
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
						$("#mainModal .preloader").hide();;
					}
					
					
				});
				console.log("Upload failed:");
				console.log(data);
			}	
		});
	});	
}

/*
Function: initModals()

Description: Opens a modal window with the appropriate content for the following:
	1.  Displaying venue tearsheets
	2.  Watching, editing, deleting videos
	3.  Editing user profile

Platform: desktop
*/

function initModals(){
	$('.button_video_show,.button_video_edit, .button_video_delete, #button_user_edit, .thumbnail_session_tearsheet').off('click'); // removes delegated events as well
	
	// bind "watch" button from videos/index.html.erb and "edit" button from users/edit.html.erb
	$(document).on('click', '.button_video_show, #button_user_edit, .thumbnail_session_tearsheet', function(event){
		var url = $(this).attr('href'); // url may contain parameters specifying video id, etc.
		var modalTitle = $(this).data("modal-title"); // data attribute in html is "modal_title" but the underscore is turned into a dash, generating "modal-title" for use in jquery
		var preloader = $("#mainModal .preloader");
		var modalBodyContent = $("#mainModal .modal-body-content");
			
		modalBodyContent.hide(); // clear content, if any, from previous modal opened.
		preloader.show();
			
		// Open empty modal
		$('#mainModal').showModal({
			title: modalTitle,
			body: "",
			callback: function(){
			}
		});
		
		loadContent(url);// Get video or user (ultimately, from an Amazon S3 object - in show action of video controller)
		event.preventDefault();
	});
	
	// bind "edit" button from videos/index.html.erb
	$(document).on('click', '.button_video_edit', function(event){
		var url = $(this).attr('href'); // url contains parameters specifying video id, etc.
		loadContent(url)	
		event.preventDefault();
	});
	
	// bind "delete" button from videos/index.html.erb
	$(document).on('click', '.button_video_delete', function(event){
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
						success: function(){ // success callback
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
				}); // $("#btn-primary").on()
			} // callback
		}); // $('#mainModal')
		
		event.preventDefault();
	});
}



/* NOT USED */
/* *****
Function: initApplyFilterButton - binds the "Apply Filters" button which is displayed when user is on the 
sort and filter from a mobile device.

Platform: mobile
*/
function initApplyFilterButton(){
	// Search form - using "Apply Filters" button
	$('#apply_filter_button').on('click', function(){
		var url = $('#form_sortFilter').attr('action'); // gets the action attribute of #form_sortFilter which seems to be the home_path

		serializedData = cleanSerializedData(url);  // remove redundant parameters from combining form and url variables
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
