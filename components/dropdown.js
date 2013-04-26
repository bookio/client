define(['jquery', 'scripts/tools'], function($) {

	
	var _dropdown = null;
	
	function Module(options) {
	
		// To avoid confusion (or NOT)
		var self = this;

		var _defaults = {
		};
		
		var _options = $.extend({}, options, _defaults);
		var _items = [];


        function init() {
            // Make some routines public
            this.show = show;
            this.hide = hide;
            this.addDevider = addDevider;
            this.addItem = addItem;
        };
        
        
    	function show(x, y) {
            var template = 
                '<div class="dropdown">' + 
                    '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">' + 
                    '</ul>' + 
                '</div>';

    		addItem("Hej MEG", function(){alert("OK")});
    		addDevider();
    		addItem("Hej MEG igen", null);

            fadeOutDropdowns();

            var dropdown = $(template).appendTo($('body'));
            var menu = dropdown.find('.dropdown-menu');
            
            each(_items, function(item){

				var li = null;
					            
	            if (item.text == null) {
		            $('<li class="divider"></li>').appendTo(menu);
	            }
	            else if (!isFunction(item.callback)) {
		            li = $('<li class="disabled"><a tabindex="-1" href="#"></a></li>').appendTo(menu);
	            }
	            else {
		            li = $('<li><a tabindex="-1" href="#"></a></li>').appendTo(menu);
		            
		            li.find('a').text(item.text);
		            
	            }
	            
	            if (li != null) {
		            if (item.text != null)
				        li.find('a').text(item.text);
				        
		            li.click(function(event) {
			            item.callback();
		            });
		            
	            }
	            
            });
            
    		dropdown.css({left:x, top:y});
    		dropdown.addClass("open");
    		
    		_dropdown = dropdown;
    		
    	};
    	
    	function addDevider() {
	    	_items.push({text:null, callback:null});
    	}
    	
    	function addItem(text, callback) {
	    	_items.push({text:text, callback:callback})	
    	}
    	
    	function clear() {
	    	_items = [];
    	}
    	
    	function hide() {
        	hideDropdowns();
    	};
    	
        init();
        

        
    };
    
    
    function hideDropdowns() {
    	if (_dropdown != null) {
           _dropdown.remove();
        };

        _dropdown = null;        
        
    }

    function fadeOutDropdowns() {
		if (_dropdown !== null) {
			_dropdown.fadeOut(200, function(){
    			_dropdown.remove();
        	});
    	};
    	
        _dropdown = null;        
    }
    
    
	$(window).on('blur resize', function() {
		hideDropdowns();
	});

	$(document).on('click', function() {
    	fadeOutDropdowns();
	});
	
	
	// Finally, define the module
	Dropdown = Module;

	return Module;
	

});

  
