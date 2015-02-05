(function() {


	var dependencies = [
		'i18n!./select-option.json',
		'../../widgets/pagelogo/pagelogo',
		'../../widgets/common/list.js'
	];



	define(dependencies, function(i18n) {
		
		function Module(page) {

			var _element = page.element;
			var _elements = {};


			function addResource(resource) {

				var item = _elements.list.list('add', 'icon-disclosure subtitle title image');
				
				item.title(resource.name);
				item.subtitle(resource.description);
				item.image(resource.image ? resource.image : '');

				item.element.on('tap', function(event) {
					event.preventDefault();
					event.stopPropagation();

					$.mobile.pages.push('./select-option.html', {
						params: {
							resource: resource
						},
						transition: 'slide'
					});
				});

			}

			function addResources(resources) {
				_elements.list.list('reset');

				$.each(resources, function(index, resource) {
					addResource(resource);
				});

				_elements.list.list('refresh');
				
			}

			function init() {
			
				_element.hookup(_elements, 'data-id');
				_element.i18n(i18n);
				_elements.listview.listview();
				_elements.title.text(Gopher.client.name);

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
				
				var request = Gopher.request('GET', 'rentals');

				request.done(function(resources) {
					addResources(resources);
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
