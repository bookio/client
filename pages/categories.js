

(function() {

	var dependencies = [
		'jquery', 
		'text!./categories.html', 
		'less!./categories'
	];

	define(dependencies, function($, html) {
		
	    function Module(options) {
	
			var _options = {
    			category: {
        			name:'', 
        			description:''
                }
			};

			$.extend(_options, options);
    	    
    	    var _elements = {};
    	    var _dialog = null;
    	    var _category = _options.category;
	
            function show() {
                _dialog.modalex('show');
            }

            function hide() {
                _dialog.modalex('hide');
            }
			
            function fillin() {
                _elements.name.val(_category.name);
                _elements.description.val(_category.description);

                enableDisable();
            }	        
            
            function fillout() {
                _category.name = _elements.name.val();
                _category.description = _elements.description.val();
            }
            
            function enableDisable() {
                var name = _elements.name.val();
                _elements.ok.toggleClass('disabled', name.length == 0);
            }
            
	        function init() {
	           
	            _dialog = $('<div></div>').append(html);
	            _dialog.hookup('data-id', _elements);

	            fillin();
	            
	            _elements.ok.on('mouseup touchend', function(event){
    	            fillout();
    	            
                    var request = Model.Categories.save(_category);
    
                    request.done(function() {
                        hide();
                    });
	            });

	            _elements.cancel.on('mouseup touchend', function(event){
    	            hide();
	            });

	            _elements.name.on('input', function(event) {
    	            enableDisable();
	            });
	            
	            
                _dialog.modalex({
                    title: 'Kategorier'
                });
                
                show();
	        }	  
	        
	        init();
		}
		
		return Module;
		
	
	});

	
})()


