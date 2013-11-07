define(['text!./msgbox.html', 'css!./msgbox'], function(html) {

	
	MsgBox = {};
				
    MsgBox.show = function(options) {
    
		var popup = $('<div data-role="popup"></div>');
		
		var msgBoxOptions = {};
		var elements = {};

		msgBoxOptions.message = "Woff!";
		msgBoxOptions.icon = ''; //warning';
		msgBoxOptions.buttons = [{text:"OK"}];
		
		$.extend(msgBoxOptions, options);  	

        popup.append(html);
	    popup.hookup(elements);

	    if (msgBoxOptions) {

	    	if (msgBoxOptions.icon) {
	    		elements.icon.image.addClass("icon-" + msgBoxOptions.icon);
	    	}

		    if (msgBoxOptions.message) {
			    elements.message.text(msgBoxOptions.message);
		    }
		    
		    if (msgBoxOptions.buttons) {
			    $.each(msgBoxOptions.buttons, function(i, button) {

				    var element = $(sprintf('<a data-hook="back" data-role="button" data-mini="true" data-inline="true">%s</a>', button.text));
				    
				    elements.buttons.append(element);
				    
				    element.on('tap', function() {
					    popup.popup('close');	
					    
					    if (isFunction(msgBoxOptions.buttons[i].select)) {
				    		msgBoxOptions.buttons[i].select();
					    }				    	
				    });

			    });
		    }
	    }

		var popupOptions = {};
		popupOptions.transition = 'pop';
		popupOptions.positionTo = 'window';		
		popupOptions.dismissable = false;
		popupOptions.afterclose = function(event) {
			// Remove from page when done
			$(event.target).remove();
		};


        popup.appendTo($.mobile.activePage);
        popup.trigger('create');
        popup.popup(popupOptions);
        popup.popup('open');
    };
	
    
    return MsgBox;

});