define(['css!./desktoplist'], function() {


	var Widget = function(widget) {

		var self = this;

		var _defaults = {};

		var _options = $.extend({}, _defaults, {});
		var _element = null;
		var _page = widget.element.parents("[data-role='page']");


		function init() {

		}


		init();

	}

	function defineWidget() {
		var widget = {};

		widget.options = {};

		widget._create = function() {
			this.widget = new Widget(this);
		}

		$.widget("mobile.desktoplist", $.mobile.widget, widget);

		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=desktoplist)", e.target).desktoplist();
		});
	}

	defineWidget();

});
