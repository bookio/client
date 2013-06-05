/*

@codekit-prepend "popover.js";
@codekit-prepend "../scripts/tools.js";

*/


define(['jquery',  'less!components/popup-menu', '../scripts/tools', './popover'], function($) {

	
	PopupMenu = function(options) {
	
		// To avoid confusion (or NOT)
		var self = this;

		var _defaults = {
			title:null,
    		placement:'auto'
		};

		var _options = $.extend({}, _defaults, options);
		var _items = [];
		var _popover = null;


        function clearItems() {
            _items = [];
        }
        
        

        
        function addMenuItem(item) {
        
            var text    = item.text;
            var click   = item.click;
            var text    = item.text;
            var context = item.context;
            var icon    = item.icon;
            
            var element = $('<li class="menuitem"></li>');

            if (isString(text)) {
                var div = $('<div class="text"></div>').appendTo(element);
                div.text(text);
            }
            
            if (isString(icon)) {
                var div = $('<div class="icon"><img/></div>').appendTo(element);
                var img = div.find('img');
                
                img.attr('src', icon);
                
                if (item.iconSize) {
                    div.css({height:item.iconSize});
                }
            }
            
            if (!isFunction(click))
                element.addClass('disabled');
                
            element.on('tap', function(event) {
           
                event.preventDefault();
                event.stopPropagation();
                
                self.hide();
                
                if (isFunction(click))
                    click(context);
            });
            
            if (item.style)
                element.addClass(item.style);

            _items.push(element);
        }
        
        function addCheckbox(item) {
                
            var click = item.click;
            var text = item.text;

            var template = 
                '<li class="checkbox">' + 
                    '<input type="checkbox" value="checked"></input>'+

                    '<label class="text">'+'adsfsdf'+
                    '</label>'+
                '</li>';
                
            var element = $(template);

            element.find('label').text(text).click(function() {
                click(context);
            });
            
            //$('<input type="checkbox" value="checked"/>').appendTo(element.find('label'));
            
            _items.push(element);

        }

        function addSeparator(item) {
        
            _items.push($('<li class="separator"></li>'));
        }

        function addText(item) {
        
            var text  = item.text;
            var style = item.style;
            
            var element = $('<li class="text"><div></div></li>');

            element.find('div').text(text);

            if (typeof style === "string")
                element.find('div').addClass(style);

            _items.push(element);
        }

        function addButton(item) {
        
            var text    = item.text;
            var click   = item.click;
            var context = item.context;

            var element = $('<li class="button"><button class="btn btn-primary bold large"></button></li>');

            element.find('button').text(text).click(function() {
                self.hide();
                
                if (isFunction(click))
                    click(context);
            });

            _items.push(element);
        }

        this.add = function(item) {
            if (item.type == 'menuitem') {
                addMenuItem(item);
            }
            else if (item.type == 'text') {
                addText(item);
            }
            else if (item.type == 'button') {
                addButton(item);
            }
            else if (item.type == 'checkbox') {
                addCheckbox(item);
            }
            else if (item.type == 'separator') {
                addSeparator(item);
            }
        }
        
    	this.show = function(position) {
    	
            var template = 
                '<div class="popup-menu">'+
                    '<ul></ul>'+
                '</div>';
                    	
            var element = $(template);
            var ul = element.find('ul');
            
            for (var i = 0; i < _items.length; i++) {
                ul.append(_items[i]);
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
    	
    	this.hide = function() {
        	_popover.hide();
    	}
    	
        
    };
	
	return PopupMenu;
	

});

  
