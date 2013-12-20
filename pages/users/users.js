

(function() {

	var dependencies = [
		'i18n!./users.json',
		'css!./users'
	];

	define(dependencies, function(i18n) {
		
		
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

                    $.mobile.pages.push('../user/user.html', {
                    	params:{user:item}
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
	           
	           _page.i18n(i18n);

	           _elements.back.on('tap', function(event){
		           $.mobile.pages.pop();
	           });
	           
	           _elements.add.on('tap', function(event){
                    $.mobile.pages.push('../user/user.html');
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
