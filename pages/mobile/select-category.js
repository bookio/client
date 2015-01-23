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
			var _categories = null;
			var _options = null;


			function addCategory(category) {

				var item = _elements.list.list('add', 'icon-disclosure subtitle title image');
				
				item.title(category.name);
				item.subtitle(category.description);
				item.image(category.image ? category.image : '');

				item.element.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					$.mobile.pages.push('./search.html', {
						params: {
							category: category
						}
					});
				});

			}

			function addCategories(categories) {
				_elements.list.list('reset');

				$.each(categories, function(index, category) {
					console.log(category.name);
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
			
				if (_categories == null) {
				
					$.spin(true);
					
					var request = Gopher.request('GET', 'categories');
	
					request.done(function(categories) {						
						addCategories(_categories = categories);
					});

					if (_categories == null) {
						// If no groups found, show available options
						var request = Gopher.request('GET', 'options');
		
						request.done(function(options) {						
							addCategories(_options = options);
						});						
						
					}
					
					request.always(function() {
						$.spin(false);
						callback();
					});
				}
				else {
					// If no groups found, show available options
					addCategories((_categories.length == 0) ? _options : _categories);
					callback();
				}
			}	
			
			init();			
		}
		
		return Module;

	});


})();
