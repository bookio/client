(function() {

	var dependencies = [
		'i18n!./locationpicker.json'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};
			var _option = {};

			_element.hookup(_elements, 'data-id');
			_element.i18n(i18n);

			function fill() {
				
				// If no values set default
				if (page.params.lat == undefined) {
					page.params.lat = i18n.text('default-lat', '48.85837009999999');
					page.params.lon = i18n.text('default-lon', '2.2944813000000295');
					page.params.location = i18n.text('default-location', 'Eiffel Tower');
				}
				
				_elements.latitude.val(page.params.lat);
				_elements.longitude.val(page.params.lon);
				_elements.location.val(page.params.location);		
			}

			function chill() {
				page.params.lat = _elements.latitude.val();
				page.params.lon = _elements.longitude.val();
				page.params.location = _elements.location.val();		
			}
			
			this.init = function() {

				if (page.params && page.params.option) {
					$.extend(_option, page.params.option);
				}

				_elements.done.on('tap', function(event) {
					chill();
					$.mobile.pages.pop(page.params, "jbn");
				});
				
				_element.on('pageshow', function() {
					$(".gllpLatlonPicker").each(function() {
						(new GMapsLatLonPicker()).init( $(this) );
					});									
				});
								
				fill();

			}
			
		}
		
		return Module;
	});


})();
