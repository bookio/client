

(function() {

    var dependencies = [
       'css!./category',
		'../../widgets/imagepicker/imagepicker'
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
                    _elements.dropzone.imagepicker('setImage', _category.image);
                
            }
            
            function chill() {
                _category.name = _elements.name.val();
                _category.description = _elements.description.val();
                _category.available = (_elements.available.val() == 'on') ? 1 : 0;
                
				_category.image = _elements.dropzone.imagepicker('getImage');
            }
            
                  
            function init() {
                _page.hookup(_elements, 'data-id');
                
               if ($.mobile.pageData && $.mobile.pageData.category) {
                   $.extend(_category, $.mobile.pageData.category);
               }

                if (!_category.id)
                    _elements.remove.addClass('hidden');
                   
                fill();

                _elements.back.on('tap', function(event){
                   $.mobile.pages.pop();
                });

                _elements.remove.on('tap', function(event) {
                
                	function remove() {
                	
	                	var request = Model.Categories.remove(_category);

	                    request.done(function() {
	                       $.mobile.pages.pop();
	                    });
	                	
                	}
                	
                	MsgBox.show({
	                	message: 'Är du säker på att du vill ta bort denna kategori?',
	                	icon: 'warning',
	                	buttons: [
	                		{text: 'Ja', click: remove},
	                		{text: 'Nej'}
	                	]
                	});
                });

                _elements.save.on('tap', function(event) {
                
                    chill();

                    var request = Model.Categories.save(_category);
                   
                    request.done(function() {
                        $.mobile.pages.pop();
                    });
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
                
                
            }     

            init();
        }

        $(document).delegate("#category-page", "pageinit", function(event) {
            new Module($(event.currentTarget));
        });
        
    
    });

    
})();

