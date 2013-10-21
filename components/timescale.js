define(['css!components/timescale'], function() {


    TimeScale = function(container, options) {

        var self = this;

        var _defaults = {
            appendTo: $('body')
        };

        var _options = $.extend({}, options, _defaults);
        var _startDate = new Date();
        var _endDate = _startDate.addDays(_options.noOfSlots);
        var _element = null;
        var _setNeedsLayout = true;

        _startDate.clearTime();
        _endDate.clearTime();


        this.startDate = function(value) {
            if (value == undefined)
                return _startDate;

            _startDate = value;
            _setNeedsLayout = true;
        }


        this.endDate = function(value) {
            if (value == undefined)
                return _endDate;

            _endDate = value;
            _setNeedsLayout = true;
        }

        function init() {

            var template =
                '<div class="time-scale">' +
                '<div class="left-margin">' +
                '</div>' +
                '<div class="cells">' +
                '</div>' +
                '<div class="right-margin">' +
                '</div>' +
                '</div>';


            _element = $(template);

            _element.on('removed', function() {
                Notifications.off('.timescale');
            });

            Notifications.on('updateUI.timescale', function() {
                if (_setNeedsLayout)
                    buildDOM();
                _setNeedsLayout = false;
            });

            container.append(_element);

        };

        function scroll(delta) {
            _startDate = _startDate.addDays(delta);
            _endDate = _endDate.addDays(delta);
            buildDOM();
        }


        function buildDOM() {
            var calendar = _startDate.clone();

            var template =
                '<div class="cell">' +
	                '<div class="content">' +
	                	'<div class="date"></div>' +
                		'<div class="other">' +
                			'<div class="weekday"></div>' +
                			'<div class="month"></div>' +
                		'</div>' +
	                '</div>' +
                '</div>';

            var cells = _element.find('.cells');

            cells.empty();

            while (calendar < _endDate) {
                var cell = $(template).appendTo(cells);
                var date = cell.find('.date');
                var weekday = cell.find('.weekday');
                var month = cell.find('.month');

                if (calendar.getDay() == 0)
                    date.addClass("holiday");
                else
                    date.removeClass("holiday");

                date.text(calendar.getDate());
                month.text(calendar.getShortMonthName());
                weekday.text(calendar.getShortDayName());

                calendar = calendar.addDays(1);
                console.log("%s", calendar.toString());
            }
        }


        init();

        this.scroll = scroll;
    };


    return TimeScale;


});
