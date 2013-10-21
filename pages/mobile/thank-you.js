(function () {

    var dependencies = [
        'css!./thank-you',
        './select-category'
    ];

    define(dependencies, function () {

        function Module(page) {

            var _page = page;
            var _elements = {};
            var _params = {};


            function enableDisable() {
                //_elements.search.toggleClass('ui-disabled', _startDate == null || _endDate == null || _startDate >= _endDate);
            }

            function enableEventsHandlers() {


                _elements.submit.on('tap', function (event) {

                    $.mobile.gotoPage('select-category.html', {
                        transition: 'fade'
                    });

                });


            }

            function init() {

                _params = $.mobile.pageData;

                _page.hookup(_elements);

                _elements.title.text(Gopher.client.name);
                //_elements.category.name.text(_params.category.name);
                //_elements.category.description.text(_params.category.description);

                //_elements.rental.name.text(_params.rental.name);
                //_elements.rental.description.text(_params.rental.description);


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