


(function() {

    var dependencies = [
    	'i18n!./schedule.json',
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/options.js',
    	'../../widgets/common/list.js',
    	'../../widgets/picker/picker.js',
    	'../../widgets/schedule/scheduleweek.js',
    	'css!./schedule.css'
    ];


    define(dependencies, function(i18n) {
        
        function Module(page) {
            
            var _elements = {};
			var _option = {};
			
			_elements.page      = page.element;
			_elements.unit      = _elements.page.find('.unit');
			_elements.units     = _elements.page.find('.units');
			_elements.selection = _elements.page.find('.selection');
			_elements.schedules = _elements.page.find('.schedule');
	
    		_elements.page.i18n(i18n);
			_elements.page.trigger('create');
            
            function fill() {
				_elements.units.val(_option.units);
				_elements.selection.picker('select', _option.selection);
				_elements.unit.picker('select', _option.unit);
				
	            var slots = {};
	            
	            $.each(_option.schedules, function(index, item){
		            slots[item.tag] = item.slots;
	            });

				_elements.page.find('.schedule.active').scheduleweek('selection', slots);
            }
            
            function chill() {
				_option.units = parseInt(_elements.units.val());
				_option.selection = parseInt(_elements.selection.val());
				_option.unit = _elements.unit.val();

				var slots = _elements.page.find('.schedule.active').scheduleweek('selection');

				_option.schedules = [];
				
				for (var tag in slots) {
					_option.schedules.push({'tag':tag, 'slots':slots[tag]});	
				}

            }
            
            function enableDisable() {
				if (_option.unit == 'minute' || _option.unit == 'hour') {
					_elements.page.find('.schedule.week').addClass('active');						
				}
				else {
					_elements.page.find('.schedule.day').addClass('active');						
					
				}
	            
            }

            
            function enableEvents() {
				_elements.page.find('.back').on('tap', function(event) {
					chill();
					$.mobile.pages.pop(_option);
				});

				_elements.page.find('.button').on('tap', function() {
					_elements.page.find('.button.selected').removeClass('selected');
					$(this).addClass('selected');	
				});

				_elements.unit.on('change', function(event, value) {
					_option.unit = value;
					
					_elements.page.find('.schedule.active').removeClass('active');

					if (value == 'minute' || value == 'hour') {
						_elements.page.find('.schedule.week').addClass('active');						
					}
					else {
						_elements.page.find('.schedule.day').addClass('active');						
						
					}
				});
				
	            
				_elements.page.find('.schedule').on('selection-end', function(event, selection) {
					if ($(this).hasClass('active'))
						$(this).scheduleweek('select', selection, _elements.page.find('.button.selected').text());
				});

	            
            }

			function init() {

				if (page.params && page.params.option) {
					_option = page.params.option;
				}			

				_option.units     = _option.units     == undefined ?      1 : _option.units;
				_option.unit      = _option.unit      == undefined ? 'hour' : _option.unit;
				_option.selection = _option.selection == undefined ?    '0' : _option.selection;

				enableEvents();
				enableDisable();

				fill();

			}
	
			init();
        }
        
        return Module;
    
    });

    
})();

