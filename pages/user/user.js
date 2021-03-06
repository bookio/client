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

			function fill() {
				_elements.name.val(_user.name);
				_elements.username.val(_user.username);
				if (_user.password != undefined && _user.password.length > 0) {
					_elements.section.pw.missing.hide();
					_elements.section.pw.exists.removeClass('hidden');					
					_elements.passworddisplayed.val('ABCDEFGH');
				}
			}


			function enableDisablePasswordChange() {
				// empty or equal is OK
				if ((_elements.newpassword.val() ==	_elements.newpassword2.val()) || (_elements.newpassword.val() == '' && _elements.newpassword2.val() == '')) {
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
				
				(_elements.newpassword.hasClass('red')) ? _elements.back.addClass('ui-disabled') : _elements.back.removeClass('ui-disabled');

			}

			this.init = function() {
				_user = page.params && page.params.user ? page.params.user : {};
				
				_element.trigger('create');
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				
				_elements.section.pw.change.hide();						

				fill();

				if (_user.id) {
					//_elements.save.addClass('hidden');
					
					// Cannot delete myself!
					if (_user.id == Gopher.user.id)
						_elements.remove.addClass('hidden');
				}
				else {
					_elements.remove.addClass('hidden');
				}


				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.remove.on('delete', function(event) {
					var request = Model.Users.remove(_user);

					request.done(function() {
						$.mobile.pages.pop();
					});
				});

				_elements.save.on('tap', function(event) {

					var user = {};
					var options = {};

					$.extend(user, _user);
					
					user.name = _elements.name.val();
					user.username = _elements.username.val();

					if (_elements.newpassword.is(':visible')) {
						user.password = _elements.newpassword.val();
						options.password = _elements.oldpassword.val();
					}
					else {
						user.password = _elements.password.val();
						
					}

					console.log(_user, user, options);
					
					var request = Model.Users.save(user, options);

					request.done(function() {
						$.mobile.pages.pop();
					});

					request.fail(function() {
						if (_elements.oldpassword.is(':visible')) {
							_elements.oldpassword.keyframes("shake 0.5s", function() {
							});	
						}
					});
					
				});
				
				_element.on("pageshow", function(event) {
					_elements.name.focus();
				});				
				
				_elements.changepassword.on('tap', function(event) {
					if (_elements.section.pw.change.css('display') == 'block') {
						_elements.oldpassword.val('');
						_elements.newpassword.val('');
						_elements.newpassword2.val('');
						_elements.newpassword.removeClass('red green');
						_elements.newpassword2.removeClass('red green');											
						_elements.back.removeClass('ui-disabled');										
					}
					_elements.section.pw.change.toggle("fast");
					_elements.oldpassword.focus();
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
