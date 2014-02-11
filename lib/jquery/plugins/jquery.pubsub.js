// Small plugin to hook up elements that use the 'data-id' attribute

(function ($) { 

	function Pubsub() {
	
		var cache = {};
		
		this.publish = function(topic, args) {
		
			var callbacks = cache[topic];

			if (args == undefined)
				args = [];
			
			else if (!$.isArray(args))
				args = [args];
			
			if ($.isArray(cache[topic])) {
				$.each(cache[topic], function() {
					this.apply($, args);
				});
			}	
		}
		
		this.subscribe = function(topic, callback) {

	        if (!cache[topic])
	            cache[topic] = [];
	        
			cache[topic].push(callback);
		}
		
		this.unsubscribe = function(topic) {
			
			if (topic === undefined || topic === '*')
				cache = {};
			else
				delete cache[topic];
		}
	}
	
	$.fn.publish = function(topic, args) {
	    return this.each(function () {

			var pubsub = $(this).data('pubsub');
			
			if (!pubsub) {
				$(this).data('pubsub', pubsub = new Pubsub());
			}

			pubsub.publish(topic, args);
	    });
	}	
	
	$.fn.subscribe = function(topic, callback) {
	    return this.each(function () {

			var pubsub = $(this).data('pubsub');
			
			if (!pubsub) {
				$(this).data('pubsub', pubsub = new Pubsub());
			}

			pubsub.subscribe(topic, callback);
	    });
	}	

	$.fn.unsubscribe = function(topic) {
	    return this.each(function () {

			var pubsub = $(this).data('pubsub');
			
			if (pubsub) {
				pubsub.unsubscribe(topic);
			}

	    });
	}	


})(jQuery);





