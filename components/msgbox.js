define(['text!./msgbox.html', 'css!./msgbox'], function(html) {

	
	MsgBox = {};
			
	MsgBox.error = function(msg) {
		MsgBox.show({
			message: msg,
			icon: 'error',
			buttons: [{text:"OK"}]
		});
	}

	MsgBox.information = function(msg) {
		MsgBox.show({
			message: msg,
			icon: 'information',
			buttons: [{text:"OK"}]
		});
	}

	MsgBox.warning = function(msg) {
		MsgBox.show({
			message: msg,
			icon: 'warning',
			buttons: [{text:"OK"}]
		});
	}
	
    MsgBox.show = function(options) {
    
		var popup = $(html); //'<div data-role="popup" data-theme="c"></div>');
		
		var msgBoxOptions = {};
		var elements = {};

		msgBoxOptions.icon = 'information';
		msgBoxOptions.buttons = [{text:"OK"}];
		
		$.extend(msgBoxOptions, options);  	

//        popup.append(html);
	    popup.hookup(elements);

	    if (msgBoxOptions) {

	    	if (isString(msgBoxOptions.icon)) {
	    		elements.icon.image.addClass("icon-" + msgBoxOptions.icon);
	    	}

		    if (isString(msgBoxOptions.title)) {
		    	elements.text.append(sprintf('<p data-hook="title">%s</p>', msgBoxOptions.title));
		    }

		    if (isString(msgBoxOptions.message)) {
		    	elements.text.append(sprintf('<p data-hook="message">%s</p>', msgBoxOptions.message));
		    }
		    
		    if (msgBoxOptions.buttons) {
			    $.each(msgBoxOptions.buttons, function(i, button) {

				    var element = $(sprintf('<a data-role="button" data-mini="true" data-inline="true">%s</a>', button.text));
				    
				    elements.buttons.append(element);
				    
				    element.on('tap', function() {
					    popup.popup('close');	
					    
					    if (isFunction(button.click)) {
				    		button.click();
					    }				    	
				    });

			    });
		    }
	    }

		var popupOptions = {};
		popupOptions.transition = 'pop';
		popupOptions.positionTo = 'window';		
		popupOptions.dismissible = false;
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