

(function() {

	var dependencies = [
	   'i18n!./settings.json',
	   '../../widgets/pagelogo/pagelogo'
	];

	define(dependencies, function(i18n) {
		
		
	    function Module(page) {
            
            var _element = page.element;
            var _elements = {};
            
	        
	       function requestGuestUrl() {
				var request = Gopher.request('GET', 'users/guest');

				request.done(function(user) {

					var longURL = sprintf("%s?user=%s", window.location.href, user.username);

					_elements.url.val(longURL);
					_elements.urlTrial.attr('href',longURL);
				});

				return request;
			}

	        function init() {

	           _element.hookup(_elements, 'data-id');	           
	           _element.i18n(i18n);
	           
	           _elements.back.on('tap', function(event){
		          event.preventDefault();
		          $.mobile.pages.pop();
	           });
	           
	           _elements.contact.on('tap', function() {
		           $.mobile.pages.push('../contact/contact.html');
	           });
	           
	           _elements.users.on('tap', function() {
		           $.mobile.pages.push('../users/users.html');
	           });
	           
	           _elements.categories.on('tap', function() {
		           $.mobile.pages.push('../categories/categories.html');
	           });
	           
	           _elements.rules.on('tap', function() {
		           $.mobile.pages.push('../rules/rules.html');
	           });
			
			   var request = requestGuestUrl();
	        
			   request.always(function(){
				   page.show();
			   });
	        }	  

	        init();
		}
		
		return Module;

	
	});

	
})();
