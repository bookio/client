

(function() {

    var dependencies = [
       'css!pages/category'
    ];

    define(dependencies, function(html) {
        
        
        function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _category = {};
            var _file = null;
            
            function fill() {
                _elements.name.val(_category.name);
                _elements.description.val(_category.description);
                _elements.available.val((_category.available == 1 || _category.available == undefined) ? 'on' : 'off').slider("refresh");
                
                if (_category.image)
                    _elements.dropzone.image.attr('src', Cloudinary.imageURL(_category.image, {crop:'fit', width:100, height:100}));
            }
            
            function chill() {
                _category.name = _elements.name.val();
                _category.description = _elements.description.val();
                _category.available = (_elements.available.val() == 'on') ? 1 : 0;
            }
            
                  
            function displayImage(file) {
                
                _elements.dropzone.container.spin('large');

                var request = Cloudinary.uploadImage(file);

                request.done(function(filename) {
                    _category.image = filename;
                    _elements.dropzone.image.attr('src', Cloudinary.imageURL(filename, {crop:'fit', width:100, height:100}));
                });

                request.always(function() {
                    _elements.dropzone.container.spin(false);
                });

            }            
            
            function init() {
                _page.hookup(_elements);
                
               if ($.mobile.pageData && $.mobile.pageData.category) {
                   $.extend(_category, $.mobile.pageData.category);
               }

                if (!_category.id)
                    _elements.remove.addClass('hidden');
                   
                fill();

                _elements.back.on('tap', function(event){
                   $.mobile.popPage();
                });

                _elements.remove.on('tap', function(event) {
                
                    var request = Model.Categories.remove(_category);
                   
                    request.done(function() {
                        if (_category.image) {
                            request = Cloudinary.deleteImage(_category.image);
                        
                            request.done(function() {
                                console.log('Image deleted');
                            });
                            request.fail(function() {
                                console.log('Image NOT deleted!!');
                            });
                            
                        }
                        

                       $.mobile.popPage();
                    });
                });

                _elements.save.on('tap', function(event) {
                
                    chill();

                    var request = Model.Categories.save(_category);
                   
                    request.done(function() {
                        $.mobile.popPage();
                    });
                });
               /*
               
                _elements.upload.on('tap', function(event) {
                
                    if (_file) {
                        var request = Cloudinary.uploadImage(_file);

                        _elements.dropzone.container.spin('large');
                        
                        request.done(function(filename) {
                            console.log(filename);
                            _elements.dropzone.image.attr('src', Cloudinary.imageURL(filename, {crop:'crop', width:1000, height:1000, gravity:'face'}));

                            request = Cloudinary.deleteImage(filename);
                            
                            request.done(function() {
                                debugger;
                            });
                            request.fail(function() {
                                debugger;
                            });
                        });

                        request.always(function() {
                            _elements.dropzone.container.spin(false);
                        });
                        
                    }

                });
                */
               
                _elements.dropzone.container.on('tap', function(event) {
                    _elements.file.click();    
                });

                _page.on('dragover', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.originalEvent.dataTransfer.dropEffect = 'none';
                });

                _page.on('drop', function(event) {
                    event.stopPropagation();
                    event.preventDefault();                    
                });
                
                _elements.dropzone.image.onload = function() {
                    _elements.dropzone.image.removeClass('hidden');    
                }
               
                _elements.dropzone.container.on('dragover', function(event) {

                    event.stopPropagation();
                    event.preventDefault();
                    
                    var files = event.originalEvent.dataTransfer.files;
                    
                    if (files.length > 0) {
                        switch (files[0].type) {
                            case 'image/jpeg':
                            case 'image/png':
                            case 'image/gif':
                                event.originalEvent.dataTransfer.dropEffect = 'copy';
                                break;
                            default:
                                event.originalEvent.dataTransfer.dropEffect = 'none';
                        }
                    }
                    
                });

                _elements.dropzone.container.on('drop', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    displayImage(event.originalEvent.dataTransfer.files[0]);
                });

                _elements.file.on('change', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    displayImage(event.target.files[0]);
                });;

               
                
            }     

            init();
        }

        $(document).delegate("#category-page", "pageinit", function(event) {
            new Module($(event.currentTarget));
        });
        
    
    });

    
})();

