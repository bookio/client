(function() {

	var dependencies = [
		'i18n!./option.json',
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/picker/picker.js',
		'../../widgets/deletebutton/deletebutton.js',		
		'../../widgets/imagepicker/imagepicker'
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
				if (_option.image)
					_elements.dropzone.imagepicker('setImage', _option.image);	
				loadResources();			
			}

			function chill() {
				_option.name = _elements.name.val();
				_option.description = _elements.description.val();
				_option.image = _elements.dropzone.imagepicker('getImage');
			}
			
			function enableDisable() {								
				if (_elements.name.val().length == 0) {
					_elements.save.addClass('ui-disabled');
					_elements.rentals.addClass('ui-disabled');					
				}
				else {
					_elements.save.removeClass('ui-disabled');
					_elements.rentals.removeClass('ui-disabled');
				}
			}
			
			function loadResources() {
				var request = Gopher.request('GET', 'rentals');

				_elements.rentals.list('reset');
				
				request.done(function(rentals) {
					
					$.each(rentals, function(index, rental) {
						var item = _elements.rentals.list('add', 'title subtitle icon-left');
						item.title(rental.name);
						item.subtitle(rental.description);

						if ($.inArray(_option.id, rental.option_ids) != -1)
							item.icon('check');
							
						item.element.on('tap', function() {
							
							if (_option.id == null) {
								var request = saveOption();			
										
								request.done(function(option) {
								});
								
							}

							var index = rental.option_ids.indexOf(_option.id);
							
							if (index >= 0) {
								rental.option_ids.splice(index, 1);
								item.icon('');
							}
							else {
								rental.option_ids.push(_option.id);
								item.icon('check');
							}
							
							$('body').spin('large');
		
							var request = Model.Rentals.save(rental);
		
							request.always(function() {
								$('body').spin(false);
							});							
							
	                    });
						
					});
										
					_elements.rentals.list('refresh');

				});

				return request;				
			}
			
			function saveOption() {				
				$.spin(true);
				
				chill();

				var request = Model.Options.save(_option);

				request.always(function() {
					$.spin(false);
				});
				
				return request;
				
			}

			this.init = function() {

								
				if (page.params && page.params.option) {
					$.extend(_option, page.params.option);
				}
				
				
				if (!_option.id)
					_elements.remove.addClass('hidden');

				if (!_option.schedules)
					_option.schedules = [];
					
				_elements.content.find('.tab-header [data-tab]').on('tap', function() {

					var tab = $(this).attr('data-tab');

					_elements.content.find('.tab-container').fadeOut(200, function() {								
						$(this).find('[data-tab]').hide();
						$(this).find(sprintf('[data-tab="%s"]', tab)).show();
						
						$(this).fadeIn(200);	
					});
					
					// Set help text
					if (_option.id == null)
						_elements.help.text(i18n.text('help-resources-noname', 'The option (or service) must have a name.'));					
					else
						_elements.help.text(i18n.text('help-resources', 'Select resources that offers') + " '" + _elements.name.val() + "'");
															
				});
											
				_elements.content.find('.tab-container [data-tab]').hide();
				_elements.content.find('.tab-container [data-tab]:first').show();
				_elements.content.find('.tab-header [data-tab]:first').addClass('ui-btn-active');
					
					
				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop(null);
				});
				
				_elements.schedule.on('tap', function(event) {
					var request = $.mobile.pages.push('../schedule/schedule.html', {
						params: {option:_option}
					});
					
					request.done(function(option) {

						//_option = option;
						console.log(_option);
					});
				});
				
				_elements.remove.on('delete', function(event) {

					function remove() {
						var request = Model.Options.remove(_option);

						request.always(function() {
							$.mobile.pages.pop(null);
						});
					}
					
					remove();

				});
				
				_elements.name.on('keyup', function(event, ui) {
					enableDisable();
				});
				
				_element.on("pageshow", function(event) {
					// Select the appropriate tab
					var activeTab = _element.find('.tab-container [data-tab]:visible:first').attr('data-tab');
					_element.find(sprintf('.tab-header [data-tab="%s"]', activeTab)).addClass('ui-btn-active');
					
					_elements.name.focus();
				});								
				
				_elements.save.on('tap', function(event) {
					var request = saveOption();			
							
					request.done(function(option) {
						if ($.isFunction(page.params.callback)) {
							page.params.callback(option);
						}
						$.mobile.pages.pop(option);
					});

				});

				fill();				
								
				enableDisable();

			}
			

		}
		
		return Module;
	});


})();
