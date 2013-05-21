

define(['jquery', 'less!components/modal'], function($) {


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
					'<div class="modal-body">'+
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
				
			_modal.find('.close').on('click', function(){
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

			_modal.modal({show:false, backdrop:'static', keyboard:true});
		};
		
		function show() {
		    if (_modal)
        		_modal.modal('show');
		}
		
		function close() {
		    if (_modal)
        		_modal.modal('hide');
		}
		
		init();
		
		this.close = close;
		this.show = show;
	}
	
	ModalEx = function(element, options) {

		var self = this;
		
		var _defaults = {
			title: null,
			
			onOK: function() {self.close()},
			onCancel: function() {self.close()},
			onClose: function() {self.close()}
			
		};
		
		var _options = $.extend({}, _defaults, options);
		var _modal = null;
        var _element = $(element);
        		
		function init() {

			var bodyTemplate = 
				'<div class="modal hide custom fade">'+
					'<div class="modal-header">'+
						'<button type="button" class="close" aria-hidden="true">&times;</button>'+
					'</div>'+
					'<div class="modal-body">'+
				'</div>';
				
			
			_modal = $(bodyTemplate).appendTo($('body'));
			
			var header = _modal.find('.modal-header');
			var body   = _modal.find('.modal-body');
			
			_modal.css({margin: '0px', width:'auto', height:'auto'});
			
			if (_options.title) {
				$('<label></label>').text(_options.title).appendTo(header);
			}

			_element.appendTo(body);
				
			_modal.find('.close').on('click', function(){
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
			_modal.modal({show:false, backdrop:'static', keyboard:true});
		};
		
		function show() {
		    if (_modal)
        		_modal.modal('show');
		}
		
		function close() {
		    if (_modal)
        		_modal.modal('hide');
		}
		
		init();
		
		this.close = close;
		this.show = show;
		this.hide = close;
	}

	// Small plugin to hook up elements that use the 'data-id' attribute
    $.fn.hookup = function(elements) {

        return this.each(function () {

            $(this).find('[data-id]').each(function() {
	            elements[$(this).data('id')] = $(this);
            });

        });
    }	

    $.fn.modalex = function(params) {

        var args = arguments;
        
        return this.each(function () {

            var $this = $(this);
            var data = $this.data('modalex');
            
            if (!data)
                $this.data('modalex', (data = new ModalEx($this, params)));

            if (typeof params == 'string') {
                return data[params].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    }	
	
    console.log('Modal.js loaded...');

	return Modal;
	
        
});

