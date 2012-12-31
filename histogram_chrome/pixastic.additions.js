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
            var height = params.options.height || params.height,
                width  = params.options.width  || params.width;
            var heightScale = height / maxValue;
            var widthScale = width / 256;
            var xOffset = params.options.xOffset || 0;
            var yOffset = params.options.yOffset || 0;
            var ctx = params.canvas.getContext("2d");
            ctx.fillStyle = color;
            for (var i=0;i<256;i++) {
                ctx.fillRect(
                    i * widthScale + xOffset, height - heightScale * values[i] + yOffset,
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
