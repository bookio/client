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
	
				_element.addClass('ui-btn');
	            _element.append($(template));
	            
				_element.hookup(_elements, 'data-id');

/*
				_elements.slider.on('tap', function() {
				
					var css = {};
					css.left = '25%';
					
					_elements.slider.transition(css, 3000, 'ease-in-out' );
				});                

*/
				_element.trigger('create');
				function toggle() {
					var css = {};

					if (_elements.slider.position().left <= 0) {
						css.left = '50%';
					}
					else {
						css.left = '0%';
					}
					_elements.slider.transition(css, 300, 'ease-in-out' );
				}
				_elements.right.on('tap', function() {
					toggle();				
				});                
				_elements.left.on('tap', function() {
					toggle();				
				});                
				_elements.slider.on('tap', function() {
					toggle();				
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
				$(":jqmData(role=switch)", event.target).switch();
			});
		}

		defineWidget();
	});


})();
