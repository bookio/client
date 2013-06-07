

(function() {

	var dependencies = [
	   './users',
	   './categories',
	   './contact',
	   './missing'
	];

	define(dependencies, function() {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {

	           _page.hookup(_elements);

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });
	        }	  

	        init();
		}

    	$(document).delegate("#settings-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
