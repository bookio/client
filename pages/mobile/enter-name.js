(function () {

    var dependencies = [
    ];

    define(dependencies, function () {

        function Module(page) {

            var _element = page.element;
            var _elements = {};
            var _params = page.params;


            function enableDisable() {
                _elements.submit.toggleClass('ui-disabled', _elements.info.val().length < 5);
            }

            function findCustomer(email) {

            }

            function enableEventsHandlers() {

                _elements.back.on('tap', function (event) {
                    $.mobile.pages.pop();
                });

                _elements.info.on('blur', function (event) {
 	               var lines = _elements.info.val().split('\n');
                
                    var email = lines[0];
                    var url = sprintf('customers/search/%s', email);
                    var request = Gopher.request('GET', url);

                    request.done(function (customers) {
                        if (customers.length > 0) {
                            var customer = customers[0];
                            _elements.info.val(lines[0] + '\n' + customer.name);
                        }
                    });

                });
                
                _elements.info.on('keydown', function (event) {
	                	enableDisable();
                });	                

                _elements.submit.on('tap', function (event) {

					var lines = _elements.info.val().split('\n');

                    var email = lines[0]; //_elements.customer.email.val();
                    var name = lines[1]; //_elements.customer.name.val();

                    var url = sprintf('customers/search/%s', email);
                    var request = Gopher.request('GET', url);

                    $.spin(true);

                    request.done(function(customers) {
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

							console.log('Saving reservation', reservation);

                            var request = Model.Reservations.save(reservation);
                            
                            request.done(function (reservation) {

                                $.mobile.pages.push('./thank-you.html', {
                                    params: _params,
                                    transition: 'slide'
                                });

                            });
                            
                            request.always(function() {
                                $.spin(false);
                            });

                        });
                        
                        request.fail(function() {
                            $.spin(false);
                        });

                    });
                    
                    request.fail(function() {
                        $.spin(false);
                    });

                });


            }

            this.init = function() {

                _params.customer = _params.customer ? _params.customer : null;

                _element.hookup(_elements, 'data-id');

                _elements.category.name.text(_params.option.name);
                _elements.category.description.text(_params.option.description);
                
                _elements.price.text("160 SEK");
                
                var from = moment(_params.startDate).format("l");  
                var to = moment(_params.endDate).format("l");  
                
                _elements.when.text(sprintf("%s - %s", from, to));

                enableEventsHandlers();
                enableDisable();
            }
        }

		return Module;
		


    });


})();