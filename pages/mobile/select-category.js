(function() {


	var dependencies = [
		'../../widgets/pagelogo/pagelogo'
	];

	define(dependencies, function() {

		
		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _categories = null;


			function addCategory(category) {
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

			function addCategories(categories) {
				_elements.listview.empty();

				$.each(categories, function(index, category) {
					addCategory(category);
				});

				_elements.listview.listview('refresh');
				
			}

			this.init = function() {
				_element.hookup(_elements, 'data-id');
				_elements.listview.listview();
				_elements.title.text(Gopher.client.name);

			}
			
			this.refresh = function(callback) {
			
				if (_categories == null) {
				
					$.spin(true);
					
					var request = Gopher.request('GET', 'categories');
	
					request.done(function(categories) {
						addCategories(_categories = categories);
					});
					
					request.always(function() {
						$.spin(false);
						callback();
					});
				}
				else {
					addCategories(_categories);
					callback();
				}
			}				
		}
		
		return Module;

	});


})();
