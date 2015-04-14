(function() {



	var dependencies = [
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/picker/picker.js',
		'../../widgets/schedule/schedule-day.js',
		'../../widgets/schedule/scheduleweek.js'
	];

	define(dependencies, function() {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			
			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			
			_elements.A.scheduleweek();
			_elements.B.scheduleweek();

			_elements.A.on('selection-end', function(event, selection) {
				$(this).scheduleweek('select', selection, 'A');
				console.log($(this).scheduleweek('selection'));
			});

			_elements.B.on('selection-end', function(event, selection) {

				$(this).scheduleweek('select', selection, 'B');
				console.log($(this).scheduleweek('selection'));
				
			});

			this.init = function() {
				_elements.A.scheduleweek('selection', {'A':[200,201,202]});


			}
			

		}
		
		return Module;
	});


})();
