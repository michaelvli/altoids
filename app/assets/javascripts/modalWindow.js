/* *****
modal - provides functionality for customizing modal windows

http://www.sitepoint.com/5-ways-declare-functions-jquery/
http://learn.jquery.com/plugins/basic-plugin-creation/
*/

(function ( $ ) {
 
    $.fn.showModal = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            title: "Alert",
            body: "",
			primaryBtn: "",
			defaultBtn: "Close",
			callback: ""
        }, options );
		
		$('#mainModal .modal-title').text(settings.title);
		$('#mainModal .modal-body-content').html(settings.body);
		
		$('#mainModal #btn-default').text(settings.defaultBtn);
		
		if (settings.primaryBtn == "")
		{
			$('#mainModal #btn-primary').hide();
		}
		else
		{
			$('#mainModal #btn-primary').show();
			$('#mainModal #btn-primary').text(settings.primaryBtn);
		}
		
		$(this).modal('show');
		
		if (settings.callback != "")
		{
			settings.callback.call(this);
		}
    };
 
}( jQuery ));