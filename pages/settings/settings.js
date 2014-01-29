(function() {

	var dependencies = [
		'i18n!./settings.json',
		'../../widgets/pagelogo/pagelogo',
		'./qrcode.js'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _guestUrl = null;

			this.init = function() {

				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);

				_elements.back.on('tap', function(event) {
					event.preventDefault();
					$.mobile.pages.pop();
				});

				_elements.contact.on('tap', function() {
					$.mobile.pages.push('../contact/contact.html');
				});

				_elements.users.on('tap', function() {
					$.mobile.pages.push('../users/users.html');
				});

				_elements.categories.on('tap', function() {
					$.mobile.pages.push('../categories/categories.html');
				});

				_elements.rules.on('tap', function() {
					$.mobile.pages.push('../rules/rules.html');
				});
			}

			this.refresh = function(callback) {
			
				function updateUrl(url) {
					_elements.url.val(url);
					_elements.urlTrial.attr('href', url);

					var qrcode = new QRCode(_elements.qrcanvas[0], {
						text: url,
						width: 120,
						height: 120,
						colorDark : "#000000",
						colorLight : "#ffffff",
						correctLevel : QRCode.CorrectLevel.H
					});

				}
				
				if (_guestUrl == null) {
					var request = Gopher.request('GET', 'users/guest');
	
					request.done(function(user) {
						var url = $.mobile.path.parseUrl(window.location.href);
						
						_guestUrl = sprintf("%s?user=%s", url.hrefNoSearch, user.username);
						updateUrl(_guestUrl);
					});
					
					request.always(function() {
						callback();
					});
				}
				else {
					callback();
				}
			}

		}

		return Module;


	});


})();
