

define(['css!./desktop', '../pages/rental', '../pages/reservation'], function() {

    
	Desktop = function(container, options) {

		var self = this;
		
		var _defaults = {
    		iconMargin:10,
    		iconSpacing:0,
    		iconSize:100
		};
		
		var _options = $.extend({}, _defaults, options);
		var _element = null;
		var _startDate = new Date();
		var _endDate = new Date();
		var _setNeedsLayout = false;
		var _editMode = false;

		var _reservations = {};
		var _customers = {};
		var _rentals = {};
		var _settings = {};
		var _icons = {};
		var _desktopSize = {};
		var _page = options.page;
		
		var _timerForIntroBlob;

		function updateUI() {
    		if (_setNeedsLayout)
                updateRentalAvailability();
            
            _setNeedsLayout = false;    		
    		
		};
		
		
		Notifications.on('background-changed.desktop', function(background) {
    		_settings.background = background;
    		saveSettings();
		});


		Notifications.on('updateUI.desktop', function() {
    		updateUI();
		});

		Notifications.on('rental-added.desktop', function(rental) {
			
			var cols   = computeMaxCols();
			var rows   = computeMaxRows();
			var cells  = cols * rows;
			var row    = 0;
			var col    = 0;
			
			for (var i = 0; i < cells; i++) {
				var y = Math.floor(i / cols);
				var x = i % rows;
					
				if (isPositionAvailable(x, y)) {
					col = x;
					row = y;
					break;
				}
			}
			
			// Everything is full, add on top others
			addRentalToScene(rental, col, row);
			saveSettings();
		});

		Notifications.on('rental-updated.desktop', function(rental) {
            updateRental(rental);
		});

		Notifications.on('rental-removed.desktop', function(rental) {

    		var rentals = Model.Rentals.fetch();
    		var reservations = Model.Reservations.fetch();

    		rentals.done(gotRentals);
    		reservations.done(gotReservations);
    		
    		$.when(rentals, reservations).then(function(){
                placeRentals();
                updateRentalAvailability();
                saveSettings();
    		});

		});

		Notifications.on('customer-added.desktop customer-updated.desktop', function(customer) {
    		_customers[customer.id] = customer;
		});

		Notifications.on('reservation-added.desktop reservation-updated.desktop', function(reservation) {

        	if (!_reservations[reservation.rental_id])
            	_reservations[reservation.rental_id] = {};
                
            _reservations[reservation.rental_id][reservation.id] = reservation;

            _setNeedsLayout = true;
            
    		updateUI();
    		
		});

		Notifications.on('reservation-removed.desktop', function(reservation) {

    		var reservations = Model.Reservations.fetch();

    		reservations.done(function(reservations){
	    		gotReservations(reservations);	
                _setNeedsLayout = true;
                updateUI(); 
    		});
		});


		function getReservationForRental(rental)
		{
			var reservations = _reservations[rental.id];
			
			if (reservations == undefined)
				return null;
			
			for (var key in reservations) {
    			var reservation = reservations[key]; 

				var start = new Date(reservation.begin_at);
				var end = new Date(reservation.end_at);
				
				if (end <= _startDate || start >= _endDate) {
				}
				else {
					return reservation;
				}
			}
			
			return null;
				
		}

		function isRentalAvailable(rental)
		{
    		return getReservationForRental(rental) == null ? true : false;
		}
		
		function updateRentalAvailability() {
    		var items = _element.find('.item');
    		
    		$.each(items, function(i, element){
                var item = $(element);
                var rental = item.data('rental');
                
                if (isRentalAvailable(rental))
                    item.removeClass("disabled");
                else
                    item.addClass("disabled");
    		});    		
		}
		

		
		function startDate(value) {
    		if (value == undefined)
        		return _startDate;
        		
            _startDate = value;
            _setNeedsLayout = true;
		}


		function endDate(value) {
			if (value == undefined)
        		return _endDate;
        		
            _endDate = value;
            _setNeedsLayout = true;
		}

		function computeMaxCols() {
    		return Math.floor((_desktopSize.width - 2 * _options.iconMargin) / (_options.iconSpacing + _options.iconSize));
		}

		function computeMaxRows() {
            return Math.floor((_desktopSize.height - 2 * _options.iconMargin) / (_options.iconSpacing + _options.iconSize));
		}
		
		
		function newReservation(rental) {

			var reservation = {};
			reservation.begin_at = startDate();
			reservation.end_at = endDate();
			reservation.rental_id = rental.id;

			$.mobile.changePage('../pages/reservation.html', {pageData:{reservation:reservation}});
			
		};
		

		function placeRentals() {

            var maxCols = computeMaxCols();
            var maxRows = computeMaxRows();

            var index = 0;

    		_element.find('.item').remove();

            if (!_settings.positions)
                _settings.positions = {};
                
    		for (var rental_id in _rentals) {
        		var rental = _rentals[rental_id];
        		var position = _settings.positions[rental_id];

        		if (!position || !position.x || !position.y) {
        		    position = {};
        		    position.y = Math.floor(index / maxCols);
        		    position.x = index % maxCols;

        		    index++;
        		}

        		addRentalToScene(rental, position.x, position.y);
    		}
		}


		function gotSettings(settings) {

		    var defaults = {
    		    positions: {},
    		    orderAutomatically: false,
    		    background: 'linen.png'
		    };
			
			_settings = {};
            _settings = $.extend({}, defaults, settings);
		}


		function saveSettings() {

			// Regenerate positions		
			_settings.positions = {};

            _element.find('.item').each(function() {
	            var position = $(this).data('position');
	        	var rental = $(this).data('rental')
	        	
	        	_settings.positions[rental.id] = position;  
            });
            		
			Model.Settings.save('desktop', 'layout', _settings);
		}

		function gotCustomers(customers) {

    		_customers = {};
    		
			$.each(customers, function(i, customer) {
    			_customers[customer.id] = customer;
			});
    		
		}



		function gotIcons(icons) {
			_icons = icons;
		}


		
		function removeSelectedRental() {
    		var elements = _element.find('.title.selected');
    		
    		$.each(elements, function(i, element){
                var item = $(element).parent();
                var rental = item.data('rental');
                
                Model.Rentals.remove(rental);
    		});    		
            
		};


		function gotRentals(rentals) {
			_rentals = {};

			$.each(rentals, function(i, rental) {
    			_rentals[rental.id] = rental;
			});
		}

		function gotReservations(reservations) {
            _reservations = {};    		
        	
        	$.each(reservations, function(i, reservation){

            	if (!_reservations[reservation.rental_id])
                	_reservations[reservation.rental_id] = {};
                    
                _reservations[reservation.rental_id][reservation.id] = reservation;
                
        	});

		}
		
		
		function enableEscKey() {
		
            $(document).on('keyup.desktop', function(event) {
            	
                if (event.keyCode == 27) {
                	self.editMode(false);
                }
            });
	            
	    };
	    
	    function clearIntroBlob() {
            // Clear intro blob
            var theDiv = _element.find('.introText'); 
			theDiv.css({backgroundImage:'none'});
            
            theDiv = _element.find('.introArrow'); 
			theDiv.css({backgroundImage:'none'});
			
			theDiv = _element.find('.introBike');
			theDiv.css({backgroundImage:'none'});

			theDiv = _element.find('.introMan');
			theDiv.css({backgroundImage:'none'});

			theDiv = _element.find('.introSquash');
			theDiv.css({backgroundImage:'none'});

			theDiv = _element.find('.introHouse');
			theDiv.css({backgroundImage:'none'});
			
			theDiv = _element.find('.introCar');
			theDiv.css({backgroundImage:'none'});
		    
		    clearTimeout(_timerForIntroBlob);
	    }
	    
	    function rememberDesktopSize() {
	    	if (_element.innerWidth() > 0 && _element.innerHeight() > 0) {
		        _desktopSize.width = _element.innerWidth();
		        _desktopSize.height = _element.innerHeight();
	    	}
		    
	    }
				
		function init() {
				
			var template = 
				'<div class="desktop">'+
					'<div class="introText"></div><div class="introArrow"></div><div class="introHouse"></div><div class="introMan"></div><div class="introSquash"></div><div class="introBike"></div><div class="introCar"></div><div class="addButton"></div><div class="closeButton"></div><div class="watermark">'+
					'</div>'+
				'</div>';
			
			_element = $(template).appendTo(container);

			
			/*
			setInterval(function(){
				console.log('Width: %f', _element.innerWidth()); 	
			}, 500);
			*/
			
			
            _element.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {
                _element.find('.title').removeClass('selected');
                
                clearIntroBlob();
			                
             }); 
             
            _element.find('.addButton').on("mousedown touchstart", function(event) {

        		$.mobile.changePage('../pages/rental.html');
	        });
	         
	        
            _element.find('.closeButton').on("mousedown touchstart", function(event) {
                self.editMode(false);
	        });

	        _page.on('pageshow', rememberDesktopSize);
	        _page.on('pagebeforehide', rememberDesktopSize);
	        $(window).on('resize.desktop', rememberDesktopSize);

            // Remove all my notifications when the element is destroyed
            _element.on('removed', function() {
                Notifications.off('.desktop');
                $(document).off('.desktop');
                $(window).off('.desktop');
            });

			var gopher = Gopher;
			
			var rentals = Model.Rentals.fetch(); 
			var reservations = Model.Reservations.fetch(); 
			var customers = Model.Customers.fetch(); 
			var settings = Model.Settings.fetch('desktop', 'layout');
			var icons = gopher.request('GET', 'icons/all');
			
			rentals.done(gotRentals);
			reservations.done(gotReservations);
			customers.done(gotCustomers);
			settings.done(gotSettings);
			icons.done(gotIcons);
			
			$('body').spin("large");
			
			$.when(rentals, reservations, customers, settings, icons).then(function() {
    			$('body').spin(false);
    			
				rememberDesktopSize();
				
				if (Object.keys(_rentals).length == 0) {
					// No objects created, enter edit mode so user can add objects
                	self.editMode(true);
                	ShowIntroBlob();
                }
				else { 
                	placeRentals();
					updateRentalAvailability();			
    			}
			});
			
			_element.on('updatelayout', function() {
    			debugger;
    			placeRentals();
			})
			
			enableEscKey();
	        				
		};
		
		function positionItem(item, col, row, speed) {

            var maxCols = computeMaxCols();
            var maxRows = computeMaxRows();
            var rental  = item.data('rental');
            
            row = Math.min(row, maxRows - 1);
            row = Math.max(row, 0);

            col = Math.min(col, maxCols - 1);
            col = Math.max(col, 0);
            
            var x = _options.iconMargin + (col * (_options.iconSize + _options.iconSpacing));
            var y = _options.iconMargin + (row * (_options.iconSize + _options.iconSpacing));

            // Store the position
            item.data('position', {x:col, y:row});
            
            if (isNumeric(speed))
                item.transition({left:x, top:y}, speed, 'ease-in-out');
            else
                item.css({left:x, top:y});
    		
		}

		function isPositionAvailable(col, row) {

			var available = true;
			
            _element.find('.item').each(function() {
	            var position = $(this).data('position');
	            
	            if (position.x == col && position.y == row) {
		            available = false;
		            return false;
	            }
            });
			
			return available;
		}
		
		function updateRental(rental) {

            _element.find('.item').each(function(index) {
            
                var item = $(this);

                if (rental.id == item.data('rental').id) {
                    var title = item.find('.title');
                    var image = item.find('img');
                    
                    image.attr('src', '../images/symbols/' + _icons[rental.icon_id].image);
                    title.text(rental.name);

                    item.data('rental', rental);
                    
                    return false;
                }
            });
		}
		
		function addRentalToScene(rental, col, row) {
			var template = 				
				'<div class="item">'+
					'<div class="icon"><img/></div>'+
					'<br>'+
					'<div class="title"></div>'+
				'</div>'

            var item = $(template);
            var image = item.find('img');
            
            if (rental.icon_id)
                image.attr('src', '../images/symbols/' + _icons[rental.icon_id].image);
            else
                image.attr('src', '../images/symbols/0000.png');

            _element.append(item);
            
            //item.css({width:_options.iconSize+10, height:_options.iconSize+10});
            item.data('rental', rental);

            //image.css({width:_options.iconSize, height:_options.iconSize});
            
            if (rental.name) {
                var title = item.find('.title');

                title.text(rental.name);
                
                // Ignore mousedown on the title
                title.on("mousedown touchstart", function(event){
	                event.preventDefault();
	                event.stopPropagation();
                });
            }
            
            positionItem(item, col, row);
            enableMouseActions(item);

            return item;
    		
		}
		
		
		function bringItemToTop(item) {
    		var parent = item.parent();

			// Detach and attach again so it will be on top        		 
    		item.detach();
    		parent.append(item);
			
		}
		
		function removeReservation(reservation) {
    		Model.Reservations.remove(reservation);

		}
		
		function editReservation(reservation) {

    		$.mobile.changePage('../pages/reservation.html', {pageData:{reservation:reservation}})
		}
				
		function ShowIntroBlob() {
			var introTextDiv = _element.find('.introText'); 
			var introArrowDiv = _element.find('.introArrow');
			var introHouseDiv =  _element.find('.introHouse');
			var introManDiv =  _element.find('.introMan');
			var introSquashDiv =  _element.find('.introSquash');
			var introBikeDiv = _element.find('.introBike'); 
			var introCarDiv =  _element.find('.introCar');

			introTextDiv.css({backgroundImage:'url(../images/intro-text.png)'});
			introArrowDiv.css({backgroundImage:'url(../images/intro-arrow.png)'});
			
			introHouseDiv.css({backgroundImage:'url(../images/intro-object-house.png)'});
			introManDiv.css({backgroundImage:'url(../images/intro-object-man.png)'});
			introSquashDiv.css({backgroundImage:'url(../images/intro-object-squash.png)'});
			introBikeDiv.css({backgroundImage:'url(../images/intro-object-bike.png)'});
			introCarDiv.css({backgroundImage:'url(../images/intro-object-car.png)'});

			_timerForIntroBlob = setInterval(function() {
				introHouseDiv.transition({ y: '-=15', duration:200, easing:'easeOutQuart', delay:500}).transition({ y: '+=15', duration:200, easing:'easeInQuint'});
				introManDiv.transition({ y: '-=15', duration:200, easing:'easeOutQuart', delay:600}).transition({ y: '+=15', duration:200, easing:'easeInQuint'});
				introSquashDiv.transition({ y: '-=15', duration:200, easing:'easeOutQuart', delay:700}).transition({ y: '+=15', duration:200, easing:'easeInQuint'});
				introBikeDiv.transition({ y: '-=15', duration:200, easing:'easeOutQuart', delay:800}).transition({ y: '+=15', duration:200, easing:'easeInQuint'});			
				introCarDiv.transition({ y: '-=15', duration:200, easing:'easeOutQuart', delay:900}).transition({ y: '+=15', duration:200, easing:'easeInQuint'});

				introArrowDiv.transition({ x:'+=3', y:'-=4', duration:200, delay:1000}).transition({ x: '-=3', y:'+=4', duration:200});
				introArrowDiv.transition({ x:'+=3', y:'-=4', duration:200, delay:0}).transition({ x: '-=3', y:'+=4', duration:200});
				introArrowDiv.transition({ x:'+=3', y:'-=4', duration:200, delay:0}).transition({ x: '-=3', y:'+=4', duration:200});

		  	}, 3000);
		  	
		}

		function BounceButtons() {	
					
			_element.find('.closeButton').transition({ scale: 2 }, 300);
			_element.find('.closeButton').transition({ scale: 1 }, 400);

			_element.find('.addButton').transition({ scale: 2 }, 300);
			_element.find('.addButton').transition({ scale: 1 }, 400);
			
		}
		
		function SetupEditMode() {
			var watermarkDiv = _element.find('.watermark'); 
			watermarkDiv.css({backgroundImage:'url(../images/watermark-edit-mode.png)'});
			
			_element.find('.addButton').append('<img class="icon" src=../images/icons/add.png>');
			bringItemToTop(_element.find('.addButton'));
			
			_element.find('.closeButton').append('<img class="icon" src=../images/icons/close.png>');
			bringItemToTop(_element.find('.closeButton'));
			
			_element.addClass('editMode');
			
			BounceButtons();

		}
		

		function CloseEditMode() {
			var watermarkDiv = _element.find('.watermark'); 
			watermarkDiv.css({backgroundImage:'none'});
			
			// Remove buttons from desktop
			_element.find('.addButton').text('');
			_element.find('.closeButton').text('');
			
			clearIntroBlob();
            
            _element.removeClass('editMode');

		}

		
        function disableMouseActions() {
            _element.find('.item').each(function(index){
                $(this).off();    
            });
        }
        	
        function enableMouseActions(item) {
            if (self.editMode())
                enableDragDrop(item);
            else
                enableClicks(item);
        }
        
        function enableClicks(item) {
        
            item.on('doubletap', function(event) {

        		var rental = item.data('rental');
        		var reservation = getReservationForRental(rental);
        		
    		    if (reservation == null) {
    		        newReservation(rental);
    	        }

    		    if (reservation != null) {
        		    editReservation(reservation);
    	        }
            });

            item.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {

                if (!event.shiftKey) {
                    _element.find('.title.selected').removeClass('selected');
                }
                
                item.find('.title').addClass('selected');
                
				bringItemToTop(item);    				

                event.stopPropagation();
				event.preventDefault();
            });
            
        };
        
		function enableDragDrop(item) {
		
            item.on('doubletap', function(event) {

        		var rental = item.data('rental');
        		var reservation = getReservationForRental(rental);

        		var pageData = {};
        		pageData.rental = rental;
        		
        		$.mobile.changePage('../pages/rental.html', {pageData: pageData});

            });

            item.on(isTouch() ? 'touchstart' : 'mousedown', function(event){

                event.stopPropagation();
				event.preventDefault();

				var pageX = event.originalEvent.pageX;
				var pageY = event.originalEvent.pageY;

				var parent = item.parent();
				var icon = item.find('.icon');
				var title = item.find('.title');

				if (!icon.hitTest(pageX, pageY))
				    return;
				
				
				var offsetX = pageX - parent.offset().left - item.position().left;
				var offsetY = pageY - parent.offset().top - item.position().top;
				
				bringItemToTop(item);    				


                var dragging = true;
                var moved = false;
                                
                if (!event.shiftKey) {
                    _element.find('.title.selected').removeClass('selected');
                    
                }
                
                title.addClass('selected');
                
                
                $(document).on(isTouch() ? 'touchmove.desktop-dragdrop' : 'mousemove.desktop-dragdrop', function(event){

					event.preventDefault();
					event.stopPropagation();

                    moved = true;
                    
                    // Update pageX and pageY since the "touchend" event does not contain valid values for pageX and pageY
                    pageX = event.originalEvent.pageX;
                    pageY = event.originalEvent.pageY;
                    
                    var x = pageX - parent.offset().left - offsetX;
                    var y = pageY - parent.offset().top - offsetY;
                    
                    x = Math.max(x, 0);
                    x = Math.min(x, parent.innerWidth() - item.outerWidth());
                    y = Math.max(y, 0);
                    y = Math.min(y, parent.innerHeight() - item.outerHeight());
                    
                    item.css({left:x, top:y});
                    
                });
                
                $(document).on(isTouch() ? 'touchend.desktop-dragdrop' : 'mouseup.desktop-dragdrop', function(event){
					event.preventDefault();
					event.stopPropagation();

					// Use event.pageX and event.pageY if "mouseup" otherwise use last value of pageX/pageY
					if (event.type == "mouseup") {
    					pageX = event.originalEvent.pageX;
    					pageY = event.originalEvent.pageY;
					}

                    var x = pageX - parent.offset().left - offsetX;
                    var y = pageY - parent.offset().top - offsetY;

                    dragging = false;

                    var row = Math.round((y - _options.iconSpacing) / (_options.iconSize + _options.iconSpacing));
                    var col = Math.round((x - _options.iconSpacing) / (_options.iconSize + _options.iconSpacing));

                    $(document).off(".desktop-dragdrop");
                    
                    if (moved) {
                    
                        positionItem(item, col, row, 300);
                        saveSettings();
                    }
                    
                });
            });
    		
		}
		
		init();
		
		this.startDate = startDate;
		this.endDate = endDate;
				
		this.editMode = function(value) {
		    if (value == undefined)
		        return _editMode;
		        
		    // Show user if he is in edit mode
		    if (value)
		    	SetupEditMode();	    
		    else
		    	CloseEditMode();
		    
		    _editMode = value ? true : false;
		    
		    disableMouseActions();
		    
		    _element.find('.item').each(function(index){
    		    enableMouseActions($(this));
		    });
        }
              		
	}
	
	
	
	return Desktop;
	
        
});

