

(function() {

	var dependencies = [
		'./add',
		'../main'
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
            function addItem(item) {
                var template = 
                    '<li>'+
                        '<a href="">'+
                            '<h2></h2>'+
                            '<p></p>'+
                        '</a>'+
                    '</li>';
                    
                var row = $(template);

                row.data('item', item);
                
                updateRow(row);
                
                row.find('a').on('tap', function(event) {

                    var parameters = {};
                    parameters.item = item;
                    
                    $.mobile.pushPage("./add.html", {pageData:parameters});

                    event.preventDefault();
                    event.stopPropagation();
                });
                
                _page.find('ul').append(row);
                
            }
            
            function updateRow(row) {
                var item = row.data('item');
                row.find('h2').text(item.name);
                row.find('p').text(item.description);
            }

            function refreshListView() {
                _elements.listview.listview('refresh');
            }
        
            
            function enableListeners() {
                Notifications.on('rental-added.rentals', function(rental) {
                    addItem(rental);
                    refreshListView();
                    
                });

               Notifications.on('rental-updated.rentals', function(rental) {

                    _elements.listview.find('li').each(function() {
                        var item = $(this).data('item');
                        
                        if (item.id == rental.id) {
                            updateRow($(this));
                        }
                    });
               });

               Notifications.on('rental-removed.rentals', function(rental) {

                    _elements.listview.find('li').each(function() {

                        var item = $(this).data('item');
                        
                        if (item.id == rental.id) {
                            $(this).remove();
                        }
                    });
               });

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });

    	        _elements.add.on('tap', function() {
	    	        $.mobile.pushPage('./add.html');
    	        });
    	        
	           //_elements.main.on('tap', function(event) {
		       //    $.mobile.pushPage('../main.html', {transition:'fade'});
	           //});
	           
    	       _page.on('remove', function() { 
        	        alert('removed!');
                    Notifications.off('.rentals');        	        
    	       });
            }
            
	        function init() {
    	        _page.hookup(_elements);
    	        
    	        
    	        var request = Gopher.request('GET', 'rentals');
    	        
    	        request.done(function(rentals) {

        	        _elements.listview.empty();

        	        $.each(rentals, function(index, rentals) {
            	        addItem(rentals);
        	        });
        	        
                    refreshListView();
                    enableListeners();
                            	        

    	        });
    	        
	        }	  

	        init();
		}

    	$(document).delegate("#rentals", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

