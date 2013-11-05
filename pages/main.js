(function() {

	var dependencies = [
		'css!./main',

		'../components/desktop',
		'../components/timeslider',
		'../components/notify',
		'../components/timescale',
		'../components/daterangepicker'
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

				var range = Math.floor(_timeSlider.element().innerWidth() / 80);

				_timeSlider.range(range);
				_timeScale.endDate(_timeScale.startDate().addDays(_timeSlider.range()));
				sliderChanged();
			}


			function setSliderInStartPosition() {

				_timeSlider.position(0); // Set Now as start position
				_timeSlider.length(1); // Fill only one 'time slot'

				var date = new Date();
				date.clearTime();

				_timeScale.startDate(date);
				_timeScale.endDate(date.addDays(_timeSlider.range()));

				sliderChanged();
			}


			function sliderChanged() {
				var selectionStartDate = _timeScale.startDate().addDays(_timeSlider.position());
				var selectionEndDate = selectionStartDate.addDays(_timeSlider.length());

				_desktop.startDate(selectionStartDate);
				_desktop.endDate(selectionEndDate);

				_timeSlider.positionGripper();

				NotifyUpdate(selectionStartDate, selectionEndDate);

				triggerEvent();
			}

			function startDateChanged() {
				var selectionStartDate = _startDate.clone(); //_picker.startDate().clone();
				var selectionEndDate = selectionStartDate.addDays(_timeSlider.length());

				var rangeStartDate = selectionStartDate.addDays(-1 * _timeSlider.position());
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

				var rangeStartDate = selectionStartDate.addDays(-1 * _timeSlider.position());
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


			function pickdate(button, date, callback) {
				function dateChanged() {
					popup.popup('close');
					callback(datepicker.date());
				}

				var datepicker = new DatePicker({
					dateChanged: dateChanged,
					date: date
				});

				var options = {
					dismissible: true,
					theme: "c",
					overlyaTheme: "c",
					transition: "pop",
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

				_desktop = new Desktop(_elements.desktop, {page:_page});
				_desktop.editMode(false);


				_elements.editmode.on('tap', function() {
					_desktop.editMode(!_desktop.editMode());
					_elements.popup.content.popup('close');
				});

				_elements.logout.on('tap', function() {
					// Make sure to remove this page when leaving it...
					_page.on('pagehide', function(event, ui) {
						$(this).remove();
					});

					$.mobile.pushPage('./login.html', {
						transition: 'fade',
						require: './login'
					});
				});

				_elements.settings.on('tap', function() {
					$.mobile.pushPage('./settings.html', {
						transition: 'fade',
						require: './settings'
					});
				});


				_elements.popup.menu.on('tap', function() {

					var options = {
						dismissible: true,
						theme: "c",
						overlyaTheme: "a",
						transition: "pop",
						positionTo: $(this)
					};

					_elements.popup.content.popup(options);
					_elements.popup.content.popup('open');
				});

				_timeSlider = new TimeSlider(_elements.slider, {
					scroll: scroll,
					positionChanged: sliderChanged,
					lengthChanged: sliderChanged,
					sliderDblClicked: setSliderInStartPosition
				});

				_timeSlider.range(10);
				_timeScale = new TimeScale(_elements.scale, {});

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

				//sliderChanged();
				//triggerEvent();

				_page.trigger('updatelayout');
			}

			init();

			_page.on("pageshow", function(event) {
				redrawForResize();
			});


		}

		$(document).delegate("#main-page", "pageinit", function(event) {
			new Module($(event.currentTarget));
		});


	});


})();
