
define(['module', 'css!./css/styles.css'], function(module) {

	var _element = null;
    var _counter = 0;	
	var _timer = null;
	
	function hide() {
        
        if (_element == null)
            return;
        
        if (_timer != null) {
            clearTimeout(_timer);
            _timer = null;
        }    
        _element.fadeOut(400, function(){
            _element.remove();
            _element = null;
            
        });
	}
	

	function show() {

        if (_timer != null) {
            clearTimeout(_timer);
            _timer = null;
        }    

        var template = 
            '<div data-id="notify"></div>';
            
        if (_element == null) {
            _element = $(template);
            _element.appendTo($('body'));
        }
        else
            _element.empty();
        
        $.each(arguments, function(i, item) {
            var div = $('<div></div>');

            div.text(item);
            div.attr('data-id', sprintf('message-%d', i + 1));
            div.appendTo(_element);
        });

        _element.css({
            left:($(window).innerWidth() - _element.innerWidth()) / 2,
            top:($(window).innerHeight() - _element.innerHeight()) / 3
        });
        
        _element.fadeIn(200);
        
        _timer = setTimeout(hide, 3000);
    	
	}
	
	var module = {};
    
    module.hide = hide;
    module.show = show;
    	
    Notify = module;
    
    return module;

});