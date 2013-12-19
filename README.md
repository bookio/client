<h2>Client Side of Bookio.com</h2>

This documentation covers the client side of Bookio and is completely written in JavaScript and HTML. It uses jQuery along with jQuery Mobile. RequireJS is also used for modularity.

<h3>Project layout (as of 2013-12-19)</h3>
The directory struction is as follows
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
    <b>js</b> - Contains misc scripts needed throughout the app. The makefile combines these files
    into <b>core.js</b> with the command <b>make core</b> and this file is included in <b>index.html</b>. 
  </li>


</ul>




