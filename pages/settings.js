

(function() {

	var dependencies = [
	   './users',
	   './categories',
	   './contact',
	   './rules',
	   './missing'
	];

	define(dependencies, function() {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function init() {

	           _page.hookup(_elements, 'data-id');

	           _elements.back.on('tap', function(event){
		          event.preventDefault();
		          $.mobile.popPage();
	           });
	        }	  
	        
	       function getGuestURL() {
				var request = Gopher.request('GET', 'users/guest');

				request.done(function(user) {

					var longURL = sprintf("%s?user=%s", window.location.href, user.username);

					_elements.url.val(longURL);

					/*
                    var url = sprintf("http://tinyurl.com/api-create.php?url=%s", longURL);

                    var request = $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'html',
                        crossDomain: true
                    });
                    
                    request.done(function(tinyURL) {
                        _elements.url.text(tinyURL);
                    });
                    
                    request.fail(function(result) {
                    });
                    */

				});

				return request;
			}

			var isDoneSetURL = getGuestURL();

	        init();
		}

    	$(document).delegate("#settings-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
