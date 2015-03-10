(function() {

	var dependencies = [
		'i18n!./user.json',
		'../../widgets/deletebutton/deletebutton'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _user = {};
			var _passwordexists = false;

			function fill() {
				_elements.name.val(_user.name);
				_elements.username.val(_user.username);
				if (_user.password.length > 0) {
					_passwordexists = true;
					_elements.passworddisplayed.val(_user.password);
				}
			}

			function chill() {
				_user.name = _elements.name.val();
				_user.username = _elements.username.val();
				_user.password = _elements.password.val();
			}

			function enableDisableOldPassword() {
				if (_elements.oldpassword.val() == '') {
					_elements.oldpassword.removeClass('red');
					_elements.oldpassword.removeClass('green');					
				}
				else if (_elements.oldpassword.val() ==	'potatis') {
					_elements.oldpassword.removeClass('red');
					_elements.oldpassword.addClass('green');						
				}
				else {
					_elements.newpassword.removeClass('green');
					_elements.newpassword2.addClass('red');						
				}
			}

			function enableDisablePasswordChange() {
				if (_elements.newpassword.val() == '' && _elements.newpassword2.val() == '') {
					_elements.newpassword.removeClass('red');
					_elements.newpassword2.removeClass('red');											
					_elements.newpassword.removeClass('green');
					_elements.newpassword2.removeClass('green');																
				}
				else if (_elements.newpassword.val() ==	_elements.newpassword2.val()) {
					_elements.newpassword.removeClass('red');
					_elements.newpassword2.removeClass('red');											

					_elements.newpassword.addClass('green');
					_elements.newpassword2.addClass('green');						
				}
				else {
					_elements.newpassword.removeClass('green');
					_elements.newpassword2.removeClass('green');											

					_elements.newpassword.addClass('red');
					_elements.newpassword2.addClass('red');						
				}
			}

			this.init = function() {
				_user = page.params && page.params.user ? page.params.user : {};
				
				_element.trigger('create');
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				
				_elements.passwordchange.hide();						

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

				_elements.remove.on('delete', function(event) {
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
				
				_elements.changepassword.on('tap', function(event) {
					_elements.passwordchange.toggle("fast");
					_elements.oldpassword.focus();
				});

				_elements.oldpassword.on('input', function() {
					enableDisableOldPassword();
				});
				
				_elements.newpassword.on('input', function() {
					enableDisablePasswordChange();
				});
				
				_elements.newpassword2.on('input', function() {
					enableDisablePasswordChange();
				});



			}
		}

		return Module;


	});


})();
