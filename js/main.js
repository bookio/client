
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

	waitSeconds: 30
});



(function() {

	var modules = [
		'components/msgbox/msgbox'
	];
	
	require(modules, function() {


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
			
			moment.lang(lang);
			$.mobiscroll.defaults.lang = lang;
			$.mobiscroll.defaults.display = 'bubble';
			$.mobiscroll.defaults.theme = 'jqm';

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

		function main() {
			$.mobile.pages.go('pages/main/main.html');
				
		}

		function mobile() {
			$.mobile.pages.go('pages/mobile/select-category.html');
		}

		init();

		// Check if we are going to a specific page (for debugging)
		if (params['page']) {
			var page = params['page'];
			var password = params['pwd'];
			var user = params['user'];
			var sessionID = Gopher.sessionID;
			
			var request = Gopher.login(user, password);

			request.fail(function() {
				debugger;
			});

			request.done(function(data) {
				$.mobile.pages.go(page);
			});
			
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
			login();
	});


})();
