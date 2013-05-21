

define(['jquery', 'scripts/tools', 'scripts/gopher', 'scripts/notifications'], function($) {

    console.log('Loading model.js...');
    
    Model = {};
    
    var gopher = new Gopher();
    

    ////////////////////////////////////////////////////////////////////////////

    Model.Icons = {};	
    
    (function() {
        
        Model.Icons.fetch = function() {
        
            var request = gopher.request('GET', 'icons/folder/symbols');
            
            return request;
        }


    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        
        Model.Rentals = {};	
        
        Model.Rentals.fetch = function(id) {
        
        	var url = isNumeric(id) ? sprintf('rentals/%d', id) : 'rentals';
            var request = gopher.request('GET', url);
            
            return request;
        }


        Model.Rentals.add = function(rental) {

			var request = gopher.request('POST', 'rentals', rental);
			
			request.done(function(rental) {
                Notifications.trigger('rental-added', rental);
    		});
    		
    		return request;
        };
        
        Model.Rentals.update = function(rental) {

			var request = gopher.request('PUT', sprintf('rentals/%d', rental.id), rental);
			
			request.done(function(rental) {
                Notifications.trigger('rental-updated', rental);
    		});
    		
    		return request;
        };

        Model.Rentals.remove = function(rental) {

			var request = gopher.request('DELETE', sprintf('rentals/%d', rental.id), rental);
			
			request.done(function() {
				Notifications.trigger('rental-removed', rental);
    		});

    		return request;
        };


    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        var gopher = new Gopher();
        var cache = {}
        
        Model.Customers = {};	

        Model.Customers.fetch = function(id) {
        
        	var url = isNumeric(id) ? sprintf('customers/%d', id) : 'customers';
        	
            return gopher.request('GET', url);
                
        }

        Model.Customers.search = function(text) {
        
			var request = gopher.request('GET', sprintf('customers/search/%s', text));

			return request;
        }
        
        Model.Customers.add = function(customer) {

			var request = gopher.request('POST', 'customers', customer);
			
			request.done(function(customer) {
				//cache[customer.id] = customer;				
				Notifications.trigger('customer-added', customer);
			});
			
			return request;
        };

        Model.Customers.update = function(customer) {

			var request = gopher.request('PUT', sprintf('customers/%d', customer.id), customer);
			
			request.done(function(customer) {
				//cache[customer.id] = customer;				
				Notifications.trigger('customer-updated', customer);				
			});

			return request;
        };

        Model.Customers.save = function(customer) {
            return customer.id ? Model.Customers.update(customer) : Model.Customers.add(customer);
        }


    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        var gopher = new Gopher();
        
        Model.Reservations = {};	
        
        Model.Reservations.fetch = function(id) {
        
        	var url = isNumeric(id) ? sprintf('reservations/%d', id) : 'reservations';
        	
            return gopher.request('GET', url);
        }
        
        Model.Reservations.add = function(reservation) {

			var request = gopher.request('POST', 'reservations', reservation);
			
			request.done(function(reservation) {
				Notifications.trigger('reservation-added', reservation);				
			});
			
			return request;
        };

        Model.Reservations.update = function(reservation) {

			var request = gopher.request('PUT', sprintf('reservations/%d', reservation.id), reservation);
			
			request.done(function(reservation) {
				Notifications.trigger('reservation-updated', reservation);				
			});
			
			return request;
        };
        
        Model.Reservations.save = function(reservation) {
            return reservation.id ? Model.Reservations.update(reservation) : Model.Reservations.add(reservation);
        }
            

        Model.Reservations.remove = function(reservation) {
			
			var request = gopher.request('DELETE', sprintf('reservations/%d', reservation.id), null);
			
			request.done(function() {
				Notifications.trigger('reservation-removed', reservation);
			}); 
			
			return request;
        }
        


    })();    

    ////////////////////////////////////////////////////////////////////////////


    (function() {
        
        Model.Settings = {};	
        
        Model.Settings.fetch = function(section, name) {
        	var request = gopher.request('GET', sprintf('settings/%s/%s', section, name));
        	return request;
        }
        
        Model.Settings.save = function(section, name, value) {
        	var request = gopher.request('PUT', sprintf('settings/%s/%s', section, name), value);
			return request;
        };

    })();    


});


