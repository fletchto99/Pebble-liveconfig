//Require the liveconfig.js library
var liveconfig = require('liveconfig');

//Listen for the configuration page being opened
Pebble.addEventListener('showConfiguration', function() {

    /*
     * Creates an instance on the liveconfig server based off of a unique id for the user.
     * The configuration settings will be passed via this connection and updated in realtime
     *
     * The first parameter is your app's UUID. In the future this will not be required
     *
     * The second parameter is a call back function to call when a value is changed
     */
    liveconfig.connect('c0d8a008-a58d-4b4d-85a1-33923f3af72d', function(id, value) {

        //The id represents the id assigned to the input within your configuration page
        if (id == 'demo') {

            //The value represents the new value
            Pebble.sendAppMessage({
                'TEXT_KEY': value
            });
        }
    });

    /*
     * Prepares your URL for your configuration page
     *
     * The first parameter is your app's UUID and the second parameter is your configuration page's URL
     */
    var preparedURL = liveconfig.prepareURL('c0d8a008-a58d-4b4d-85a1-33923f3af72d', 'https://fletchto99.com/other/pebble/liveconfig-tests/demo/settings.html');

    Pebble.openURL(preparedURL);
});