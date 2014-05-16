


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/imagepicker/imagepicker.js',
    	'../../widgets/picker/picker.js',
    	'../../widgets/symbolpicker/symbolpicker.js'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
			var _options = {};
			var _schedule = {};
			var _icons = [];
			
			_schedule.startTime = new Date();
			_schedule.startTime.clearTime();
			_schedule.startTime = _schedule.startTime.addHours(8);
			_schedule.startTime = _schedule.startTime.addMinutes(0);
			_schedule.interval  = 60;
			_schedule.count = 10;
			_schedule.slots = [1, 2, 3];
            
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

            function createRow(items) {
	            
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

					if (item.data != undefined)
			            cell.data('data', item.data);
					
		            row.append(cell);
		            
	            }
	            
	            return row; 
            }
            
            function setStep(step) {
				var thisStep = parseInt(_elements.page.attr('step'));
				var nextStep = step;
				
				var thisPage = _elements.page.find(sprintf('[step=%d]', thisStep));
				var nextPage = _elements.page.find(sprintf('[step=%d]', nextStep));
				
				_elements.buttons.fadeOut(200);

				var css = {};
				
				var blocks = _elements.header.find('.slider');
				
				blocks.removeClass("selectedSlider");

				var block = $(blocks[step - 1]);
				
				
				css.left = block.offset().left - _elements.header.offset().left - 1 + 'px';
				css.top = block.offset().top - _elements.header.offset().top - 1 + 'px';
				css.width = block.outerWidth() + 1 + 'px';
				css.height = _elements.header.outerHeight() + 1 + 'px';
				
				block.addClass("selectedSlider");
				
				_elements.page.attr('step', nextStep);
				
				thisPage.fadeOut(200, function(){
					nextPage.fadeIn(200);	
					_elements.buttons.fadeIn(200);
					
				});
	            
            }

			function initializeEvents() {
				_elements.next.on('tap', function(event) {

					var step = parseInt(_elements.page.attr('step'));
					
					setStep(step + 1);
				});
				_elements.back.on('tap', function(event) {

					var step = parseInt(_elements.page.attr('step'));

					setStep(step - 1);

				});
				
				_elements.product.add.on('tap', function() {
					$.mobile.pages.push("./product.html");
					
				});
				
				_elements.meg.on('schedule', function(event) {
					$.mobile.pages.push("./schedule.html");
				});
				
				_elements.symbol.button.on('tap', function() {

					function showPopup() {
						var popup = $('<div data-role="popup"></div>').popup({
							dismissible: true,
							transition: "pop",
							positionTo: _elements.symbol.button
						});
	
						var options = {};
	
						options.symbols = _icons;
	
						var symbolpicker = $('<div data-role="symbolpicker"></div>').appendTo(popup).symbolpicker(options);
	
						popup.on("popupafterclose", function() {
							$(this).remove();
						});
	
						popup.on('popupbeforeposition', function() {
							symbolpicker.symbolpicker('filter', '*');
						});
	
						symbolpicker.on("symbolselected", function(event, icon) {
							popup.popup('close');
							_elements.symbol.image.attr('src', sprintf('../../images/symbols/%s', icon.image));
						});
	
						popup.popup('open');						
					}

					if (_icons.length == 0) {
						_elements.page.spin(true);
						
						var icons = Model.Icons.fetch();
		
						icons.done(function(icons) {
							_icons = icons;
							
							_elements.page.spin(false);
							showPopup();
						});
						
					}
					else {
						showPopup();
					}

				});
			}
	
			
            this.init = function() {


				initializeEvents();

            	addHeader(['', 'MÅ','TI','ON','TO','FR','LÖ','SÖ']);

				
				_elements.table.body.selectable({
					showMarquee: false,
					autoselect: true,
					selectionThreshold: 0
				});

				_elements.meg.val(2);
				
				_elements.table.body.on('tap', 'tr:last-child td:first-child .icon-plus', function(){

					var row = $(this).closest('tr'); 
					var time = row.data('time');

					addOne(time.addMinutes(_schedule.interval), false);
				});

				_elements.table.body.on('tap', 'tr:first-child td:first-child .icon-plus', function(){

					var row = $(this).closest('tr'); 
					var time = row.data('time');

					addOne(time.addMinutes(-1 * _schedule.interval), true);
				});
				
				_elements.table.body.on('tap', 'tr:last-child td:first-child .icon-minus', function(){

					var row = $(this).closest('tr');
					var body = row.closest('tbody');
					
					if (body.find('tr').length > 2) 
						row.remove();
				});

				_elements.table.body.on('tap', 'tr:first-child td:first-child .icon-minus', function(){
					var row = $(this).closest('tr');
					var body = row.closest('tbody');
					
					if (body.find('tr').length > 2) 
						row.remove();
				});
				

				function addOne(time, prepend) {
					var row = $('<tr></tr>');

					row.data('time', time);
					
					var html = 
						'<td>'+
							'<div>'+
							'<div class="icon icon-plus"></div>'+
							'<div class="label"></div>'+
							'<div class="icon icon-minus"></div>'+
							'</div>'+
						'</td>';
					
					html = $(html);
					html.find('.label').text(sprintf('%02d:%02d', time.getHours(), time.getMinutes()));
					
					row.append(html);
					
					for (var index = 0; index < 7; index++) {
						var template = 
							'<td class="cell">'+
							'<div class="selectable"></div>'+
							'<div class="selectable"></div>'+
							'<div class="selectable"></div>'+
							'<div class="selectable"></div>'+
							'</td>';
						row.append($(template));
					}

					if (prepend === true)
						_elements.table.body.prepend(row);
					else
						_elements.table.body.append(row);
					
				}                

				var time = _schedule.startTime;
				
                for (var i = 0; i < _schedule.count; i++) {

					addOne(time);
					
					time = time.addMinutes(_schedule.interval);
				}

          
				
            }     

        }

        
        return Module;
    
    });

    
})();

