

(function() {

	var dependencies = [
	   'less!./reservation',
	   'js/parser',
	   'components/datepicker'
	];

	define(dependencies, function() {
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};

    	    var _timer = null;
    	    var _modal = null;
    	    var _customer = {};
    	    var _reservation = {};
    	    var _customers = [];
            var _datepicker = null;
            
			function search() {
                var query = _elements.contact.val().trim();
    
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
                    
                }
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
            	
            	var lines = contact.replace(/\r\n/g,'\n').split('\n');
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
	            
	            _elements.when.val(sprintf('%s - %s', beginAt.yyyymmdd(), endAt.yyyymmdd()));;
	            _elements.price.val(_reservation.price);
	            _elements.arrived.attr('checked', _reservation.arrived ? true : undefined);
	            _elements.transferred.attr('checked', _reservation.transferred ? true : undefined);
	            _elements.payed.attr('checked', _reservation.payed ? true : undefined);
	            _elements.delivered.attr('checked', _reservation.delivered ? true : undefined);

	            _elements.arrived.checkboxradio('refresh');    	        
	            _elements.transferred.checkboxradio('refresh');    	        
	            _elements.payed.checkboxradio('refresh');    	        
	            _elements.delivered.checkboxradio('refresh');    	        
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
                   $.mobile.popPage();
                });


                _elements.datepickerbutton.on('tap', function(){
                    		       
    	            function dateChanged() {
			           _elements.popup.popup('close');	
			           
		            }
		       		
		            var datepicker = new DatePicker({dateChanged:dateChanged});
		      
		            var options = {
				        dismissible : true,
				        theme : "c",
				        overlyaTheme : "a",
				        transition : "pop",
				        positionTo: _elements.datepickerbutton
		            };

                    _elements.popup.empty();
                    _elements.popup.append(datepicker.html());
                    _elements.popup.trigger('create');
                    _elements.popup.popup(options);
                    _elements.popup.popup('open');
                    return;

		            var popup = $("<div/>").popup(options);
		           				    
				    popup.on("popupafterclose", function() {
				        $(this).remove();
				    });

				    popup.append(datepicker.html());
				
                    popup.popup("open").trigger("create");
                });
	           
                _elements.selectcustomer.on('tap', function(event) {

    	           event.preventDefault();
    	           event.stopPropagation();


    	           if (_customers.length == 0)
    	               return;
    	               
    	           var listview = $('<ul data-role="listview" data-inset="true" data-theme="c"></ul>');

                    $.each(_customers, function(index, customer) {

                        var li = $('<li data-icon="false"></li>');
                        var a = $('<a href="#"></a>');
                        var p = $('<p></p>')
                        var h3 = $('<h3></h3>')

                        h3.text(customer.name);
                        p.text(customer.email);
                        a.data('customer', customer);
                        
                        a.on('tap', function() {
                        
                            var customer = $(this).data('customer');
                            
                            _customer = customer;
                            updateContactFromCustomer(customer);

                            _elements.popup.popup('close');
                        });
                                            
                        a.append(h3);    
                        a.append(p);
                        li.append(a);

                        listview.append(li);
                    });
                    
		            var options = {
				        dismissible : true,
				        theme : "c",
				        overlyaTheme : "a",
				        transition : "pop",
				        positionTo: _elements.selectcustomer
		            };

    				
                    _elements.popup.empty();
                    _elements.popup.append(listview);
                    _elements.popup.trigger('create');
                    _elements.popup.popup(options);
                    _elements.popup.popup('open');
                });
	
	            _elements.save.on("tap", function(){
	            	
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
            	            $.mobile.popPage();
                    	});
                    	
                	});
                    	
	                
	            });
	
	
	            _elements.remove.on("tap", function(){
    
    	            Model.Reservations.remove(_reservation).done(function(){
        	            $.mobile.popPage();
    	            });
	            });
	
	        }        
	        
            
            
            
	        function init() {

	           _page.hookup(_elements);


				_reservation = $.mobile.pageData.reservation;
                	    	
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

	            if (!_reservation.id)
	                _elements.remove.addClass('hidden');

	            if (_reservation.customer_id)
	                _elements.selectcustomer.addClass('hidden');
				
				$.when.apply(this, requests).then(function() {

					_datepicker = new DatePicker({container:_elements.datepickerpopup});

		            // Make IE hide the focus
		            //_elements.html.find('.hidefocus').attr('hideFocus', 'true').css('outline', 'none');
		
		            _elements.contact.on('change', function(event) {
		                var text = _elements.contact.val();
		                
		                Model.Customers.search(text, function(customers) {
	    	                console.log(customers);
		                });
	    	            
		            });	
	
		            _elements.save.find('.ui-btn-text').text(_reservation.id ? 'Spara' : 'Boka');
		            
		
		            if (_customer)
			            updateContactFromCustomer(_customer);
		            

		            updateDOM();
		            enableButtonActions();	
			
				});


	        }	  

	        init();
		}

    	$(document).delegate("#reservation-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
