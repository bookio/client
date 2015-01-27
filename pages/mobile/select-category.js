(function() {


	var dependencies = [
		'i18n!./select-category.json',
		'../../widgets/pagelogo/pagelogo',
		'../../widgets/common/list.js'
	];


	define(dependencies, function(i18n) {
		
		function Module(page) {

			var _element = page.element;
			var _elements = {};


			function addCategory(category) {

				var item = _elements.list.list('add', 'icon-disclosure subtitle title image');
				
				item.title(category.name);
				item.subtitle(category.description);
				item.image(category.image ? category.image : '');

				item.element.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					$.mobile.pages.push('./select-option.html', {
						params: {
							category: category
						},
						transition: 'slide'
					});
				});

			}

			function addCategories(categories) {
				_elements.list.list('reset');

				$.each(categories, function(index, category) {
					addCategory(category);
				});

				_elements.list.list('refresh');
				
			}

			function init() {
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				_elements.listview.listview();
				_elements.title.text(Gopher.client.name);

				_elements.list.list();
			}

			this.refresh = function(callback) {
			
				$.spin(true);
				
				var request = Gopher.request('GET', 'categories');

				request.done(function(categories) {
					addCategories(categories);
				});

				request.always(function() {
					$.spin(false);
					callback();
				});
				
			}	
			
			init();			
		}
		
		return Module;

	});


})();
