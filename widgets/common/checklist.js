
(function() {

	var dependencies = [
		'css!./checklist.css'
	];


	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self = this;
			var _elements = {};
			var _items = [];
			
	        function init() {

				_elements.container = widget.element;

				if (_elements.container.attr('data-mini') == "true") {
					_elements.container.addClass('ui-mini');
				}

				if (_elements.container.attr('data-iconpos') == undefined) {
					_elements.container.attr('data-iconpos', 'left');
				}
				
				_elements.list = $('<ul></ul>').appendTo(_elements.container).addClass('ui-listview ui-listview-inset ui-corner-all ui-shadow');

				self.reset();
	        };

			self.refresh = function() {
				var items = _elements.list.find('li');
				
				items.removeClass('ui-first-child ui-last-child');
				
				$(items[0]).addClass('ui-first-child');
				$(items[items.length - 1]).addClass('ui-last-child');

			}

			self.reset = function() {
				_elements.list.empty();
			}

			self.remove = function(index) {
					
			}

			self.add = function(item) {
				var line = $('<li></li>').appendTo(_elements.list).data('item', item);				
				var link  = $('<a></a>').appendTo(line).addClass('ui-btn ui-corner-all ui-btn-icon-left');

				if (item.icon != undefined) {
					link.addClass(sprintf('ui-icon-%s', item.icon));
				}
				
				link.on('tap', function(event) {
					_elements.container.trigger('click', item);
				});
				
				if (item.title != undefined)
					$('<h2 class="title"></h2>').appendTo(link).text(item.title);
					
				if (item.description != undefined)
					$('<p class="description"></p>').appendTo(link).text(item.description);
				
			}
	
	        init();
	
	    };


		(function() {
			var widget = {};
	
			widget.options = {
				iconpos:'left'
			};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
			
			widget.refresh = function() {
				this.widget.refresh();
			}

			widget.add = function() {
				this.widget.add.apply(undefined, arguments);
			}
			
			widget.remove = function(index) {
				
			}
	
			widget.api = function(callback) {
				if ($.isFunction(callback))
					return callback.call(this.widget, this.widget);
				else
					return this.widget;
			}
				
			$.widget("mobile.checklist", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=checklist)", event.target).checklist();
			});
			
		})();		


	});

})();


