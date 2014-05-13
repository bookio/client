


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/options.js',
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
			var _schedule = {};
			var _activeTheme = '';
			
            _element.hookup(_elements, 'data-id');
            
            
            function fill() {
            }
            
            function chill() {
            }

            function selectTheme(theme) {

				var button = _elements.buttons.container.find(sprintf('.ui-btn-%s', theme));
				var buttons = _elements.buttons.container.find('.ui-btn');
				
				buttons.removeClassMatching('ui-icon-*').addClass('ui-icon-none');
				button.removeClass('ui-icon-none').addClass('ui-icon-check');

				_activeTheme = theme; 
	            
            }
            
            
            function addButton(text) {
				var buttons = _elements.buttons.container.find('.ui-btn');
				
				if (buttons.length < 4) {
	            	var theme = String.fromCharCode(98 + buttons.length)
		            var button = $('<button class="ui-btn ui-icon-none ui-btn-icon-left ui-btn-inline ui-shadow ui-corner-all ui-mini"></button>');
	
					button.addClass('ui-btn-' + theme);
					button.attr('data-theme', theme);
	
					button.text(text);
		            button.appendTo(_elements.buttons.container);
		            
		            selectTheme(theme);
				}
	            
            }

			function init() {
				_elements.back.on('tap', function(event) {

					$.mobile.pages.pop();
				});

				_elements.buttons.container.on('tap', '.ui-btn', function (event) {
					selectTheme($(this).attr('data-theme')); 
				});
				
				_elements.buttons.add.on('tap', function(event) {
					_elements.popup.content.popup('close');
					
					addButton(_elements.price.val() + ' ' + _elements.currency.val());
				});
				
				/*
				_elements.buttons.add.on('tap', function(event) {
					var options = {
						dismissible: true,
						transition: "pop",
						positionTo: $(this)
					};

					_elements.popup.content.popup(options);
					_elements.popup.content.popup('open');
					
				});
				*/
				
				_elements.currency.on('change', function() {
					_elements.price.attr('placeholder', _elements.currency.val());
				});
				
				_elements.schedule.on('selection-end', function(event, selection) {

					if (selection.length > 0) {
						var first = $(selection[0]);
						var themeClass = sprintf('ui-page-theme-%s', _activeTheme);

						if (first.hasClass(themeClass))
							selection.removeClass(themeClass);
						else {
							selection.removeClassMatching('ui-page-theme-*').addClass(themeClass);
						}
					}

					
				});

				_element.on("pageinit", function(event) {
					_elements.currency.trigger('change');

					_elements.schedule.selectable({
						showMarquee: true,
						marqueeOpacity: 0.1,
						selectionThreshold: 0,
						selectables: 'table tbody td div'
						
					});

				});				


			}
	
			init();
        }
        
        return Module;
    
    });

    
})();

