

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
                _elements.depth.val(_rental.depth && _rental.depth > 1 ? _rental.depth : '');
                _elements.available.val(_rental.available).slider("refresh");

                if (_rental.category_id) {
                    var category = _categoriesByID[_rental.category_id];
                    
                    if (category)
                        _elements.category.text.text(category.name);
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
                _rental.available = _elements.available.val();
                
                if (!_rental.category_id)
                    _rental.category_id = null;
                    
                if (!_rental.icon_id)
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
                    
                    if (!_rental.name) {
                        Notify.show('Ange ett namn.');
                        return;
                    }

                    if (!_rental.icon_id) {
                        Notify.show('Välj en symbol.');
                        return;
                    }

                                                           
                    $('body').spin('large');
                       
                    var request = Model.Rentals.save(_rental);
                    
                    request.always(function() {
                        $('body').spin(false);
                    });
                    
                    request.done(function() {
                        $.mobile.popPage();
                    });
               });
               
                _elements.category.button.on('tap', function(event) {

                    var listview = $('<ul data-role="listview" data-inset="true" data-theme="c"></ul>');

                    $.each(_categories, function(index, category) {

                        var template = 
                            '<div>'+
                                '<li data-hook="item" data-icon="false">'+
                                    '<a data-hook="link" href="#">'+
                                        '<h3 data-hook="text">'+
                                        '</h3>'+
                                    '</a'+
                                '</li>'+
                            '</div>';
                            
                        var elements = {};
                        $(template).hookup(elements);
                        
                        elements.text.text(category.name);
                        elements.link.data('category', category);

                        elements.link.on('tap', function(event) {
                        
                            var category = $(this).data('category');

                            _rental.category_id = category.id;
                            
                            _elements.category.text.text(category.name);
                            _elements.popup.popup('close');
                        });
                                            
                        listview.append(elements.item);
                    });
                    
                    var options = {
                        dismissible : true,
                        theme : "c",
                        overlyaTheme : "a",
                        transition : "pop",
                        positionTo: _elements.category.button
                    };

                    
                    _elements.popup.empty();
                    _elements.popup.append(listview);
                    _elements.popup.trigger('create');
                    _elements.popup.popup(options);
                    _elements.popup.popup('open');
                   
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
                
                categories.done(function(categories) {
                    _categories = categories;
                    
                    $.each(categories, function(index, category) {
                        _categoriesByID[category.id] = category;
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

