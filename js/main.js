
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
		var transitions = {};

		
		$(document).bind("pagebeforechange", function(event, data) {
		    $.mobile.pageData = (data && data.options && data.options.pageData) ? data.options.pageData : null;
		}); 
		
		$(document).on("pagebeforeload", function(event, params) {
			console.log("pagebeforeload: %s", params.absUrl);
		    //pages.push(params.dataUrl);
		    
		});


		$(document).on("pagebeforecreate", function(event, params) {
			console.log("pagebeforecreate");
		});
    	
    	$(document).delegate("[data-role=page]", "pagebeforeshow", function(event) {

			console.log("page.pagebeforeshow");
        });

		$(document).on("pagebeforeshow", function(event, params) {

    		var found = false;
    		
    		$.each(pages, function(index, page){
        		if (page == event.currentTarget.baseURI)
        		    found = true;
    		});
    		
    		if (!found) {
    		    pages.push(event.currentTarget.baseURI);
    			console.log("pagebeforeshow: page '%s' pushed", event.currentTarget.baseURI);
        		
    		}
		});
		
		$.mobile.pushPage = function(page, options) {
		
    		var u = $.mobile.path.parseUrl(page );

		    var pageoptions = {
		        changeHash:false,
		        transition:'slide',
		        showLoadMsg:true
		    };
		
		    $.extend(pageoptions, options);
		
		    $.mobile.changePage(page, pageoptions);
		} 

		$.mobile.gotoPage = function(page, options) {
		
            pages = [];
            $.mobile.pushPage(page, options);
		} 


        $.mobile.popPage = function() {

	        if (pages.length > 0) {
	            pages.pop();
	            
	            if (pages.length > 0) {
	                console.log("Trying to load page '%s'", pages[pages.length-1]);
	                $.mobile.changePage(pages[pages.length-1], {reverse:true});
	            }
	        }
        } 
  

        if (Gopher.authorization.length == 0)
	        $.mobile.pushPage('pages/login.html', {showLoadMsg:true, changeHash:false, transition:'fade'});
        else {
    	    console.log('Session ID: %s', Gopher.authorization);
    	    $.mobile.pushPage('pages/main.html', {showLoadMsg:true, changeHash:false, transition:'fade'});
        }
    
    });
  

})();


