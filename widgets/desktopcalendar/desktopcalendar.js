define(['css!./desktopcalendar'], function() {


	var Widget = function(widget) {

		var self = this;

		var _defaults = {};

		var _options = $.extend({}, _defaults, {});
		var _element = null;
		var _page = widget.element.parents("[data-role='page']");
		var _lastDateUpdated = "1961-10-02";

		widget.element.define('set', function(params) {
															
			if (params.startDate.valueOf() != _lastDateUpdated.valueOf()) {						
				$("[id^=calendar-]").each(function(index) {				
					$(this).fullCalendar('gotoDate', params.startDate);
				});
				_lastDateUpdated = params.startDate;
			}
	        
        });

		function init() {
						
			var defaultValues =  {
				defaultView: 'agendaDay',
				axisFormat: 'H:mm',
				allDaySlot: false,
				slotDuration: '00:15:00',
				minTime: '08:00',
				maxTime: '18:00',
				lang: $.i18n.lang,
				header: {
				  left: '',
				  center: 'title',
				  right: ''
				},
				selectable: true, 
				selectHelper: true,
				height: 'auto'
			};
			
			var request = Model.Rentals.fetch(); 
			var calendars = [];

			$('body').spin("large");
	
			request.done(function(rentals) {
				
				$.each(rentals, function(i, rental) {
					
					var divForCalendar = $('<div class="agenda" id="calendar-' + i + '"></div>');
					$('#desktopcalendar').append(divForCalendar);

					// Set name of resource in title					
					divForCalendar.fullCalendar($.extend({}, defaultValues, {titleFormat: "[" + rental.name + "]"}));

					// Set background to resource symbol
					var symbol = $('<img class="headersymbol ' + sprintf('symbol-%04d">', rental.icon_id));
					divForCalendar.prepend(symbol);

				});				

				$('body').spin(false);
				
			});
						
		}

		init();

	}

	function defineWidget() {
		var widget = {};

		widget.options = {};

		widget._create = function() {
			this.widget = new Widget(this);
		}

		$.widget("mobile.desktopcalendar", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=desktopcalendar)", e.target).desktopcalendar();
		});
	}

	defineWidget();

});
