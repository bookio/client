


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/options.js',
    	'../../widgets/common/checklist.js',
    	'../../widgets/picker/picker.js',
    	'../../widgets/imagepicker/imagepicker.js',
    	'../../widgets/schedule/scheduleweek.js',
    	'css!./schedule.css'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _element = page.element;
            var _elements = {};
			var _options = {};
			
            _element.hookup(_elements, 'data-id');
            
            
            function fill() {
            }
            
            function chill() {
            }

            function selectTag(tag) {

				var button = _elements.buttons.container.find(sprintf('[data-tag="%s"]', tag));
				var buttons = _elements.buttons.container.find('[data-tag]');
				
				buttons.removeClassMatching('ui-icon-*').addClass('ui-icon-none');
				button.removeClass('ui-icon-none').addClass('ui-icon-check');

				_elements.schedule.attr('data-tag', button.attr('data-tag'));
            }
            
            
            function addButton(text) {
				var buttons = _elements.buttons.container.find('.ui-btn');
				
				if (buttons.length < 4) {

	            	var theme  = String.fromCharCode(65 + 1 + buttons.length).toLowerCase();
	            	var tag    = String.fromCharCode(65 + buttons.length).toUpperCase();
		            var button = $('<div class="ui-btn ui-icon-none ui-btn-icon-left ui-btn-inline ui-shadow ui-corner-all ui-mini ui-left"></div>');
					var input  = $('<input class="ui-inline" data-mini="true" type="text" maxlength="4" placeholder="SEK"/>').appendTo(button);
					var label  = $('<label class="ui-mini ui-inline">SEK</label>').appendTo(button);

					button.addClass('ui-btn-' + theme);
					button.attr('data-theme', theme);
					button.attr('data-tag', tag);
	
		            button.appendTo(_elements.buttons.container);
					button.trigger('create');

					input.val(text);
					input.focus();
					input.textrange('set');
		            
		            input.on('tap', function() {
						input.textrange('set');			            
		            });
		            
		            selectTag(tag);
				}
				
				_elements.buttons.add.toggleClass('ui-state-disabled', buttons.length >= 3);
	            
            }

			function init() {
				_elements.back.on('tap', function(event) {

					$.mobile.pages.pop();
				});

	            var selection = {
		            'saturday': {
			          //  'A': '8:00-15:00,  15:30-16:00',
			            'B': '16:00-18:00'			           
		            }
		            /*,
		            'monday': {
			            'C': '8:00-12:00,13:00-17:00'
		            }
		            */
	            };
	            
				_elements.schedule.scheduleweek();
				_elements.schedule.scheduleweek('select', selection);

				_elements.schedule.on('selection-end', function(event, selection) {
					console.log(_elements.schedule.scheduleweek('select'));
				});

				_elements.buttons.container.on('tap', '[data-tag]', function (event) {
					selectTag($(this).attr('data-tag')); 
				});
				
				
				_elements.buttons.add.on('tap', function(event) {
					addButton('100');
					
				});
				
				_element.on("pageinit", function(event) {
					addButton('100');
				});				

				_elements.list.checklist();

				_elements.list.checklist('api', function(list) {
					this.add({
						title:'Veckovis',
						description:'Varje torsdag kl 15:00 sdfg  ödfgsd,fg ösdf ösdf glök adsfk adsfg aldskfa agsdlkjag adfglkjafg afölga g ölkafg afgölasfgöl kajf afgölk',
						icon:'check'
					});
					this.add({
						title:'Veckovis',
						description:'Varje torsdag kl 15:00 sdfg  ödfgsd,fg ösdf ösdf glök adsfk adsfg aldskfa agsdlkjag adfglkjafg afölga g ölkafg afgölasfgöl kajf afgölk',
						icon:'check'
					});
					this.add({
						title:'Veckovis',
						description:'Varje torsdag kl 15:00 sdfg  ödfgsd,fg ösdf ösdf glök adsfk adsfg aldskfa agsdlkjag adfglkjafg afölga g ölkafg afgölasfgöl kajf afgölk',
						icon:'check'
					});
					this.add({
						title:'Veckovis',
						description:'Varje torsdag kl 15:00 sdfg  ödfgsd,fg ösdf ösdf glök adsfk adsfg aldskfa agsdlkjag adfglkjafg afölga g ölkafg afgölasfgöl kajf afgölk',
						icon:'check'
					});
				});

				_elements.list.checklist('add', {
					title:'Årsvis',
					description:'Varje torsdag kl 15:00 sdfg  ödfgsd,fg ösdf ösdf glök adsfk adsfg aldskfa agsdlkjag adfglkjafg afölga g ölkafg afgölasfgöl kajf afgölk'
//					icon:'k'
				});
				
				_elements.list.checklist('refresh');


			}
	
			init();
        }
        
        return Module;
    
    });

    
})();

