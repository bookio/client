


Notifications = {};

Notifications.trigger = function(notification, param)
{
    $(this).trigger(notification, param)
}

Notifications.on = function(notification, callback) {
    $(this).on(notification, function(event, param) {
        callback(param);
    });
}

Notifications.off = function(notification) {
    $(this).off(notification);
}

