(function() {

	var dependencies = [
		'i18n!./rules.json',
		'../../widgets/picker/picker',
		'../../widgets/picker/switch'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _info = {};

			function fill() {
				_elements.demandPhone.val(_info.demandPhone ? '1' : '0').picker("refresh");
				_elements.demandEmail.val(_info.demandEmail ? '1' : '0').picker("refresh");
				_elements.demandAddress.val(_info.demandAddress ? '1' : '0').picker("refresh");

			}

			function chill() {
				_info.demandPhone = parseInt(_elements.demandPhone.val());
				_info.demandEmail = parseInt(_elements.demandEmail.val());
				_info.demandAddress = parseInt(_elements.demandAddress.val());
			}


			this.init = function() {

				_element.enhanceWithin();
				
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);

				//_elements.demo.picker();

				_elements.back.on('tap', function(event) {

					$.spin(true);

					chill();

					var request = Gopher.request('PUT', 'settings/app/contact', _info);

					request.done(function() {
						$.mobile.pages.pop();
					});

					request.always(function() {
						$.spin(false);
					});

				});
			}
			
			this.refresh = function(callback) {
				$.spin(true);

				var request = Gopher.request('GET', 'settings/app/contact');

				request.done(function(info) {
					_info = info == null ? {} : info;

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
