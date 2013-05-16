/*

@codekit-prepend "popover.js";
@codekit-prepend "../scripts/tools.js";

*/


define(['jquery',  'less!components/itempicker', '../scripts/tools', './popover'], function($) {

	
	ItemPicker = function(options) {
	
		// To avoid confusion (or NOT)
		var self = this;

		var _defaults = {
			title:null,
    		columns:1,
    		placement:'auto',
    		items:[]
		};

		var _options = $.extend({}, _defaults, options);
		var _items = [];
		var _popover = null;

        function init() {
        };
        
        function clearItems() {
            _items = [];
        }
        function addItem(text, callback, context, state) {
            _items.push({text:text, context:context, callback:callback, state:state});
        }
        
    	function show(position) {
            var element = $('<div class="item-picker"></div>');

            var columns = _options.columns;
            var rows = Math.floor(_items.length / columns) + 1;
            var index = 0;
            
            for (var i = 0; i < rows; i++) {
                var row = $('<div class="item-picker-row"></div');
               
                element.append(row);
               
                for (var ii = 0; ii < columns; ii++) {
                    var index = i * columns + ii;
                    
                    if (index < _items.length) {
                	    var cell = $('<div class="item-picker-cell"></div>');
                	    var item = _items[index];
    
                	    // Attach the item to the element
                        cell.data(item);
                	    cell.html(item.text);
                        
                        if (!isFunction(item.callback))
                        	cell.addClass('disabled');
                        	
                        if (item.state) {
                            cell.addClass(item.state);
                        }
                                    	    
                	    if (isFunction(item.callback)) {
	                	    cell.on('tap', function(event) {
	                	       var item = $(this).data();
	                	       
	                	       hide();
	                	       
	                	       if (isFunction(item.callback))
	                    	       item.callback(item.context);
	                	    });
                	    }

                	    row.append(cell);
                        
                    }
                        
                }
            }
            
            var options = {};
            options.content = element;
            options.offset = 0;
            options.placement = _options.placement;
            options.title = _options.title;
            options.position = position;
            
            _popover = new Popover(options);
            _popover.show();
    	};
    	
    	function hide() {
        	_popover.hide();
    	}
    	
        init();

        // Make some routines public
        this.show = show;
        this.addItem = addItem;
        this.clearItems = clearItems;

        
    };
	
	return ItemPicker;
	

});

  
