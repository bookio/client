

(function() {

    var dependencies = [
        'css!./rental',
        '../../components/imagepicker/imagepicker'
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
            
            _page.hookup(_elements, 'data-id');
            
            function fill() {
            }
            
            function chill() {
            }
            
            
            function init() {
                
               _elements.content.transition({opacity:1}, 1000);
               

               _elements.symbolpicker.symbolpicker('symbols', _icons);
               
               _elements.symbolpicker.on('symbolselected', function(event, symbol) {
	               console.log(symbol);
               });
               /*
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
                        _elements.icon.image.attr('src', sprintf('../../images/symbols/%s', _iconsByID[_rental.icon_id].image));
                        
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
               */
               
            }     

            if (true) {
            
                var icons = Model.Icons.fetch();
                
                icons.done(function(icons) {
                    _icons = icons;
                    
                    $.each(icons, function(index, icon) {
                        _iconsByID[icon.id] = icon;
                    });
                    
                    init();
                    
                });
                
                
            }
        }

        $(document).delegate("#test-page", "pageinit", function(event) {
            new Module($(event.currentTarget));
        });
        
    
    });

    
})();

