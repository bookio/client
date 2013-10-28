(function() {

	var dependencies = [
		'css!./categories'
	];

	define(dependencies, function() {


		function Module(page) {

			var _page = page;
			var _elements = {};
			var _emptylist = true;


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

					$.mobile.pushPage("./category.html", {
						pageData: {
							category: item
						},
						transition: 'slide',
						require: './category'
					});

					event.preventDefault();
					event.stopPropagation();
				});

				_page.find('ul').append(row);

			}

			function updateRow(row) {
				var item = row.data('item');
				row.find('h2').text(item.name);
				row.find('p').text(item.description);
				row.find('img').attr('src', item.image ? Cloudinary.imageURL(item.image, {
					width: 100,
					height: 100,
					crop: 'fit'
				}) : '../images/app-icon.png');
			}

			function refreshListView() {
				_elements.listview.listview('refresh');
			}


			function enableListeners() {
				Notifications.on('category-added.categories', function(category) {
					addItem(category);
					refreshListView();

				});

				Notifications.on('category-updated.categories', function(category) {

					_elements.listview.find('li').each(function() {
						var item = $(this).data('item');

						if (item.id == category.id) {
							updateRow($(this));
							refreshListView();
						}
					});
				});

				Notifications.on('category-removed.categories', function(category) {

					_elements.listview.find('li').each(function() {

						var item = $(this).data('item');

						if (item.id == category.id) {
							$(this).remove();
							refreshListView();
						}
					});
				});

				_elements.back.on('tap', function(event) {
					$.mobile.popPage();
				});

				_elements.add.on('tap', function(event) {
					$.mobile.pushPage('./category.html', {
						transition: 'slide',
						require: './category'
					});
				});

				_page.on('remove', function() {
					Notifications.off('.categories');
				});
			}



			function loadCategories() {
				var request = Model.Categories.fetch();

				request.done(function(categories) {

					_elements.listview.empty();

					$.each(categories, function(index, category) {
						addItem(category);
						_emptylist = false;
					});

					_elements.listview.listview('refresh');

				});

				return request;

			}

			function getGuestURL() {
				var request = Gopher.request('GET', 'users/guest');

				request.done(function(user) {

					var longURL = sprintf("%s?user=%s", window.location.href, user.username);

					_elements.url.val(longURL);

					/*
                    var url = sprintf("http://tinyurl.com/api-create.php?url=%s", longURL);

                    var request = $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'html',
                        crossDomain: true
                    });
                    
                    request.done(function(tinyURL) {
                        _elements.url.text(tinyURL);
                    });
                    
                    request.fail(function(result) {
                    });
                    */

				});

				return request;
			}

			function init() {

				_page.hookup(_elements);

				enableListeners();

				var isDoneCategories = loadCategories();
				var isDoneSetURL = getGuestURL();
				$.when(isDoneCategories, isDoneSetURL).then(function() {
					if (_emptylist)
					//_elements.url.val(_elements.url.attr('placeholder'));
						_elements.url.val("");
				});
			}

			init();
		}

		$(document).delegate("#categories-page", "pageinit", function(event) {
			new Module($(this));
		});



	});


})();
