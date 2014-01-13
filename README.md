<h2>Client Side of Bookio.com</h2>

This documentation covers the client side of Bookio which is completely written in JavaScript and HTML. It uses jQuery along with jQuery Mobile. RequireJS is also used for modularity.

To get a quick understanding of how the client works from a user perspective, check out <a href="https://github.com/bookio/client/wiki/Introduction-to-the-client-from-a-user-perspective">this wiki-page</a>.

<h3>Project Goal</h3>
Build a cloud based reservation system with the following goals:
<ul>
<li>Built ground up for a global market</li>
<li>'Plug and play' for the user</li>
<li>Integrates with social media services</li>
<li>Strong visual approach</li>
<li>Beautiful GUI and fast as greased lightning ;)
</ul>


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

Issues tagged <i>todo</i> is up for grabs, just start coding. Milestones are larger 'chunks' that should be done in a near future. For now they needs ideas, feedback and discussion for best approach.

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
The client uses the same language as the browser. If this language is not supported in Bookio, the default language is english.

To add a new language, look up the language code <a href="http://www.metamodpro.com/browser-language-codes">here</a>.

Assume you want to translate to hungarian, the link above gives the language code <i>hu</i> for Hungarian.

Lets start to translate the reservation page (double-click a symbol to open this page):

<img src="https://f.cloud.github.com/assets/4263707/1900821/67af8332-7c59-11e3-852a-15555ff3ee93.png"/>

Open the files <i>reservation.html</i> and <i>reservation.json</i>. If you look in <i>reservation.html</i> you see the following lines:

```
	<label data-i18n="reservation-who">
	    Who
	</label>
```

The tag <i>data-i18n</i> shows the entry to be added in the json-file if we want to translate the word 'Who':

```
{
	"sv": {
		"reservation-who": "Vem",
		"reservation-pick-customer": "Välj kund",
		"reservation-when": "När",
		"reservation-from": "Från",
		"reservation-to": "Till",
		.
		.
		.
	}	
}
```

Now we add a Hungarian section below the section that translates to Swedish (sv), and adds the Hungarian word for the english 'Who':

```
{
	"sv": {
		"reservation-who": "Vem",
		"reservation-pick-customer": "Välj kund",
		"reservation-when": "När",
		"reservation-from": "Från",
		"reservation-to": "Till",
		.
		.
		.
	}	
	
	"hu": {
		"reservation-who": "Ki"	
	}
}
```

Continue and add translations for all <i>data-i18n</i> tags found in the html-file. The number of entries in the "hu"-section should exactly match the number of entries in the other sections (in this sample the "sv"-section).

Besides from translating text in the .html-files, text can be embedded in .js-files as well. Make a search for <i>i18n.text</i> to find all occurrances.

```
	MsgBox.show({
		message: i18n.text('confirm-remove', 'Are you sure you want to remove this rental?'),
		icon: 'warning',
		buttons: [{
			text: i18n.text('yes', 'Yes'),
			click: remove
		}, {
			text: i18n.text('no', 'No')
		}]
	});
```

In this sample we have to add a "confirm-remove", "yes" and "no" to the "hu"-section in the corresponding .json-file. Like this:

```
{
	"sv": {
		"reservation-who": "Vem",
		"reservation-pick-customer": "Välj kund",
		"reservation-when": "När",
		"reservation-from": "Från",
		"reservation-to": "Till",
		.
		.
		.
	}	
	
	"hu": {
		"reservation-who": "Ki"
		.
		.
		.
		"confirm-remove": "the hungarian phrase",
		"yes": "Igen",
		"no": "Ellen"
	}
}
```

>Dont change anything between the characters '<' or '>', for instance you can see something like '&lt;strong>Some text&lt;/strong>', <strong>when translated the '&lt;strong>' and '&lt;/strong>' must remain unchanged!</strong>

>Nerdy facts: i18n = internationalization, 18 letters between 'i' and 'n'

