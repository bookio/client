(function () {

    var dependencies = [
        './search',
        'less!./select-category'
    ];

    define(dependencies, function (html) {


        function Module(page) {

            var _page = page;
            var _elements = {};

            function additem(category) {
                var template =
                    '<li>' +
                    '<a data-hook="link" href="">' +
                    '<h2 data-hook="name"></h2>' +
                    '<p data-hook="description"></p>' +
                    '</a>' +
                    '</li>';

                var li = $(template);

                var elements = {};
                li.hookup(elements);

                elements.name.text(category.name);
                elements.description.text(category.description);

                elements.link.on('tap', function (event) {
                    $.mobile.pushPage("search.html", {
                        pageData: category,
                        transition: 'slide'
                    });

                    event.preventDefault();
                    event.stopPropagation();
                });

                _elements.listview.append(li);

            }

            function init() {
                _page.hookup(_elements);

                _elements.title.text(Gopher.client.name);

                $('body').spin("large");

                function load() {
                    var request = Gopher.request('GET', 'categories');

                    request.always(function () {
                        $('body').spin(false);
                    });

                    request.done(function (categories) {

                        $.each(categories, function (index, category) {
                            additem(category);
                        });

                        _elements.listview.listview('refresh');
                        _elements.content.removeClass("invisible");
                        _elements.content.addClass("fade in");
                    });

                    console.log("Loading categories");

                }

                setTimeout(load, 2000);

            }

            init();
        }

        $(document).delegate("#mobile-select-category-page", "pageinit", function (event) {
            new Module($(event.currentTarget));
        });


    });


})();