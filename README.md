<h2>Client Side of Bookio.com</h2>

This documentation covers the client side of Bookio which is completely written in JavaScript and HTML. It uses jQuery along with jQuery Mobile. RequireJS is also used for modularity.

To get a quick understanding of how the client software works from a user perspective, check out <a href="https://github.com/bookio/client/wiki/Introduction-to-the-client-from-a-user-perspective">this wiki-page</a>.  
To see how the service is going to be presented to the customer, <a href="https://http://joakimbson.wix.com/bookio">see this mockup</a>.

<h3>Project Goal</h3>
Build a cloud based reservation system with the following goals:
<ul>
<li>Built ground up for a global market</li>
<li>'Plug and play' for the user</li>
<li>Integrates with social media services</li>
<li>Strong visual approach</li>
<li>Beautiful GUI and fast as greased lightning ;)
</ul>

Roadmap for first public release <a href="https://github.com/bookio/client/blob/master/docs/roadmap.md">can be found here</a>.

<h3>Contribute</h3>
Read the description and roadmap above to get an understanding of what we are building.

<h5>Code</h5>
Issues (under Client or Server) tagged with Todo is up for grabs. Take one and start coding.

<h5>Localize</h5>
Do you speak another language than swedish, english or hungarian? Add another language!

Instructions: https://github.com/bookio/client/blob/master/docs/howto-add-new-language.md

<h5>Think</h5>
Add your GUI/UX wisdome to the sketches here: https://cacoo.com/diagrams/1YMHGARTs2lx4636   
Add your CS/syntax skills here: https://github.com/bookio/client/blob/master/docs/syntax-very-short-reservation-language.md

Read the Project Goal and come up with new ideas or cool concepts.  

Feel free to add comments/improvements/suggestions.

<h5>Test</h5>  
Try to find bugs in the client (http://www.bookio.com/booker)  
Write test scripts.  
Check texts and layout on different Browsers (we only support the latest versions of all browsers)  

<h3>Project Layout</h3>
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
		<b>pages</b> - Since this is a jQuery Mobile app, it is all about pages.
		Each page has its own folder with its private resources. All pages have an HTML file along with a JavaScript file.
		Some pages also have a private CSS (compiled LESS), a JSON file containing translation and private images.
	</li>
	
	<li>
		<b>widgets</b> - Contains jQuery Mobile widgets. Again, each widget has its own directory along with any resources.
	</li>

	<li>
		<b>makefile</b> - The makefile is used for deployment and building the core files. 
		See the documentation inside the file. The tools needed assumes Mac OSX.
	</li>

	<li>
		<b>index.html</b> - The main HTML file. This is just an
		empty jQuery Mobile page but it also loads the <b>js/main.js</b> file which
		starts upp the app.
	</li>

</ul>

<h3>Todo</h3>
Upcoming functionality is found under Issues and Milestones (check both <i>client</i> and <i>server</i>).

Issues tagged <i>todo</i> is up for grabs, just start coding. Milestones are larger 'chunks' that should be done in a near future. For now they need ideas, feedback and discussion for best approach.

Sketches and drafts on GUI <a href="https://cacoo.com/diagrams/1YMHGARTs2lx4636">can be found on Cacoo</a>.

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
						// Translate the page by looking up all
						// elements with the 'data-i18n' attribute set.
						_page.i18n(i18n);
						
						// Hook up all elements tagged with 'data-id' attribute
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

This will automatically load the <b>login.js</b> file in the same directory and start executing the code above.
All paths are relative to the current page beeing displayed.


<h3>Compiling LESS</h3>
Even though the makefile compiles the LESS files, it might be convinient to install LESS.app for OSX. 
It automatically compiles the LESS files in the background when modified. Another alternative is <b>CodeKit</b>.

<h3>Localization</h3>
To add a new language to the client, <a href="https://github.com/bookio/client/blob/master/docs/howto-add-new-language.md">check out this documentation</a>.
