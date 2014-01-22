(function () {

    var dependencies = [
    ];

    define(dependencies, function () {

        function Module(page) {

            var _element = page.element;
            var _elements = {};

            function enableEventsHandlers() {

                _elements.submit.on('tap', function (event) {
                    $.mobile.pages.go('./select-category.html');
                });


            }

            this.init = function() {

                _element.hookup(_elements, 'data-id');
                _elements.title.text(Gopher.client.name);

                enableEventsHandlers();
            }
        }

		return Module;


    });


})();