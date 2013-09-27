

(function() {

    var dependencies = [
        'less!./login.less',
        'pages/main',
        'pages/signup'
    ];

    define(dependencies, function() {
        
        
        function Module(page) {
            
            var _page = page;
            var _elements = {};

            function login(email, password) {

                var email = _elements.login.email.val();
                var password = _elements.login.password.val();
                
                if (email != '') {
                    _elements.login.button.transition({opacity:0.5}, 200);
                    
                    var request = Gopher.login(email, password);
    
                    request.always(function() {
                        _elements.login.button.transition({opacity:1.0}, 100);
                        _elements.login.button.transition({x:-5}, 75).transition({x:10}, 75).transition({x:0}, 75);
                        
                    });             
    
                    request.done(function(data) {
                        $.cookie('username', data.user.username); 
                        $.mobile.gotoPage('main.html');
                    });
                    
                }
    
                
            }        

            function signup() {
                var email = _elements.signup.email.val();

                if (email != '') {
                    _elements.signup.button.transition({opacity:0.5}, 200);
                    
                    var request = Gopher.signup(email, '');
    
                    request.always(function() {
                        _elements.signup.button.transition({opacity:1.0}, 100);
                        _elements.signup.button.transition({x:-5}, 75).transition({x:10}, 75).transition({x:0}, 75);
                        
                    });             
    
                    request.done(function(data) {
                        $.mobile.gotoPage('main.html');
                    });
                }
            }
            
            function enableDisable() {
                _elements.signup.button.toggleClass('ui-disabled', _elements.signup.email.val() == '');
                _elements.login.button.toggleClass('ui-disabled', _elements.login.email.val() == '');
            }
            

            function init() {
                
                var username = isString($.cookie('username')) ? $.cookie('username') : '';

                // Logout
                Gopher.logout();
                    
                _page.hookup(_elements);
                _elements.login.email.val(username);

                _elements.login.button.on('tap', function() {
                    login();
                });             

                _elements.signup.button.on('tap', function() {
                    signup();
                });             

                _elements.login.email.on('input', function() {
                    enableDisable();
                });             

                _elements.signup.email.on('input', function() {
                    enableDisable();
                });    
                
                enableDisable();        
                
            }     

            init();
        }

        $(document).delegate("#login-page", "pageinit", function(event) {
            new Module($(event.currentTarget));
        });
        
    
    });

    
})();

