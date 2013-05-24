

(function() {

	var modules = [
		'jquery', 
		'text!pages/settings.html', 
		'less!pages/settings', 
		'components/modal',
		'components/listbox',
		'pages/categories'
	];

	define(modules, function($, html) {
		
	    function doModal(options) {
	
    	    var _elements = {};
    	    var _modal = null;
    	    var _gopher = new Gopher();
    	    var _info = null;
    	    var _patterns = null;
    	    
			var _defaults = {
			};
	
			var _options = $.extend({}, _defaults, options);
			
			
			function enableEscKey() {

	            _elements.html.on('keydown', function(event) {
	                if (event.keyCode == 27)
	                	_modal.close();
	            });
	            
	        };
			
			function enableClickSaveCompanyData() {
    	      
    	        _elements.saveButton.click(function() {
                    chill();
                            	        
        	        var request = _gopher.request('PUT', 'settings/app/contact', _info);
        	        
        	        request.done(function(){
            	        _modal.close();
        	        });
    	        });
	        };

            function fill() {
	    	    if (_info.name)
	    	        _elements.name.val(_info.name);

	    	    if (_info.phone)
	    	        _elements.phone.val(_info.phone);

	    	    if (_info.email)
	    	        _elements.email.val(_info.email);

	    	    if (_info.address)
	    	        _elements.address.val(_info.address);

	    	    if (_info.webpage)
	    	        _elements.webpage.val(_info.webpage);
            }	        
            
            function chill() {
                _info.name = _elements.name.val();
                _info.phone = _elements.phone.val();
                _info.email = _elements.email.val();
                _info.address = _elements.address.val();
                _info.webpage = _elements.webpage.val();
            }
            
            function loadUsers() {
    			var request = _gopher.request('GET', 'users');
    			
    			request.done(function(users) {
    			    _elements.users.listbox('reset');
    			    _elements.users.listbox('add', users);
    			});
            }


            function loadCategories() {
    			var request = _gopher.request('GET', 'categories');
    			
    			request.done(function(categories) {
    			    _elements.categories.listbox('reset');
    			    _elements.categories.listbox('add', categories);
    			});
            }
            	        
            
            function prepareAppearanceTab() {
	        	var name = $('.desktop').css('background-image');
	        	var patt = /\"|\'|\)/g;
            }
	        
	        function initCategories() {

    	        var listbox = null;

        		Notifications.on('category-added.settings', function(category) {
                    listbox.add(category);
        		});

	    	    _elements.categories.listbox({
    	    	    columns: ['name', 'description'],
    	    	    add: add,
    	    	    remove: remove,
    	    	    click: click
    	        });

                // Get the listbox object    	        
    	        var listbox = _elements.categories.listbox();
    	        
    	        function add() {
        	        require('pages/categories')();
    	        }
    	        
    	        function remove() {
        	         var index = listbox.index();
        	         
        	         if (index >= 0) {
            	         var item = listbox.item(index);
            	         
            	         Model.Categories.remove(item).done(function() {
                	         listbox.remove(index);
            	         });
            	         
        	         }
    	        }
    	        
    	        function click() {
        	        console.log("--> %d", listbox.index());
    	        }

    			var request = _gopher.request('GET', 'categories');
    			
    			request.done(function(categories) {
    			    listbox.reset();
    			    listbox.add(categories);
    			});
    	        
	        }
	        

	        function init() {
	        	var request;
	            
    			request = _gopher.request('GET', 'settings/app/contact');
    			
    			request.done(function(info) {
                    _info = info ? info : {};

    	            _elements.html = $(html);

    	            _modal = new Modal({
    	                title: 'Inställningar',
    	                content:_elements.html
    	            });      

                    // Remove all my notifications when the element is destroyed
                    _elements.html.on('removed', function() {
                        console.log('Removed notifications on settings');
                        Notifications.off('.settings');
                    });
    	           
    	            _elements.saveButton = _elements.html.find('.ok-button');
    	    	    _elements.name = _elements.html.find('.name');
    	    	    _elements.phone = _elements.html.find('.phone');
    	    	    _elements.email = _elements.html.find('.email');
    	    	    _elements.address = _elements.html.find('.address');
    	    	    _elements.webpage = _elements.html.find('.webpage');
    	    	    _elements.users = _elements.html.find('.users');
    	    	    _elements.categories = _elements.html.find('.categories');
    
    	    	    
    	    	    _elements.html.find('.foo').on('click', function(){
        	    	    var foo = _elements.html.find('.user-data');
        	    	     
        	    	    if (foo.is(":visible"))   
            	    	    foo.slideUp('fast');
            	    	  else
            	    	    foo.slideDown('fast');
    	    	    });
    	    	    
    	            
    	    	    _elements.users.listbox({columns: ['name', 'email']});
    	    	    initCategories();
    	    	    loadUsers();

    	    	    fill();
    	    	    
     	    	    _elements.html.find('.foo').on('click', function(){
        	    	    var foo = _elements.html.find('.user-data');
        	    	     
        	    	    if (foo.is(":visible"))   
            	    	    foo.slideUp('fast');
            	    	  else
            	    	    foo.slideDown('fast');
    	    	    });
    	    	    
	         		// Get patterns for Appearance-tab
	        		request = Model.Patterns.fetch();
	                
	                request.done(function(patterns) {
	        	        _patterns = patterns;
	        	        var fullPath = $('.desktop').css('background-image');
						var patt = /\"|\'|\)/g;
					    var activePatternName = fullPath.split('/').pop().replace(patt,'');
	
	        	        for (var index = 0; index < _patterns.length; index++) {
	            	        
			        	    var image = sprintf('images/patterns/%s',_patterns[index].image);
			    			var img = $('<img class="img-pattern"/>').attr('src', image).appendTo('.pattern-well');
	
			    			
			    			if (activePatternName == _patterns[index].image) {
			    				img.addClass('img-active');
								$('.pattern-sample').css('background-image', 'url(' + image + ')');
							}
	
			    			img.on(isTouch() ? 'touchstart' : 'mousedown', function(event){
			    			     _elements.html.find('.img-pattern').removeClass('img-active');
			    			     $(this).addClass('img-active');
			    			     
			    			     // Preview the choosen pattern
			    			     $('.pattern-sample').css('background-image', 'url(' + $(this).attr('src') + ')');
			    			     
			    			     event.stopPropagation();
								 event.preventDefault();
								 
			    			});
			    			
	        	        }
	        	        
        	        	// Avoid img:s to be dragged
					    $('.not-draggable').on(isTouch() ? 'touchstart' : 'mousedown', function(event) {		
			                event.stopPropagation();
							event.preventDefault();
						});
	        	                            
	                });    	        

    	            _modal.show();
    	      	    _elements.name.focus();
    
    	      	    enableEscKey();
    	            enableClickSaveCompanyData();
    	            
        		});
        		
        		

	        }	  
	        
	        init();
	
		}
		
		return doModal;
	
	});

	
})()


