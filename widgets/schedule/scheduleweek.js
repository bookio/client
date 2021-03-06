
(function() {

	var dependencies = [
		'text!./scheduleweek.html',
		'css!./scheduleweek.css',
    	'../../lib/jquery/plugins/jquery.selectable.js'		
	];

	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self         = this;
			var _elements    = {};
			var _container   = widget.element;
			var _date        = new Date(); //2000, 0, 1, 0, 0, 0);
			var _cells       = {};
			
			_elements.container = widget.element;
			
			// Move to beginning of week
			_date = _date.addDays(-(_date.getDay() + 6) % 7);
			_date.setHours(0);
			_date.setMinutes(0);
			_date.setSeconds(0);
			_date.setMilliseconds(0);
			
			self.refresh = function() {
			}
	
			
            function createRow(time) {
	            
				var row = $('<tr></tr>');

				var template = 
					'<th>'+
						'<div class="label"></div>'+
						'<div class="icon-plus"></div>'+
						'<div class="icon-minus"></div>'+
					'</th>';
				
				var hours = time.getHours();
				
				row.append($(template));
				row.find('.label').text(sprintf('%02d:%02d', hours, time.getMinutes()));
				row.val(hours);
				
				
				var date = _date.clone();
				
				for (var index = 0; index < 7; index++) {
					var weekday = date.getDay();
					var weekdayName = moment.weekdaysShort[weekday];

					var cell = $('<td></td>').addClass(weekdayName);

					for (var subindex = 0; subindex < 4; subindex++) {
						var value = hours * 4 + index * 96 + subindex;
						var element = $('<div></div>');
						 
						_cells[value] = element;
						element.val(value).appendTo(cell).addClass("cell");
					}
					
					date = date.addDays(1);
					row.append(cell);
				}	      
				
				row.val(time);      

	            return row; 
            }
            
            function enableEvents() {
			

            }
            

			self.selection = function() {
			
				if (arguments.length == 0)
					return getSelection();
				if (arguments.length == 1)
					return setSelection(arguments[0]);
					
				return undefined;
			}
			
			self.select = function(items, tag) {
				if (items.first().attr('tag') == tag)
					items.removeAttr('tag');
				else
					items.attr('tag', tag);
            }
			
			
            function setSelection(selection) {

	            // Clear selection
	            _elements.tbody.find('.cell').removeAttr('tag');
	            
	            for (var tag in selection) {
	            	var items = selection[tag];

	            	for (var index in items) {
	            		var cell = _cells[items[index]]; 
	            		if (cell != undefined)
			            	cell.attr('tag', tag);
	            	}
	            }
				if (_elements.container.attr('data-style') == "week") {
					var range = getMinMaxHours(selection);
					adjustVisibility(range.min, range.max);
				}
	            
            }
            
            
			
            
            function getSelection() {
	            var selection = {};

	            var cells = _elements.tbody.find('.cell[tag]');
	            
				cells.each(function(index) {
					var cell = $(this);
					var tag = cell.attr('tag');
					var item = selection[tag];
					
					if (item == undefined)
						selection[tag] = item = [];

					item.push(parseInt(cell.val()));
					
				});

				return selection;
            }

			function adjustVisibility(start, stop) {

				var rows = _elements.tbody.find('tr');
				
				rows.removeClass('hidden').removeClass('first-row').removeClass('last-row');
				
				rows.each(function(index) {

					if (index < start || index > stop)
						$(this).addClass('hidden');
						
					if (index == start)
						$(this).addClass('first-row');
					if (index == stop)
						$(this).addClass('last-row');
				});
				
			}
			
			function getMinMaxHours(selection) {
				
				var min = 9;
				var max = 17;
				
				for (var tag in selection) {
					var slots = selection[tag];
					
					for (var index in slots) {
						var value = Math.floor((parseInt(slots[index]) % 96) / 4);

						if (value < min)
							min = value;
							
						if (value > max)
							max = value;	
						 
					}

				}
				
				return {min:min, max:max}
			}

			function buildDOM() {
				var html = 	'';
				
				html = 	'<div>' + 
							'<table class="header">' + 
								'<thead>' +
							        '<tr>' + 
							            '<th></th>' +
							            '<th class="monday">Mo</th>' +
							            '<th class="tuesday">Tu</th>' +
							            '<th class="wednesday">We</th>' +
							            '<th class="thursday">Th</th>' +
							            '<th class="friday">Fr</th>' +
							            '<th class="saturday">Sa</th>' +
							            '<th class="sunday">Su</th>' +
							        '</tr>' +
								'</thead>' +
							'</table>' +
							'<div class="container selectable"> ' +
								'<table class="schedule">' +
								    '<tbody>' +
								    '</tbody>' +
								'</table>' +
							'</div>' +
						'</div>';
						
				$(html).appendTo(_elements.container);
				
				_elements.table = _elements.container.find('table.schedule');
				_elements.thead = _elements.container.find('thead'); 
				_elements.tbody = _elements.container.find('tbody'); 


				var time = _date.clone();
				time.clearTime();
				time = time.addHours(0);
				
                for (var i = 0; i <= 23; i++, time = time.addHours(1)) {
                	var row = createRow(time);
					_elements.tbody.append(row);
				}

				_elements.tbody.on('tap', 'tr.first-row div.icon-plus', function(){
					var row = $(this).closest('tr');
					
					if (row.prev().length > 0)
						row.removeClass('first-row').prev().addClass('first-row').removeClass('hidden');
				});
				_elements.tbody.on('tap', 'tr.first-row div.icon-minus', function(){
					var row = $(this).closest('tr');

					if (row.next().length > 0 && _elements.tbody.find('.hidden').length < 20)
						row.removeClass('first-row').addClass('hidden').next().addClass('first-row');
				});

				_elements.tbody.on('tap', 'tr.last-row div.icon-plus', function(){
					var row = $(this).closest('tr');

					if (row.next().length > 0)
						row.removeClass('last-row').next().addClass('last-row').removeClass('hidden');
				});
				_elements.tbody.on('tap', 'tr.last-row div.icon-minus', function(){
					var row = $(this).closest('tr');

					if (row.prev().length > 0 && _elements.tbody.find('.hidden').length < 20)
						row.removeClass('last-row').addClass('hidden').prev().addClass('last-row');
				});

				var start = 9;
				var stop  = 17;
				
				_elements.tbody.find('tr').each(function(index) {

					if (index < start || index > stop)
						$(this).addClass('hidden');
						
					if (index == start)
						$(this).addClass('first-row');
					if (index == stop)
						$(this).addClass('last-row');
				});

				// Fill header with weekday names				
				_elements.thead.find('th').each(function(index) {
					if (index > 0) {
						if (index == 7)
							$(this).text(moment.weekdaysShort()[0]);
						else
							$(this).text(moment.weekdaysShort()[index]);						
					}
				});				

				
			}
			
			function buildDays() {
			
				var daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				var counter     = 0;
				
				_elements.content = $('<div></div>').appendTo(_elements.container).addClass('selectable');
				_elements.table   = $('<table></table>').appendTo(_elements.content);
				_elements.thead   = $('<thead></thead>').appendTo(_elements.table);
				_elements.tbody   = $('<tbody></tbody>').appendTo(_elements.table); 

				var tr = $('<tr></tr>').appendTo(_elements.thead);
				var th = $('<th></th>').text('').appendTo(tr);
				
				for (var i = 0; i < 31; i++) {
					$('<td></td>').text(sprintf('%02d', i + 1)).appendTo(tr);						
				}
				
				$.each(moment.monthsShort(), function(index, month) {
					var tr = $('<tr></tr>').appendTo(_elements.tbody);
					var th = $('<th></th>').text(month).appendTo(tr);
					
					for (var i = 0; i < 31; i++) {
						var cell = $('<td></td>').appendTo(tr);
						
						if (i < daysInMonth[index])
							cell.addClass('cell').val(counter++);						
					}
				});
				
				_elements.tbody.find('.cell').each(function(index) {
					_cells[parseInt(index)] = $(this);
				});
						
			}
            
	
	        function init() {
	
				if (_elements.container.attr('data-mini') == "true") {
					_elements.container.addClass('ui-mini');
				}

				if (_elements.container.attr('data-style') == "day") {
					buildDays();				
				}
				if (_elements.container.attr('data-style') == "week") {
					buildDOM();	
				}


				
				_elements.container.hookup(_elements, 'data-id');


				_elements.container.on('selection-end', function(event, selection) {

				});

				_elements.container.find('.selectable').selectable({
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
