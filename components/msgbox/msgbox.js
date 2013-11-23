define(['text!./msgbox.html', 'css!./msgbox'], function(html) {

	console.log('MsgBox loaded...');

	MsgBox = {};

	MsgBox.error = function(msg) {
		MsgBox.show({
			message: msg,
			icon: 'error',
			buttons: [{
				text: "OK"
			}]
		});
	}

	MsgBox.information = function(msg) {
		MsgBox.show({
			message: msg,
			icon: 'information',
			buttons: [{
				text: "OK"
			}]
		});
	}

	MsgBox.warning = function(msg) {
		MsgBox.show({
			message: msg,
			icon: 'warning',
			buttons: [{
				text: "OK"
			}]
		});
	}

	MsgBox.show = function(options) {

		var popup = $(html);

		var msgBoxOptions = {};
		var elements = {};

		msgBoxOptions.icon = 'information';
		msgBoxOptions.buttons = [{
			text: "OK"
		}];

		$.extend(msgBoxOptions, options);

		popup.hookup(elements, 'data-id');

		if (msgBoxOptions) {

			if (isString(msgBoxOptions.icon)) {
				elements.icon.image.addClass(msgBoxOptions.icon);
			}

			if (isString(msgBoxOptions.title)) {
				elements.text.append(sprintf('<p data-id="title">%s</p>', msgBoxOptions.title));
			}

			if (isString(msgBoxOptions.message)) {
				elements.text.append(sprintf('<p data-id="message">%s</p>', msgBoxOptions.message));
			}

			if (msgBoxOptions.buttons) {
				$.each(msgBoxOptions.buttons, function(i, button) {

					var element = $(sprintf('<a data-role="button" data-mini="true" data-inline="true">%s</a>', button.text));

					elements.buttons.append(element);

					element.on('tap', function() {
						popup.popup('close');

						if (isFunction(button.click)) {
							button.click();
						}
					});

				});
			}
		}

		var popupOptions = {};
		popupOptions.transition = 'pop';
		popupOptions.positionTo = 'window';
		popupOptions.dismissible = false;
		popupOptions.afterclose = function(event) {
			// Remove from page when done
			$(event.target).remove();
		};


		popup.appendTo($.mobile.activePage);
		popup.trigger('create');
		popup.popup(popupOptions);
		popup.popup('open');
	};


	return MsgBox;

});
