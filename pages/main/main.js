(function() {

	var dependencies = [
		'css!./main',
		'../../components/notify/notify',
		'../../widgets/pagelogo/pagelogo',
		'../../widgets/datepicker/datepicker',
		'../../widgets/timeslider/timeslider',
		'../../widgets/timescale/timescale',
		'../../widgets/desktop/desktop',
		'../../widgets/desktoplist/desktoplist',
		'../../widgets/desktopcalendar/desktopcalendar',
		
	];

	define(dependencies, function() {

		function Module(page) {

			var _element = page.element;
			var _elements = {};

			var _startDate = new Date();
			var _endDate = new Date();


			$(window).smartresize(function() {
				redrawForResize();
			});

			function NotifyUpdate(startDate, endDate) {


				if (_element.is(':visible')) {
					if (_startDate.getTime() != startDate.getTime() || _endDate.getTime() != endDate.getTime()) {
						if ((startDate.getFullYear() == endDate.addDays(-1).getFullYear()) && (startDate.getMonth() == endDate.addDays(-1).getMonth()) && (startDate.getDate() == endDate.addDays(-1).getDate())) {
							Notify.show(startDate.getFriendlyDate(), startDate.getYear());
						}
						else {
							Notify.show(startDate.getFriendlyDate() + ' - ' + endDate.addDays(-1).getFriendlyDate(), startDate.getYear());
						}

					}
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


			function redrawForResize() {

				var scale = {};
				_elements.scale.invoke('get', scale);

				var range = Math.floor(_elements.slider.innerWidth() / 80);				
				
				_elements.slider.invoke('set', {range:range});
				_elements.scale.invoke('set', {startDate: scale.startDate, endDate: scale.startDate.addDays(range)});

				sliderChanged();
			}


			function setSliderInStartPosition() {

				var slider = {};
				_elements.slider.invoke('get', slider);
				
				slider.position = 0;
				slider.length = 1;
				
				_elements.slider.invoke('set', slider);

				var date = new Date();
				date.clearTime();

				_elements.scale.invoke('set', {startDate: date, endDate: date.addDays(slider.range)});

				sliderChanged();
			}


			function sliderChanged() {
				var slider = {};
				_elements.slider.invoke('get', slider);

				var scale = {};
				_elements.scale.invoke('get', scale);

				var selectionStartDate = scale.startDate.addDays(slider.position);
				var selectionEndDate = selectionStartDate.addDays(slider.length);
				
				_elements.desktop.invoke('set', {startDate:selectionStartDate, endDate:selectionEndDate});

				NotifyUpdate(selectionStartDate, selectionEndDate);

			}

			function startDateChanged() {
				var slider = {};
				_elements.slider.invoke('get', slider);

				var selectionStartDate = _startDate.clone(); //_picker.startDate().clone();
				var selectionEndDate = selectionStartDate.addDays(slider.length);

				var rangeStartDate = selectionStartDate.addDays(-1 * slider.position);
				var rangeEndDate = rangeStartDate.addDays(slider.range);

				_elements.desktop.invoke('set', {startDate:selectionStartDate, endDate:selectionEndDate});
				_elements.scale.invoke('set', {startDate:rangeStartDate, endDate:rangeEndDate});

				NotifyUpdate(selectionStartDate, selectionEndDate);

			}

			function endDateChanged() {
				var slider = {};
				_elements.slider.invoke('get', slider);

				var selectionEndDate = _endDate.addDays(1); //_picker.endDate().addDays(1);
				var selectionStartDate = selectionEndDate.addDays(-1 * slider.length);

				var rangeStartDate = selectionStartDate.addDays(-1 * slider.position);
				var rangeEndDate = rangeStartDate.addDays(slider.range);

				_elements.desktop.invoke('set', {startDate:selectionStartDate, endDate:selectionEndDate});
				_elements.scale.invoke('set', {startDate:rangeStartDate, endDate:rangeEndDate});

				NotifyUpdate(selectionStartDate, selectionEndDate);

			}

			function scroll(delta) {

				var range = {};
				_elements.scale.invoke('get', range);
				_elements.scale.invoke('set', {startDate:range.startDate.addDays(delta), endDate:range.endDate.addDays(delta)});

				sliderChanged();
			}


			this.init = function() {
				_element.hookup(_elements, 'data-id');
				
				_elements.desktop.desktop();
				_elements.slider.timeslider();
				_elements.scale.timescale();

				_elements.desktop.invoke('set', {editMode:false});
  
				_elements.editmode.on('tap', function() {
					var options = {};
					_elements.desktop.invoke('get', options);

					if (options.editMode != undefined)
						_elements.desktop.invoke('set', {editMode:!options.editMode});
	
					_elements.popup.content.popup('close');
				});


				_elements.logout.on('tap', function() {
					// Make sure to remove this page when leaving it...

					$.mobile.pages.go('../login/login.html', {
						transition: 'fade'
					});
				});

				_elements.settings.on('tap', function() {
					$.mobile.pages.push('../settings/settings.html', {
						transition: 'fade'
					});
				});


				_elements.iconviewcalendar.on('tap', function() {
					_elements.iconviewcalendar.addClass('selected');
					_elements.iconviewicon.removeClass('selected');
					_elements.iconviewlist.removeClass('selected');
					$.cookie('desktopview', 'list');

					_elements.desktopcontainer.empty();

					_elements.desktop = $('<div data-role="desktopcalendar"></div>');
					_elements.desktop.appendTo(_elements.desktopcontainer);

					_elements.desktop.desktopcalendar();
					_elements.desktop.invoke('set', {startDate:_startDate, endDate:_endDate});
					_elements.desktop.invoke('refresh');

				});

				_elements.iconviewlist.on('tap', function() {
					_elements.iconviewlist.addClass('selected');
					_elements.iconviewicon.removeClass('selected');
					_elements.iconviewcalendar.removeClass('selected');
					$.cookie('desktopview', 'calendar');
					
					_elements.desktopcontainer.empty();
					
					_elements.desktop = $('<div data-role="desktoplist"></div>');
					_elements.desktop.desktoplist();
					_elements.desktop.appendTo(_elements.desktopcontainer);
				});

				_elements.iconviewicon.on('tap', function() {
					_elements.iconviewcalendar.removeClass('selected');
					_elements.iconviewlist.removeClass('selected');
					_elements.iconviewicon.addClass('selected');
					$.cookie('desktopview', 'icon');

					_elements.desktopcontainer.empty();

					_elements.desktop = $('<div data-role="desktop"></div>');
					_elements.desktop.appendTo(_elements.desktopcontainer);

					_elements.desktop.desktop();
					_elements.desktop.invoke('set', {startDate:_startDate, endDate:_endDate});
					_elements.desktop.invoke('refresh');

				});


				_elements.popup.menu.on('tap', function() {

					var options = {
						dismissible: true,
						theme: "c",
						transition: "pop",
						positionTo: $(this)
					};

					_elements.popup.content.popup(options);
					_elements.popup.content.popup('open');
				});

				_elements.slider.subscribe('change', function(data) {
					sliderChanged();	
				});

				_elements.slider.subscribe('scroll', function(delta) {
					scroll(delta);
				});
				
				_elements.slider.subscribe('reset', function(event) {
					setSliderInStartPosition();
				});
								
				
				_elements.startdate.button.on('tap', function(event) {

					function dateChanged(value, button, instance) {
						if (button == "set") {
							_startDate = new Date(value);
							startDateChanged();
							
						}
					}
					_elements.startdate.button.mobiscroll().date({ 
						onClose: dateChanged
					});
					
					_elements.startdate.button.mobiscroll('setDate', _startDate); 

					
					event.preventDefault();

				});

				_elements.enddate.button.on('tap', function(event) {

					function dateChanged(value, button, instance) {
						if (button == "set") {
							_endDate = new Date(value);
							_endDate = _endDate.addDays(1);
							endDateChanged();
						}
					}

					_elements.enddate.button.mobiscroll().date({ 
						minDate: _startDate,
						onClose: dateChanged
					});
					
					_elements.enddate.button.mobiscroll('setDate', _endDate.addDays(-1)); 
					
					event.preventDefault();

				});

				_element.on("pageshow", function(event) {
					redrawForResize();
					_elements.desktop.invoke('refresh');
				});
				
				// Set desktop view to last selected state (show rental objects as symbols, list or calendar)
				switch($.cookie('desktopview')) {
				
					case 'list': 
						_elements.iconviewlist.addClass('selected');
						
						break;
				
					case 'calendar':
						_elements.iconviewcalendar.addClass('selected');
						break;
				
					default:
						_elements.iconviewicon.addClass('selected');
				}
				
				setSliderInStartPosition();
				redrawForResize();
				
			}
		}
		
		return Module;


	});


})();
