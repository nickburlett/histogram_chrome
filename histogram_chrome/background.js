/**
 * Returns a handler which will open a new window when activated.
 */
function getAddHistogramHandler() {
    return function(info, tab) {

        var img = $('<img>'),
            hist = {};
        img.load( function() {
            img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
            var cv = img.pixastic('hsl', {lightness:-50}).pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)"});
            chrome.tabs.sendMessage(tab.id, {kind: "histogram", data: cv[0].toDataURL()});
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

Pixastic.Actions.overlayHistogram = {
	process : function(params) {

		var color = params.options.color || "rgba(255,255,255,0.5)";
		if (typeof params.options.histData != "object") {
			return;
		}
		var returnValue = params.options.histData;
		values = returnValue.values;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			params.useData = false;

			var maxValue = 0;
            for (var i=0;i<256;i++) {
                if (values[i] > maxValue) {
                    maxValue = values[i];
                }
            }
            var heightScale = params.height / maxValue;
            var widthScale = params.width / 256;
            var ctx = params.canvas.getContext("2d");
            ctx.fillStyle = color;
            for (var i=0;i<256;i++) {
                ctx.fillRect(
                    i * widthScale, params.height - heightScale * values[i],
                    widthScale, values[i] * heightScale
                );
            }

			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}
