//var port = chrome.extension.connect();

//console.log( port )
// Record the last element to be right-clicked
$( function() {
    var clickedEl = null;

    $("body").bind("contextmenu", function(e) {
        clickedEl = e.srcElement;
    }).click(function() {
        clickedEl = null;
    });

    function origsrc(elm) {
        if ( elm != null && elm.hasOwnProperty('histogram_origsrc') && elm.histogram_origsrc !== undefined ) {
            return elm.histogram_origsrc;
        } else {
            return null
        };
    };

    chrome.extension.onRequest.addListener(function(request, sender) {
        if (request.kind == "info" && clickedEl && clickedEl.hasOwnProperty('src') && clickedEl.src == request.clickSrc) {
            var port = chrome.extension.connect( sender.id, { name: clickedEl.src } )

            port.onMessage.addListener(function(request) {
                if (request.kind == "replaceImage") {
                    if ( origsrc(clickedEl) == null && clickedEl && clickedEl.src == request.clickSrc) {
                        clickedEl.histogram_origsrc = clickedEl.src;
                        clickedEl.src = request.data;
                        clickedEl = null;
                    }
                } else if (request.kind == "revert") {
                    if (origsrc(clickedEl) == request.clickSrc) {
                        clickedEl.src = clickedEl.histogram_origsrc;
                        clickedEl.histogram_origsrc = null;
                        clickedEl = null;
                    }
                } else if (request.kind =="securityFailure") {
                    alert("Sorry, the security policy does not allow the histogram to be computed.");
                }
            });
            if (origsrc(clickedEl)) {
                port.postMessage({result:"revert", origSrc:origsrc(clickedEl)});
            } else {
                port.postMessage({result:"compute"});
            }
        }
    });
});
