
requirejs.config({
	paths: {
		'pages': '../pages',
		'js': '../js',
		'scripts': '../js',
		'lib': '../lib',
		'components': '../components',
		'jquery': 'http://code.jquery.com/jquery-1.10.2.min',
		'jquery-mobile': 'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min',
		'jquery-mobile-css': 'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min'
	},

    'shim': {
    	'jquery-mobile' : {
	    	deps: ['jquery', 'js/config-jquery-mobile']
    	}
    },


	packages: [{
		name: 'css',
		location: '../lib/require-css',
		main: 'css'
	}, {
		name: 'less',
		location: '../lib/require-less',
		main: 'less'
	}, {
		name: 'text',
		location: '../lib/require-text',
		main: 'text'
	}],

	waitSeconds: 30
});


requirejs(['main']);
