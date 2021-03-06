(function () {

    var dependencies = [
		'i18n!./search.json',
        '../../widgets/datepicker/datepicker'
    ];

    define(dependencies, function(i18n) {

        function Module(page) {

            var _element = page.element;
            var _params = page.params;
            var _elements = {};

            function pickDate(button, date, callback) {

                var popup = $('<div data-role="popup"></div>').popup({
                    dismissible: true,
                    theme: "a",
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
					
					// Work around a bug(?) in mobiscroll, round the end date to the nearest hour
					_params.endDate.setMinutes(_params.endDate.getMinutes() + 30);
					_params.endDate.setMinutes(0);	
					_params.endDate.setSeconds(0);	
					_params.endDate.setMilliseconds(0);	
					
					_params.endDate = _params.endDate.addDays(1);
					
                    var url = sprintf('rentals/query?begin_at=%s&end_at=%s', _params.startDate.toISOString(), _params.endDate.toISOString(), _params.option.id);
                    //var url = sprintf('rentals/query?begin_at=%s&end_at=%s', _params.startDate.toJSON(), _params.endDate.toJSON(), _params.category.id);
                    var request = Gopher.request('GET', url);

					console.log('Searching for empty slot', url);
					
                    _elements.searchResult.fadeOut();

                    $.spin(true);

                    request.always(function () {
                        $.spin(false);
                    });

                    request.done(function (rentals) {

                        if (rentals.length > 0) {
                            // Take the first one
                            _params.rental = rentals[0];

                            $.mobile.pages.push('enter-name.html', {
                                params: _params,
                                transition: 'slide'
                            });

                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else {
                            _elements.searchResult.fadeIn();
                            
                            // Make sure message of failed search is visible
							$(window).scrollTop(300); 
                        }
                    });

                });

            }

            this.init = function() {

                _element.hookup(_elements, 'data-id');
                _element.i18n(i18n);
                
                _elements.title.text(Gopher.client.name);

                _elements.name.text(_params.option.name);
                _elements.description.text(_params.option.description);
                
                _elements.dateInterval.attr('placeholder', i18n.text('when', "When?"));

				var startDate = new Date();
				startDate.clearTime();

				var endDate = new Date();
				endDate.clearTime();

				var minDate = new Date();
				minDate.clearTime();
				
				_elements.dateInterval.mobiscroll().rangepicker(
					{	
						controls: ['calendar'], 
						weekCounter: 'year', 
						minDate: minDate,
						navigation: 'month',
						firstDay: 1,
						defaultValue: [ startDate, endDate],
						onClose: function (valueText, btn, inst) {
									enableDisable(valueText);
						}
					});

                
                enableEventsHandlers();                
                enableDisable();
            }
            
        }

		return Module;

    });


})();