(function() {

	var dependencies = [
	];

	define(dependencies, function() {


		function Module(page) {

			var _page = page;
			var _elements = {};

			function login() {
				$.mobile.gotoPage('../pages/login.html', {
					require: ['../pages/login']
				});
			}
	
			function main() {
				$.mobile.gotoPage('../pages/main.html', {
					require: ['../pages/main']
				});
			}
	
			function mobile() {
				$.mobile.gotoPage('../pages/mobile-select-category.html', {
					require: '../pages/mobile-select-category'
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
				
		

		}

		$(document).delegate("#startup-page", "pageinit", function(event) {
			new Module($(this));
		});



	});


})();
