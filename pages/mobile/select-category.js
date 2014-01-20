(function() {


	var dependencies = [
		'../../widgets/pagelogo/pagelogo'
	];

	define(dependencies, function() {

		
		function Module(page) {

			var _element = page.element;
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

				elements.image.attr('src', category.image ? category.image : '../../images/icons/bookio.png');

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
				_element.hookup(_elements, 'data-id');

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

						_elements.listview.listview();
						_elements.listview.listview('refresh');
						
						page.show();
					});
					
				}

				load();

			}

			init();
		}
		
		return Module;

	});


})();
