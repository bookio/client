define(['module', 'css!./desktop'], function(module) {


	var Widget = function(widget) {

		var self = this;

		var _defaults = {
			iconMargin: 10,
			iconSpacing: 0,
			iconSize: 100
		};

		var _options = $.extend({}, _defaults, {});
		var _element = null;
		var _startDate = new Date();
		var _endDate = new Date();
		var _editMode = false;
		var _elements = {};
		var _initialRefreshDone = false;
		var _page = widget.element.parents("[data-role='page']");

		var _reservations = {};
		var _customers = {};
		var _rentals = {};
		var _icons = {};
		var _desktopSize = {};


		Model.Rentals.on('added.desktop', function(rental) {

			// Turn of intro mode
			setIntroMode(false);

			_rentals[rental.id] = rental;
			
			// Everything is full, add on top others
			addRentalToScene(rental);

			savePositions();
		});

		Model.Rentals.on('updated.desktop', function(rental) {
			updateRental(rental);
		});

		Model.Rentals.on('removed.desktop', function(rental) {

			var rentals = Model.Rentals.fetch();
			var reservations = Model.Reservations.fetch();

			rentals.done(gotRentals);
			reservations.done(gotReservations);

			$.when(rentals, reservations).then(function() {
				placeRentals();
				updateRentalAvailability();
				
				if ($.isEmpty(_rentals))
					setIntroMode(true);
			});

		});

		Model.Customers.on('added.desktop updated.desktop', function(customer) {
			_customers[customer.id] = customer;
		});

		Model.Reservations.on('added.desktop updated.desktop', function(reservation) {

			if (!_reservations[reservation.rental_id])
				_reservations[reservation.rental_id] = {};

			_reservations[reservation.rental_id][reservation.id] = reservation;

			updateRentalAvailability();

		});

		Model.Reservations.on('removed.desktop', function(reservation) {

			var reservations = Model.Reservations.fetch();

			reservations.done(function(reservations) {
				gotReservations(reservations);
				updateRentalAvailability();
			});
		});


		function getReservationForRental(rental) {
			var reservations = _reservations[rental.id];

			if (reservations == undefined)
				return null;

			for (var key in reservations) {
				var reservation = reservations[key];

				var start = new Date(reservation.begin_at);
				var end = new Date(reservation.end_at);

				if (end <= _startDate || start >= _endDate) {}
				else {
					return reservation;
				}
			}

			return null;

		}

		function isRentalAvailable(rental) {
			return getReservationForRental(rental) == null ? true : false;
		}

		function updateRentalAvailability() {
			var items = _element.find('.item');

			$.each(items, function(i, element) {
				var item = $(element);
				var rental = item.data('rental');

				if (isRentalAvailable(rental))
					item.removeClass("disabled");
				else
					item.addClass("disabled");
			});
		}




		function computeMaxCols() {
			return Math.floor((_desktopSize.width - 2 * _options.iconMargin) / (_options.iconSpacing + _options.iconSize));
		}

		function computeMaxRows() {
			return Math.floor((_desktopSize.height - 2 * _options.iconMargin) / (_options.iconSpacing + _options.iconSize));
		}


		function newReservation(rental) {

			var reservation = {};
			reservation.begin_at = _startDate;
			reservation.end_at = _endDate;
			reservation.rental_id = rental.id;

			$.mobile.pages.push('../reservation/reservation.html', {
				transition: 'fade',
				params: {
					reservation: reservation
				}
			});

		};


		function placeRentals() {

			var maxCols = computeMaxCols();
			var maxRows = computeMaxRows();

			var index = 0;

			_element.find('.item').remove();

			for (var rental_id in _rentals) {
				var rental = _rentals[rental_id];
				addRentalToScene(rental);
			}
		}



		function savePositions() {

			_element.find('.item').each(function() {
				var rental = $(this).data('rental')

				if (rental.dirty === true) {
					Model.Rentals.save(rental);
					delete rental.dirty;
				}
			});

		}

		function gotCustomers(customers) {

			_customers = {};

			$.each(customers, function(i, customer) {
				_customers[customer.id] = customer;
			});

		}



		function gotIcons(icons) {
			_icons = {};
			
			$.each(icons, function(index, icon) {
				_icons[icon.id] = icon;
				
			});
		}



		function removeSelectedRental() {
			var elements = _element.find('.title.selected');

			$.each(elements, function(i, element) {
				var item = $(element).parent();
				var rental = item.data('rental');

				Model.Rentals.remove(rental);
			});

		};


		function gotRentals(rentals) {
			_rentals = {};

			$.each(rentals, function(i, rental) {
				_rentals[rental.id] = rental;
			});
		}

		function gotReservations(reservations) {
			_reservations = {};

			$.each(reservations, function(i, reservation) {

				if (!_reservations[reservation.rental_id])
					_reservations[reservation.rental_id] = {};

				_reservations[reservation.rental_id][reservation.id] = reservation;

			});

		}


		function enableEscKey() {

			$(document).on('keyup.desktop', function(event) {

				if (event.keyCode == 27) {
					widget.element.invoke('set', {editMode:false});
				}
			});

		};



		function init() {

			var template =
				'<div class="desktop">' +
				'<div class="intro">' +
				'<div data-id="intro.text" class="text"></div>' +
				'<div data-id="intro.arrow" class="arrow"></div>' +
				'<div data-id="intro.house" class="house"></div>' +
				'<div data-id="intro.man" class="man"></div>' +
				'<div data-id="intro.squash" class="squash"></div>' +
				'<div data-id="intro.bike" class="bike"></div>' +
				'<div data-id="intro.car" class="car"></div>' +
				'</div>' +
				'<div data-id="buttons.add" class="add button"></div>' +
				'<div data-id="buttons.close" class="close button"></div>' +
				'</div>';

			_element = $(template).appendTo(widget.element);

			_element.hookup(_elements, 'data-id');


			_element.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {
				_element.find('.title').removeClass('selected');
			});

			_elements.buttons.add.on("mousedown touchstart", function(event) {
				$.mobile.pages.push('../rental/rental.html', {
					transition: 'fade'
				});
			});


			_elements.buttons.close.on("mousedown touchstart", function(event) {
				widget.element.invoke('set', {editMode:false});
			});



			widget.element.define('set', function(data) {
				var changed = false;

				if (data.startDate != undefined)
					_startDate = data.startDate, changed = true;
					
				if (data.endDate != undefined)
					_endDate = data.endDate, changed = true;
					
				if (data.editMode != undefined) {
					setEditMode(data.editMode);
					disableMouseActions();
		
					_element.find('.item').each(function(index) {
						enableMouseActions($(this));
					});
				}
				
				if (changed) {
					updateRentalAvailability();				
				}
			});
			
			widget.element.define('get', function(data) {
				data.startDate = _startDate;
				data.endDate = _endDate;
				data.editMode = _editMode;
			});

			widget.element.define('refresh', function() {
	
				_desktopSize = {
					width: _element.innerWidth(),
					height: _element.innerHeight()
				};
	
				if (_initialRefreshDone) {
					return;
				}
	
				var gopher = Gopher;
	
				var rentals = Model.Rentals.fetch();
				var reservations = Model.Reservations.fetch();
				var customers = Model.Customers.fetch();
				var icons = Model.Icons.fetch();
	
				rentals.done(gotRentals);
				reservations.done(gotReservations);
				customers.done(gotCustomers);
				icons.done(gotIcons);
	
				$('body').spin("large");
	
				$.when(rentals, reservations, customers, icons).then(function() {
					$('body').spin(false);
	
					placeRentals();
					updateRentalAvailability();
					savePositions();
					
					if (Object.keys(_rentals).length == 0) {
						setEditMode(true);
						setIntroMode(true);
					}
	
					_initialRefreshDone = true;
				});
	
			});


			// Remove all my notifications when the element is destroyed
			_element.on('removed.desktop', function() {
				Model.Reservations.off('.desktop');
				Model.Customers.off('.desktop');
				Model.Rentals.off('.desktop');
				_page.off('.desktop');
				$(document).off('.desktop');
				$(window).off('.desktop');
			});


			enableEscKey();


		};


		function positionItem(item, col, row, speed) {

			var maxCols = computeMaxCols();
			var maxRows = computeMaxRows();
			var rental = item.data('rental');

			row = Math.min(row, maxRows - 1);
			row = Math.max(row, 0);

			col = Math.min(col, maxCols - 1);
			col = Math.max(col, 0);

			var x = _options.iconMargin + (col * (_options.iconSize + _options.iconSpacing));
			var y = _options.iconMargin + (row * (_options.iconSize + _options.iconSpacing));

			if (rental.data.position.x != col || rental.data.position.y != row) {
				rental.data.position.x = col;
				rental.data.position.y = row;
				rental.dirty = true;
			}
			
			if (isNumeric(speed))
				item.transition({
					left: x,
					top: y
				}, speed, 'ease-in-out');
			else
				item.css({
					left: x,
					top: y
				});

		}

		function isPositionAvailable(x, y) {

			var available = true;

			_element.find('.item').each(function() {
				var rental = $(this).data('rental');
				
				if (isObject(rental.data) && isObject(rental.data.position)) {
					var position = rental.data.position;
	
					if (position.x == x && position.y == y) {
						available = false;
						return false;
					}
				}
			});

			return available;
		}

		function updateRental(rental) {

			_element.find('.item').each(function(index) {

				var item = $(this);

				if (rental.id == item.data('rental').id) {
					var title = item.find('.title');
					var image = item.find('img');

					if (rental.icon_id && _icons[rental.icon_id])
						image.addClass(sprintf('symbol-%04d', rental.icon_id));
						//image.attr('src', '../../images/symbols/' + _icons[rental.icon_id].image);
					else
						image.addClass(sprintf('symbol-%04d', 0));
						//image.attr('src', '../../images/symbols/0000.png');

					title.text(rental.name);

					item.data('rental', rental);

					return false;
				}
			});
		}

		function addRentalToScene(rental) {
			var template =
				'<div class="item">' +
				'<div class="icon"><img class="tint"/></div>' +
				'<br>' +
				'<div class="title"></div>' +
				'</div>'

			var item = $(template);
			var image = item.find('img');

			if (rental.icon_id && _icons[rental.icon_id])
				image.addClass(sprintf('symbol-%04d', rental.icon_id));
				//image.css('-webkit-mask-image', 'url(../../images/symbols/' + _icons[rental.icon_id].image + ')');
			else
				image.addClass(sprintf('symbol-%04d', 0));
				//image.css('-webkit-mask-image', 'url(../../images/symbols/0000.png)');

			_element.append(item);

			item.data('rental', rental);

			if (rental.name) {
				var title = item.find('.title');

				title.text(rental.name);

				// Ignore mousedown on the title
				title.on("mousedown touchstart", function(event) {
					event.preventDefault();
					event.stopPropagation();
				});
			}
			
			if (!isObject(rental.data))
				rental.data = {};
				
			if (rental.data.position == undefined) {
				rental.data.position = {};

				var cols = computeMaxCols();
				var rows = computeMaxRows();
				var cells = cols * rows;
	
				console.log("rows", rows, "cols", cols);
				
				for (var i = 0; i < cells; i++) {
					var y = Math.floor(i / cols);
					var x = i % cols;
	
					if (isPositionAvailable(x, y)) {
						
						rental.data.position.x = x;
						rental.data.position.y = y;
						
						rental.dirty = true;
						break;
					}
				}
			}			

			positionItem(item, rental.data.position.x, rental.data.position.y);
			enableMouseActions(item);

			return item;

		}


		function bringItemToTop(item) {
			var parent = item.parent();

			// Detach and attach again so it will be on top
			item.detach();
			parent.append(item);

		}

		function removeReservation(reservation) {
			Model.Reservations.remove(reservation);

		}

		function editReservation(reservation) {

			$.mobile.pages.push('../reservation/reservation.html', {
				transition: 'fade',
				params: {
					reservation: reservation
				}
			});
		}


		function setEditMode(mode) {

			if (mode) {
				_element.addClass('editmode');
			}
			else {
				_element.removeClass('editmode');
				_element.removeClass('intromode');
			}
			
			_editMode = mode;
			
		}
		
		function setIntroMode(mode) {
			if (mode) {
				_element.addClass('intromode');				
			}
			else {
				_element.removeClass('intromode');
			}
		}




		function disableMouseActions() {
			_element.find('.item').each(function(index) {
				$(this).off();
			});
		}

		function enableMouseActions(item) {
			if (_editMode)
				enableDragDrop(item);
			else
				enableClicks(item);
		}

		function enableClicks(item) {

			item.on('doubletap', function(event) {

				var rental = item.data('rental');
				var reservation = getReservationForRental(rental);

				if (reservation == null) {
					newReservation(rental);
				}

				if (reservation != null) {
					editReservation(reservation);
				}
			});

			item.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {

				if (!event.shiftKey) {
					_element.find('.selected').removeClass('selected');
				}

				item.addClass('selected');

				bringItemToTop(item);

				event.stopPropagation();
				event.preventDefault();
			});

		};

		function enableDragDrop(item) {

			item.on('doubletap', function(event) {

				var rental = item.data('rental');
				var reservation = getReservationForRental(rental);

				var params = {};
				params.rental = rental;

				$.mobile.pages.push('../rental/rental.html', {
					transition: 'fade',
					params: params
				});

			});

			item.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {

				event.stopPropagation();
				event.preventDefault();

				var pageX = event.originalEvent.pageX;
				var pageY = event.originalEvent.pageY;

				var parent = item.parent();
				var icon = item.find('.icon');
				var title = item.find('.title');

				if (!icon.hitTest(pageX, pageY))
					return;


				var offsetX = pageX - parent.offset().left - item.position().left;
				var offsetY = pageY - parent.offset().top - item.position().top;

				bringItemToTop(item);


				var dragging = true;
				var moved = false;

				if (!event.shiftKey) {
					_element.find('.selected').removeClass('selected');

				}

				item.addClass('selected');

				$(document).on(isTouch() ? 'touchmove.desktop-dragdrop' : 'mousemove.desktop-dragdrop', function(event) {

					event.preventDefault();
					event.stopPropagation();

					moved = true;

					// Update pageX and pageY since the "touchend" event does not contain valid values for pageX and pageY
					pageX = event.originalEvent.pageX;
					pageY = event.originalEvent.pageY;

					var x = pageX - parent.offset().left - offsetX;
					var y = pageY - parent.offset().top - offsetY;

					x = Math.max(x, 0);
					x = Math.min(x, parent.innerWidth() - item.outerWidth());
					y = Math.max(y, 0);
					y = Math.min(y, parent.innerHeight() - item.outerHeight());

					item.css({
						left: x,
						top: y
					});

				});

				$(document).on(isTouch() ? 'touchend.desktop-dragdrop' : 'mouseup.desktop-dragdrop', function(event) {
					event.preventDefault();
					event.stopPropagation();

					// Use event.pageX and event.pageY if "mouseup" otherwise use last value of pageX/pageY
					if (event.type == "mouseup") {
						pageX = event.originalEvent.pageX;
						pageY = event.originalEvent.pageY;
					}

					var x = pageX - parent.offset().left - offsetX;
					var y = pageY - parent.offset().top - offsetY;

					dragging = false;

					var row = Math.round((y - _options.iconSpacing) / (_options.iconSize + _options.iconSpacing));
					var col = Math.round((x - _options.iconSpacing) / (_options.iconSize + _options.iconSpacing));

					$(document).off(".desktop-dragdrop");

					if (moved) {
						positionItem(item, col, row, 300);
						savePositions();
					}

				});
			});
		}
		
		init();

	}

	function defineWidget() {
		var widget = {};

		widget.options = {};

		widget._create = function() {
			this.widget = new Widget(this);
		}

		$.widget("mobile.desktop", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=desktop)", e.target).desktop();
		});
	}

	defineWidget();




});
