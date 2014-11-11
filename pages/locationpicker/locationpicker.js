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


			}

			function chill() {


			}
			

			this.init = function() {

				
				if (page.params && page.params.option) {
					$.extend(_option, page.params.option);
				}

				_elements.done.on('tap', function(event) {
					$.mobile.pages.pop();
				});
								
				fill();
				
				$(".gllpLatlonPicker").each(function() {
					(new GMapsLatLonPicker()).init( $(this) );
				});				

			}
			
		}
		
		return Module;
	});


})();
