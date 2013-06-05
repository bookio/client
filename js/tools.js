

define(['js/sprintf'], function() {

	
	hsla = function(h, s, l, a)
	{
		return sprintf('hsla(%d,%f%%,%f%%,%f)', h, s*100, l*100, a);
	}
	
	rgba = function(r, g, b, a)
	{
		return sprintf('rgba(%d,%d,%d,%f)', r, g, b, a);
	}

    each = function(array, func) {
        if (array) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i] && func(array[i], i, array)) {
                    break;
                }
            }
        }
    }
    
	isArray = function(obj) {
    	return Object.prototype.toString.call(obj) == '[object Array]';
    };

    isString = function(obj) {
    	return Object.prototype.toString.call(obj) == '[object String]';
    };
    
    isFunction = function(obj) {
    	return $.isFunction(obj);
    };

    isNumeric = function(obj) {
        return $.isNumeric(obj);
    };
    
    isTouch = function() {
        return (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
    };

	console.log('tools.js loaded...');

});
