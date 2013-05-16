


define(['jquery',  'text!./imagepicker.html', 'less!./imagepicker', './popover', 'lib/jquery.isotope.min'], function($, template) {

	
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
        var _popover = null;
        		
		
		function buildDOM() {
			
            var template = $('<div><div class="btn-group" data-toggle="buttons-radio"><button type="button" class="btn btn-primary active" data-filter="*">Allt</button><button type="button" class="btn btn-primary" data-filter=".Transport">Transport</button><button type="button" class="btn btn-primary" data-filter=".Boende">Boende</button><button type="button" class="btn btn-primary" data-filter=".Verktyg">Verktyg</button><button type="button" class="btn btn-primary" data-filter=".Aktivitet">Aktivitet</button><button type="button" class="btn btn-primary" data-filter=".Resurs">Resurs</button><button type="button" class="btn btn-primary" data-filter=".Sport">Sport</button></div><div id="container"></div></div>').appendTo(_html);
            
            _container = template.find('#container');
            
            // Fill container with symbols
            for (var i = 0; i < _options.icons.length; i++) {
	        	var div = $('<div class="symbol ' + _options.icons[i].tags + '"></div>').appendTo(_container);

                var image = sprintf('images/symbols/%s',_options.icons[i].image);
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
            
            var $filterButtons = _html.find('.btn-group button');
            
            $filterButtons.click(function() {
            	var selector = $(this).attr('data-filter');
            	_container.isotope({ filter: selector });   
			});
                        			            
	        _popover = new Popover({
                content: _html,
                position: _options.position
            });
            
	           	                    
        };
        
        self.show = function() {       
                 
            _popover.show();            
            _container.isotope({ filter: '*' });   // Redraw, or else the symbols are displayed in a single column.... :/

        }
        
        self.hide = function() {
                	
            if (_popover != null)
                _popover.hide();
            
            _container.isotope('destroy');
            
            _popover = null;
        }
        
        self.html = function() {
            return _html;
        }
                
        init();
    };
	
	return ImagePicker;

});

  
