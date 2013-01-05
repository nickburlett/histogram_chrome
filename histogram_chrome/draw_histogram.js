
function parse(type) {
   return typeof type == 'string' ? JSON.parse(type) : type;
}

window.draw_histogram = function() {
    var img = $(this),
        lightness = -50,
        inline = true,
        additive = false,
        hist = {};
    if ( parse(localStorage["color_histogram"]) ) {
        img.pixastic('colorhistogram', { paint:false, returnValue:hist });
        if ( parse(localStorage["additive_color"]) ) {
            lightness = -50;
            additive = true;
        } else {
            lightness = 50;
        }
    } else {
        var average = parse(localStorage['average_histogram']);
        img.pixastic('histogram', { average : average, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
    }
    if (parse(localStorage["separate_colors"])) {
        inline = false;
    }
    var cv = img.pixastic('hsl', {lightness:lightness}).pixastic('overlayHistogram', {histData:hist, additive: additive, inline: inline, color:"rgba(255,255,255,0.8)"});
    return cv[0];
}
