
requirejs.config({
    paths: {
        'pages': '../pages',
        'js': '../js',
        'scripts': '../js',
        'lib': '../lib',
        'components': '../components'
    },
	packages: [
	  {
	    name: 'css',
	    location: '../lib/require-css',
	    main: 'css'
	  },
	  {
	    name: 'less',
	    location: '../lib/require-less',
	    main: 'less'
	  },
	  {
	    name: 'text',
	    location: '../lib/require-text',
	    main: 'text'
	  }
	],

	waitSeconds: 30
});


(function() {

    var modules = [
        'js/sprintf',
        'js/gopher',
        'js/model',
        'js/date',
        'pages/page-1',
        'pages/rentals/list',
        'pages/login',
        'pages/main',
        'pages/switch'
    ];

		

    require(modules, function() {
		
		var pages = [];
		var pageOptions = {};
		var popping = false;

		
		$(document).bind("pagebeforechange", function(event, data) {
		}); 
		
		$(document).on("pagebeforeload", function(event, params) {
			console.log("pagebeforeload: %s", params.absUrl);
		    //pages.push(params.dataUrl);
		    
		});


		$(document).on("pagebeforecreate", function(event, params) {
			console.log("pagebeforecreate");
		});

		$(document).on("pagebeforechange", function(event, params) {
		

    		console.log("pagebeforechange %s", params.absUrl);
    		//console.log(params);

		    $.mobile.pageData = (params && params.options && params.options.pageData) ? params.options.pageData : null;

		    pageOptions[params.absUrl] = params;
		    
		    return;
		    
            if (params.options.role && params.options.role == "popup")
                return;

    		if (popping)
    		    return;

    		var found = false;
    		
    		$.each(pages, function(index, page){
        		if (page == params.absUrl)
        		    found = true;
    		});
    		
    		if (!found) {
    		    pages.push(params);
    		    //pageOptions[params.absUrl] = params.options;
    		}
    		  
		});

		$(document).on("pagebeforeshow", function(event, params) {

    		    
    		var found = false;
    		if (popping)
                return;
    		$.each(pages, function(index, page){
        		if (page.absUrl == event.currentTarget.baseURI)
        		    found = true;
    		});
    		
    		if (!found) {
    		    pages.push(pageOptions[event.currentTarget.baseURI]);
    		}
		});

		$.mobile.pushPage = function(page, pageData) {
		
		    var options = {
		        changeHash:false,
		        transition:'fade',
		        showLoadMsg:false
		    };
		    
		    if (pageData)
		        options.pageData = pageData;
		    
		    if (pages.length > 1)
		        options.transition = 'slide';
		
		    $.mobile.changePage(page, options);
		} 

		$.mobile.gotoPage = function(page, pageData) {
		
            pages = [];
            $.mobile.pushPage(page, pageData);
		} 


        $.mobile.popPage = function() {

	        if (pages.length > 0) {
                var thisPage = pages[pages.length-1];
                
	            pages.pop();
	            
                if (pages.length > 0) {
                    var nextPage = pages[pages.length-1];

                    var options = {}; //pageOptions[url];
                    
	                options.reverse = true;
	                options.transition = thisPage.options.transition;
	                options.popping = true;
	                
	                popping = true;
                    $.mobile.changePage(nextPage.absUrl, options);
	                popping = false;
	            }
	        }
        } 
  
        window.history.back = $.mobile.popPage;

        if (Gopher.authorization.length == 0)
	        $.mobile.gotoPage('pages/login.html');
        else {
    	    console.log('Session ID: %s', Gopher.authorization);
    	    $.mobile.gotoPage('pages/main.html');
        }
    
    });
  

})();


