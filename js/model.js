(function() {



	Model = {};

	var gopher = Gopher;

	////////////////////////////////////////////////////////////////////////////


	function requests(name) {

		var model = {};

		model.cache = null;

		model.trigger = function(event, param) {
			$(model).trigger(event, param);
		}

		model.on = function(event, callback) {
			$(model).on(event, function(event, param) {
				callback(param);
			});
		}

		model.off = function(event) {
			$(model).off(event);
		}


		model.fetch = function() {

			function fetchOne(id) {
				var request = gopher.request('GET', sprintf('%s/%d', name, id));

				if (model.cache != null) {
					request.done(function(item) {
						model.cache[item.id] = item;
					});
				}

				return request;

			}

			function fetchAll() {
				if (model.cache == null) {
					var request = gopher.request('GET', sprintf('%s', name));

					request.done(function(items) {
						model.cache = {};

						$.each(items, function(index, item) {
							model.cache[item.id] = item;
						});
					});

					return request;

				}
				else {
					var defer = $.Deferred();
					var items = [];

					for (key in model.cache) {
						items.push(model.cache[key]);
					}

					defer.resolve(items);

					return defer;
				}


			}

			if (arguments.length == 1 && isNumeric(arguments[0]))
				return fetchOne(arguments[0]);

			return fetchAll();
		}


		model.add = function(item) {

			var request = gopher.request('POST', name, item);

			request.done(function(item) {

				if (model.cache == null)
					model.cache = {};

				model.cache[item.id] = item;
				model.trigger('added', item);
			});

			return request;
		};

		model.update = function(item, options) {
			var url = sprintf('%s/%d', name, item.id);
			
			if (typeof options == 'object') {
				var args = '';
				
				for (var key in options) {	
					if (args.length > 0)
						args += '&';
					
					args += encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
				}
				
				if (args.length > 0)
					url += '?' + args;
			}
			
			var request = gopher.request('PUT', url, item);

			request.done(function(item) {

				if (model.cache == null)
					model.cache = {};
					
				model.cache[item.id] = item;
				model.trigger('updated', item);
			});

			return request;
		};

		model.remove = function(item) {

			var request = gopher.request('DELETE', sprintf('%s/%d', name, item.id), item);

			request.done(function() {
				if (model.cache != null)
					delete model.cache[item.id];
				
				model.trigger('removed', item);
			});

			return request;
		};

		model.save = function(item) {
			return item.id ? model.update.apply(undefined, arguments) : model.add.apply(undefined, arguments);
		}


		return model;

	}


	Model.initialize = function() {
	
		////////////////////////////////////////////////////////////////////////////
	
	
		(function() {
	
			Model.Icons = {};
			$.extend(Model.Icons, requests('icons'));
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
	
	
		(function() {
	
			Model.Rentals = {};
			$.extend(Model.Rentals, requests('rentals'));
			
	
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
		(function() {
			Model.Customers = {};
	
			$.extend(Model.Customers, requests('customers'));
	
	
			Model.Customers.search = function(text) {
	
				var request = gopher.request('GET', sprintf('customers/search/%s', text));
	
				return request;
			}
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
		(function() {
	
			Model.Reservations = {};
	
			$.extend(Model.Reservations, requests('reservations'));
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
	
		(function() {
	
			Model.Settings = {};
	
			Model.Settings.fetch = function(section, name) {
				var request = gopher.request('GET', sprintf('settings/%s/%s', section, name));
				return request;
			}
	
			Model.Settings.save = function(section, name, value) {
				var request = gopher.request('PUT', sprintf('settings/%s/%s', section, name), value);
				return request;
			};
	
		})();
	
	
		////////////////////////////////////////////////////////////////////////////
	
		(function() {
	
			Model.Categories = {};
	
			$.extend(Model.Categories, requests('categories'));
	
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
		(function() {
	
			Model.Users = {};
	
			$.extend(Model.Users, requests('users'));
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
		(function() {
	
			Model.Options = {};
	
			$.extend(Model.Options, requests('options'));
			
	
	
		})();
	
		////////////////////////////////////////////////////////////////////////////
	
	
		(function() {
	
			Model.Client = {};
	
			Model.Client.fetch = function() {
	
				var request = gopher.request('GET', sprintf('clients/%d', gopher.client.id));
	
				request.done(function(client) {
					gopher.client = client;
				});
	
				return request;
			}
	
			Model.Client.save = function(client) {
	
				var request = gopher.request('PUT', sprintf('clients/%d', gopher.client.id), client);
	
				request.done(function(client) {
					gopher.client = client;
				});
	
				return request;
			};
	
	
	
		})();
		
	}


	Model.initialize();
	console.log('model.js loaded...');


})();
