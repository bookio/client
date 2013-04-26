
define(['jquery', 'lib/jquery.spin'], function($) {

    Spinner = function(options) {
    

        var _spinner = null;

        var _defaults = {
            size:40,
            container:$('body')
        };

		var _options = $.extend({}, _defaults, options == undefined ? {} : options);
        	
        function init() {
        
            
			var opts = {
			  lines: 12, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  color: '#000', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'the-spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px,

			};

			opts.radius = Math.floor(_options.size * 0.234);
			opts.length = Math.floor(_options.size * 0.169);
			opts.width = Math.floor(_options.size * 0.1);

			// Get a reference to the spinner module
			var spinner = require('lib/jquery.spin');

			_spinner = new spinner(opts);
        };
        
        this.hide = function() {
            _spinner.stop();
            
        };
        
        this.show = function() {
            _spinner.spin(_options.container[0]);
        };

        this.stop = function() {
            _spinner.stop();
            
        };
        this.start = function() {
            _spinner.spin(_options.container[0]);
        };
        
        init();
    };

    return Spinner;
    
});

