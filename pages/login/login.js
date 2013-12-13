(function() {

	var dependencies = [
		'i18n!./login.json',
		'css!./login'
	];

	define(dependencies, function(i18n) {
		
		console.log('Loading login.js...');

		function Module(page) {

			var _page = page;
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

					var request = Gopher.login(email, password);

					request.fail(function() {
						_elements.login.button.transition({
							x: -5
						}, 75).transition({
							x: 10
						}, 75).transition({
							x: 0
						}, 75);
					});

					request.always(function() {
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

			function signup() {

				var email = _elements.signup.email.val();

				if (email != '') {
					_elements.signup.button.transition({
						opacity: 0.5
					}, 200);

					var request = Gopher.signup(email, '');

					request.fail(function() {
						_elements.signup.button.transition({
							x: -5
						}, 75).transition({
							x: 10
						}, 75).transition({
							x: 0
						}, 75);

					});

					request.always(function() {
						_elements.signup.button.transition({
							opacity: 1.0
						}, 100);
					});

					request.done(function(data) {
						main();
					});
				}
			}

			function enableDisable() {
				_elements.signup.button.toggleClass('ui-disabled', _elements.signup.email.val() == '');
				_elements.login.button.toggleClass('ui-disabled', _elements.login.email.val() == '');
			}


			function init() {

				var username = isString($.cookie('username')) ? $.cookie('username') : '';

				// Logout
				Gopher.logout();
			
			
				_page.hookup(_elements, 'data-id');
				_page.i18n(i18n);
				
				_elements.login.email.val(username);

				_elements.login.button.on('tap', function() {
					login();
				});

				_elements.signup.button.on('tap', function() {
					signup();
				});

				_elements.login.email.on('input', function() {
					enableDisable();
				});

				_elements.signup.email.on('input', function() {
					enableDisable();
				});
				
				_elements.login.password.attr('placeholder', i18n.text('password'));
				_elements.login.email.attr('placeholder', i18n.text('email'));
				_elements.signup.email.attr('placeholder', i18n.text('email'));
				
				enableDisable();

			}

			init();
		}


		$(document).delegate("#login-page", "pageinit", function(event) {
			new Module($(event.currentTarget));
		});


	});


})();
