
requirejs.config({
	baseUrl: '.',

	/*
	paths: {
		'jquery': 'lib/jquery/jquery-1.10.2',
		'jquery-mobile': 'lib/jquery-mobile/jquery.mobile-1.3.2',
		'jquery-mobile-config': 'lib/jquery-mobile/jquery.mobile.config',
		'components' : './components',
		'pages' : './pages',
		'js' : './js',
		'lib' : './lib',
		'less' : './less'
	},
	*/


	packages: [{
			name: 'css',
			location: 'lib/require-css',
			main: 'css'
		},
		{
			name: 'text',
			location: 'lib/require-text',
			main: 'text'
		}
	],

	waitSeconds: 30
});



(function() {

	$.urlParam = function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	var modules = [
		'components/msgbox/msgbox',
		'lib/mobiscroll/js/mobiscroll.custom-2.8.3.min.js'		
	];

	require(modules, function() {


		function login() {
			$.mobile.pages.goto('pages/login/login.html');
		}

		function main() {
			$.mobile.pages.goto('pages/main/main.html');
				
		}

		function mobile() {
			$.mobile.pages.goto('pages/mobile/select-category.html');
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


})();
