(function ($) { 
    $.fn.hitTest = function (x, y) { 
        return (x > this.offset().left && x < this.offset().left + this.width()) && (y > this.offset().top && y < this.offset().top + this.height()); 
    }; 
})(jQuery);
