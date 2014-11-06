(function() {



	var dependencies = [
		'i18n!./rental.json',
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _rental = {};
			var _options = [];
			var _categories = [];
			var _icons = [];
			var _iconsByID = {};

			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			_element.i18n(i18n);

			function fill() {
				_elements.name.val(_rental.name);
				_elements.description.val(_rental.description);

				_elements.thing.removeAttr('checked');
				_elements.human.removeAttr('checked');
				_elements.event.removeAttr('checked');

				if (_rental.style == 'thing') {
					_elements.thing.attr('checked', 'checked');
				}
				else if (_rental.style == 'human') {
					_elements.human.attr('checked', 'checked');
				} 
				else if (_rental.style == 'event') {
					_elements.event.attr('checked', 'checked');
				}
				else {
					// default to 'thing'
					_elements.thing.attr('checked', 'checked');
					_rental.style = 'thing';
				}
				
				_elements.thing.checkboxradio("refresh");
				_elements.event.checkboxradio("refresh");
				_elements.human.checkboxradio("refresh");
				
				_elements.icon.image.attr('class', sprintf('symbol-%04d', _rental && _rental.icon_id ? _rental.icon_id : 0));
			}

			function chill() {
				


			}
			
			function loadOptions() {
				var request = Gopher.request('GET', 'options');

				_elements.options.list('reset');
				
				request.done(function(options) {

					
					$.each(options, function(index, option) {

						var item = _elements.options.list('add', 'title subtitle icon-left');
						item.title(option.name);
						item.subtitle(option.description);
						
						if (_rental.option_ids.indexOf(option.id) >= 0)
							item.icon('check');
							
						item.element.on('tap', function() {

							var index = _rental.option_ids.indexOf(option.id);
							
							if (index >= 0) {
								_rental.option_ids.splice(index, 1);
								item.icon('');
							}
							else {
								_rental.option_ids.push(option.id);
								item.icon('check');
								
							}
	                    });

						
					});
					
					
					with (_elements.options.list('add', 'title icon-left')) {
						title(i18n.text('add', 'Add'));
						icon("plus");
						
						element.on('tap', function() {
		                    function callback(option) {
			                    // Add the created option to the option id:s array
								_rental.option_ids.push(option.id);
			                    
		                    }
		                    $.mobile.pages.push('../option/option.html', {
		                        params: {callback:callback}
		                    });
		                });
		            }
                    
					_elements.options.list('refresh');

				});

				return request;				
			}

			function loadCategories() {
				var request = Gopher.request('GET', 'categories');

				_elements.categories.list('reset');
				
				request.done(function(categories) {


					function selectCategory(id) {
						$.each(_elements.categories.list('items'), function(index, item) {

							var category = item.element.data('category');
							
							if (category != undefined) {
								item.icon(category.id == id ? 'check' : '');
							}
						});
					}					

					$.each(categories, function(index, category) {

						var item = _elements.categories.list('add', 'title subtitle icon-left');
						
						item.title(category.name);
						item.subtitle(category.description);
						item.element.data('category', category);
						
						if (_rental.category_id != undefined && _rental.category_id == category.id)
							item.icon('check');
							
						item.element.on('tap', function() {
							selectCategory(_rental.category_id = $(this).data('category').id);
	                    });
						
					});
					
					
					with (_elements.categories.list('add', 'title icon-left')) {
						title(i18n.text('add', 'Add'));
						icon("plus");
						
						element.on('tap', function() {
		                    function callback(category) {
								selectCategory(_rental.category_id = category.id);
		                    }
		                    $.mobile.pages.push('../category/category.html', {
		                        params: {callback:callback}
		                    });
		                });
		            }
                    
					_elements.categories.list('refresh');

				});

				return request;				
			}


			function loadIcons() {

				var request = Model.Icons.fetch();

				request.done(function(icons) {
					_icons = icons;

					$.each(icons, function(index, icon) {
						_iconsByID[icon.id] = icon;
					});
				});
				
				return request;
			}


			this.init = function() {

				
				_element.trigger('create');

				_elements.options.list();
				_elements.content.find('.tab-header [data-tab]').on('tap', function() {

					var tab = $(this).attr('data-tab');

					_elements.content.find('.tab-container').fadeOut(200, function() {
	
							
							$(this).find('[data-tab]').hide();
							$(this).find(sprintf('[data-tab="%s"]', tab)).show();
							
							$(this).fadeIn(200);	
						});				
				});
				
				
				_elements.content.find('.tab-container [data-tab]').hide();
				_elements.content.find('.tab-container [data-tab]:first').show();
				_elements.content.find('.tab-header [data-tab]:first').addClass('ui-btn-active');

				if (page.params && page.params.rental) {
					$.extend(_rental, page.params.rental);
				}

				if (_rental.option_ids == null)
					_rental.option_ids = [];

				// Set to generic 'cube' if no icon chosen
				if (!_rental.icon_id)
					_rental.icon_id = 0;

					
				if (!_rental.id)
					_elements.remove.addClass('hidden');

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.name.attr('placeholder', i18n.text('name-help', 'Court 3, Jenny, Mini Cooper, Wine Tasting'));


				_elements.name.on('change', function(event, ui) {
					_rental.name = $(this).val();
				});

				_elements.description.on('change', function(event, ui) {
					_rental.description = $(this).val();
				});

				_elements.thing.on('change', function(event, ui) {
					_rental.style = 'thing';
					_elements.section.human.hide("fast");
					_elements.section.event.hide("fast");					
				});

				_elements.human.on('change', function(event, ui) {
					_rental.style = 'human';
					_elements.section.human.show("fast");
					_elements.section.event.hide("fast");					
				});

				_elements.event.on('change', function(event, ui) {
					_rental.style = 'event';
					_elements.section.event.show("fast");
					_elements.section.human.hide("fast");					
				});
				
				_elements.remove.on('tap', function(event) {


					function remove() {
						var request = Model.Rentals.remove(_rental); 

						request.done(function() {
							$.mobile.pages.pop();
						});
					}

					remove();

				});


				_element.on("pageshow", function(event) {
					// Select the appropriate tab
					
					//_element.find('.tab:visible');
					var activeTab = _element.find('.tab-container [data-tab]:visible:first').attr('data-tab');
					_element.find(sprintf('.tab-header [data-tab="%s"]', activeTab)).addClass('ui-btn-active');

				});

				_elements.save.on('tap', function(event) {

					chill();

					if (!_rental.name) {
						Notify.show(i18n.text('specify-name', 'Please enter a name.'));
						return;
					}

					$('body').spin('large');

					var request = Model.Rentals.save(_rental);

					request.always(function() {
						$('body').spin(false);
					});

					request.done(function() {
						$.mobile.pages.pop();
					});

				});



				_elements.icon.button.on('tap', function(event) {

					var popup = $('<div data-role="popup"></div>').popup({
						dismissible: true,
						transition: "pop",
						positionTo: $(this)
					});

					var options = {};

					options.symbols = _icons;

					if (_rental.icon_id && _iconsByID[_rental.icon_id])
						options.selection = _iconsByID[_rental.icon_id];

					var symbolpicker = $('<div data-role="symbolpicker"></div>').appendTo(popup).symbolpicker(options);

					popup.on("popupafterclose", function() {
						$(this).remove();
					});

					popup.on('popupbeforeposition', function() {
						symbolpicker.symbolpicker('filter', '*');
					});

					symbolpicker.on("symbolselected", function(event, icon) {
						popup.popup('close');
						_rental.icon_id = icon.id;
						_elements.icon.image.attr('class', sprintf('symbol-%04d', _rental.icon_id));
					});

					popup.popup('open');
				});

			}
			

			this.refresh = function(callback) {

				$.spin(true);

				$.when(loadIcons(), loadOptions(), loadCategories()).then(function() {
				
					fill();
					callback();

					$.spin(false);
				});				
				
					
			}
		}
		
		return Module;
	});


})();
