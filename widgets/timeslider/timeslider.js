(function() {

	var dependencies = [
		'css!./timeslider'
	];

	define(dependencies, function(html) {


		var Widget = function(widget) {

			var self = this;

			var _elements = {};
			var _position = widget.options.position;
			var _length = widget.options.length; // Default width is one 'time slot'
			var _range = widget.options.range;
			var _scrollTimer = null;
			var _setNeedsLayout = true;
			var _busy = false;
			var _page = widget.element.parents("[data-role='page']");

			this.position = function(value) {

				if (value == undefined)
					return _position;

				_setNeedsLayout = true;
				return _position = value;
			}

			this.range = function(value) {
				if (value == undefined)
					return _range;

				_setNeedsLayout = true;
				return _range = value;
			}

			this.length = function(value) {
				if (value == undefined)
					return _length;

				_setNeedsLayout = true;
				return _length = value;
			}


			function init() {

				var template =
					'<div class="container">' +
					'<div class="left scroll">' +
					'<div class="ui-icon ui-icon-arrow-l"/>' +
					'</div>' +

				'<div class="slider-container">' +
					'<div class="slider">' +
					'<div class="gripper">' +
					'</div>' +
					'</div>' +
					'</div>' +

				'<div class="right scroll">' +
					'<div class="ui-icon ui-icon-arrow-r"/>' +
					'</div>' +
					'</div>';

				var root = $(template);

				widget.element.append(root);

				_elements.root = root;
				_elements.slider = _elements.root.find('.slider');
				_elements.gripper = _elements.root.find('.gripper');

				$(document).on('updatelayout.timeslider', function(event) {
					positionSlider();
				});

				_elements.gripper.css({
					height: widget.options.size,
					width: widget.options.size
				});

				_elements.slider.on('doubletap', function(event) {
					widget.element.trigger('doubletap');
				});

				_elements.root.on('removed', function() {

					// Clean up notifications
					Notifications.off('.timeslider');

					// And some more...   
					_page.off('.timeslider');
					$(window).off('.timeslider');
					$(document).off('.timeslider');
				});

				_page.on('refresh.timeslider', function() {
					updateLayout();
				});


			};


			function startScrolling(delta) {
				function scroll() {
					widget.element.trigger('scroll', delta);
				}
				if (_scrollTimer == null) {
					_scrollTimer = setInterval(scroll, 80);
				}
			}


			function stopScrolling() {
				if (_scrollTimer != null) {
					clearInterval(_scrollTimer);
				}

				_scrollTimer = null;
			}

			function updateLayout() {
				if (_setNeedsLayout)
					positionSlider();

				_setNeedsLayout = false;

			}

			function positionSlider(animationSpeed) {
				var slider = _elements.slider;

				var css = {};
				css.left = sprintf('%f%%', _position * 100 / _range);
				css.width = sprintf('%f%%', _length * 100 / _range);

				if (animationSpeed != undefined && animationSpeed)
					slider.transition(css, animationSpeed, 'easeInOutBack' /*'ease-in-out'*/ );
				else
					slider.css(css);
			}


			function enableScrolling() {

				function scroll(delta) {
					startScrolling(delta);

					$(document).on(isTouch() ? 'touchend.timeslider' : 'mouseup.timeslider', function() {
						stopScrolling();
						$(document).off(".timeslider");
					});

				}

				_elements.root.find('.scroll.left').on(isTouch() ? 'touchstart' : 'mousedown', function() {
					scroll(-1);
				});

				_elements.root.find('.scroll.right').on(isTouch() ? 'touchstart' : 'mousedown', function() {
					scroll(1);
				});

			};


			function enableDrag() {

				var slider = _elements.slider;
				var parent = slider.parent();


				slider.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {

					var offsetFromLeft = event.originalEvent.pageX - slider.offset().left;
					var offsetFromRight = slider.outerWidth() - offsetFromLeft;

					event.preventDefault();

					var dragging = (offsetFromLeft < slider.innerWidth() - slider.innerHeight())

					$(document).on("mousemove.timeslider touchmove.timeslider", function(event) {

						_busy = true;

						var left = slider.position().left;
						var width = slider.outerWidth();
						var css = {};

						var leftMargin = _elements.root.find('.left').outerWidth();
						var rightMargin = _elements.root.find('.right').outerWidth();

						if (dragging) {
							left = event.originalEvent.pageX - parent.offset().left - offsetFromLeft;
							left = Math.max(left, -leftMargin);
							left = Math.min(left, parent.innerWidth() - slider.outerWidth() + leftMargin);
							slider.css({
								left: left
							});

							if (left < 0)
								startScrolling(-1);
							else if (left + width > parent.innerWidth())
								startScrolling(1);
							else
								stopScrolling();

						}
						else {
							width = event.originalEvent.pageX - parent.offset().left - slider.position().left + offsetFromRight;
							width = Math.max(width, slider.innerHeight() * 1.5);
							width = Math.min(width, parent.innerWidth() - slider.position().left + rightMargin);
							slider.css({
								width: width
							});
						}


						var length;
						var parentWidth = slider.parent().innerWidth();

						length = Math.floor((width / parentWidth) * _range + 0.5);
						length = Math.max(length, 1);

						var position;
						position = Math.floor((left / parentWidth) * _range + 0.5);
						position = Math.min(position, _range - length);
						position = Math.max(position, 0);

						if (position != _position) {
							_position = position;

							widget.element.trigger('positionchanged', _position);
						}

						if (length != _length) {
							_length = length;

							widget.element.trigger('lengthchanged', _length);

						}

					});

					$(document).on("mouseup.timeslider touchend.timeslider", function(event) {
						positionSlider(300);
						stopScrolling();

						$(document).off(".timeslider");

						dragging = false;
						_busy = false;


					});
				});


			}


			init();
			enableDrag();
			enableScrolling();
			positionSlider();

			this.refresh = positionSlider;
		};


		// Define the widget
		var widget = {};

		widget.options = {};

		widget.options.size = "25px";
		widget.options.length = 7;
		widget.options.position = 3;
		widget.options.range = 10;

		widget._create = function() {
			this.widget = new Widget(this);
		}

		widget.refresh = function() {
			this.widget.refresh();
		}

		widget.position = function(value) {
			return this.widget.position(value);
		}

		widget.length = function(value) {
			return this.widget.length(value);
		}

		widget.range = function(value) {
			return this.widget.range(value);
		}


		$.widget("mobile.timeslider", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(e) {
			//$(":jqmData(role=timeslider)", e.target).timeslider();
		});


	});


})();
