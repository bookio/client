

(function() {

	var dependencies = [
	   'pages/category',
	   'less!./categories.less'
	];

	define(dependencies, function() {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
            
            function addItem(item) {
                var template = 
                    '<li>'+
                        '<a href="">'+
                            '<img class="ui-li-thumb">'+
                            '<h2></h2>'+
                            '<p></p>'+
                        '</a>'+
                    '</li>';
                    
                var row = $(template);

                row.data('item', item);
                
                updateRow(row);
                
                row.find('a').on('tap', function(event) {

                    $.mobile.pushPage("category.html", {pageData:{category:item}, transition:'slide'});
                    
                    event.preventDefault();
                    event.stopPropagation();
                });
                
                _page.find('ul').append(row);
                
            }            

            function updateRow(row) {
                var item = row.data('item');
                row.find('h2').text(item.name);
                row.find('p').text(item.description);
                row.find('img').attr('src', item.image ? Cloudinary.imageURL(item.image, {width:100, height:100, crop:'fit'}) : '../images/app-icon.png');
            }

            function refreshListView() {
                _elements.listview.listview('refresh');
            }
        
            
            function enableListeners() {
                Notifications.on('category-added.categories', function(category) {
                    addItem(category);
                    refreshListView();
                    
                });

               Notifications.on('category-updated.categories', function(category) {

                    _elements.listview.find('li').each(function() {
                        var item = $(this).data('item');
                        
                        if (item.id == category.id) {
                            updateRow($(this));
                            refreshListView();
                        }
                    });
               });

               Notifications.on('category-removed.categories', function(category) {

                    _elements.listview.find('li').each(function() {

                        var item = $(this).data('item');
                        
                        if (item.id == category.id) {
                            $(this).remove();
                            refreshListView();
                        }
                    });
               });

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });

    	       _page.on('remove', function() { 
                    Notifications.off('.categories');        	        
    	       });
            }
            
            
            
            function load() {
    	       var request = Model.Categories.fetch();
    	        
    	       request.done(function(categories) {

        	       _elements.listview.empty();

        	       $.each(categories, function(index, category) {
            	       addItem(category);
        	       });
        	        
        	       _elements.listview.listview('refresh');

    	       });
    	        
                
            }
            
            
	        function init() {

	           _page.hookup(_elements);

	           
	           enableListeners();
	           load();
	        }	  

	        init();
		}

    	$(document).delegate("#categories-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
