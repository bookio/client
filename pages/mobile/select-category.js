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

			function addRental(rental) {

				var item = _elements.list.list('add', 'icon-disclosure subtitle title image');
				
				item.title(rental.name);
				item.subtitle(rental.description);
				item.image(rental.image ? rental.image : '');

				item.element.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					$.mobile.pages.push('./select-option.html', {
						params: {
							rental: rental
						},
						transition: 'slide'
					});

				});
			}

			function addCategory(category) {

				var item = _elements.list.list('add', 'icon-disclosure subtitle title image');
				
				item.title(category.name);
				item.subtitle(category.description);
				item.image(category.image ? category.image : '');

				item.element.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					if (category.automatic) {
						$.mobile.pages.push('./select-option.html', {
							params: {
								category: category
							},
							transition: 'slide'
						});
					}
					// The user should chose a resource
					else {
						$.mobile.pages.push('./select-resource.html', {
							params: {
								category: category
							},
							transition: 'slide'
						});
					}
				});

			}

			function addRentals(rentals) {
				// Add rentals not belonging to any group
				$.each(rentals, function(index, rental) {
					addRental(rental);
				});
				
			}

			function addCategories(categories) {

				$.each(categories, function(index, category) {
					if (category.available)
						addCategory(category);
				});
				
			}

			function init() {
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				_elements.listview.listview();
				_elements.title.text(Gopher.client.name);

				_elements.list.list();
			}

			this.refresh = function(callback) {
			
				var requests = [];
			
				$.spin(true);
				_elements.list.list('reset');
				
				// Get categories that is available and has linked rentals 
				var requestCategories = Gopher.request('GET', 'categories/active');
				
				requests.push(requestCategories);

				requestCategories.done(function(categories) {
					addCategories(categories);
				});

				// Get rentals that is available and not linked to any category
				var requestRentals = Gopher.request('GET', 'rentals/no_category');

				requests.push(requestRentals);

				requestRentals.done(function(rentals) {
					addRentals(rentals);
				});

				$.when.apply(this, requests).then(function() {
					_elements.list.list('refresh');
					$.spin(false);
					callback();
				});
				
			}	
			
			init();			
		}
		
		return Module;

	});


})();
