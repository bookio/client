


define(['jquery',  'text!./listbox.html', 'less!./listbox'], function($, template) {

	
	var ListBox = function(element, settings) {
	
		// To avoid confusion (or NOT)
		var plugin = this;

		var _defaults = {
			selection: 'single',
			columns: ['name', 'email']
		};

		var _settings = $.extend({}, _defaults, settings);
		var _elements = {};
        var _html = null;
        var _container = element;
        		
		
		function updateDOM() {
		}
		
	    
	    function enableListeners() {
		}

        function addOne(item) {
            var tr = $('<tr class="tablerow"></tr>');

            $.each(_settings.columns, function(index, name) {
                var td = $('<td class="cell"></td>');
                td.text(item[name]);
                td.appendTo(tr);                
            });

            tr.appendTo(_elements.tbody);
            
            tr.on('touchstart mousedown', function(event) {
                _elements.tbody.find('tr').removeClass('selected');
                $(this).addClass('selected');
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
            
            _elements.thead = _html.find('thead');    
            _elements.tbody = _html.find('tbody');    

            enableListeners();
            updateDOM();
        };
        
        
        plugin.html = function() {
            return _html;
        }
        
        plugin.reset = function() {
            _elements.thead.empty();
            _elements.tbody.empty();
            
        }
        
        plugin.add = function(item) {
            if (isArray(item))
                addMany(item);
            else
                addOne(item);
        }
                
        init();
    };



    $.fn.listbox = function(params) {

        var args = arguments;
        
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('listbox');
            
            if (!data)
                $this.data('listbox', (data = new ListBox($this, params)));

            if (typeof params == 'string') {
                return data[params].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    }

});



  
