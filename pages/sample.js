


(function() {

	var includes = [
		'jquery',
		'text!./sample.html',
		'less!./sample',
		'components/notify',
		'components/daterangepicker',
		'components/desktop',
		'components/timescale',
		'components/timeslider',
		'pages/new-rental',
		'pages/settings',
		'pages/categories'
	];

	define(includes, function($, html) {

		var Notify = require('components/notify');
		var Desktop = require('components/desktop');
		var TimeScale = require('components/timescale');
		var TimeSlider = require('components/timeslider');
		var DateRangePicker = require('components/daterangepicker');
		
	    var _html = null;
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
		

		function Module() {

					    
		    function init() {
	        	_desktop = new Desktop(_html.find(".desktop-container"), {});
	        	_timeScale = new TimeScale(_html.find(".scale-container"), {});
	        	
	        	_picker = new DateRangePicker(_html.find(".picker-container"), {
    	        	startDateChanged: startDateChanged,
    	        	endDateChanged: endDateChanged
	        	});

                _timeSlider = new TimeSlider(_html.find(".slider-container"), {
                    scroll:scroll,
                    positionChanged: sliderChanged,
                    lengthChanged: sliderChanged
                });

	        	function signOut() {
    	        	window.location = '#login';
	        	}

	        	_html.find('.settings').on('tap', function(event){
    	        	
    	        	event.preventDefault();
    	        	event.stopPropagation();

    	        	//require('pages/categories')();
    	        	//return;
    	        	var DateRangePicker = require('components/daterangepicker');

	        	
    	        	var menu = new PopupMenu({
        	        	
    	        	});
    	        	
    	        	function callback(context) {
    	        	}
    	        	
    	        	menu.add({
        	        	type: 'menuitem',
        	        	icon: 'images/icons/gears.png',
        	        	click: function() {
        		        	var module = require('pages/settings');
            	        	module();
        	        	},
        	        	iconSize: 60
        	        });
    	        	
    	        	menu.add({
        	        	type: 'separator'
    	        	});
    	        	
    	        	menu.add({
        	        	type: 'menuitem',
        	        	icon: !_desktop.editMode() ? 'images/icons/edit-desktop.png' : 'images/icons/edit-desktop-off.png',
        	        	click: function() {
            	           _desktop.editMode(!_desktop.editMode());	
        	        	},
        	        	iconSize: 60

    	        	});

    	        	menu.add({
        	        	type: 'separator'
    	        	});

    	        	menu.add({
        	        	type: 'menuitem',
        	        	icon: 'images/icons/onoff.png',
        	        	click: signOut,
        	        	iconSize: 60
    	        	});
    	        	
    	        	menu.show($(this));
    	        	
    	        	
	        	});			   
	        	
	        	_timeSlider.range(14);
	        	_timeSlider.position(3);
	        	_timeSlider.length(3);
	        	
	        	var date = new Date();
	        	date.clearTime();

	        	
	        	_timeScale.startDate(date); 
	        	_timeScale.endDate(date.addDays(14)); 
	        	
	        	sliderChanged();
	        		        	
		    };
		    
        	function scroll(delta) {

	        	_timeScale.scroll(delta);
	        	sliderChanged();
        	}

		    _html = $(html);

	    	$('body').empty();
	    	$('body').append(_html);
          
	    	init();
	    	

	    }
	    
	    return Module;
    
    });


})();