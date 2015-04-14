


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
			var _schedule = {};
			
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
			
				if (page.params && page.params.schedule) {
					_schedule = page.params.schedule;
				}			

				_elements.back.on('tap', function(event) {

					$.mobile.pages.pop(_schedule);
				});

				
				_element.find('.button').on('tap', function() {
					_element.find('.button').removeClass('selected');
					$(this).addClass('selected');	
					
					_elements.schedule.attr('data-tag', $(this).text());
				});
	            
	            var slots = {};
	            
	            $.each(_schedule, function(index, item){
		            slots[item.tag] = item.slots;
		            
	            });

				_elements.schedule.scheduleweek();
				_elements.schedule.scheduleweek('selection', slots);

				_elements.schedule.on('selection-end', function(event, selection) {
					_elements.schedule.scheduleweek('select', selection, _elements.schedule.attr('data-tag'));

					var slots = _elements.schedule.scheduleweek('selection');

					_schedule = [];
					
					for (var tag in slots) {
						_schedule.push({'tag':tag, 'slots':slots[tag]});	
					}
					console.log(_schedule);
				
				});

				


			}
	
			init();
        }
        
        return Module;
    
    });

    
})();

