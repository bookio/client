

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
		
		function init() {

			var bodyTemplate = 
				'<div class="modal hide custom fade">'+
					'<div class="modal-header">'+
						'<button type="button" class="close" aria-hidden="true">&times;</button>'+
					'</div>'+
				'<div class="modal-body "></div>';
				
				'<div class="modal-footer">'+
					'<button type="button" class="btn ok-button">OK</button>'+
					'<button type="button" class="btn cancel-button">Cancel</button>'+
				'</div>';
			
			var modal  = $(bodyTemplate).appendTo($('body'));
			var header = modal.find('.modal-header');
			var body   = modal.find('.modal-body');
			
			modal.css({margin: '0px', width:'auto', height:'auto'});
			
			if (_options.title) {
				$('<label></label>').text(_options.title).appendTo(header);
			}

			if (_options.content) {
				$(_options.content).appendTo(body);
			}
				
			modal.find('.close').click(function(){
				_options.onClose();
			});		

			modal.find('hidden').click(function(){
				modal.remove();
			});		

        	var windowWidth = $(window).innerWidth();
        	var windowHeight = $(window).innerHeight();
        	var modalWidth = modal.outerWidth();
        	var modalHeight = modal.outerHeight();
			
			// Make some late modifications the position when we have the size
			modal.css({left: Math.floor((windowWidth - modalWidth) / 2), top:Math.floor((windowHeight - modalHeight) / 3)});

			_modal = modal;
		};
		
		function show() {
		  _modal.modal('show');
		}
		
		function close() {
		  _modal.modal('hide');
		  _modal = null;
		}
		
		init();
		
		this.close = close;
		this.show = show;
	}
	
	
	
	return Modal;
	
        
});

