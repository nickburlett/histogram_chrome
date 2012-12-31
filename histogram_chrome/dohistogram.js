//var port = chrome.extension.connect();

//console.log( port )
// Record the last element to be right-clicked
var clickedEl = null;

$("body").bind("contextmenu", function(e) {
    clickedEl = e.srcElement;
}).click(function() {
    clickedEl = null;
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.kind == "histogram") {
        if ( clickedEl != null &&
            (! clickedEl.hasOwnProperty('histogram_origsrc') 
            || !clickedEl.histogram_origsrc
            ) &&
            clickedEl.src == request.origSrc
           ) {
            clickedEl.histogram_origsrc = clickedEl.src;
            clickedEl.src = request.data;
            clickedEl = null;
        } else if (clickedEl != null && clickedEl.hasOwnProperty('histogram_origsrc') ) {
            clickedEl.src = clickedEl.histogram_origsrc;
            clickedEl.histogram_origsrc = null;
            clickedEl = null;
        }
    } else if (request.kind =="securityFailure") {
        alert("Sorry, the security policy does not allow the histogram to be computed.");
    }
});
