// MEG was here

define(['jquery', 'scripts/gopher'], function($) {


	var Module = function() {
		
		var _root = null;
	    	
		function init() {
			//_root = $('bödy');
			_root = $('body');
		}
		
		this.root = function() {
    		return _root;
		}
		
		this.loadURL = function(url) {
            $.get(url, function(html) {
        		_root.empty();
        		_root.append(html);
            });  			
		};
		
		this.gopher = new Gopher();
		
		// Initialize
		init();
		
	};
	
	a = 3;// JBN
	
	Application = Module;
	
	// Return the module
	return Module;
	
});

  





