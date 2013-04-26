

define(['jquery', 'less!components/modal', 'components/popover'], function($) {

	Modal = function(options) {

		var self = this;
		
		var _defaults = {
			content: null,
			title: null,
			
			onOK: function() {self.close()},
			onCancel: function() {self.close()},
			onClose: function() {self.close()}
			
		};
		
		var _options = $.extend({}, _defaults, options);
		var _modal = null;
		var _backdrop = null; 

		
		function init() {
			var backdropTemplate = 
				'<div class="modal-backdrop hide">'+
				'</div>';
				
			var bodyTemplate = 
				'<div class="modal hide custom">'+
					'<div class="modal-header">'+
						//'<label class="cancel">Avbryt</label>'+
						'<button type="button" class="close" aria-hidden="true">&times;</button>'+
					'</div>'+
				'<div class="modal-body "></div>';
				
				'<div class="modal-footer">'+
					'<button type="button" class="btn ok-button">OK</button>'+
					'<button type="button" class="btn cancel-button">Cancel</button>'+
				'</div>';
			
			var backdrop = $(backdropTemplate).appendTo($('body'));
			var modal  = $(bodyTemplate).appendTo($('body'));
			var header = modal.find('.modal-header');
			var body   = modal.find('.modal-body');
			//var closeButton = modal.find('.close');
			
			modal.css({margin: '0px', width:'auto', height:'auto'});
			
			
			backdrop.css({opacity:0.15});
			
			if (_options.title) {
				$('<label></label>').text(_options.title).appendTo(header);
			}
			if (_options.content)
				$(_options.content).appendTo(body);
				
			
			modal.find('.close').click(function(){
				_options.onClose();
			});		

        	var windowWidth = $(window).innerWidth();
        	var windowHeight = $(window).innerHeight();
        	var modalWidth = modal.outerWidth();
        	var modalHeight = modal.outerHeight();
			
			// Make some late modifications the position when we have the size
			modal.css({left: Math.floor((windowWidth - modalWidth) / 2), top:Math.floor((windowHeight - modalHeight) / 3)});

			
			_modal = modal;
			_backdrop = backdrop;
		};
		
		function show() {
			Popover.fadeOutPopovers();
			
			_backdrop.fadeIn(200);
			_modal.fadeIn(200);
		}
		
		function close() {
			_modal.fadeOut(100, function(){
				_modal.remove();
				_modal = null;
			});

			_backdrop.fadeOut(100, function(){
				_backdrop.remove();
				_backdrop = null;
			});
			
		}
		
		init();
		
		this.close = close;
		this.show = show;
	}
	
	
	
	return Modal;
	
        
});

