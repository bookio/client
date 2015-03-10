

(function() {

	var dependencies = [
		'i18n!./deletebutton.json',		
		'text!./deletebutton.html',
		'css!./deletebutton'
	];

	define(dependencies, function(i18n, html) {

		var widget = {};
				
		widget.setCaption = function(txt) {
			this.elements.button.text(txt);
		}
		
		widget._create = function() {
			var element = this.element;
			var self = this;

				
			element.i18n(i18n);

			self.element.append($(html));	

			self.elements = {};

			self.elements.button = self.element.find('.deletebutton');
			self.elements.surebutton = self.element.find('.surebutton');
			theCube = self.element.find('.cube');
			
			var elements = self.elements;

			elements.button.on('tap', function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				setTimeout(function() {
					theCube.removeClass('flip');
				}, 3000);
				
				theCube.addClass('flip');				
			});

			elements.surebutton.on('tap', function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				self.element.trigger('delete', '');
			});
			
			elements.surebutton.on('mouseleave', function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				theCube.removeClass('flip');
			});
				
		}		
		
		// Define the widget
		$.widget("mobile.deletebutton", $.mobile.widget, widget);
		
		// taking into account of the component when creating the window
		// or at the create event
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=deletebutton)", e.target).deletebutton();
		});


	});


})();
