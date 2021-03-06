
(function($) {
	$.isEmpty = function(obj) {
		// Speed up calls to hasOwnProperty
		var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	    // null and undefined are "empty"
	    if (obj == null) 
	    	return true;
	
	    // Assume if it has a length property with a non-zero value
	    // that that property is correct.
	    if (obj.length > 0)    
	    	return false;
	    
	    if (obj.length === 0)  
	    	return true;
	
	    // Otherwise, does it have any properties of its own?
	    // Note that this doesn't handle
	    // toString and valueOf enumeration bugs in IE < 9
	    for (var key in obj) {
	        if (hasOwnProperty.call(obj, key)) 
	        	return false;
	    }
	
	    return true;
	}
	
	$.isString = function(obj) {
    	return Object.prototype.toString.call(obj) == '[object String]';
	}


	$.fn.removeClassMatching = function(match) {
	    return this.each(function () {
	
			$(this).removeClass (function (index, css) {
				var classNames = css.split(' ');
				var removeables = [];
				
				$.each(classNames, function(index, className) {
					if (className.match(match)) {
						removeables.push(className);	
						
					}
				});
				
				return removeables.join(' ');			
			});									

	
	    });

	}
	
	
	
	
})(jQuery);