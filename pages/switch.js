

(function() {

	var dependencies = [
		'less!./switch.less',
		'./main',
		'./rentals/list',
		'./login',
		'./page-1',
		'./mobile/select-category',
		'./missing'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {
	        	_page.hookup(_elements);

	        	if (_elements.logout) {
		        	_elements.logout.on('tap', function(event) {
			        	$.cookie('sid') = '';
			        	$.mobile.pushPage('login.html');
			        	event.preventDefault();
			        	event.stopPropagation();
		        	});
	        	}
	        	
	        	if (Gopher.authorization.length > 0) {
		        	_elements.sid.text(sprintf("%s", Gopher.authorization));
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

