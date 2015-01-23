
(function() {

	var dependencies = [
		'css!./picker'
	];

	define(dependencies, function(template) {

	    var Widget = function(widget) {

	        var self = this;
	        
	        var _element = widget.element;
			var _elements = {};
			var _options = [];

			self.refresh = function() {
				var val = _element.val();	

				_elements.text.text('');

				$.each(_options, function(index, option) {
					if (option.value == val) {
						_elements.text.text(option.text);
						return false;
					}
				});

			}
			
			self.add = function(value, text) {
				_options.push({value: value, text:text});
			}

			self.select = function(value) {
            	
            	$.each(_options, function(index, option) {
 					
	            	if (option.value == value) {
						_element.val(option.value);
						_elements.text.text(option.text);
						return false;						
	            	}	
            	});
			}
	
	        function init() {
				_element.addClass('ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow');
	            _element.append($('<span data-id="text"></span>'));
	            
				if (_element.attr('data-mini') == "true") {
					_element.addClass('ui-mini');
				}	            
				_element.hookup(_elements, 'data-id');

				if (_element.hasClass('ui-mini')) {
					_elements.text.addClass('ui-mini');
				}	            

				var options = _element.find('option');
				var value = _element.val();
				
				options.each(function(index) {
					var option = {};

					option.text = $(this).text();
					option.value = $(this).attr('value') == undefined ? index : $(this).attr('value');
					
					if (value != undefined && value == option.value) {
						_element.val(option.value);
						_elements.text.text(option.text);		
					}
					
					_options.push(option);
				});
				
				// Remove from DOM
				options.remove();
				
				_element.on('tap', function(event) {

	                var popup = $('<div data-role="popup" data-theme="a" data-transition="pop" data-dismissible="true" class="picker ui-controlgroup ui-controlgroup-vertical"></div>').popup({
	                    x:event.pageX,
	                    y:event.pageY
	                });

	                popup.on("popupafterclose", function () {
	                    $(this).remove();
	                });

					var checkboxes = $('<div class="ui-controlgroup-controls"></div>').appendTo(popup);

					if (_element.hasClass('ui-mini')) {
						checkboxes.addClass('ui-mini');
					}	            
					
	                $.each(_options, function(index, option) {

	                	var checkbox = $('<div class="ui-checkbox"></div>').appendTo(checkboxes);
	                	var label = $('<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left"></label>').appendTo(checkbox);

		                if (index == 0)
		                	label.addClass('ui-first-child');

		                if (index == _options.length - 1)
		                	label.addClass('ui-last-child');

						label.addClass(_element.val() == option.value ? 'ui-checkbox-on': 'ui-checkbox-off');
		                label.text(option.text);
		                
						checkbox.data('option', option);

						// Select on click
		                checkbox.on('tap', function() {
							var option = $(this).data('option');
		                	
			                _element.val(option.value);
							_elements.text.text(option.text);
			                _element.trigger('change', option.value);
			                
							checkboxes.find('.ui-btn').removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
							checkbox.find('.ui-btn').removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
							
			                popup.popup('close');
		                });
	                });

					popup.popup('open');
				});
	        };
	
	        init();
	        
	        console.log("Initializing picker...");
	
	    };

		(function() {
		
			var widget = {};
	
			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}

			widget.add = function(value, text) {
				this.widget.add(value, text);
			}
			
			widget.refresh = function() {
				this.widget.refresh();
			}
			
			widget.select = function(value) {
				this.widget.select(value);
			}
				
			$.widget("mobile.picker", $.mobile.widget, widget);

			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=picker)", event.target).picker();
			});

		
		})();

	});


})();
