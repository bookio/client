

(function() {

	var dependencies = [
		'text!./imagepicker.html',
		'css!./imagepicker'
	];

	define(dependencies, function(html) {


		var widget = {};
		
		widget.options = {
			image:''
		}
		
		widget.setImage = function(src) {
			this.elements.image.attr("src", src);
			this.elements.container.toggleClass('background-image-none', src != '');
			this.elements.clearbutton.toggleClass('background-image-none', src == '');
		}

		widget.getImage = function() {
			return this.elements.image.attr("src");
		}						
	
		widget.setFile = function(file) {

			var reader = new FileReader();
			var self = this;
			
			reader.onload = function(event) {
				self.setImage(event.target.result);
				self.element.trigger('imagechanged', event.target.result);
			};
			
			reader.readAsDataURL(file);
		}						

		
		widget._create = function() {
			var element = this.element;
			var self = this;

			self.element.append($(html));	

			self.elements = {};
			self.elements.container = self.element.find('.container');
			self.elements.image = self.element.find('img');
			self.elements.file = self.element.find('input');
			self.elements.clearbutton = self.element.find('.clearbutton');
			
			var elements = self.elements;
			
			elements.container.on('tap', function(event) {
				event.stopPropagation();
				event.preventDefault();

				elements.file.click();
			});
			
			elements.clearbutton.on('tap', function(event) {
				event.stopPropagation();
				event.preventDefault();

				elements.image.attr("src", '');
				elements.container.toggleClass('background-image-none', false);				
				elements.clearbutton.toggleClass('background-image-none', true);				

			});
			
			elements.container.on('dragover', function(event) {

				event.stopPropagation();
				event.preventDefault();

				var files = event.originalEvent.dataTransfer.files;

				if (files.length > 0) {
					switch (files[0].type) {
						case 'image/jpeg':
						case 'image/png':
						case 'image/svg':
						case 'image/gif':
							event.originalEvent.dataTransfer.dropEffect = 'copy';
							break;
						default:
							event.originalEvent.dataTransfer.dropEffect = 'none';
					}
				}

			});

			elements.container.on('drop', function(event) {
				event.stopPropagation();
				event.preventDefault();
				self.setFile(event.originalEvent.dataTransfer.files[0]);
			});

			elements.file.on('change', function(event) {
				event.stopPropagation();
				event.preventDefault();
				self.setFile(event.target.files[0]);
			});

		
	
		}		
		
		// Define the widget
		$.widget("mobile.imagepicker", $.mobile.widget, widget);

		// taking into account of the component when creating the window
		// or at the create event
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role=imagepicker)", e.target).imagepicker();
		});


	});


})();
