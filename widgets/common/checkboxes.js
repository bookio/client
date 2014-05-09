
(function() {

	var dependencies = [
	];


	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self = this;
	        var _element = widget.element;
			var _elements = {};


			function refresh() {
				// Remove previous buttons
				_element.find('.ui-controlgroup-controls').remove();
				
	            var options    = _element.find('option');
				var buttons    = $('<div class="ui-controlgroup-controls"></div>');
				var value      = _element.val();
				var horizontal = _element.hasClass('ui-controlgroup-horizontal');
				
                options.each(function(index) {
					var option = $(this);
                	var button = $('<div class="ui-checkbox"></div>');
					var label  = $('<label class="ui-btn ui-corner-all ui-btn-inherit"></label>');
					
					if (option.attr('value') == undefined)
						option.attr('value', index);

					label.addClass(horizontal ? '' : 'ui-btn-icon-left');
					label.addClass(value == option.attr('value') ? 'ui-checkbox-on': 'ui-checkbox-off');
					label.html($(this).html());

					if (index == 0)
						label.addClass('ui-first-child');

					if (index == options.length - 1)
						label.addClass('ui-last-child');
					
					button.on('tap', function() {
						var buttons = _element.find('label');

						if (label.hasClass('ui-checkbox-on'))
							label.removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
						else if (label.hasClass('ui-checkbox-off'))
							label.removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
						else
							label.addClass('ui-checkbox-on');
						
						/*
						buttons.removeClass('ui-checkbox-on'); 
						buttons.removeClass('ui-btn-active'); 
						buttons.addClass('ui-checkbox-off');
						 
						label.addClass('ui-checkbox-on').removeClass('ui-checkbox-off');

						*/
						if (horizontal)
							label.addClass('ui-btn-active');
						
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
					
					button.append(label);
					buttons.append(button);
                });	

                _element.append(buttons);
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
				
			$.widget("mobile.checkboxes", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=checkboxes)", event.target).checkboxes();
			});
		}

		defineWidget();
	});

})();


