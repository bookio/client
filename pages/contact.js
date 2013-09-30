

(function() {

	var dependencies = [
		'less!./contact.less'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _info = {};
            
            function fill() {
		    	
	    	    if (_info.name)
	    	        _elements.name.val(_info.name);

	    	    if (_info.phone)
	    	        _elements.phone.val(_info.phone);

	    	    if (_info.email)
	    	        _elements.email.val(_info.email);

	    	    if (_info.twitterAccount)
	    	        _elements.twitterAccount.val(_info.twitterAccount);

	    	    if (_info.fbAccount)
	    	        _elements.fbAccount.val(_info.fbAccount);

	    	    if (_info.address)
	    	        _elements.address.val(_info.address);

	    	    if (_info.webpage)
	    	        _elements.webpage.val(_info.webpage);
				
            }	        
            
            function chill() {
                _info.name = _elements.name.val();
                _info.phone = _elements.phone.val();
                _info.email = _elements.email.val();
                _info.twitterAccount = _elements.twitterAccount.val();
                _info.fbAccount = _elements.fbAccount.val();
                _info.address = _elements.address.val();
                _info.webpage = _elements.webpage.val();
            }
            
            
            function init() {
                _page.hookup(_elements);
                
                var request = Gopher.request('GET', 'settings/app/contact');
                
                request.done(function(info) {
                    _info = info ? info : {};
					
                    fill();
                
                    _elements.back.on('tap', function(event) {
                        $.mobile.popPage();
                    });
                    
                    _elements.save.on('tap', function(event) {
                        chill();
                
                        var request = Gopher.request('PUT', 'settings/app/contact', _info);
                
                        request.done(function(){
                            $.mobile.popPage();
                        });
                    });
                });
            }	  

            init();
        }

    	$(document).delegate("#contact-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

