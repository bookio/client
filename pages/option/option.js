(function() {



	var dependencies = [
		'i18n!./option.json',
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/picker/picker.js',
		'../../widgets/imagepicker/imagepicker'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _option = {};
			var _schedule = {};

			_element.i18n(i18n);

			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			
			function fill() {			
				_elements.name.val(_option.name);
				_elements.description.val(_option.description);
				if (_option.image)
					_elements.dropzone.imagepicker('setImage', _option.image);				
				_elements.units.val((_option.units == undefined) ? 1 : _option.units);
				_elements.selection.picker('select', ((_option.selection == undefined) ? '0' : _option.selection));
				_elements.unit.picker('select', ((_option.unit == undefined) ? 'hour' : _option.unit));				
			}

			function chill() {
				_option.name = _elements.name.val();
				_option.description = _elements.description.val();
				_option.image = _elements.dropzone.imagepicker('getImage');
				_option.selection = _elements.selection.val();
				_option.units = _elements.units.val();
				_option.unit = _elements.unit.val();
			}
			
			function enableDisable() {				
				((_elements.name.val().length == 0) ? _elements.save.addClass('ui-disabled') : _elements.save.removeClass('ui-disabled'));				
			}

			this.init = function() {

				_elements.selection.picker();
				_elements.unit.picker();
								
				if (page.params && page.params.option) {
					$.extend(_option, page.params.option);
				}
				
				if (_option.id != undefined) {
					var request = Gopher.request('GET', sprintf('schedule/option/%d', _option.id));
					
				}
				
				if (!_option.id)
					_elements.remove.addClass('hidden');

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop(null);
				});
				
				_elements.schedule.on('tap', function(event) {
					var request = $.mobile.pages.push('../schedule/schedule.html', {
						params: {schedule:_schedule}
					});
					
					request.done(function(schedule) {

						_schedule = schedule;
						console.log(schedule);
					});
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
				
				_elements.name.on('keyup', function(event, ui) {
					enableDisable();
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
				
				enableDisable();

			}
			

		}
		
		return Module;
	});


})();
