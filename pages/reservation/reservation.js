(function() {

	var dependencies = [
		'i18n!./reservation.json',
		'../../widgets/picker/picker.js',
		'../../js/parser'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};

			var _timer = null;
			var _modal = null;
			var _customer = {};
			var _reservation = page.params.reservation;
			var _customers = [];
			var _startDate = _reservation.begin_at;
			var _endDate = _reservation.end_at;


			function search() {
/*				var query = _elements.contact.val().trim();

				if (_timer != null) {
					clearTimeout(_timer);
					_timer = null;
				}

				if (query.length > 0 && query.split('\n').length == 1) {
					console.log('searching for ' + query);
					var request = Model.Customers.search(query);

					request.done(function(customers) {

						_customers = customers;

						if (customers.length > 0) {
							_elements.selectcustomer.removeClass('ui-disabled');
						}
						else
							_elements.selectcustomer.addClass('ui-disabled');

						$.each(customers, function(index, customer) {
							console.log(customer.name);
						});

					});

				}*/
			}
			
			function updateDates() {
				var sDate = moment(_startDate);
				var eDate = moment(_endDate);

				_elements.dateinput.val(sDate.format('L') + " - " + eDate.format('L'));				
			}

			function updateContactFromCustomer(customer) {
				var text = '';

				var items = [customer.name, customer.email, customer.phone, customer.notes];

				$.each(items, function(index, item) {
					if (item && item.length > 0) {
						if (text.length > 0)
							text += '\n';

						text += item.trim();
					}
				});

				_elements.contact.val(text);

			}

			function updateCustomerFromContact(customer) {
				var contact = _elements.contact.val().trim();

				var lines = contact.replace(/\r\n/g, '\n').split('\n');
				var index = 0;
				var notes = [];

				customer.name = '';
				customer.phone = '';
				customer.email = '';
				customer.notes = '';

				if (index < lines.length) {
					customer.name = lines[index++];
				}

				while (index < lines.length) {
					if (Parser.isEmail(lines[index])) {
						customer.email = lines[index++];
						continue;
					}
					if (Parser.isPhoneNumber(lines[index])) {
						customer.phone = lines[index++];
						continue;
					}

					notes.push(lines[index++]);
				}

				customer.notes = notes.join('\n');
			}


			function enableEnterKey() {

				_elements.html.on('keydown', function(event) {
					//if (event.keyCode == 13)
					//  _elements.okButton.trigger('click');
					if (event.keyCode == 27)
						_modal.close();
				});

			};


			function updateDOM() {

				var beginAt = new Date(_reservation.begin_at);
				var endAt = new Date(_reservation.end_at);

/*				_elements.startdate.date.text(beginAt.yyyymmdd());
				_elements.enddate.date.text(endAt.yyyymmdd());*/

				_elements.price.val(_reservation.price);
				_elements.arrived.attr('checked', _reservation.arrived ? true : undefined);
				_elements.transferred.attr('checked', _reservation.transferred ? true : undefined);
				_elements.payed.attr('checked', _reservation.payed ? true : undefined);
				_elements.delivered.attr('checked', _reservation.delivered ? true : undefined);

				_elements.arrived.checkboxradio('refresh');
				_elements.transferred.checkboxradio('refresh');
				_elements.payed.checkboxradio('refresh');
				_elements.delivered.checkboxradio('refresh');
				
				_elements.resourcename.text(_rental.name);
			}


			function enableButtonActions() {

				_elements.contact.on('keyup', function(event) {

					console.log(sprintf("key: %d", event.keyCode));
					event.preventDefault();
					event.stopPropagation();

					if (_timer != null) {
						clearTimeout(_timer);
						_timer = null;
					}

					_timer = setTimeout(search, 500);

				});

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				function popupHTML(html, options) {


					var popup = $('<div data-role="popup"></div>');

					function close(event) {

						if (options.afterclose && isFunction(options.afterclose)) {
							options.afterclose.apply(undefined, arguments)
						}

						$(event.target).remove();
					}

					var defaults = {
						afterclose: close
					};

					popup.append(html);
					popup.appendTo($.mobile.activePage);
					popup.trigger('create');
					popup.popup($.extend({}, options, defaults));
					popup.popup('open');

					return popup;
				}

				/*_elements.startdate.button.on('tap', function() {

				});

				_elements.enddate.button.on('tap', function() {


				});

				_elements.selectcustomer.on('tap', function(event) {

					event.preventDefault();
					event.stopPropagation();


					if (_customers.length == 0)
						return;

					var popup;
					var listview = $('<ul data-role="listview" data-inset="true" data-theme="a"></ul>');

					$.each(_customers, function(index, customer) {

						var li = $('<li data-icon="false"></li>');
						var a = $('<a href="#"></a>');
						var p = $('<p></p>')
						var h3 = $('<h1></h1>')

						h3.text(customer.name);
						p.text(customer.email);
						a.data('customer', customer);

						a.on('tap', function() {

							var customer = $(this).data('customer');

							_customer = customer;
							updateContactFromCustomer(customer);

							popup.popup('close');
						});

						a.append(h3);
						a.append(p);
						li.append(a);

						listview.append(li);
					});

					var options = {
						dismissible: true,
						//theme: "d",
						//overlyaTheme: "a",
						transition: "pop",
						positionTo: _elements.selectcustomer
					};

					popup = $('<div data-id="MYPOPUP" data-role="popup" data-theme="a"></div>');

					popup.appendTo($.mobile.activePage);
					popup.append(listview);
					popup.trigger('create');
					popup.popup(options);
					popup.popup('open');
				});*/

				_elements.save.on("tap", function() {

					if (_elements.contact.val().trim().length == 0) {
						return;
					}

					updateCustomerFromContact(_customer);

					var saveCustomer = Model.Customers.save(_customer);

					saveCustomer.done(function(customer) {
						_reservation.customer_id = customer.id;
						_reservation.rental_id = _rental.id;
						_reservation.state = 1;
						_reservation.price = _elements.price.val();
						_reservation.arrived = _elements.arrived.is(':checked');
						_reservation.delivered = _elements.delivered.is(':checked');
						_reservation.payed = _elements.payed.is(':checked');
						_reservation.transferred = _elements.transferred.is(':checked');

						var saveReservation = Model.Reservations.save(_reservation);

						saveReservation.done(function(reservation) {
							$.mobile.pages.pop();
						});

					});


				});

				_elements.remove.on("tap", function() {
					Model.Reservations.remove(_reservation).done(function() {
						$.mobile.pages.pop();
					});
				});

			}

			this.init = function() {

				_element.trigger('create');
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				
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
								updateDates();									
							}
							else {
								_endDate = new Date(value);
								updateDates();									
							}
						}

						var d = new Date(dateStr);				
						_elements.divformobiscroll.mobiscroll('setDate', d, false);						
						_elements.divformobiscroll.mobiscroll('option', {onSelect: dateChanged});

						_elements.divformobiscroll.mobiscroll('show');
						
					}

				});
				
				if (!_reservation.id)
					_elements.remove.addClass('hidden');

				//if (_reservation.customer_id)
					//_elements.selectcustomer.addClass('hidden');
					
				_elements.divformobiscroll.mobiscroll().date({
					display: 'bubble',
					anchor: _elements.dateinput,
					showOnTap: false,
					showOnFocus: false
				});

				_elements.save.find('.ui-btn-text').text(_reservation.id ? 'Spara' : 'Boka');
			}
			
			this.refresh = function(callback) {
				
				$.spin(true);
				
				updateDates();				
				
				var requests = [];

				// Load rental if ID specified
				if (_reservation.rental_id) {
					var request = Model.Rentals.fetch(_reservation.rental_id);

					requests.push(request);

					request.done(function(rental) {
						_rental = rental;
					});
				}

				// Load customer if specified
				if (_reservation.customer_id) {
					var request = Model.Customers.fetch(_reservation.customer_id);

					requests.push(request);

					request.done(function(customer) {
						_customer = customer;
					});
				}
				
				// Load options
				if (true) {
					var request = Model.Options.fetch();
					var firstID;
					
					requests.push(request);
	
 					request.done(function(options) {
	 					
						_elements.options.picker();

						$.each(options, function(index, option) {
							if ($.inArray(option.id, _rental.option_ids) != -1) {
								if (firstID == undefined)
									firstID = option.id;
								_elements.options.picker('add', option.id, option.name + " (" + option.description + ")");
							}
						});

						if (firstID != undefined)
							_elements.options.picker('select', firstID);
		
					});

					_elements.options.picker('refresh');
					
				}

				$.when.apply(this, requests).then(function() {

					if (_customer)
						updateContactFromCustomer(_customer);

					updateDOM();
					enableButtonActions();

					callback();
					$.spin(false);

				});

			}
			
		}

		return Module;


	});


})();
