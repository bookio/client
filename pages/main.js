

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
		
		
		var _desktop = null;
		var _timeScale = null;
		var _timeSlider = null;
		var _picker = null;
		
		function NotifyUpdate(startDate, endDate) {
			if ((startDate.getFullYear() == endDate.addDays(-1).getFullYear()) && (startDate.getMonth() == endDate.addDays(-1).getMonth()) && (startDate.getDate() == endDate.addDays(-1).getDate())) {
				Notify.show(startDate.getFriendlyDate(), startDate.getYear());
			}
			else {
				Notify.show(startDate.getFriendlyDate() + ' - ' + endDate.addDays(-1).getFriendlyDate(), startDate.getYear());
			}
		}
		
		function triggerEvent() {
            Notifications.trigger('updateUI');
		}
		
		function sliderChanged() {
		    var selectionStartDate = _timeScale.startDate().addDays(_timeSlider.position());
            var selectionEndDate = selectionStartDate.addDays(_timeSlider.length());

            _picker.startDate(selectionStartDate);
            _picker.endDate(selectionEndDate.addDays(-1));

            _desktop.startDate(selectionStartDate);
            _desktop.endDate(selectionEndDate);

            
            NotifyUpdate(selectionStartDate, selectionEndDate);
            
            triggerEvent();
		}
		
		function startDateChanged() {
		    var selectionStartDate = _picker.startDate().clone();
            var selectionEndDate = selectionStartDate.addDays(_timeSlider.length());
            
            var rangeStartDate = selectionStartDate.addDays(-1*_timeSlider.position());
            var rangeEndDate = rangeStartDate.addDays(_timeSlider.range()); 

            _picker.startDate(selectionStartDate);
            _picker.endDate(selectionEndDate.addDays(-1));
            
            _desktop.startDate(selectionStartDate);
            _desktop.endDate(selectionEndDate);

            _timeScale.startDate(rangeStartDate);
            _timeScale.endDate(rangeEndDate);
            
            NotifyUpdate(selectionStartDate, selectionEndDate);

            triggerEvent();
		}

		function endDateChanged() {
		    var selectionEndDate = _picker.endDate().addDays(1);
            var selectionStartDate = selectionEndDate.addDays(-1 * _timeSlider.length());
            
            var rangeStartDate = selectionStartDate.addDays(-1*_timeSlider.position());
            var rangeEndDate = rangeStartDate.addDays(_timeSlider.range()); 

            _picker.startDate(selectionStartDate);
            _picker.endDate(selectionEndDate.addDays(-1));
            
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
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
            
	        function init() {
	        	_page.hookup(_elements);


	        	
	        	_desktop = new Desktop(_elements.desktop, {});
	        	_desktop.editMode(true);
	        	
	        	_timeScale = new TimeScale(_elements.scale, {});
	        	
                _timeSlider = new TimeSlider(_elements.slider, {
                    scroll:scroll,
                    positionChanged: sliderChanged,
                    lengthChanged: sliderChanged
                });

	        	_timeSlider.range(14);
	        	_timeSlider.position(3);
	        	_timeSlider.length(3);
	        	
	        	_picker = new DateRangePicker(_elements.picker, {
    	        	startDateChanged: startDateChanged,
    	        	endDateChanged: endDateChanged
	        	});
	        		        	
	        	//sliderChanged();
	        	//triggerEvent();
	        	//_timeSlider.
	        	_page.trigger('updatelayout');
	        }	  

	        init();
		}

    	$(document).delegate("#main-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

