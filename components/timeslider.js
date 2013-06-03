define(['jquery', 'less!./timeslider', 'components/notify'], function($) {

	
	var Notify = require('components/notify');
	
	TimeSlider = function(container, options) {
	
		var self = this;

		var _defaults = {
			appendTo: $('body'),
			scroll: null,
			lengthChanged: null,
			positionChanged: null,
			rangeChanged: null,
			sliderDblClicked: null
		};
		
		var _options = $.extend({}, _defaults, options);
		var _elements = {};
		var _position = 0;  // Start at position Now
		var _length = 1;  // Default width is one 'time slot'
		var _range = 14;
		var _scrollTimer = null;
		var _setNeedsLayout = false;
		var _busy = false;
		
		this.position = function(value) {
    		if (value == undefined)
    		    return _position;
    		
    		_setNeedsLayout = true;
    		return _position = value;
		}
		
		this.range = function(value) {
    		if (value == undefined)
    		    return _range;
    		    
    		_setNeedsLayout = true;
            return _range = value;
		}
		
        this.length = function(value) {
        	if (value == undefined)
        	    return _length;
            
    		_setNeedsLayout = true;
            return _length = value;
        }
        
		
        function init() {
          
            var template = 
                '<div class="time-slider">'+
                    '<div class="left scroll">'+
                        '<i class="icon-chevron-left"/>'+
                    '</div>'+
                    
                    '<div class="slider-container">'+
                    	'<div class="slider">'+
    	                	'<div class="gripper">'+
    			             '</div>'+
    		             '</div>'+
                    '</div>'+
                    
                    '<div class="right scroll">'+
                        '<i class="icon-chevron-right"/>'+
                    '</div>'+
                '</div>';
            
            var root = $(template);
            
            container.append(root);

            _elements.root = root;
            _elements.slider = _elements.root.find('.slider');
            _elements.gripper = _elements.root.find('.gripper');
            
            // Prevent IE bug and set height
            _elements.slider.css({top:0, height:_elements.slider.parent().innerHeight()});
            
            var gripperCss = {};
            gripperCss.width = Math.floor(_elements.slider.innerHeight() * 0.60);
            gripperCss.height = gripperCss.width;
            gripperCss.top = (_elements.slider.innerHeight() - gripperCss.height) / 2;
            gripperCss.right = gripperCss.top;
            
            // Double-click resets slider to starting position (Now on the time scale)
            _elements.slider.on('doubletap', function(event) {
            
            	if (isFunction(_options.sliderDblClicked))
	                _options.sliderDblClicked();

            });

            _elements.root.on('removed', function(){
                
                // Clean up notifications
                Notifications.off('.timeslider');
                
                // And some more...   
                $(window).off('.timeslider'); 
                $(document).off('.timeslider'); 
            });
            
            Notifications.on('updateUI.timeslider', function(){

            	if (_setNeedsLayout && !_busy)
    		        positionSlider();
        
        		_setNeedsLayout = false;

            });

            _elements.gripper.css(gripperCss);
            
    	};

/*        function valueChanged() {
           // Notify.show('Position: ' + _position + ', length: ' + _length);
            
        }    	*/
    	
	    function startScrolling(delta) {
	       function scroll() {
	           if (isFunction(_options.scroll))
    	           _options.scroll(delta);
	           //valueChanged();
            }
    	    if (_scrollTimer == null) {
        	    _scrollTimer = setInterval(scroll, 80);
    	    }
	    }
	    
	    
	    function stopScrolling() {
    	    if (_scrollTimer != null) {
        	    clearInterval(_scrollTimer);
    	    }
    	    
    	    _scrollTimer = null;
	    }
	    
/*	    
	    function positionSlider(animationSpeed) {
    	    var slider = _elements.slider;
    	    var parent = slider.parent();
			var factor = parent.innerWidth() / _range;

			var css = {};
			css.left = Math.round(_position * factor);
			css.width = Math.round(_length * factor);
			
			if (animationSpeed != undefined && animationSpeed)
                slider.transition(css, animationSpeed, 'easeInOutBack');
            else
                slider.css(css);
        }
*/
    	
    	
    	function positionSlider(animationSpeed) {
    	    var slider = _elements.slider;
    	    var parent = slider.parent();
    	    _range = Math.floor(parent.innerWidth() / 80);
			var blockSize = Math.max(Math.floor(parent.innerWidth() / _range), 80);

			var css = {};
			css.left = Math.round(_position * blockSize);
			css.width = Math.round(_length * blockSize);
			
			if (animationSpeed != undefined && animationSpeed)
                slider.transition(css, animationSpeed, 'easeInOutBack'/*'ease-in-out'*/);
            else
                slider.css(css);
        }
    	
    	
    	function enableScrolling() {
            
            function scroll(delta) {
                startScrolling(delta);
                
                $(document).on(isTouch() ? 'touchend.timeslider' : 'mouseup.timeslider', function(){
                    stopScrolling();
                    $(document).off(".timeslider");
                });
	            
            }
            
            _elements.root.find('.scroll.left').on(isTouch() ? 'touchstart' : 'mousedown', function(){
	            scroll(-1);
            });

            _elements.root.find('.scroll.right').on(isTouch() ? 'touchstart' : 'mousedown', function(){
	            scroll(1);
            });
        	
    	};
        
        $(window).on("resize.timeslider", function(event) {
        	positionSlider();
        });
        
		function enableDragDrop() {
		
            var slider = _elements.slider;
			var parent = slider.parent();
                
            
            slider.on(isTouch() ? 'touchstart' : 'mousedown', function(event){

				var offsetFromLeft = event.originalEvent.pageX - slider.offset().left;
				var offsetFromRight = slider.outerWidth() - offsetFromLeft;

				event.preventDefault();
                
                var dragging = (offsetFromLeft < slider.innerWidth() - slider.innerHeight())
                
                $(document).on("mousemove.timeslider touchmove.timeslider", function(event){

	                _busy = true;

					var left = slider.position().left;
					var width = slider.outerWidth();
					var css = {};
					
					var leftMargin = _elements.root.find('.left').outerWidth(); 
					var rightMargin = _elements.root.find('.right').outerWidth();

				    if (dragging) {
					    left = event.originalEvent.pageX - parent.offset().left - offsetFromLeft;
					    left = Math.max(left, -leftMargin); 
					    left = Math.min(left, parent.innerWidth() - slider.outerWidth() + leftMargin); 
					    slider.css({left:left});

    				    if (left < 0)
    				        startScrolling(-1);
    				    else if (left + width > parent.innerWidth())
    				        startScrolling(1);
    				    else
    				        stopScrolling();

				    }
				    else {
				    	width = event.originalEvent.pageX - parent.offset().left - slider.position().left + offsetFromRight;
					    width = Math.max(width, slider.innerHeight() * 1.5); 
					    width = Math.min(width, parent.innerWidth() - slider.position().left + rightMargin); 
					    slider.css({width:width});
				    }
				    

				    var length;
				    var parentWidth = slider.parent().innerWidth();
				     
				    length = Math.floor((width / parentWidth) * _range + 0.5);
				    length = Math.max(length, 1);
				    
				    var position; 
				    position = Math.floor((left / parentWidth) * _range + 0.5);
				    position = Math.min(position, _range - length);
				    position = Math.max(position, 0);
				    
				    if (position != _position) {
				    	_position = position;
				    	
				    	if (isFunction(_options.positionChanged))
				    		_options.positionChanged();
					    
				    }

				    if (length != _length) {
				    	_length = length;
				    	
				    	if (isFunction(_options.lengthChanged))
				    		_options.lengthChanged();
					    
				    }
				    
                    //valueChanged();

                });
                
                $(document).on("mouseup.timeslider touchend.timeslider", function(event){
				    positionSlider(300);
				    stopScrolling();
				    
                    $(document).off(".timeslider");
                    
                    dragging = false;
                    _busy = false;
                    
                    Notify.hide();

                });
            });

    		
		}
    	
    	
        init();
        enableDragDrop();
        enableScrolling();
        positionSlider();
        
    };
	
	return TimeSlider;
	

});

  
