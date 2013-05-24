// Small plugin to hook up elements that use the 'data-id' attribute


define(['jquery'], function($) {


    $.fn.hookup = function(attribute, elements) {

        return this.each(function () {

            $(this).find('[' + attribute + ']').each(function() {
	            elements[$(this).attr(attribute)] = $(this);
            });

        });
    }	
});

