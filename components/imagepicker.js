


define(['text!./imagepicker.html', 'css!./imagepicker'], function(template) {

	
	ImagePicker = function(options) {
	
		// To avoid confusion (or NOT)
		var self = this;

		
		var _defaults = {
			selection: null,
			click: function(index) {},
			position: null,
			images: [],
			icons: []
		};

		var _options = $.extend({}, _defaults, options);
		var _elements = {};
        var _html = null;
        var _container = null;

        		
		
		function buildDOM() {
			
            var template = $('<div>' + 
            					'<div data-role="controlgroup"  data-type="horizontal">' + 
	            					'<button type="button" data-filter="*" data-theme="a">Allt</button>' +
	            					'<button type="button" data-filter=".Transport" data-theme="b">Transport</button>' +
	            					'<button type="button" data-filter=".Boende" data-theme="b">Boende</button>' +
	            					'<button type="button" data-filter=".Verktyg" data-theme="b">Verktyg</button>' +
	            					'<button type="button" data-filter=".Aktivitet" data-theme="b">Aktivitet</button>' +
	            					'<button type="button" data-filter=".Resurs" data-theme="b">Resurs</button>' +
	            					'<button type="button" data-filter=".Sport" data-theme="b">Sport</button>' +
            					'</div>' + 
            					'<div id="supercontainer">' +
            					   '<div id="container"></div>' + 
            				    '</div>'+
            				 '</div>').appendTo(_html);

            _container = template.find('#container');
            
            // Fill container with symbols
            for (var i = 0; i < _options.icons.length; i++) {
	        	var div = $('<div class="symbol ' + _options.icons[i].tags + '"></div>').appendTo(_container);

                var image = sprintf('../images/symbols/%s',_options.icons[i].image);
    			var img = $('<img/>').attr('src', image).appendTo(div);
    			
    			if (_options.selection && _options.selection == index) {
            		img.addClass('selected');
        		}

    			img.on('tap', i, function(event){
    			     _html.find('img').removeClass('selected');
    			     $(this).addClass('selected');

    			     if (isFunction(_options.click)) {
        			     _options.click(event.data);
    			     }
    			});

            }
			            			
		}
	    
        function init() {
            _html = $(template);
                
            buildDOM();
            
            var $filterButtons = _html.find('button');
            
            $filterButtons.click(function() {
            	var selector = $(this).attr('data-filter');
            	_container.isotope({ filter: selector });   
			});
                        			            
	           	                    
        };
        
        self.isotope = function(args) {
            _container.isotope(args);
            
        }

        
        self.html = function() {
            return _html;
        }
                
        init();
    };
	
	return ImagePicker;

});

  
