

(function() {

	var dependencies = [
		'less!./main.less',
		'../components/desktop',
		'../components/timeslider',
		'../components/notify',
		'../components/timescale',
		'../components/daterangepicker',
		'./settings'
	];

	define(dependencies, function() {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
    		var _desktop = null;
    		var _timeScale = null;
    		var _timeSlider = null;

    		var _startDate = new Date();
    		var _endDate = new Date();
		
    		function NotifyUpdate(startDate, endDate) {
    			if ((startDate.getFullYear() == endDate.addDays(-1).getFullYear()) && (startDate.getMonth() == endDate.addDays(-1).getMonth()) && (startDate.getDate() == endDate.addDays(-1).getDate())) {
    				Notify.show(startDate.getFriendlyDate(), startDate.getYear());
    			}
    			else {
    				Notify.show(startDate.getFriendlyDate() + ' - ' + endDate.addDays(-1).getFriendlyDate(), startDate.getYear());
    			}
    			
    			
        		_elements.startdate.year.text(sprintf("%04d", startDate.getFullYear()));
        		_elements.startdate.day.text(startDate.getDate() + ' ' + startDate.getShortMonthName());
        		_elements.startdate.weekday.text(startDate.getShortDayName());
    
        		var displayEndDate = endDate.addDays(-1);
        		_elements.enddate.year.text(sprintf("%04d", displayEndDate.getFullYear()));
        		_elements.enddate.day.text(displayEndDate.getDate() + ' ' + displayEndDate.getShortMonthName());
        		_elements.enddate.weekday.text(displayEndDate.getShortDayName());

    			_startDate = startDate;
    			_endDate = endDate;
    			
    		}
    		
    		function triggerEvent() {
                Notifications.trigger('updateUI');
    		}
    		
    		function sliderChanged() {
    		    var selectionStartDate = _timeScale.startDate().addDays(_timeSlider.position());
                var selectionEndDate = selectionStartDate.addDays(_timeSlider.length());
    
                //_picker.startDate(selectionStartDate);
                //_picker.endDate(selectionEndDate.addDays(-1));
                
                _desktop.startDate(selectionStartDate);
                _desktop.endDate(selectionEndDate);
    
                
                NotifyUpdate(selectionStartDate, selectionEndDate);
                
                triggerEvent();
    		}
    		
    		function startDateChanged() {
    		    var selectionStartDate = _startDate.clone(); //_picker.startDate().clone();
                var selectionEndDate = selectionStartDate.addDays(_timeSlider.length());
                
                var rangeStartDate = selectionStartDate.addDays(-1*_timeSlider.position());
                var rangeEndDate = rangeStartDate.addDays(_timeSlider.range()); 
    
                //_picker.startDate(selectionStartDate);
                //_picker.endDate(selectionEndDate.addDays(-1));
                
                _desktop.startDate(selectionStartDate);
                _desktop.endDate(selectionEndDate);
    
                _timeScale.startDate(rangeStartDate);
                _timeScale.endDate(rangeEndDate);
                
                NotifyUpdate(selectionStartDate, selectionEndDate);
    
                triggerEvent();
    		}
    
    		function endDateChanged() {
    		    var selectionEndDate = _endDate.addDays(1); //_picker.endDate().addDays(1);
                var selectionStartDate = selectionEndDate.addDays(-1 * _timeSlider.length());
                
                var rangeStartDate = selectionStartDate.addDays(-1*_timeSlider.position());
                var rangeEndDate = rangeStartDate.addDays(_timeSlider.range()); 
    
                //_picker.startDate(selectionStartDate);
                //_picker.endDate(selectionEndDate.addDays(-1));
                
                _desktop.startDate(selectionStartDate);
                _desktop.endDate(selectionEndDate);
    
                _timeScale.startDate(rangeStartDate);
                _timeScale.endDate(rangeEndDate);
                
                NotifyUpdate(selectionStartDate, selectionEndDate);
    
                triggerEvent();
    		} 
    
        	function scroll(delta) {
    
            	_timeScale.scroll(delta);
            	sliderChanged();
        	}		
                
                
            function pickdate(button, callback) {
	            function dateChanged() {
		           popup.popup('close');	
		           callback(datepicker.date());
	            }
	       		
	            var datepicker = new DatePicker({dateChanged:dateChanged});
	      
	            var options = {
			        dismissible : true,
			        theme : "c",
			        overlyaTheme : "c",
			        transition : "pop",
			        positionTo: button
	            };

	            var popup = $("<div/>").popup(options);
	           				    
			    popup.on("popupafterclose", function() {
			        $(this).remove();
			    });

			    popup.append(datepicker.html());
                popup.popup("open").trigger("create");
            }
                    		       

	        function init() {
	        	_page.hookup(_elements);

	        	_desktop = new Desktop(_elements.desktop, {});
	        	_desktop.editMode(false);


	        	_elements.editmode.on('tap', function() {
    	        	_desktop.editMode(!_desktop.editMode());
    	        	_elements.popupmenu.popup('close');
	        	});	        	

	        	_timeScale = new TimeScale(_elements.scale, {});
	        	
                _timeSlider = new TimeSlider(_elements.slider, {
                    scroll:scroll,
                    positionChanged: sliderChanged,
                    lengthChanged: sliderChanged
                });

	        	_timeSlider.range(14);
	        	_timeSlider.position(3);
	        	_timeSlider.length(3);
	        	_timeSlider.positionSlider();

	        	_elements.startdate.button.on('tap', function(event) {

    	        	event.preventDefault();
    	        	//event.stopPropagation();
    	        	
    	        	pickdate($(this), function(date){
        	        	_startDate = date;
        	        	startDateChanged();
    	        	});
                        	       
	        	});
	        	_elements.enddate.button.on('tap', function(event) {

    	        	event.preventDefault();
    	        	//event.stopPropagation();

    	        	pickdate($(this), function(date){
        	        	_endDate = date;
        	        	endDateChanged();
    	        	});
                        	       
	        	});
	        	/*
	        	_picker = new DateRangePicker(_elements.picker, {
    	        	startDateChanged: startDateChanged,
    	        	endDateChanged: endDateChanged
	        	});
	        	*/
	        		        	
	        	sliderChanged();
	        	triggerEvent();

	        	_page.trigger('updatelayout');
	        }	  

	        init();

        	_page.on("pageshow", function(event) {
            	_timeSlider.positionSlider();
            	_timeSlider.positionGripper();
            });

 
		}

    	$(document).delegate("#main-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

