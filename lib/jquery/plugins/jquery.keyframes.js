(function ($) {

	function animateKeyframes(options, callback) {
    	var self = this;
    	var animations = $.isArray(options) ? options : options.split(',');
    	
    	if (animations.length > 0) {
			var animation = animations.shift().trim();

			if (animation.length > 0) {
				
				function animate(animation) {
					$(self).css({
						'animation':animation,
						'-o-animation':animation,
						'-ms-animation':animation,
						'-moz-animation':animation,
						'-webkit-animation':animation
					});
				}
				
				$(self).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(event) {
					// Clear previous animation
					animate('');

					// Must use setTimeout to call myself again
					setTimeout(function() {
						animateKeyframes.call(self, animations, callback);
					}, 1);
		        });

				// Do the animation
				animate(animation);		        
			}
			else
				animateKeyframes(animations, callback);
		}
		else if ($.isFunction(callback)) {
			callback.call(self);					
		}
	}	

	$.fn.keyframes = function(options, callback) {

	    return this.each(function() {
	    	animateKeyframes.call(this, options, callback);
	    });
	}	



})(jQuery);