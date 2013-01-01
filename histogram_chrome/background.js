/**
 * Returns a handler which will open a new window when activated.
 */
function getAddHistogramHandler() {
    return function(info, tab) {
        var toggleHistogram = function( port ) {
            port.onMessage.addListener( function( message ) {
                if (message.result == "compute") {
                    var img = $('<img>'),
                        hist = {};
                    img.load( function() {
                        try {
                            img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
                        } catch (e) {
                            chrome.tabs.sendMessage(tab.id, {kind: "securityFailure"});
                        }
                        var cv = img.pixastic('hsl', {lightness:-50}).pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)"});
                        if (tab.url == info.srcUrl) {
                            port.postMessage({kind: "navigate", clickSrc: info.srcUrl, data: cv[0].toDataURL()});
                        } else {
                            port.postMessage({kind: "replaceImage", clickSrc: info.srcUrl, data: cv[0].toDataURL()});
                        }
                    });
                    img.attr('src', info.srcUrl);
                } else if (message.result == "revert") {
                    port.postMessage({kind: "revert", clickSrc:message.origSrc});
                }
            });
        }
        chrome.extension.onConnect.addListener( toggleHistogram );
        chrome.tabs.sendRequest(tab.id, {kind: "info", clickSrc: info.srcUrl });
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

