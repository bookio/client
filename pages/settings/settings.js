(function() {

	var dependencies = [
		'i18n!./settings.json',
		'../../widgets/pagelogo/pagelogo'
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
					// See google charts: https://developers.google.com/chart/infographics/docs/qr_codes
					_elements.urlQR.attr('src', 'http://chart.apis.google.com/chart?chs=120x120&cht=qr&chl=' + url + '&choe=UTF-8&chld=L|1');
				}
				
				if (_guestUrl == null) {
					var request = Gopher.request('GET', 'users/guest');
	
					request.done(function(user) {
	
						_guestUrl = sprintf("%s?user=%s", window.location.href, user.username);
	
					});
					
					request.always(function() {
						updateUrl(_guestUrl);
						callback();
					});
				}
				else {
					updateUrl(_guestUrl);
					callback();
				}
			}

		}

		return Module;


	});


})();
