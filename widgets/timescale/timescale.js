(function() {

	var dependencies = [
		'css!./timescale'
	];

	define(dependencies, function() {

	    var Widget = function(widget) {

	        var self = this;
	
	        var _startDate = new Date();
	        var _endDate = _startDate.addDays(10);
	        var _setNeedsLayout = true;
	        var _page = widget.element.parents("[data-role='page']");
	
	        _startDate.clearTime();
	        _endDate.clearTime();
	
	        console.log('Creating widget timescale...');
	        
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
	        
	        this.refresh = function() {
	        
	        	if (_setNeedsLayout)
			        buildDOM();
			        
	        }
	
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
	
	
	            var html = $(template);
	
	            _page.on('refresh.timescale', function() {
	                if (_setNeedsLayout)
	                    buildDOM();
	                _setNeedsLayout = false;
	            });

	            _page.on('removed.timescale', function() {
	                debugger;
	                _page.off('.timescale');
	            });
	

	            widget.element.append(html);
	
	        };
	
	        this.scroll = function(delta) {
	            _startDate = _startDate.addDays(delta);
	            _endDate = _endDate.addDays(delta);
	            buildDOM();
	        }
	
	
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
	            
	            var days = Math.floor((_endDate.getTime() - _startDate.getTime()) / (24*60*60*1000));
	
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
	            
	            _setNeedsLayout = false;

	        }
	
	
	        init();
	
	    };


		function defineWidget() {
			var widget = {};
	
			widget.options = {};
	
			widget._create = function() {
				this.widget = new Widget(this);
			}
	
			widget.refresh = function() {
				this.widget.refresh();
			}

			widget.scroll = function(delta) {
				this.widget.scroll(delta);
			}
			
			widget.startDate = function(value) {
				return this.widget.startDate(value);
			}
	
			widget.endDate = function(value) {
				return this.widget.endDate(value);
			}
	
			$.widget("mobile.timescale", $.mobile.widget, widget);
	
			$(document).bind("pagecreate", function(event) {
				//$(":jqmData(role=timescale)", event.target).timescale();
			});
		}

		defineWidget();
	});


})();
