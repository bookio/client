(function() {

	var dependencies = [
		'i18n!./login.json',
		'css!./login',
		'../../widgets/pagelogo/pagelogo.js'
	];

	
	define(dependencies, function(i18n) {
		

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			

			function main() {
				$.mobile.pages.go('../main/main.html');
			}
			
			function login(email, password) {
			
				var email = _elements.login.email.val();
				var password = _elements.login.password.val();

				if (email != '') {
					
					_elements.login.button.transition({
						opacity: 0.5
					}, 200);

					$.spin(true);
					
					var request = Gopher.login(email, password);

					request.fail(function() {
						_elements.login.button.keyframes("shake 0.5s", function() {
						});
					});

					request.always(function() {
						$.spin(false);
						
						_elements.login.button.transition({
							opacity: 1.0
						}, 100);
					});

					request.done(function(data) {
						$.cookie('username', data.user.username);
						main();
					});

				}
			}



			function enableDisable() {
				_elements.login.button.toggleClass('ui-disabled', _elements.login.email.val() == '');
			}


			this.init = function() {

				var username = $.isString($.cookie('username')) ? $.cookie('username') : '';

				// Logout
				Gopher.logout();
				
				// Make sure to clear cache
				Model.initialize();
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				
				_elements.login.email.val(username);

				_elements.login.button.on('tap', function() {
					login();
				});				
						
				$(document).on('keyup', function(event) {
					if (event.keyCode == 13) {
						login();
					}
				});

				_elements.login.email.on('input', function() {
					enableDisable();
				});

				
				_elements.login.password.attr('placeholder', i18n.text('password', 'Password'));
				_elements.login.email.attr('placeholder', i18n.text('email', 'E-mail'));
				
				/*_element.selectable({
					//selectables: '*'
				});
				*/
				enableDisable();
			}
			
		}

		return Module;



	});


})();
