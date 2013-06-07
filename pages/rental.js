

(function() {

	var dependencies = [
		'less!./rental'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _rental = {};
            
            function fill() {
                _elements.name.val(_rental.name);
                _elements.description.val(_rental.description);
            }
            
            function chill() {
                _rental.name = _elements.name.val();
                _rental.description = _elements.description.val();
                _rental.icon_id = 39;
            }
            
	        function init() {
    	        _page.hookup(_elements);
    	        
    	       if ($.mobile.pageData && $.mobile.pageData.rental) {
        	       _rental = $.mobile.pageData.rental;
    	       }

    	       if (!_rental.id)
    	       	   _elements.remove.addClass('hidden');
    	       	   
    	       fill();

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });


	           _elements.remove.on('tap', function(event) {
	           	
		           var request = Model.Rentals.remove(_rental);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });

	           _elements.save.on('tap', function(event) {
	           	
    	           chill();
		           
		           var request = Model.Rentals.save(_rental);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });
    	        
	        }	  

	        init();
		}

    	$(document).delegate("#rental-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

