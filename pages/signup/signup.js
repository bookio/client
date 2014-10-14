(function() {

	var dependencies = [
		'i18n!./signup.json',
		'css!./signup'
	];

	
	define(dependencies, function(i18n) {
		

		function Module(page) {

			var _element = page.element;
			var _elements = {};


			function main() {
				$.mobile.pages.go("../main/main.html", {
					params: {
						editmode: true
					}
				});
			}
			

    
			function isEmail(text) {
				var regexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
				return text.match(regexp) != null;
			}
			
			function isNumeric(text) {
				var regexp = /^[0-9]{1,3}$/g;
				return text.match(regexp) != null;
			}

			function signup() {

				var email = _elements.signup.email.val();
				var what  = _elements.signup.what.val();
				var count = parseInt(_elements.signup.count.val());
				
				if (email != '') {
					_elements.signup.button.transition({
						opacity: 0.5
					}, 200);

					$.spin(true);

					var request = Gopher.signup(email, '');

					request.fail(function() {
						_elements.signup.button.keyframes("shake 0.5s");
					});

					request.always(function() {
						$.spin(false);
						
						_elements.signup.button.transition({
							opacity: 1.0
						}, 100);
					});

					request.done(function(data) {
					
						if ($.isNumeric(count) && $.isString(what)) {
							request = Gopher.request('POST', sprintf('rentals/generate/%s/%d', what, count));

							request.always(function() {
								main();
							});							
						}
						else
							main();
					});
				}
			}

			function enableDisable() {
				var valid = true;

				valid = valid && _elements.signup.what.val() != '';
				valid = valid && isEmail(_elements.signup.email.val());
				valid = valid && isNumeric(_elements.signup.count.val());

				_elements.signup.button.toggleClass('ui-disabled', !valid);
			}



			this.init = function() {

				// Logout
				Gopher.logout();
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				
				_elements.login.on('tap', function() {
					$.mobile.pages.go('../login/login.html');
				});

				_elements.signup.button.on('tap', function() {
					signup();
				});

				_elements.signup.email.on('input', function() {
					enableDisable();
				});
				_elements.signup.what.on('input', function() {
					enableDisable();
				});
				_elements.signup.count.on('input', function() {
					enableDisable();
				});
				
				_elements.signup.what.attr('placeholder', i18n.text('what-placeholder', 'Segway, Squash, Party Tent, Wine Tasting, Massage'));
				_elements.signup.email.attr('placeholder', i18n.text('email-placeholder', 'jane@rentapartytent.com'));

				enableDisable();
			}
			
		}

		return Module;



	});


})();
