
requirejs.config({
	baseUrl: '.',
	
	paths: {
		'less': '.',
		'jquery': 'http://code.jquery.com/jquery-1.10.2.min',
		'jquery-mobile': 'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min',
		'jquery-mobile-css': 'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min'
	},

    'shim': {
    	'jquery-mobile' : {
	    	deps: ['jquery', 'js/config-jquery-mobile']
    	},
    	
    	'lib/jquery/plugins/jquery.cookie': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.debounce': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.hittest': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.hookup': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.isotope': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.mobile-events': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.special-events': {
	    	deps: ['jquery']
    	},

    	'lib/jquery/plugins/jquery.spin': {
	    	deps: ['jquery']
    	},
    	'lib/jquery/plugins/jquery.transit': {
	    	deps: ['jquery']
    	}
    },


	packages: [{
		name: 'css',
		location: 'lib/require-css',
		main: 'css'
	}, {
		name: 'less',
		location: 'lib/require-less',
		main: 'less'
	}, {
		name: 'text',
		location: 'lib/require-text',
		main: 'text'
	}],

	waitSeconds: 30
});


requirejs(['js/main']);
