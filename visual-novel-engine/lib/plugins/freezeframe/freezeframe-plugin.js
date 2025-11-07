ig.module('plugins.freezeframe.freezeframe-plugin')
    .requires(
        'plugins.freezeframe.freezeframe-settings',
        'plugins.freezeframe.freezeframe1',
        'plugins.freezeframe.freezeframe2',
        'plugins.freezeframe.freezeframe3',
        'plugins.freezeframe.freezeframe4'

    ).defines(function () {
        ig.FreezeFrame = {

            textDimension:{width:0, height:0},

            measureLine: function (ctx, textLines) {
                var metrics = ctx.measureText(textLines[0]);
                for (var i = 1; i < textLines.length; i++) {
                    var newMetrics = ctx.measureText(textLines[i]);
                    if (newMetrics.width >= metrics.width) {
                        metrics = newMetrics;
                    }
                }

                return metrics;
            },

            measure: function (configs, ctx) {
                // var text = configs.text.toString();
                var textLines = configs.text;

                ctx.save();
                ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;  

                var metrics = this.measureLine(ctx, textLines);

                ctx.restore();

                configs.textData = {
                    textLines: textLines,
                    textWidth: metrics.width,
                    fontHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
                };

                // some browser doesn't support
                if (isNaN(configs.textData.fontHeight) || configs.textData.fontHeight == null) {
                    configs.textData.fontHeight = configs.fontSize;
                }

                this.textDimension = {
                    width: configs.textData.textWidth,
                    height: configs.textData.fontHeight * configs.textData.textLines.length
                };
            }
        }

        ig.initFreezeFrameSettings();
    });