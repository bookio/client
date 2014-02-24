(function() {

	var dependencies = [
		'text!./desktoplist.html',
//		'../../lib/moment/moment-2.5.1',
		'css!./desktoplist.css'
	];

	define(dependencies, function(template) {

		
		var Widget = function(widget) {
	
			var self = this;
	
			var _defaults = {
			};
	
			var _options = $.extend({}, _defaults, {});
			var _element = widget.element;
			var _startDate = new Date();
			var _endDate = new Date();
			var _elements = {};
			var _page = widget.element.parents("[data-role='page']");
	
			var _reservations = {};
			var _customers = {};
			var _rentals = {};
			var _icons = {};
	
			function isReservationInThePast(reservation) {
				return reservation.end_at <= _startDate;				
			}
			
			function isReservationInTheFuture(reservation) {
				return reservation.begin_at >= _endDate;				
			}

			function isReservationActive(reservation) {
			
				if (reservation == undefined)
					return false;
					
				if (reservation.end_at <= _startDate || reservation.begin_at >= _endDate)
					return false;
				else
					return true;
			}

			function getReservationForRental(rental) {
				var reservations = _reservations[rental.id];
	
				if (reservations == undefined)
					return null;

				for (var key in reservations) {
					var reservation = reservations[key];
					
					if (isReservationActive(reservation))
						return reservation;
				}
	
				return null;
			}
	
			function isRentalAvailable(rental) {
				return getReservationForRental(rental) == null ? true : false;
			}
	
			function gotCustomers(customers) {
	
				_customers = {};
	
				$.each(customers, function(i, customer) {
					_customers[customer.id] = customer;
				});
	
			}
	
			function gotIcons(icons) {
				_icons = {};
	
				$.each(icons, function(i, icon) {
					_icons[icon.id] = icon;
				});
	
			}
	
			function gotRentals(rentals) {
			
				_rentals = {}
				
				$.each(rentals, function(i, rental) {
					_rentals[rental.id] = rental;
				});
			}
	
			function gotReservations(reservations) {
				_reservations = {};

				$.each(reservations, function(i, reservation) {
					// Make into Date objects
					reservation.begin_at = new Date(reservation.begin_at);
					reservation.end_at = new Date(reservation.end_at);
	
					if (_reservations[reservation.rental_id] == undefined)
						_reservations[reservation.rental_id] = [];
	
					_reservations[reservation.rental_id].push(reservation);
	
				});
				
				// Sort by reservation by start time
				for (var key in _reservations) {
					var reservations = _reservations[key];
					
					reservations.sort(function(a, b) {
						var delta = a.valueOf() - b.valueOf();
						
						if (delta < 0)
							return -1;
						if (delta > 0)
							return 1;
						
						return 0;
					});
					 
				}
			}
	
			function updateRow(row) {
	
				var rental = row.data('rental');
				var image = row.find('.icon img');
				var name = row.find('.name');
				var description = row.find('.description');
				var customerName = row.find('.customer');
				var reservations = _reservations[rental.id];
				var reservation = undefined;
								
				if (reservations == undefined)
					reservations = [];
	
				name.text(rental.name);
				description.text(rental.description);
					
				for (var key in reservations) {
					reservation = reservations[key];
					
					if (!isReservationInThePast(reservation))
						break;
				}
				
				var customer = (reservation != undefined && reservation.customer_id != undefined) ? _customers[reservation.customer_id] : undefined;

				if (customer != undefined) {
					if (isReservationActive(reservation))
						customerName.text(customer.name);
					else if (isReservationInTheFuture(reservation))
						customerName.text(customer.name + ' ' + moment(reservation.begin_at).from(_startDate));
					else
						customerName.text('-');
				}					
				else
					customerName.text('-');
					
				if (rental.icon_id && _icons[rental.icon_id])
					image.attr('src', '../../images/symbols/' + _icons[rental.icon_id].image);
				else
					image.attr('src', '../../images/symbols/0000.png');
	
				row.toggleClass("disabled", isReservationActive(reservation));
				
			}
	
			function createRow(rental) {
				var template = 
					'<tr class="item">'+
						'<td class="icon">'+
							'<img/>'+
						'</td>'+
						'<td class="name">'+
						'</td>'+
						'<td class="description">'+
						'</td>'+
						'<td class="customer">'+
						'</td>'+
					'</tr>';
	
				var row = $(template);
	
				row.data('rental', rental);
				
				updateRow(row);
				
				return row;
			}
			
			function updateRentalAvailability() {
				var rows = _element.find('tbody tr');
	
				$.each(rows, function(i, row) {
					updateRow($(row));
				});
			}
			
			
			function refresh() {
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
	
					_elements.table.body.empty();
				
					var keys = [];
					
					for (var key in _rentals) {
						if (_rentals.hasOwnProperty(key))
							keys.push(key);
						
					}
					
					keys.sort();
	
					for (var index in keys) {
						var key = keys[index];
						var rental = _rentals[key];
									
						_elements.table.body.append(createRow(rental));
					}
	
					$('body').spin(false);
	
				});
	
				
			}
	
			function init() {
	
				_element.append($(template));
				_element.hookup(_elements, 'data-id');
	
				_element.define('set', function(data) {
					var changed = false;
	
					if (data.startDate != undefined)
						_startDate = data.startDate, changed = true;
						
					if (data.endDate != undefined)
						_endDate = data.endDate, changed = true;
					
					if (changed) {
						updateRentalAvailability();				
					}
				});
				
				_element.define('get', function(data) {
					data.startDate = _startDate;
					data.endDate = _endDate;
				});
	
				_element.define('refresh', function() {
					refresh();
				});
	
	
				// Remove all my notifications when the element is destroyed
				_element.on('removed.desktop', function() {
					Notifications.off('.desktop');
					$(document).off('.desktop');
					$(window).off('.desktop');
				});
	
	
			};
	
	
			init();
	
		}
	
	
		function defineWidget() {
			var widget = {};
	
			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
	
			$.widget("mobile.desktoplist", $.mobile.widget, widget);
	
			$(document).bind("pagecreate create", function(e) {
				$(":jqmData(role=desktoplist)", e.target).desktoplist();
			});
		}
	
		defineWidget();
	


	});

}());

