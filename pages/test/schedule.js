


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/imagepicker/imagepicker.js',
    	'../../widgets/schedule/scheduleweek.js',
    	'css!./schedule.css'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
			var _options = {};
			var _schedule = {};
			
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
          
				
            }     

        }

        
        return Module;
    
    });

    
})();

