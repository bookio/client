(function () {

    var dependencies = [
    	'css!./mobile-thank-you'
    ];

    define(dependencies, function () {

        function Module(page) {

            var _page = page;
            var _elements = {};
            var _params = {};


            function enableDisable() {
            }

            function enableEventsHandlers() {


                _elements.submit.on('tap', function (event) {

                    $.mobile.gotoPage('mobile-select-category.html', {
                        transition: 'fade',
                        require: 'mobile-select-category'
                    });

                });


            }

            function init() {

                _params = $.mobile.pageData;

                _page.hookup(_elements);

				if (Gopher.client.logo) {
					_elements.logo.attr('src', Cloudinary.imageURL(Gopher.client.logo, {
						crop: 'fit',
						width: 100,
						height: 100
					}));
				}

                _elements.title.text(Gopher.client.name);

                enableEventsHandlers();
                enableDisable();
            }

            init();
        }

        $(document).delegate("#mobile-thank-you", "pageinit", function (event) {
            new Module($(this));
        });



    });


})();