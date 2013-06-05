

/*

@codekit-prepend "components/modal.js";
@codekit-prepend "components/notify.js";
@codekit-prepend "components/spinner.js";
@codekit-prepend "scripts/tools.js";
@codekit-prepend "sample.js";
*/

define(['jquery', 'text!./login.html', 'less!./login.less', 'components/spinner', 'pages/sample'], function($, html) {
//define(function(require) {


    //var $ = require('jquery');
    

	

    function Module() {

    	var Spinner = require('components/spinner');
    	var Sample = require('pages/sample');

        var _root = null;
        var _okButton = null;
        var _email = null;
        var _password = null;
        var _spinner = null;
        var _busy = false;
        
        function test() {
        
            var alphabet = "AAAAAAAAABBCDDDDDEEEEEEEEFFGGGHHIIIIIJKKKLLLLLMMMNNNNNOOOOOPPRRRRRRRSSSSSSSSTTTTTTTTUUUVVXYZÅÅÄÄÖÖ**";    
            //var theWord = "OFRUSEN".split('').sort().join('');
            var theWord = "OFRUSEN".split('').sort().join('');
            var letters = [];
            
            var tries = 0;
            var bingo = 0;
                        
            
            for (var x = 0; x < 10000000; x++) {
                var word = [];
            
                if (letters.length < 7)
                    letters = alphabet.split('');
        
                for (var i = 0; i < 7; i++) {
                    var index = Math.floor(Math.random()*letters.length);
                    word.push(letters[index]);
                    letters.splice(index, 1);
                }
                
                word.sort();
                var result = word.join('');
                
                if (result == theWord) {
                    bingo++;
                    console.log(result);
                }
                    
                    
                tries++;
                
                if ((tries % 100000) == 0) {
                    //console.log("%s, %d - %d", result, bingo, tries);
                }    
            }
            
                
            console.log("Done: %d - %d - 1/%d", bingo, tries, Math.floor(tries/bingo));

        };
        
        function onOK() {
    		//if (_busy)
    		//	return;	
    			
    		_busy = true;
    	
    		var email = _email.val();
    		var password = _password.val();

    		if (email == 'bp') {
        		test();
        		return;
    		}
    		_spinner.show();
    		_okButton.transition({opacity:0.5}, 200);

    		var completed = function(response) {

	    		_busy = false;
	    		
                _okButton.transition({opacity:1.0}, 100);
                _spinner.hide();
        		
        		if (response.error == null) {
                    window.location = '#desktop';
            		
        		}
        		else {
            		_okButton.transition({x:-3}, 50).transition({x:6}, 50).transition({x:0}, 50);
            		
        		}
    		};
    		
    		myApp.gopher.login(email, password, completed);

            
        }        
        
        function enableEnterKey() {
            _root.on('keydown', function(event) {
            
                if (event.keyCode == 13)
                    onOK();
            });
            
        };
        
        function setupSpinner() {
            var container = _root.find('.spinner');

            _spinner = new Spinner({
                container:container,
                size:container.innerHeight()
            });
            
        }

        function init() {

            _okButton = _root.find(".login-button");
            _email = _root.find(".email");
            _password = _root.find(".password");

            _email.val(myApp.gopher.username());
            
            _okButton.on("click", onOK);


            _root.find('.hidefocus').attr('hideFocus', 'true').css('outline', 'none');


            if (myApp.gopher.username().length > 0)
                _password.focus();
            else
                _email.focus();
                
            enableEnterKey();
            setupSpinner();            

        }	    

        _root = $(html);//require('text!./login.html'));
        $('body').empty();
        $('body').append(_root);
        
        init();	
    	    
	}

	return Module;

});

