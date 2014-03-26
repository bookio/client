(function() {

	var dependencies = [
		'i18n!./users.json'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _elements = {};


			function addItem(item) {
				var template =
					'<li class="user">' +
					'<a href="">' +
					'<h2></h2>' +
					'<p></p>' +
					'</a>' +
					'</li>';

				var li = $(template);


				li.find('h2').text(item.name ? item.name : item.username);
				li.find('p').text(item.email);

				li.find('a').on('tap', function(event) {

					$.mobile.pages.push('../user/user.html', {
						params: {
							user: item
						}
					});

					event.preventDefault();
					event.stopPropagation();
				});

				_element.find('ul').append(li);

			}




			this.init = function() {
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);

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

				_elements.listview.find('.user').remove();

				var request = Model.Users.fetch();

				request.done(function(users) {

					$.each(users, function(index, user) {
						addItem(user);
					});

					_elements.listview.listview('refresh');

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
