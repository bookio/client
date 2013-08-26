
define(['./sprintf', './base64', './tools', 'components/notify'], function() {

    
    Gopher = {};

    //$.cookie('sid', 'jc22cczytxhq4h1ko4a2j7nm6d17zxan');
    
    Gopher.baseURL = 'http://bookio.herokuapp.com';
    //Gopher.baseURL = 'http://localhost:3000';


    Gopher.sessionID = function(value) {
    
        if (isString(value))
            $.cookie('sid', value);
        
        return isString($.cookie('sid')) ? $.cookie('sid') : '';
        
    }

    Gopher.username = function(value) {
    
        if (isString(value))
            $.cookie('username', value);
        
        return isString($.cookie('username')) ? $.cookie('username') : '';
    }

    Gopher.signin = function(user, password) {
    		
    	var beforeSend = function(xhr) {
    		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ':' + password));
    		xhr.setRequestHeader("Content-Type", "application/json");
    		xhr.setRequestHeader("Accept", "application/json");
    	}
    	
    	var request = $.ajax({
        	type: 'GET',
        	url: Gopher.baseURL + '/signin',
        	data: null,
        	dataType: 'json',
        	beforeSend: beforeSend
    	});

        request.done(function(data) {
        	Gopher.sessionID(data.sid);
        	Gopher.username(user);
        	
        	console.log('Session ID:%s', data.sid);
        });

        request.fail(function(xhr) {
            console.log(sprintf('Request failed. %s - %d', xhr.statusText, xhr.status));
        });
        
        return request;
    }

    Gopher.login = function(user, password) {
    		
    	var beforeSend = function(xhr) {
    		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ':' + password));
    		xhr.setRequestHeader("Content-Type", "application/json");
    		xhr.setRequestHeader("Accept", "application/json");
    	}
    	
    	var request = $.ajax({
        	type: 'GET',
        	url: Gopher.baseURL + '/login',
        	data: null,
        	dataType: 'json',
        	beforeSend: beforeSend
    	});

        request.done(function(data) {
        	Gopher.sessionID(data.sid);
        	Gopher.username(user);
        	
        	console.log('Session ID:%s', data.sid);
        });

        request.fail(function(xhr) {
            console.log(sprintf('Request failed. %s - %d', xhr.statusText, xhr.status));
        });
        
        return request;
    }
    
    Gopher.request = function(method, url, data) {
    		
    	var beforeSend = function(xhr) {
    		xhr.setRequestHeader("Authorization", Gopher.sessionID());
    		xhr.setRequestHeader("Content-Type", "application/json");
    		xhr.setRequestHeader("Accept", "application/json");
    	}
    	
    	var request = $.ajax({
        	type: method,
        	url: Gopher.baseURL + '/' + url,
        	data: data ? JSON.stringify(data) : null,
        	dataType: 'json',
        	beforeSend: beforeSend
    	});

        request.fail(function(xhr) {

            try {
                var json = JSON.parse(xhr.responseText);
                
                if (json.error) {
                    Notify.show(json.error);
                }
                else
                    Notify.show(xhr.responseText);
                
            }
            catch (error) {
                console.log("*************** %s **************", error.message);
            }
            
            console.log(sprintf('Request failed. %s - %d', xhr.statusText, xhr.status));
            console.log(data);
        });
        
        return request;
    }

	console.log('gopher.js loaded...');

});

