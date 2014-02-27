
(function() {
	


    Model = {};
    
    var gopher = Gopher;

    ////////////////////////////////////////////////////////////////////////////
    
	
	function requests(name) {

		var model = {};

		model.trigger = function(event, param) {
			$(model).trigger(event, param);
		}
		
		model.on = function(event, callback) {
		    $(model).on(event, function(event, param) {
		        callback(param);
		    });
		}
		
		model.off = function(event) {
			$(model).off(event);
		}
		
		model.fetch = function(id) {
        	var url = isNumeric(id) ? sprintf('%s/%d', name, id) : name;
            var request = gopher.request('GET', url);
            
            return request;
		}
		
        model.add = function(item) {

			var request = gopher.request('POST', name, item);
			
			request.done(function(item) {
                model.trigger('added', item);
    		});
    		
    		return request;
        };

        model.update = function(item) {

			var request = gopher.request('PUT', sprintf('%s/%d', name, item.id), item);
			
			request.done(function(item) {
                model.trigger('updated', item);
    		});
    		
    		return request;
        };

        model.remove = function(item) {

			var request = gopher.request('DELETE', sprintf('%s/%d', name, item.id), item);
			
			request.done(function() {
				model.trigger('removed', item);
    		});

    		return request;
        };

        model.save = function(item) {
            return item.id ? model.update(item) : model.add(item);
        }
		
		
		return model;
		
	}



    ////////////////////////////////////////////////////////////////////////////

    
    (function() {
        
	    Model.Icons = {};	
	    
        Model.Icons.fetch = function() {
        
            var request = gopher.request('GET', 'icons');
            
            return request;
        }


    })();    

    ////////////////////////////////////////////////////////////////////////////



    (function() {
        
        Model.Rentals = {};
        $.extend(Model.Rentals, requests('rentals'));	


    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        Model.Customers = {};	

		$.extend(Model.Customers, requests('customers'));
		

        Model.Customers.search = function(text) {
        
			var request = gopher.request('GET', sprintf('customers/search/%s', text));

			return request;
        }
        

    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        
        Model.Reservations = {};	

		$.extend(Model.Reservations, requests('reservations'));
        

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


    ////////////////////////////////////////////////////////////////////////////

    (function() {
        
        Model.Categories = {};	

		$.extend(Model.Categories, requests('categories'));
        


    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        
        Model.Users = {};	

		$.extend(Model.Users, requests('users'));
        
        
    })();    

    ////////////////////////////////////////////////////////////////////////////

    (function() {
        
        Model.Client = {};	
        
        Model.Client.fetch = function() {
        
            var request = gopher.request('GET', sprintf('clients/%d', gopher.client.id));

			request.done(function(client) {
    			gopher.client = client;
			});
			
			return request;
        }
        
        Model.Client.save = function(client) {

			var request = gopher.request('PUT', sprintf('clients/%d', gopher.client.id), client);
			
			request.done(function(client) {
    			gopher.client = client;
			});
			
			return request;
        };
        


    })();    

	console.log('model.js loaded...');


})();


