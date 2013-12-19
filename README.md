<h2>Client Side of Bookio.com</h2>

This documentation covers the client side of Bookio and is completely written in JavaScript and HTML. It uses jQuery along with jQuery Mobile. RequireJS is also used for modularity.

<h3>Project layout (as of 2013-12-19)</h3>
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




