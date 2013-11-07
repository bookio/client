define(['text!./msgbox.html', 'css!./msgbox'], function(html) {

	
	MsgBox = {};
	
	var _elements = {};
	
    function createPopup(html) {

		var popup = $('<div data-role="popup"></div>');

		
		var options = {};
		options.transition = 'pop';
		options.positionTo = 'window';		
		options.dismissable = true;
		options.afterclose = function(event) {
			$(event.target).remove();
		};


        popup.append(html);
        popup.appendTo($.mobile.activePage);
        popup.trigger('create');
        popup.popup(options);
        popup.popup('open');
        
        return popup;
    }
    
    MsgBox.show = function(options) {
	    var popup =  createPopup(html);
	    
	    popup.hookup(_elements);
	    
	    if (options) {
		    if (options.message) {
			    _elements.message.text(options.message);
		    }
		    
	    }
    };
	
    
    return MsgBox;

});