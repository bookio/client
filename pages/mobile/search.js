(function () {

    var dependencies = [
        '../../widgets/datepicker/datepicker'
    ];

    define(dependencies, function () {

        function Module(page) {

            var _page = page;
            var _params = {};
            var _elements = {};

            function pickDate(button, date, callback) {

                var popup = $('<div data-role="popup"></div>').popup({
                    dismissible: true,
                    theme: "c",
                    transition: "pop",
                    positionTo: button
                });

				var datepicker = $('<div data-role="datepicker"></div>').appendTo(popup).datepicker();
				
				datepicker.datepicker('setDate', date == null ? new Date() : date);
				
                popup.on("popupafterclose", function () {
                    $(this).remove();
                });

                datepicker.on("datechanged", function () {
                    popup.popup('close');
                    callback(datepicker.datepicker('getDate'));
                }); 

                popup.popup('open');
            }

            function updateButtonTexts() {

               /* _elements.startDate.text(_params.startDate == null ? 'Från' : _params.startDate.yyyymmdd());
                _elements.endDate.text(_params.endDate == null ? 'Till' : _params.endDate.yyyymmdd());*/
            }

            function enableDisable() {
                _elements.search.toggleClass('ui-disabled', _params.startDate == null || _params.endDate == null || _params.startDate > _params.endDate);
            }

            function enableEventsHandlers() {

                _elements.back.on('tap', function (event) {
                    $.mobile.pages.pop();
                });

				_elements.startDate.on('tap', function (event) {

	                //event.stopPropagation();
	                //event.preventDefault();
					_elements.startDate.mobiscroll().date({ theme: 'jqm', display: 'bottom', lang: 'sv' });

                });
                
               /* 
                _elements.startDate.on('tap', function (event) {

	                event.stopPropagation();
	                event.preventDefault();

                    function dateChanged(date) {
                        _params.startDate = date;

                        if (_params.endDate == null || _params.endDate <= _params.startDate)
                        	_params.endDate = _params.startDate.addDays(1);
                        	
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

                        if (_params.startDate == null || _params.startDate >= _params.endDate)
                        	_params.startDate = _params.endDate.addDays(-1);

                        updateButtonTexts();
                        enableDisable();
                    }

                    pickDate($(this), _params.endDate, dateChanged);
                });
*/

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

                            $.mobile.pages.push('enter-name.html', {
                                params: _params,
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

                _params = $.mobile.pages.params;

                _params.startDate = _params.startDate ? _params.startDate : null;
                _params.endDate = _params.endDate ? _params.endDate : null;

                _page.hookup(_elements, 'data-id');

                _elements.name.text(_params.category.name);
                _elements.description.text(_params.category.description);
                _elements.image.attr('src', _params.category.image ? _params.category.image : '../../images/app-icon.png');

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