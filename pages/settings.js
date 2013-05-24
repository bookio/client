

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
    	    var _activePatternName;
    	    
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
    	        	
    	        	var choosenPatternPath = _elements.html.find('.img-active').attr('src');
    				var patt = /\"|\'|\)/g;
	    	        var choosenPatternName = choosenPatternPath.split('/').pop().replace(patt,'');
	        	
    	        	if (choosenPatternName != _activePatternName) {
	    	        	$('.desktop').css('background-image', 'url(' + choosenPatternPath + ')');
	    	        	
	    	        	// Should be set here when _settings is global
	    	        	// _settings.background = choosenPatternName;
    	        	}
    	        
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

	    	    var listbox = _elements.categories.listbox({
    	    	    columns: [
    	    	        {name:'name', display:'Namn', width:'20%'},
    	    	        {name:'description', display:'Beskrivning'}
    	    	    ],
    	    	    add: add,
    	    	    remove: remove,
    	    	    click: click,
    	    	    dblclick: dblclick
    	        }).listbox('api');


        		Notifications.on('category-added.settings', function(category) {
                    listbox.add(category);
                    listbox.index(listbox.count() - 1);
        		});

        		Notifications.on('category-updated.settings', function(category) {

            		var count = listbox.count();
            		
            		for (var i = 0; i < count; i++) {
                		var item = listbox.item(i);
                		
                		if (item.id == category.id) {
                    		listbox.item(i, item);
                		}
            		}

        		});

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
    	        
    	        function dblclick() {
        	        require('pages/categories')({
            	        category: listbox.item(listbox.index())
        	        });
    	        }

    	        function click() {
    	        }

    			var request = Model.Categories.fetch();
    			
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
    	    	    
    	            
    	    	    _elements.users.listbox({
        	    	    columns: [
        	    	        {name:'name', display:'Namn', width:'20%'},
        	    	        {name:'email', display:'E-post'}
        	    	    ]
    	    	    });
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
	        	        
	        	        var activePatternPath = $('.desktop').css('background-image');
						var patt = /\"|\'|\)/g;
					    _activePatternName = activePatternPath.split('/').pop().replace(patt,'');
					    
					    // Show all patterns below preview DIV
	        	        for (var index = 0; index < _patterns.length; index++) {
			        	    var samplePatternPath = 'images/patterns/' + _patterns[index].image;
			    			var img = $('<img class="img-pattern"/>').attr('src', samplePatternPath).appendTo('.pattern-well');
	
			    			if (_activePatternName == _patterns[index].image) {
			    				img.addClass('img-active');
								$('.pattern-sample').css('background-image', 'url(' + samplePatternPath + ')');
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
	        	        
        	        	// Avoid img in preview DIV to be dragged
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


