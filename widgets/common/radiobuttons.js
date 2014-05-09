
(function() {

	var dependencies = [
	];


	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self = this;
	        var _element = widget.element;
			var _elements = {};
			var _type = 'radio';

			function refresh() {
				// Remove previous buttons
				_element.find('.ui-controlgroup-controls').remove();
				
	            var options     = _element.find('option');
				var buttons     = $('<div class="ui-controlgroup-controls"></div>');
				var value       = _element.val();
				var horizontal  = _element.hasClass('ui-controlgroup-horizontal');
				var multiselect = _element.attr('data-multiselect') == "true";

				var buttonType   = multiselect ? 'ui-checkbox' : 'ui-radio';
                var buttonOn     = multiselect ? 'ui-checkbox-on' : 'ui-radio-on';
                var buttonOff    = multiselect ? 'ui-checkbox-off' : 'ui-radio-off';
                var buttonActive = 'ui-btn-active';
                
                options.each(function(index) {
					var option = $(this);
                	var button = $('<div></div>');
					var label  = $('<label class="ui-btn ui-corner-all ui-btn-inherit"></label>');
					
					button.addClass(buttonType);
					
					if (option.attr('value') == undefined)
						option.attr('value', index);

					label.addClass(horizontal ? '' : 'ui-btn-icon-left');
					label.addClass(value == option.attr('value') ? buttonOn : buttonOff);
					label.html(option.html());

					if (index == 0)
						label.addClass('ui-first-child');

					if (index == options.length - 1)
						label.addClass('ui-last-child');

					label.appendTo(button);
					
					button.on('tap', function(event) {
						var buttons = _element.find('.ui-btn');
						
						if (!multiselect) {
							buttons.removeClass(buttonOn).addClass(buttonOff); 
							buttons.removeClass(buttonActive); 
							
							label.removeClass(buttonOff).addClass(buttonOn);
						}		
						else {
							if (label.hasClass(buttonOn))
								label.removeClass(buttonOn).addClass(buttonOff);
							else if (label.hasClass(buttonOff))
								label.removeClass(buttonOff).addClass(buttonOn);
							else
								label.addClass(buttonOn);							
						}					 
							
						if (horizontal)
							label.addClass(buttonActive);
						
						_element.val(option.attr('value'));
						_element.trigger('change');
					});

					label.find('a').each(function(index) {
						var link = $(this);
						var href = link.attr('href');
						
						if ($.isString(href)) {
							link.attr('href', '');

							link.on('tap', function(event) {
								_element.trigger(href);
							});						
						}
					});

					
					button.appendTo(buttons);
                });	

                buttons.appendTo(_element);
			}

			self.refresh = function() {
				refresh();
			}
	
	        function init() {
	        
				_element.addClass('ui-controlgroup ui-corner-all');

				if (_element.attr('data-type') == "horizontal")
					_element.addClass('ui-controlgroup-horizontal');
				else
					_element.addClass('ui-controlgroup-vertical');

				if (_element.attr('data-mini') == "true") {
					_element.addClass('ui-mini');
				}

				var options = _element.find('option');

				options.each(function(index) {
					var option = $(this);

					if (option.attr('value') == undefined)
						option.attr('value', index);

					if (option.attr('selected')) {
						_element.val(option.attr('value'));
					}
				});


				// Remove previous buttons
				_element.find('.ui-controlgroup-controls').remove();
				
				refresh();

	        };
	
	        init();
	
	    };


		function defineWidget() {
			var widget = {};
	
			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
			
			widget.refresh = function() {
				this.widget.refresh();
			}
				
			$.widget("mobile.radiobuttons", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=radiobuttons)", event.target).radiobuttons();
			});
		}

		defineWidget();
	});

})();


