

(function() {

	var dependencies = [
		'less!./test.less'
	];


	define(dependencies, function() {
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {

	           _page.hookup(_elements);

	           _elements.back.on('tap', function(event) {
	               console.log("lkjölkjlkjlökjlökjölkjölk");
		           $.mobile.popPage();
	           });
	        }	  

	        init();
		}

    	$(document).delegate("#test-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
