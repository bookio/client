(function() {

	var dependencies = [
		'i18n!./users.json',
		'../../widgets/common/list.js'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _elements = {};



			this.init = function() {
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);

				_elements.list.list();
				
				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.add.on('tap', function(event) {
					$.mobile.pages.push('../user/user.html');
				});
				
				_elements.listview.listview();

			}
			
			this.refresh = function(callback) {

				$.spin(true);

				_elements.list.list('reset');

				var request = Model.Users.fetch();

				request.done(function(users) {

					$.each(users, function(index, user) {

						var item = _elements.list.list('add', 'title subtitle icon-disclosure');
						
						item.subtitle(user.email);
						item.title(user.name);

						item.element.on('tap', function(event) {

							$.mobile.pages.push('../user/user.html', {
								params: {
									user: user
								}
							});
						});
					});

					_elements.list.list('refresh');
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
