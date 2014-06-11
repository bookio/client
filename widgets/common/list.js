
(function() {

	var dependencies = [
		'css!./list.css'
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
				
				_elements.list = $('<ul></ul>').appendTo(_elements.container).addClass('ui-listview ui-corner-all ui-shadow');
				
				if (_elements.container.attr('data-inset') == "true") {
					_elements.list.addClass('ui-listview-inset');	
				}

				self.reset();
	        };

			
			self.refresh = function() {
				var rows = _elements.list.find('li');
				rows.removeClass('ui-first-child ui-last-child');

				
				$(rows[0]).addClass('ui-first-child');
				$(rows[rows.length - 1]).addClass('ui-last-child');

			}

			self.items = function() {
				return _items;
				
			}
			
			self.reset = function() {
				_elements.list.empty();
				_items = [];
			}

			self.remove = function(index) {
					
			}

			var ListItem = function(options) {
			
				var self = this;
				
				var _elements = {};
				
				function hasStyle(style) {
					return options[style] == undefined ? false : options[style];
				}
				
				function init() {
					self.element = _elements.container = $('<li></li>');
					
					_elements.link = $('<a></a>').appendTo(_elements.container).addClass('ui-btn ui-corner-all');
					

					_elements.link.on('tap', function(event) {
						//_elements.container.trigger('selected', self);
					});

					
					if (hasStyle('icon-right')) {
						_elements.link.addClass('ui-btn-icon-right');
					}
					else if (hasStyle('icon-left')) {
						_elements.link.addClass('ui-btn-icon-left');
					}

					if (hasStyle('image')) {
						_elements.container.addClass('ui-li-has-thumb');
						_elements.image = $('<img class="ui-li-thumb ui-li-icon">').appendTo(_elements.link);
					}

					_elements.title = $('<h2 class="title"></h2>').appendTo(_elements.link);
						
					if (hasStyle('subtitle')) {
						_elements.subtitle = $('<p class="subtitle"></p>').appendTo(_elements.link);
						
					}
				}
				
				self.icon = function(icon) {
					if (arguments.length == 0)
						return _elements.link.attr('data-icon');
						
					
					_elements.link.removeClassMatching('ui-icon-*').addClass(sprintf('ui-icon-%s', icon)).attr('data-icon', icon);
					
					return this;
					
				}

				self.image = function(image) {
					if (arguments.length == 0)
						return _elements.image != undefined ? _elements.image.attr('src') : '';
						
					if (_elements.image != undefined) {
						_elements.image.attr('src', image);
					}
					
					return this;
				}
				
				self.title = function(text) {

					if (arguments.length == 0)
						return _elements.title != undefined ? _elements.title.text(text) : '';
						  					
					if (_elements.title != undefined) {	
						_elements.title.text(text);
					}
					
					return this;
					
				}

				self.subtitle = function(text) {
					if (arguments.length == 0)
						return _elements.subtitle != undefined ? _elements.subtitle.text(text) : '';
						
					if (_elements.subtitle != undefined) {
						_elements.subtitle.text(text);
					}
					
					return this;
				}
				
				
				init();
					
			}
			
			self.add = function(options) {

				var attrs = {};
				
				$.each(options.split(' '), function(index, item) {
					attrs[item] = true;
				});

				var item = new ListItem(attrs);

				_items.push(item);		
				item.element.data('item', item);
				_elements.list.append(item.element);
				
				return item;
			}
	
	        init();
	
	    };


		(function() {
			var widget = {};
	
			widget.options = {
			};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
			
			widget.refresh = function() {
				this.widget.refresh();
			}

			widget.add = function() {
				return this.widget.add.apply(undefined, arguments);
			}

			widget.items = function() {
				return this.widget.items.apply(undefined, arguments);
			}
			
			widget.reset = function() {
				return this.widget.reset.apply(undefined, arguments);
			}
			
			widget.remove = function(index) {
				
			}
	
			widget.api = function(callback) {
				if ($.isFunction(callback))
					return callback.call(this.widget, this.widget);
				else
					return this.widget;
			}
				
			$.widget("mobile.list", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(event) {
				$(":jqmData(role=list)", event.target).list();
			});
			
		})();		


	});

})();


