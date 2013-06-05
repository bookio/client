

(function() {

	var dependencies = [
	];

	define(dependencies, function() {
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {

    	        var params = $.mobile.pageData; //$.mobile.pageParameter(page);
    	        
	           _page.hookup('data-id', _elements);
	           
	           _elements.name.text(params.name);
	           _elements.description.text(params.description);
	           
	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });
	        }	  

	        init();
		}

    	$(document).delegate("#category", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
