

(function() {

	var dependencies = [
		'text!./login.html',
		'less!./login.less',
		'pages/page-1'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
	        function login() {

	    		var email = _elements.email.val();
	    		var password = _elements.password.val();

	    		_elements.button.transition({opacity:0.5}, 200);
	    		
	    		var request = Gopher.login(email, password);

				request.fail(function(){
	                _elements.button.transition({opacity:1.0}, 100);
	            	_elements.button.transition({x:-5}, 75).transition({x:10}, 75).transition({x:0}, 75);
					
				});	    		

	    		request.done(function(data) {
	    			$.cookie('email', email);

		        	$.mobile.pushPage('main.html');
	    		});
	
	            
	        }        
	        function init() {
	        	
	        	// Logout
	        	$.cookie('sid', '');
	        	
	        	_page.hookup(_elements);

	        	_elements.email.val($.cookie('email'));

	            _page.on('keydown', function(event) {
	                if (event.keyCode == 13)
	                    login();
	            });
            
	            _elements.button.on('tap', function() {
					login();
				});	        	
	        }	  

	        init();
	        console.log(html);
		}

    	$(document).delegate("#login", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

