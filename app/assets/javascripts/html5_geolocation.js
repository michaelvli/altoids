/* *****
html5_geolocation - uses HTML5 geolocation to obtain the user's latitude and longitude via Revealing Module structure.

Problem: Firefox doesn't support HTML5 geolocation timeout attribute when user doesn't respond to geolocation permissions prompt :
- If user selects "Not this time" to prompt or closes it, no error method for getCurrentPosition method is not called in Firefox - nothing happens
- Ideally, we should use the timeout attribute in the options variable but it doesn't work in Firefox (it does, however, work in Chrome)

Solution:
- Created a timer that checks for a response.  If no response is received:
  1.  set localStorage('geolocationAuth') = 'undefined' (by removing it from local storage)
  2.  reset "Requires location sharing" popover message (when user clicks on the 'distance' sort button)
*/

var html5_geolocation = function () {
    var lat;
    var lon;
	var location_timeout;
	
    initiate = function(callback, callback_no_geolocation) {
		var options = {
		  enableHighAccuracy: true,
		  timeout: 3000, //doesn't work in Firefox
		  maximumAge: 0  // never stored in cache (by setting to 0)
		};

		if (navigator.geolocation)
		{
			location_timeout = setTimeout(handleTimeout, options.timeout); // timer is cleared getLocation or handleErrors functions
			navigator.geolocation.getCurrentPosition(
				// Geolocation success
				function(position){
					clearTimeout(location_timeout);
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					localStorage['geolocationAuth'] = true; // so user doesn't see "Requires sharing location" popover again
					callback();
				},
				// Geolocation error
				function(error){
					clearTimeout(location_timeout); // location_timeout is set in initiate function
					switch(error.code) 
					{
						case error.PERMISSION_DENIED: // User denied the request for Geolocation
//							alert("User denied the request for Geolocation");
// 							callback(); // prob don't need since callback_no_geolocation is executed before geolocation can return error.
							localStorage.removeItem('geolocationAuth') // so user will see "Requires sharing location" popover next time
							break;
						case error.POSITION_UNAVAILABLE:
							alert("Location information is unavailable.");
							localStorage['geolocationAuth'] = true; // so user doesn't see "Requires sharing location" popover again
							callback();
							break;
						case error.TIMEOUT:
							alert("The request to get user location timed out.");
							localStorage['geolocationAuth'] = true; // so user doesn't see "Requires sharing location" popover again
							callback();
							break;
						case error.UNKNOWN_ERROR:
							alert("An unknown error occurred.");
							localStorage['geolocationAuth'] = true; // so user doesn't see "Requires sharing location" popover again
							callback();
							break;
					}
				},
				options
			);
		} 
		else 
		{
			alert("Geolocation is not supported by this browser");
			localStorage.removeItem('geolocationAuth') // browser does not support geolocation
			callback();
		}
		callback_no_geolocation(); // need this default in case user selects "Not Now" in Firefox which bypasses both the geolocation Success and Error handlers.
    },
	
	handleTimeout = function(){
//		alert("Timed out");
		if (checkLocalStorage('geolocationAuth') != 'undefined')  // user changed geolocation permissions so we need to sync geolocationAuth with browser
		{
			preparePopover(); // Binds necessary handlers to the "Requires sharing location" popover message when user sorts by distance.
		}
		localStorage.removeItem('geolocationAuth') // so user will see "Requires sharing location" popover next time
	},
	
	latitude = function(){
		return lat;
	},

	longitude = function(){
		return lon;
	};
	
	// public attributes
    return {
        initiate: initiate,
		latitude: latitude,
		longitude: longitude
    };
};