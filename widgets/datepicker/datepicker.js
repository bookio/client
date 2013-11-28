(function() {

	var dependencies = [
		'text!./datepicker.html',
		'css!./datepicker'
	];

	define(dependencies, function(html) {

		
		var Widget = function(element) {
		
			var _element = element;
	        var _date = new Date();
	        var _firstDayOfCalendar = new Date();
	        var _elements = {};
	        var _html = null;
	
	        function dateChanged() {
				_element.trigger('datechanged');
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
	
	        function refresh() {
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
	
	                    if (date.getDay() == 0 || date.getDay() == 6) style += 'holiday ';
	
	                    if (date.getMonth() != thisMonth) style += 'grayed ';
	
	                    if (date.getDate() == _date.getDate() && date.getMonth() == _date.getMonth()) style += 'bold selected ';
	
	
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
	                    refresh();
	                });
	
	                _elements.rightScroll.on('tap', function(event) {
	                    var date = getCurrentMonth();
	                    date.setMonth(date.getMonth() + 1);
	                    _firstDayOfCalendar = getFirstDayOfCalendar(date);
	                    refresh();
	                });
	
	            }
	
	            function enableWeekScroll() {
	                var scrollTimer = null;
	
	                function startScrolling(delta) {
	
	                    function scroll() {
	                        _firstDayOfCalendar = _firstDayOfCalendar.addDays(delta);
	                        refresh();
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
	
	                        refresh();
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
	                        if (scroll > 0) _firstDayOfCalendar = _firstDayOfCalendar.addDays(7);
	                        else _firstDayOfCalendar = _firstDayOfCalendar.addDays(-7);
	
	                        refresh();
	
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
	        	
	            _html = $(html);

	            _firstDayOfCalendar = getFirstDayOfCalendar(_date);
	
				_element.append(_html);
				
	            _elements.days = _html.find('.day');
	            _elements.dayNames = _html.find('.dayname');
	            _elements.weekNumbers = _html.find('.weeknumber');
	            _elements.title = _html.find('.title');
	            _elements.leftScroll = _html.find('.left.scroll');
	            _elements.rightScroll = _html.find('.right.scroll');
	
	            addListeners();
	            refresh();
	        };
	
	        this.ensureVisible = function(date) {
	            _firstDayOfCalendar = getFirstDayOfCalendar(date);
	            refresh();
	        }
	
			this.getDate = function() {
				return _date.clone();				
			}
			
	        this.setDate = function(value) {
	
	            if (value == undefined) {
	                return _date;
	            }
	
	            _date = value.clone();
	            _firstDayOfCalendar = getFirstDayOfCalendar(_date);
	
	            _date.clearTime();
	            _firstDayOfCalendar.clearTime();
	
	            refresh();
	
	            return _date;
	        }

	        init();

		}


		// Define the widget
		var widget = {};
		
		widget._create = function() {
			this.widget = new Widget(this.element);
		}
		
		widget.ensureVisible = function(date) {
			this.widget.ensureVisible(date);
		}

		widget.setDate = function(date) {
			this.widget.setDate(date);
		}

		widget.getDate = function(date) {
			return this.widget.getDate();
		}

		$.widget("mobile.datepicker", $.mobile.widget, widget);

		// taking into account of the component when creating the window
		// or at the create event
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=datepicker)", e.target).datepicker();
		});


	});


})();

