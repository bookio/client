(function ($) { 
	
	
	$.fn.i18n = function(i18n) {
		
	    return this.each(function () {
			$(this).find('[data-i18n]').each(function() {
				var text = i18n.text($(this).attr('data-i18n'));

				if (text)
					$(this).text(text);
			});
	    });
	}
	

})(jQuery);





