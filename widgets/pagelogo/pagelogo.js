

(function() {

	var dependencies = [
		'text!./pagelogo.html',
		'css!./pagelogo'
	];

	define(dependencies, function(html) {


		var widget = {};

		widget.options = {
		}
		
		widget._create = function() {
			this.element.append($(html));
			
			this.elements = {};
			this.elements.container = this.element.find('div');
			this.elements.image = this.elements.container.find('img');
			
			if (Gopher.client.logo) {
				this.elements.image.attr('src', Gopher.client.logo); 	
				this.elements.container.addClass('background-image-none');
			}
		}		
		
		// Define the widget
		$.widget("mobile.pagelogo", $.mobile.widget, widget);

		// taking into account of the component when creating the window
		// or at the create event
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=pagelogo)", e.target).pagelogo();
		});


	});


})();
