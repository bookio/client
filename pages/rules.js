

(function() {

	var dependencies = [
		'less!./rules.less',
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _info = {};
            
            function fill() {
_elements.demandPhone.slider({ highlight: true });
	    	    //_elements.demandPhone.val(_info.demandPhone);
				_elements.demandEmail.val(_info.demandEmail);
	    	    _elements.demandAddress.val(_info.demandAddress);

            }	        
            
            function chill() {
                _info.demandPhone = _elements.demandPhone.val();
                _info.demandEmail = _elements.demandEmail.val();
                _info.demandAddress = _elements.demandAddress.val();
            }
            
            
            function init() {
                _page.hookup(_elements);
                
                var request = Gopher.request('GET', 'settings/app/contact');
                
                request.done(function(info) {
                    _info = info;
                
                    fill();
                                    
                    _elements.back.on('tap', function(event) {
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

    	$(document).delegate("#rules-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

