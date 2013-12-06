(function() {

	var dependencies = [
		'css!./main',
		'../../components/notify/notify',
		'../../widgets/pagelogo/pagelogo',
		'../../widgets/datepicker/datepicker',
		'../../widgets/timeslider/timeslider',
		'../../widgets/timescale/timescale',
		'../../widgets/desktop/desktop'
		
	];

	define(dependencies, function() {

		function Module(page) {

			var _page = page;
			var _elements = {};

			var _startDate = new Date();
			var _endDate = new Date();


			$(window).smartresize(function() {
				redrawForResize();
			});

			function NotifyUpdate(startDate, endDate) {


				if (_page.is(':visible')) {
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


			function triggerEvent() {
				Notifications.trigger('updateUI');
			}


			function redrawForResize() {

				var range = Math.floor(_elements.slider.innerWidth() / 80);
				var startDate = _elements.scale.timescale('startDate');
				range = Math.floor(_elements.slider.innerWidth() / 80);
				
				_elements.slider.timeslider('range', range);
				_elements.scale.timescale('endDate', startDate.addDays(range));
				sliderChanged();
			}


			function setSliderInStartPosition() {

				_elements.slider.timeslider('position', 0); // Set Now as start position
				_elements.slider.timeslider('length', 1); // Fill only one 'time slot'

				var date = new Date();
				date.clearTime();

				_elements.scale.timescale('startDate', date);
				_elements.scale.timescale('endDate', date.addDays(_elements.slider.timeslider('range')));

				sliderChanged();
			}


			function sliderChanged() {
				var selectionStartDate = _elements.scale.timescale('startDate').addDays(_elements.slider.timeslider('position'));
				var selectionEndDate = selectionStartDate.addDays(_elements.slider.timeslider('length'));
				
				_elements.desktop.desktop('startDate', selectionStartDate);
				_elements.desktop.desktop('endDate', selectionEndDate);


				NotifyUpdate(selectionStartDate, selectionEndDate);

				triggerEvent();
			}

			function startDateChanged() {
				var selectionStartDate = _startDate.clone(); //_picker.startDate().clone();
				var selectionEndDate = selectionStartDate.addDays(_elements.slider.timeslider('length'));

				var rangeStartDate = selectionStartDate.addDays(-1 * _elements.slider.timeslider('position'));
				var rangeEndDate = rangeStartDate.addDays(_elements.slider.timeslider('range'));

				//_picker.startDate(selectionStartDate);
				//_picker.endDate(selectionEndDate.addDays(-1));

				_elements.desktop.desktop('startDate', selectionStartDate);
				_elements.desktop.desktop('endDate', selectionEndDate);

				_elements.scale.timescale('startDate', rangeStartDate);
				_elements.scale.timescale('endDate', rangeEndDate);

				NotifyUpdate(selectionStartDate, selectionEndDate);

				triggerEvent();
			}

			function endDateChanged() {
				var selectionEndDate = _endDate.addDays(1); //_picker.endDate().addDays(1);
				var selectionStartDate = selectionEndDate.addDays(-1 * _elements.slider.timeslider('length'));

				var rangeStartDate = selectionStartDate.addDays(-1 * _elements.slider.timeslider('position'));
				var rangeEndDate = rangeStartDate.addDays(_elements.slider.timeslider('range'));

				//_picker.startDate(selectionStartDate);
				//_picker.endDate(selectionEndDate.addDays(-1));

				_elements.desktop.desktop('startDate', selectionStartDate);
				_elements.desktop.desktop('endDate', selectionEndDate);

				_elements.scale.timescale('startDate', rangeStartDate);
				_elements.scale.timescale('endDate', rangeEndDate);

				NotifyUpdate(selectionStartDate, selectionEndDate);

				triggerEvent();
			}

			function scroll(delta) {

				_elements.scale.timescale('scroll', delta);
				sliderChanged();
			}


			function pickdate(button, date, callback) {


				var popup = $('<div data-role="popup"/>').popup({
					dismissible: true,
					theme: "c",
					transition: "pop",
					positionTo: button
				});

				var datepicker = $('<div data-role="datepicker"/>').appendTo(popup).datepicker();
				 
				popup.on('popupafterclose', function() {
					$(this).remove();
				});

				datepicker.on("datechanged", function() {
					popup.popup('close');
					callback(datepicker.datepicker('getDate'));
				});

				popup.popup('open');
			}


			function init() {
				_page.hookup(_elements, 'data-id');

				_elements.desktop.desktop('editMode', false);
  
				_elements.editmode.on('tap', function() {
					_elements.desktop.desktop('editMode', !_elements.desktop.desktop('editMode'));
					_elements.popup.content.popup('close');
				});

				_elements.logout.on('tap', function() {
					// Make sure to remove this page when leaving it...
					_page.on('pagehide', function(event, ui) {
						$(this).remove();
					});

					$.mobile.pages.push('../login/login.html', {
						transition: 'fade'
					});
				});

				_elements.settings.on('tap', function() {
					$.mobile.pages.push('../settings/settings.html', {
						transition: 'fade'
					});
				});


				_elements.iconviewlist.on('tap', function() {
					_elements.iconviewcalendar.removeClass('selected');
					_elements.iconviewicon.removeClass('selected');
					_elements.iconviewlist.addClass('selected');
					$.cookie('desktopview', 'list');
				});

				_elements.iconviewcalendar.on('tap', function() {
					_elements.iconviewlist.removeClass('selected');
					_elements.iconviewicon.removeClass('selected');
					_elements.iconviewcalendar.addClass('selected');
					$.cookie('desktopview', 'calendar');
				});

				_elements.iconviewicon.on('tap', function() {
					_elements.iconviewcalendar.removeClass('selected');
					_elements.iconviewlist.removeClass('selected');
					_elements.iconviewicon.addClass('selected');
					$.cookie('desktopview', 'icon');
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


				_elements.slider.on('positionchanged', sliderChanged);
				_elements.slider.on('rangechanged', sliderChanged);
				_elements.slider.on('lengthchanged', sliderChanged);
				_elements.slider.on('scroll', function(event, delta) {
					scroll(delta);
				});
				_elements.slider.on('doubletap', function(event) {
					setSliderInStartPosition();
				});
								
				
				setSliderInStartPosition();
				
				_elements.startdate.button.on('tap', function(event) {

					event.preventDefault();

					pickdate($(this), _startDate, function(date) {
						_startDate = date;
						startDateChanged();
					});

				});

				_elements.enddate.button.on('tap', function(event) {

					event.preventDefault();

					pickdate($(this), _endDate, function(date) {
						_endDate = date;
						endDateChanged();
					});

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
				
				triggerEvent();
				
				
			}

			init();

			_page.on("pagebeforeshow", function(event) {
				console.log('main - pagebeforeshow');
			});

			
			_page.on("pageshow", function(event) {
				console.log('main - pageshow');
				redrawForResize();
				//_page.trigger('updatelayout');
			});
			
			console.log('disktop:');
			console.log(_elements.desktop.innerHeight());

		}
		
		$(document).on("pageinit", "#main-page", function(event) {
			new Module($(event.currentTarget));
		});



	});


})();
