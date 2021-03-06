(function() {

	var dependencies = [
		'i18n!./category.json',
		'../../widgets/deletebutton/deletebutton.js',		
		'../../widgets/imagepicker/imagepicker'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _category = {};

			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			_element.i18n(i18n);

			function fill() {			
				_elements.name.val(_category.name);
				_elements.description.val(_category.description);
				if (_category.image)
					_elements.dropzone.imagepicker('setImage', _category.image);				
				_elements.automatic.attr('checked', _category.automatic ? 'checked' : false).checkboxradio('refresh');
				_elements.choose.attr('checked', _category.automatic ? false : 'checked').checkboxradio('refresh');								
				_elements.available.prop('checked', _category.available).checkboxradio('refresh');

			}

			function chill() {
				_category.name = _elements.name.val();
				_category.description = _elements.description.val();
				_category.image = _elements.dropzone.imagepicker('getImage');
				_category.automatic = _elements.automatic.is(':checked') ? 1 : 0;				
				_category.available = _elements.available.is(':checked') ? 1 : 0;

			}

			this.init = function() {
				
				if (page.params && page.params.category) {
					$.extend(_category, page.params.category);
				}

				if (_category.automatic == undefined)
					_category.automatic = true;

				if (_category.available == undefined)
					_category.available = true;						
				
				// Hide the remove button if a new category
				if (_category.id == undefined)
					_elements.remove.hide();
					
				_element.on("pageshow", function(event) {
					_elements.name.focus();
				});					

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});
								
				_elements.save.on('tap', function(event) {

					chill();

					$.spin(true);

					var request = Model.Categories.save(_category);

					request.always(function() {
						$.spin(false);
					});

					request.done(function(category) {
										
						if ($.isFunction(page.params.callback)) {
							page.params.callback(category);
						}
						$.mobile.pages.pop(category);
					});

				});
				
				_elements.remove.on('delete', function(event) {

					function remove() {
						var request = Model.Categories.remove(_category);

						request.done(function() {
							$.mobile.pages.pop();
						});
					}
					
					remove();

				});


				fill();

			}

		}
		
		return Module;
	});


})();
