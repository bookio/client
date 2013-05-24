


define(['jquery',  'text!./listbox.html', 'less!./listbox'], function($, template) {

	
	var ListBox = function(element, settings) {
	
		var plugin = this;

		var _settings = {
			selection: 'single',
			columns: ['name', 'email'],
			add: null,
			remove: null,
			click: null
		};

		var _elements = {};
        var _html = null;
        var _container = element;
        		
		$.extend(_settings, settings);
		
		function updateDOM() {
		}
	    
	    function enableListeners() {
	    
	       _elements.add.on('mouseup touchend', function(event) {
    	       if (isFunction(_settings.add))
    	           _settings.add.call(plugin);
	       });
	       
	       _elements.remove.on('mouseup touchend', function(event) {
    	       if (isFunction(_settings.remove))
    	           _settings.remove.call(plugin);
    	       
	       });
		}

        function addOne(item) {
            var tr = $('<tr class="tablerow"></tr>');

            $.each(_settings.columns, function(index, name) {
                var td = $('<td class="tablecell"></td>');
                td.text(item[name]);
                td.appendTo(tr);                
            });

            tr.appendTo(_elements.tbody);

            // Attach the item to the row
            tr.data(item);
            
            // Listen to clicks
            tr.on('touchstart mousedown', function(event) {
                _elements.tbody.find('tr').removeClass('selected');
                $(this).addClass('selected');
                
                if (isFunction(_settings.click))
                    _settings.click.call(plugin);
                    
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
            return _elements.tbody.find('tr.selected').index();
        }

        plugin.item = function(index) {
            return _elements.tbody.find('tr').eq(index).data();
        }

        plugin.api = function() {
            return plugin;
        }
        
        plugin.add = function(param) {
            if (isArray(param))
                addMany(param);
            else
                addOne(param);
        }
        
        plugin.remove = function(index) {
            _elements.tbody.find('tr').eq(index).remove();
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



  
