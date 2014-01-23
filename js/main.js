
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

	$.urlParam = function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	var modules = [
		'components/msgbox/msgbox'
	];

	require(modules, function() {

	
		function login() {
			$.mobile.pages.go('pages/login/login.html');
		}

		function main() {
			$.mobile.pages.go('pages/main/main.html');
				
		}

		function mobile() {
			$.mobile.pages.go('pages/mobile/select-category.html');
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
