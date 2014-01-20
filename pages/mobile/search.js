(function () {

    var dependencies = [
        '../../widgets/datepicker/datepicker'
    ];

    define(dependencies, function() {

        function Module(page) {

            var _element = page.element;
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

            function enableDisable(choosenValue) {
                _elements.search.toggleClass('ui-disabled', choosenValue == undefined);
            }

            function enableEventsHandlers() {

                _elements.back.on('tap', function (event) {
                    $.mobile.pages.pop();
                });
                
                _elements.search.on('tap', function (event) {
					_params.startDate = _elements.dateInterval.mobiscroll('getValue')[0];
					_params.endDate = _elements.dateInterval.mobiscroll('getValue')[1];
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
                    });

                });

            }

            function init() {

                _params = pages.params;

                _element.hookup(_elements, 'data-id');

                _elements.name.text(_params.category.name);
                _elements.description.text(_params.category.description);
                _elements.image.attr('src', _params.category.image ? _params.category.image : '../../images/icons/bookio.png');

				_elements.dateInterval.mobiscroll().rangepicker(
					{	theme: 'jqm', 
						display: 'bubble', 
						controls: ['calendar'], 
						weekCounter: 'year', 
						lang: 'sv', 
						minDate: new Date(),
						navigation: 'month',
						firstDay: 1,
						defaultValue: [ new Date(), new Date() ],
						onClose: function (valueText, btn, inst) {
									enableDisable(valueText);
								}
					});

                enableEventsHandlers();
                enableDisable();
  
  				page.show();
	            
            }

            init();
        }

		return Module;

    });


})();