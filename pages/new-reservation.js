
(function() {

	var modules = [
		'jquery', 
		'text!./new-reservation.html', 
		'less!./new-reservation', 
		'components/modal', 
		'components/notify',
		'components/spinner',
	];

	define(modules, function($, html) {
	
	
		var Modal = require('components/modal');
		var Notify = require('components/notify');
		
	    function doModal(options) {
	
    	    var _elements = {};
    	    var _popupMenu = null;
    	    var _timer = null;
    	    var _modal = null;
    	    var _rental = {};
    	    var _customer = {};
    	    var _reservation = {};
    	    
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
    
                        var popupMenu = null;
                                                    
                        $.each(customers, function(index, customer) {
                            console.log(customer.name);
                            
                            if (popupMenu == null)
                                popupMenu = new PopupMenu({});
    
                            if (index >= 10) {
                                popupMenu.add({
                    	        	type: 'separator'
                                });
                                popupMenu.add({
                    	        	type: 'menuitem',
                    	        	text: sprintf('Visar %d av totalt %d', index, customers.length)
                                    
                                });
                                return false;
                                
                            }
                               
                                
                            popupMenu.add({
                	        	type: 'menuitem',
                	        	text: customer.name,
                	        	context: customer,
                	        	click: function(context) {
                    	        	updateContactFromCustomer(context);
                    	        	_customer = context;
                	        	}
                                
                            });
                            
                        });
                        
                        if (popupMenu) {
                            popupMenu.show(_elements.contact);
                            _popupMenu = popupMenu;
                        }
    	        	});                        
                    
                }
			}
			
			function enableTypeahead() {
			
    			var lastQuery = '';
    			
    			_elements.contact.on('keypress', function(event) {
                    
                    if (event.keyCode == 13) {
                        //event.preventDefault();
                        event.stopPropagation();
                        
                    }
                    
    			});
    			
    			_elements.contact.on('keyup', function(event) {

        			console.log(sprintf("key: %d", event.keyCode));
                    event.preventDefault();
                    event.stopPropagation();
                                        
                    if (_timer != null) {
                        clearTimeout(_timer);
                        _timer = null;
                    }    
                    
                    _timer = setTimeout(search, 500);
                    
                    if (_popupMenu)
                        _popupMenu.hide();
                        
                    _popupMenu = null;


    			});
			}
			
			function enableBootstrapTypeahead() {
	
	    		var labels, map;
	    		var lastQuery = null;
	    		
	            _elements.html.find('#contact').typeahead({
	                source: function (query, process) {
	
    	                console.log('searching for ' + query);
	                    // Clear any selection made                    
	                    _customer = {};
	
	                    labels = [];
	                    map = {};
	                    lastQuery = query;
	                            
	                    Model.Customers.search(query, function(customers) {
	                    
	                        if (query == lastQuery && isArray(customers)) {
	                            each(customers, function(customer) {
	                                labels.push(customer.name);
	                                map[customer.name] = customer;
	                            });
	                            
	                            process(labels);
	                            
	                        }
	                    });
	                },
	                
	                updater: function (item) {
	                    _customer = map[item]; 
	                    return item;
	                },
	                
	                matcher: function (item) {
	                   return true;
	                    if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
	                        return true;
	                    }                
	                },
	                
	                sorter: function (items) {
	                    return items.sort();
	                },
	                
	                
	                highlighter: function (item) {
	                   return item;
	                }
	                
	            });    		
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
			
			
	        function enableButtonClicks() {
	
	            _elements.okButton.on("click", function(){
	            	
	            	if (_elements.contact.val().trim().length == 0) {
	            	
	            	    Notify.show('Ange namn sa jag!');                	
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
                        	_modal.close();
                    	});
                    	
                	});
                    	
	                
	            });
	
	
	            _elements.removeButton.on("click", function(){
    
    	            Model.Reservations.remove(_reservation).done(function(){
        	            _modal.close();
    	            });
	            });
	
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
    	        
	        }

	        
			function init() {
			
				_reservation = options.reservation;
	
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
				
				$.when.apply(this, requests).then(function() {

    				_elements.html = $(html); 
		            _elements.okButton = _elements.html.find(".ok-button");
		            _elements.removeButton = _elements.html.find(".remove-button");
		            _elements.contact = _elements.html.find(".contact");
		            _elements.when = _elements.html.find(".when");
		            _elements.price = _elements.html.find(".price");
		            _elements.arrived = _elements.html.find(".arrived");
		            _elements.delivered = _elements.html.find(".delivered");
		            _elements.payed = _elements.html.find(".payed");
		            _elements.transferred = _elements.html.find(".transferred");

		            // Make IE hide the focus
		            _elements.html.find('.hidefocus').attr('hideFocus', 'true').css('outline', 'none');
		
		            _elements.contact.on('change', function(event) {
		                var text = _elements.contact.val();
		                
		                Model.Customers.search(text, function(customers) {
	    	                console.log(customers);
		                });
	    	            
		            });	
	
		            _elements.okButton.text(_reservation.id ? 'Spara' : 'Boka');
		            
		            if (!_reservation.id)
		                _elements.removeButton.addClass('hide');
		                
		                
		            _modal = new Modal({
		                title: _reservation.id ? 'Bokning' : 'Ny bokning',
		                content:_elements.html
		            });            

		            _elements.contact.focus();
		            _modal.show();
		
		            if (_customer)
			            updateContactFromCustomer(_customer);
		            
		            enableButtonClicks();
		            enableEnterKey();
		            enableTypeahead();	
		            updateDOM();	
			
				});

			}				        

			
			init();
	        
	
	
		}
		
		return doModal;
		
	
	});

	
})()


