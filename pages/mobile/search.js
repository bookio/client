

(function() {

	var dependencies = [
	   'less!./search'
	];

	define(dependencies, function() {
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {

    	        var params = $.mobile.pageData;
    	        
	           _page.hookup(_elements);
	           
	           _elements.name.text(params.name);
	           _elements.description.text(params.description);
	           
	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });
	        }	  

	        init();
		}

    	$(document).delegate("#mobile-search", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
