

(function() {

	var dependencies = [
		'i18n!./rules.json'
	];

	define(dependencies, function(i18n) {
		
		
	    function Module(page) {
            
            var _element = page.element;
            var _elements = {};
            var _info = {};
            
            function fill() {
	    	    _elements.demandPhone.val(_info.demandPhone  ? '1' : '0').slider("refresh");
				_elements.demandEmail.val(_info.demandEmail ? '1' : '0').slider("refresh");
	    	    _elements.demandAddress.val(_info.demandAddress ? '1' : '0').slider("refresh");

            }	        
            
            function chill() {
                _info.demandPhone = parseInt(_elements.demandPhone.val());
                _info.demandEmail = parseInt(_elements.demandEmail.val());
                _info.demandAddress = parseInt(_elements.demandAddress.val());
            }
            
            
            function init() {
                
                page.element.trigger('create');
                
                _element.hookup(_elements, 'data-id');
                _element.i18n(i18n);
                
                var request = Gopher.request('GET', 'settings/app/contact');
                
                request.done(function(info) {
                    _info = info == null ? {} : info;
                
                    fill();
                                    
                    _elements.back.on('tap', function(event) {
                    
                        chill();
                
                        var request = Gopher.request('PUT', 'settings/app/contact', _info);
                
                        request.done(function(){
                            $.mobile.pages.pop();
                        });
                    });
                    
                });
                
                request.always(function() {
                    page.show();
                });
            }	  

            init();
        }
        
        return Module;
	});

	
})();

