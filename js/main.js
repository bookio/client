requirejs.config({
	baseUrl: '.',

	paths: {
		'jquery': 'lib/jquery/jquery-1.10.2',
		'jquery-mobile': 'lib/jquery-mobile/jquery.mobile-1.3.2'
	},

	'shim': {
		'jquery-mobile': {
			deps: ['jquery', 'js/config-jquery-mobile']
		},

		'js/core': {
			deps: ['jquery']
		},


		'js/tools': {
			deps: ['js/sprintf']
		},

		'js/model': {
			deps: ['js/gopher', 'js/notifications']
		},

		'js/gopher': {
			deps: ['jquery', 'js/tools', 'js/base64', 'lib/jquery/plugins/jquery.cookie']
		},

		'js/config-jquery-mobile': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.cookie': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.debounce': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.hittest': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.hookup': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.isotope': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.mobile-events': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.special-events': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.spin': {
			deps: ['jquery']
		},

		'lib/jquery/plugins/jquery.transit': {
			deps: ['jquery']
		}
	},


	packages: [{
			name: 'css',
			location: './lib/require-css',
			main: 'css'
		},
		{
			name: 'text',
			location: './lib/require-text',
			main: 'text'
		}
	],

	waitSeconds: 30
});


(function() {

	var modules = [
		'css!./less/styles',
		'jquery',
		'jquery-mobile',

		// Make it load the text plugin now since the 
		// page local path will be changed by jQuery Mobile
		'text!index.html'
	];

	if (false) {
		var files = [
			'js/core'
		];

		modules.push.apply(modules, files)
	}
	else {
		var files = [
			'lib/jquery/plugins/jquery.cookie',
			'lib/jquery/plugins/jquery.debounce',
			'lib/jquery/plugins/jquery.hittest',
			'lib/jquery/plugins/jquery.hookup',
			'lib/jquery/plugins/jquery.isotope',
			'lib/jquery/plugins/jquery.mobile-events',
			'lib/jquery/plugins/jquery.special-events',
			'lib/jquery/plugins/jquery.spin',
			'lib/jquery/plugins/jquery.transit',

			'js/base64',
			'js/sha1',
			'js/sprintf',
			'js/tools',
			'js/date',
			'js/gopher',
			'js/notifications',
			'js/model',
			'js/cloudinary'
		];
		modules.push.apply(modules, files)

	}

	require(modules, function() {

		var pages = [];


		$(document).on("pageload", function() {
			var logo = $('body').find('[src="../images/app-icon.png"]');
			
			if (logo && logo.length > 0) {
				if (Gopher.client.logo) {
					logo.attr('src', Cloudinary.imageURL(Gopher.client.logo, {
						crop: 'fit',
						width: 100,
						height: 100
					}));
				}				
			}
		});

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

			options = $.extend({}, defaults, options);

			if (options.require) {
				require(isString(options.require) ? [options.require] : options.require, function() {
					$.mobile.changePage(page, options);
				});
			}
			else
				$.mobile.changePage(page, options);

		}

		$.mobile.gotoPage = function(page, options) {

			pages = [];

			if (arguments.length == 1 && !isString(page))
				$.mobile.pushModule(arguments[0]);
			else
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
			$.mobile.gotoPage('./pages/login.html', {
				require: ['./pages/login']
			});
		}

		function main() {
			$.mobile.gotoPage('./pages/main.html', {
				require: ['./pages/main']
			});
		}

		function mobile() {
			$.mobile.gotoPage('./pages/mobile-select-category.html', {
				require: './pages/mobile-select-category'
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
