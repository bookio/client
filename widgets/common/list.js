
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

			function update(row) {
				var item = row.data('item');
				
				row.empty();

				var link = $('<a></a>').appendTo(row).addClass('ui-btn ui-corner-all');

				if (item.style == 'disclosure') {
					link.addClass('ui-btn-icon-right ui-icon-carat-r');
				}

				if (item.style == 'unchecked') {
					link.addClass('ui-btn-icon-left');
				}

				if (item.style == 'checked') {
					link.addClass('ui-btn-icon-left ui-icon-check');
				}
				
				if ($.isFunction(item.select)) {
					link.on('tap', function(event) {
						item.select.call(item, item); //_elements.container.trigger('click', item);
					});
					
				}
				
				if (item.image != undefined) {
					row.addClass('ui-li-has-thumb');
					$('<img class="ui-li-thumb ui-li-icon">').appendTo(link).attr('src', item.image);
				}

				if (item.title != undefined)
					$('<h2 class="title"></h2>').appendTo(link).text(item.title);
					
				if (item.subtitle != undefined)
					$('<p class="subtitle"></p>').appendTo(link).text(item.subtitle);
				
			}
			
			self.refresh = function() {
				var rows = _elements.list.find('li');

				rows.removeClass('ui-first-child ui-last-child');

				rows.each(function(index) {
					update($(this));
				});			
				
				$(rows[0]).addClass('ui-first-child');
				$(rows[rows.length - 1]).addClass('ui-last-child');

			}

			self.reset = function() {
				_elements.list.empty();
			}

			self.remove = function(index) {
					
			}

			self.add = function(item) {
				var line = $('<li></li>').appendTo(_elements.list).data('item', item);		
				return;		
				var link  = $('<a></a>').appendTo(line).addClass('ui-btn ui-corner-all');

				if (item.style == 'disclosure') {
					link.addClass('ui-btn-icon-right ui-icon-carat-r');
				}

				if (item.style == 'unchecked') {
					link.addClass('ui-btn-icon-left');
				}

				if (item.style == 'checked') {
					link.addClass('ui-btn-icon-left ui-icon-check');
				}
				
				if ($.isFunction(item.select)) {
					link.on('tap', function(event) {
						item.select.call(item, item); //_elements.container.trigger('click', item);
					});
					
				}
				
				if (item.title != undefined)
					$('<h2 class="title"></h2>').appendTo(link).text(item.title);
					
				if (item.subtitle != undefined)
					$('<p class="subtitle"></p>').appendTo(link).text(item.subtitle);
				
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
			
			widget.reset = function() {
				this.widget.reset();
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


