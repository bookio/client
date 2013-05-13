


define(['jquery',  'text!./imagepicker.html', 'less!./imagepicker', './popover', 'lib/jquery.isotope.min'], function($, template) {

	
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
        var _container = null;
        var _popover = null;
        		
		
		function buildDOM() {
			
            var template = $('<div><div class="btn-group" data-toggle="buttons-radio"><button type="button" class="btn btn-primary active">Allt</button><button type="button" class="btn btn-primary">Transport</button><button type="button" class="btn btn-primary">Boende</button><button type="button" class="btn btn-primary">Verktyg</button><button type="button" class="btn btn-primary">Aktivitet</button><button type="button" class="btn btn-primary">Resurs</button></div><legend></legend><div id="container" class="clearfix"></div></div>').appendTo(_html);
            
            var container = template.find('#container');
            
            for (var i = 0; i < _options.icons.length; i++) {
	        	var div = $('<div class="symbol ' + _options.icons[i].tags + '"></div>').appendTo(container);

        		// Add icon to div
        		
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
			
/*            var columns = Math.floor(Math.sqrt(_options.images.length)) + 1;
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
            }*/
            			
		}
		
    	
	    
        function init() {
            _html = $(template);
            
            if (_options.container)
                _html.appendTo(_options.container);
                
            buildDOM();
            
            $filterButtons = $('#btn-group button');
            
            $filterButtons.click(function(){
/*			var filters = [];
			    $checkboxes.filter(':checked').each(function(){
			      filters.push( this.value );
			    });
			    // ['.red', '.blue'] -> '.red, .blue'
			    filters = filters.join(', ');
			    $container.isotope({ filter: filters });*/
			    console.log('radiobutton');
			  });
            
            _container = $('#container');
            _container.isotope({
	            itemSelector : '.symbol'
	        });
	        
	        
            
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

  
