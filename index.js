/* JBN */

requirejs.config({
    paths: {
        'scripts': './scripts'
    },

	map: {
	  '*': {
	    'css': 'lib/require-css/css',
	    'less': 'lib/require-less/less',
	    'text': 'lib/require-text/text'
	  }
	},

	waitSeconds: 30
});



(function() {

    var modules = [];
    
    modules.push('jquery');
    modules.push('css!frameworks/bootstrap/css/bootstrap.css');
    modules.push('less!index');
	modules.push('frameworks/bootstrap/js/bootstrap');
	modules.push('lib/jquery.mousewheel')
	modules.push('lib/jquery.transit');
	modules.push('lib/jquery.cookie');
	modules.push('lib/jquery.special-events');
	modules.push('lib/jquery.mobile-events');
	modules.push('lib/jquery.caret');
	modules.push('lib/jquery.hookup');
	modules.push('lib/jquery.scrollintoview');
	modules.push('lib/path');
	modules.push('scripts/gopher');
	modules.push('scripts/date');
	modules.push('scripts/base64');
	modules.push('scripts/tools');
	modules.push('scripts/model');
	modules.push('scripts/notifications');
	modules.push('scripts/parser');
	modules.push('bookio');
    
	modules.push('components/spinner');
    modules.push('components/imagepicker');
    modules.push('components/notify');
    modules.push('components/modal');
    
	modules.push('pages/sample');
    modules.push('pages/login/login');

    require(modules, function($) {
        

        myApp = new Application();
        
        function cleanUp() {
            console.log("cleanup...");
        };
        
        function enter() {
        }
        function exit() {
        }

        function gotoLogin() {
        	var Login = require('pages/login/login');
            Login();
            
        }        
        
        function gotoDesktop() {
        	var Sample = require('pages/sample');
        	Sample();
            
        }
        
        function gotoWhatever() {
            if (myApp.gopher.isValid()) {
            	console.log("SessionID: " + myApp.gopher.sid());
                gotoDesktop();
            }
            else {
                gotoLogin();
                
            }
        }

        Path.map("#login").to(function() {
            gotoLogin();
        }).exit(exit).enter(enter);

        Path.map("#desktop").to(function() {
            gotoDesktop();
        }).exit(exit).enter(enter);

        Path.rescue(function() { 
        });
        
        

        Path.listen();
        
        gotoWhatever();
        
                
    });


})();

