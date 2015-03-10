(function() {



	var dependencies = [
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/picker/picker.js',
		'../../widgets/schedule/schedule-day.js'
	];

	define(dependencies, function() {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			
			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			
			_elements.schedule.scheduleday();

			_elements.schedule.on('selection-end', function(event, selection) {
				selection.toggleClass('foo');
			});

			this.init = function() {


			}
			

		}
		
		return Module;
	});


})();
