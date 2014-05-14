


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
            
            var _elements = {};
            
            page.element.hookup(_elements, 'data-id');
            
            
            function fill() {
            }
            
            function chill() {
            }

			function init() {
				_elements.page.on('pageinit', function() {
					_elements.unit.picker('select', 'months');
					
				});
				
				_elements.price.on('tap', function(event) {
					$.mobile.pages.push('./schedule.html');
				});
				
				_elements.back.on('tap', function(event) {

					$.mobile.pages.pop();
				});
				
			}
	
			init();

        }

        
        return Module;
    
    });

    
})();

