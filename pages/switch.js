

(function() {

	var dependencies = [
		'css!./switch',
		'./main',
		'./rentals/list',
		'./login',
		'./page-1',
		'./mobile-select-category',
		'./missing'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {
	        	_page.hookup(_elements, 'data-id');

	        	if (_elements.logout) {
		        	_elements.logout.on('tap', function(event) {
			        	$.cookie('sid') = '';
			        	$.mobile.pushPage('login');
			        	event.preventDefault();
			        	event.stopPropagation();
		        	});
	        	}
	        	
	        	if (Gopher.sessionID != '') {
		        	_elements.sid.text(sprintf("%s", Gopher.sessionID));
	        	}

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });
	        }	  

	        init();
		}

    	$(document).delegate("#switch-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

