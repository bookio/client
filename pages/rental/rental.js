(function() {

	var dependencies = [
		'i18n!./rental.json',
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/deletebutton/deletebutton.js',
		'../../widgets/imagepicker/imagepicker'
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

			_element.i18n(i18n);
			_element.trigger('create');
			_element.hookup(_elements, 'data-id');

			// Alternative help and header texts
			var strHelpThingName = 'Court 3, Room 100, Segway A, Bouncy Castle XL, Hyundai Accent 6JIV337, The Rose Cottage';
			var strHelpHumanName = 'Jane, Joe, Max, Therapist 1, Dentist A';
			var strHelpEventName = 'Wine Tasting, Seminar, Great Falls Round Trip, Boating Safety Course';
			var strHelpServices = 'Select the services offered by this resource (or add a new).';
			var strHelpOptions = _elements.optionshelp.text(); // This text is temporarly changed to the text above, so we save it from the HTML-file
			var strHeaderServices = 'Services';
			var strHeaderOptions = _elements.optionsheader.text(); // This text is temporarly changed to the text above, so we save it from the HTML-file
			
			var strHeaderSetLocation = _elements.setlocation.text();


			function fill() {
				_elements.name.val(_rental.name);
				_elements.description.val(_rental.description);

				// Set location button to name of location
				if (_rental.location != undefined && _rental.location != "")
					_elements.setlocation.text(_rental.location);

				if (_rental.style == 'thing') {
					_elements.thing.addClass('activestate');
				}
				else if (_rental.style == 'human') {
					_elements.human.addClass('activestate');
					_elements.section.human.show("fast");
				} 
				else if (_rental.style == 'event') {
					_elements.event.addClass('activestate');
					_elements.section.event.show("fast");
				}
				else {
					// default to 'thing'
					_elements.thing.addClass('activestate');
					_rental.style = 'thing';
				}

				_elements.icon.image.attr('src', sprintf('../../images/symbols/%04d.svg', _rental && _rental.icon_id ? _rental.icon_id : 0));
				
				if (_rental.image)
					_elements.dropzone.imagepicker('setImage', _rental.image);			
					
				_elements.available.prop('checked', _rental.available).checkboxradio('refresh');
				
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
							enableDisable();
	                    });
						
					});
					
					
					with (_elements.options.list('add', 'title icon-left')) {
						title(i18n.text('add', 'Add'));
						icon("plus");
						
						element.on('tap', function() {
		                     
		                    var request = $.mobile.pages.push('../option/option.html');

		                    request.done(function(option) {

		                    	if (option != null) {
									_rental.option_ids.push(option.id);
								}
			                    
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

					function selectCategory(oldID, newID) {
						
						_rental.category_id = newID;
						
						$.each(_elements.categories.list('items'), function(index, item) {

							var category = item.element.data('category');
							
							if (category != undefined) {
								if (oldID != newID)
									item.icon(category.id == newID ? 'check' : '');
								else {
									// Allow unchecking a category 
									item.icon('');
									_rental.category_id = null;
								}
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
							selectCategory(_rental.category_id, $(this).data('category').id);
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
			
			function enableDisable() {				
				// To enable Save, a name must be given and at least one option has to be checked
				((_elements.name.val().length == 0 || _rental.option_ids.length == 0) ? _elements.save.addClass('ui-disabled') : _elements.save.removeClass('ui-disabled'));

				if (_rental.option_ids.length == 0) {
					_elements.warning.removeClass("hidden");
					_elements.warningtab.removeClass("hidden");					
				}
				else {
					_elements.warning.addClass("hidden");
					_elements.warningtab.addClass("hidden");					
				}				
								
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

				if (_rental.option_ids == null || _rental.option_ids == undefined)
					_rental.option_ids = [];

				// Make sure _rental exists, even if not saved yet
				if (_rental.category_id == undefined)
					_rental.category_id = null;

				// Set to generic 'cube' if no icon chosen
				if (!_rental.icon_id)
					_rental.icon_id = 0;
					
				if (!_rental.id)
					_elements.remove.addClass('hidden');					

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.setlocation.on('tap', function() {
					var params  = {
							lat: _rental.latitude,
							lon: _rental.longitude,
							location: _rental.location
						};

					var locationPickerCall = $.mobile.pages.push('../locationpicker/locationpicker.html', {
						transition: 'flip',
						params: params
					});

					locationPickerCall.done(function(params) {	
						if (params.location == "")
							_elements.setlocation.text(strHeaderSetLocation);
						else
							_elements.setlocation.text(_rental.location);
						
						_rental.latitude = params.lat;
						_rental.longitude = params.lon;
						_rental.location = params.location;
					});

				});
				
				$.mobile.pages.ready
				
				_elements.name.attr('placeholder', i18n.text('name-help-thing', strHelpThingName));

				_elements.name.on('keyup', function(event, ui) {
					enableDisable();
				});

				_elements.name.on('change', function(event, ui) {
					_rental.name = $(this).val();
				});

				_elements.description.on('change', function(event, ui) {
					_rental.description = $(this).val();
				});

				_elements.seats.on('change', function(event, ui) {
					_rental.seats = $(this).val();
				});
				
				_elements.alertText.on('change', function(event, ui) {
					_elements.alertTextInput.focus();
				});

				_elements.alertEmail.on('change', function(event, ui) {
					_elements.alertEmailInput.focus();
				});

				_elements.thing.on('tap', function(event, ui) {
					_rental.style = 'thing';
					_elements.section.human.hide("fast");
					_elements.section.event.hide("fast");					
					_elements.name.attr('placeholder', i18n.text('name-help-thing', strHelpThingName));
					_elements.optionsheader.text(i18n.text('options', strHeaderOptions));
					_elements.optionshelp.text(i18n.text('help-options', strHelpOptions));
					$(".bigradiobutton").removeClass('activestate');
					$(this).addClass('activestate');
					_elements.name.focus();
				});

				_elements.human.on('tap', function(event, ui) {
					_rental.style = 'human';
					_elements.section.human.show("fast");
					_elements.section.event.hide("fast");					
					_elements.name.attr('placeholder', i18n.text('name-help-human', strHelpHumanName));
					_elements.optionsheader.text(i18n.text('services', strHeaderServices));
					_elements.optionshelp.text(i18n.text('help-services', strHelpServices));
					$(".bigradiobutton").removeClass('activestate');
					$(this).addClass('activestate');					
					_elements.name.focus();
				});

				_elements.event.on('tap', function(event, ui) {
					_rental.style = 'event';
					_elements.section.event.show("fast");
					_elements.section.human.hide("fast");
					_elements.name.attr('placeholder', i18n.text('name-help-event', strHelpEventName));					
					_elements.optionsheader.text(i18n.text('options', strHeaderOptions));
					_elements.optionshelp.text(i18n.text('help-options', strHelpOptions));
					$(".bigradiobutton").removeClass('activestate');
					$(this).addClass('activestate');					
					_elements.name.focus();
				});
								
				_elements.dropzone.on('imagechanged', function(event, ui) {				
					_rental.image = _elements.dropzone.imagepicker('getImage');
				});
				
				_elements.available.on('change', function(event, ui) {
					_rental.available = _elements.available.is(':checked') ? 1 : 0;
				});
				
				_elements.remove.on('delete', function(event) {

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
					
					_elements.name.focus();

				});
				
				_elements.save.on('tap', function(event) {

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
						_elements.icon.image.attr('src', sprintf('../../images/symbols/%04d.svg', _rental.icon_id));
					});

					popup.popup('open');
				});
				
			}
			

			this.refresh = function(callback) {

				$.spin(true);

				$.when(loadIcons(), loadOptions(), loadCategories()).then(function() {
								
					fill();
					callback();
					
					enableDisable();

					$.spin(false);
				});				
				
					
			}
		}
		
		return Module;
	});


})();
