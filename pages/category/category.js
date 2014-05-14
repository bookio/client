(function() {

	var dependencies = [
		'i18n!./category.json',
		'../../widgets/imagepicker/imagepicker'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _category = {};
			var _file = null;
			
			function fill() {
				_elements.name.val(_category.name);
				_elements.description.val(_category.description);

				_elements.available.val((_category.available == 1 || _category.available == undefined) ? 'on' : 'off').flipswitch("refresh");

				if (_category.image)
					_elements.dropzone.imagepicker('setImage', _category.image);

			}

			function chill() {
				_category.name = _elements.name.val();
				_category.description = _elements.description.val();
			
				_category.available = (_elements.available.val() == 'on') ? 1 : 0;
			
				_category.image = _elements.dropzone.imagepicker('getImage');
				
				_category.limit_from = new Date();
			}

			this.init = function() {
				
				_element.trigger('create');
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);

				if (page.params && page.params.category) {
					$.extend(_category, page.params.category);
				}

				if (!_category.id)
					_elements.remove.addClass('hidden');

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.remove.on('tap', function(event) {

					function remove() {

						var request = Model.Categories.remove(_category);

						request.done(function() {
							$.mobile.pages.pop();
						});

					}

					MsgBox.show({
						message: 'Är du säker på att du vill ta bort denna kategori?',
						icon: 'warning',
						buttons: [
							{text: 'Ja', click: remove}, 
							{text: 'Nej'}
						]
					});
				});
				
				_elements.save.on('tap', function(event) {

					chill();

					var request = Model.Categories.save(_category);

					request.done(function() {
						$.mobile.pages.pop();
					});

				});

				_element.on('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();
					event.originalEvent.dataTransfer.dropEffect = 'none';
				});

				_element.on('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();
				});
				
				fill();
				
			}
		}

		return Module;


	});


})();
