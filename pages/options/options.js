(function() {

	var dependencies = [
		'i18n!./options.json',
		'../../widgets/common/list.js',
		'../../widgets/pagelogo/pagelogo.js'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _categories = {};
			var _elements = {};

			function addItem(option) {
				var item = _elements.list.list('add', 'icon-disclosure subtitle title');
				
				item.title(option.name);
				item.subtitle(option.description);

				item.element.on('tap', function() {
					$.mobile.pages.push("../option/option.html", {
						params: {
							option: option
						}
					});
				});
			}



			function enableListeners() {
				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.add.on('tap', function(event) {
					$.mobile.pages.push('../option/option.html');
				});
			}



			function load() {

				var request = Model.Options.fetch();

				request.done(function(options) {

					_options = options;
					_elements.list.list('reset');

					$.each(options, function(index, option) {
						addItem(option);
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
