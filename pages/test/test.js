(function() {



	var dependencies = [
		'../../widgets/symbolpicker/symbolpicker.js',
		'../../widgets/common/list.js',
		'../../widgets/picker/picker.js',
		'../../widgets/schedule/schedule-day.js',
		'../../widgets/schedule/scheduleweek.js'
	];

	define(dependencies, function() {

		function Module(page) {

			var _element = page.element;
			var _elements = {};

				

			
			

			
			function VemBjuderPaLunch() {


				function MontyHall(switchDoor) {
	
					// choose() - Returnerar slumpmässigt ett element i en vektor
					function choose(items) {
						return items[Math.floor((Math.random() * items.length))];
					}
	
					var success = 0;
					var iterations = 1000;
					
					for (var index = 0; index < iterations; index++) {
					
						// Skapa dörrarna, dvs slumpa en vektor med tre element där priset finns bakom en av dörrarna
						// En 1:a represenerar pris och en 0:a inget.
						var doors = choose([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
	
						// Välj en dörr (0, 1 eller 2)
						var selection = choose([0, 1, 2]);
	
						if (switchDoor) {

							// Då kollar vi dörren...
							if (doors[selection]) {
								// Jag råkade välja rätt dörr!
								// Det innebär att jag måste byta dörr och då finns det ju ingen rätt dörr att välja.
								// Jag måste ju byta en rätt dörr mot en felaktig.
								// Ingen poäng alltså...
								success += 0;
								
							}
							else {
								// Jag valde fel dörr. Den dörr jag valde innehöll inte priset och jag måste byta.
								// Däremot öppnade "programledaren" dörren för den andra felaktiga dörren
								// i.o.m. han inte kunde visa dörren med priset. Därför finns det bara en dörr kvar. Den rätta!
								
								success += 1;
								
							}

						}
						else {
							// Om priset var bakom den valda dörren har jag vunnit och får poäng!
							if (doors[selection]) {
								success++;
							}
	
							
						}

					}
	
					// Returnera sannolikheten i procent				
					return (success / iterations) * 100.0;
				}

				// Beräkna sannolikheten för att både byta och inte byta dörr...
				var MEG = MontyHall(true);
				var JBN = MontyHall(false);
				
				// Vem vinner? ;)
				if (MEG > JBN)
					console.log('MEG hade rätt såklart, JBN bjuder på lunch. Sannolikheterna är ', JBN, '% mot ', MEG, '%.');
				else
					console.log('JBN hade rätt såklart, MEG bjuder på lunch. Sannolikheterna är ', JBN, '% mot ', MEG, '%.'); 
			}


			_element.trigger('create');
			_element.hookup(_elements, 'data-id');
			
			_elements.A.scheduleweek();
			_elements.B.scheduleweek();

			_elements.A.on('selection-end', function(event, selection) {
				$(this).scheduleweek('select', selection, 'A');
				console.log($(this).scheduleweek('selection'));
			});

			_elements.B.on('selection-end', function(event, selection) {

				$(this).scheduleweek('select', selection, 'B');
				console.log($(this).scheduleweek('selection'));
				
			});

			this.init = function() {
				_elements.A.scheduleweek('selection', {'A':[200,201,202]});


			}
			
			VemBjuderPaLunch();

		}
		
		return Module;
	});


})();
