

(function() {

    var dependencies = [
        'less!./signup.less',
        'pages/main'
    ];

    define(dependencies, function() {
        
        
        function Module(page) {
            
            var _page = page;
            var _elements = {};

            
            function signup() {

                var email = _elements.email.val();

                var request = Gopher.signup(email, '');

                request.fail(function(){
                    
                });             

                request.done(function(data) {
                    $.mobile.gotoPage('main.html');
                });
                
            }        

            function enableDisable() {
                var email = _elements.email.val();

                _elements.signup.toggleClass('ui-disabled', email);
            }
            
            function init() {
                
                // Logout
                Gopher.logout();
                
                _page.hookup(_elements);

                _page.on('keydown', function(event) {
                
                    if (event.keyCode == 13)
                        signup();
                });

                _elements.back.on('tap', function(event){
                    $.mobile.popPage();
                });   

                _elements.email.on('input', function() {
                    enableDisable();
                });
                _elements.signup.on('tap', function() {
                    signup();
                });        
                
                enableDisable();     
                
            }     

            init();
        }

        $(document).delegate("#signup-page", "pageinit", function(event) {
            new Module($(event.currentTarget));
        });
        
    
    });

    
})();

