/* *****
geoPermissionsPrompt - shows modal message regarding geolocation permission.

Scenario	|	Modal Response	| 	Browser Response	|	Action
1				Yes					Yes						Load venues passing latitude and longitude
2				Yes					No						Show modal message with instructions on how to change browser geolocation permissions
3				No					N/A						Load venues without latitude and longitude info

User is prompted with this modal window in the following scenarios:
1.  First time visitor (localStorage[geolocationAuth] == undefined)
2.  User enabled geolocation but was unsuccessful (localStorage[geolocationAuth] == false)

ModalPrompt.initiate:
1.  Opens modal to prime user about geolocation benefits.
2.  Binds the modal responses ("Not Now", "Yes"):
	a.  User clicks "Yes" - calls location.initiate to retrieve user's latitude and longitude
	b.  User clicks "Not Now" - sets localStorage variable, geolocationAuth, to false (so modal window isn't displayed next time)
3.  After getting location.initiate has completed, a callback hiding the modal window will be executed.

ModalPrompt.action: Binds the hide action.  Because coordinating geolocation permissions between application and browser is separate, need to be able to
control the enablement of this functionality.
1.  Modal will hide when a) user clicks "Yes" or "Not Now" in the modal window or b) closes the window by pressing escape or clicking outside.
2.  If user clicks "Yes", ModalPrompt.action makes an Ajax call to retrieve venues using user's latitude and longitude (obtained with ModalPrompt.initiate).
3.  If user clicks "Not Now" or closes modal without clicking "Yes", ModalPrompt.action makes an Ajax call to retrieve venues without user's latitude/longitude.
*/
var geolocationPermissionsPrompt = function() {
	var response;
	var user_location = Location();

    initiate = function() {
		$('#modal_geolocation_permissions').modal('show'); // show modal prompt to user
		$('#modal_geolocation_permissions .btn').on('click', function(){ // Captures user's response to modal message
			response = $(this).data("share_location");
			if (response == 'yes')
			{
				localStorage['geoPermissionsModal'] = true; // so user isn't prompted with geopermission modal again
				user_location.initiate( // calls html5 geolocation to access user location
					function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
//						alert('latitude: ' + user_location.latitude()+ ' ' + 'longitude: ' + user_location.longitude());
						$('#modal_geolocation_permissions').modal('hide');
					},
					function(){ // gets list of venues immediately in case user doesn't set geolocation permission in browser
						get_list('home','event', '', ''); // load venues without passing user's latitude and longitude to server 
					}
				);
			}
		});
	},
	
	hide_action_on = function(){
		$('#modal_geolocation_permissions').on('hide.bs.modal', function () {
			get_list('home','event', user_location.latitude(), user_location.longitude()); // load venues - passing user's latitude and longitude, if available, to server
			hide_action_off(); // unbinding .on method
		});
	},
	
	hide_action_off = function(){
		$('#modal_geolocation_permissions').off('hide.bs.modal');
	};
	

	// public attributes
    return {
        initiate: initiate,
		hide_action_on: hide_action_on,
		hide_action_off: hide_action_off
    };	
};