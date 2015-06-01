(function() {

	var dependencies = [
		'i18n!./reservation.json',
		'../../widgets/picker/picker.js',
		'../../widgets/deletebutton/deletebutton.js',
		'../../js/parser'
	];

	define(dependencies, function(i18n) {

		function Module(page) {

			var _element = page.element;
			var _elements = {};

			var _timer = null;
			var _modal = null;
			var _customer = {};
			var _reservation = page.params.reservation;
			var _customers = [];
			var _startDate = _reservation.begin_at;
			var _endDate = _reservation.end_at;
			var _stickySymbols = [];
			var _lastLineCount = -1;
						
			var lineIsTwitter = 1;
			var lineIsMail = 2;
			var lineIsMobile = 3;
			var lineIsLocation = 4;
			var lineIsName = 5;
			var lineIsInfo = 6;
			
			var intro = '<div class="iconwrapper">';
			var outro = '</div>';
						
			iconName =     '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path class="softgreen" d="M407.448,360.475c-59.036-13.617-113.989-25.541-87.375-75.718c81.01-152.729,21.473-234.406-64.072-234.406c-87.231,0-145.303,84.812-64.072,234.406c27.412,50.481-29.608,62.394-87.375,75.718c-59.012,13.608-54.473,44.723-54.473,101.176h411.838C461.919,405.195,466.458,374.083,407.448,360.475z"/></svg>';
			iconLocation = '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path class="softgreen" d="M256,50c-72.072,0-130.5,58.427-130.5,130.5S182.614,336.333,256,462c73.388-125.666,130.5-209.427,130.5-281.5S328.074,50,256,50z M256,224.133c-25.848,0-46.801-20.953-46.801-46.8s20.953-46.8,46.801-46.8c25.848,0,46.801,20.953,46.801,46.8S281.848,224.133,256,224.133z"/></svg>';
			iconMobile =   '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path class="softgreen" d="M321.245,50.098v44.82h-140.49c-13.808,0-25,11.193-25,25v316.984c0,13.807,11.192,25,25,25h150.49c13.807,0,25-11.193,25-25V50.098H321.245z M220.996,416.434H190v-24.5h30.996V416.434z M220.996,372.141H190v-24.5h30.996V372.141zM220.996,327.848H190v-24.5h30.996V327.848z M271.498,416.434h-30.996v-24.5h30.996V416.434z M271.498,372.141h-30.996v-24.5h30.996V372.141z M271.498,327.848h-30.996v-24.5h30.996V327.848z M322,416.434h-30.996v-24.5H322V416.434z M322,372.141h-30.996v-24.5H322V372.141z M322,327.848h-30.996v-24.5H322V327.848z M322,270.434H190V145.348h132V270.434z"/></svg>';
			iconMail =     '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path class="softgreen" d="M170.544,239.052L50,146.454v213.142L170.544,239.052z M460.928,103.407H51.416l204.593,157.161L460.928,103.407z M313.355,260.695l-57.364,43.994l-57.454-44.135L50.5,408.593h410.751L313.355,260.695z M341.367,239.212L462,359.846V146.693L341.367,239.212z"/></svg>';
			iconTwitter =  '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path class="softgreen" d="M462,128.223c-15.158,6.724-31.449,11.269-48.547,13.31c17.449-10.461,30.854-27.025,37.164-46.764c-16.333,9.687-34.422,16.721-53.676,20.511c-15.418-16.428-37.387-26.691-61.698-26.691c-54.56,0-94.668,50.916-82.337,103.787c-70.25-3.524-132.534-37.177-174.223-88.314c-22.142,37.983-11.485,87.691,26.158,112.85c-13.854-0.438-26.891-4.241-38.285-10.574c-0.917,39.162,27.146,75.781,67.795,83.949c-11.896,3.236-24.926,3.979-38.17,1.447c10.754,33.58,41.972,58.018,78.96,58.699C139.604,378.282,94.846,390.721,50,385.436c37.406,23.982,81.837,37.978,129.571,37.978c156.932,0,245.595-132.552,240.251-251.435C436.339,160.061,450.668,145.174,462,128.223z"/></svg>';
			iconInfo =     '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path class="softgreen" d="M255.998,50.001C142.229,50.001,50,142.229,50,255.999c0,113.771,92.229,206,205.998,206c113.771,0,206.002-92.229,206.002-206C462,142.229,369.77,50.001,255.998,50.001z M289.025,377.242h-64.05V226.944h64.05V377.242zM257,196.884c-19.088,0-34.563-15.476-34.563-34.564c0-19.088,15.475-34.563,34.563-34.563c19.09,0,34.562,15.476,34.562,34.563C291.562,181.409,276.09,196.884,257,196.884z"/></svg>';
			iconUnknown =  '<svg class="icontextarea" width="20px" height="20px" viewBox="0 0 512 512"><path fill="#c7c7c7"    d="M259.462,462c-24.864,0-45.03-20.166-45.03-45.039c0-24.859,20.166-45.02,45.03-45.02c24.87,0,45.029,20.158,45.029,45.02C304.491,441.834,284.332,462,259.462,462z M294.865,328.9v8.1c0,0-67.513,0-74.229,0v-8.1c0-22.922,3.344-52.326,29.956-77.891c26.613-25.567,59.87-46.687,59.87-78.625c0-35.309-24.503-53.985-55.399-53.985c-51.483,0-54.846,53.393-56.115,65.149H126.75C128.673,127.874,152.206,50,255.494,50c89.513,0,129.756,59.949,129.756,116.166C385.25,255.646,294.865,271.189,294.865,328.9z"/></svg>';

			function search() {
/*				var query = _elements.contact.val().trim();

				if (_timer != null) {
					clearTimeout(_timer);
					_timer = null;
				}

				if (query.length > 0 && query.split('\n').length == 1) {
					console.log('searching for ' + query);
					var request = Model.Customers.search(query);

					request.done(function(customers) {

						_customers = customers;

						if (customers.length > 0) {
							_elements.selectcustomer.removeClass('ui-disabled');
						}
						else
							_elements.selectcustomer.addClass('ui-disabled');

						$.each(customers, function(index, customer) {
							console.log(customer.name);
						});

					});

				}*/
			}
			
			function updateDates() {
				var sDate = moment(_startDate);
				var eDate = moment(_endDate);

				_elements.dateinput.val(sDate.format('L') + " - " + eDate.format('L'));				
			}

			function updateContactFromCustomer(customer) {
				var text = '';

				var items = [customer.name, customer.email, customer.phone, customer.notes];

				$.each(items, function(index, item) {
					if (item && item.length > 0) {
						if (text.length > 0)
							text += '\n';

						text += item.trim();
					}
				});

				_elements.contact.val(text);

			}

			function updateCustomerFromContact(customer) {
				var contact = _elements.contact.val().trim();

				var lines = contact.replace(/\r\n/g, '\n').split('\n');
				var index = 0;
				var notes = [];

				customer.name = '';
				customer.phone = '';
				customer.email = '';
				customer.notes = '';

				if (index < lines.length) {
					customer.name = lines[index++];
				}

				while (index < lines.length) {
					if (Parser.isEmail(lines[index])) {
						customer.email = lines[index++];
						continue;
					}
					if (Parser.isPhoneNumber(lines[index])) {
						customer.phone = lines[index++];
						continue;
					}

					notes.push(lines[index++]);
				}

				customer.notes = notes.join('\n');
			}


			function enableEnterKey() {

				_elements.html.on('keydown', function(event) {
					//if (event.keyCode == 13)
					//  _elements.okButton.trigger('click');
					if (event.keyCode == 27)
						_modal.close();
				});

			};


			function updateDOM() {

				var beginAt = new Date(_reservation.begin_at);
				var endAt = new Date(_reservation.end_at);

/*				_elements.startdate.date.text(beginAt.yyyymmdd());
				_elements.enddate.date.text(endAt.yyyymmdd());*/

				_elements.price.val(_reservation.price);
				_elements.arrived.attr('checked', _reservation.arrived ? true : undefined);
				_elements.transferred.attr('checked', _reservation.transferred ? true : undefined);
				_elements.payed.attr('checked', _reservation.payed ? true : undefined);
				_elements.delivered.attr('checked', _reservation.delivered ? true : undefined);

				_elements.arrived.checkboxradio('refresh');
				_elements.transferred.checkboxradio('refresh');
				_elements.payed.checkboxradio('refresh');
				_elements.delivered.checkboxradio('refresh');
				
				_elements.resourcename.text(_rental.name);
			}
			
			function identifyLine(str) {	

				if (Parser.isTwitter(str))
					return lineIsTwitter;										
				else if (str.length < 5)
					return -1;
				else if (Parser.wordCountGreaterThan(str, 4))
					return lineIsInfo;
				else if (Parser.isEmail(str))
					return lineIsMail;
				else if (Parser.isPhoneNumber(str))
					return lineIsMobile;
				else if (Parser.isName(str))
					return lineIsName;
				else if (Parser.isAddress(str))
					return lineIsLocation;
				else 
					return -1; 
				
			}
			
			function replaceSymbolAndCloseMenu(element, symbol, lineID) {
				var i = element.id.replace( /^\D+/g, '');
				
				_stickySymbols[i] = lineID;
				
				// Replace svg in clicked DIV
				$(element).children().remove();
				$(element).append(symbol).find('path').attr('class', 'hardgreen');	
				_elements.popup.reservation.content.popup('close');				
			}
			
			function getLineCount(textarea) {
				return textarea[0].value.split("\n").length;			 	
			}
			
			function getLineNumber(textarea) {
				return textarea[0].value.substr(0, textarea[0].selectionStart).split("\n").length;
    		}

			function enableButtonActions() { 

				_elements.contact.on('keyup', function(event) {
					var hasName = false;
					var lines = _elements.contact.val().split('\n'); 
					var stickySymbol = false;
					var newLineCount = getLineCount(_elements.contact);
					
					if (event.keyCode == 8) {
						if (lines[0].length == 0) {
							// Erase first line sticky symbol
							_stickySymbols[0] = 0;							
						}
							
						if (_elements.contact.val().length == 0) {
							// No text, clear all
							_stickySymbols.length = 1;
							_stickySymbols[0] = 0;
						}
					}

					if (_lastLineCount != newLineCount) {
						var txt = _elements.contact.val();
						var lastOnLine = (txt.charAt(_elements.contact.prop("selectionStart")) == '\n') || (_elements.contact.prop("selectionStart") == _elements.contact.val().length);

						// Line count has changed, fix sticky symbol array
						if (lastOnLine)
							(_lastLineCount < newLineCount) ? _stickySymbols.splice(getLineNumber(_elements.contact) - 1, 0, 0) : _stickySymbols.splice(getLineNumber(_elements.contact), _lastLineCount - newLineCount);
						else	
							(_lastLineCount < newLineCount) ? _stickySymbols.splice(getLineNumber(_elements.contact) - 2, 0, 0) : _stickySymbols.splice(getLineNumber(_elements.contact) - 1, _lastLineCount - newLineCount);

/*						if (_lastLineCount < newLineCount) {
							// Added line
							if (lastOnLine)
								_chosenSymbol.splice(getLineNumber(_elements.contact) - 1, 0, 0);
							else	
								_chosenSymbol.splice(getLineNumber(_elements.contact) - 2, 0, 0);
						}
						else {
							// Line is removed
							if (lastOnLine)
								_chosenSymbol.splice(getLineNumber(_elements.contact), _lastLineCount - newLineCount);
							else
								_chosenSymbol.splice(getLineNumber(_elements.contact) - 1, _lastLineCount - newLineCount);															
						}*/
					}
					
					_lastLineCount = getLineCount(_elements.contact);	

					_elements.iconarray.empty();
					
					for(var i in lines) {
						if (lines[i].length > 0) {
							
							if (_stickySymbols[i] != undefined && _stickySymbols[i] != 0) {
								lineID = _stickySymbols[i];
								stickySymbol = true;
							}
							else {
								lineID = identifyLine(lines[i]);
								stickySymbol = false;
							}
							
							switch(lineID) {
								
							    case lineIsTwitter:
							    	chosenIcon = iconTwitter;
							        break;
							        
							    case lineIsMobile:
							    	chosenIcon = iconMobile;
							        break;
							        
							    case lineIsMail:
							    	chosenIcon = iconMail;
							        break;
							        
							    case lineIsName:
							    	if (hasName && !stickySymbol) // If we already have a name, its probably an address
								    	chosenIcon = iconLocation;	
							    	else {
							    		chosenIcon = iconName;
							    		hasName = true;
							    	}
							        break;
							        
							    case lineIsLocation:
							    	chosenIcon = iconLocation;
							        break;
							        
							    case lineIsInfo:
							    	chosenIcon = iconInfo;
							        break;							    
							        
							    default:
							    	chosenIcon = iconUnknown;

							}
							
							var tag = $(intro + chosenIcon + outro);
							
							tag.appendTo(_elements.iconarray).css('top', i * 22 + 23).attr('id', 'row' + i);
							
							// Show 'sticky' symbol with darker color
							if (stickySymbol)
								tag.find('path').attr("class", "hardgreen");
						
							tag.on('tap', function(event) {
								
								var tappedElement = this;

								_elements.popupname.one('tap', function(event) {
									replaceSymbolAndCloseMenu(tappedElement, iconName, lineIsName);
								});	

								_elements.popuplocation.one('tap', function(event) {
									replaceSymbolAndCloseMenu(tappedElement, iconLocation, lineIsLocation);
								});	

								_elements.popupmobile.one('tap', function(event) {
									replaceSymbolAndCloseMenu(tappedElement, iconMobile, lineIsMobile);
								});	

								_elements.popupinfo.one('tap', function(event) {
									replaceSymbolAndCloseMenu(tappedElement, iconInfo, lineIsInfo);										
								});
								
								var options = {
									dismissible: true,
									transition: "pop",
									positionTo: $(this)
								};
			
								_elements.popup.reservation.content.popup(options);								
								_elements.popup.reservation.content.popup('open');
																
							});
							
						}
							
					}						
				
					growShrinkRows(this);
						
					event.preventDefault();
					event.stopPropagation();

					if (_timer != null) {
						clearTimeout(_timer);
						_timer = null;
					}

					_timer = setTimeout(search, 500);

				});

				function popupHTML(html, options) {


					var popup = $('<div data-role="popup"></div>');

					function close(event) {

						if (options.afterclose && isFunction(options.afterclose)) {
							options.afterclose.apply(undefined, arguments)
						}

						$(event.target).remove();
					}

					var defaults = {
						afterclose: close
					};

					popup.append(html);
					popup.appendTo($.mobile.activePage);
					popup.trigger('create');
					popup.popup($.extend({}, options, defaults));
					popup.popup('open');

					return popup;
				}

				/*_elements.startdate.button.on('tap', function() {

				});

				_elements.enddate.button.on('tap', function() {


				});

				_elements.selectcustomer.on('tap', function(event) {

					event.preventDefault();
					event.stopPropagation();


					if (_customers.length == 0)
						return;

					var popup;
					var listview = $('<ul data-role="listview" data-inset="true" data-theme="a"></ul>');

					$.each(_customers, function(index, customer) {

						var li = $('<li data-icon="false"></li>');
						var a = $('<a href="#"></a>');
						var p = $('<p></p>')
						var h3 = $('<h1></h1>')

						h3.text(customer.name);
						p.text(customer.email);
						a.data('customer', customer);

						a.on('tap', function() {

							var customer = $(this).data('customer');

							_customer = customer;
							updateContactFromCustomer(customer);

							popup.popup('close');
						});

						a.append(h3);
						a.append(p);
						li.append(a);

						listview.append(li);
					});

					var options = {
						dismissible: true,
						//theme: "d",
						//overlyaTheme: "a",
						transition: "pop",
						positionTo: _elements.selectcustomer
					};

					popup = $('<div data-id="MYPOPUP" data-role="popup" data-theme="a"></div>');

					popup.appendTo($.mobile.activePage);
					popup.append(listview);
					popup.trigger('create');
					popup.popup(options);
					popup.popup('open');
				});*/
				
				_elements.back.on('tap', function(event) {
					$.mobile.pages.pop();
				});

				_elements.save.on('tap', function() {

					if (_elements.contact.val().trim().length == 0) {
						return;
					}

					updateCustomerFromContact(_customer);

					var saveCustomer = Model.Customers.save(_customer);

					saveCustomer.done(function(customer) {
						_reservation.customer_id = customer.id;
						_reservation.rental_id = _rental.id;
						_reservation.state = 1;
						_reservation.price = _elements.price.val();
						_reservation.arrived = _elements.arrived.is(':checked');
						_reservation.delivered = _elements.delivered.is(':checked');
						_reservation.payed = _elements.payed.is(':checked');
						_reservation.transferred = _elements.transferred.is(':checked');

						console.log('Adding reservation', _reservation);

						var saveReservation = Model.Reservations.save(_reservation);

						saveReservation.done(function(reservation) {
							console.log('Reservation added', reservation);
							$.mobile.pages.pop();
						});

					});


				});

				_elements.remove.on('delete', function() { 
					Model.Reservations.remove(_reservation).done(function() {
						$.mobile.pages.pop();
					});
				});

			}
			
			function fillOptionPicker() {
				var firstID;
							
				_elements.options.picker();

				$.each(_options, function(index, option) {
					if ($.inArray(option.id, _rental.option_ids) != -1) {
						if (firstID == undefined)
							firstID = option.id;
						_elements.options.picker('add', option.id, option.name + " (" + option.description + ")");
					}
				});

				if (firstID != undefined)
					_elements.options.picker('select', firstID);

				_elements.options.picker('refresh');
			}
						
			function growShrinkRows(textArea) {
			
				if (navigator.appName.indexOf("Microsoft Internet Explorer") == 0) {
					textArea.style.overflow = 'visible';
					return;
				}
				
				while (textArea.rows > 1 && textArea.scrollHeight < textArea.offsetHeight) {
					textArea.rows--;
				}
				
				while (textArea.scrollHeight > textArea.offsetHeight) {
					textArea.rows++;
				}
				
				textArea.rows++;

			}			

			this.init = function() {

				_element.hookup(_elements, 'data-id');
				_element.trigger('create');
				_element.i18n(i18n);
				
				// Show symbols in popup menu
				$(iconName).appendTo(_elements.popupname).css('vertical-align', 'top').attr("class", "menusymbol");
				$(iconLocation).appendTo(_elements.popuplocation).css('vertical-align', 'top').attr("class", "menusymbol");
				$(iconMobile).appendTo(_elements.popupmobile).css('vertical-align', 'top').attr("class", "menusymbol");
				$(iconInfo).appendTo(_elements.popupinfo).css('vertical-align', 'top').attr("class", "menusymbol");
				
				_element.on("pageshow", function () {
					_elements.contact.focus();
				});									
				
				_elements.popup.reservation.content.on("popupafterclose", function() {
					_elements.popupname.off();
					_elements.popuplocation.off();
					_elements.popupmobile.off();
					_elements.popupinfo.off();
				});
				
				_elements.dateinput.on('tap', function(event) {
					var caretPos = _elements.dateinput.textrange('get', 'position');
					var lengthOfDate = moment(_startDate).format('L').length;
					var dateStr;
					var showIt = false;
					
					
					// Tap on start date?
					if (caretPos && (caretPos < lengthOfDate)) {
					
						dateStr = _elements.dateinput.val().substring(0, lengthOfDate);
						
						// If valid date, select and show mobiscroll
						if (moment(dateStr).isValid()) {
							_elements.dateinput.textrange('set', 0, lengthOfDate);
							showIt = true;
						}
						
					}
					 // Tap on end date?
					else if (caretPos > lengthOfDate+3 && caretPos < 2*lengthOfDate+3) {
					
						dateStr = _elements.dateinput.val().substring(lengthOfDate+3);
						
						// If valid date, select and show mobiscroll						
						if (moment(dateStr).isValid()) {
							_elements.dateinput.textrange('set', lengthOfDate+3, lengthOfDate);
							showIt = true;
						}
						
					}

					if (showIt) {

						function dateChanged(value, instance) {							
							if (caretPos < lengthOfDate) {
								_startDate = new Date(value);
								updateDates();									
							}
							else {
								_endDate = new Date(value);
								updateDates();									
							}
						}

						var d = new Date(dateStr);				
						_elements.divformobiscroll.mobiscroll('setDate', d, false);						
						_elements.divformobiscroll.mobiscroll('option', {onSelect: dateChanged});

						_elements.divformobiscroll.mobiscroll('show');
						
					}

				});
				
				_elements.remove.deletebutton('setCaption', i18n.text('button-cancel-reservation', 'Cancel'));
				
				if (!_reservation.id)
					_elements.remove.addClass('hidden');

				//if (_reservation.customer_id)
					//_elements.selectcustomer.addClass('hidden');
					
				_elements.divformobiscroll.mobiscroll().date({
					display: 'bubble',
					anchor: _elements.dateinput,
					showOnTap: false,
					showOnFocus: false
				});

				_elements.save.text(_reservation.id == undefined ? i18n.text('button-book', 'Book') : i18n.text('button-save', 'Save'));
			}
			
			this.refresh = function(callback) {
				
				$.spin(true);
				
				updateDates();		
								
				var requests = [];

				// Load rental if ID specified
				if (_reservation.rental_id) {
					var request = Model.Rentals.fetch(_reservation.rental_id);

					requests.push(request);

					request.done(function(rental) {
						_rental = rental;
					});
				}

				// Load customer if specified
				if (_reservation.customer_id) {
					var request = Model.Customers.fetch(_reservation.customer_id);

					requests.push(request);

					request.done(function(customer) {
						_customer = customer;
					});
				}
				
				// Load options
				if (true) {
					var request = Model.Options.fetch();

					requests.push(request);
	
 					request.done(function(options) {
	 					_options = options;
					});					
				}

				$.when.apply(this, requests).then(function() {

					if (_customer)
						updateContactFromCustomer(_customer);

					fillOptionPicker();						
					updateDOM();
					enableButtonActions();

					callback();
					$.spin(false);

				});

			}
			
		}

		return Module;


	});


})();
