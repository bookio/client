(function() {

	var dependencies = [
		'i18n!./categories.json'
	];

	define(dependencies, function(i18n) {


		function Module(page) {

			var _element = page.element;
			var _categories = {};
			var _elements = {};

			
			function addEmpty() {
				var template =
					'<li>' +
					'<br>' +
					'<label class="helptext"></label>' +
					'</li>';

				var row = $(template);

				row.find('label').text("..."); 

				_elements.listview.append(row);
				
			}
			
			function addItem(item) {
				var template =
					'<li>' +
					'<a href="">' +
					'<img class="ui-li-thumb">' +
					'<h2></h2>' +
					'<p></p>' +
					'</a>' +
					'</li>';

				var row = $(template);

				row.data('item', item);

				updateRow(row);

				row.find('a').on('tap', function(event) {

					$.mobile.pages.push("../category/category.html", {
						params: {
							category: item
						}
					});

					event.preventDefault();
					event.stopPropagation();
				});

				_elements.listview.append(row);

			}

			function updateRow(row) {
				var item = row.data('item');
				row.find('h2').text(item.name);
				row.find('p').text(item.description);
				row.find('img').attr('src', item.image ? item.image : '../../images/icons/bookio.png');
			}

			function refreshListView() {
				_elements.listview.listview('refresh');
			}


			function enableListeners() {
				Model.Categories.on('added.categories', function(category) {
					addItem(category);
					refreshListView();

				});

				Model.Categories.on('updated.categories', function(category) {

					_elements.listview.find('li').each(function() {
						var item = $(this).data('item');

						if (item.id == category.id) {
							updateRow($(this));
							refreshListView();
						}
					});
				});

				Model.Categories.on('removed.categories', function(category) {

					_elements.listview.find('li').each(function() {

						var item = $(this).data('item');

						if (item.id == category.id) {
							$(this).remove();
							refreshListView();
						}
					});
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

					if (categories.length > 0) {
						_elements.listview.empty();

						$.each(categories, function(index, category) {
							addItem(category);
						});
					}

					_elements.listview.listview('refresh');

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
					if (_categories.length == 0)  {
						addEmpty();						
					}
					
					callback();
					$.spin(false);
				});
			
			}
		}
		
		
		return Module;

	});


})();
