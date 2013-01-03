Pixastic.Actions.overlayHistogram = {
    process : function(params) {

        var color = params.options.color || "rgba(255,255,255,0.5)";
        if (typeof params.options.histData != "object") {
            return;
        }
        var returnValue = params.options.histData;

        if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);
            params.useData = false;

            if (returnValue.rvals) {
                    var ctx = params.canvas.getContext("2d");
                    var vals = [returnValue.rvals, returnValue.gvals, returnValue.bvals];
                    for (var v=0;v<3;v++) {
                            var yoff = (v+1) * params.height / 3;
                            var maxValue = 0;
                            for (var i=0;i<256;i++) {
                                    if (vals[v][i] > maxValue)
                                            maxValue = vals[v][i];
                            }
                            var heightScale = params.height / 3 / maxValue;
                            var widthScale = params.width / 256;
                            if (v==0) ctx.fillStyle = "rgba(255,0,0,0.5)";
                            else if (v==1) ctx.fillStyle = "rgba(0,255,0,0.5)";
                            else if (v==2) ctx.fillStyle = "rgba(0,0,255,0.5)";
                            for (var i=0;i<256;i++) {
                                    ctx.fillRect(
                                            i * widthScale, params.height - heightScale * vals[v][i] - params.height + yoff,
                                            widthScale, vals[v][i] * heightScale
                                    );
                            }
                    }
            } else {
                var maxValue = 0,
                    values = returnValue.values;
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
            }

            return true;
        }
    },
    checkSupport : function() {
        return Pixastic.Client.hasCanvasImageData();
    }
}
