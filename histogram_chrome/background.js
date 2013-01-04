function parse(type) {
   return typeof type == 'string' ? JSON.parse(type) : type;
}

function handleMessage( message, port ) {
    console.log("Received "+ message.result + " from " + port.portId_ + ", " + port.name);
    if (message.result == "compute") {
        var img = $('<img>'),
            hist = {};
        img.load( function() {
            try {
                var lightness = -50;
                if ( parse(localStorage["color_histogram"]) ) {
                    img.pixastic('colorhistogram', { paint:false, returnValue:hist });
                    lightness = 50
                } else {
                    var average = parse(localStorage['average_histogram']);
                    img.pixastic('histogram', { average : average, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
                }
            } catch (e) {
                port.postMessage( {kind: "securityFailure"});
            }
            var cv = img.pixastic('hsl', {lightness:lightness}).pixastic('overlayHistogram', {histData:hist, inline: true, color:"rgba(255,255,255,0.8)"});
            port.postMessage({kind: "replaceImage", clickSrc: message.clickSrc, data: cv[0].toDataURL()});
        });
        img.attr('src', message.clickSrc);
    } else if (message.result == "revert") {
        port.postMessage({kind: "revert", clickSrc:message.origSrc});
    } 
}
toggleHistogram = function( port ) {
    port.onMessage.addListener( handleMessage );
}
chrome.extension.onConnect.addListener( toggleHistogram );

/**
 * Returns a handler which will open a new window when activated.
 */
function getAddHistogramHandler() {
    return function(info, tab) {
        console.log("Sending info request to tab "+ tab.id + " with clickSrc: " + info.srcUrl);
        chrome.tabs.sendRequest(tab.id, { kind: "info", clickSrc: info.srcUrl });
    };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "Toggle histogram",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : getAddHistogramHandler()
});

chrome.browserAction.onClicked.addListener(function(tab) {
    localStorage['color_histogram'] = !parse(localStorage['color_histogram']);
    updateBrowserIcon();
});

function updateBrowserIcon() {
    if (parse(localStorage['color_histogram'])) {
        chrome.browserAction.setIcon( { path: {'19': 'icon-19-color.png', '38': 'icon-38-color.png'} } );
    } else {
        chrome.browserAction.setIcon( { path: {'19': 'icon-19.png', '38': 'icon-38.png'} } );
    }

};

function reloadOptions() {
    updateBrowserIcon();
    localStorage['color_histogram'] = !!parse(localStorage['color_histogram']);
}

function storageChange(e) {
    var key = e.originalEvent.key,
        val = e.originalEvent.newValue;

    if (key == "color_histogram") {
        updateBrowserIcon();
    }
}

$(window).bind('storage', storageChange);

$( function() {
    reloadOptions();
});
