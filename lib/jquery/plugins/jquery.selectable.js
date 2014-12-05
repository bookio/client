(function($) {

	$.fn.selectable = function(config) {

		var container = $(this);

		// Set up defaults
		var options = {};
		options.autoselect         = true;
		options.showMarquee        = true;
		options.selectionMode      = 'paint'; // multiple, single
		options.selectables        = '.selectable';
		options.selectedClass      = 'selected';
		options.trackingClass      = 'tracking';
		options.selectionThreshold = 0.0;
		options.marqueeClass       = undefined;
		options.marqueeOpacity     = 0.05;

		// Triggers
		options.selectionStartEvent  = 'selection-start';
		options.selectionChangeEvent = 'selection-change';
		options.selectionEndEvent    = 'selection-end';

		// Events
		options.mouseMoveEvent = 'mousemove.selectctable';
		options.mouseUpEvent   = 'mouseup.selectctable';
		options.mouseDownEvent = 'mousedown.selectctable';

		// Turn off everything
		container.off(options.mouseDownEvent);

		// Just return if nothing to do
		if (config === false) {
			return this;
		}
				
		if (typeof config == 'object')
			$.extend(options, config);

		// Make sure position is relative
		container.css('position', 'relative');

		// Attach to mousedown event
		container.on(options.mouseDownEvent, mousedown);

		function mousedown(event) {

			var offset      = container.offset();
			var element     = $(document.elementFromPoint(event.pageX, event.pageY));
			var marquee     = undefined;
			var selectables = container.find(options.selectables);
			var selected    = element.hasClass(options.selectedClass);

			// Make sure we clicked on a selectable
			if ($.inArray(element[0], selectables) < 0) {
				return;
			}

			// Turn on mouse move/up
			$(document).on(options.mouseMoveEvent, mousemove);
			$(document).on(options.mouseUpEvent, mouseup);				

			var origin = {};
			origin.left = event.pageX - offset.left;
			origin.top  = event.pageY - offset.top;

			if (options.showMarquee == true) {
				marquee = $('<div></div>');
				marquee.css('position', 'absolute');
				
				if (options.marqueeClass != undefined)
					marquee.attr('class', options.marqueeClass);
				else {
					marquee.css('background', sprintf('rgba(0,0,0,%f)', options.marqueeOpacity));
					marquee.css('border', sprintf('1px solid rgba(0,0,0,%f)', options.marqueeOpacity * 1));
				}
	
				marquee.appendTo(container);
			}

			container.trigger(options.selectionStartEvent);

			// Clear selection if single selection
			if (options.selectionMode == 'single') {
				if (!event.shiftKey) {
					container.find('.' + options.selectedClass).removeClass(options.selectedClass);
				}
			}
			
			// Mouse down means also a mouse move event
			mousemove(event);

			function mousemove(event) {

				var x = event.clientX - offset.left;
				var y = event.clientY - offset.top;

				var selection = {};
				selection.left   = origin.left;
				selection.top    = origin.top;
				selection.width  = x - origin.left;
				selection.height = y - origin.top;

				if (selection.width < 0) {
					selection.width = -selection.width;
					selection.left  = selection.left - selection.width;
				}

				if (selection.height < 0) {
					selection.height = -selection.height;
					selection.top    = selection.top - selection.height;
				}

				selection.right = selection.left + selection.width;
				selection.bottom = selection.top + selection.height;

				var union = undefined;

				selectables.each(function(i) {
					// Function to determine how much rectangles overlap (0 - 1)
					function overlap(rectA, rectB) {
						var dx = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
						var dy = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));
						
						return (dx * dy) / ((rectA.right - rectA.left) * (rectA.bottom - rectA.top));
					}

					var element = $(this);
					var elementOffset = element.offset();

					var rect = {};
					rect.left   = elementOffset.left - offset.left;
					rect.top    = elementOffset.top - offset.top;
					rect.width  = element.width();
					rect.height = element.height();
					rect.right  = rect.left + rect.width;
					rect.bottom = rect.top + rect.height;

					var selected = false;
					
					if (options.showMarquee && options.selectionThreshold > 0)
						selected = overlap(rect, selection) >= options.selectionThreshold;
					else
						selected = !(rect.left > selection.right || rect.right < selection.left || rect.top > selection.bottom || rect.bottom < selection.top);

					element.toggleClass(options.trackingClass, selected);
					
					if (options.selectionThreshold == 0 && element.hasClass(options.trackingClass)) {
						if (union == undefined) {
							union = {};
							union.left   = rect.left;
							union.right  = rect.right;
							union.top    = rect.top;
							union.bottom = rect.bottom;
						}
						else {
							union.left   = Math.min(union.left , rect.left);
							union.right  = Math.max(union.right, rect.right);
							union.top    = Math.min(union.top, rect.top);
							union.bottom = Math.max(union.bottom, rect.bottom);
							
						}
						union.width  = union.right - union.left;
						union.height = union.bottom - union.top;
					}
				});


				if (marquee != undefined) {
					var css = {};

					if (union != undefined) {
						css.left   = union.left;
						css.top    = union.top;
						css.width  = (union.width - 2);
						css.height = (union.height - 2);
						
					}
					else if (options.selectionThreshold > 0) {
						css.left   = selection.left;
						css.top    = selection.top;
						css.width  = (selection.width - 2);
						css.height = (selection.height - 2);
						
					}
					
					css.left   += container.scrollLeft();
					css.top    += container.scrollTop();
					
					css.left   += 'px';
					css.top    += 'px';
					css.width  += 'px';
					css.height += 'px';

					marquee.css(css);
				}


				event.preventDefault();
				event.stopPropagation();

				container.trigger(options.selectionChangeEvent);

			}
			
			function mouseup(event) {
				// Stop listening to mouseup and mousemove events
				$(document).off(options.mouseUpEvent + ' ' + options.mouseMoveEvent);

				var trackables = container.find('.' + options.trackingClass);
				/*
				if (options.selectionMode == 'single') {
					trackables.addClass(options.selectedClass).removeClass(options.trackingClass);
				}
				else if (options.selectionMode == 'multiple') {
					trackables.addClass(options.selectedClass).removeClass(options.trackingClass);
				}
				else if (options.selectionMode == 'paint') {
					 
					if (options.autoselect == true) {
					
						if (selected)
							trackables.removeClass(options.selectedClass);
						else
							trackables.addClass(options.selectedClass);
					}

					trackables.removeClass(options.trackingClass);

				}
				else {
					container.find(options.selectables).removeClass(options.trackingClass);

				}
				*/

				// Remove the marquee (if any)				
				if (marquee != undefined)
					marquee.remove();

				trackables.removeClass(options.trackingClass);
				
				container.trigger(options.selectionEndEvent, [trackables]);
			}
		}
		
		return this;
	}
})(jQuery);
