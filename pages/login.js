

(function() {

	var dependencies = [
		'less!./login.less',
		'pages/main'
	];

	define(dependencies, function() {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};

	        function loginWith(email, password) {

	    		_elements.button.transition({opacity:0.5}, 200);
	    		
	    		var request = Gopher.login(email, password);

				request.fail(function(){
	                _elements.button.transition({opacity:1.0}, 100);
	            	_elements.button.transition({x:-5}, 75).transition({x:10}, 75).transition({x:0}, 75);
					
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
            
	            _elements.popup.signup.on('tap', function() {
    	            
	            });

	            _elements.popup.cancel.on('tap', function() {
    	            _elements.popup.content.popup('close');    	            
	            });
	            
	            _elements.login.on('tap', function() {

    	    		var email = _elements.email.val();
    	    		var password = _elements.password.val();
    	            debugger;
    	            _elements.popup.title.text("En titelX");
    	            _elements.popup.message.text(sprintf("E-postadressen '%s' har inte används vid inloggning tidigare. Vill du skapa upp XXX?", email));
    	            _elements.popup.signup.text(sprintf("Använd e-postadressen '%s'", email));
    	            _elements.popup.cancel.text("löakjdf");

    	            var x = _elements.popup.cancel.text(); 
    	            
                    _elements.popup.content.popup({
				        dismissible : true,
				        theme : "c",
				        overlyaTheme : "a",
				        transition : "pop",
				        positionTo: _page
                    }).popup('open');
	            
					//login();
				});	        	
				
	        }	  

	        init();
		}

    	$(document).delegate("#login-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

