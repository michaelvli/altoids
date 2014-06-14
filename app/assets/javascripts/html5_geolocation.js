/* *****
Location - uses HTML5 geolocation to obtain the user's latitude and longitude via Revealing Module structure.


Problem: Firefox doesn't support HTML5 geolocation timeout attribute when user doesn't respond to geolocation permissions prompt :
- If user selects "Not this time" to prompt or closes it, no error method for getCurrentPosition method is not called in Firefox - nothing happens
- Ideally, we should use the timeout attribute in the options variable but it doesn't work in Firefox (it does, however, work in Chrome)

Solution:
- Use setTimeout method to set off behavior instead of getCurrentPosition
*/

var Location = function () {
    var lat;
    var lon;
	var location_timeout;
	
    initiate = function(callback) {
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
					localStorage['geolocationAuth'] = true; // so user isn't prompted with geopermission modal again
					callback();
				},
				// Geolocation error
				function(error){
//					clearTimeout(location_timeout); // location_timeout is set in initiate function
					localStorage['geolocationAuth'] = false; // so user is prompted with geopermission modal again					
					switch(error.code) 
					{
						case error.PERMISSION_DENIED: // User denied the request for Geolocation
//							alert("User denied the request for Geolocation");
							callback();
//							$('#modal_geolocation_permissions').off('hide.bs.modal');
//							$('#modal_geolocation_permissions').modal('hide'); // close modal window
//							localStorage['geolocationAuth'] = true; // so user isn't prompted with geopermission modal again
//							get_list('home','event', '', ''); // load venues - without passing user's latitude and longitude
/*  Temporary - hold off on using the geolocation instructions modal
									$('#modal_geolocation_instructions').modal('show'); // show geolocation instructions
									$('#modal_geolocation_instructions .btn').on('click', function(){
										navigator.geolocation.getCurrentPosition(
											function(position){
												get_list('home','event', position.coords.latitude, position.coords.longitude);	// load venues - passing user's latitude and longitude to server 
											},
											function(error){
												get_list('home','event', '', ''); // load venues - without passing user's latitude and longitude
											}
										);
									})			
									$('#modal_geolocation_instructions').on('hide.bs.modal', function () {
										get_list('home','event', '', ''); // load venues - without passing user's latitude and longitude
									});
*/												
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