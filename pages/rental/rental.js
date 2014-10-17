(function() {



	var dependencies = [
		'i18n!./rental.json',
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/pagelogo/pagelogo.js',
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


				_elements.icon.image.attr('class', sprintf('symbol-%04d', _rental && _rental.icon_id ? _rental.icon_id : 0));
			}

			function chill() {
				_rental.name = _elements.name.val();
				_rental.description = _elements.description.val();

				// Set to generic 'cube' if no icon chosen
				if (!_rental.icon_id)
					_rental.icon_id = 1;


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

		                    //$.mobile.pages.push('../option/option.html', {
		                      //  params: {option: option}
		                    //});					
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

					
					$.each(categories, function(index, category) {

						var item = _elements.categories.list('add', 'title subtitle icon-left');
						item.title(category.name);
						item.subtitle(category.description);
						
						if (_rental.category_ids.indexOf(category.id) >= 0)
							item.icon('check');
							
						item.element.on('tap', function() {

							var index = _rental.category_ids.indexOf(category.id);
							
							if (index >= 0) {
								_rental.category_ids.splice(index, 1);
								item.icon('');
							}
							else {
								_rental.category_ids.push(category.id);
								item.icon('check');
								
							}

	                    });
						
					});
					
					
					with (_elements.categories.list('add', 'title icon-left')) {
						title(i18n.text('add', 'Add'));
						icon("plus");
						
						element.on('tap', function() {
		                    function callback(category) {
			                    // Add the created category to the category id:s array
								_rental.categories_ids.push(category.id);
			                    
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
				_elements.content.find('.tab-header').on('tap', function() {

					var tab = $(this).attr('data-tab');

					_elements.content.find('.tab-container').fadeOut(200, function() {
	
							
							$(this).find('.tab').hide();
							$(this).find(sprintf('.%s', tab)).show();
							
							$(this).fadeIn(200);	
						});				
				});
				
				
				_elements.content.find('.tab-container .tab').hide();
				_elements.content.find('.tab-container .tab-1').show();

				if (page.params && page.params.rental) {
					$.extend(_rental, page.params.rental);
				}

				if (_rental.option_ids == null)
					_rental.option_ids = [];

				if (_rental.category_ids == null)
					_rental.category_ids = [];
					
				if (!_rental.id)
					_elements.remove.addClass('hidden');

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});
				
				_elements.name.attr('placeholder', i18n.text('name-help', 'Court 3, Jenny, Mini Cooper (234 ADE)'));


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
					console.log("PAGESHOW!!!");
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
