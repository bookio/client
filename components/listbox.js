


define(['jquery',  'text!./listbox.html', 'less!./listbox'], function($, template) {

	
	ListBox = function(params) {
	
		// To avoid confusion (or NOT)
		var self = this;

		var _defaults = {
			container: null
		};

		var _params = $.extend({}, _defaults, params);
		var _elements = {};
        var _html = null;
        		
		
		function updateDOM() {
			
		}
		
	    
	    function enableListeners() {
			
		}
		
        function init() {
            _html = $(template);

            if (_params.container)
                _html.appendTo(_params.container);
            
            _elements.thead = _html.find('thead');    
            _elements.tbody = _html.find('tbody');    

            self.reset();
            self.add(['Magnus Egelberg', 'magnus@bookio.com']);
            self.add(['Joakim Bengtson', 'joakim@bookio.com']);
            self.add(['Anders Petterson', 'joakim@bookio.com']);
            self.add(['Lisa Nilsson', 'joakim@bookio.com']);
            self.add(['Per Hultén', 'joakim@bookio.com']);
            self.add(['Annika Bunke', 'joakim@bookio.com']);
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
        self.add = function(data) {
            var tr = $('<tr class="tablerow"></tr>');

            $.each(data, function(index, item) {
                var td = $('<td class="cell"></td>');
                td.text(item);
                td.appendTo(tr);                
            });

            tr.appendTo(_elements.tbody);
            
        }
                
        init();
    };
	
	return ListBox;
	

});

  
