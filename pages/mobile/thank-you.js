(function () {

    var dependencies = [
    ];

    define(dependencies, function () {

        function Module(page) {

            var _page = page;
            var _elements = {};

            function enableEventsHandlers() {

                _elements.submit.on('tap', function (event) {
                    $.mobile.pages.go('./select-category.html');
                });


            }

            function init() {

                _page.hookup(_elements, 'data-id');
                _elements.title.text(Gopher.client.name);

                enableEventsHandlers();
            }

            init();
        }

        $(document).delegate("#mobile-thank-you", "pageinit", function (event) {
            new Module($(this));
        });



    });


})();