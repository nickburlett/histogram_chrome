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
