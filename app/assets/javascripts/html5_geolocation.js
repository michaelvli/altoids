/* *****
Location - uses HTML5 geolocation to obtain the user's latitude and longitude via Revealing Module structure.


Problem: Firefox doesn't support HTML5 geolocation timeout attribute when user doesn't respond to geolocation permissions prompt :
- If user selects "Not this time" to prompt or closes it, no error method for getCurrentPosition method is not called in Firefox - nothing happens
- Ideally, we should use the timeout attribute in the options variable but it doesn't work in Firefox (it does, however, work in Chrome)

Solution:
- Use setTimeout method to set off behavior instead of getCurrentPosition
*/

var Location = function (sort_order) {
    var lat;
    var lon;
	var location_timeout;
	
    initiate = function (callback) {
		var options = {
		  enableHighAccuracy: true,
		  timeout: 3000, //doesn't work in Firefox
		  maximumAge: 0  // never stored in cache (by setting to 0)
		};
		
		if (navigator.geolocation)
		{
//			location_timeout = setTimeout(handleTimeout, options.timeout); // timer is cleared getLocation or handleErrors functions
			navigator.geolocation.getCurrentPosition(
				// Geolocation success
				function(position){
//					clearTimeout(location_timeout);
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					localStorage['authorizedGeoLocation'] = true;
					callback();
				},
				// Geolocation error
				function(error){
//					clearTimeout(location_timeout); // location_timeout is set in initiate function
					
					switch(error.code) 
					{
						case error.PERMISSION_DENIED:
							alert("User denied the request for Geolocation.");
							localStorage['authorizedGeoLocation'] = false;
				
// need to display instructions on how to reset geolocation permissions

							if (sort_order == 'distance')
							{
								$('#myModal').modal('show'); // Modal prompts user for geolocation permission
							}	
							break;
						case error.POSITION_UNAVAILABLE:
							alert("Location information is unavailable.");
							break;
						case error.TIMEOUT:
							alert("The request to get user location timed out.");
							break;
						case error.UNKNOWN_ERROR:
							alert("An unknown error occurred.");
							break;
					}
				},
				options);
		} 
		else 
		{
			alert("Geolocation is not supported by this browser");
		}
    },
	
	handleTimeout = function(){
		alert("You'll need to share your location if you'd like to find out how far venues are from you.");
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