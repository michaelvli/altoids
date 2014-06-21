/* *****
functions for setting, reading and deleting cookies

Source: http://www.thesitewizard.com/javascripts/cookies.shtml
*/

/* 
	Function: set_cookie
	Purpose: setting value for a cookie
	Usage: set_cookie( "colourscheme", "Shades of Purple", 7 );
	Cookie name: "colourscheme" 
	Cookie value: "Shades of Purple"
	Cookie duration: 7 days
*/
function set_cookie ( cookie_name, cookie_value, lifespan_in_days, valid_domain )
{
    // http://www.thesitewizard.com/javascripts/cookies.shtml
    var domain_string = valid_domain ?
                       ("; domain=" + valid_domain) : '' ;
    document.cookie = cookie_name +
                       "=" + encodeURIComponent( cookie_value ) +
                       "; max-age=" + 60 * 60 *
                       24 * lifespan_in_days +
                       "; path=/" + domain_string ;
}



/* 
	Function: get_cookie
	Purpose: reading value for a cookie
	Usage: colourscheme = get_cookie( "colourscheme" );
	Note: If get_cookie() cannot find the cookie, it will return an empty string.
*/
/* Function was needed prior to DOM being loaded.  Hence, it was defined in the very beginning of main javascript file prior to use.
function get_cookie ( cookie_name )
{
    // http://www.thesitewizard.com/javascripts/cookies.shtml
    var cookie_string = document.cookie ;
    if (cookie_string.length != 0) {
        var cookie_value = cookie_string.match (
                        '(^|;)[\s]*' +
                        cookie_name +
                        '=([^;]*)' );
        return decodeURIComponent ( cookie_value[2] ) ;
    }
    return '' ;
}
*/


/* 
	Function: delete_cookie
	Purpose: deleting a cookie
	Usage: delete_cookie( "colourscheme" );
	Note: May need to specify domain name if it was specified when creating the cookie.
*/
function delete_cookie ( cookie_name, valid_domain )
{
    // http://www.thesitewizard.com/javascripts/cookies.shtml
    var domain_string = valid_domain ?
                       ("; domain=" + valid_domain) : '' ;
    document.cookie = cookie_name +
                       "=; max-age=0; path=/" + domain_string ;
}
