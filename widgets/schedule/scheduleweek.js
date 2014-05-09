
(function() {

	var dependencies = [
		'text!./scheduleweek.html',
		'css!./scheduleweek.css',
    	'../../lib/jquery/plugins/jquery.selectable.js'		
	];

	define(dependencies, function(template) {

	    var Widget = function(widget) {

	        var self       = this;
			var _elements  = {};
			var _container = widget.element;
			
			_elements.container = widget.element;
			
			self.refresh = function() {
			}
	

            function createHeader(items) {
	            
				var row = $('<tr></tr>');

	            for (var index in items) {
		            var data = $('<th></th>').text(items[index]);
		            row.append(data);
	            }
	            
	            return row;
            }

            function createRow(items) {
	            
				var row = $('<tr class="ui-mini"></tr>');
	            
	            for (var index in items) {
	            	var item = items[index];
		            var cell = $('<td></td>');
		            
		            if (item.text != undefined)
		            	cell.text(item.text);
		            	
		            if (item.class != undefined)
		            	cell.addClass(item.class);

					if (item.click != undefined)
			            cell.on('tap', item.click);

					if (item.content != undefined)
			            cell.append(item.content);

					if (item.data != undefined)
			            cell.data('data', item.data);
					
		            row.append(cell);
		            
	            }
	            
	            return row; 
            }
            
	
	
	        function init() {
	
				_elements.container.addClass('');
				
	            //_elements.container.append($(template));
				_elements.table = $('<table></table>').appendTo(_elements.container);
				_elements.thead = $('<thead></thead>').appendTo(_elements.table);
				_elements.tbody = $('<tbody></tbody>').appendTo(_elements.table);

				
				//createHeader(['', 'MÅ', 'TI', 'ON', 'TO', 'FR', 'LÖ', 'SÖ']));
				
				_elements.container.hookup(_elements, 'data-id');
	            
				if (_elements.container.attr('data-mini') == "true") {
					_elements.container.addClass('ui-mini');
				}	            

				_elements.container.selectable();
	        };
	
	        init();
	
	    };


		var widget = {};

		widget.options = {};

		widget._create = function() {
			this.widget = new Widget(this);
		}
		
		widget.refresh = function() {
			this.widget.refresh();
		}
		
			
		$.widget("mobile.scheduleweek", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(event) {
			$(":jqmData(role=scheduleweek)", event.target).scheduleweek();
		});
	});


})();
