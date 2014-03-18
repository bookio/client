(function() {

	var dependencies = [
		'text!./desktoplist.html',
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
	
	
			function load() {

				var request = {};
				request.rentals = Model.Rentals.fetch();
				request.reservations = Model.Reservations.fetch();
				request.customers = Model.Customers.fetch();
				request.icons = Model.Icons.fetch();
	
				var result = {};
				result.rentals = {};
				result.customers = {};
				result.icons = {};
				result.reservations = {};
				
				request.rentals.done(function(rentals) {
					
					$.each(rentals, function(i, rental) {
						result.rentals[rental.id] = rental;
					});
					
				});
				
				request.reservations.done(function(reservations) {
					$.each(reservations, function(i, reservation) {
						// Make into Date objects
						reservation.begin_at = new Date(reservation.begin_at);
						reservation.end_at = new Date(reservation.end_at);
		
						if (result.reservations[reservation.rental_id] == undefined)
							result.reservations[reservation.rental_id] = [];
		
						result.reservations[reservation.rental_id].push(reservation);
		
					});
					
					// Sort by reservation by start time
					for (var key in result.reservations) {
						var reservations = result.reservations[key];
						
						reservations.sort(function(a, b) {
							var delta = a.valueOf() - b.valueOf();
							
							if (delta < 0)
								return -1;
							if (delta > 0)
								return 1;
							
							return 0;
						});
						 
					}
						
				});
				
				request.customers.done(function(customers) {
					$.each(customers, function(i, customer) {
						result.customers[customer.id] = customer;
					});
					
				});
	
				request.icons.done(function(icons) {
					$.each(icons, function(i, icon) {
						result.icons[icon.id] = icon;
					});
					
				});
				
				var defer = $.Deferred();
	
				function failure() {
					defer.reject();					
				}
				
				function success() {
					defer.resolve(result);
				}
				
				$.when(request.rentals, request.reservations, request.customers, request.icons).then(success, failure);
	
				return defer;
			}
	
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
					
				image.addClass(sprintf('symbol-%04d', rental.icon_id == undefined ? 0 : rental.icon_id));
				row.toggleClass("disabled", isReservationActive(reservation));
				
			}

			function enableRowSelection(row) {

				row.on('tap', function(event) {

					_elements.table.body.find('tr').removeClass('selected');
					$(this).addClass('selected');	
				});
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
				
				enableRowSelection(row);				
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

				$.spin(true);
	
				var request = load();

				request.always(function() {
					$.spin(false);
				});


				request.done(function(data) {

					_customers = data.customers;
					_reservations = data.reservations;
					_icons = data.icons;
					_rentals = data.rentals; 

					_elements.table.body.empty();
				
					var rentals = [];
					
					for (var key in _rentals) {
						rentals.push(_rentals[key]);
					}
					
					rentals.sort(function(a, b) {
						return a.name.localeCompare(b.name);
					});
	
					$.each(rentals, function(index, rental) {
						_elements.table.body.append(createRow(rental));
					});

	
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


