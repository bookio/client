
(function() {

	var dependencies = [
		'css!./picker'
	];

	define(dependencies, function(template) {

	    var Widget = function(widget) {

	        var self = this;
	        var _element = widget.element;
			var _elements = {};

			self.refresh = function() {
				var val = _element.val();	
	            var options = _element.find('option');

				_elements.text.text('');

                options.each(function(index) {
					if (val == $(this).val()) {
						_elements.span.text($(this).text());
						return false;
					}
                });
			}
			
			self.select = function(value) {
            	var options = _element.find('option');
            	
            	options.each(function(index) {
 					
 					var option = $(this);
					
	            	if (option.attr('value') == value) {
					
						_element.val(value);
						_elements.text.text(option.text());						

						options.removeAttr('selected');
		            	option.attr('selected', true);
		            	
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

				options.each(function(index) {
					var option = $(this);

					if (option.attr('value') == undefined)
						option.attr('value', index);

					if (option.attr('selected')) {
						_element.val(option.attr('value'));
						_elements.text.text(option.text());		
					}
				});
 

				_element.on('tap', function(event) {
	                var options = _element.find('option');
		                
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
					
	                options.each(function(index) {

	                	var option = $(this);
	                	var checkbox = $('<div class="ui-checkbox"></div>').appendTo(checkboxes);
	                	var label = $('<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left"></label>').appendTo(checkbox);

						if (option.attr('value') == undefined)
							option.attr('value', index);
		                
		                if (index == 0)
		                	label.addClass('ui-first-child');

		                if (index == options.length - 1)
		                	label.addClass('ui-last-child');

						label.addClass(_element.val() == option.attr('value') ? 'ui-checkbox-on': 'ui-checkbox-off');
		                label.text(option.text());
		                
						checkbox.data('option', $(this));

						// Select on click
		                checkbox.on('tap', function() {
							var options = _element.find('option');
							var option  = $(this).data('option');
		                	var value   = option.attr('value');
		                	
			                _element.val(value);
			                _element.trigger('change', value);
							_elements.text.text(option.text());
			                
							options.removeAttr('selected');
			            	option.attr('selected', true);
			                
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
