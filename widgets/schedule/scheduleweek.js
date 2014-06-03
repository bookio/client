
(function() {

	var dependencies = [
		'text!./scheduleweek.html',
		'css!./scheduleweek.css',
    	'../../lib/jquery/plugins/jquery.selectable.js'		
	];

	define(dependencies, function(html) {

	    var Widget = function(widget) {

	        var self         = this;
			var _elements    = {};
			var _container   = widget.element;
			var _weekdays    = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
			var _tags        = ['A', 'B', 'C', 'D'];

			_elements.container = widget.element;
			
			self.refresh = function() {
			}
	

			function activeTag(tag) {
				if (arguments.length >= 1)
					return _container.attr('data-tag', tag);
					
				return _container.attr('data-tag'); 
			}
			
			function activeTagClass() {
				return sprintf('tag-%s', activeTag());
			}
			
            function createHeader(items) {
	            
				var row = $('<tr></tr>');

	            for (var index in items) {
		            var data = $('<th></th>').text(items[index]);
		            row.append(data);
	            }
	            
	            return row;
            }

            function createRow(time) {
	            
				var row = $('<tr></tr>');

				var template = 
					'<th class="row-header">'+
						'<div class="label"></div>'+
						'<div class="icon icon-chevron-up"></div>'+
						'<div class="icon icon-chevron-down"></div>'+
					'</th>';
				

				row.attr('data-hour', time.getHours());
				row.append($(template));
				row.find('.label').text(sprintf('%02d:%02d', time.getHours(), time.getMinutes()));
				
				for (var index in _weekdays) {
					var cell = $('<td class="cell"></td>').addClass(_weekdays[index]);

					for (var minutes = 0; minutes < 60; minutes += 15) {
						
						var range = {};
						
						range.start = moment({hour:time.getHours(), minute:minutes}).toDate();
						range.end   = moment({hour:time.getHours(), minute:minutes + 15}).toDate();

						$('<div></div>').val(range).appendTo(cell);
												
					}

					row.append(cell);
				}	      
				
				row.val(time);      

	            return row; 
            }
            
            function enableEvents() {
			
				_elements.tbody.on('tap', 'tr:first-child .icon-chevron-up', function(){
					var row = $(this).closest('tr'); 
					var time = row.val();

					if (time.getHours() > 0)
						_elements.tbody.prepend(createRow(time.addHours(-1)));
				});

				_elements.tbody.on('tap', 'tr:last-child .icon-chevron-down', function(){
					var row = $(this).closest('tr'); 
					var time = row.val();

					if (time.getHours() < 23)
						_elements.tbody.append(createRow(time.addHours(1)));
				});

				_elements.tbody.on('tap', 'tr:first-child .icon-chevron-down, tr:last-child .icon-chevron-up', function(){
					var row = $(this).closest('tr');
					
					if (_elements.tbody.find('tr').length > 2) 
						row.remove();
				});


            }
            
            function formatRange(range) {
	            return sprintf('%02d:%02d-%02d%02d', range.start.getHours(), range.start.getMinutes(), range.end.getHours(), range.end.getMinutes());
            }
            
            function formatRanges(ranges) {
	        
	        	var array = [];
	        	
	        	$.each(ranges, function(index, range) {
		        	array.push(formatRange(range));
	        	});    
	        	
	        	return array.join(',');
            }
            
            function parseRange(text) {
	            var components = text.split('-');
	            
	            var startComponents = components[0].split(':');
	            var endComponents = components[1].split(':');
	            
	            var start = moment({hour:parseInt(startComponents[0]), minute:parseInt(startComponents[1])}).toDate();
	            var end   = moment({hour:parseInt(endComponents[0]), minute:parseInt(endComponents[1])}).toDate();
	            
	            return moment().range(start, end);
            }
            
            
            function parseRanges(text) {
	            var components = text.split(',');
	            var ranges = [];

	            for (var index in components) {
	            	var range = parseRange(components[index]);
	            	
	            	if (range != undefined)
			            ranges.push(range);
	            }
	            
	            return ranges;
            }

			self.select = function() {
			
				if (arguments.length == 0)
					return getSelection();
				if (arguments.length == 1)
					return setSelection(arguments[0]);
					
				return undefined;
			}
			
            function setSelection(selection) {
	            
	            for (var weekday in selection) {
		            var cells = _elements.tbody.find(sprintf('.%s div', weekday));
		            
		            if (cells.length > 0) {

						
		            	for (var tag in selection[weekday]) {

							var ranges = parseRanges(selection[weekday][tag]);
							
							cells.each(function(index) {
								var cell = $(this);
								var cellValue = cell.val();
								var cellRange = moment().range(cellValue.start, cellValue.end);
								
								$.each(ranges, function(index, range) {																		
									if (range.contains(cellRange)) {
										cell.addClass(sprintf('tag-%s', tag));
										return false;											
									}
								});
							});
			            	
		            	}
		            }
	            }
            }

            function getSelection() {
	            var selection = {};

				for (var weekdayIndex in _weekdays) {
					var weekday = _weekdays[weekdayIndex];
										
					for (var tagIndex in _tags) {
						var tag = _tags[tagIndex];
			            var cells = _elements.tbody.find(sprintf('.%s div.tag-%s', weekday, tag));
	
						var ranges = [];

						cells.each(function(index) {
							var cell = $(this);
							var cellValue = cell.val();
							var cellRange = moment().range(cellValue.start, cellValue.end);

							if (ranges.length == 0) {
								// Add first value
								ranges.push({
									start:cellValue.start,
									end:cellValue.end
								});
							}
							else {
								var last = ranges[ranges.length - 1];
								
								if (last.end.valueOf() == cellValue.start.valueOf()) {
									// Append to previous is end date is the same as this start date
									last.end = cellValue.end;
								}
								else {
									// Otherwise make add another entry
									ranges.push({
										start:cellValue.start,
										end:cellValue.end
									});
								}
								
							}	
						});
						
						if (ranges.length > 0) {

							if (selection[weekday] == undefined)
								selection[weekday] = {};
							
							selection[weekday][tag] = ranges;
						}
						
					}

				}	      

				return selection;
            }

            
	
	        function init() {
	
				if (_elements.container.attr('data-mini') == "true") {
					_elements.container.addClass('ui-mini');
				}
				
				$(html).appendTo(_elements.container);
				
				_elements.table = _elements.container.find('table'); //$('<table></table>').appendTo(_elements.container);
				_elements.thead = _elements.container.find('thead'); //$('<thead></thead>').appendTo(_elements.table);
				_elements.tbody = _elements.container.find('tbody'); //$('<tbody></tbody>').appendTo(_elements.table);

				var time = new Date();
				
				time.clearTime();
				time = time.addHours(8);
				
                for (var i = 0; i < 10; i++, time = time.addHours(1)) {
					_elements.tbody.append(createRow(time));
				}
				
				
				_elements.container.hookup(_elements, 'data-id');
				
				_elements.container.on('selection-end', function(event, selection) {
					if (selection.length > 0) {
						var first = $(selection[0]);
						var tagClass = activeTagClass();

						if (first.hasClass(tagClass))
							selection.removeClass(tagClass);
						else {
							selection.removeClassMatching('ui-page-theme-*').addClass(tagClass);
						}
					}
				});
				
				_elements.container.selectable({
					showMarquee: true,
					marqueeOpacity: 0.1,
					selectionThreshold: 0,
					selectables: 'table tbody td div'
					
				});				
	            
				enableEvents();
	        };
	
	        init();
	
	    };


		var widget = {};

		widget.options = {};

		widget.options.tag = 'A';
		
		widget._create = function() {
			this.widget = new Widget(this);
		}
		
		widget.select = function() {
			return this.widget.select.apply(undefined, arguments);
		}

		widget.refresh = function() {
			return this.widget.refresh();
		}
		
			
		$.widget("mobile.scheduleweek", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(event) {
			$(":jqmData(role=scheduleweek)", event.target).scheduleweek();
		});
	});


})();
