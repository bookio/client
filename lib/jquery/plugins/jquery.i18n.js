(function ($) { 
	
	
	$.fn.i18n = function(i18n) {
		
	    return this.each(function () {
		    i18n.translate($(this));
	    });
	}
	

})(jQuery);





