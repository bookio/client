(function () {

    var dependencies = [
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

                    $.mobile.gotoPage('mobile-select-category', {
                        transition: 'fade'
                    });

                });


            }

            function init() {

                _params = $.mobile.pageData;

                _page.hookup(_elements);

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