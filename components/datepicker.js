


define(['jquery',  'text!./datepicker.html', 'less!./datepicker', './popover'], function($, template) {

	
	DatePicker = function(options) {
	
		// To avoid confusion (or NOT)
		var self = this;

		var _defaults = {
			container: null,
			date: new Date(),
			dateChanged: null
		};

		var _date = new Date();
		var _firstDayOfCalendar = new Date();
		var _options = $.extend({}, _defaults, options);
		var _elements = {};
        var _html = null;
        var _popover = null;
        		
		function dateChanged() {

			if (isFunction(_options.dateChanged))
				_options.dateChanged(self);
		}
		
		
		function getCurrentMonth() {
			var date = _firstDayOfCalendar.addDays(21);
			date.setDate(1);
			return date;
		}
		
		function getFirstDayOfCalendar(date) {
	        // Move to first day of month
	        var firstDayOfCalendar = new Date(date.getFullYear(), date.getMonth(), 1);

	        // Move back to beginning of week
	        firstDayOfCalendar = firstDayOfCalendar.addDays(-1 * (7 + firstDayOfCalendar.getDay() - firstDayOfCalendar.getFirstDayOfWeek()) % 7);
	        
	        return firstDayOfCalendar;
		}
		
		function updateDOM() {
			var date = getCurrentMonth();

	        var thisMonth = date.getMonth();
	        var thisYear = date.getFullYear();
	        
	        // Update title
	        if (true) {
    			_elements.title.text(sprintf('%s %d', date.getMonthName(), date.getFullYear()));
    	        
	        }

	        if (true) {
	        	var date = _firstDayOfCalendar;
	        	
		        _elements.weekNumbers.each(function() {
			    	$(this).text(date.getWeek());
			    	date = date.addDays(7);    
		        });
		        
	        }

	        if (true) {
	        	var date = _firstDayOfCalendar;
	        	
				_elements.days.each(function(index) {
	
					var style = '';
									
		        	if (date.getDay() == 0 || date.getDay() == 6)
		        		style += 'holiday ';

		        	if (date.getMonth() != thisMonth)
		        		style += 'grayed ';

		        	if (date.getDate() == _date.getDate() && date.getMonth() == _date.getMonth())
		        		style += 'bold selected ';
			        		
	
					$(this).text(date.getDate());
					$(this).removeClass('bold selected holiday grayed');
					$(this).addClass(style);
					
					date = date.addDays(1);
				});
		        
	        }
			
		}
		
    	
	    
	    function addListeners() {

    	    function enableMonthScroll() {
    			_elements.leftScroll.on('tap', function(event) {
        			var date = getCurrentMonth();
        			date.setMonth(date.getMonth() - 1);
        			_firstDayOfCalendar = getFirstDayOfCalendar(date);
        			updateDOM();
    			});
    
    			_elements.rightScroll.on('tap', function(event) {
        			var date = getCurrentMonth();
        			date.setMonth(date.getMonth() + 1);
        			_firstDayOfCalendar = getFirstDayOfCalendar(date);
        			updateDOM();
    			});
        	    
    	    }
    	    function enableWeekScroll() {
        	    var scrollTimer = null;
        	    
        	    function startScrolling(delta) {
                    
                    function scroll() {
                        _firstDayOfCalendar = _firstDayOfCalendar.addDays(delta);
                        updateDOM();
                    }
                    
            	    if (scrollTimer == null) {
                	    // Do an initial scroll
                	    scroll();
                	    scrollTimer = setInterval(scroll, 100);
            	    }
        	    }
        	    
        	    
        	    function stopScrolling() {
            	    if (scrollTimer != null) {
                	    clearInterval(scrollTimer);
            	    }
            	    
            	    scrollTimer = null;
        	    }
        	    
    			_elements.leftScroll.on('mousedown touchstart', function(event) {
        		
        		    startScrolling(-7);
    
            		$(this).on('mouseup touchend', function(event) {
                		$(this).off('mouseup touchend');
                		stopScrolling();
                		
            		});
    			});
    
    			_elements.rightScroll.on('mousedown touchstart', function(event) {
        		
        		    startScrolling(7);
    
            		$(this).on('mouseup touchend', function(event) {
                		$(this).off('mouseup touchend');
                		stopScrolling();
                		
            		});
    			});
        	    
    	    }

    	    function enableDateClick() {
    			// Assign click events, param is index from start of calendar			
    			_elements.days.each(function(index) {
    				$(this).on('tap', index, function(event) {

        				event.preventDefault();
        				event.stopPropagation();
        				
            			// Event param is index of day since first day of calendar
            			var index = event.data;
            
            			_date = _firstDayOfCalendar.addDays(index);
            			
            			updateDOM();
            			dateChanged();
                    });

    			});
        	    
    	    }

			function enableMouseWheel() {
                var scroll = 0;
    			
    			// Add support for mousewheel events 
    			_html.mousewheel(function(event, delta, deltaX, deltaY) {
    
    				// Don't scroll
    				event.preventDefault();
    			 
    			    scroll += deltaY > 0 ? 1 : -1;
    			    	
    				//console.log(delta, deltaX, deltaY);
    
    				if (Math.abs(scroll) > 1) {
        				if (scroll > 0)
            				_firstDayOfCalendar = _firstDayOfCalendar.addDays(7);
                        else
            				_firstDayOfCalendar = _firstDayOfCalendar.addDays(-7);
    				
                        updateDOM();
                        
                        scroll = 0;
        				
    				}
    				
    				// Change the offset
    				//plugin.settings.dateOffset.addMinutes(plugin.settings.tick * (delta > 0 ? 1 : -1));
    
    			});
			}
            enableDateClick();
            enableMonthScroll();
                        			
			
			
		}
		
        function init() {
            _html = $(template);
            _date = _options.date;
	        _firstDayOfCalendar = getFirstDayOfCalendar(_date);

            if (_options.container)
                _html.appendTo(_options.container);
                
            _elements.days = _html.find('.day');
            _elements.dayNames = _html.find('.dayname');
            _elements.weekNumbers = _html.find('.weeknumber'); 
            _elements.title = _html.find('.title');
            _elements.leftScroll = _html.find('.left.scroll');
            _elements.rightScroll = _html.find('.right.scroll');
            
            addListeners();
            updateDOM();
        };
        
        self.ensureVisible = function(date) {
	        _firstDayOfCalendar = getFirstDayOfCalendar(date);	        	
	        updateDOM();
        }
        
        self.show = function(position) {
            
            self.hide();
            
            _popover = new Popover({
                position:position,
                content: self.html()
            });
            
            _popover.show();            
        }
        
        self.hide = function() {
            if (_popover != null)
                _popover.hide();
                
            _popover = null;
        }
        
        self.html = function() {
            return _html;
        }
        
        self.date = function(value) {
	        
	        if (value == undefined) {
	        	return _date;
	        }
	       
	        _date = value;
		    _firstDayOfCalendar = getFirstDayOfCalendar(_date);
		    
		    _date.clearTime();
	        _firstDayOfCalendar.clearTime();
			
		    updateDOM();
	        	
	        return _date;
        }
                
        init();
    };
	
	return DatePicker;
	

});

  
