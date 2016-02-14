var liveconfig = module.exports;

/**
 * Connects to the liveconfig session
 *
 * @param uuid Your app's UUID
 * @param onChange The function to call when a value is changed.
 */
liveconfig.connect = function(uuid, onChange) {
    if (!uuid) {
        throw new Error("Liveconfig requires a UUID!");
    }
    var websocket = new WebSocket("wss://liveconfig.fletchto99.com/receive/"+uuid+"/"+Pebble.getWatchToken());

    websocket.onopen = function() {
        console.log("opened");
    };

    websocket.onmessage = function(message) {
        var attr = JSON.parse(message.data);
        onChange(attr.id, attr.value);
    };
};

/**
 * Prepares your URL for the liveconfig web portion
 *
 * @param uuid The UUID for your app
 * @param url The url for your configuration page (with all parameters set)
 * @returns {string} The prepared URL
 */
liveconfig.prepareURL = function(uuid, url) {
    if (url.lastIndexOf('?') > 0) {
        return url.substr(0, url.lastIndexOf('?')) +'?lc_uuid=' + uuid + '&lc_watchtoken=' + Pebble.getWatchToken() + '&' + url.substr(url.lastIndexOf('?') + 1);
    } else {
        return  url+'?lc_uuid=' + uuid + '&lc_watchtoken=' + Pebble.getWatchToken();
    }
};
