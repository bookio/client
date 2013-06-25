
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

		$(document).on("pagebeforechange", function(event, params) {
		
    		//pageOptions[params.absUrl] = params.options;
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
		
		$.mobile.pushPage = function(page, pageData) {
		
		    var options = {
		        changeHash:false,
		        transition:'fade',
		        showLoadMsg:false,
		        pageData:pageData
		    };
		
	
		    $.mobile.changePage(page, options);
		} 

		$.mobile.gotoPage = function(page, pageData) {
		
            pages = [];
            $.mobile.pushPage(page, pageData);
		} 


        $.mobile.popPage = function() {

	        if (pages.length > 0) {
	            pages.pop();
	            
                if (pages.length > 0) {
                    var url = pages[pages.length-1];

                    var options = {}; //pageOptions[url];

	                options.reverse = true;
	                console.log("Trying to load page '%s'", url);
                    $.mobile.changePage(url, options);
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


