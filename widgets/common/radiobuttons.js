
(function() {

	var dependencies = [
	];
/*
<div class="ui-controlgroup-controls ">
    <div class="ui-radio">
        <label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-off ui-first-child">24/7</label>
    </div>

    <div class="ui-radio">
        <label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on">24/7</label>
    </div>


    <div class="ui-radio">
        <label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-off ui-last-child">Enstaka tillfällen</label>
    </div>

</div>
*/

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
                	var button = $('<div class="ui-radio"></div>');
					var label  = $('<label class="ui-btn ui-corner-all ui-btn-inherit"></label>');
					
					if (option.attr('value') == undefined)
						option.attr('value', index);

					label.addClass(horizontal ? '' : 'ui-btn-icon-left');
					label.addClass(value == option.attr('value') ? 'ui-radio-on': 'ui-radio-off');
					label.text($(this).text());

					if (index == 0)
						label.addClass('ui-first-child');

					if (index == options.length - 1)
						label.addClass('ui-last-child');
					
					button.on('tap', function() {
						var buttons = _element.find('label');
						
						buttons.removeClass('ui-radio-on'); 
						buttons.removeClass('ui-btn-active'); 
						buttons.addClass('ui-radio-off');
						 
						label.addClass('ui-radio-on').removeClass('ui-radio-off');
						
						if (horizontal)
							label.addClass('ui-btn-active');
						
						_element.val(option.attr('value'));
						_element.trigger('change');
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
				
			$.widget("mobile.radiobuttons", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=radiobuttons)", event.target).radiobuttons();
			});
		}

		defineWidget();
	});

})();


