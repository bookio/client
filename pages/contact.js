(function() {

	var dependencies = [
		'css!./contact'
	];

	define(dependencies, function(html) {


		function Module(page) {

			var _page = page;
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
					_elements.dropzone.image.attr('src', Cloudinary.imageURL(_client.logo, {
						crop: 'fit',
						width: 100,
						height: 100
					}));

			}

			function chill() {
				_client.name = _elements.name.val();
				_client.phone = _elements.phone.val();
				_client.email = _elements.email.val();
				_client.twitter = _elements.twitter.val();
				_client.facebook = _elements.facebook.val();
				_client.address = _elements.address.val();
				_client.www = _elements.www.val();
			}

			function displayImage(file) {

				_elements.dropzone.container.spin('large');

				var request = Cloudinary.uploadImage(file);

				request.done(function(filename) {
					_client.logo = filename;
					_elements.dropzone.image.attr('src', Cloudinary.imageURL(filename, {
						crop: 'fit',
						width: 100,
						height: 100
					}));
				});

				request.always(function() {
					_elements.dropzone.container.spin(false);
				});

			}



			function init() {
				_page.hookup(_elements, 'data-id');

				_elements.dropzone.container.on('tap', function(event) {
					_elements.file.click();
				});

				_page.on('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();
					event.originalEvent.dataTransfer.dropEffect = 'none';
				});

				_page.on('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();
				});

				_elements.dropzone.image.onload = function() {
					_elements.dropzone.image.removeClass('hidden');
				}

				_elements.dropzone.container.on('dragover', function(event) {

					event.stopPropagation();
					event.preventDefault();

					var files = event.originalEvent.dataTransfer.files;

					if (files.length > 0) {
						switch (files[0].type) {
							case 'image/jpeg':
							case 'image/png':
							case 'image/gif':
								event.originalEvent.dataTransfer.dropEffect = 'copy';
								break;
							default:
								event.originalEvent.dataTransfer.dropEffect = 'none';
						}
					}

				});

				_elements.dropzone.container.on('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();
					displayImage(event.originalEvent.dataTransfer.files[0]);
				});

				_elements.file.on('change', function(event) {
					event.stopPropagation();
					event.preventDefault();
					displayImage(event.target.files[0]);
				});;



				var request = Model.Client.fetch();

				request.done(function(client) {
					_client = client ? client : {};

					fill();

					_elements.back.on('tap', function(event) {
						$.mobile.popPage();
					});

					_elements.save.on('tap', function(event) {
						chill();

						var request = Model.Client.save(_client);

						request.done(function() {
							debugger;
							$.mobile.popPage();
						});
					});
				});
			}

			init();
		}

		$(document).delegate("#contact-page", "pageinit", function(event) {
			new Module($(event.currentTarget));
		});


	});


})();
