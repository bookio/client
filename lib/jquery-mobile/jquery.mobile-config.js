

define(['jquery'], function($) {

	//var $;
	console.log('-----------------------------');
	
    $(document).bind("mobileinit", function(){
    
		console.log('------INIT-----------------------');

    	//$.mobile.ajaxEnabled = false;
    	//$.mobile.linkBindingEnabled = false;
    	//$.mobile.hashListeningEnabled = false;
    	//$.mobile.pushStateEnabled = false;

    	$.mobile.hashListeningEnabled = false;
    	$.mobile.defaultPageTransition = 'fade';

    });


});

