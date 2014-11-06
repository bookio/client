(function() {

	var dependencies = [
		'i18n!./categories.json',
		'../../widgets/common/list.js'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _categories = {};
			var _elements = {};

			function addItem(category) {
				var item;
				
				// If group unavailable show this by 'line-through' on text
				if (category.available)
					item = _elements.list.list('add', 'icon-disclosure subtitle title ');
				else
					item = _elements.list.list('add', 'icon-disclosure subtitle title lineThrough');
				
				item.title(category.name);
				item.subtitle(category.description);
				//item.image(category.image ? category.image : '../../images/icons/bookio.png');
				
				item.element.on('tap', function() {
					$.mobile.pages.push("../category/category.html", {
						params: {
							category: category
						}
					});
				});
			}



			function enableListeners() {
				Model.Categories.on('added.categories', function(category) {
					addItem(category);
				});

				Model.Categories.on('updated.categories', function(category) {
				});

				Model.Categories.on('removed.categories', function(category) {
				});

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.add.on('tap', function(event) {
					$.mobile.pages.push('../category/category.html');
				});

				_element.on('remove', function() {
					Model.Categories.off('.categories');
				});
			}



			function loadCategories() {

				var request = Model.Categories.fetch();

				request.done(function(categories) {

					_categories = categories;
					_elements.list.list('reset');

					$.each(categories, function(index, category) {
						addItem(category);
					});

					_elements.list.list('refresh');

				});

				return request;

			}

			this.init = function() {
				
				_element.trigger('create');
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				
				enableListeners();
			}
			
			this.refresh = function(callback) {
			
				$.spin(true);
				
				$.when(loadCategories()).then(function() {
					callback();
					$.spin(false);
				});
			
			}
		}
		
		
		return Module;

	});


})();
