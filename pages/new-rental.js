
(function() {

	var modules = [
		'jquery', 
		'text!./new-rental.html', 
		'less!./new-rental', 
		'components/modal', 
		'scripts/gopher', 
		'components/notify', 
		'components/imagepicker'
	];

	define(modules, function($, html) {
	
	
		var Modal = require('components/modal');
		var Gopher = require('scripts/gopher');
		var Notify = require('components/notify');
	
	    function doModal(options) {
	
    	    var _elements = {};
    	    var _modal = null;
    	    var _rental = {};
    	    var _icons = [];
    	    var _iconHash = {};


			var _defaults = {
			    rental: {}
			};
	
			var _options = $.extend({}, _defaults, options);
			
	        function enableEnterKey() {

	            _elements.html.on('keydown', function(event) {
	                if (event.keyCode == 13)
	                    _elements.okButton.trigger('click');
	                if (event.keyCode == 27)
	                	_modal.close();
	            });
	            
	        };
	        
	        function enableDisable() {
		        if (_elements.name.val() == '')
		        	_elements.okButton.addClass('disabled');
		        else
		        	_elements.okButton.removeClass('disabled');
	        }
	        
            function pathForImage(image) {
                return sprintf('images/symbols/%s', image);
            }

	        function enableIconSelector() {
    	        
                function showImagePicker() {
                    
                    /*var images = [];
                    
                    
                    for (var index = 0; index < _icons.length; index++) {
                        images.push(pathForImage(_icons[index].image));
                    }*/
                    
                    var click = function(index) {
                        picker.hide();
                        _elements.icon.attr('src', pathForImage(_icons[index].image));
                        _rental.icon_id = _icons[index].id;
                    };
                    
                    var picker = new ImagePicker({
                        icons:_icons,
                        click:click
                    }); 
                    
                    picker.show(_elements.icon);
                    
                }           	        
                _elements.selectSymbolButton.click(showImagePicker);
                _elements.icon.click(showImagePicker);
                 
	        }
	        
	        function enableClickOK() {
    	      
    	        _elements.okButton.click(function() {

	    	        if (_elements.okButton.hasClass('disabled'))
	    	        	return;
	    	        	
	    	        	
	    	        _rental.name = _elements.name.val();
	    	        _rental.description = _elements.description.val();
	    	        _rental.depth = _elements.depth.val();
	    	        _rental.category = _elements.category.val();
	    	         
	            	var request = _rental.id ? Model.Rentals.update(_rental) : Model.Rentals.add(_rental);

	            	request.done(function(rental) {
    	            	console.log(rental);
    	            	_modal.close();
	            	});
	            	        
    	        });
	        };
	        
	        function init() {
                if (_options.rental && _options.rental.id)
                    _rental = _options.rental;
                else {
    	            _rental.name = '';
    	            _rental.description = '';
    	            _rental.icon_id = _icons[0].id;
    	            _rental.depth = "1";
                }
	            
	            _elements.html = $(html); 
	            _elements.okButton = _elements.html.find("#ok-button");
	            _elements.selectSymbolButton = _elements.html.find("#select-icon-button");
	            _elements.name = _elements.html.find("#name");
	            _elements.title = _elements.html.find('#title');
	            _elements.icon = _elements.html.find('#icon');
	            _elements.description = _elements.html.find('#description');
	            _elements.depth = _elements.html.find('#depth');
	            _elements.category = _elements.html.find('#category');
	
	            _elements.name.val(_rental.name);
	            _elements.description.val(_rental.description);
	            _elements.category.val(_rental.category);
	            _elements.depth.val(_rental.depth);
	            
	            _elements.icon.attr('src', pathForImage(_iconHash[_rental.icon_id].image));

	            // Make IE hide the focus
	            _elements.html.find('.hidefocus').attr('hideFocus', 'true').css('outline', 'none');
	
	            if (_options.rental && _options.rental.id)
    	            _elements.okButton.text('Spara');
    	        else
    	            _elements.okButton.text('Skapa');
    	        
	            _modal = new Modal({
	                title: _options.rental && _options.rental.id ? _rental.name : 'Ny',
	                content:_elements.html
	            });            
	
	            _modal.show();
	            _elements.name.focus();
	            
	            enableIconSelector();
	            enableEnterKey();
	            enableClickOK();
	            enableDisable();
	            
	            _elements.name.bind('input', enableDisable);
	        }	  
	        
	        if (true) {
                var request = Model.Icons.fetch();
                
                request.done(function(icons){
        	        _icons = icons;
        	        
        	        for (var index = 0; index < _icons.length; index++) {
            	        var icon = _icons[index];
            	        _iconHash[icon.id] = icon;
        	        }
        	        init();
                    
                });    	        
	        }
	
	
		}
		
		return doModal;
	
	});

	
})()


