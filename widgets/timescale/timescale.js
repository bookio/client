(function() {

	var dependencies = [
		'css!./timescale'
	];

	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self = this;
	
	        var _startDate = new Date();
	        var _endDate = _startDate.addDays(10);
	        var _element = widget.element;
	        
	        var _ticks = new RRule({
				freq: RRule.DAILY,
				dtstart: _startDate
			})
	
	        _startDate.clearTime();
	        _endDate.clearTime();
	
	        _element.define('set', function(params) {
		        
		        var changed = false;
		        
		        if (params.startDate != undefined)
		        	_startDate = params.startDate, changed = true;
		        	 
		        if (params.endDate != undefined)
		        	_endDate = params.endDate, changed = true;
		        	
		        _ticks = new RRule({
					freq: RRule.DAILY,
					dtstart: _startDate
					//byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
				});
		        	
		        if (changed)
		        	buildDOM(); 
	        });
	        
	        
	        _element.define('get', function(params) {
		        params.startDate = _startDate;
		        params.endDate = _endDate;
	        });
	        
	
	        function init() {
	
	            var template =
	                '<div class="timescale">' +
		                '<div class="left-margin ui-icon ui-icon-camera">' +
		                '</div>' +
		                '<div class="cells">' +
		                '</div>' +
		                '<div class="right-margin">' +
		                '</div>' +
	                '</div>';
	
	
				_element.on('removed', function() {
					// ??
				});

	            _element.append($(template));
	            
	        };
	
	        function buildDOM() {
	            var calendar = _startDate.clone();
	
	            var template =
	                '<div class="cell">' +
	                	'<div class="date"></div>' +
                		'<div class="other">' +
                			'<div class="weekday"></div>' +
                			'<div class="month"></div>' +
                		'</div>' +
	                '</div>';
	
	            var cells = widget.element.find('.cells');
	
	            cells.empty();
	            
	            var days = Math.round(Math.abs(_endDate.getTime() - _startDate.getTime()) / (24*60*60*1000));

	            for (var i = 0; i < days; i++) {
	                var cell = $(template).appendTo(cells);
	                var date = cell.find('.date');
	                var weekday = cell.find('.weekday');
	                var month = cell.find('.month');
	
	                cell.css({
		                left: sprintf('%f%%', i * 100 / days),
		                width: sprintf('%f%%', 100 / days)
	                });
	                
	                date.toggleClass('holiday', calendar.getDay() == 0);
	
	                date.text(calendar.getDate());
	                month.text(calendar.getShortMonthName());
	                weekday.text(calendar.getShortDayName());
	
	                calendar = calendar.addDays(1);
	            }
	            
	        }
	
	       init();
	
	    };


		(function() {
			var widget = {};

			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
	
			$.widget("mobile.timescale", $.mobile.widget, widget);
			
			$(document).bind("create pagecreate", function(event) {
				$(":jqmData(role=timescale)", event.target).timescale();
			});
			
		})();
	});


})();
