


(function() {

    var dependencies = [
    	'../../lib/jquery/plugins/jquery.selectable.js',
    	'../../widgets/common/radiobuttons.js',
    	'../../widgets/common/checkboxes.js',
    	'../../widgets/common/list.js',
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
			

            _element.hookup(_elements, 'data-id');

            function fill() {
            }
            
            function chill() {
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

				
				_elements.groupname.on('input', function() {
					_elements.addgroupbutton.toggleClass('ui-disabled', _elements.groupname.val() == '');
				});				
				
				_elements.addgroupbutton.on('tap', function() {
					var newLi = document.createElement('li');
					newLi.innerHTML = "<a class='ui-btn ui-corner-all ui-icon-check ui-btn-icon-left'><h1>" + _elements.groupname.val() + "</h1><div class='ui-mini'>" + _elements.groupinfo.val() + "</div></a>";
					_elements.listviewgroups.append(newLi);
					
					// Blank out values
					_elements.addgroupbutton.toggleClass('ui-disabled');
					_elements.groupname.val('');
					_elements.groupinfo.val('');
					
					_elements.addgroupcontainer.collapsible("collapse");					
          		});


				_elements.productname.on('input', function() {
					_elements.addproductbutton.toggleClass('ui-disabled', _elements.productname.val() == '' || !$.isNumeric(_elements.productunits.val()));
				});
				
				_elements.productunits.on('input', function() {
					_elements.addproductbutton.toggleClass('ui-disabled', _elements.productname.val() == '' || !$.isNumeric(_elements.productunits.val()));
				});				

				_elements.addproductbutton.on('tap', function() {

					// Blank out values
					_elements.addproductbutton.toggleClass('ui-disabled');
					_elements.addproductcontainer.collapsible("collapse");					
					_elements.productname.val('');
					_elements.productinfo.val('');
					
          		});

				
			}

			function byggUppMinaErbjudanden() {
				var item = _elements.list.list('add', 'icon-left title subtitle');
				item.title('Månadsvis').icon('check').subtitle('Varje fredag');
				_elements.list.list('add', 'icon-left subtitle title').title('Månadsvis').icon('notext').subtitle('Varje fredag');
				_elements.list.list('add', 'icon-left subtitle title').title('Månadsvis').icon('none').subtitle('Varje fredag');
				_elements.list.list('add', 'icon-right subtitle title').title('Månadsvis').icon('plus').subtitle('Varje fredag');
				_elements.list.list('add', 'icon-right subtitle title image').title('Månadsvis').icon('plus').subtitle('Varje fredag');
				
				_elements.list.list('refresh');

			}
			
            this.init = function() {

				_element.trigger('create');
				
				byggUppMinaErbjudanden();
				
				
				initializeEvents();


				_elements.meg.val(2);
				
				
				_elements.page.on('pageinit', function() {
					// Set unit picker to default 'Minutes'
					_elements.unit.picker('select', 'minutes');	
				});
				

          
				
            }     

        }

        
        return Module;
    
    });

    
})();

