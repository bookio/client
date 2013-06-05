
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
		    pages.push(event.currentTarget.baseURI);
			console.log("document.pagebeforeshow");
		});
		$.mobile.pushPage = function(page, options) {
		
		    var pageoptions = {
		        changeHash:false,
		        transition:'fade',
		        showLoadMsg:false
		    };
		
		    $.extend(pageoptions, options);
		
		    $.mobile.changePage(page, pageoptions);
		} 

        $.mobile.popPage = function() {

	        if (pages.length > 0) {
	            pages.pop();
	            
	            if (pages.length > 0) {
	                console.log("Trying to load page '%s'", pages[pages.length-1]);
	                $.mobile.changePage(pages[pages.length-1]);
	            }
	        }
        } 
  

        if (Gopher.authorization.length == 0)
	        $.mobile.pushPage('pages/login.html', {showLoadMsg:false, changeHash:false, transition:'fade'});
        else {
    	    console.log('Session ID:%s', Gopher.authorization);
    	    $.mobile.pushPage('pages/main.html', {showLoadMsg:false, changeHash:false, transition:'fade'});
        }
    
    });
  

})();


