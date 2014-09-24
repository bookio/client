(function() {

	var dependencies = [
		'i18n!./rentals.json',
		'../../widgets/common/list.js',
		'../../widgets/pagelogo/pagelogo.js'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _categories = {};
			var _elements = {};

			function addItem(rental) {
				var item = _elements.list.list('add', 'icon-disclosure image subtitle title');
				
				item.title(rental.name);
				item.subtitle(rental.description);

				item.image(sprintf('../../images/symbols/%04d.svg', rental.icon_id == null ? 0 : rental.icon_id));
//				category.image ? category.image : '../../images/icons/bookio.png');
				
				item.element.on('tap', function() {
					$.mobile.pages.push("../rental/rental.html", {
						params: {
							rental: rental
						}
					});
				});
			}



			function enableListeners() {
				Model.Categories.on('added.rentals', function(category) {
					addItem(category);
				});

				Model.Categories.on('updated.rentals', function(category) {
				});

				Model.Categories.on('removed.rentals', function(category) {
				});

				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.add.on('tap', function(event) {
					$.mobile.pages.push('../rental/rental.html');
				});

				_element.on('remove', function() {
					Model.Categories.off('.rentals');
				});
			}



			function load() {

				var request = Model.Rentals.fetch();

				request.done(function(rentals) {

					_rentals = rentals;
					_elements.list.list('reset');

					$.each(rentals, function(index, rental) {
						addItem(rental);
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
				
				$.when(load()).then(function() {
					callback();
					$.spin(false);
				});
			
			}
		}
		
		
		return Module;

	});


})();
