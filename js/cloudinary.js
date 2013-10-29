(function() {
	var _apiKey = '463759738497327';
	var _apiSecret = 'NBCDcNawnYec5VE6_EgFBF1918c';
	var _apiURL = 'https://api.cloudinary.com/v1_1/dcamzov3h';

	Cloudinary = {};

	Cloudinary.request = function(method, url, data) {

		var beforeSend = function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(_apiKey + ':' + _apiSecret));
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Accept", "application/json");
		}

		var request = $.ajax({
			type: method,
			url: _apiURL + '/' + url,
			data: data ? JSON.stringify(data) : null,
			dataType: 'json',
			beforeSend: beforeSend
		});

		request.fail(function(xhr) {

			var json;

			try {
				json = JSON.parse(xhr.responseText);
			}
			catch (error) {
				console.log(error.message);
			}

			if (json)
				console.log(json);
			else
				console.log(xhr.responseText);

		});

		return request;
	}


	Cloudinary.imageURL = function(filename, options) {

		var url = sprintf('http://res.cloudinary.com/dcamzov3h/image/upload');

		if (options) {
			var params = [];

			if (options.width)
				params.push(sprintf('w_%d', options.width));

			if (options.height)
				params.push(sprintf('h_%d', options.height));

			if (options.crop)
				params.push(sprintf('c_%s', options.crop));

			if (options.gravity)
				params.push(sprintf('g_%s', options.gravity));

			if (params.length > 0)
				url += '/' + params.join(',');
		}

		url += '/' + filename;

		return url;
	}

	Cloudinary.deleteImage = function(filename) {

		var name = filename.split('.')[0];
		var request = Cloudinary.request('DELETE', 'resources/image/upload', {
			'public_ids': name
		});

		var deferred = $.Deferred();

		request.done(function(json) {
			if (json.deleted && json.deleted[name] == 'deleted')
				deferred.resolve();
			else
				deferred.reject();
		});

		request.fail(function() {
			deferred.reject();
		});

		return deferred;
	}

	Cloudinary.uploadImage = function(file) {
		var timestamp = Math.round(new Date().getTime() / 1000);
		var params = sprintf("timestamp=%s%s", timestamp, _apiSecret);
		var signature = sha1(params);

		var form = new FormData();
		form.append("api_key", _apiKey);
		form.append("timestamp", timestamp);
		form.append("signature", signature);
		form.append("file", file);

		var deferred = $.Deferred();
		var request = new XMLHttpRequest();

		request.open("POST", sprintf('%s/image/upload', _apiURL));
		request.onload = function(event) {
			if (request.status == 200) {
				var json = JSON.parse(request.responseText);
				var filename = json.url.replace(/^.*[\\\/]/, '');
				deferred.resolve(filename);
			}
			else {
				deferred.reject();
			}
		};

		request.send(form);

		return deferred;
	}


})();
