


define(['jquery',  'text!./listbox.html', 'less!./listbox'], function($, template) {

	
	var ListBox = function(element, settings) {
	
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
		
		function adjustHeader() {
		}

        function init() {
            _html = $(template);
            _html.appendTo(_container);
            
            _elements.list = _html.find('.list');
            _elements.footer = _html.find('.footer');
            _elements.header = _html.find('.header');
            _elements.thead = _elements.list.find('thead');    
            _elements.tbody = _elements.list.find('tbody');    


            /*
            var x = _html.innerHeight();
            var y = _elements.footer.outerHeight(true);
            console.log("%f %f", x, y);
            _elements.list.css({height:x - y});
            */
            
            
            $.each(_settings.columns, function(index, item) {
                $('<div></div>').appendTo(_elements.header).text(item);
            });
            
            console.log(_elements.header.outerHeight());

            enableListeners();
            updateDOM();
        };
        
        
        plugin.html = function() {
            return _html;
        }
        
        plugin.reset = function() {
            _elements.tbody.empty();
            
        }
        
        plugin.add = function(param) {
            if (isArray(param))
                addMany(param);
            else
                addOne(param);
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



  
