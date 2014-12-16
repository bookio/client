(function() {

	var dependencies = [
		'i18n!./contact.json',
		'../../widgets/imagepicker/imagepicker',
		'css!./contact'
	];

	define(dependencies, function(i18n) {



		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _client = {};

			function fill() {

				if (_client.name)
					_elements.name.val(_client.name);

				if (_client.phone)
					_elements.phone.val(_client.phone);

				if (_client.email)
					_elements.email.val(_client.email);

				if (_client.twitter)
					_elements.twitter.val(_client.twitter);

				if (_client.facebook)
					_elements.facebook.val(_client.facebook);

				if (_client.address)
					_elements.address.val(_client.address);

				if (_client.www)
					_elements.www.val(_client.www);

				if (_client.logo)
					_elements.dropzone.imagepicker('setImage', _client.logo);

			}

			function chill() {
				_client.name = _elements.name.val();
				_client.phone = _elements.phone.val();
				_client.email = _elements.email.val();
				_client.twitter = _elements.twitter.val();
				_client.facebook = _elements.facebook.val();
				_client.address = _elements.address.val();
				_client.www = _elements.www.val();

				_client.logo = _elements.dropzone.imagepicker('getImage');
			}

			this.init = function() {
				
				_element.i18n(i18n);
				_element.hookup(_elements, 'data-id');

				_element.enhanceWithin();

				_element.on('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();
					event.originalEvent.dataTransfer.dropEffect = 'none';
				});

				_element.on('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();
				});
				
				_elements.dropzone.on('imagechanged', function(event, image) {
				});

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});


				_elements.save.on('tap', function(event) {
					chill();

					var request = Model.Client.save(_client);

					request.done(function() {
						$.mobile.pages.pop();
					});
				});
			}
			
			
			this.refresh = function(callback) {
				$.spin(true);

				var request = Model.Client.fetch();

				request.done(function(client) {
					_client = client ? client : {};

					fill();
				});
				
				request.always(function() {
					$.spin(false);
					callback();
				});
			}
		}
		
		return Module;


	});


})();
