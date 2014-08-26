


(function() {

    var dependencies = [
    	'../../../widgets/common/list.js'
    ];


    define(dependencies, function() {
        
        function Module(html) {
            
            var _elements = {};
            
            
			html.hookup(_elements, 'data-id');

            function init() {
            
				
            }     

			init();
			
        }

        
        return Module;
    
    });

    
})();

