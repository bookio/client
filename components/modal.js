

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
			
			_modal = $(bodyTemplate).appendTo($('body'));
			
			var header = _modal.find('.modal-header');
			var body   = _modal.find('.modal-body');
			
			_modal.css({margin: '0px', width:'auto', height:'auto'});
			
			if (_options.title) {
				$('<label></label>').text(_options.title).appendTo(header);
			}

			if (_options.content) {
				$(_options.content).appendTo(body);
			}
				
			_modal.find('.close').click(function(){
				_options.onClose();
			});		

			_modal.on('hidden', function(){
				_modal.remove();
				_modal = null;
			});		

        	var windowWidth = $(window).innerWidth();
        	var windowHeight = $(window).innerHeight();
        	var modalWidth = _modal.outerWidth();
        	var modalHeight = _modal.outerHeight();
			
			// Make some late modifications the position when we have the size
			_modal.css({left: Math.floor((windowWidth - modalWidth) / 2), top:Math.floor((windowHeight - modalHeight) / 3)});

			_modal.modal({show:false});
		};
		
		function show() {
		  _modal.modal('show');
		}
		
		function close() {
		  _modal.modal('hide');
		}
		
		init();
		
		this.close = close;
		this.show = show;
	}
	
	
	
	return Modal;
	
        
});

