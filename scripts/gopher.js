
/*
@codekit-prepend "./sprintf.js";
@codekit-prepend "./tools.js";
@codekit-prepend "../lib/jquery.cookie.js";

*/


define(['./sprintf', '../lib/jquery.cookie.js'], function() {

    var _baseURL = 'http://bookio.herokuapp.com';
    
    //_baseURL = 'http://localhost:3000';

    console.log('Loading gopher.js...');
    
    
    function Module() {

        function init() {
        };

        function isValid() {
            return sid() != '';
        }
        
        function sid(value) {
            if (value == undefined) {
                var sid = $.cookie('sid');
                return isString(sid) ? sid : '';
            }

            $.cookie('sid', value, {expires: 1});
        }

        function username(value) {

            if (value == undefined) {
                var username = $.cookie('username');
                return isString(username) ? username : '';
                
            }

            $.cookie('username', value);
        }


        function login(email, password, callback) {
        		
        	var beforeSend = function(xhr) {
        		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(email + ':' + password));
        		xhr.setRequestHeader("Content-Type", "application/json");
        		xhr.setRequestHeader("Accept", "application/json");
        	}
        	
        	var success = function(data, textStatus, xhr) {

        		sid(data.sid);
        		username(email);
        		
        		console.log('SessionID: ' + data.sid);

            	var response = {};
            	response.data = data == undefined ? null : data;
            	response.status = xhr.status;
            	response.error = null;
            	
        		callback(response);
        		
        	}
        	
        	var error = function(xhr, textStatus, errorThrown) {
            	
            	try {
                	var json = JSON.parse(xhr.responseText)
        
                	var response = {};
                	response.data = null;
                	response.status = xhr.status;
                	response.error = xhr.statusText;

                	if (json.error)
                	   response.error = json.error;
                	   
                    callback(response);
            	}
            	catch (error) {
                	alert(error);
            	}
        		
        	}
        	
        	return $.ajax ({type:'GET', url: _baseURL + '/login', data:null, dataType: 'json', beforeSend:beforeSend, success:success, error:error});
        }

        function request(method, url, data) {
        		
        	var beforeSend = function(xhr) {
        		xhr.setRequestHeader("Authorization", sid());
        		xhr.setRequestHeader("Content-Type", "application/json");
        		xhr.setRequestHeader("Accept", "application/json");
        	}
        	
        	var request = $.ajax({
            	type: method,
            	url: _baseURL + '/' + url,
            	data: data ? JSON.stringify(data) : null,
            	dataType: 'json',
            	beforeSend: beforeSend
        	});

            request.fail(function(xhr) {
                console.log(sprintf('Request failed. %s - %d', xhr.statusText, xhr.status));
            });
            
            return request;
        
        	//return $.ajax ({type:method, url: _baseURL + '/' + url, data:data == null ? null : JSON.stringify(data), dataType: 'json', beforeSend:beforeSend, success:success, error:error});
        }

        
        init();
        
        this.request = request;
        this.login = login;
        this.sid = sid;
        this.username = username;
        this.isValid = isValid;
        
        //sid('jc22cczytxhq4h1ko4a2j7nm6d17zxan');
        
    };

    
    Gopher = Module;
    
    return Module;
});


