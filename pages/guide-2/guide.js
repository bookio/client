


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
			var _stack = [];
			var self = this;
			
            _element.hookup(_elements, 'data-id');


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

			function back() {
				if (_stack.length > 1) {
					_stack.pop();
					
					loadStep(_stack[_stack.length - 1]);
				}
			}
			
            function next(step) {
            	loadStep(step);
            	_stack.push(step);
            }



			function initializeEvents() {
			
				_elements.next.on('tap', function(event) {
					next('test');

				});
				
				_elements.back.on('tap', function(event) {
					back();

				});
								

				
			}

			
            this.init = function() {

				_element.trigger('create');
				
				
				initializeEvents();
				next('welcome');
				
            }     

        }

        
        return Module;
    
    });

    
})();

