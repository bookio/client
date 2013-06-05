/*

@codekit-prepend "itempicker.js";

*/

define(['jquery', 'less!./daterangepicker', '../scripts/tools', './itempicker', './datepicker'], function($) {

	
	DateRangePicker = function(container, options) {
	
		var self = this;

		var _defaults = {
            startDateChanged: null,
            endDateChanged: null
		};
		
		var _options = $.extend({}, _defaults, options);
		var _items = [];
		var _popover = null;

		var _elements = {
			root:null,
			startDate: {
				year: null,
				month: null,
				day: null,
				weekday: null
			},
			endDate: {
				year: null,
				month: null,
				day: null,
				weekday: null
			}
		};

		var _startDate = new Date();
		var _endDate = new Date();
		var _setNeedsLayout = false;
		
		this.startDate = function(value) {
    		if (value == undefined)
    		    return _startDate.clone();
    		    
            _startDate.setTime(value.getTime());
            _setNeedsLayout = true;
		}

		this.endDate = function(value) {
    		if (value == undefined)
    		    return _endDate.clone();
    		    
            _endDate.setTime(value.getTime());
            _setNeedsLayout = true;

		}

        Notifications.on('updateUI.daterangepicker', function(){

            if (_setNeedsLayout)
                updateDOM();
                
            _setNeedsLayout = false;
        });		
		
        function init() {
          
            var template = 
                '<div class="date-range-picker">'+
                    '<span class="start date">'+
                        '<span class="weekday"></span>'+
                        '<span>&nbsp</span>'+
                        '<span class="day"></span>'+
                        '<span>&nbsp</span>'+
                        '<span class="year hide"></span>'+
                    '</span>'+
                    '<span class="separator">&nbsp—&nbsp&nbsp</span>'+
                    '<span class="end date">'+
                        '<span class="weekday"></span>'+
                        '<span>&nbsp</span>'+
                        '<span class="day"></span>'+
                        '<span>&nbsp&nbsp</span>'+
                        '<span class="year"></span>'+
                    '</span>'+
                '</div>';
            
            var root = $(template);
            
            _elements.root = root;
            _elements.startDate.year = root.find('.start .year');
            _elements.startDate.month = root.find('.start .month');
            _elements.startDate.day = root.find('.start .day');
            _elements.startDate.weekday = root.find('.start .weekday');

            _elements.endDate.year = root.find('.end .year');
            _elements.endDate.month = root.find('.end .month');
            _elements.endDate.day = root.find('.end .day');
            _elements.endDate.weekday = root.find('.end .weekday');
            
            _elements.startDate.day.on('tap', _startDate, changeDay);
            _elements.endDate.day.on('tap', _endDate, changeDay);
            
            _elements.endDate.month.on('tap', _endDate, changeMonth);
            _elements.startDate.month.on('tap', _startDate, changeMonth);

            _elements.endDate.year.on('tap', _endDate, changeYear);
            _elements.startDate.year.on('tap', _startDate, changeYear);
            
            _elements.endDate.weekday.on('tap', _endDate, changeWeekday);
            _elements.startDate.weekday.on('tap', _startDate, changeWeekday);
            
            _elements.root.on('removed', function(){
                Notifications.off('.daterangepicker');    
            });		

    
            container.append(root);
            
            updateDOM();
    	};
    	
    	function updateDOM() {

	    	
    		_elements.startDate.year.text(sprintf("%04d", _startDate.getFullYear()));
    		_elements.startDate.day.text(_startDate.getDate() + ' ' + _startDate.getShortMonthName());
    		_elements.startDate.weekday.text(_startDate.getShortDayName());

    		_elements.endDate.year.text(sprintf("%04d", _endDate.getFullYear()));
    		_elements.endDate.day.text(_endDate.getDate() + ' ' + _endDate.getShortMonthName());
    		_elements.endDate.weekday.text(_endDate.getShortDayName());
	    	
    	}

		function validateDate(date) {
	    	/*
	    	if (_endDate < _startDate) {
	    		if (date == _startDate)
		    		_endDate.setTime(_startDate.getTime());
		    	else
	    			_startDate.setTime(_endDate.getTime());
	    	}
	    	*/
		}
		
		function dateChanged(date) {
    		if (date == _startDate) {
                if (isFunction(_options.startDateChanged))
        			_options.startDateChanged(this);
	    		
    		} 
	    	else {
	    	    if (isFunction(_options.endDateChanged))
        			_options.endDateChanged(this);
    	    	
	    	}
		}
		
		function changeYear(event) {
			
			var picker = new ItemPicker({columns:1});
			var self = $(this);
			var date = event.data;

			event.stopPropagation();
			event.preventDefault();

	        function click(year) {
		        date.setFullYear(year);
				validateDate(date);
				dateChanged(date);	    		
		    	updateDOM();
		    	
	        }
	        
	        var thisYear = date.getFullYear();
	        
	        for (var year = 0; year < 3; year++) {
	        	if (thisYear + year == date.getFullYear())
	        		picker.addItem(thisYear + year, click, thisYear + year, 'center bold selected');
	        	else
	        		picker.addItem(thisYear + year, click, thisYear + year, 'center');
		        
	        }
            
            var x = $(this).offset().left + $(this).outerWidth() / 2;
            var y = $(this).offset().top;
            
            
	        picker.show($(this));
			
		}    	

		function changeMonth(event) {
			
			var picker = new ItemPicker({columns:1});
			var self = $(this);
			var date = event.data;
			
			event.stopPropagation();
			event.preventDefault();

	        function click(month) {
	        	
		    	date.setMonth(month - 1);
		    	
				validateDate(date);	    		
				dateChanged(date);	    		
		    	updateDOM();  
	        }
	        
	        for (i = 1; i <= 12; i++) {
		        var calendar = new Date(2000, i-1, 1);
                picker.addItem(calendar.getMonthName(), click, i, calendar.getMonth() == date.getMonth() ? 'left bold selected' : 'left');
            }
            
            var x = $(this).offset().left + $(this).outerWidth() / 2;
            var y = $(this).offset().top;
            
	        picker.show(x, y);
			
		}    	
    	
    	function changeWeekday() {
			return;
			
			var picker = new ItemPicker({columns:1});
			var self = $(this);
			var date = event.data;

			event.stopPropagation();
			event.preventDefault();
			
	        function click(day) {
//	        	date.setDate(day);
//				validateDate(date);	    		
//	        	updateDates();
	        }
	        
	        var thisMonth = date.getMonth();
	        var thisDate = date.getDate();
	        var thisYear = date.getFullYear();
	        
	        // Move to first day of month
	        var calendar = new Date(date.getFullYear(), date.getMonth(), 1);
	        
	        // Move back to beginning of week
	        calendar = calendar.addDays(-1 * (7 + calendar.getDay() - calendar.getFirstDayOfWeek()) % 7);

			// Add days	        
			for (var i = 0; i < 7; i++) {
		        picker.addItem(calendar.addDays(i).getDayName(), null, null, 'left');
	        }
            
            var x = $(this).offset().left + $(this).outerWidth() / 2;
            var y = $(this).offset().top;
            
	        picker.show($(this));
	    	
    	};
    	
    	
		function changeDay(event) {
			
/*
			var picker = new ItemPicker({columns:7, placement:'top'});
			var self = $(this);
			var date = event.data;
			
			event.stopPropagation();
			
	        function click(day) {
	        	date.setDate(day);
				validateDate(date);	    		
				dateChanged(date);	    		
	        	updateDOM();
	        }
	        
	        var thisMonth = date.getMonth();
	        var thisDate = date.getDate();
	        var thisYear = date.getFullYear();
	        
	        // Move to first day of month
	        var calendar = new Date(date.getFullYear(), date.getMonth(), 1);
	        
	        // Move back to beginning of week
	        calendar = calendar.addDays(-1 * (7 + calendar.getDay() - calendar.getFirstDayOfWeek()) % 7);

			// Add days	        
			for (var i = 0; i < 7; i++) {
		        picker.addItem(calendar.addDays(i).getShortDayName(), null, null, 'disabled center x-small');
	        }
	      
	        
	        for (i = 1; i <= 35+7; i++) {

		        var style = 'right';
		        var callback = null;
		        
	        	if (calendar.getMonth() == thisMonth) {
		        	callback = click;
		        	
		        	if (calendar.getDate() == thisDate)
		        		style += ' bold selected';
		        		
		        	if (calendar.getDay() == 0 || calendar.getDay() == 6)
		        		style += ' heads-up';
	        	}
	        	else
	        		style += ' disabled';
	                
	        	picker.addItem(calendar.getDate(), callback, calendar.getDate(), style);
                calendar = calendar.addDays(1);
            }
            
            var x = $(this).offset().left + $(this).outerWidth() / 2;
            var y = $(this).offset().top;
*/

			event.stopPropagation();
			event.preventDefault();

			var date = event.data;
			console.log(date);
			
			var datePicked = function(picker) {
                //debugger;

	        	date.setTime(picker.date().getTime());
				validateDate(date);	    		
				dateChanged(date);	    		
	        	updateDOM();
                picker.hide();
    			
			}
            var picker = new DatePicker({
                date: date.clone(),
                dateChanged: datePicked
            });
            
            picker.show($(this));
			
		}    	
    	
        init();
        
    };
    
    
	
	
	return DateRangePicker;
	

});

  
