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
			
			function enableDisable() {
				if (_elements.available.val() == 'on') {
					var state = _elements.limit_time.val() == 'on' ? 'enable' : 'disable';
			
					_elements.limit_time.flipswitch('enable');
				
					
					_elements.limit_from.textinput(state);
					_elements.limit_to.textinput(state);					
				}
				else {
					_elements.limit_time.flipswitch('disable');
					_elements.limit_from.textinput('disable');
					_elements.limit_to.textinput('disable');										
				}
				
				// Make sure 'to' is before 'from'
				if (_elements.limit_from.mobiscroll('getDate') < _elements.limit_to.mobiscroll('getDate'))
					 _elements.limit_to.mobiscroll('setDate', _elements.limit_from.mobiscroll('getDate'));
			}

			function fill() {
				_elements.name.val(_category.name);
				_elements.description.val(_category.description);

				_elements.available.val((_category.available == 1 || _category.available == undefined) ? 'on' : 'off').flipswitch("refresh");

				_elements.limit_time.val((_category.limit_time == 1) ? 'on' : 'off').flipswitch("refresh");


				// Set available default to 8am - 5pm
				var d = new Date();
				
				(_category.limit_from == null) ? d.setHours(8, 0) : d.setDate(_category.limit_from);						
				_elements.limit_from.mobiscroll('setDate', d);


				(_category.limit_to == null) ? d.setHours(17, 0) : d.setDate(_category.limit_to);						
				_elements.limit_to.mobiscroll('setDate', d);


				if (_category.image)
					_elements.dropzone.imagepicker('setImage', _category.image);

			}

			function chill() {
				_category.name = _elements.name.val();
				_category.description = _elements.description.val();
			
				_category.available = (_elements.available.val() == 'on') ? 1 : 0;
			
				_category.limit_time = (_elements.limit_time.val() == 'on') ? 1 : 0;
				_category.limit_from = _elements.limit_from.mobiscroll('getDate');
				_category.limit_to = _elements.limit_to.mobiscroll('getDate');
			
				_category.image = _elements.dropzone.imagepicker('getImage');
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
				
				_elements.available.on('change', function(event) {
					enableDisable();
				});
				
				_elements.limit_time.on('change', function(event) {
					enableDisable();
				});

				_elements.limit_from.on('change', function(event) {
					enableDisable();
				});

				_elements.limit_to.on('change', function(event) {
					enableDisable();
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
				
				_elements.limit_from.mobiscroll().time({	
						SetText: false,
						cancelText: false,
						headerText: false,
				});

				_elements.limit_to.mobiscroll().time({	
						SetText: false,
						cancelText: false,
						headerText: false,
				});

				fill();

				enableDisable();
				
			}
		}

		return Module;


	});


})();
