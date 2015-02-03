
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
			var _weekdays    = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
			var _date        = new Date(); //2000, 0, 1, 0, 0, 0);

			_elements.container = widget.element;
			
			// Move to beginning of week
			_date = _date.addDays(-(_date.getDay() + 6) % 7);
			_date.setHours(0);
			_date.setMinutes(0);
			_date.setSeconds(0);
			_date.setMilliseconds(0);
			
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
				

				row.append($(template));
				row.find('.label').text(sprintf('%02d:%02d', time.getHours(), time.getMinutes()));
				
				var date = _date.clone();
				
				for (var index = 0; index < 7; index++) {
					var weekday = date.getDay();
					var weekdayName = _weekdays[weekday];	

					var cell = $('<td></td>').addClass(weekdayName);

					for (var minutes = 0; minutes < 60; minutes += 15) {
						
						var range = {};
						
						range.begin_at = new Date(date);
						range.begin_at.setHours(time.getHours());
						range.begin_at.setMinutes(minutes);
						
						range.end_at = new Date(date);
						range.end_at.setHours(time.getHours());
						range.end_at.setMinutes(minutes + 15);


						$('<div></div>').val(range).appendTo(cell).addClass("cell");
												
					}
					
					date = date.addDays(1);
					row.append(cell);
				}	      
				
				row.val(time);      

	            return row; 
            }
            
            function enableEvents() {
			
				_elements.tbody.on('tap', 'tr:first-child .icon-chevron-up', function() {

					var row = $(this).closest('tr'); 
					var time = row.val();

					if (time.getHours() > 0)
						_elements.tbody.prepend(createRow(time.addHours(-1)));
				});

				_elements.tbody.on('tap', 'tr:last-child .icon-chevron-down', function() {
					
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
            

			self.selection = function() {
			
				if (arguments.length == 0)
					return getSelection();
				if (arguments.length == 1)
					return setSelection(arguments[0]);
					
				return undefined;
			}
			
			
            function setSelection(selection) {
	            
	            // Clear selection
	            _elements.tbody.find('.cell').removeAttr('tag');

	            for (var tag in selection) {
		            var items = selection[tag];
		            
		            for (var index in items) {
		            	var item = items[index];
		            	
		            	if (item.begin_at == undefined || item.end_at == undefined)
		            		continue;

						item.begin_at = new Date(item.begin_at);
						item.end_at = new Date(item.end_at);
						
		            	var begin_at = item.begin_at.clone();
		            	var end_at = item.end_at.clone();

		            	begin_at = _date.addDays((item.begin_at.getDay() + 6) % 7);
		            	end_at = _date.addDays((item.end_at.getDay() + 6) % 7);

						begin_at.setHours(item.begin_at.getHours());
						begin_at.setMinutes(item.begin_at.getMinutes());

						end_at.setHours(item.end_at.getHours());
						end_at.setMinutes(item.end_at.getMinutes());
						
			            var cells = _elements.tbody.find(sprintf('.%s .cell', _weekdays[begin_at.getDay()]));
		            	var range = moment().range(begin_at, end_at);
							
						cells.each(function(index) {
							var cell = $(this);
							var cellValue = cell.val();
							var cellRange = moment().range(cellValue.begin_at, cellValue.end_at);

							if (range.contains(cellRange)) {
								cell.attr('tag', tag);

							}
						});
		            }
		            
	            }
            }
			
            
            function getSelection() {
	            var selection = {};

				$.each(_weekdays, function(weekday, weekdayName) {
		            var cells = _elements.tbody.find(sprintf('.%s .cell[tag]', weekdayName));
		            
					cells.each(function(index) {
						var cell = $(this);
						var cellValue = cell.val();
						var cellRange = moment().range(cellValue.begin_at, cellValue.end_at);
						var tag = cell.attr('tag');
						var range = selection[tag];
						
						if (range == undefined)
							selection[tag] = range = [];
	
						if (range.length == 0) {
							// Add first value
							range.push({
								begin_at:cellValue.begin_at,
								end_at:cellValue.end_at
							});
						}
						else {
							var last = range[range.length - 1];
							
							if (last.end_at.valueOf() == cellValue.begin_at.valueOf()) {
								// Append to previous is end date is the same as this start date
								last.end_at = cellValue.end_at;
							}
							else {
								// Otherwise make add another entry
								range.push({
									begin_at:cellValue.begin_at,
									end_at:cellValue.end_at
								});
							}
							
						}
					});
					
				});

				for (var tag in selection) {
					selection[tag].sort(function(a, b) {
						return a.begin_at.getDate() - b.begin_at.getDate();
					});
				}				


				return selection;
            }



            
	
	        function init() {
	
				if (_elements.container.attr('data-mini') == "true") {
					_elements.container.addClass('ui-mini');
				}
				
				$(html).appendTo(_elements.container);
				
				_elements.table = _elements.container.find('table');
				_elements.thead = _elements.container.find('thead'); 
				_elements.tbody = _elements.container.find('tbody'); 

				var time = _date.clone();
				time.clearTime();
				time = time.addHours(8);
				
                for (var i = 0; i < 10; i++, time = time.addHours(1)) {
					_elements.tbody.append(createRow(time));
				}
				
				_elements.container.hookup(_elements, 'data-id');
				
				_elements.container.on('selection-end', function(event, selection) {
					if (selection.length > 0) {
						var first = $(selection[0]);
						var currentTag = activeTag()
						var firstTag = first.attr('tag');
						
						if (firstTag == currentTag)
							selection.removeAttr('tag');
						else
							selection.attr('tag', currentTag);
					}
				});
				
				_elements.container.selectable({
					showMarquee: true,
					marqueeOpacity: 0.1,
					selectionThreshold: 0,
					selectables: '.cell'
					
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
		
		widget.selection = function() {
			return this.widget.selection.apply(undefined, arguments);
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
