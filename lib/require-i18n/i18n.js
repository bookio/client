/** @license
 * RequireJS plugin for loading JSON files
 * - depends on Text plugin and it was HEAVILY "inspired" by it as well.
 * Author: Miller Medeiros
 * Version: 0.3.2 (2013/08/17)
 * Released under the MIT license
 */
define(['text'], function(text) {

	var CACHE_BUST_QUERY_PARAM = 'bust',
		CACHE_BUST_FLAG = '!bust',
		buildMap = {};

	function cacheBust(url) {
		url = url.replace(CACHE_BUST_FLAG, '');
		url += (url.indexOf('?') < 0) ? '?' : '&';
		return url + CACHE_BUST_QUERY_PARAM + '=' + Math.round(2147483647 * Math.random());
	}

	//API
	return {

		load: function(name, req, onLoad, config) {
			if (config.isBuild && (config.inlineJSON === false || name.indexOf(CACHE_BUST_QUERY_PARAM + '=') !== -1)) {
				//avoid inlining cache busted JSON or if inlineJSON:false
				onLoad(null);
			}
			else {
				text.get(req.toUrl(name), function(data) {
						if (config.isBuild) {
							buildMap[name] = data;
							onLoad(data);
						}
						else {

							var json = JSON.parse(data);
							var language = $.i18n.lang;
							var country = language.split('-')[0];

							var i18n = {};
							
							i18n.i18n = {};

							// Load the 'en' section							
							if (json['en'])
								$.extend(i18n.i18n, json['en']);

							// Load the country language					
							if (json[country])
								$.extend(i18n.i18n, json[country]);

							// Extend with the language dialect
							if (json[language])
								$.extend(i18n.i18n, json[language]);
								
							i18n.text = function(name, defaultValue) {
								return i18n.i18n[name] ? i18n.i18n[name] : defaultValue;
							}

							onLoad(i18n);
						}
					},
					onLoad.error, {
						accept: 'application/json'
					}
				);
			}
		},

		normalize: function(name, normalize) {
			// used normalize to avoid caching references to a "cache busted" request
			if (name.indexOf(CACHE_BUST_FLAG) !== -1) {
				name = cacheBust(name);
			}
			// resolve any relative paths
			return normalize(name);
		},

		//write method based on RequireJS official text plugin by James Burke
		//https://github.com/jrburke/requirejs/blob/master/text.js
		write: function(pluginName, moduleName, write) {
			if (moduleName in buildMap) {
				var content = buildMap[moduleName];
				write('define("' + pluginName + '!' + moduleName + '", function(){ return ' + content + ';});\n');
			}
		}

	};
});
