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

			this.init = function() {

				_element.i18n(i18n);
				_element.hookup(_elements, 'data-id');

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
					

				}
				
				if (_elements.urlTrial.attr('href').length <= 1) {
					var request = Gopher.request('GET', 'users/guest');
	
					request.done(function(user) {
						var urlparts = $.mobile.path.parseUrl(window.location.href);						
						var url = sprintf("%s?user=%s", urlparts.hrefNoSearch, user.username);

						_elements.url.val(url);
						_elements.urlTrial.attr('href', url);
	
						console.log(_elements.urlTrial.attr('href'));
						var qrcode = new QRCode(_elements.qrcanvas[0], {
							text: url,
							width: 120,
							height: 120,
							colorDark : "#000000",
							colorLight : "#ffffff",
							correctLevel : QRCode.CorrectLevel.H
						});
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
