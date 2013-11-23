(function() {


	var dependencies = [
		'../../widgets/pagelogo/pagelogo'
	];

	define(dependencies, function(html) {

		
		function Module(page) {

			var _page = page;
			var _elements = {};


			function additem(category) {
				var template =
					'<li>' +
					'<a data-id="link" href="">' +
					'<img data-id="image" class="ui-li-thumb">' +
					'<h2 data-id="name"></h2>' +
					'<p data-id="description"></p>' +
					'</a>' +
					'</li>';

				var li = $(template);

				var elements = {};
				li.hookup(elements, 'data-id');

				elements.name.text(category.name);
				elements.description.text(category.description);

				elements.image.attr('src', category.image ? category.image : '../../images/app-icon.png');

				elements.link.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					$.mobile.pages.push('./search.html', {
						params: {
							category: category
						}
					});
				});

				_elements.listview.append(li);

			}


			function init() {
				_page.hookup(_elements, 'data-id');

				_elements.title.text(Gopher.client.name);


				$('body').spin("large");

				function load() {
					var request = Gopher.request('GET', 'categories');

					request.always(function() {
						$('body').spin(false);
					});

					request.done(function(categories) {

						$.each(categories, function(index, category) {
							additem(category);
						});


						_elements.listview.listview('refresh');
						_elements.content.removeClass("invisible");
						_elements.content.addClass("fade in");
					});

				}

				load();

			}

			init();
		}

		$(document).delegate("#mobile-select-category-page", "pageinit", function(event) {
			new Module($(event.currentTarget));
		});


	});


})();
