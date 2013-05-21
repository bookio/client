

(function() {

	var dependencies = [
		'jquery', 
		'text!./categories.html', 
		'less!./categories'
	];

	define(dependencies, function($, html) {
		
	    function Module(options) {
	
			var _options = {
    			category: {name:'Magnus', description:'Alika'}
			};

			$.extend(_options, options);
    	    
    	    var _elements = {};
    	    var _dialog = null;
    	    var _category = _options.category;
    	    
	
			
            function fill() {
                _elements.name.val(_category.name);
                _elements.description.val(_category.description);
                
            }	        
            
            function chill() {
                _category.name = _elements.name.val();
                _category.description = _elements.description.val();
            }
	        
	        function init() {
	           
	            _dialog = $('<div></div>').append(html);
	            _dialog.hookup(_elements);

	            fill();
	            
	            _elements.ok.on('click', function(event){
    	            chill();
    	            console.log(_category);
    	            _dialog.modalex('hide');
	            });

	            _elements.cancel.on('click', function(event){
    	            _dialog.modalex('hide');
	            });

                _dialog.modalex({
                    title: 'Kategorier'
                });
                
                _dialog.modalex('show');
	        }	  
	        
	        init();
		}
		
		return Module;
		
	
	});

	
})()


