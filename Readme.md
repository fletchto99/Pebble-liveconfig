# PHPebbleTimeline

## About

Liveconfig is a simple Pebble library used to transfer your configuration page's settings in realtime back to the watch.

## Setup

### Pebble App

Include [liveconfig - watchapp](watchapp/liveconfig.js) in your `src/js/` directory. Require live config using `var liveconfig = require('liveconfig');` 

In your `showConfiguration` event listener call `liveconfig.connect(<app_uuid>, <onchange_callback(id, value)>)`. Also be sure to prepare your URL for liveconfig by calling `var preparedURL = liveconfig.prepareURL(<app_uuid>, <settings_url>)`. Finally open the configuration page by calling `Pebble.openURL(preparedURL)`

For an example please refer to [liveconfig watchapp demo](example/watchapp/).

### Web Settings

Load the [liveconfig - web script](web/liveconfig.js) in your configuration page. Apply the `liveconfig` class to any input elements you wish to be synchronized. Ensure that these elements have an `id` assigned or they will not be sent to the pebble app.

For an example please refer to [liveconfig web demo](example/web/).