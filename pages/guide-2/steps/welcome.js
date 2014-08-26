


(function() {

    var dependencies = [
    	'../../../widgets/common/list.js'
    ];


    define(dependencies, function() {
        
        function Module(html) {
            
            var _elements = {};
            
            
			html.hookup(_elements, 'data-id');

            function init() {
            
            	_elements.list.list();
            	
            	var item = _elements.list.list('add', 'title subtitle');
            	item.title('dsgf');
            	
            	_elements.list.list('refresh');
            		

				
            }     

			init();
			
        }

        
        return Module;
    
    });

    
})();

