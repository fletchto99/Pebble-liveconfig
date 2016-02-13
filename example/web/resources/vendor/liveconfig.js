function liveconfigGetQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return defaultValue || false;
}

var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

window.onload = function() {
    var uuid = liveconfigGetQueryParam('lc_uuid');
    var watchtoken = liveconfigGetQueryParam('lc_watchtoken');
    if (uuid && watchtoken) {
        var connection = new WebSocket("wss://liveconfig.fletchto99.com/forward/"+uuid+"/" + watchtoken);
        connection.onopen = function() {
            [].forEach.call(document.getElementsByClassName("liveconfig"), function(elem) {
                elem.oninput = function() {
                    connection.send(JSON.stringify({
                        id: elem.id,
                        value: elem.value
                    }));
                };

                if (elem.classList.contains("item-color")) {
                    var observer = new MutationObserver(function() {
                        connection.send(JSON.stringify({
                            id: elem.id,
                            value: rgb2hex(elem.nextSibling.nextSibling.firstChild.style.backgroundColor)
                        }));
                    });
                    observer.observe(elem.nextSibling.nextSibling.firstChild, { attributes : true, attributeFilter : ['style'] });
                }
            });
        };
    } else {
        alert('Liveconfig error -- No uuid or watchtoken specified.')
    }
};