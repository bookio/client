(function() {

	var dependencies = [
		'text!./picker.html',
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

				_elements.span.text('');

                options.each(function(index) {
					if (val == $(this).val()) {
						_elements.span.text($(this).text());
						return false;
					}
                });
			}
	
	        function init() {
	
				_element.addClass('ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow');
	            _element.append($(template));
	            
				_element.hookup(_elements, 'data-id');
                

				_element.on('tap', function(event) {

	                var options = _element.find('option');
		                
	                var popup = $('<div data-role="popup" class="picker"></div>').popup({
	                    dismissible: true,
	                    theme: "a",
	                    transition: "pop",
	                    positionTo: _elements.span
	                });

					var listview = $('<ul data-role="listview" data-inset="true"></div>').appendTo(popup);
					
	                popup.on("popupafterclose", function () {
	                    $(this).remove();
	                });

					var activeItem = null;
					
	                options.each(function(index) {
		                var li = $('<li></li>');
		                var div = $('<div class="ui-btn-icon-right"></div>') 
		                
		                div.text($(this).text());
						li.data('option', $(this));
						
		                li.append(div);

						if (_element.val() == $(this).val()) {
							div.addClass('ui-icon-check');
						}
						else {
							div.addClass('ui-nodisc-icon');
						}

						// Switch to other theme on hover
		                li.on('vmouseover', function(){
							li.addClass('ui-body-b');
							li.removeClass('ui-body-inherit');
		                });

						// Restore after hover
		                li.on('vmouseout', function(){
							li.removeClass('ui-body-b');
							li.addClass('ui-body-inherit');
		                });

						// Select on click
		                li.on('tap', function() {
		                	var option = $(this).data('option');
			                _element.val(option.val());
			                _element.trigger('change', option.val());
			                
							listview.find('div').removeClass('ui-icon-check');
							$(this).find('div').addClass('ui-icon-check');
							
							_elements.span.text(option.text());
			                popup.popup('close');
		                });
		                
		                listview.append(li);
	                });
	                
	                listview.listview();


					popup.popup('open');
					
					console.log(_element.val());
				});
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
				
			$.widget("mobile.picker", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=picker)", event.target).picker();
			});
		}

		defineWidget();
	});


})();




(function() {

	var dependencies = [
		'text!./switch.html',
		'css!./switch'
	];

	define(dependencies, function(template) {

	    var Widget = function(widget) {

	        var self = this;
	        var _element = widget.element;
			var _elements = {};

			
	        function init() {
	
				_element.addClass('ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow');
	            _element.append($(template));
	            
				_element.hookup(_elements, 'data-id');
                

				_element.on('tap', function(event) {

	                var options = _element.find('option');
		                
	                var popup = $('<div data-role="popup" class="picker"></div>').popup({
	                    dismissible: true,
	                    theme: "a",
	                    transition: "pop",
	                    positionTo: _element
	                });

					var listview = $('<ul data-role="listview" data-inset="true"></div>').appendTo(popup);
					
	                popup.on("popupafterclose", function () {
	                    $(this).remove();
	                });
	

	                options.each(function(index) {
		                var li = $('<li></li>');
		                var div = $('<div></div>') 
		                
		                div.text($(this).text());

		                li.append(div);
		                if (index % 2)
			                li.attr('data-theme', 'a');
		                
		                div.on('tap', function(){
			                _elements.span.text($(this).text());
			                popup.popup('close');
		                });
		                
		                listview.append(li);
	                });
	                
	                listview.listview();
					popup.popup('open');
				});
	        };
	
	        init();
	
	    };


		function defineWidget() {
			var widget = {};
	
			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}

	
			$.widget("mobile.switch", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=switch)", event.target).picker();
			});
		}

		defineWidget();
	});


})();
