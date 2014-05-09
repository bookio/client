


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/options.js',
    	'../../widgets/imagepicker/imagepicker.js',
    	'../../widgets/picker/picker.js',
    	'../../widgets/symbolpicker/symbolpicker.js'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
            
            _element.hookup(_elements, 'data-id');
            
            
            function fill() {
            }
            
            function chill() {
            }

			function initializeEvents() {
				_elements.back.on('tap', function(event) {

					$.mobile.pages.pop();
				});
				
			}
	
			
            this.init = function() {
				initializeEvents();
				
				//_elements.options.options();
				
				_elements.unit.picker('select', 'days');
				
				//var options = _elements.options.find('option');
				
				//options.removeAttr('selected');
				//_elements.options.find('option[value="M"]').attr('selected', true);
				//options.options('refresh');
				
            }     

        }

        
        return Module;
    
    });

    
})();

