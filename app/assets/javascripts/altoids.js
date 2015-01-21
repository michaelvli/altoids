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
	debug = false; // global variable: true = "clicks" are active, false = only initButtons_XXX are active
	
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

	// Load venue thumbnails
	// Venue thumbnails are always loaded by AJAX bc need to check client for geolocation info.
	// #venues is inserted into DOM via views_mobile/sessions/home.html.erb
	if ($("#mainPane").find('#venues').length)
	{
		var url = "home";
		loadContent(url); // default parameters for getting venues, sorted by events
	}
	
//	calendar_datepicker(); // plugin
//	truncateText(function(){
//		initCarousel();
//	});
//	initCarouselVideos(); // plays videos in carousel
}

function page_update_functions(){
//	alert("page_update");
}

function page_load_functions(){
//	alert("page_load");
}

function load_DOM_functions(){
// DEVELOPMENT ONLY - need to remove desktop (and maybe tablet) from the if statement below 
	// Mobile functions only:
	if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
//	if ($.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
	{		
		initTouchOnCarousel(); // initialize left/right swiping on carousel
		initCarousel();  // initializes carousel with one active carousel item and sets slide interval speed
		initButtons_Menu();  // binds touch buttons for #menu element
		initButtons_Main();  // binds touch buttons for #mainPane element
		initButtons_Right();  // binds touch buttons for #rightPane element
		initButtons_Slider();  // binds touch buttons for #slider element
		
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
//	truncateText(function(){
//		initCarousel();
//	});
	
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
Function: initTogglers - binds touch events to control the 4 panes of the application:
	1. Main Content pane
	2. Menu pane
	3. Slider pane
	4. Right pane

Source: http://www.learningjquery.com/2009/02/slide-elements-in-different-directions/

Platform: mobile only
*/
function initButtons_Menu(){
		
// Destroy action is NOT called via data-method=delete; instead, passing "logout" parameter instead (see below)
// Menu pane: enables touch behavior for "log out" button
// Rails :remote => true attribute (found in the html of the "log out" button in the menu bar) is not necessary for touch events (but necessary for click events)
//	bindTouchButtons({
//		scope: "#menu",
//		buttonCollection: ".btn-glass[data-method=delete]",
//		mode: "toggle_one",
//		callback: function(){
//			
//			var url = this.attr("href");
//			loadContent(url, {
//				requestMethod: "delete"
//			});
//			
//			togglePane({
//				pane: "menu",
//				state: "close"
//			});
//		}
//	});

	// Menu pane: binds "log out" button in menu
	// for mobile, using destroy action:
	// 1.  pass url = "logout" to router
	// 2.  router matches url to "destroy" action in sessions controller
	// 3.  controller executes "sign_out" method
	// 4.  controller redirects to splash action
	// 5.  because step #1 is ajax, splash.js.erb is called	
	bindTouchButtons({
		scope: "#menu",
		buttonCollection: ".btn-glass[data-button=logout]",
		mode: "toggle_one",
		callback: function(){
			
//			var url = "splash?logout=true";
			var url = "logout";
			loadContent(url); // default parameters for getting venues, sorted by events
			
			togglePane({
				pane: "menu",
				state: "close"
			});
		}
	});
	
	// Menu pane: binds menu selection buttons (except for "sign up" and "log in" buttons which is handled below)
	bindTouchButtons({
		scope: "#menu",
		buttonCollection: ".btn-glass[data-button!=logout]",		
//		buttonCollection: ".btn-glass[data-method!=delete]", // not using normal destroy action in session controller to log the user out - using logic in the splash action instead (see above)
		mode: "toggle_one",
		callback: function(){
			// the "this" variable represents the $(this) jquery object passed in from the .call($(this)) 
			// method of either:
			// 1. the "keypress" event, or
			// 2. the "touchend" event
			// within bindTouchButtons.  
			// If the callback is invoked by the "keypress" event, then the "this" represents the "input" 
			// element within the "scope" parameter of this function.  On the other hand, if the callback is
			// invoked by the "touchend" event, then $(this) represents the "buttonCollection" parameter of 
			// this function.  Either way, preLoadContent() finds the parent "form" element of $(this), 
			// regardless whether it represents the "input" element or buttonCollection to determine the 
			// appropriate Rails controller/action.
			preLoadContent(this); // "this" is a jqObj referring to the clicked .btn-glass[data-button!=logout]
		
			togglePane({
				pane: "menu",
				state: "close"
			});
		}
	});

	// Menu pane: binds sign_up and log_in buttons (in the menu bar vs in the actual form) to reveal relevant "sign up" or "log in" forms
	bindTouchButtons({
		scope: "#menu, #mainPane",
		buttonCollection: "#sign_up_button, #log_in_button, #create_free_account_button",
		mode: "flash",
		callback: function(){
			// the "this" variable represents the $(this) jquery object passed in from the .call($(this)) 
			// method of either:
			// 1. the "keypress" event, or
			// 2. the "touchend" event
			// within bindTouchButtons.  
			// If the callback is invoked by the "keypress" event, then the "this" represents the "input" 
			// element within the "scope" parameter of this function.  On the other hand, if the callback is
			// invoked by the "touchend" event, then $(this) represents the "buttonCollection" parameter of 
			// this function.  Either way, preLoadContent() finds the parent "form" element of $(this), 
			// regardless whether it represents the "input" element or buttonCollection to determine the 
			// appropriate Rails controller/action.
			var pageID = "#" + this.data('page');

			// sets Slider's title
			var sliderTitle = this.data('title');

			// close menu pane
			togglePane({
				pane: "menu",
				state: "close",
				callback: function(){
					toggleSlider({ // open vertical slider after menu is closed
						title: sliderTitle,
						sliderChild: pageID // pageID = #log_in_form || #sign_up_form
					});
					$("#menu_button").removeClass("active"); // ensures menu_button is not active
				}
			});
		}
	});

	
// BEGIN DEBUG //
	if (debug)
	{	
		// Menu: "sign up" and "log in" buttons that open the slider to show the appropriate form (vs. submit the form with user information)
		$("#menu, #mainPane").on("click", "#sign_up_button, #log_in_button, #create_free_account_button", function(event){
			button_obj = $(this) // button object is created from the "this" parameter passed by the callback in bindTouchButtons()
			var pageID = "#" + button_obj.data('page');

			// sets Slider's title
			var sliderTitle = $(this).data('title');
				
			// close menu pane
			togglePane({
				pane: "menu",
				state: "close",
				callback: function(){
					toggleSlider({ // open vertical slider after menu is closed
						title: sliderTitle, 
						sliderChild: pageID
					});	
					$("#menu_button").removeClass("active"); // ensures menu_button is not active
				}
			});	
		
			event.preventDefault();
		});
		
	// NOT USING DESTROY ACTION TO LOGOUT USER.	Instead, using code within splash action of session controller for logout functionality.	
		// used in conjunction with Rails :remote => true attribute (found in the html of the "log out" button in the menu bar)
	//	$("#menu").on("click", ".btn-glass[data-method=delete]", function(event){
	//		
	//		var url = $(this).attr("href");
	//		loadContent(url, {
	//			requestMethod: "delete"
	//		});
	//		
	//		togglePane({
	//			pane: "menu",
	//			state: "close"
	//		});
	//		
	//		event.preventDefault();
	//	});
		
		// Menu: "logout" menu button
		$("#menu").on("click", ".btn-glass[data-button=logout]", function(event){

	//		var url = "splash?logout=true";
			var url = "logout";
			loadContent(url); // default parameters for getting venues, sorted by events

			togglePane({
				pane: "menu",
				state: "close"
			});	

			event.preventDefault();
		});
		
		// Menu: menu buttons except for "logout"
	//	$("#menu").on("click", ".btn-glass[data-method!=delete]", function(event){
		$("#menu").on("click", ".btn-glass[data-button!=logout]", function(event){
			var jqObj = $(this);
			togglePane({
				pane: "menu",
				state: "close",
				callback: function(){
					preLoadContent(jqObj); // gets the parent "form" element from the jquery object, "$(this)"
				}
			});
			
			event.preventDefault();
		});
	}
// END DEBUG //
}

function initButtons_Main(){
	
	// mainPane: binds menu button to toggle menu
	bindTouchButtons({
		scope: "#navbar",
		buttonCollection: "#menu_button",
		mode: "toggle_one",
		callback: function(){
			// toggle menu
			togglePane({
				pane: "menu"
			});
		}
	});

// BEGIN DEBUG //
	if (debug)
	{	
		// Navbar: "menu" icon button
		$("#navbar").on("click", "#menu_button", function(){
			togglePane({
				pane: "menu"
			});
		});
	}
// END DEBUG //	
}

function initButtons_Right(){

	// rightPane: toggles back arrow button
	bindTouchButtons({
		scope: "#navbar-rightPane",
		buttonCollection: "#back_arrow_button",
		mode: "flash",
		callback: function(){
			togglePane({
				callback: function(){
					// clear title and contents of rightPane after it closes
					$("#navbar-rightPane").find(".dynamicTitle").text("");	// clear title
					var rightPane = $("#rightPane");
					rightPane.find(".dynamicContent").text("");	// clear content
					rightPane.css("position", "fixed").css("top", "52px"); // reset position to fixed - when user toggles map, features, or hours button on tearsheet, position = relative and top = 0px (allows .animate({scrolltop: 0}) to function).
				}
			});
		}
	});

// BEGIN DEBUG //
	if (debug)
	{	
		$("#navbar-rightPane").on("click", "#back_arrow_button", function(){
			togglePane({
				callback: function(){
					// clear title and contents of rightPane after it closes
					$("#navbar-rightPane").find(".dynamicTitle").text("");	// clear title
					var rightPane = $("#rightPane");
					rightPane.find(".dynamicContent").text("");	// clear content
					rightPane.css("position", "fixed").css("top", "52px"); // reset position to fixed - when user toggles map, features, or hours button on tearsheet, position = relative and top = 0px (allows .animate({scrolltop: 0}) to function).
				}
			});
		});
	}
// END DEBUG //	
}

function initButtons_Slider(){

	// Slider pane: binds submit buttons in "sign up" and "log in" forms
	bindTouchButtons({
		scope: "#sign_up_form, #log_in_form",
		buttonCollection: ".btn",
		stopPropagation: true, // need .stopPropagation because element overlaps with other .btns in #slider
		mode: "flash",
		callback: function(){		
			// the "this" variable represents the $(this) jquery object passed in from the .call($(this)) 
			// method of either:
			// 1. the "keypress" event, or
			// 2. the "touchend" event
			// within bindTouchButtons.  
			// If the callback is invoked by the "keypress" event, then the "this" represents the "input" 
			// element within the "scope" parameter of this function.  On the other hand, if the callback is
			// invoked by the "touchend" event, then $(this) represents the "buttonCollection" parameter of 
			// this function.  Either way, preLoadContent() finds the parent "form" element of $(this), 
			// regardless whether it represents the "input" element or buttonCollection to determine the 
			// appropriate Rails controller/action.
			var jqObj = this;
			toggleSlider({
				callback: function(){
					// NOTE: need to call preloadcontent after slider has closed; otherwise, it's possible 
					// that the slider will not be properly "closed" (i.e. "display" property is not reset
					// to "none", and "top" is not reset to "0") which would cause abnormal slider behavior
					// next time the user opens the slider.
					preLoadContent(jqObj);
				}
			}); // close slider
		}
	});
	
	// Slider pane: closes slider
	bindTouchButtons({
		scope: "#slider",
		buttonCollection: "#btn-close",
		mode: "flash",
		callback: function(){
			toggleSlider(); // close slider
		}
	});
	
// BEGIN DEBUG //
	if (debug)
	{	
		// Slider: "sign up" and "log in" buttons to submit a form (vs. opening slider with appropriate form)
		$("#sign_up_form, #log_in_form").on("click", "input.btn", function(event){
			var jqObj = $(this);
			toggleSlider({
				callback: function(){
					// NOTE: need to call preloadcontent after slider has closed; otherwise, it's possible 
					// that the slider will not be properly "closed" (i.e. "display" property is not reset
					// to "none", and "top" is not reset to "0") which would cause abnormal slider behavior
					// next time the user opens the slider.
					preLoadContent(jqObj);
				}
			}); // close slider

			event.stopPropagation(); // need .stopPropagation because element overlaps with other .btns in #slider
			event.preventDefault();
		});

		// Slider: closes slider
		$("#slider").on("click", "#btn-close", function(){
			toggleSlider(); // close slider
		});
	}
// END DEBUG //	
}


/*
Function: bindTouchButtons()

Purpose: 
1.  Handles "keypress" event when user presses the "done" or "go" button on virtual keyboard (keycode: 13)
2.  Binds specified delegated touch events
3.  Distinguish between touchend vs touch move - this allows users to scroll or "click" on a touch screen.  
	Without being able to distinguish the difference, users will have trouble scrolling as all touch actions 
	would trigger a "click".
4.  Adds/removes active class for a button to create a flash or toggle.  A flash is triggered when user
	presses a button that lights up (i.e. active state) and immediately turns off.  A toggle is triggered 
	when a user presses a button that lights up and stays "on" until the user presses the button again.  A
	group of buttons may have multiple buttons that may be turned on (like checked checkboxes) or a single 
	button that is toggled at a time (such as with radio buttons)

Notes: 
1. 	Use touch events instead of click event to avoid the brief delay between pressing a button and observing
	the tiggered behavior (i.e. screen moving or button toggling).
2.  alert boxes interfere with touch event cycle; causes the browser to remember the touch end event (button is always behind by one event - notice this when checkout the custom data attribute in the alert box)
	http://stackoverflow.com/questions/7463594/how-do-i-prevent-touchend-event-from-apparently-being-remembered-by-the-browse
	Be sure to use setTimeout as seen in code below
	
Called by: 
1. altoids.js
2. views_mobile\sessions\tearsheet.js.erb
3. views_mobile\sessions\home.js.erb

Platform: mobile only
*/
function bindTouchButtons(options){
	// Mode has 4 options for button active state:
	// 1) toggle_checkbox = multiple buttons can be active at once, 
	// 2) toggle_radio = only one button as well as relevant radio button is active at a time,
	// 3) toggle_one = only one button is active at a time (no radio buttons involved),
	// 4) flash = a single button flashes
	// 5) none = no active state for button
	var settings = $.extend({
		// These are the defaults.
		scope: "body", // the "bound" element for a delegated event
		buttonCollection: "", // the selector used in a delegated event
		stopPropagation: false, // sets jquery .stopPropagation() method - for overlapping html elements - http://stackoverflow.com/questions/11499169/target-element-in-overlapping-element
		mode: "none", // toggle mode for a button
		callback: ""
	}, options );
	
	// clear previous bindings
	$(settings.scope).off("touchstart", settings.buttonCollection);
	
// need to disable click handler for the same touch event because when using links, it's possible to activate 
// the link when "touching" just outside of the <a> element within the following:
//   	<div class="btn-vertical-group">
//   		<a class="btn">
//			</a>
//  	</div>
//	$(settings.scope).on("click", settings.buttonCollection, function(event){
//		event.preventDefault();
//	});
	
	// execute callback if user clicks "done" or "go" on virtual keyboard
	$(settings.scope).off("keypress", "input");
	$(settings.scope).on("keypress", "input", function(event){
		if (event.which == 13) // keycode for "done" button on keyboard
		{
			// execute callback if one was provided
			if (settings.callback != "")
			{
				// Need setTimeout bc alert box messes up the touchevent lifecycle - see notes above				
//				setTimeout(function() {
					// this vs $(this):
					// this = DOM element
					// $(this) = DOM element wrapped in a jquery object
					// alert($(this) + " : " + this + " : " + $(this).get(0))
					// alert(this == $(this).get(0));
					
					// .call() is a javascript function that invokes the callback represented by 
					// settings.callback() while passing the jquery object, "$(this)", that will set
					// the value of "this" in the callback.
					settings.callback.call($(this));
					// alternatively, if the callback contains argument in the anonymous 
					// function - i.e. function(argumentRepresenting$This){} used to 
					// represent "$(this)", it's possible to use the following instead (without the call method):
					// settings.callback($(this));					
//				}, 0);
			}			
			event.stopPropagation();
			event.preventDefault();
		}
	});

	// Use touchstart event to check if the user is "pressing" a button (vs. scrolling):
	// 1. Touchstart event binds touchmove and touchend events when user touches a screen.
	// 2. If the user moves (i.e. scrolls), touchstart unbinds the touchend event.
	// 3. If the user releases contact from the screen without moving, the bound touchend event will be triggered.
	// Note: touchstart event doesn't trigger preventDefault() by itself as this would prevent the user from being
	// able to scroll
	$(settings.scope).on("touchstart", settings.buttonCollection, function(event){
		var button = $(this);
		
		// bind touchmove event
		button.on("touchmove", function(){
			button.off("touchend");
		});

		// Bind touchstart functions to sort options to show .active state as well as check appropriate radio button.
		button.on("touchend", function(event){
		
			if (settings.mode == "flash")
			{
				button.addClass("active"); // puts button in .active state
				setTimeout(function () { // setTimeout function creates a slight delay, causing button to flash
					button.toggleClass("active"); // removes .active state
				}, 50);
			}
			else if (settings.mode == "toggle_radio")
			{
				$(settings.scope + " " + settings.buttonCollection).not(button).removeClass("active"); // only one sort button can be active at a time
				// setTimeout provides a small delay before putting the button in .active state.
				// Without the delay, button will not reach .active state, probably because the previous function 
				// to remove .active state from non-relevant buttons takes too long and javascript is asynchronous.
				setTimeout(function () { 
					// toggles .active state and if radio buttons exist, select a button
					button.addClass("active").find("input:radio").prop("checked", true); 
				}, 0);
			}
			else if (settings.mode == "toggle_one")
			{
// Error: clicking a menu button the second time untoggle the active state			
//alert("uh oh: " + button);
				$(settings.scope + " " + settings.buttonCollection).not(button).removeClass("active"); // only one sort button can be active at a time
				// setTimeout provides a small delay before putting the button in .active state.
				// Without the delay, button will not reach .active state, probably because the previous function 
				// to remove .active state from non-relevant buttons takes too long and javascript is asynchronous.
				setTimeout(function () { 
					button.toggleClass("active"); // toggles .active state
				}, 0);
			}
			else if (settings.mode == "toggle_checkbox")
			{
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
			}
			
			button.off("touchend");

			// execute callback if one was provided
			if (settings.callback != "")
			{
				// Need setTimeout bc alert box messes up the touchevent lifecycle - see notes above				
				//setTimeout(function() {
					// .call() is a javascript function that invokes the callback represented by 
					// settings.callback() while passing the jquery object, "button", that will set
					// the value of "this" in the callback.
					settings.callback.call(button); // .call() passes the value of "button" (a jqObj) to the callback function stored by "settings.callback"
					// alternatively, if the callback contains argument in the anonymous 
					// function - i.e. function(argumentRepresenting$This){} used to 
					// represent "button", it's possible to use the following instead (without the call method):
					// settings.callback(button);
				//}, 0);
			}
			
			if (settings.stopPropagation == true)
			{
				event.stopPropagation();
			}			
			event.preventDefault();
		});
		// touchstart doesn't trigger preventDefault() by itself as this would prevent the user from scrolling
	});
}


/* *****
Function: preLoadContent - prepares ajax request prior to calling loadContent() by:
	1) getting form action or url href
	2) getting/serializing data from form or url
	3) if necessary, getting geolocation info prior to making ajax request

Called by: 
	1) filter_sort_menu.html.erb
	2) log_in.html.erb
	3) sign_up.html.erb
	
Platform: mobile only
*/
function preLoadContent(jqObj, options){
	var form = jqObj.parents("form"); // grab the form tag
	var requestMethod = form.attr("method") || "get"; // Grabs the method attribute specified within the form.  If form does not exist, then the request must be GET since 1) only a form can specify POST method and 2) GET methods can be specified within forms or by urls
	var serializedData = form.serialize() || "";
	var url = form.attr("action") || jqObj.attr("href"); // get the action attribute from the relevant form, if one exists; otherwise, get the url of the button 

// 	Need setTimeout bc alert box messes up the touchevent lifecycle - see notes above					
//	setTimeout(function () {
//		alert(url);
//	}, 0);	

	var settings = $.extend({
		// These are the defaults.
		fadeInContent: true
	}, options );

	sort_order = getURLParameters(url, 'sort_order');

	if (sort_order == 'distance')
	{			
		getGeolocation(function(){
			loadContent(url,{
				serializedData: serializedData,
				requestMethod: requestMethod,
				fadeInContent: settings.fadeInContent
			});
		});
	}
	else
	{
		loadContent(url,{
			serializedData: serializedData,
			requestMethod: requestMethod,
			fadeInContent: settings.fadeInContent
		});
	}
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
function loadContent(url, options){
	var settings = $.extend({
		// These are the defaults.
		pane: "mainPane", // mainPane, rightPane, or slider - used to determine where new content should be loaded
		serializedData: "", // 
		requestMethod: "get", // get or post or delete (delete is used in conjunction with destroy action in controller)
		fadeInContent: true		
	}, options );

	var latitude = checkSessionStorage('latitude'), 
		longitude = checkSessionStorage('longitude');
		
	// add latitude and longitude information if it exists to the serialized data
	if (latitude != 'undefined' &&  longitude!= 'undefined')
	{
		var userLocation = {latitude: latitude, longitude: longitude};
		settings.serializedData = settings.serializedData + '&' + $.param( userLocation ); // $.param creates a serialized representation of the userLocation object		
	}
	
//	var screenHeight = $(window).outerHeight(); // get the height of the screen, including padding and borders
//	$("#" + settings.pane).find(".preloader").css("height", screenHeight).show();
		
	$("#logo").focus(); // hides keyboard on iOS
	
	$("#" + settings.pane).find(".preloader").show();

	// use AJAX to retrieve dynamic content, passing the url and serialized (and redundant-free) parameters
	var request = 	$.ajax({
						type: settings.requestMethod,
						url: url,
						data: settings.serializedData,
						dataType: "script"
					});
	
	request.done(function(){
//		$('.dotdotdot').dotdotdot({
//			watch: true, //	Whether to update the ellipsis as the window resizes: true/'window'
//			callback	: function( isTruncated, orgContent ) {	
//				alert($(this).attr("class"));
//			}//	Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string).
//		});

		// fadeInContent may need to be "manually" called after additional code is executed prior to 
		// showing content (i.e. when user submits form data to "update" or "create" action in the controller,
		// sometimes that information may have validation errors that the user needs to correct before the
		// corresponding record can be created or updated.  Thus, the user may be returned to the "edit" or 
		// "new" view page again which is when additional code (toggling mainPane, rightPane, and/or the 
		// slider) needs to be executed prior to calling function fadeInContent().  This additional code will
		// be in the corresponding js.erb file
		if (settings.fadeInContent == true)
		{
			fadeInContent();  // ensures thumbnails are fully loaded before preloader.gif fades out
		}		
	});
	
	request.fail(function(){
//		alert("error!");
	});
	
}

/*

Called by: 
	1) altoids.js
	2) destroy.js.erb
*/
function fadeInContent(){


	var	loadedImageCount = 0;

	if ($("#myCarousel").length)
	{
		var selector = $("div.item.active");
	}
	else
	{
		var selector = $(".thumbnail");

		// return scrollbar to top prior to fading in loaded content
		$('body').animate({
				scrollTop: 0
			}, 0,
			function(){
			}
		);
	}
	var imageCount = selector.length;
	var stopwatch = 0;
	var refreshId = setInterval(function() { // this code is executed every 500 milliseconds:
						loadedImageCount = 0;
						
						selector.each(
							function(){

								 if (parseInt($(this).find("img").css("height"), 10) >= 100)
								 {
									loadedImageCount = loadedImageCount + 1
								 }
							}
						);

						if (loadedImageCount >= imageCount)
						{
							clearInterval(refreshId); // ends setInterval()
							$("div.preloader").fadeOut(400);
						}
						else
						{
							stopwatch = stopwatch + 200;
							if (stopwatch >= 20000) // 10 seconds
							{
								alert("Please check your connection and reload browser");
								clearInterval(refreshId); // ends setInterval()
							}
						}						
					}, 200);

}


/* *****
Function name: initTearsheetOptions

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
function initTearsheetOptions(button_obj){

	var buttonName = button_obj.data("button"); // map, hours, features, website, or call - passed in via a custom data attribute associated with the pressed button
	var selector = $("#" + buttonName);

	$('#map-features-hours .collapse').not('#' + buttonName).slideUp(400) // close content that is not selected by the user
	
	if (buttonName == 'website' || buttonName == 'get_directions')  // open the link in a new browser window
	{
		var website = selector.attr('href'); // get the url of the venue website
		// using a setTimeout so user can see the website button flicker
		setTimeout(function () { 
			window.open(website);  // opens a new browser window
		}, 400);

	}
	else if (buttonName == 'phone')
	{
		var phone_number = selector.attr('href'); // get the hyperlink which contains the phone number
		// using a setTimeout so user can see the website button flicker
		setTimeout(function () { 
			window.location = phone_number; // dials the phone number listed in the link within the same window
		}, 400);	
	}		
	else // for map, hours, or features toggled content
	{			
		selector.slideToggle(400, function(){ // toggle selected content
		
			// Scrolls screen to appropriate position to view content (i.e. map, hours, features)
			// Note: browser quirks when using the scrollTop function:
			// 1.  Chrome/Safari - scrolltop works on $("body") but not $("html, body")
			// 2.  FF/IE - scrolltop works on $("html, body") but not $("body")
			// http://stackoverflow.com/questions/1830080/jquery-scrolltop-doesnt-seem-to-work-in-safari-or-chrome-windows

			var content = $(this),
				selectorHeight = content.height(), // height of #map, #features, or #hours html element
				selectorTopPosition = content.position().top, // top position of #map, #features, or #hours html element
				screenHeight = $(window).outerHeight(), // height of the device/browser screen
				navbarHeight = $("#navbar").outerHeight(), // height of the navbar
				scrollUpPixels = selectorTopPosition + selectorHeight - screenHeight + navbarHeight;

				
			// position can't be "fixed" in order for .animate({scrolltop: 0}) below to function.
			// position is reset to "fixed" once the user clicks on the backbutton on the rightPane to return to mainPane
			$("#rightPane").css("position", "relative").css("top", "0").promise().done(function(){

				$("body").animate({
					scrollTop: scrollUpPixels + 'px'
					}, 400, // can't use 0 because it will cause #mainPane to scroll for a second before executing animate, creating a "flicker" right before the menu slides open.
					function(){
					}
				);			
				
			});
			
	
		});// opens a hidden container with the toggled content
	}
}


/*
Function: togglePane({pane, state, callback})

Purpose:
	1.  Supports two sliding panes, "Menu Bar" and "Right Pane", by moving "fixed" elements (i.e. main content and the 
		navbar) to left or right, revealing the #menu or #rightPane elements underneath the #mainPane  and #navbar elements
		as well as corresponding navigation bar elements, #navbar-menu or #navbar-rightPane.
	2.  Once the pane is open, this function "locks" the main content by changing the position to "fixed".  This way, 
		the main content is not scrollable on touch screens while user scrolls on the open menu.

Notes: 
	1.  .active state of menu button is controlled in 1) bindTouchButtons, and 2) toggleSlider (ensures that the menu 
		button is not in active state whenever the slider is toggled)
	2.  There is a conflict with #navbar due to the function, initFilterSortContainer().  initFilterSortContainer() is
		a desktop function but during development/testing, sometimes all functions are called.  This conflict causes 
		the navbar to move to the left of the screen when opening the menu from a mobile device (after scrolling on the 
		menu). Specifically, one of the scroll event in initFilterSortContainer(), sets the "left" position of #navbar 
		to 0.  Once the mobile and desktop functions are separated, this conflict shouldn't come up.

Platform: mobile only
*/
function togglePane(options){
	var mainPane = $('#mainPane'),
		navbar = $('#navbar')
		slideContent = $("#mainPane, #navbar, #mainPane div.navbar-fixed-bottom"), // the elements that need to "slide"
		screenWidth = mainPane.outerWidth(), // get width of the #mainPane
		navbarHeight = $('#navbar').outerHeight() // get height of navbar

	var settings = $.extend({
		// These are the defaults.
		pane: "rightPane", // specifies "rightPane" or "menu"
		title: "", // include a title for the pane (i.e. venue name)
		state: "", // manually force the pane open or closed - defaulted to toggle
		callback: ""
	}, options );
	
	var pane_selector = $("#"+settings.pane); // either "menu" or "rightPane"
	var navbar_selector = $("#navbar-"+settings.pane); // either "menu" or "rightPane"

	// pixelsScrolled and mainPaneTopPosition are used to take the user back to where they had scrolled in the mainPane prior to toggling the menu or rightPane
//	var pixelsScrolled = $("body").scrollTop(); // stores the number of pixels that the user has scrolled from the top in #mainPane prior to opening menu
//	var mainPaneTopPosition = mainPane.position().top; // gets the vertical position of mainPane - this variable is used to "reset" the scrolling position of mainPane, when closing the menu or rightPane.

	// toggle rightPane or menu?
	if (settings.pane == 'menu') // if menu
	{
		// need width of menuButton and margin between menuButton and left edge of navbar in order to calculate the 
		// distance that the menu bar should slide while maintaining an exposed menu button.
		// subtracted an extra -1px in animateLeft and animateRight to remove gaps
		var menuButton = $('#menu_button'),
			menuButtonWidth = menuButton.outerWidth(), // width of menu button including border and padding
			margin = menuButton.offset().left, // margin between left edge of navbar and menu button.
			animateLeft = screenWidth - menuButtonWidth - (2 * margin) -1, // position (in pixels) that the float left elements (i.e. menu button) should slide to the left
			animateRight = -screenWidth + menuButtonWidth + (2 * margin) -1; // position (in pixels) that the float right elements (i.e. logo) should slide to the left
	}
	else // else rightPane
	{
		var animateLeft = -screenWidth, // animateLeft sets the left property of the elements (i.e. menu button) of slideContent.  Defaulted for the rightPane (if menu is selected, animateLeft is redefined below).
			animateRight = screenWidth; // animateRight sets the right property of the elements (i.e. logo) of slideContent.  Defaulted for the rightPane (if menu is selected, animateRight is redefined below).	
	}
	
	// open or close:
	// open if 1) user manually specified "open" OR if 2) "state" is not passed in to the function and the menu is closed
	if (settings.state == "open" || settings.state == "" && parseInt(mainPane.css('left'),10) == 0)
	{		
		// show temporary border to delineate navbar in mainPane vs navbar in menu; otherwise, panes look like they blend together
		navbar.css("border-left", "1px solid #2d2d2d"); // SASS variable, $color-dark = #2d2d2d 

		// set pane title and unhide collapsed pane items (navbar and pane)
		if (settings.title != "")
		{
			navbar_selector.find(".dynamicTitle").text(settings.title); // insert name of the venue for the title of the rightPane
		}
		
		// need to display either menu or rightPane but not both at the same time; otherwise, they may overlap each other
		$("#navbar-menu, #navbar-rightPane").hide(); // ensures navbar for menu/rightPane are hidden prior to opening the selected pane
		$("#menu, #rightPane").hide(); // ensures all panes are hidden prior to opening the selected pane
		navbar_selector.show(); // navbar for menu/rightPane starts off as display: none
		pane_selector.show(); // menu/rightPane starts off as display: none;

		// Change css of mainPane in order to "fix" its position so it doesn't move around when user scrolls on the open menu
//		mainPane.css('position', 'fixed') // Need to use "fixed" position in order to prevent user from scrolling #mainPane when menu is open.
//				.css('top', navbarHeight - pixelsScrolled); // Adjust height of #mainPane to account for the number of pixels that have been scrolled

		// need to use absolute position of contents within the .preloader so that those elements (preloader icon and "loading...") will also slide left or right with the rest of the mainPane
//		var preloaderContent = mainPane.find(".preloader").find(".absolute-center"); // selects for the contents within .preloader in mainPane or rightPane
//		var screenHeight = $(window).height(); // height of the viewport
//		var navbarHeight = $("#navbar").outerHeight(); // height of the navbar
		
//		preloaderContent.css("position", "absolute") // change position from fixed to absolute in order to allow for sliding with rest of the pane elements.
//						.css("top",  .5*screenHeight - navbarHeight); // adjust top for absolute positioning to match position: absolute, top: 50%

		// return user to scroll position prior to opening menu (i.e. top of menu pane)
//		$('body').animate({
//			scrollTop: 0 + 'px'
//			}, 1, // can't use 0 because it will cause #mainPane to scroll for a second before executing animate, creating a "flicker" right before the menu slides open.
//			function(){}
//		);
		
		// open pane
		slideContent.animate({
			left: animateLeft, // for float left elements (i.e. menu button)
			right: animateRight // for float right elements (i.e. logo)		
		}, 400).promise().done(function(){ // callback is executed only when animation is complete; putting the .callback in success handler for .animation() method will results in callback being called multiple times, once for each selector in $(slideContent)

			// execute callback if one was provided
			if (settings.callback != "")
			{
				// .call() is a javascript function that invokes the callback represented by 
				// settings.callback() while passing the jquery object, "$(this)", that will set
				// the value of "this" in the callback.
				settings.callback.call($(this));
				// alternatively, if the callback contains argument in the anonymous 
				// function - i.e. function(argumentRepresenting$This){} used to 
				// represent "$(this)", it's possible to use the following instead (without the call method):
				// settings.callback($(this));					
			}
		});
	}
	else // Otherwise, close pane
	{
		// ensures that menu button is not active if it is being closed
		if (settings.pane == "menu")
		{
			setTimeout(function () { 
				$("#menu_button").removeClass("active");
			}, 0);
		}

		// hide temporary border; otherwise, it will be noticable when menu is closed
		navbar.css("border-left", "0"); // navbar left-border should be hidden when menu is closed
		
//		$("#menu").css("-webkit-overflow-scrolling", "none");
				
		// slide menu to the left
		// NOTE: .promise() may not be executed if selectors in "slideContent" are dynamically removed
		// such as when the filter button may be removed while executing function preloadContent() or 
		// function loadContent()
		slideContent.animate({
			left: 0, // for float left elements (i.e. menu button)
			right: 0 // for float right elements (i.e. logo)
		}, 400).promise().done(function(){ // see NOTE above - callback is executed only when animation is complete; putting the .callback in success handler for .animation() method will results in callback being called multiple times, once for each selector in $(slideContent)
		
//			$("#navbar-menu, #navbar-rightPane").hide(); // ensures navbar for menu/rightPane are hidden prior to opening the selected pane
//			$("#menu, #rightPane").hide(); // ensures all panes are hidden prior to opening the selected pane

			// return mainPane to css state prior to opening menu
//			mainPane.css('position', 'absolute') // Undo fixed position after menu is closed to #mainPane is scrollable again.
//					.css('top', navbarHeight); // Undo fixed position after menu is closed to #mainPane is scrollable again.					
					
//			navbar_selector.hide(); // menu/rightPane starts off as display: none;			
//			pane_selector.hide(); // hide menu/rightPane when pane is closing so it doesn't overflow
			
			// need to revert back to fixed position of contents within the .preloader so that those elements (preloader icon and "loading...") won't move around if user scrolls up or down.
//			mainPane.find(".preloader").find(".absolute-center") // selects for the contents within .preloader in mainPane or rightPane.
//					.css("position", "fixed") // return position from absolute to fixed.
//					.css("top", "50%"); // return top to 50%

			// return user to scroll position of mainPane after closing menu or rightPane
//			$('body').animate({
//				scrollTop: navbarHeight - mainPaneTopPosition  + 'px'
//				}, 0,
//				function(){
//				}
//			);
					
			// execute callback if one was provided
			if (settings.callback != "")
			{
				// .call() is a javascript function that invokes the callback represented by 
				// settings.callback() while passing the jquery object, "$(this)", that will set
				// the value of "this" in the callback.
				settings.callback.call($(this));
				// alternatively, if the callback contains argument in the anonymous 
				// function - i.e. function(argumentRepresenting$This){} used to 
				// represent "$(this)", it's possible to use the following instead (without the call method):
				// settings.callback($(this));					
			}
		});	// animation().promise().done();
	}  // close pane
} // function togglePane()


/*
Function: toggleSlider()

Supports the slider pane by
	1.  Placing the closed slider at the bottom of the screen or placing the open slider at the top of the screen
	2.  Opening the slider or closing the slider
	3.  Showing/hiding the appropriate content (slider title, slider body)

Platform: mobile only
*/
function toggleSlider(options){
	var slider = $('#slider');
	var sliderNavbar = slider.find(".navbar-pane");
	var sliderBody = slider.find(".body");
	var mainPane = $('#mainPane');
	var rightPane = $('#rightPane');
	var rightPaneNavbarHeight = $("#navbar-rightPane").outerHeight();
	var bottomButton = slider.find(".navbar-fixed-bottom");
	var sliderScrollableContent = slider.find(".scrollable");
	
	var settings = $.extend({
		// These are the defaults.
		title: "", // include a title for the pane (i.e. venue name)
		state: "", // manually force the slider open or closed - defaulted to toggle
		sliderChild: "#filter_sort_menu", // slider-child element of #slider to present (see views_mobile/layouts/_slider.html.erb)
			//	slider-child options:
			// 		1. #filter_sort_menu
			//		2. #slider-content (dynamically inserted content)
			//		3. #log_in_form
			//		4. #sign_up_form
		callback: ""
	}, options );

	$("#logo").focus(); // hides keyboard on iOS
			
	// 	Need to know the bottom of the browser window for 2 reasons:
	//	1. Open slider: This is where the vertical slide "first appears" before sliding up to top of browser window
	// 	2. Close slider: this the destination point to where the vertical slider will disappear as it slides down from top of browser window
	var screenHeight = $(window).outerHeight(); // get the height of the screen, including padding and borders

	// number of pixels the user has scrolled from the top
	// use pixelsFromTop to determine where the slider should:
	// 1) stop as it slides up, and 
	// 2) be fixed at the end of the .animate() function
//	var pixelsFromTop = $(window).scrollTop();

	// set title within navbar of slider
	if (settings.title != "")
	{
		$('#slider').find(".dynamicTitle").text(settings.title);
	}

	if (settings.state == "open" || (settings.state == "" && slider.css('display') == 'none')) // if slider is closed, then open
	{			
		// slide needs to open with the scrollbar at the top.  To set scrollbar to the top without disturbing
		// the contents of rightPane, need to change position of rightPane "static" to "fixed" prior to 
		// setting the scrollbar to the top
//		rightPane.css("position", "fixed").css("top", -pixelsFromTop + rightPaneNavbarHeight); // freeze rightPane so it doesn't move as slider opens
//		$("html, body").animate({ scrollTop: 0 }, 0); // move scrollbar to top

		// Except for .preloader and .status_message, hide all elements within #slider-body; appropriate forms
		$("#slider").find("div.body").children().not(".preloader").hide();
			
		// Show dynamic content inserted in #slider-content
		$(settings.sliderChild).show(); // show the relevant page: 1)dynamic content (#slider-content), 2) #sign_up_form, 3) #log_in_form, or 4) #filter_sort_menu

		// slider opens from bottom to top
		slider.css('top', screenHeight); // sets the top of the slider to the bottom of the screen prior to opening

		// slider starts off as display: none; thus, need to .show() before calling .animate()
		slider.show().animate({
			'top': 0 + 'px' // slides the vertical slider to top or bottom of screen.
			}, 2000).promise().done(function(){ // callback is executed only when animation is complete; putting the .callback in success handler for .animation() method will results in callback being called multiple times, once for each selector in $(sliderContent)
				// hide non-slider content; otherwise, if user scrolls down far enough, content from the other panes may be visible
//				mainPane.hide();
//				rightPane.hide();

				bottomButton.fadeIn(200); // show "apply filters" button - executes after slider is open for a smoother UI

				// need to "fix" the slider navbar to top so it will remain visible as user scrolls in the slider
				sliderNavbar.css("position", "fixed").css("top", 0); // transition from relative to fixed positioning
				var sliderNavbarHeight = sliderNavbar.outerHeight();
				sliderBody.css('top', sliderNavbarHeight); // move .body within #slider down by the height of the .header; otherwise, body of the slider will run underneath the bar
				
				// execute callback if one was provided
				if (settings.callback != "")
				{
					// .call() is a javascript function that invokes the callback represented by 
					// settings.callback() while passing the jquery object, "$(this)", that will set
					// the value of "this" in the callback.
					settings.callback.call($(this));
					// alternatively, if the callback contains argument in the anonymous 
					// function - i.e. function(argumentRepresenting$This){} used to 
					// represent "$(this)", it's possible to use the following instead (without the call method):
					// settings.callback($(this));					
				}
			}
		); // .animate() - open slider
	} // if {open slider }
	else // if slider is open, then close
	{
		slider.find("div.navbar-fixed-bottom").hide(); // hide "apply filters" button - executes before slider starts to close for a smoother UI
		mainPane.show(); // show content underneath slider before slider opens
		rightPane.show(); // show content underneath slider before slider opens
		bottomButton.fadeOut(200); // hide "apply filters" button prior to slider closing
		
		// move scrollbar of rightPane to where the user left off prior to opening slider:
		// 1.  get vertical position or rightPane
		// 2.  make rightPane scrollable by removing "fixed" position
		// 3.  move scrollbar to appropriate position
		
		// #1 - gets the vertical position of rightPane and height of slider navbar
		// NOTE: needs to be grabbed before position reverts to "static"
		var rightPaneTopPosition = $("#rightPane").position().top;
		var sliderNavbarHeight = sliderNavbar.outerHeight();
		
		// #2 - remove "fixed" position
//		rightPane.css("position", "static"); // return rightpane to default positioning (i.e. undo "fixed" position)
		
		// #3 - move scrollbar to original position before user opened slider
		// "body" element is used in place of "#rightPane" because rightPane is not a scrollable element
		$("body").animate({
			scrollTop: -(rightPaneTopPosition - sliderNavbarHeight) + 'px'
			}, 0,
			function(){
			}
		);
		
		$("#slider, #sliderNavBar").animate({
			'top': screenHeight + 'px' // slides the vertical slider to top or bottom of screen.
		}, 2000).promise().done(function(){
			// reset the slider, slider nav bar, and slider body to original css prior to opening (i.e. prepares
			// the slider for when user opens it again)
			sliderNavbar.css("position", "static"); // transition from relative to fixed positioning
			sliderBody.css('top', 0); // move .body within #slider down by the height of the .header; otherwise, body of the slider will run underneath the bar
			sliderScrollableContent.scrollTop(0); // move scrollbar for all .scrollable elements within #slider to the top
			slider.css('top', 0) // return slider to default top: 0 (i.e. undo top: screenHeight)
				  .hide(); // hide slider
				  
			// execute callback if one was provided
			if (settings.callback != "")
			{
				// .call() is a javascript function that invokes the callback represented by 
				// settings.callback() while passing the jquery object, "$(this)", that will set
				// the value of "this" in the callback.
				settings.callback.call($(this));
				// alternatively, if the callback contains argument in the anonymous 
				// function - i.e. function(argumentRepresenting$This){} used to 
				// represent "$(this)", it's possible to use the following instead (without the call method):
				// settings.callback($(this));					
			}
		});
	} // else {close slider}
}

				
/* *****
Function name: toggleEventDescriptions

Purpose: Allow user to toggle between full and partial event descriptions

Notes: Initially, the event descriptions will be truncated by the function truncate_text(), triggered by the .dotdotdot class.  
Using a callback with dotdotdot, this function toggles between original and truncated content.  Using the callback allows for 
a smoother transition between original and truncated context (i.e. to prevent content from "jumping").

Called by: 
	1) views_mobile/sessions/events_list.js.erb
	2) views_mobile/sessions/tearsheet.js.erb
	
Platform: mobile
*/
function toggleEventDescription(button_obj){
	// enables the event buttons (i.e. event date, name, description) to toggle between the partial and full description (as well as start vs start/end times) of an event
	var calendar_time = button_obj.find(".time");
	var start_stop_time = button_obj.find('.time.collapse');
	var description = button_obj.find(".description.dotdotdot");	
	var description_container = button_obj.find(".btn-description");
	
	description.fadeOut(200);
	
	if (start_stop_time.css('display') == 'none') // event container is "closed" - (1) only truncated event description is displayed and (2) event start and stop times are hidden
	{
		description.addClass("active");  // adding .active class will add padding-top to .description so to push it under .btn-date element
		description_container.addClass("active"); // adding .active class will adjust height of container to "auto" in order to allow .dotdotdot to show full description
		calendar_time.fadeOut(200); // fade out start time under the date icon
		start_stop_time.fadeIn(200); // fade in start and stop time under event name/above description
			
		description.dotdotdot({
			watch: true, //	Whether to update the ellipsis as the window resizes: true/'window'
			callback	: function( isTruncated, orgContent ) {	
//				alert("truncation: " + isTruncated);
//				alert("content" + orgContent.text());
				description.empty().append( orgContent ); // append original content after deleting truncated text
				description.fadeIn(200); // fades in the event description after dotdotdot has resized everything... smoother transition when using fadeIn as a callback.					
	
				//  scroll browser up if description is hidden (because too long for screen)
				var descriptionHeight = description_container.height(), // height of description
					descriptionTopPosition = description_container.offset().top, // top position of #map, #features, or #hours html element
					screenHeight = $(window).outerHeight(), // height of the device/browser screen
					navbarHeight = $("#navbar").outerHeight(), // height of the navbar
					scrollUpPixels = descriptionTopPosition + descriptionHeight - screenHeight + navbarHeight;

				$("body").animate({
					scrollTop: scrollUpPixels + 'px'
					}, 400, // can't use 0 because it will cause #mainPane to scroll for a second before executing animate, creating a "flicker" right before the menu slides open.
					function(){}
				);
				
			}//	Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string).
		});
	}	
	else
	{
		description.removeClass("active"); // removing .active class will adjust padding (to zero) for description so it fits to the right of the floated button-date element
		description_container.removeClass("active"); // removing .active class will adjust height of container for .dotdotdot to truncate
		calendar_time.fadeIn(200); // fade out start time under the date icon
		start_stop_time.fadeOut(200); // fade in start and stop time under event name/above description
					
		description.dotdotdot({
//			alert("truncation: " + isTruncated);
//			alert("content" + orgContent.text());				
			watch: true, //	Whether to update the ellipsis as the window resizes: true/'window'
			callback	: function( isTruncated, orgContent ) {	
				description.fadeIn(200); // fades in the event description after dotdotdot has resized everything... smoother transition when using fadeIn as a callback.					
			}//	Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string).
		});
	}	
}

/* *****
Function name: initCarousel

Purpose: 	1.	Removes .active class to all .item elements in the carousel except for the first.  Need to start the 
				carousel with all .item elements being in the .active state in order to allow .dotdotdot to complete 
				execution first.  Once .dotdotdot is complete, then remove .active state from all .item elements in 
				order for carousel to function properly.
			2.  Unhides carousel - Carousel starts off with display: none (class="collapse") to allow for code to 
				first remove .active class from all .item elements of the carousel after the first.  Otherwise, mobile
				user will see all .item elements "flicker" before the code above has a chance to complete.
			3.  Starts cycling through the items in the carousel by defining interval

Called by: 
	1) altoids.js
	2) views_mobile/sessions/tearsheet.js.erb
	2) views_mobile/sessions/destroy.js.erb
	
Platform: mobile and desktop
*/
function initCarousel(){
	
	var prepCarousel = function(){
		var deferredObj = $.Deferred();
		
		// Removes .active class to all items in carousel except the first - allows dotdotdot to complete execution first
		$("#myCarousel").find(".active.item").each(function( index ) {
			if(index != 0){
				$(this).removeClass('active');
			}
		}).promise().then(function(){
			 deferredObj.resolve();
		});
		
		return deferredObj.promise()
	}

	var showCarousel = function(){
		var deferredObj = $.Deferred();
		
		// Removes .active class to all items in carousel except the first - allows dotdotdot to complete execution first
		// Unhide carousel after .active class has been removed from all .item elements except for the first; otherwise, 
		// may see flicker on mobile device from multiple .item elements with the .active class.
		$("#myCarousel").removeClass('collapse').promise().then(function(){
			 deferredObj.resolve();
		});
		
		return deferredObj.promise()
	}
	
	var startCarousel = function(){
		var deferredObj = $.Deferred();
		
		// Bootstrap plugin that controls the interval for advancing the carousel - http://getbootstrap.com/javascript/#carousel
		$('#myCarousel').carousel({
			interval: 4000
		}).promise().then(function(){
			deferredObj.resolve()
		});
		
		return deferredObj.promise()
	}
	
	prepCarousel().then(showCarousel).then(startCarousel);
}


/* *****
Function name: initTouchOnCarousel

Purpose: 	Binds touch events on the carousel so user can swipe instead of use carousel controls (the arrows)
			to scroll through the carousel.

Notes: 	alert boxes interfere with touch event cycle; causes the browser to remember the touch end event (button is always behind by one event - notice this when checkout the custom data attribute in the alert box)
		http://stackoverflow.com/questions/7463594/how-do-i-prevent-touchend-event-from-apparently-being-remembered-by-the-browse
		Be sure to use setTimeout as seen in code below

Called by: 
	1) views_mobile/sessions/_tearsheet.js.erb
	
Platform: mobile
*/
function initTouchOnCarousel(){	

	// 	reset event handlers
	$(document).off("touchstart", "#myCarousel");
	$("#myCarousel").off("touchstart", ".play_button");
	
	// 	bind the play button in videos to control:
	// 	1) carousel cycling, and 
	//	2) playing and resuming partially watched videos
	//  alternative is to bind listeners that react to state of video (see below)
	$("#myCarousel").on("touchstart", ".play_button", function(event){
		$('#myCarousel').carousel("pause");
		var video = $(this).siblings("video");
		
		// video html element starts off hidden which prevents it from being loaded on iOS;
		// thus, the user won't be able to play the video from pressing the video element.
		// This enables the .play_button element to trigger the event handler to play the video instead.
		// Following methods for preventing video from loading on iOS:
		// 1. display: none
		// 2. visibility: hidden - using this technique will cause video to track off the screen as it closes before disappearing - not good
		// 3. width: 0, height: 0
		// Using display: none so that video will vanish to a single point behind the center of the .play_button as it closes.
		video.css("display", "block") // When user triggers the event handler, need to first load video on iOS by setting display: block.
			 .get(0).play(); // play video

		// iOS enters fullscreen when user is watching video
		video.on("webkitendfullscreen", function(){

		// when user has exited fullscreen, need to hide the video html element so it can't be triggered by the user
		// hitting the video html element (enables the use of the .play_button in order to play the video)
			video.css("display", "none"); // hide video html element
			$("#myCarousel").carousel("cycle"); // restart carousel cycle
			$(this).get(0).pause(); // pauses the video
		});

		event.stopPropagation(); // needed because of .play_button and #myCarousel are overlapping html elements
	});
	
	// 	bind listeners that react to state of video:
//$("#myCarousel").find("video").each(function(){
//	var video = $(this);
//	video.off("webkitbeginfullscreen")
//	video.off("webkitendfullscreen")
//
//	// iOS enters fullscreen when user is watching video
//	video.on("webkitbeginfullscreen", function(){
//		$("#myCarousel").carousel("pause"); // pause carousel cycle
//		video.get(0).play(); // restarts a video from where the user left off		
//	});
//	
//	// iOS exits fullscreen when user is watching video
//	video.on("webkitendfullscreen", function(){
//		$("#myCarousel").carousel("cycle"); // restart carousel cycle
//		video.get(0).pause(); // pauses the video
//	});
//
////	video.on("play", function(){
////		$("#myCarousel").carousel("pause"); // pause carousel cycle
////	});
//	
////	video.on("ended", function(){
////		$("#myCarousel").carousel("cycle"); // restart carousel cycle
////	});
//});

	// binds touch events to distinguish between a tap (touchstart) vs. swipe (touchmove)
	$(document).on('touchstart', "#myCarousel", function(event){
		var button = $(this);
		var firstTouchX = event.originalEvent.touches[0].clientX;
					
		// Need setTimeout bc alert box messes up the touchevent lifecycle - see notes above
//		setTimeout(function(){
//			alert(firstTouchX);
//		}, 1);

		// bind touchmove event
		button.on("touchend", function(){
			button.off("touchend");
		});

		// Bind touchstart functions to sort options to show .active state as well as check appropriate radio button.
		button.on("touchmove", function(event){
			var nextTouchX = event.originalEvent.touches[0].clientX;
 			
			// Need setTimeout bc alert box messes up the touchevent lifecycle - see notes above
//			setTimeout(function(){
//				alert(firstTouchX + " : " + nextTouchX);			
//			}, 1);
			
			if (firstTouchX > nextTouchX) // user is swiping left
			{
				// scroll carousel to the left
				$('#myCarousel').carousel('next');
			}
			else // user is swiping right
			{
				// scroll carousel to the right
				$('#myCarousel').carousel('prev');
			}
		
			button.off("touchmove");	
		});
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
		var selected_image = $(this).siblings('.thumbnail').children('img');
		var selected_video = $(this).siblings('video');
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
