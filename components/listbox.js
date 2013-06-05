


define(['jquery',  'text!./listbox.html', 'less!./listbox'], function($, template) {

	
	var ListBox = function(element, settings) {
	
		var plugin = this;

		var _settings = {
			selection: 'single',
			columns: [{name:'name', width:'20%'}],
			add: null,
			remove: null,
			click: null,
			dblclick: null
		};

		var _elements = {};
        var _html = null;
        var _container = element;
        		
		$.extend(_settings, settings);
		
		function updateDOM() {
		}
	    
	    function enableListeners() {
	    
	       _elements.add.on('tap', function(event) {
    	       if (isFunction(_settings.add))
    	           _settings.add.call(plugin);
	       });
	       
	       _elements.remove.on('tap', function(event) {
    	       if (isFunction(_settings.remove))
    	           _settings.remove.call(plugin);
    	       
	       });
		}

        function addOne(item) {
            var tr = $('<tr class="tablerow"></tr>');

            $.each(_settings.columns, function(index, column) {
                var td = $('<td class="tablecell"></td>');
                td.text(item[column.name]);
    
                if (column.width)
                    td.css({width:column.width});

                td.appendTo(tr);     
            });

            tr.appendTo(_elements.tbody);

            // Attach the item to the row
            tr.data(item);
            
            // Listen to clicks
            tr.on('tap', function(event) {
                _elements.tbody.find('tr').removeClass('selected');
                $(this).addClass('selected').scrollintoview();
                
                if (isFunction(_settings.click))
                    _settings.click.call(plugin);
                    
            });
            
            // Listen to clicks
            tr.on('doubletap', function(event) {
                if (isFunction(_settings.click))
                    _settings.dblclick.call(plugin);
                    
            });
        }
        
        function addMany(items) {
            $.each(items, function(index, item) {
                addOne(item);
            });
        }
		
        function init() {
            _html = $(template);
            _html.appendTo(_container);
            _html.hookup('data-id', _elements);
            
            enableListeners();
            updateDOM();
        };
        
        
        plugin.html = function() {
            return _html;
        }
        
        plugin.reset = function() {
            _elements.tbody.empty();
        }

        plugin.index = function() {
            if (arguments.length == 0)  
                return _elements.tbody.find('tr.selected').index();
            
            if (arguments.length == 1) {
                var index = arguments[0]; 
                var rows = _elements.tbody.find('tr');

                rows.removeClass('selected');
                rows.eq(index).addClass('selected').scrollintoview();
            }

        }
        
        plugin.selection = function() {
            if (arguments.length == 0) {
                var array = [];
                
                _elements.tbody.find('tr.selected').each(function(index) {
                    array.push($(this).index());
                });
                
                return array;
                
            }
            
            if (arguments.length == 1) {
                var selection = arguments[0];
                var rows = _elements.tbody.find('tr'); 

                // Clear selection                
                rows.removeClass('selected');
                
                // Select one by one
                selection.each(function(index, item) {
                    rows.eq(item).addClass('selected');
                });
            }
        }


        plugin.item = function() {
            if (arguments.length == 1) {
                var index = arguments[0];
                return _elements.tbody.find('tr').eq(index).data();
            }
            if (arguments.length == 2) {
                var index = arguments[0];
                var item = arguments[1];
                var tr = _elements.tbody.find('tr').eq(index);

                tr.data(item); 
                
                tr.find('td').each(function(index) {
                    $(this).text(item[_settings.columns[index].name]);
                });
            }
        }

        plugin.api = function() {
            return plugin;
        }

        plugin.count = function() {
            return _elements.tbody.find('tr').length;
        }
        
        plugin.add = function(param) {
            if (isArray(param))
                addMany(param);
            else
                addOne(param);
        }
    
        plugin.remove = function(index) {

            var selindex = _elements.tbody.find('tr.selected').index();

            _elements.tbody.find('tr').eq(index).remove();
            
            if (selindex >= 0) {
                var rows = _elements.tbody.find('tr');
                
                if (selindex >= rows.length)
                    selindex = rows.length - 1;
                
                rows.removeClass('selected');
                rows.eq(selindex).addClass('selected').scrollintoview();
                    
            }
        }
                
        init();
    };

    $.fn.listbox = function(params) {

        var retval, args = arguments;

        if (arguments.length == 0) {
            return this.length > 0 ? $(this[0]).data('listbox') : undefined;
        }
            
        this.each(function () {
            var $this = $(this);
            var data = $this.data('listbox');
            
            if (!data)
                $this.data('listbox', (data = new ListBox($this, params)));

            if (typeof params == 'string') {
                retval = data[params].apply(this, Array.prototype.slice.call(args, 1));
                
                if (retval != undefined)
                    return false;
            }
        });
        
        return retval != undefined ? retval : this;
    }

});



  
