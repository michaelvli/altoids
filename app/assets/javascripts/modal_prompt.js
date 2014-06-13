/* *****
ModalPrompt - shows modal message regarding geolocation permission.

Scenario	|	Modal Response	| 	Browser Response	|	Action
1				Yes					Yes						Load venues passing latitude and longitude
2				Yes					No						Show modal message with instructions on how to change browser geolocation permissions
3				No					N/A						Load venues without latitude and longitude info

ModalPrompt.initiate:
1.  Opens modal to prime user about geolocation benefits.
2.  Binds the modal responses ("Not Now", "Yes") - "Yes" will call location.initiate to retrieve user's latitude and longitude.
3.  Upon completion of ModalPrompt.initiate, the modal will be hidden

ModalPrompt.action:
1.  Modal will hide when a) user clicks "Yes" or "Not Now" in the modal window or b) closes the window by pressing escape or clicking outside.
2.  If user clicks "Yes", ModalPrompt.action makes an Ajax call to retrieve venues using user's latitude and longitude (obtained with ModalPrompt.initiate).
3.  If user clicks "Not Now" or closes modal without clicking "Yes", ModalPrompt.action makes an Ajax call to retrieve venues without user's latitude/longitude.
*/

function ModalPrompt() {
	var response;
	var user_location = Location();
	
	$('#myModal').modal('show'); // show modal prompt to user
	$('#myModal .btn').on('click', function(){ // Captures user's response to modal message
		response = $(this).data("share_location");
		if (response == 'yes')
		{
			user_location.initiate( // calls html5 geolocation to access user location
				function(){ // anonymous callback function to ensure that user location info from client is retrieved before sending info server via ajax
//						alert('latitude: ' + user_location.latitude()+ ' ' + 'longitude: ' + user_location.longitude());
					$('#myModal').modal('hide');
				}
			);
		}
		else
		{
			localStorage['authorizedGeoLocation'] = false; // so user isn't prompted with modal again
		}
	});
	$('#myModal').on('hide.bs.modal', function (e) {
//		alert("hiding modal") 
		if (response == 'yes') // means user said "Yes" to location sharing
		{
			// load venues with lat and lon info
//			alert('latitude: ' + user_location.latitude()+ ' ' + 'longitude: ' + user_location.longitude());
			get_list('','', user_location.latitude(), user_location.longitude());
		}
		else //means user said "Not Now" to location sharing or closed modal without responding
		{
			// load venues without lat and lon info
		}
	});		
};