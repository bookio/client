(function ($) { 

	$.fn.selectable = function(config) {
	
		var container = $(this);

		// Set up defaults
		var options = {};
		options.autoselect             = true;
		options.showMarquee            = true;
		options.selectables            = '.selectable';
		options.selectionMode          = 'paint'; // multiple, single
		options.marqueeClass           = 'marquee';
		options.selectingClass         = 'selecting';
		options.selectedClass          = 'selected';
		options.selectingClassSelector = '.' + options.selectingClass;
		
		// Triggers
		options.selectionStartEvent    = 'selection-start';
		options.selectionChangeEvent   = 'selection-change';
		options.selectionEndEvent      = 'selection-end';
		
		// Events
		options.mouseMoveEvent         = 'mousemove.selectctable';
		options.mouseUpEvent           = 'mouseup.selectctable';
		options.mouseDownEvent         = 'mousedown.selectctable';
			
		if (typeof config == 'object')
			$.extend(options, config);
			
		// Make sure position is relative
		container.css('position', 'relative');

	
		container.on(options.mouseDownEvent, function(event) {
		
			var offset      = container.offset();
			var element     = $(document.elementFromPoint(event.pageX, event.pageY));
			var marquee     = undefined;
			var selectables = container.find(options.selectables);
			var selected    = element.hasClass(options.selectedClass);
			
			var origin = {};
			origin.left = event.pageX - offset.left;
			origin.top  = event.pageY - offset.top;

			if (options.showMarquee) {
				marquee = $('<div></div>');
				marquee.attr('class', options.marqueeClass);
				marquee.css('position', 'absolute');
				marquee.css('background-color', 'rgba(0,0,0,0.05)');
				marquee.css('border', '1px solid rgba(0,0,0,0.1)');	
				marquee.appendTo(container);
			}			

			mousemove(event);
			
			container.trigger(options.selectionStartEvent);
	
			
			function mousemove(event) {
				var x = event.pageX - offset.left;
				var y = event.pageY - offset.top;
				
				var selection = {};
				selection.left   = origin.left;
				selection.top    = origin.top;
				selection.width  = x - origin.left;
				selection.height = y - origin.top;
				
				if (selection.width < 0) {
					selection.width = -selection.width;
					selection.left = selection.left - selection.width;  
				}

				if (selection.height < 0) {
					selection.height = -selection.height;
					selection.top = selection.top - selection.height;  
				}

				selection.right = selection.left + selection.width;
				selection.bottom = selection.top + selection.height;
				
				if (marquee != undefined) {
					var css    = {};
					css.left   = selection.left + 'px';
					css.top    = selection.top + 'px';
					css.width  = selection.width + 'px';
					css.height = selection.height + 'px';

					marquee.css(css);
				}
										
				selectables.each(function(i) {
					var element = $(this);
					var elementOffset = element.offset();
					
					var rect     = {};							
					rect.left    = elementOffset.left - offset.left; 
					rect.top     = elementOffset.top - offset.top;
					rect.width   = element.width();
					rect.height  = element.height();
					rect.right   = rect.left + rect.width;
					rect.bottom  = rect.top + rect.height;

					var selected = !(rect.left > selection.right || rect.right < selection.left || rect.top > selection.bottom || rect.bottom < selection.top);

					element.toggleClass(options.selectingClass, selected);
				});


				event.preventDefault();
				event.stopPropagation();
				
				container.trigger(options.selectionChangeEvent);
				
			}
			
			$(document).on(options.mouseMoveEvent, function(event) {
				mousemove(event);
			});
			

			$(document).on(options.mouseUpEvent, function(event) {
				$(this).off(options.mouseUpEvent + ' ' + options.mouseMoveEvent);

				if (options.selectionMode == 'single') {
					container.find(options.selectables).removeClass(options.selectedClass);
					container.find(options.selectingClass).addClass(options.selectedClass);
					
				}
				else if (options.selectionMode == 'multiple') {
					container.find('.' + options.selectingClass).addClass(options.selectedClass).removeClass(options.selectingClass);
				}
				else if (options.selectionMode == 'paint') {
					if (options.autoselect) {
						if (selected)
							container.find(options.selectingClassSelector).removeClass(options.selectedClass).removeClass(options.selectingClass);
						else
							container.find(options.selectingClassSelector).addClass(options.selectedClass).removeClass(options.selectingClass);
					}
					else
						container.find(options.selectingClassSelector).removeClass(options.selectingClass);
					
				}
				else {
					container.find(options.selectables).removeClass(options.selectingClass);
					
				}

				if (marquee != undefined)
					marquee.remove();

				container.trigger(options.selectionEndEvent);

			});

		});	
		
		return this;
	}
})(jQuery);

