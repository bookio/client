

(function() {

	var dependencies = [
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _user = {};
            
            function fill() {
                _elements.name.val(_user.name);
                _elements.email.val(_user.email);
            }
            
            function chill() {
                _user.name = _elements.name.val();
                _user.email = _elements.email.val();
            }
            
	        function init() {
    	        _page.hookup(_elements);
    	        
    	       if ($.mobile.pageData && $.mobile.pageData.user) {
        	       _user = $.mobile.pageData.user;
    	       }

    	       if (!_user.id)
    	       	   _elements.remove.addClass('hidden');
    	       	   
    	       fill();

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });


	           _elements.remove.on('tap', function(event) {
	           	
	           });

	           _elements.save.on('tap', function(event) {
	           	
    	           chill();
		           
		           var request = Model.Users.save(_user);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });
    	        
	        }	  

	        init();
		}

    	$(document).delegate("#user-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

