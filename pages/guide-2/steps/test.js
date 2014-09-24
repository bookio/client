


(function() {

    var dependencies = [
    	'../../../widgets/common/radiobuttons.js'
    ];


    define(dependencies, function() {
        
        function Module(html, guide) {
            
            var _elements = {};
            
			//html.hookup(_elements, 'data-id');

			
            function init() {
            	html.on('next', function(){
	            	alert(1);
            	});
				alert(12);
				
            }     

			init();
			
        }

        
        return Module;
    
    });

    
})();

