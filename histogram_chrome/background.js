function handleMessage( message, port ) {
    console.log("Received "+ message.result + " from " + port.portId_ + ", " + port.name);
    if (message.result == "compute") {
        var img = $('<img>'),
            hist = {};
        img.load( function() {
            try {
                img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
            } catch (e) {
                port.postMessage( {kind: "securityFailure"});
            }
            var cv = img.pixastic('hsl', {lightness:-50}).pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)"});
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

