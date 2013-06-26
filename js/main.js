
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
		var transitions = {};

		
		
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
		    return;
		    
		});


		$(document).on("pagebeforeshow", function(event, params) {

    		console.log("pagebeforeshow");
    		    
    		var found = false;
    		
    		if (popping)
                return;
                
    		$.each(pages, function(index, page){
        		if (page.absUrl == event.currentTarget.baseURI)
        		    found = true;
    		});
    		
    		if (!found) {
    		    pages.push(event.currentTarget.baseURI); //pageOptions[event.currentTarget.baseURI]);
    		}
		});


		
		$.mobile.pushPage = function(page, options) {

		
		    var defaults = {
		        changeHash:false,

		        transition:'fade',
		        showLoadMsg:false
		    };
		    
		    var opts = $.extend({}, defaults, options);

		
		    $.mobile.changePage(page, opts);

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
  
        window.history.back = $.mobile.popPage;

        if (Gopher.authorization.length == 0)
	        $.mobile.gotoPage('pages/login.html');
        else {
    	    console.log('Session ID: %s', Gopher.authorization);
    	    $.mobile.gotoPage('pages/main.html');
        }
    
    });
  

})();


