


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/list.js',
    	'../../widgets/imagepicker/imagepicker.js',
    	'../../widgets/picker/picker.js',
    	'../../widgets/symbolpicker/symbolpicker.js'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
            var _steps = ['welcome', 'test'];
			var _step = 0;			

            _element.hookup(_elements, 'data-id');

            function fill() {
            }
            
            function chill() {
            }

            
            function loadStep(step) {
				var jsPath   = sprintf('steps/%s.js', step);
				var htmlPath = sprintf('text!steps/%s.html', step);
				var cssPath  = sprintf('css!steps/%s.css', step);

				require([jsPath, htmlPath, cssPath], function(script, html) {

					_elements.buttons.fadeOut(200);
					
					_elements.content.fadeOut(200, function(){

						html = $(html);
						
						_elements.content.empty();      
						_elements.content.append(html);      
						_elements.content.trigger('create');   

						var module = new script(html);				
						
						_elements.content.fadeIn(200);	
						_elements.buttons.fadeIn(200);
						
					});
					
					
				});
			}
			
			function nextStep() {
				_step = (_step + 1) % _steps.length;
				loadStep(_steps[_step]);
			}


			function initializeEvents() {
			
				_elements.next.on('tap', function(event) {
					nextStep();

				});
				
				_elements.back.on('tap', function(event) {


				});
								

				
			}

			
            this.init = function() {

				_element.trigger('create');
				
				
				initializeEvents();
				loadStep(_steps[_step]);
				
            }     

        }

        
        return Module;
    
    });

    
})();

