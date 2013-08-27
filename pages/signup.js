

(function() {

	var dependencies = [
		'less!./signup.less',
		'pages/main'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};

	        function loginWith(email, password) {

	    		_elements.button.transition({opacity:0.5}, 200);
	    		
	    		var request = Gopher.login(email, password);

				request.fail(function(){
	                elements.button.transition({opacity:1.0}, 100);
	            	elements.button.transition({x:-5}, 75).transition({x:10}, 75).transition({x:0}, 75);
					
				});	    		

	    		request.done(function(data) {
		        	$.mobile.gotoPage('main.html');
	    		});
	
	            
	        }        
            
	        function login() {

	    		var email = _elements.email.val();
	    		var password = _elements.password.val();

	    		loginWith(email, password);
	    		
	        }        

	        function init() {
	        	
	        	// Logout
	        	Gopher.sessionID('');
	        	
	        	_page.hookup(_elements);
	        	_elements.email.val(Gopher.username());

	            _page.on('keydown', function(event) {
	                if (event.keyCode == 13)
	                    login();
	            });
            
	            _elements.button.on('tap', function() {
					login();
				});	        	
				
	        }	  

	        init();
		}

    	$(document).delegate("#login", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

