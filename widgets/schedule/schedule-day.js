
(function() {

	var dependencies = [
		'text!./schedule-day.html',
		'css!./schedule-day.css',
    	'../../lib/jquery/plugins/jquery.selectable.js'		
	];

	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self         = this;
			var _elements    = {};
			var _container   = widget.element;
			var _months      = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
			var _daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			
			self.refresh = function() {
			}
	

			function createTable() {
				var table = $('<table></table>');
				var tbody = $('<tbody></tbody>').appendTo(table);
				
				return table;
			}			
			
            function createHeader(items) {
	            
				var row = $('<tr></tr>');

	            for (var index in items) {
		            var data = $('<th></th>').text(items[index]);
		            row.append(data);
	            }
	            
	            return row;
            }



            
	
	        function init() {
	
				_elements.container = widget.element;

				_elements.table = $('<table></table>').appendTo(_elements.container);
				_elements.tbody = $('<tbody></tbody>').appendTo(_elements.table); 

				for (var index in _months) {
					var month = _months[index];
					var days  = _daysInMonth[index];
					
					var tr = $('<tr></tr>').appendTo(_elements.tbody);
					var th = $('<th></th>').appendTo(tr);
					th.text(month);
					
					for (var i = 0; i < days; i++) {
						var td = $('<td></td>').appendTo(tr);
						td.text(sprintf('%02d', i + 1));
						td.addClass('cell');
					}
					
					
					
				}
				
				_elements.container.on('selection-end', function(event, selection) {
					if (selection.length > 0) {
					}
				});
				
				_elements.container.selectable({
					showMarquee: true,
					marqueeOpacity: 0.1,
					selectionThreshold: 0,
					selectables: 'td'
					
				});				
	            
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
		
			
		$.widget("mobile.scheduleday", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(event) {
			$(":jqmData(role=scheduleday)", event.target).scheduleday();
		});
	});


})();
