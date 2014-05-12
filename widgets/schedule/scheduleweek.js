
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
				
				for (var index = 0; index < 7; index++) {
					var template = 
						'<td class="cell">'+
							'<div></div>'+
							'<div></div>'+
							'<div></div>'+
							'<div></div>'+
						'</td>';
					row.append($(template));
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
	
	        function init() {
	
				_elements.container.addClass('');

				if (_elements.container.attr('data-mini') == "true") {
					_elements.container.addClass('ui-mini');
				}	            
				
	            //_elements.container.append($(template));
				_elements.table = $('<table></table>').appendTo(_elements.container);
				_elements.thead = $('<thead></thead>').appendTo(_elements.table);
				_elements.tbody = $('<tbody></tbody>').appendTo(_elements.table);

				
				_elements.thead.append(createHeader(['', 'MÅ', 'TI', 'ON', 'TO', 'FR', 'LÖ', 'SÖ']));
				
				var time = new Date();
				
				time.clearTime();
				time = time.addHours(8);
				
                for (var i = 0; i < 10; i++, time = time.addHours(1)) {
					_elements.tbody.append(createRow(time));
				}
				
				
				_elements.container.hookup(_elements, 'data-id');
	            
				enableEvents();
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
