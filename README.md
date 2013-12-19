<h2>Client Side of Bookio.com (2013-12-19)</h2>

This documentation covers the client side of Bookio and is completely written in JavaScript and HTML. It uses jQuery along with jQuery Mobile. RequireJS is also used for modularity.

<h3>Project layout</h3>
The directory structure is as follows
<ul>
  <li>
    <b>components</b> - Contains general graphic components. Each component has 
	its own directory with its privateresources.
  </li>
    
  <li>
    <b>css</b> - The global less files which is compiled into css. 
    The <b>styles.css</b> file is included in the main <b>index.html</b>
  </li>

  <li>
    <b>images</b> - Contains images used around the app. Includes backgrounds, rental symbols etc.
  </li>

  <li>
    <b>java</b> - Shouldn't be there... 
  </li>

  <li>
    <b>js</b> - Contains misc scripts needed throughout the app. The makefile combines these files
    into <b>core.js</b> with the command <b>make core</b> and this file is included in <b>index.html</b>. 
  </li>

  <li>
    <b>lib</b> - Contains jQuery, jQuery Mobile (including the jQuery Mobile configuration file), 
	plugins, and other common libraries. As with the files in the <b>js</b> folder, all library files
	are combined into <b>core.js</b>.
  </li>

  <li>
    <b>pages</b> - Since this is a jQuery Mobile is built on pages, here are all the pages for the app.
    Each page has its own folder with its private resources. All pages have an HTML file along with a JavaScript file.
    Some pages also have a private CSS (compiled LESS), a JSON file containing translation and private images.
  </li>

  <li>
    <b>widgets</b> - Contains jQuery Mobile widgets. Again, each widget has its own directory along with any resources.
  </li>


</ul>


<h3>The makefile</h3>
The <b>makefile</b> is used for deployment and building the core files. See the documentation inside the file. The tools
needed to assumes Mac OSX.

<h3>Pages</h3>
Since this is a jQuery Mobile app, everything is pages. Below is the code
for a typical page.

<pre>
	<code>
		(function() {
		
			// Specify dependencies. In this case the language file
			// and some css.
			var dependencies = [
				'i18n!./login.json',
				'css!./login'
			];
			
			define(dependencies, function(i18n) {
				
				function Module(page) {
		
					var _page = page;
					var _elements = {};
		
					...
					
					function init() {
						// Translate the page
						_page.i18n(i18n);
						
						// Hook up all elements tagged with 'data-id'
						// so we may reference them by '_elements.myelement'
						_page.hookup(_elements, 'data-id');
						...
					}
		
					init();
				}
		
		
				$(document).delegate("#login-page", "pageinit", function(event) {
					// Create a new instance of the module when the page is loaded into the DOM.
					new Module($(event.currentTarget));
				});
			});
		})();
	
	</code>
</pre>

To display the page use:
<pre>
	<code>
		$.mobile.go('pages/login/login.html');
	</code>
</pre>

Or, if you want to push a page into view with a transition:
<pre>
	<code>
		$.mobile.push('pages/login/login.html');
	</code>
</pre>

This will automatically load the <b>login.js</b> in the same directory and start executing the code above.


