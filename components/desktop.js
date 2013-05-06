
define(['jquery', 'less!./desktop', 'pages/new-reservation', 'components/spinner', 'components/itempicker', 'components/popup-menu', 'components/notify', 'pages/new-rental'], function($) {

    
	var Spinner = require('components/spinner');
	var Notify = require('components/notify');

	Desktop = function(container, options) {

		var self = this;
		
		var _defaults = {
    		iconMargin:20,
    		iconSpacing:40,
    		iconSize:40
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

		function updateUI() {
    		if (_setNeedsLayout)
                updateRentalAvailability();
            
            _setNeedsLayout = false;    		
    		
		};

		Notifications.on('updateUI.desktop', function() {
    		updateUI();
		});

		Notifications.on('rental-added.desktop', function(rental) {
    		console.log("rental added");
            addRentalToScene(rental, 0, 0);
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
                var rental = item.data();
                
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
    		return Math.floor((_element.innerWidth() - 2 * _options.iconMargin) / (_options.iconSpacing + _options.iconSize));
		}

		function computeMaxRows() {
            return Math.floor((_element.innerHeight() - 2 * _options.iconMargin) / (_options.iconSpacing + _options.iconSize));
		}
		
		
		function newReservation(rental) {
			var module = require('pages/new-reservation');

			var reservation = {};
			reservation.begin_at = startDate();
			reservation.end_at = endDate();
			reservation.rental_id = rental.id;
			
    		module({
        		reservation:reservation
    		});
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
    		    orderAutomatically: false
		    };
			
			_settings = {};
            _settings = $.extend({}, defaults, settings);
		}


		function saveSettings() {
			Model.Settings.save('desktop', 'layout', _settings);
		}

		function gotCustomers(customers) {

    		_customers = {};
    		
			$.each(customers, function(i, customer) {
    			_customers[customer.id] = customer;
			});
    		
		}

		function loadCustomers(callback) {
						
			_customers = {};
			
			Model.Customers.fetch(function(customers) {
    		
    		    gotCustomers(customers);	

    			
    			if (isFunction(callback)) {
        			callback();
    			}
			});
    		
		}


		function gotIcons(icons) {
			_icons = icons;
		}

		function loadIcons(callback) {
			var gopher = new Gopher();
						
			_icons = {};
			
			gopher.get('icons/all', function(response) {
    			
    			if (response.data != null) {
        			gotIcons(response.data);
    			}
    			
    			if (isFunction(callback)) {
        			callback();
        			
    			}
			});
    		
		}
		
		function removeSelectedRental() {
    		var elements = _element.find('.title.selected');
    		
    		$.each(elements, function(i, element){
                var item = $(element).parent();
                var rental = item.data();
                
                Model.Rentals.remove(rental);
    		});    		
            
		};


		function gotRentals(rentals) {
			_rentals = {};

			$.each(rentals, function(i, rental) {
    			_rentals[rental.id] = rental;
			});
		}

		function loadRentals(callback) {
			var gopher = new Gopher();
						
			Model.Rentals.fetch(function(rentals) {
                gotRentals(rentals);    			

    			
    			if (isFunction(callback))
        			callback();
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
		
		function loadReservations(callback) {
        	
        	 _reservations = {};
                   
            Model.Reservations.fetch(function(reservations) {

                gotReservations(reservations);
                                
    			if (isFunction(callback))
        			callback();
                
            });
		}		
		
		function loadStuff(array, completed) {

    		var counter = 0;
    		
    		$.each(array, function(index, func) {

				func(function() {
                    if (++counter >= array.length) {
                        completed();            		
                    }
					
				});	    		
    		});
    		
		}
		
		function enableEscKey() {
		
            $(document).on('keyup.desktop', function(event) {
            	
                if (event.keyCode == 27) {
                	self.editMode(false);
                }
            });
	            
	    };
				
		function init() {
				
			var template = 
				'<div class="desktop">'+
					'<div class="addButton"></div><div class="closeButton"></div><div class="watermark">'+
					'</div>'+
				'</div>';
			
			_element = $(template).appendTo(container);

/*
            _element.on('touchstart touchend touchmove', function(event) {
                event.preventDefault();
            
                if (event.type == 'touchstart')
                    _element.find('.title').removeClass('selected');
            });            

*/    
            _element.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {
            	console.log('event - %s', event.type);
                _element.find('.title').removeClass('selected');
                
                // Remove delete icon
                _element.find('.deleteItem').text('');
                //event.preventDefault();
                //event.stopPropagation();
                
             }); 
             
            _element.find('.addButton').on("mousedown touchstart", function(event) {
	        	var module = require('pages/new-rental');
	        	module();
	        });
	        
	        
            _element.find('.closeButton').on("mousedown touchstart", function(event) {
                self.editMode(false);
	        });


            // Remove all my notifications when the element is destroyed
            _element.on('removed', function() {
                Notifications.off('.desktop');
                $(document).off('.desktop');
            });

			var spinner = new Spinner({
    			container:_element,
    			size:40
			});

			spinner.show();
						
			var gopher = new Gopher();
			
			var rentals = Model.Rentals.fetch(); //gopher.request('GET', 'rentals');
			var reservations = Model.Reservations.fetch(); //gopher.request('GET', 'reservations');
			var customers = Model.Customers.fetch(); //gopher.request('GET', 'customers');
			var settings = Model.Settings.fetch('desktop', 'layout');
			var icons = gopher.request('GET', 'icons/all');
			
			rentals.done(gotRentals);
			reservations.done(gotReservations);
			customers.done(gotCustomers);
			settings.done(gotSettings);
			icons.done(gotIcons);
			
			$.when(rentals, reservations, customers, settings, icons).then(function(){
    			spinner.hide();
                placeRentals();
                updateRentalAvailability();			
    			
			});
			
			enableEscKey();
	        				
		};
		
		function positionItem(item, col, row, speed) {

            var maxCols = computeMaxCols();
            var maxRows = computeMaxRows();
            var rental  = item.data();
            
            row = Math.max(row, 0);
            row = Math.min(row, maxRows);

            col = Math.max(col, 0);
            col = Math.min(col, maxCols);
            
            var x = _options.iconMargin + (col * (_options.iconSize + _options.iconSpacing));
            var y = _options.iconMargin + (row * (_options.iconSize + _options.iconSpacing));

            // Store the position
            _settings.positions[rental.id] = {
                x:col,
                y:row
            }
            
            if (isNumeric(speed))
                item.transition({left:x, top:y}, speed, 'ease-in-out');
            else
                item.css({left:x, top:y});
    		
		}
		
		function updateRental(rental) {

            _element.find('.item').each(function(index) {
            
                var item = $(this);

                if (rental.id == item.data().id) {
                    var title = item.find('.title');
                    var image = item.find('img');
                    
                    item.data(rental);
                    
                    title.text(rental.name);
                    image.attr('src', 'images/symbols/' + _icons[rental.icon_id].image);

            		title.css({top:item.outerHeight() + 2});
            		title.css({left:title.parent().innerWidth() / 2 - title.outerWidth() / 2});
                    
                }
            });
		}
		
		function addRentalToScene(rental, col, row) {
			var template = 				
				'<div class="item"><div class="deleteItem"></div>'+
					'<img/>'+
					'<div class="title"></div>'+
				'</div>'

            var item = $(template);
            var image = item.find('img').attr('src', 'images/symbols/' + _icons[rental.icon_id].image);

            _element.append(item);
            
            item.css({width:_options.iconSize+10, height:_options.iconSize+10});
            item.data(rental);

            image.css({width:_options.iconSize, height:_options.iconSize});
            
            if (rental.name) {
                var title = item.find('.title');

                title.text(rental.name);
        		//title.css({maxWidth:_options.iconSize});
                
        		title.css({top:item.outerHeight() + 2});
        		title.css({left:title.parent().innerWidth() / 2 - title.outerWidth() / 2});
                
                // Ignore mousedown on the title
                title.on("mousedown touchstart", function(event){
	                event.preventDefault();
	                event.stopPropagation();
                });
            }
            
            
            item.find('.deleteItem').on("mousedown touchstart", function(event) {
            	removeSelectedRental();
	        });
	        

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

			var module = require('pages/new-reservation');
		
    		module({
        		reservation: reservation
    		});
		}
		
		function BounceAddButton() {			
			_element.find('.icon').transition({ scale: 2 }, 400);
			_element.find('.icon').transition({ scale: 1 }, 400);
			
		}
		
		function SetupEditMode() {
			var watermarkDiv = _element.find('.watermark'); 
			watermarkDiv.css({backgroundImage:'url(images/watermark-edit-mode.png)'});
			
			_element.find('.addButton').append('<img class="icon" src=images/icons/add.png>');
			bringItemToTop(_element.find('.addButton'));
			
			_element.find('.closeButton').append('<img class="icon" src=images/icons/close.png>');
			bringItemToTop(_element.find('.closeButton'));
			
			_element.addClass('editMode');
			
			BounceAddButton();

		}
		

		function CloseEditMode() {
			var watermarkDiv = _element.find('.watermark'); 
			watermarkDiv.css({backgroundImage:'none'});
			
			// Fade out buttons
			_element.find('.icon').transition({ opacity: 0 }, 4000);
			// Remove buttons from desktop
			_element.find('.addButton').text('');
			_element.find('.closeButton').text('');

			// Remove delete icon on items
            _element.find('.deleteItem').text('');
            
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
                console.log("event - %s", event.type);

        		var rental = item.data();
        		var reservation = getReservationForRental(rental);
        		
    		    if (reservation == null) {
    		        newReservation(rental);
    	        }

    		    if (reservation != null) {
        		    editReservation(reservation);
    	        }
            });

            item.on(isTouch() ? 'touchstart' : 'mousedown', function(event) {
                console.log("event - %s", event.type);

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
        		var rental = item.data();
        		var reservation = getReservationForRental(rental);

    			var module = require('pages/new-rental');
    		
        		module({
            		rental:rental
        		});
            });

            item.on(isTouch() ? 'touchstart' : 'mousedown', function(event){

				var parent = item.parent();
				
				var pageX = event.originalEvent.pageX;
				var pageY = event.originalEvent.pageY;
				
				var offsetX = pageX - parent.offset().left - item.position().left;
				var offsetY = pageY - parent.offset().top - item.position().top;
				
				bringItemToTop(item);    				

                event.stopPropagation();
				event.preventDefault();

                var dragging = true;
                var moved = false;
                                
                if (!event.shiftKey) {
                    _element.find('.title.selected').removeClass('selected');
                    
                    // Remove delete icon
                    _element.find('.deleteItem').text('');
                }
                
                item.find('.title').addClass('selected');
                // Show delete icon if selected  
            	item.find('.deleteItem').append('<img class="icon" src=images/icons/icon-delete.png>');
                
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

