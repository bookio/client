

(function() {

	var dependencies = [
	   'less!pages/category'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _category = {};
            
            function fill() {
                _elements.name.val(_category.name);
                _elements.description.val(_category.description);
            }
            
            function chill() {
                _category.name = _elements.name.val();
                _category.description = _elements.description.val();
            }
            
	        function init() {
    	        _page.hookup(_elements);
    	        
    	       if ($.mobile.pageData && $.mobile.pageData.category) {
        	       _category = $.mobile.pageData.category;
    	       }

    	       if (!_category.id)
    	       	   _elements.remove.addClass('hidden');
    	       	   
    	       fill();

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });


	           _elements.remove.on('tap', function(event) {
	           	
		           var request = Model.Categories.remove(_category);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });

	           _elements.save.on('tap', function(event) {
	           	
    	           chill();
		           
		           var request = Model.Categories.save(_category);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });
    	        
	        }	  

	        init();
		}

    	$(document).delegate("#category-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

