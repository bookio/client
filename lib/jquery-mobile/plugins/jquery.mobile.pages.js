(function($) {

	var _pages = [];
	var _baseUrl = $('head base').attr('href');

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
		}
		else {

			src = path.split(SLASH);
		}

		for (var i = 0; i < src.length; ++i) {

			token = src[i];

			if (token === DOTS) {
				target.pop();
			}
			else if (token !== BLANK && token !== DOT) {
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
	
	$.mobile.pages.length = function() {
		return _pages.length;
	}

	$.mobile.pages.push = function(url, options) {

		var request = $.Deferred();
		
		var defaults = {
			changeHash: false,
			transition: 'fade', //_pages.length == 0 ? 'fade' : 'slide',
			showLoadMsg: false
		};


		options = $.extend({}, defaults, options);

		options.transition = 'none';
		
		var parts = url.split('/');
		var lastPart = parts.pop();

		parts.push(lastPart.split('.')[0]);

		var htmlUrl = makePathRelativeToBaseUrl(url);
		var scriptUrl = makePathRelativeToBaseUrl(parts.join('/'));
		var modules = [scriptUrl, 'text!' + htmlUrl, 'css!' + scriptUrl];

		// Restore original location
		$('head base').attr('href', _baseUrl);
		console.log('Base changed to ', $('head base').attr('href'));

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
				page.params = (options != undefined && options.params != undefined) ? options.params : {};
				/*
				
				page.visible = false;
				
				page.show = function() {
					if (!page.visible) {
						$.mobile.changePage(page.element, options);
						page.visible = true;						
					}
				}
				
				*/
				
				// Execute the page script
				var module = new script(page);
				
				if ($.isFunction(module.init)) {
					module.init();
				}
				
				function callback() {
					$.mobile.changePage(page.element, options);
				}

				if ($.isFunction(module.refresh)) {
					module.refresh(callback);
				}
				else
					callback();
				
				// Push it on the page stack
				console.log('Pushing page ', page.url);

				_pages.push({
					page: page,
					module: module,
					options: options,
					request : request
				});
			}
			
		});
		
		return request;

	}

	$.mobile.pages.go = function(page, options) {

		$('[data-role="page"]').each(function() {

			// If active page, wait to remove until the new page is displayed
			if ($(this).hasClass('ui-page-active')) {
				$(this).one('pagehide', function() {
					$(this).remove();
				});
			}
			else {
				// Not active page, just remove it!
				$(this).remove();
			}
		});

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
				thisPage.page.element.on('pagehide', function(event, params) {
				
					$(this).remove();

				});

				thisPage.request.resolve.apply(undefined, arguments);


				$('head base').attr('href', nextPage.page.url);
				console.log('Base changed to ', $('head base').attr('href'));

				function callback() {
					$.mobile.changePage(nextPage.page.element, options);
				}

				if ($.isFunction(nextPage.module.refresh))
					nextPage.module.refresh(callback);	
				else
					callback();
					
				
			}
		}
	}
	
})(jQuery);
