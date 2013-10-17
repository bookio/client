

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
            var _categories = [];
            var _categoriesByID = {};
            
            _page.hookup(_elements);
            
            function fill() {
                _elements.name.val(_rental.name);
                _elements.description.val(_rental.description);
                _elements.depth.val(_rental.depth && _rental.depth > 1 ? _rental.depth : '1');
                _elements.available.val((_rental.available == 1 || _rental.available == undefined) ? 'on' : 'off').slider("refresh");

                if (_rental.category_id) {
                    var category = _categoriesByID[_rental.category_id];
                    
                    if (category)
                    	$("div.ui-input-search").find("input").val(category.name);
                    else
                    	_rental.category_id = null;	
                }
                
                if (_rental.icon_id) {
                    var icon = _iconsByID[_rental.icon_id];
                    
                    if (icon)
                        _elements.icon.image.attr('src', sprintf('../images/symbols/%s', icon.image));
                }
                else {
                    var icon = _icons[0];
                    _elements.icon.image.attr('src', sprintf('../images/symbols/%s', icon.image));
                    
                }
            }
            
            function chill() {
                _rental.name = _elements.name.val();
                _rental.description = _elements.description.val();
                _rental.depth = _elements.depth.val();
                _rental.available = (_elements.available.val() == 'on') ? 1 : 0;
                
                var categoryName = $("div.ui-input-search").find("input").val();
                            	               
                if (!_rental.icon_id)
                	// Set to generic 'cube' if no icon chosen
                	_rental.icon_id = 8;
                
                if (!_rental.depth)
                    _rental.depth = 1;

            }
            
            
            function init() {
                
               _elements.content.transition({opacity:1}, 1000);
               
               if ($.mobile.pageData && $.mobile.pageData.rental) {
                   $.extend(_rental, $.mobile.pageData.rental);
               }

               if (!_rental.id)
                   _elements.remove.addClass('hidden');
                   
               fill();

               _elements.back.on('tap', function(event) {
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
                    
                    if (!_rental.name) {
                        Notify.show('Ange ett namn.');
                        return;
                    }

                    if (!_rental.icon_id) {
                        Notify.show('Välj en symbol.');
                        return;
                    }

                    $('body').spin('large');


					var requestCategory;
					var requestRentals;
					var categoryName = $("div.ui-input-search").find("input").val().toLowerCase();
                    var existingCategory = false;
                                                                               
                    
                    // Check if category exists, if not we should create a new one
                    if (categoryName.length > 0) {
	                    _elements.category.listview.find("li").each(function() {
	                    	if (categoryName == $(this).text().toLowerCase()) {
	                    		_rental.category_id = $(this).find('a').attr("id");
	                    		existingCategory = true;
	                    		return false;
	                    	}
	                    });
					}
					else {
						// Avoid saving 'empty string'
						_rental.category_id = null;
						existingCategory = true; 
					}
					
						
                    if (existingCategory) {
                    	requestRentals = Model.Rentals.save(_rental);
                    
	                    requestRentals.always(function() {
	                        $('body').spin(false);
	                    });
	                    
	                    requestRentals.done(function() {
	                        $.mobile.popPage();
	                    });
					}
					else {
                    	var category = {};
                    	
                    	category.name = $.camelCase(categoryName);

                    	requestCategory = Model.Categories.save(category);
						
						requestCategory.done(function(category) {
							_rental.category_id = category.id;
							requestRentals = Model.Rentals.save(_rental);
							
		                    requestRentals.always(function() {
		                        $('body').spin(false);
		                    });
		                    
		                    requestRentals.done(function() {
		                        $.mobile.popPage();
		                    });
						});						
						
					}
                                        						
               });
               
			   
			   _elements.category.listview.on('tap', 'li', function () {
				   event.preventDefault();
				   _rental.category_id = $(this).find('a').attr("id");
				   var that = this;
				   
			       $("div.ui-input-search").find("input").val(function(i, currentValue) {
					   		return $(that).find('a').html();
					   }).trigger('keyup');
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

                        _rental.icon_id = _icons[index].id;
                        _elements.icon.image.attr('src', sprintf('../images/symbols/%s', _iconsByID[_rental.icon_id].image));
                        
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
            
                $('body').spin("large");

                var icons = Model.Icons.fetch();
                var categories = Model.Categories.fetch();
                
                icons.done(function(icons) {
                    _icons = icons;
                    
                    $.each(icons, function(index, icon) {
                        _iconsByID[icon.id] = icon;
                    });
                    
                });
                
               var html = "";
			   _elements.category.listview.html("");
              
                categories.done(function(categories) {
                    _categories = categories;
                    
                    $.each(categories, function(index, category) {
                        _categoriesByID[category.id] = category;
                        					
                        // Build listview drop down with 'categories'
                        html += "<li class='ui-screen-hidden' data-icon='false'><a id='" + category.id + "' href='#'>" + category.name + "</a></li>";
						_elements.category.listview.html(html);
						_elements.category.listview.listview("refresh");
						
                    });
                    
                });
                

                $.when(icons, categories).then(function() {
                    init();
                    
                    $('body').spin(false);
                    
                });
                
            }
        }

        $(document).delegate("#rental-page", "pageinit", function(event) {
            new Module($(event.currentTarget));
        });
        
    
    });

    
})();

