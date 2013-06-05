

(function() {

	var dependencies = [
		'./search',
	];

	define(dependencies, function(html) {
		
		
	    function Module(page) {
            
            var _page = page;
            var _elements = {};
            
            function additem(category) {
                var template = 
                    '<li>'+
                        '<a href="">'+
                            '<h2></h2>'+
                            '<p></p>'+
                        '</a>'+
                    '</li>';
                    
                var li = $(template);


                li.find('h2').text(category.name);
                li.find('p').text(category.description);
                
                li.find('a').on('tap', function(event) {


                    $.mobile.pushPage("search.html", {pageData:category});
                    
                    event.preventDefault();
                    event.stopPropagation();
                });
                
                _page.find('ul').append(li);
                
            }
            
	        function init() {
			var opts = {
			  lines: 12, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  color: '#000', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'the-spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px,

			};

			opts.radius = Math.floor(40 * 0.234);
			opts.length = Math.floor(40 * 0.169);
			opts.width = Math.floor(40 * 0.1);

    	       _page.hookup('data-id', _elements);
    	        

    	       $('body').spin("large");

    	       function load() {
        	       var request = Gopher.request('GET', 'categories');
        	        
        	       request.done(function(categories) {
    
            	        $.each(categories, function(index, category) {
                	        additem(category);
            	        });
            	        
            	        _elements.listview.listview('refresh');
    
            	        $('body').spin(false);
    
        	       });
        	        
    	           console.log("Loading categories");
        	       
    	       }
    	       
    	       setTimeout(load, 1000);

	        }	  

	        init();
		}

    	$(document).delegate("#mobile-select-category-page", "pageinit", function(event) {
        	new Module($(event.currentTarget));
        });
		
	
	});

	
})();

