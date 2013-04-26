

(function() {

	var modules = [
		'jquery', 
		'text!./settings.html', 
		'less!./settings', 
		'components/modal'
	];

	define(modules, function($, html) {
		
	    function doModal(options) {
	
    	    var _elements = {};
    	    var _modal = null;
 

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
    	      
    	        _elements.saveCompanyDataButton.click(function() {
	    	        console.log("SaveCompanyButton");
    	        });
	        };

			
	        
	        function init() {
	            
	            _elements.html = $(html);
	           
	            _elements.saveCompanyDataButton = _elements.html.find("#settings-save-company-data-button");
	    	    _elements.companyName = _elements.html.find("#inputCompanyName");

	            _modal = new Modal({
	                title: 'Inställningar',
	                content:_elements.html
	            });      
	            
	
	            _modal.show();
	      	    _elements.companyName.focus();

	      	    enableEscKey();
	            enableClickSaveCompanyData();
	            
	        }	  
	        
	        init();
	
		}
		
		return doModal;
		
	
	});

	
})()


