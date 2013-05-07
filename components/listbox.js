


define(['jquery',  'text!./listbox.html', 'less!./listbox'], function($, template) {

	
	ListBox = function(settings) {
	
		// To avoid confusion (or NOT)
		var self = this;

		var _defaults = {
			container: null,
			selection: 'single',
			columns: ['name', 'email']
		};

		var _settings = $.extend({}, _defaults, settings);
		var _elements = {};
        var _html = null;
        		
		
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
            
            tr.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {
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

            if (_settings.container)
                _html.appendTo(_settings.container);
            
            _elements.thead = _html.find('thead');    
            _elements.tbody = _html.find('tbody');    


            enableListeners();
            updateDOM();
        };
        
        
        self.html = function() {
            return _html;
        }
        
        self.reset = function() {
            _elements.thead.empty();
            _elements.tbody.empty();
            
        }
        
        self.add = function(item) {
        
            if (isArray(item))
                addMany(item);
            else
                addOne(item);
            
        }
                
        init();
    };
	
	return ListBox;
	

});

  
