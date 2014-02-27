(function() {

	var dependencies = [
		'text!./symbolpicker.html',
		'i18n!./symbolpicker.json',
		'css!./symbolpicker'
	];

	define(dependencies, function(html, i18n) {

		var _tags = [];

		var Widget = function(widget) {

			var self = this;

			function init() {
				widget.element.append($(html));
				
				var controls = widget.element.find('[data-role="controlgroup"]');
				 
				// Add the 'all' button
				if (true) {
					var button = $('<button type="button" data-filter="*" data-theme="a" class="ui-btn-active"></button>');
					button.text(i18n.text('All', 'All'));
					controls.append(button);
				}
				 
				// Add all the tags				 
				$.each(_tags, function(i, tag) {
					var button = $('<button type="button" data-theme="a"></button>');
					var text = i18n.text(tag, tag);
					button.attr('data-filter', sprintf('.%s', tag));
					button.text(text);
					
					controls.append(button);
				});
				
				var buttons = widget.element.find('button');
				
				buttons.click(function() {
					buttons.removeClass('ui-btn-active');
					$(this).addClass('ui-btn-active');
					widget.element.find('.container').isotope({
						filter: $(this).attr('data-filter')
					});
				});
				

				var isotope = widget.element.find('.container');

				// Fill container with symbols
				for (var i = 0; i < widget.options.symbols.length; i++) {
					var icon = widget.options.symbols[i];
					var div = $('<div class="symbol ' + icon.tag + '"></div>').appendTo(isotope);
					var image = sprintf('../../images/symbols/%s', icon.image);
					var img = $('<img/>').attr('src', image).appendTo(div);


					img.data('symbol', icon);

					if (widget.options.selection && widget.options.selection.id == icon.id) {
						img.addClass('selected');
					}

					img.on('tap', function(event) {
						isotope.find('img').removeClass('selected');
						$(this).addClass('selected');
						widget.element.trigger('symbolselected', $(this).data('symbol'));
					});

				}
				widget.element.trigger('create');
			}
			
			this.filter = function(value) {
				var isotope = widget.element.find('.container');
				isotope.isotope({
					filter: value
				});
				
			}
			
			init();

		};

			// Define the widget
			var widget = {};
	
			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
	
			widget.symbols = function(value) {
				this.widget.symbols(value);
			}
	
			widget.filter = function(value) {
				this.widget.filter(value);
			}
	
	
			$.widget("mobile.symbolpicker", $.mobile.widget, widget);
	
			// taking into account of the component when creating the window
			// or at the create event
			$(document).bind("pagecreate create", function(e) {
				$(":jqmData(role=symbolpicker)", e.target).symbolpicker();
			});

		// Load the icon tags
		var request = Model.Icons.fetch();
		
		request.done(function(icons) {
		
			var map = {};
			
			$.each(icons, function(index, icon) {
				if (icon.tag != '')	
					map[icon.tag] = icon.tag;	
			});

			_tags = Object.keys(map);

		});


	});


})();
