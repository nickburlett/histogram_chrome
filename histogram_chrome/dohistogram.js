//var port = chrome.extension.connect();

//console.log( port )
// Record the last element to be right-clicked
$( function() {
    var clickedEl = null,
        port = null;

    $("body").bind("contextmenu", function(e) {
        clickedEl = e.srcElement;
    }).click(function() {
        clickedEl = null;
    });

    function origsrc(elm) {
        o = $(elm).attr('histogram_origsrc')
        if ( o !== undefined) {
            return o;
        } else {
            return null
        };
    };

    chrome.extension.onRequest.addListener(function(request, sender) {
        if (request.kind == "info" && clickedEl && clickedEl.hasOwnProperty('src') && clickedEl.src == request.clickSrc) {
            console.log("received " + request.kind + " request. clickSrc: " + request.clickSrc)
            if (port === null) {
                port = chrome.extension.connect( sender.id, { name: clickedEl.src } )

                port.onMessage.addListener(function(request) {
                    if (request.kind == "replaceImage") {
                        if ( origsrc(clickedEl) == null && clickedEl && clickedEl.src == request.clickSrc) {
                            if (request.clickSrc == document.baseURI) {
                                var replace = $('<img>').attr('histogram_origsrc', $(clickedEl).attr('src')).attr('src', request.data) ;
                                $(clickedEl).replaceWith( replace );
                            } else {
                                $(clickedEl).attr('histogram_origsrc', request.clickSrc).prop('src', request.data);
                            }
                            clickedEl = null;
                        }
                    } else if (request.kind == "revert") {
                        if (origsrc(clickedEl) == request.clickSrc) {
                            $(clickedEl).prop('src', origsrc(clickedEl)).attr('histogram_origsrc', null);
                            clickedEl = null;
                        }
                    } else if (request.kind =="securityFailure") {
                        alert("Sorry, the security policy does not allow the histogram to be computed.");
                    }
                });
            }
            if (origsrc(clickedEl)) {
                console.log("Posting 'revert' on "+port);
                port.postMessage({result:"revert", origSrc:origsrc(clickedEl), clickSrc:request.clickSrc});
            } else {
                console.log("Posting 'compute' on "+port);
                port.postMessage({result:"compute", clickSrc: request.clickSrc});
            }
        }
    });
});
