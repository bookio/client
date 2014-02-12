
(function ($) { 

	function Devoke() {
	
		var _callbacks = {};
		
		this.invoke = function(name, args) {
		
			if (args == undefined)
				args = [];
			
			else if (!$.isArray(args))
				args = [args];
			
			var callback = _callbacks[name];
			
			if ($.isFunction(callback)) {
				callback.apply($, args);
			}	
		}
		
		this.define = function(name, callback) {
			_callbacks[name] = callback;
		}
		
	}
	
	$.fn.invoke = function(name, args) {
	    return this.each(function () {

			var devoke = $(this).data('devoke');
			
			if (devoke != undefined)
				devoke.invoke(name, args);

	    });
	}	
	
	$.fn.define = function(name, callback) {
	    return this.each(function () {

			var devoke = $(this).data('devoke');
			
			if (!devoke) {
				$(this).data('devoke', devoke = new Devoke());
			}

			devoke.define(name, callback);
	    });
	}	

})(jQuery);





