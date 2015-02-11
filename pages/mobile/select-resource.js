(function() {


	var dependencies = [
		'i18n!./select-option.json',
		'../../widgets/pagelogo/pagelogo',
		'../../widgets/common/list.js'
	];



	define(dependencies, function(i18n) {
		
		function Module(page) {

			var _element = page.element;
			var _params = page.params;
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

			function addRentals(rentals) {
				_elements.list.list('reset');

				$.each(rentals, function(index, rental) {
					addRental(rental);
				});

				_elements.list.list('refresh');
				
			}

			function init() {
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				_elements.listview.listview();
				_elements.title.text(Gopher.client.name);
				_elements.header.text(_params.category.name);				

				_elements.list.list();

				// Hide Back-button if Categories is missing (no parent page)
				if ($.mobile.pages.length() == 0) {
					_elements.back.hide();	
				}
				else {
					_elements.back.on('tap', function (event) {
	                    $.mobile.pages.pop();
	                });					
				}

			}

			this.refresh = function(callback) {
			
				$.spin(true);
				
				var query = {};
				
				query.category_id = _params.category.id;
				var request = Gopher.request('POST', 'rentals/query', query);								
				
				request.done(function(rentals) {
					addRentals(rentals);
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
