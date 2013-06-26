

(function() {

	var dependencies = [
		'less!./rental',
		'components/imagepicker'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _rental = {};
            var _icons = [];
            var _iconsByID = {};
            var _icon = null;
            
            function fill() {
                _elements.name.val(_rental.name);
                _elements.description.val(_rental.description);
                
                if (_icon)
                    _elements.icon.image.attr('src', sprintf('../images/symbols/%s', _iconsByID[_icon.id].image));
            }
            
            function chill() {
                _rental.name = _elements.name.val();
                _rental.description = _elements.description.val();
                
                if (_icon) {
                    _rental.icon_id = _icon.id;
                }

            }
            
            
	        function init() {
    	        _page.hookup(_elements);
    	        
    	       if ($.mobile.pageData && $.mobile.pageData.rental) {
        	       _rental = $.mobile.pageData.rental;

        	       if (_rental.icon_id) {
            	       _icon = _iconsByID[_rental.icon_id];
        	       }
    	       }

    	       if (!_rental.id)
    	       	   _elements.remove.addClass('hidden');
    	       	   
    	       fill();

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });


	           _elements.remove.on('tap', function(event) {
	           	
		           var request = Model.Rentals.remove(_rental);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });

	           _elements.save.on('tap', function(event) {
	           	
    	           chill();
		           
		           var request = Model.Rentals.save(_rental);
		           
		           request.done(function() {
			           $.mobile.popPage();
		           });
	           });
	           
	           _elements.icon.button.on('tap', function(event) {

		            var options = {
				        dismissible : true,
				        //theme : "a",
				        //overlyaTheme : "a",
				        transition : "pop",
				        positionTo: $(this)
		            };


                   var click = function(index) {

                        _elements.popup.popup('close');

                        _icon = _icons[index];
                        _elements.icon.image.attr('src', sprintf('../images/symbols/%s', _iconsByID[_icon.id].image));
                        
                    };
                    
                    var picker = new ImagePicker({
                        icons: _icons,
                        click: click
                    }); 
                    		            
                    var html = picker.html();

                    _elements.popup.empty();
                    _elements.popup.append(picker.html());
                    _elements.popup.trigger('create');
                    _elements.popup.popup(options);
                    _elements.popup.popup('open');
                    
                    picker.isotope({ filter: '*' });

	           });
    	           
    	        
	        }	  

	        if (true) {
                var request = Model.Icons.fetch();
                
                request.done(function(icons){
        	        _icons = icons;
        	        
        	        $.each(icons, function(index, icon) {
            	        _iconsByID[icon.id] = icon;
        	        });

        	        init();
                    
                });    	        
	        }
		}

    	$(document).delegate("#rental-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

