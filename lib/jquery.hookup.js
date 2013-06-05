// Small plugin to hook up elements that use the 'data-id' attribute


/*

$.fn.hookup = function(attribute, elements) {

    return this.each(function () {

        $(this).find('[' + attribute + ']').each(function() {
        	var name = $(this).attr(attribute);
        	
        	if (elements[name]) {
        		debugger;
        		if (isArray(elements[name]))
        			elements[name].push($(this));
        		else
	        		elements[name] = [elements[name], $(this)];
        	}
        	else
        		elements[name] = $(this);
        });

    });
}	

*/



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
            elements[$(this).attr(attribute)] = $(this);
        });

    });
}	





