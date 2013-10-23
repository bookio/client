


(function() {

	var modules = [
		'jquery',
		'jquery-mobile',

		'css!jquery-mobile-css',
		'css!less/less/styles',
		//'js/framework'
		
    	'lib/jquery/plugins/jquery.cookie',
    	'lib/jquery/plugins/jquery.debounce',
    	'lib/jquery/plugins/jquery.hittest',
    	'lib/jquery/plugins/jquery.hookup',
    	'lib/jquery/plugins/jquery.isotope',
    	'lib/jquery/plugins/jquery.mobile-events',
    	'lib/jquery/plugins/jquery.special-events',
    	'lib/jquery/plugins/jquery.spin',
    	'lib/jquery/plugins/jquery.transit',

		'js/tools',
		'js/sprintf',
		'js/gopher',
		'js/model',
		'js/date',
		'js/sha1',
		'js/cloudinary'
		
	];

	require(modules, function($) {

		var pages = [];


		$(document).on("pagebeforechange", function(event, params) {
			if (params.options.reverse)
				return;

			if (isObject(params.toPage)) {
				pages.push(params);
			}
			else
				$.mobile.pageData = (params && params.options && params.options.pageData) ? params.options.pageData : null;

		});


		$.mobile.pushPage = function(page, options) {


			var defaults = {
				changeHash: false,

				transition: 'fade',
				showLoadMsg: false
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
				var thisPage = pages.pop();

				if (pages.length > 0) {
					var nextPage = pages[pages.length - 1];

					var options = {};
					options.changeHash = false;
					options.showLoadMsg = false;
					options.transition = thisPage.options.transition;
					options.reverse = true;

					$.mobile.changePage(nextPage.absUrl, options);
				}
			}
		}


		$.urlParam = function(name) {
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
			var results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		window.history.back = $.mobile.popPage;

		console.log('main.js executing...');
		
		function login() {
			require(['pages/login'], function () {
				$.mobile.gotoPage('pages/login.html');
			});	
		}
		
		function main() {
			require(['pages/main'], function() {
				$.mobile.gotoPage('pages/main.html');
			});	
			
		}
		
		function mobile() {
			require(['pages/mobile/select-category'], function() {
				$.mobile.gotoPage('pages/mobile/select-category.html');
			});	
			
		}
		
		if ($.urlParam('user')) {
			var user = $.urlParam('user');
			var request = Gopher.login(user);

			request.fail(function() {
				debugger;
			});

			request.done(function(data) {
				mobile();
			});
		}
		else if (Gopher.sessionID != '') {
			var request = Gopher.verify();

			request.fail(function() {
				login();
			});

			request.done(function(data) {
				main();
			});

		}
		else
			login();

	});

	console.log('main.js loaded...');

})();
