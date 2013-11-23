

(function() {

	var dependencies = [
	];

	define(dependencies, function() {
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {

	           _page.hookup(_elements, 'data-id');

	           _elements.back.on('tap', function(event){
		           $.mobile.pages.pop();
	           });
	        }	  

	        init();
		}

    	$(document).delegate("#missing-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
