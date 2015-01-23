(function() {



	var dependencies = [
		'i18n!./option.json',
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/picker/picker.js'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _option = {};

			_element.i18n(i18n);

			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			
			function fill() {			
				_elements.name.val(_option.name);
				_elements.description.val(_option.description);
				_elements.units.val((_option.units == undefined) ? 1 : _option.units);
				_elements.selection.picker('select', ((_option.selection == undefined) ? '0' : _option.selection));
				_elements.unit.picker('select', ((_option.unit == undefined) ? 'hour' : _option.unit));				
			}

			function chill() {
				_option.name = _elements.name.val();
				_option.description = _elements.description.val();
				_option.selection = _elements.selection.val();
				_option.units = _elements.units.val();
				_option.unit = _elements.unit.val();
			}			

			this.init = function() {

				_elements.selection.picker();
				_elements.unit.picker();
								
				if (page.params && page.params.option) {
					$.extend(_option, page.params.option);
				}
				
				if (!_option.id)
					_elements.remove.addClass('hidden');

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop(null);
				});
				
				_elements.schedule.on('tap', function(event) {
					var request = $.mobile.pages.push('../schedule/schedule.html');
				});
				
				_elements.remove.on('tap', function(event) {

					function remove() {
						var request = Model.Options.remove(_option);

						request.done(function() {
							$.mobile.pages.pop(null);
						});
					}
					
					remove();

				});
				
				_elements.save.on('tap', function(event) {

					$.spin(true);
					
					chill();

					var request = Model.Options.save(_option);

					request.always(function() {
						$.spin(false);
					});

					request.done(function(option) {
						if ($.isFunction(page.params.callback)) {
							page.params.callback(option);
						}
						$.mobile.pages.pop(_option);
					});

				});

				fill();


			}
			

		}
		
		return Module;
	});


})();
