/**
 * Returns a handler which will open a new window when activated.
 */
function getAddHistogramHandler() {
    return function(info, tab) {

        var img = $('<img>'),
            hist = {};
        img.load( function() {
            try {
                img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
            } catch (e) {
                chrome.tabs.sendMessage(tab.id, {kind: "securityFailure"});
            }
            var cv = img.pixastic('hsl', {lightness:-50}).pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)"});
            chrome.tabs.sendMessage(tab.id, {kind: "histogram", origSrc: info.srcUrl, data: cv[0].toDataURL()});
        });
        img.attr('src', info.srcUrl);
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

