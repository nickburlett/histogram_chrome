//var port = chrome.extension.connect();

//console.log( port )
var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        clickedEl = event.target;
    }
}, true);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.kind == "histogram") {
        if ( typeof clickedEl.histogram_origsrc == 'undefined' 
                || !clickedEl.histogram_origsrc ) {
            clickedEl.histogram_origsrc = clickedEl.src;
            clickedEl.src = request.data;
        } else {
            clickedEl.src = clickedEl.histogram_origsrc;
            clickedEl.histogram_origsrc = null;
        }
    }
});

