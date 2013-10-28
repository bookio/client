// Small plugin to hook up elements that use the 'data-id' attribute

(function ($) { 
	$.fn.hookup = function() {
	
		var attribute, elements;
		
		if (arguments.length == 1) {
			elements = arguments[0];	
		}
		else if (arguments.length == 2) {
			attribute = arguments[0];	
			elements = arguments[1];	
		}
		
		if (elements == undefined) {
			alert('Foo on You!');
			return;
			
		}
		
		if (attribute == undefined) {
			attribute = 'data-hook';
		}
		
	    return this.each(function () {
	
	        $(this).find('[' + attribute + ']').each(function() {
	
	            var names = $(this).attr(attribute).split('.');
	            var object = elements;
	
	            for (var i = 1; i < names.length; i++) {
	                var name = names[i-1];
	                
	                if (!object[name])
	                    object[name] = {};
	
	                object = object[name];
	            }
	            
	            object[names[names.length - 1]] = $(this);
	        });
	
	    });
	}	


})(jQuery);





