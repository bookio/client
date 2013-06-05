
define(['./sprintf', './base64', './tools'], function() {

    
    Gopher = {};

    
    Gopher.baseURL = 'http://bookio.herokuapp.com';
    //Gopher.baseURL = 'http://localhost:3000';
    Gopher.authorization = isString($.cookie('sid')) ? $.cookie('sid') : '';

    Gopher.login = function(email, password) {
    		
    	var beforeSend = function(xhr) {
    		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(email + ':' + password));
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
        	$.cookie('sid', data.sid);
        	console.log('Session ID:%s', data.sid);
        });

        request.fail(function(xhr) {
            console.log(sprintf('Request failed. %s - %d', xhr.statusText, xhr.status));
        });
        
        return request;
    }
    
    Gopher.request = function(method, url, data) {
    		
    	var beforeSend = function(xhr) {
    		xhr.setRequestHeader("Authorization", Gopher.authorization);
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
            console.log(sprintf('Request failed. %s - %d', xhr.statusText, xhr.status));
        });
        
        return request;
    }

	console.log('gopher.js loaded...');

});
