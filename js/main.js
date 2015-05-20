
requirejs.config({
	baseUrl: '.',
	
	packages: [{
			name: 'css',
			location: 'lib/require-css',
			main: 'css'
		},
		{
			name: 'text',
			location: 'lib/require-text',
			main: 'text'
		},
		{
			name: 'i18n',
			location: 'lib/require-i18n',
			main: 'i18n'
		}
	],

	paths: {
        'jquery'              : 'lib/jquery/jquery-2.1.3',
        'jquery-mobile'       : 'lib/jquery-mobile/jquery.mobile-1.4.5',
        'jquery-mobile-config': 'lib/jquery-mobile/jquery.mobile.config',
        'moment'              : 'lib/moment/moment-with-locales.min',
        'underscore'          : 'lib/underscore/underscore',
        'rrule'               : 'lib/rrule/rrule',
        'mobiscroll'          : 'lib/mobiscroll/mobiscroll.2.9.5.min',
        'latlon-picker'		  : 'lib/latlon-picker/jquery-gmaps-latlon-picker', 
        'fullcalendar'        : 'lib/fullcalendar/fullcalendar.min',
        'fullcalendar-lang'   : 'lib/fullcalendar/lang-all',
        'moment-range'        : 'lib/moment/moment-range'
    },
    
    // Declare dependencies
	shim: {
		'jquery-mobile': ['jquery-mobile-config'],
		'jquery-mobile-config' : ['jquery'],
		'rrule': ['underscore'],
		'moment-range' : ['moment'],
		'mobiscroll' : ['jquery-mobile'],
		'latlon-picker' : ['jquery'],
		'fullcalendar' :  ['jquery'],
		'fullcalendar-lang' : ['jquery'], 
		'lib/jquery-mobile/plugins/jquery.mobile.pages': ['jquery-mobile'],
		'lib/jquery/plugins/jquery.extensions.js': ['jquery'],
		'lib/jquery/plugins/jquery.cookie.js': ['jquery'],
		'lib/jquery/plugins/jquery.hookup.js': ['jquery'],
		'lib/jquery/plugins/jquery.debounce.js': ['jquery'],
		'lib/jquery/plugins/jquery.hittest.js': ['jquery'],
		'lib/jquery/plugins/jquery.isotope.js': ['jquery'],
		'lib/jquery/plugins/jquery.mobile-events.js': ['jquery'],
		'lib/jquery/plugins/jquery.special-events.js': ['jquery'],
		'lib/jquery/plugins/jquery.spin.js': ['jquery'],
		'lib/jquery/plugins/jquery.transit.js': ['jquery'],
		'lib/jquery/plugins/jquery.i18n.js': ['jquery'],
		'lib/jquery/plugins/jquery.pubsub.js': ['jquery'],
		'lib/jquery/plugins/jquery.devoke.js': ['jquery'],
		'lib/jquery/plugins/jquery.textrange.js': ['jquery'],
		'lib/jquery/plugins/jquery.keyframes.js': ['jquery'],
		'js/base64.js'  : ['jquery'],
		'js/sprintf.js' : ['jquery'],
		'js/sha1.js'    : ['jquery'],
		'js/tools.js'   : ['jquery'],
		'js/gopher.js'  : ['jquery'],
		'js/date.js'    : ['jquery'],
		'js/model.js'   : ['js/gopher.js']
	},
	
	waitSeconds: 30
});



(function() {

	var modules = [
		'jquery',
		'jquery-mobile',
		'lib/jquery/plugins/jquery.extensions.js',
		'lib/jquery/plugins/jquery.cookie.js',
		'lib/jquery/plugins/jquery.hookup.js',
		'lib/jquery/plugins/jquery.debounce.js',
		'lib/jquery/plugins/jquery.hittest.js',
		'lib/jquery/plugins/jquery.isotope.js',
		'lib/jquery/plugins/jquery.mobile-events.js',
		'lib/jquery/plugins/jquery.special-events.js',
		'lib/jquery/plugins/jquery.spin.js',
		'lib/jquery/plugins/jquery.transit.js',
		'lib/jquery/plugins/jquery.i18n.js',
		'lib/jquery/plugins/jquery.pubsub.js',
		'lib/jquery/plugins/jquery.devoke.js',
		'lib/jquery/plugins/jquery.textrange.js',
		'lib/jquery/plugins/jquery.keyframes.js',
		'lib/jquery-mobile/plugins/jquery.mobile.pages',
		'mobiscroll',
		'moment',
		'moment-range',
		'underscore',
		'rrule',
		'latlon-picker',
		'fullcalendar',

		'js/base64.js',
		'js/sprintf.js',
		'js/sha1.js',
		'js/tools.js',
		'js/gopher.js',
		'js/date.js',
		'js/model.js'
	];
	
	require(modules, function() {


		// Quick fix, pollute global name space with moment()
		moment = require("moment");

		function parseUrlParams() {
			var params = {};
			
			var parts = location.search.split('?');

			if (parts.length > 1) {
				parts = decodeURIComponent(parts[1]).split('&');
				
				for (var i = 0; i < parts.length; i ++) {
					var part = parts[i].split('=');
					params[part[0]] = part[1];
				}
			}
			
			return params;
		}
		
		var params = parseUrlParams();

		function init() {
		
			var lang = params['lang'] ? params['lang'] : $.i18n.lang;
			
			moment.locale(lang);
			$.mobiscroll.defaults.lang = lang;
			$.mobiscroll.defaults.display = 'bubble';
			$.mobiscroll.defaults.theme = 'android-ics';


			// Use 'sv' instead of 'sv-se' for mobiscroll
			switch ($.mobiscroll.defaults.lang) {
				case 'sv-se':
					$.mobiscroll.defaults.lang = 'sv';
					break;
			}
			
			$.i18n.lang = lang;
		}
	
		function login() {
			$.mobile.pages.go('pages/login/login.html');
		}

		function signup() {
			$.mobile.pages.go('pages/signup/signup.html');
		}

		function main() {
			$.mobile.pages.go('pages/main/main.html');
				
		}

		function mobile() {
				
			var request = Gopher.request('GET', 'categories');
	
			request.done(function(categories) {
				$.mobile.pages.go('pages/mobile/select-category.html');
			});

		}

		init();

		// Check if we are going to a specific page (for debugging)
		if (params['page']) {
			var page = params['page'];
			var password = params['pwd'];
			var user = params['user'];
			var sessionID = Gopher.sessionID;
			
			if ($.isString(user)) {
				var request = Gopher.login(user, password);
	
				request.fail(function() {
					debugger;
				});
	
				request.done(function(data) {
					$.mobile.pages.go(page);
				});
				
			}
			else {
				$.mobile.pages.go(page);
				
			}
			
		}
		
		// Check if it is the 'mobile' version of the app
		else if (params['user']) {
			var user = params['user'];
			var request = Gopher.login(user);

			request.fail(function() {
				debugger;
			});

			request.done(function(data) {
				mobile();
			});
		}

		//
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
			signup();
	});


})();
