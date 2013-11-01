(function () {

    var dependencies = [
    	'css!./mobile-search',
        '../components/datepicker'
    ];

    define(dependencies, function () {

        function Module(page) {

            var _page = page;
            var _params = {};
            var _elements = {};

            function pickDate(button, date, callback) {
                function dateChanged() {
                    popup.popup('close');
                    callback(datepicker.date());
                }

                var datepicker = new DatePicker({
                    dateChanged: dateChanged,
                    date: date == null ? new Date() : date
                });

                var options = {
                    dismissible: true,
                    theme: "c",
                    overlyaTheme: "c",
                    transition: "pop",
                    positionTo: button
                };

                var popup = $("<div/>").popup(options);

                popup.on("popupafterclose", function () {
                    $(this).remove();
                });

                popup.append(datepicker.html());
                popup.popup("open").trigger("create");
            }

            function updateButtonTexts() {
                _elements.startDate.text(_params.startDate == null ? 'Från' : _params.startDate.yyyymmdd());
                _elements.startDate.button('refresh');

                _elements.endDate.text(_params.endDate == null ? 'Till' : _params.endDate.yyyymmdd());
                _elements.endDate.button('refresh');

            }

            function enableDisable() {
                _elements.search.toggleClass('ui-disabled', _params.startDate == null || _params.endDate == null || _params.startDate >= _params.endDate);
            }

            function enableEventsHandlers() {

                _elements.back.on('tap', function (event) {
                    $.mobile.popPage();
                });

                _elements.startDate.on('tap', function (event) {

	                event.stopPropagation();
	                event.preventDefault();

                    function dateChanged(date) {
                        _params.startDate = date;

                        updateButtonTexts();
                        enableDisable();
                    }

                    pickDate($(this), _params.startDate, dateChanged);
                });

                _elements.endDate.on('tap', function (event) {

	                event.stopPropagation();
	                event.preventDefault();
	                
                    function dateChanged(date) {
                        _params.endDate = date;

                        updateButtonTexts();
                        enableDisable();
                    }

                    pickDate($(this), _params.endDate, dateChanged);
                });

                _elements.search.on('tap', function (event) {

                    var url = sprintf('rentals/query?begin_at=%s&end_at=%s&category_id=%d', _params.startDate.toJSON(), _params.endDate.toJSON(), _params.category.id);
                    var request = Gopher.request('GET', url);

                    _elements.searchResult.fadeOut();

                    $('body').spin('large');

                    request.always(function () {
                        $('body').spin(false);
                    });

                    request.done(function (rentals) {
                        if (rentals.length > 0) {
                            // Take the first one
                            _params.rental = rentals[0];
                            
                            $.mobile.pushPage('mobile-enter-name.html', {
                                pageData: _params,
                                transition: 'slide',
                                require: 'mobile-enter-name'
                            });

                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else {
                            _elements.searchResult.fadeIn();
							$(window).scrollTop(300); // Make sure message of failed search is visible
                        }
                        console.log(rentals);
                    });

                });

            }

            function init() {

                _params = $.mobile.pageData;

                
                _params.startDate = _params.startDate ? _params.startDate : null;
                _params.endDate = _params.endDate ? _params.endDate : null;

                _page.hookup(_elements);

                _elements.name.text(_params.category.name);
                _elements.description.text(_params.category.description);

                enableEventsHandlers();
                updateButtonTexts();
                enableDisable();
            }

            init();
        }

        $(document).delegate("#mobile-search", "pageinit", function (event) {
            new Module($(this));
        });



    });


})();