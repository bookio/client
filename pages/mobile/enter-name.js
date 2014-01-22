(function () {

    var dependencies = [
    ];

    define(dependencies, function () {

        function Module(page) {

            var _element = page.element;
            var _elements = {};
            var _params = page.params;


            function enableDisable() {
                //_elements.search.toggleClass('ui-disabled', _startDate == null || _endDate == null || _startDate >= _endDate);
            }

            function findCustomer(email) {

            }

            function enableEventsHandlers() {

                _elements.back.on('tap', function (event) {
                    $.mobile.pages.pop();
                });

                _elements.customer.email.on('blur', function (event) {
                    var email = _elements.customer.email.val();
                    var url = sprintf('customers/search_email?email=%s', email);
                    var request = Gopher.request('GET', url);

                    request.done(function (customers) {
                        if (customers.length > 0) {
                            var customer = customers[0];
                            _elements.customer.name.val(customer.name);
                        }
                    });

                });

                _elements.submit.on('tap', function (event) {

                                $.mobile.pages.push('./thank-you.html', {
                                    params: _params
                                });
					return;
					
                    var email = _elements.customer.email.val();
                    var name = _elements.customer.name.val();

                    var url = sprintf('customers/search_email?email=%s', email);
                    var request = Gopher.request('GET', url);

                    $('body').spin('large');

                    request.done(function (customers) {
                        var customer = customers.length > 0 ? customers[0] : {};

                        customer.name = name;
                        customer.email = email;
                        
                        var request = Model.Customers.save(customer);

                        request.done(function (customer) {
                            var reservation = {};
                            reservation.customer_id = customer.id;
                            reservation.rental_id = _params.rental.id;
                            reservation.begin_at = _params.startDate;
                            reservation.end_at = _params.endDate;

                            var request = Model.Reservations.save(reservation);
                            request.done(function (reservation) {

                                $.mobile.pages.push('./thank-you.html', {
                                    params: _params
                                });

                            });
                            
                            request.always(function() {
                                $('body').spin(false);
                            });

                        });
                        
                        request.fail(function() {
                            $('body').spin(false);
                        });

                    });
                    
                    request.fail(function() {
                        $('body').spin(false);
                    });


                });


            }

            this.init = function() {

                _params.customer = _params.customer ? _params.customer : null;

                _element.hookup(_elements, 'data-id');

                _elements.category.name.text(_params.category.name);
                _elements.category.description.text(_params.category.description);

                enableEventsHandlers();
                enableDisable();
            }
        }

		return Module;
		


    });


})();