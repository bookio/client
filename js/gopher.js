

(function() {
	
	Gopher = {};

	//$.cookie('sid', 'jc22cczytxhq4h1ko4a2j7nm6d17zxan');

	Gopher.baseURL = 'http://bookio.herokuapp.com';
	//Gopher.baseURL = 'http://localhost:3000';

	Gopher.user = null;
	Gopher.client = null;
	Gopher.sessionID = isString($.cookie('sid')) ? $.cookie('sid') : '';

	var loginComplete = function(data) {
		Gopher.client = data.client;
		Gopher.user = data.user;
		Gopher.sessionID = data.sid;

		if (!Gopher.user.guest) {
			$.cookie('sid', Gopher.sessionID);
		}

		console.log('Session ID:%s', data.sid);
	}


	var requestFailed = function(xhr) {

		var message = '#ERROR#';

		try {
			var json = JSON.parse(xhr.responseText);
			message = json && json.error ? json.error : xhr.responseText;
		}

		catch (error) {
			message = error.message;
		}

		console.log(sprintf('Request failed. %s', message));
					
	}

	Gopher.signup = function(username, password) {

		var beforeSend = function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(username + ':' + (password ? password : '')));
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Accept", "application/json");
		}

		var request = $.ajax({
			type: 'GET',
			url: Gopher.baseURL + '/signup',
			data: null,
			dataType: 'json',
			beforeSend: beforeSend
		});

		request.done(loginComplete);
		request.fail(requestFailed);

		return request;
	}


	Gopher.logout = function() {
		Gopher.sessionID = '';
		Gopher.user = null;
		Gopher.client = null;

		$.cookie('sid', '');
	}

	Gopher.login = function(username, password) {

		var beforeSend = function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(username + ':' + (password ? password : '')));
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

		request.done(loginComplete);
		request.fail(requestFailed);

		return request;
	}


	Gopher.verify = function() {
		var request = Gopher.request('GET', 'verify');
		request.done(loginComplete);
		request.fail(requestFailed);

		return request;
	}


	Gopher.request = function(method, url, data) {

		var beforeSend = function(xhr) {
			xhr.setRequestHeader("Authorization", Gopher.sessionID);
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

		request.fail(requestFailed);

		return request;
	}


	console.log('gopher.js loaded...');

})();


