###How to Add a New Language to Bookio

####Language Guidelines for Localization
* Use plain, simple language
* Avoid technical jargon
* Speak directly to the user
* Be brief, use short words

The client uses the same language as the browser. If this language is not supported in Bookio, the default language is English. To add a new language, look up the language code <a href="http://www.metamodpro.com/browser-language-codes">here</a>.

<h4>Go through all .html-files</h4>
Assume you want to translate to hungarian, the link above gives the language code <i>hu</i> for Hungarian.

Lets start to translate the reservation page:

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

Now we add a Hungarian section below the section that translates to Swedish (sv) (don´t forget to add ',' after the preceding section), and adds the Hungarian word for the english 'Who':

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
	},	
	
	"hu": {
		"reservation-who": "Ki"	
	}
}
```

Continue and add translations for all <i>data-i18n</i> tags found in the html-file. The number of entries in the "hu"-section should exactly match the number of entries in the other sections (in this sample the "sv"-section).

Repeat for all html-files in the project.

<h4>Go through all .js-files</h4>
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

>The i18n.text(<i>key</i>, <i>english text</i>) works like this; the corresponding .json-file is searched for <i>key</i> under the section with the language code of the current browser, if it's found the text after the key is returned, else the default <i>english text</i> is used.

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
	},	
	
	"hu": {
		"reservation-who": "Ki"
		.
		.
		.
		"confirm-remove": "Biztosan el akarja távolítani ezt az elemet?",
		"yes": "Igen",
		"no": "Ellen"
	}
}
```

>Dont change anything between the characters '<' or '>', for instance you can see something like '&lt;strong>Some text&lt;/strong>', <strong>when translated the '&lt;strong>' and '&lt;/strong>' must remain unchanged!</strong>

>Nerdy facts: i18n = internationalization, 18 letters between 'i' and 'n'

####Finally, Run the Client and Call a Friend
Make someone in the team to build and deploy with the updated json-files.

Check all pages to make sure no text overflows and that all translations make sense in their context. Take a hard look on all longer texts, almost all text can be edited down without losing meaning. Challenge yourself!

Call a friend that is native to the translated language. Let him/her run the client and make sure everything is clear.
