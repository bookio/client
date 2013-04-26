


define(['jquery',  'text!./imagepicker.html', 'less!./imagepicker', './popover'], function($, template) {

	
	ImagePicker = function(options) {
	
		// To avoid confusion (or NOT)
		var self = this;

		
		var _defaults = {
			container: null,
			selection: null,
			click: function(index) {},
			images: []
		};

		var _options = $.extend({}, _defaults, options);
		var _elements = {};
        var _html = null;
        var _popover = null;
        		
		
		function buildDOM() {
			
            var table = $('<table></table>').appendTo(_html);
			
            var columns = Math.floor(Math.sqrt(_options.images.length)) + 1;
            var rows    = Math.floor(_options.images.length / columns) + 1;
            var index   = 0;

            columns = Math.min(10, columns);
                        
            for (var y = 0; y < rows; y++) {
                
                var tr = $('<tr></tr>').appendTo(table);
                
                for (var x = 0; x < columns; x++, index++) {
                    if (index >= _options.images.length)
                        break;
                    
                    var image = _options.images[index];
                                        
                    var td = $('<td></td>').appendTo(tr);
        			var img = $('<img/>').attr('src', image).appendTo(td);
 
        			if (_options.selection && _options.selection == index) {
            			img.addClass('selected');
        			}
        			
        			img.on('tap', index, function(event){
        			     _html.find('img').removeClass('selected');
        			     $(this).addClass('selected');

        			     if (isFunction(_options.click)) {
            			     _options.click(event.data);
        			     }
        			});
                }
            }
            			
		}
		
    	
	    
        function init() {
            _html = $(template);
            
            if (_options.container)
                _html.appendTo(_options.container);
                
            buildDOM();
        };
        
        
        self.show = function(position) {
            
            self.hide();
            
            _popover = new Popover({
                content: self.html()
            });
            
            _popover.show(position);            
        }
        
        self.hide = function() {
            if (_popover != null)
                _popover.hide();
                
            _popover = null;
        }
        
        self.html = function() {
            return _html;
        }
        
                
        init();
    };
	
	return ImagePicker;
	

});

  
