


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/options.js',
    	'../../widgets/common/list.js',
    	'../../widgets/picker/picker.js',
    	'../../widgets/schedule/scheduleweek.js',
    	'css!./schedule.css'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
			var _options = {};
			
            _element.hookup(_elements, 'data-id');
            
            
            function fill() {
            }
            
            function chill() {
            }

            function selectTag(tag) {

				var button = _elements.buttons.container.find(sprintf('[data-tag="%s"]', tag));
				var buttons = _elements.buttons.container.find('[data-tag]');
				
				buttons.removeClassMatching('ui-icon-*').addClass('ui-icon-none');
				button.removeClass('ui-icon-none').addClass('ui-icon-check');

				_elements.schedule.attr('data-tag', button.attr('data-tag'));
            }
            
            

			function init() {
				_elements.back.on('tap', function(event) {

					$.mobile.pages.pop();
				});

	            var selection = {};
	            
				
	            selection.A = [];
	            selection.A.push({
	            	start: new Date(2014, 11, 11, 10, 30),
	            	end:new Date(2014, 11, 11, 11, 30)
		            
	            });
	            
				_elements.schedule.scheduleweek();
				_elements.schedule.scheduleweek('select', selection);

				_elements.schedule.on('selection-end', function(event, selection) {
					console.log(_elements.schedule.scheduleweek('select'));
				});

				


			}
	
			init();
        }
        
        return Module;
    
    });

    
})();

