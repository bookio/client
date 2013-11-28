

(function($) {

	var _pages = [];
	var _baseUrl = $('head base').attr('href');
	var _pageParams = {};

    function makeNormalizedPath(path) {

	    var BLANK = '';
	    var SLASH = '/';
	    var DOT = '.';
	    var DOTS = DOT.concat(DOT);
	    var SCHEME = '://';

        if (!path || path === SLASH) {
            return SLASH;
        }

        /*
           * for IE 6 & 7 - use path.charAt(i), not path[i]
           */
        var prependSlash = (path.charAt(0) == SLASH || path.charAt(0) == DOT);
        var target = [];
        var src;
        var scheme;        
        var parts;
        var token;
        
        if (path.indexOf(SCHEME) > 0) {
        
            parts = path.split(SCHEME);
            scheme = parts[0];
            src = parts[1].split(SLASH);
        } else {
        
            src = path.split(SLASH);
        }

        for (var i = 0; i < src.length; ++i) {
        
            token = src[i];
            
            if (token === DOTS) {
                target.pop();
            } else if (token !== BLANK && token !== DOT) {
                target.push(token);
            }
        }

        var result = target.join(SLASH).replace(/[\/]{2,}/g, SLASH);
              
        return (scheme ? scheme + SCHEME : '') + (prependSlash ? SLASH : BLANK) + result;
    }
	
	function makePathRelativeToBaseUrl(path) {
		var pageUrl = $('head base').attr('href');
		var baseUrl = _baseUrl;

		var basePath = $.mobile.path.parseUrl(baseUrl).directory;
		var pagePath = $.mobile.path.parseUrl(pageUrl).directory;

		var i = 0;
		
		while (i < pagePath.length && i < basePath.length && pagePath[i] == basePath[i])
			i++;
			
		return makeNormalizedPath(pagePath.substring(i) + path);
	}	


	$(document).on("pagebeforechange", function(event, params) {
		if (params.options.reverse)
			return;

		if (isObject(params.toPage)) {
			_pages.push(params);
		}
		else {
			$.mobile.pageData = $.mobile.pages.params = null;
			 
			if (params.options && params.options.pageData) {
				$.mobile.pageData = $.mobile.pages.params = params.options.pageData; 
			}
			if (params.options && params.options.params) {
				$.mobile.pageData = $.mobile.pages.params = params.options.params; 
			}			
		}

	});

	$(document).on("pageshow", function(event, params) {
	
		var pageParams = _pages[_pages.length - 1];
		
		if (pageParams && pageParams.absUrl) {
			console.log('Settings base to "%s"', pageParams.absUrl);
			
			// Make sure the base is restored after we changed it
			$('head base').attr('href', pageParams.absUrl);
		}

	});
	
	$.mobile.pages = {};
	$.mobile.pages.params = null;
	

	$.mobile.pages.push = function(page, options) {

		var defaults = {
			changeHash: false,
			transition: _pages.length == 0 ? 'fade' : 'slide',
			showLoadMsg: false
		};

		options = $.extend({}, defaults, options);


		var parts = page.split('/');
		var lastPart = parts.pop();
		
		parts.push(lastPart.split('.')[0]);
		
		var jsModule = makePathRelativeToBaseUrl(parts.join('/'));
		var cssModule = 'css!' + jsModule;
			
		// Restore original location
		$('head base').attr('href', _baseUrl);

		require([cssModule, jsModule], function() {
			$.mobile.changePage(page, options);
		});

	}

	$.mobile.pages.goto = function(page, options) {
		_pages = [];
		$.mobile.pages.push(page, options);
	}


	$.mobile.pages.pop = function() {

		if (_pages.length > 0) {
			var thisPage = _pages.pop();

			if (_pages.length > 0) {
				var nextPage = _pages[_pages.length - 1];

				var options = {};
				options.changeHash = false;
				options.showLoadMsg = false;
				options.transition = thisPage.options.transition;
				options.reverse = true;

				$.mobile.changePage(nextPage.absUrl, options);
			}
		}
	}
	
	



})(jQuery);
