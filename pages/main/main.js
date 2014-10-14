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
				console.log('resize event');
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
				
				var sDate = moment(startDate);
				var eDate = moment(endDate);

				_elements.dateinput.val(sDate.format('L') + " - " + eDate.subtract('days', 1).format('L'));
				
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

				var selectionStartDate = _startDate.clone();
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

				var selectionEndDate = _endDate.addDays(1);
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

				_elements.slider.timeslider();
				_elements.scale.timescale();
  
  
				// MENU
				// Settings
				_elements.settings.on('tap', function() {
					$.mobile.pages.push('../settings/settings.html', {
						transition: 'fade'
					});
				});
				
				// Edit Mode
				_elements.editmode.on('tap', function() {
					var options = {};
					_elements.desktop.invoke('get', options);

					if (options.editMode != undefined)
						_elements.desktop.invoke('set', {editMode:!options.editMode});
	
					_elements.popup.content.popup('close');
				});
				
				// Log Out
				_elements.logout.on('tap', function() {
					// Make sure to remove this page when leaving it...
					$.mobile.pages.go('../login/login.html', {
						transition: 'fade'
					});
				});
				
				
				_elements.dateinput.on('tap', function(event) {
					var caretPos = _elements.dateinput.textrange('get', 'position');
					var lengthOfDate = moment(_startDate).format('L').length;
					var dateStr;
					var showIt = false;
					
					
					// Tap on start date?
					if (caretPos && (caretPos < lengthOfDate)) {
					
						dateStr = _elements.dateinput.val().substring(0, lengthOfDate);
						
						// If valid date, select and show mobiscroll
						if (moment(dateStr).isValid()) {
							_elements.dateinput.textrange('set', 0, lengthOfDate);
							showIt = true;
						}
						
					}
					 // Tap on end date?
					else if (caretPos > lengthOfDate+3 && caretPos < 2*lengthOfDate+3) {
					
						dateStr = _elements.dateinput.val().substring(lengthOfDate+3);
						
						// If valid date, select and show mobiscroll						
						if (moment(dateStr).isValid()) {
							_elements.dateinput.textrange('set', lengthOfDate+3, lengthOfDate);
							showIt = true;
						}
						
					}

					if (showIt) {

						function dateChanged(value, instance) {							
							if (caretPos < lengthOfDate) {
								_startDate = new Date(value);
								startDateChanged();									
							}
							else {
								_endDate = new Date(value);
								endDateChanged();									
							}
						}

						var d = new Date(dateStr);				
						_elements.divformobiscroll.mobiscroll('setDate', d, false);						
						_elements.divformobiscroll.mobiscroll('option', {onSelect: dateChanged});

						_elements.divformobiscroll.mobiscroll('show');
						
					}

				});


				// View menu
				_elements.iconviewcalendar.on('tap', function() {
					setCalendarViewMode();
				});
				_elements.iconviewlist.on('tap', function() {
					setListViewMode();
				});
				_elements.iconviewicon.on('tap', function() {
					setIconViewMode();
				});

				function setCalendarViewMode() {
					$.cookie('desktopview', 'calendar');

					_elements.iconviewcalendar.addClass('selected');
					_elements.iconviewicon.removeClass('selected');
					_elements.iconviewlist.removeClass('selected');

					_elements.desktopcontainer.empty();

					_elements.desktop = $('<div data-role="desktopcalendar"></div>');
					_elements.desktop.appendTo(_elements.desktopcontainer);

					_elements.desktop.desktopcalendar();
					_elements.desktop.invoke('set', {startDate:_startDate, endDate:_endDate});
					_elements.desktop.invoke('refresh');
				}
				
				function setIconViewMode() {
					$.cookie('desktopview', 'icon');

					_elements.iconviewcalendar.removeClass('selected');
					_elements.iconviewlist.removeClass('selected');
					_elements.iconviewicon.addClass('selected');

					_elements.desktopcontainer.empty();

					_elements.desktop = $('<div data-role="desktop"></div>');
					_elements.desktop.appendTo(_elements.desktopcontainer);

					_elements.desktop.desktop();
					_elements.desktop.invoke('set', {startDate:_startDate, endDate:_endDate});
					_elements.desktop.invoke('refresh');
				}

				function setListViewMode() {
					$.cookie('desktopview', 'list');

					_elements.iconviewlist.addClass('selected');
					_elements.iconviewicon.removeClass('selected');
					_elements.iconviewcalendar.removeClass('selected');
					
					_elements.desktopcontainer.empty();
					
					_elements.desktop = $('<div data-role="desktoplist"></div>');
					_elements.desktop.appendTo(_elements.desktopcontainer);

					_elements.desktop.desktoplist();
					_elements.desktop.invoke('set', {startDate:_startDate, endDate:_endDate});
					_elements.desktop.invoke('refresh');
					
				}

//				_elements.popup.menu.on('tap', function() {
				_elements.popup.icon.on('tap', function() {

					var options = {
						dismissible: true,
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
								
				
				_element.one("pageshow", function(event) {
					redrawForResize();

					// Set desktop view to last selected state (show rental objects as symbols, list or calendar)
					switch($.cookie('desktopview')) {
					
						case 'list': 
							setListViewMode();
							break;
					
						case 'calendar':
							setCalendarViewMode();
							break;
					
						default:
							setIconViewMode();
					}
					
					if (page.params != undefined && page.params.editmode != undefined) {
						_elements.desktop.invoke('set', {editMode:page.params.editmode});
						_elements.desktop.invoke('refresh');
	
					}

				});
				
				_elements.divformobiscroll.mobiscroll().date({
					display: 'bubble',
					anchor: _elements.dateinput,
					showOnTap: false,
					showOnFocus: false
				});
				
				setSliderInStartPosition();
				redrawForResize();
				
			}
		}
		
		return Module;


	});


})();
