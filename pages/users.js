

(function() {

	var dependencies = [
		'css!./users'
	];

	define(dependencies, function() {
		
		
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
                    
                var li = $(template);


                li.find('h2').text(item.name ? item.name : item.username);
                li.find('p').text(item.email);
                
                li.find('a').on('tap', function(event) {

                    $.mobile.pushPage('user.html', {
                    	pageData:{user:item}, 
                    	transition:'slide',
                    	require: 'user'
                    });
                    
                    event.preventDefault();
                    event.stopPropagation();
                });
                
                _page.find('ul').append(li);
                
            }
            
            
            function load() {
    	       var request = Gopher.request('GET', 'users');
    	        
    	       request.done(function(users) {

        	       _elements.listview.empty();

        	       $.each(users, function(index, user) {
            	       addItem(user);
        	       });
        	        
        	       _elements.listview.listview('refresh');

    	       });
    	        
                
            }
            
            
	        function init() {

	           _page.hookup(_elements, 'data-id');

	           _elements.back.on('tap', function(event){
		           $.mobile.popPage();
	           });
	           
	           _elements.add.on('tap', function(event){
                    $.mobile.pushPage('user.html', {
                    	pageData:{}, 
                    	transition:'slide',
                    	require: 'user'
                    });
	           });
	           
	           load();
	        }	  

	        init();
		}

    	$(document).delegate("#users-page", "pageinit", function(event) {
        	new Module($(this));
        });

		
	
	});

	
})();
