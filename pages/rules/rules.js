

(function() {

	var dependencies = [
		'css!./rules',
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _info = {};
            
            function fill() {
	    	    _elements.demandPhone.val((_info.demandPhone == 0 || _info.demandPhone == undefined) ? 'off' : 'on').slider("refresh");
				_elements.demandEmail.val((_info.demandEmail == 0 || _info.demandEmail == undefined) ? 'off' : 'on').slider("refresh");
	    	    _elements.demandAddress.val((_info.demandAddress == 0 || _info.demandAddress == undefined) ? 'off' : 'on').slider("refresh");

            }	        
            
            function chill() {
                _info.demandPhone = _elements.demandPhone.val();
                _info.demandEmail = _elements.demandEmail.val();
                _info.demandAddress = _elements.demandAddress.val();
            }
            
            
            function init() {
                _page.hookup(_elements, 'data-id');
                
                var request = Gopher.request('GET', 'settings/app/contact');
                
                request.done(function(info) {
                    _info = info;
                
                    fill();
                                    
                    _elements.back.on('tap', function(event) {
                    
                        chill();
                
                        var request = Gopher.request('PUT', 'settings/app/contact', _info);
                
                        request.done(function(){
                            $.mobile.pages.pop();
                        });
                    });
                });
            }	  

            init();
        }

    	$(document).delegate("#rules-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

