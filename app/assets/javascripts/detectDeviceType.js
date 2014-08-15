/*  
This file contains 2 parts:
	1.  Checks to see if deviceType cookie has been set
		Note: Checking for the cookie needs to be performed asap, immediately prior to DOM being loaded or 
		else user will see the screen flicker.
	2.  If not, create a cookie that stores the device type based on screen size and pixel density	
	
*/

//DEBUG	$.removeCookie('deviceType'); // jquery plugin: https://github.com/carhartl/jquery-cookie/tree/v1.4.1
// check to see if deviceType cookie exists
if ($.cookie( 'deviceType' ) == 'desktop' || $.cookie( 'deviceType' ) == 'tablet' || $.cookie( 'deviceType' ) == 'phone' ) // if user doesn't have a cookie indicating size of device screen, set a cookie and reload site to get the appropriate version of page (mobile vs. desktop)
{
	$('body').show();
}
else //
{
	detectDeviceType(function(){
		window.location.reload(); // call back used to reload the page after cookie has been set with function setScreenSizeCookie()
	});
}

	
/* *****
Function: detectDeviceType

Description: Checks a device's type (laptop, tablet, phone) by using screen width and pixel density (for retina devices).
Once the device size has been set, it is stored in a cookie.  This function should only be called the first time a device 
visits the site.

Platform: mobile and Desktop
*/
	
function detectDeviceType(callback){
	var physicalWidth = screen.width; // screen width in physical pixels
	var devicePixelRatio = window.devicePixelRatio ||
					(window.screen.deviceXDPI / window.screen.logicalXDPI) // fallback for IE ||
					1 // default value;
	var deviceIndependentPixels = physicalWidth / devicePixelRatio;  // use to set viewport size
	var days_before_expiring = 365 * 10;
	var deviceType;

//DEBUG	alert("width: " + physicalWidth + " dpr: " + devicePixelRatio);
	
	if (deviceIndependentPixels < 768)
	{
		deviceType = 'phone'
	}
	else if (deviceIndependentPixels < 992) 
	{
		deviceType = 'tablet'
	}
	else
	{
		deviceType = 'desktop'
	}
	$.cookie('deviceType', deviceType, { expires: days_before_expiring }); // jquery plugin: https://github.com/carhartl/jquery-cookie/tree/v1.4.1
	callback();
}