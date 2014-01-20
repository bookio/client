

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

	
	$.mobile.pages = {};
	$.mobile.pages.params = null;
	

	$.mobile.pages.push = function(url, options) {

		var defaults = {
			changeHash: false,
			transition: _pages.length == 0 ? 'fade' : 'slide',
			showLoadMsg: false
		};

		options = $.extend({}, defaults, options);

		var parts = url.split('/');
		var lastPart = parts.pop();
		
		parts.push(lastPart.split('.')[0]);
		
		var htmlUrl = makePathRelativeToBaseUrl(url); 
		var scriptUrl = makePathRelativeToBaseUrl(parts.join('/'));
		var modules = [scriptUrl, 'text!' + htmlUrl, 'css!' + scriptUrl];
		
		// Restore original location
		$('head base').attr('href', _baseUrl);
		console.log('base changed to ', $('head base').attr('href'));

		console.log('Loading modules', modules);

		require(modules, function(script, html) {

			if ($.isFunction(script)) {
				// Create the page object to pass on to the JavaScript code
				var page = {};
				
				// Change the base of the page
				page.url = $.mobile.path.makeUrlAbsolute(htmlUrl, _baseUrl);
				$('head base').attr('href', page.url);
				console.log('Base changed to ', $('head base').attr('href'));

				// Parse the HTML and add it to the page container
				page.element = $(html); 
				page.element = page.element.length == 3 ? $(page.element[1]) : page.element;
				page.element.appendTo($.mobile.pageContainer);

				// Initialize the page
                //page.element.trigger('create');

				if (options != undefined && options.params != undefined) {
					$.mobile.pages.params = options.params;
					page.params = options.params;
				}

				// Push it on the page stack
				console.log('Pushing page ', page.url);
				_pages.push({page:page.element, options:options, absUrl:page.url});


				// Define the show function
				page.show = function() {
					$.mobile.changePage(page.element, options);
				}				

				new script(page);
			}
		});

	}

	$.mobile.pages.go = function(page, options) {

		$.mobile.pageContainer.find('.ui-page-active').on('pagehide', function() {
			$(this).on('pagehide', function() {
				$(this).remove();
			});
		});
		/*
		$.mobile.pageContainer.find(':not(.ui-page-active)').each(function(index) {
			$(this).remove();
		});
		*/		
		
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

				// Remove this page when it is hidden
				thisPage.page.on('pagehide', function(event, params) {
					$(this).remove();
				});

				$('head base').attr('href', nextPage.absUrl);
				console.log('Base changed to ', $('head base').attr('href'));

				$.mobile.changePage(nextPage.page, options);
			}
		}
	}
	
	



})(jQuery);
