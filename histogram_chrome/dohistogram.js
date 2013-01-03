//var port = chrome.extension.connect();

window.clickedEl = null;

//console.log( port )
// Record the last element to be right-clicked
$( function() {
    var port = null;

    $("body").bind("contextmenu", function(e) {
        clickedEl = e.srcElement;
    });

    function origsrc(elm) {
        o = $(elm).attr('histogram_origsrc')
        if ( o !== undefined) {
            return o;
        } else {
            return null
        };
    };

    window.handleRequest = function(request) {
        if ( ! $(clickedEl).prop('src') ) {
            clickedEl = $('img').filter( function() { return $(this).prop('src') == request.clickSrc; } )
        }
        if (request.kind == "info" && $(clickedEl).prop('src') == request.clickSrc) {
            console.log("received " + request.kind + " request. clickSrc: " + request.clickSrc)
            if (port === null) {
                port = chrome.extension.connect( { name: document.baseURI } )

                port.onMessage.addListener(function(request) {
                    if (request.kind == "replaceImage") {
                        if ( origsrc(clickedEl) == null && clickedEl && $( clickedEl ).prop('src') == request.clickSrc) {
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
            if (origsrc(clickedEl) == clickedEl.src) {
                // deal with sites (like 500px) that change the src out from under us
                $(clickedEl).attr('histogram_origsrc', null);
            }

            if (origsrc(clickedEl)) {
                console.log("Posting 'revert' on "+port);
                port.postMessage({result:"revert", origSrc:origsrc(clickedEl), clickSrc:request.clickSrc});
            } else {
                console.log("Posting 'compute' on "+port);
                port.postMessage({result:"compute", clickSrc: request.clickSrc});
            }
        }
    }
    chrome.extension.onRequest.addListener( handleRequest );
});
