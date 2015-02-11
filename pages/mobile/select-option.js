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
			var _parentIsRental;

			function addOption(option) {

				var item = _elements.list.list('add', 'icon-disclosure subtitle title image');
				
				item.title(option.name);
				item.subtitle(option.description);
				item.image(option.image ? option.image : (_parentIsRental ? _params.rental.image : _params.category.image));

				item.element.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					$.mobile.pages.push('./search.html', {
						params: {
							option: option
						},
						transition: 'slide'
					});
				});

			}

			function addOptions(options) {
				_elements.list.list('reset');

				$.each(options, function(index, option) {
					addOption(option);
				});

				_elements.list.list('refresh');
				
			}

			function init() {

				_parentIsRental = (_params.rental != undefined);
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				_elements.listview.listview();
				_elements.title.text(Gopher.client.name);
				_elements.header.text(_parentIsRental ? _params.rental.name : _params.category.name);

				_elements.list.list();

				_elements.back.on('tap', function (event) {
                    $.mobile.pages.pop();
                });					

			}

			this.refresh = function(callback) {
			
				$.spin(true);
				
				if (_parentIsRental)
					var request = Gopher.request('GET', sprintf('options/rental/%d', _params.rental.id));
				else
					var request = Gopher.request('GET', sprintf('options/category/%d', _params.category.id));
				
				request.done(function(options) {
					addOptions(options);
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
