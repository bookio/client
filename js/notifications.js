


Notifications = {};

Notifications.trigger = function(notification, param)
{
	console.log(sprintf('Event "%s" fired...', notification));
    $(this).trigger(notification, param)
}

Notifications.on = function(notification, callback) {
    $(this).on(notification, function(event, param) {
    	console.log(sprintf('Event "%s" received...', notification));
        callback(param);
    });
}

Notifications.off = function(notification) {
    $(this).off(notification);
}

console.log('notifications.js loaded...');
