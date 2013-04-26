

(function($) {


    $.popupMenu = function(options) {


        var plugin = this;
        
        var defaults = {
            maxWidth:480,
            minWidth:320
        };
        var items = [];

        
        var init = function() {
            plugin.options = $.extend({}, defaults, options);
        };

        
        plugin.clear = function() {
            items = [];
        }

        
        plugin.addItem = function(text, click, context) {
        
            var element = $('<li class="menuitem"><label></label></li>');

            element.find('label').text(text).click(function() {
                plugin.hide();
                click(context);
            });

            items.push(element);
            return this;
        }
        
        plugin.addCheckbox = function(text, click, context) {
                
            var element = $('<li class="checkbox"><label></label></li>');

            element.find('label').text(text).click(function() {
                click(context);
            });
            
            $('<input type="checkbox" value="checked"/>').appendTo(element.find('label'));
            
            items.push(element);

        }

        plugin.addSeparator = function() {
        
            items.push($('<li class="divider"></li>'));
        }

        plugin.addText = function(text, style) {
        
            var element = $('<li class="text"><label></label></li>');

            element.find('label').text(text);

            if (typeof style === "string")
                element.find('label').addClass(style);

            items.push(element);
        }

        plugin.addButton = function(text, click, context) {
        
            var element = $('<li class="button"><button class="btn btn-primary bold large"></button></li>');

            element.find('button').text(text).click(function() {
                plugin.hide();
                click(context);
            });

            items.push(element);
        }

    	plugin.show = function(left, top) {
            var template = 
                '<div class="mx-popup-menu has-tip anchor-client">'+
                    '<ul></ul>'+
                '</div>';
                
            plugin.hide();

            var popup = $(template).appendTo($('body'));
			var ul = popup.find('ul');
			
            for (var i = 0; i < items.length; i++) {
                items[i].appendTo(ul);
            }

            // Make sure we don't dissapear when clicked on            
            popup.click(function(event){
                event.stopPropagation();
            });

            //popup.find('li').css({maxWidth: plugin.options.maxWidth});
            //popup.find('li').css({minWidth: plugin.options.minWidth});
            popup.css({maxWidth: plugin.options.maxWidth});
            popup.css({minWidth: plugin.options.minWidth});
            
    		popup.css({left:left, top:top});
    		popup.fadeIn(100);
    	};
    	
    	plugin.hide = function() {

            $('body').find('.mx-popup-menu').fadeOut(200, function(){
                $(this).remove();    
            });
    	}
    	

        init();

    }
	$(window).on('blur resize', function() {
		$('body').find('.mx-popup-menu').remove();
	});

	$('body').on('click', function() {

        $('body').find('.mx-popup-menu').fadeOut(200, function(){
            $(this).remove();    
        });
	});
	
})(jQuery);


