define(['less!components/notify'], function() {

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
	

	function show(message1, message2) {

        if (_timer != null) {
            clearTimeout(_timer);
            _timer = null;
        }    

        var template = 
            '<div class="notify">'+
            '<div class="message1">message1 goes here</div><div class="message2">message2 goes here</div>'
            +'</div>';
        if (_element == null) {
            _element = $(template);
            _element.appendTo($('body'));
        }
   
        var line1 = _element.find('.message1');
        message1 = message1.toLowerCase();
        line1.text(message1);

        var line2 = _element.find('.message2');
        line2.text(message2);
        
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