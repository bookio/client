

(function() {

    var dependencies = [
        'less!./test.less'
    ];


    define(dependencies, function() {
        
        function Module(page) {
            
            var _page = page;
            var _elements = {};
            var _file = null;

                  
            function displayImage(file) {
                var reader = new FileReader();
                
                _elements.dropzone.container.spin('large');
                _elements.dropzone.text.addClass('hidden');
                
                // Closure to capture the file information.
                reader.onload = (function(file) {
                    return function(event) {
                        _elements.dropzone.container.spin(false);
                        _elements.dropzone.image.attr('src', event.target.result);

                        _file = file;
                    };
                })(file);
                
                // Read in the image file as a data URL.
                reader.readAsDataURL(file);            
            }
            
            
            function init() {

                _page.hookup(_elements);

                _elements.back.on('tap', function(event) {
                    $.mobile.popPage();
                });

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

        $(document).delegate("#test-page", "pageinit", function(event) {
            new Module($(this));
        });

        
    
    });

    
})();
