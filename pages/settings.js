

(function() {

	var modules = [
		'jquery', 
		'text!./settings.html', 
		'less!./settings', 
		'components/modal',
		'components/listbox'
	];

	define(modules, function($, html) {
		
	    function doModal(options) {
	
    	    var _elements = {};
    	    var _modal = null;
    	    var _gopher = new Gopher();
    	    var _info = null;
    	    var _users = null;
    	    
			var _defaults = {
			};
	
			var _options = $.extend({}, _defaults, options);
			
			
			function enableEscKey() {

	            _elements.html.on('keydown', function(event) {
	                if (event.keyCode == 27)
	                	_modal.close();
	            });
	            
	        };
			
			function enableClickSaveCompanyData() {
    	      
    	        _elements.saveButton.click(function() {
                    chill();
                            	        
        	        var request = _gopher.request('PUT', 'settings/app/contact', _info);
        	        
        	        request.done(function(){
            	        _modal.close();
        	        });
    	        });
	        };

            function fill() {
	    	    if (_info.name)
	    	        _elements.name.val(_info.name);

	    	    if (_info.phone)
	    	        _elements.phone.val(_info.phone);

	    	    if (_info.email)
	    	        _elements.email.val(_info.email);

	    	    if (_info.address)
	    	        _elements.address.val(_info.address);

	    	    if (_info.webpage)
	    	        _elements.webpage.val(_info.webpage);
            }	        
            
            function chill() {
                _info.name = _elements.name.val();
                _info.phone = _elements.phone.val();
                _info.email = _elements.email.val();
                _info.address = _elements.address.val();
                _info.webpage = _elements.webpage.val();
            }
	        
	        function init() {
	            
    			var request = _gopher.request('GET', 'settings/app/contact');
    			
    			request.done(function(info) {
                    _info = info ? info : {};

    	            _elements.html = $(html);
    	           
    	            _elements.saveButton = _elements.html.find('.ok-button');
    	    	    _elements.name = _elements.html.find('.name');
    	    	    _elements.phone = _elements.html.find('.phone');
    	    	    _elements.email = _elements.html.find('.email');
    	    	    _elements.address = _elements.html.find('.address');
    	    	    _elements.webpage = _elements.html.find('.webpage');
    	    	    _elements.users = _elements.html.find('.users');
        
    	    	    _users = new ListBox({container:_elements.users});
    	    	    
    	    	    _elements.html.find('.foo').on('click', function(){
        	    	    var foo = _elements.html.find('.user-data');
        	    	     
        	    	    if (foo.is(":visible"))   
            	    	    foo.slideUp('fast');
            	    	  else
            	    	    foo.slideDown('fast');
    	    	    });
    	    	    fill();
    	    	    
    	            _modal = new Modal({
    	                title: 'Inställningar',
    	                content:_elements.html
    	            });      
    	            
    	
    	            _modal.show();
    	      	    _elements.name.focus();
    
    	      	    enableEscKey();
    	            enableClickSaveCompanyData();
        		});
    
	            
	        }	  
	        
	        init();
	
		}
		
		return doModal;
		
	
	});

	
})()


