(function() {

	var dependencies = [
		'i18n!./user.json',
		'css!./user'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _page = page;
			var _elements = {};
			var _user = {};

			function fill() {
				_elements.name.val(_user.name);
				_elements.email.val(_user.email);
				_elements.password.val(_user.password);
			}

			function chill() {
				_user.name = _elements.name.val();
				_user.email = _elements.email.val();
				_user.username = _elements.email.val();
				_user.password = _elements.password.val();
			}


			function init() {
				_page.hookup(_elements, 'data-id');

				_page.i18n(i18n);

				if ($.mobile.pageData && $.mobile.pageData.user) {
					_user = $.mobile.pageData.user;
				}

				fill();

				if (_user.id) {
					_elements.save.addClass('hidden');
					
					// Cannot delete myself!
					if (_user.id == Gopher.user.id)
						_elements.remove.addClass('hidden');
				}
				else {
					_elements.remove.addClass('hidden');
				}


				_elements.back.on('tap', function(event) {
					if (_user.id) {
						chill();

						var request = Model.Users.save(_user);

						request.done(function() {
							$.mobile.pages.pop();
						});
					}
					else
						$.mobile.pages.pop();
				});

				_elements.remove.on('tap', function(event) {
					var request = Model.Users.remove(_user);

					request.done(function() {
						$.mobile.pages.pop();
					});
				});


				_elements.save.on('tap', function(event) {
					chill();

					var request = Model.Users.save(_user);

					request.done(function() {
						$.mobile.pages.pop();
					});

					request.fail(function() {
					});
					
					

				});

			}

			init();
		}

		$(document).delegate("#user-page", "pageinit", function(event) {
			new Module($(event.currentTarget));
		});


	});


})();
