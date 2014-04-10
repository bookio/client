

(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
            var _rental = {};
            
            _element.hookup(_elements, 'data-id');
            
            function fill() {
            }
            
            function chill() {
            }

            function addHeader(items) {
	            
				var row = $('<tr></tr>');
	            
	            for (var index in items) {
		            var data = $('<th></th>').text(items[index]);
		            row.append(data);
	            }
	            
	            _elements.table.header.append(row);
            }
            
            function addRow(items, prepend) {
	            
				var row = $('<tr></tr>');
	            
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
					
		            row.append(cell);
		            
	            }
	            
	            if (prepend)
	            	_elements.table.body.prepend(row);
	            else 
	            	_elements.table.body.append(row);
            }

			function initializeEvents() {
				
			}
	
			
            this.init = function() {


            	addHeader(['', 'MÅ','TI','ON','TO','FR','LÖ','SÖ']);

//				_elements.table.body.on('tap', '.cell', function(){
//					$(this).toggleClass('selected');

//				});

				
				$('[data-role=page]').selectable({
					showMarquee: false
				});

				
				_elements.table.body.on('tap', 'tr:last-child td:first-child .icon-plus', function(){

					var foo = $(this).text().split(':')[0];
					foo = parseInt(foo);
					foo = foo + 1;
					addOne(sprintf('%02d:00', foo));
				});

				_elements.table.body.on('tap', 'tr:first-child td:first-child .icon-plus', function(){

					var foo = $(this).text().split(':')[0];
					foo = parseInt(foo);
					foo = foo - 1;
					addOne(sprintf('%02d:00', foo), true);
				});

				function addOne(text, prepend) {
					var items = [];
					
					var div = $('<div></div>');
					var div1 = $('<div class="icon-plus small-icon"></div>');
					var div2 = $('<div class="inline"></div>');
					var div3 = $('<div class="icon-minus small-icon"></div>');
					
					div2.text(text);

					div.append(div1);
					div.append(div2);
					div.append(div3);
					
					items.push({
						content: div
					});
					
					
					for (var index = 0; index < 7; index++) {
						items.push({
							class: 'cell selectable'
						});
					}
					
					addRow(items, prepend);
				}                

                for (var i = 8; i < 18; i++) {

					addOne(sprintf('%02d:00', i));
				}

          
				
            }     

        }

        
        return Module;
    
    });

    
})();

