

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
            
            function fill() {
                _elements.name.val(_rental.name);
                _elements.description.val(_rental.description);
            }
            
            function chill() {
                _rental.name = _elements.name.val();
                _rental.description = _elements.description.val();
                _rental.icon_id = 39;
            }
            
	        function init() {
    	        _page.hookup(_elements);
    	        
    	       if ($.mobile.pageData && $.mobile.pageData.rental) {
        	       _rental = $.mobile.pageData.rental;
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
                        alert(index);
                        _elements.popup.popup('close');
                        //picker.hide();
                        //_elements.icon.attr('src', pathForImage(_icons[index].image));
                        //_rental.icon_id = _icons[index].id;
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
        	        
        	        /*
        	        for (var index = 0; index < _icons.length; index++) {
            	        var icon = _icons[index];
            	        _iconHash[icon.id] = icon;
        	        }
        	        */
        	        init();
                    
                });    	        
	        }
		}

    	$(document).delegate("#rental-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

