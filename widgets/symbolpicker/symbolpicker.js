

(function() {

	var dependencies = [
		'text!./symbolpicker.html',
		'css!./symbolpicker'
	];

	define(dependencies, function(html) {

		
		var Widget = function(widget) {
		
			var self = this;
	
			function init() {
				
				widget.element.append($(html));
				widget.element.trigger('create');
				
	            widget.element.find('button').click(function() {
	            	widget.element.find('.container').isotope({ filter: $(this).attr('data-filter') });   
				});

	            var isotope = widget.element.find('.container');
	            
	            // Fill container with symbols
	            for (var i = 0; i < widget.options.symbols.length; i++) {
	    			var icon = widget.options.symbols[i];
		        	var div = $('<div class="symbol ' + icon.tags + '"></div>').appendTo(isotope);
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
				            			
				isotope.isotope({filter: '*'});
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


		$.widget("mobile.symbolpicker", $.mobile.widget, widget);

		// taking into account of the component when creating the window
		// or at the create event
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=symbolpicker)", e.target).symbolpicker();
		});


	});


})();



  
