define(['css!./popover'], function() {

	
	Popover = function(options) {
	
	    var self = this;
	    var _popover = null;
	    var _options = null;
	    
	    function init() {
            var defaults = {
                position: null,
                placement:'auto',
                title:null,
                content:'<p>Popover</p>',
                offset:5
            };
        	
            _options = $.extend({}, defaults, options);
               		
            var template = 
               '<div class="popover hide">' + 
                   '<div class="arrow"></div>' + 
                   //'<div class="popover-inner">' + 
                       '<div class="popover-content">' + 
                       '</div>' + 
                   //'</div>' + 
               '</div>';
        
            var x = 0, y = 0;
            var placement = _options.placement; 
        
            fadeOutPopovers();
        
            var popover = $(template).appendTo($('body'));
            var content = popover.find('.popover-content');
            var arrow = popover.find('.arrow');
            var position = _options.position;
        
            popover.css({width:'auto', maxWidth:'none', zIndex:'1100'});
            content.css({padding:'2px'});
        
        	// Add title if any
            if (_options.title)
               $('<h3 class="popover-title"></h3>').text(_options.title).insertBefore(content);
                    
            content.html(_options.content);
        
            if (position.x && position.y) {
                x = position.x;
                y = position.y;
            }
            else {
                if (placement == 'auto') {
                    var windowWidth = $(window).innerWidth();
                    var windowHeight = $(window).innerHeight();
                    var popoverWidth = popover.outerWidth();
                    var popoverHeight = popover.outerHeight();
                    var offset = _options.offset;
                    
                    var fitLeft = position.offset().left - offset - popoverWidth > 0;
                    var fitRight = position.offset().left + position.outerWidth() + popoverWidth + offset < windowWidth;
                    var fitTop = position.offset().top - offset - popoverHeight > 0;
                    var fitBottom = position.offset().top + position.outerHeight() + popoverHeight + offset < windowHeight; 
                
                    if (fitTop && fitRight && fitLeft)
                        placement = 'top';
                    else if (fitBottom && fitRight && fitLeft)
                        placement = 'bottom';
                    else if (fitRight)
                        placement = 'right';
                    else	
                        placement = 'left';	            	
                }
                
                if (placement == 'top') {
                    x = position.offset().left + position.outerWidth() / 2;
                    y = position.offset().top;
                }
                else if (placement == 'bottom') {
                    x = position.offset().left + position.outerWidth() / 2;
                    y = position.offset().top + position.outerHeight();
                }
                else if (placement == 'right') {
                    x = position.offset().left + position.outerWidth();
                    y = position.offset().top + position.outerHeight() / 2;
                }
                else if (placement == 'left') {
                    x = position.offset().left;
                    y = position.offset().top + position.outerHeight() / 2;
                }
           }
        
           ////////////////
        
            var left = 0, top = 0, offset = _options.offset;
        
            if (placement == 'left') {
                left = x - popover.innerWidth() - offset;
                top  = y - popover.innerHeight() / 2;
            }
            if (placement == 'top') {
                left = x - popover.innerWidth() / 2;
                top  = y - popover.innerHeight() - offset;
            }
            if (placement == 'bottom') {
                left = x - popover.innerWidth() / 2;
                top  = y + offset;
            }
            if (placement == 'right') {
                left = x + offset; // popover.innerWidth() - offset;
                top  = y - popover.innerHeight() / 2;
            }
                        
        
            // Make sure we don't dissapear when clicked on            
            popover.on("mousedown.popover mouseup.popover", function(event){
                event.stopPropagation();
                event.preventDefault();
            });
        
        	$('body').on('touchstart.popover mousedown.popover', function(event) {
           	    fadeOutPopovers();
        	});
        
        	popover.css({left:left, top:top});
        	popover.addClass(placement);
            
            _popover = popover;
        }
        
        function show() {
            _popover.fadeIn(100);
            
        }
        
        function hide() {
        	fadeOutPopovers();
        }
        
        
        init();
        
        this.show = show;
        this.hide = hide;
        this.hidePopovers = hidePopovers;
        this.fadeOutPopovers = fadeOutPopovers;
	};


    function hidePopovers() {
       return;
        $('body').off('.popover');
        $('body').find('.popover').hide().remove();
    }
    
    function fadeOutPopovers() {
    
        $('body').off('.popover');
    
        $('body').find('.popover').fadeOut(200, function() {
            $(this).remove();    
        });
    }



	$(window).on('blur resize', function() {
		hidePopovers();
	});

    $.fn.popoverEx = function(params) {

       var args = arguments;

       return this.each(function () {
           var $this = $(this);
           var data = $this.data('popover');

           if (!data)
               $this.data('popover', (data = new Popover($this, params)));

           if (typeof params == 'string') {
               return data[params].apply(this, Array.prototype.slice.call(args, 1));
           }
       });
   }
	
	// And return it to RequireJS
   return Popover;    


});


