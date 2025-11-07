ig.module(
    'plugins.chat-bubble.factory.text'
).defines(function () {
    "use strict";

    ig.ChatBubble.Factory.Text = {
        generate: function (configs) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var size = this.measure(configs, context); 

            // update canvas size
            if(configs.chatStyle == 'rectangle' && (configs.isReward == null || configs.isReward == false)) {
                if(ig.game.currentWindow.chatBubble!= null) {
                    canvas.width = ig.game.currentWindow.chatBubble._chatBubbleCanvasConfigs.bubbleConfigs.box.width;
                } 
            } else {
                canvas.width = size.x;
            }

            if(configs.textType == 'text') {
                if(canvas.width <= 380*_DATAGAME.ratioRes) { canvas.width = 380*_DATAGAME.ratioRes; }
            }

            var _sizeTextNameY= 0;
            if(configs.sizeTextName != null && configs.sizeTextName.y != null) _sizeTextNameY = configs.sizeTextName.y;

            if(configs.chatStyle == 'rectangle' && (configs.isReward == null || configs.isReward == false)) {
                if(ig.game.currentWindow.chatBubble!= null) {
                    // canvas.height = ;
                    if(size.y < _DATAGAME.dialogBox.height*_DATAGAME.ratioRes) {
                        canvas.height = _DATAGAME.dialogBox.height*_DATAGAME.ratioRes+_sizeTextNameY;
                    } else {
                        canvas.height = size.y+_sizeTextNameY;
                    }
                } 
            } else {
                // canvas.width = size.x;
                canvas.height = size.y+_sizeTextNameY;
            }

            this.draw(configs, context); 

            return {
                configs: configs,
                canvas: canvas
            };
        },

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
            var text = configs.text.toString();
            var textLines = text.split("<br>");

            var textFull = configs.fullText.toString();
            textFull = textFull.replaceAll("<>", "");
            var textLinesFull = textFull.split("<br>");

            ctx.save();
            ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
            var metrics = this.measureLine(ctx, textLinesFull);
            ctx.restore();

            configs.textData = {
                textLines: textLines,
                textLinesFull: textLinesFull,
                textWidth: metrics.width,
                fontHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
            };

            // some browser doesn't support
            if (isNaN(configs.textData.fontHeight) || configs.textData.fontHeight == null) {
                configs.textData.fontHeight = configs.fontSize;
            }

            return {
                x: configs.textData.textWidth,
                y: configs.textData.fontHeight * configs.textData.textLinesFull.length //+ 10*_DATAGAME.ratioRes
                // y: configs.textData.fontHeight * configs.textData.textLines.length
            };
        },

        // textLine: function (configs, ctx) {
        //     var text = configs.text.toString();
        //     var textLines = text.split("<br>");

        //     ctx.save();
        //     ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
        //     var metrics = this.measureLine(ctx, textLines);
        //     ctx.restore();

        //     configs.textData = {
        //         textLines: textLines,
        //         textWidth: metrics.width,
        //         fontHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
        //     };

        //     // some browser doesn't support
        //     if (isNaN(configs.textData.fontHeight) || configs.textData.fontHeight == null) {
        //         configs.textData.fontHeight = configs.fontSize;
        //     }

        //     return {
        //         x: configs.textData.textWidth,
        //         y: configs.textData.fontHeight * configs.textData.textLines.length
        //     };
        // },

        getTextDrawPos: function (configs, ctx) {
            var pos = {
                x: (configs.textType == 'text') ? 0 : ctx.canvas.width * 0.5,
                y: (configs.textData.fontHeight/2)
                // y: ctx.canvas.height * 0.5
            };

            switch (configs.textAlign) {
                case "start":
                case "left": {
                    if(configs.textType != 'text') {
                        pos.x -= configs.textData.textWidth * 0.5;
                    }
                } break;

                case "end":
                case "right": {
                    pos.x += configs.textData.textWidth * 0.5;
                } break;

                case "center":
                default: {
                } break;
            }

            if(configs.chatStyle == 'rectangle' && (configs.isReward == null || configs.isReward == false)) {
                pos = {
                    x: 0,
                    y: 0
                    // y: ctx.canvas.height * 0.5
                };
            }

            // offset multiline
            if (configs.textData.textLines.length > 1) {
                // pos.y -= ((configs.textData.textLines.length - 1) * 0.5 * configs.textData.fontHeight);
            }

            return pos;
        },

        draw: function (configs, ctx) {
            ctx.save();
            var _plusYText = 0;

            var _sizeTextNameY= 0;
            if(configs.sizeTextName != null && configs.sizeTextName.y != null) _sizeTextNameY = configs.sizeTextName.y;

            if(configs.chatStyle == 'rectangle' && (configs.isReward == null || configs.isReward == false)) _plusYText = 20*_DATAGAME.ratioRes;
            ctx.translate(0, _sizeTextNameY + _plusYText);
            // console.log(configs.sizeTextName.y);

            ctx.textAlign = configs.textAlign;
            ctx.textBaseline = "middle";

            if(configs.textType == 'divider') {
                ctx.fillStyle = "white";
                ctx.font = "bold" + configs.fontSize + "px" + " " + configs.fontFamily;
            } else {
                ctx.fillStyle = configs.fillStyle;
                ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
            }
            

            var drawPos = this.getTextDrawPos(configs, ctx); 
            var noFormat = 0;
            for (var i = 0; i < configs.textData.textLines.length; i++) {
                var arrText = configs.textData.textLines[i].split("<>");
                var widthText = 0;

                // if(configs.textData.textLines[i].substring(0, 2) == "<>") {
                //     noFormat++;
                // }

                for(var j = 0; j < arrText.length; j++) {
                    var isStrokeText = false;

                    if(j > 0) {
                        noFormat++;
                        widthText += ctx.measureText(
                            arrText[j-1]).width;
                    }

                    if(j + 1 < arrText.length) {
                        if(arrText[j + 1].substr(0, 1) == "." || arrText[j + 1].substring(0, 1) == "," || arrText[j + 1].substring(0, 1) == "!" || arrText[j + 1].substring(0, 1) == "?") {
                            if(arrText[j].substr(arrText[j].length - 1, 1) == " ") {
                                arrText[j] = arrText[j].substr(0, arrText[j].length - 1);
                            }
                        }
                    }
                    
                    if (noFormat == 0 || (noFormat != 0 && ig.game['formatText' + noFormat].reset == true)) {
                        ctx.fillStyle = configs.fillStyle;
                        ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
                    } else {
                        if (ig.game['formatText' + noFormat].color == null) {
                            ctx.fillStyle = configs.fillStyle;
                        } else {
                            ctx.fillStyle = ig.game['formatText' + noFormat].color;
                        }
                        
                        if (ig.game['formatText' + noFormat].format != null) {
                            if(ig.ua.iOS == true) {
                                if(ig.game['formatText' + noFormat].format.search('bold') == -1) {
                                    ctx.font = ig.game['formatText' + noFormat].format + " " + configs.fontSize + "px" + " " + configs.fontFamily;
                                } else {
                                    var tempFormatText = ig.game['formatText' + noFormat].format.replaceAll('bold', '');
                                    ctx.font = tempFormatText + " " + configs.fontSize + "px" + " " + configs.fontFamily;
                                    isStrokeText = true;
                                }
                            } else {
                                ctx.font = ig.game['formatText' + noFormat].format + " " + configs.fontSize + "px" + " " + configs.fontFamily;
                            }
                        } else {
                            ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
                        }
                    }

                    if(noFormat != 0 && ig.game.windowName == 'game' && !ig.game.currentWindow.loadSentence && ig.game['formatText' + noFormat].animEffect != null) {
                        if(ig.game['formatText' + noFormat].animEffect == 'flash') {
                            if(ig.game['formatText' + noFormat].speed == null) {
                                ig.game['formatText' + noFormat].speed = 1;
                            }

                            if(configs['showFlash' + ig.game['formatText' + noFormat].speed]) {
                                ctx.fillText(arrText[j],
                                drawPos.x + widthText,
                                drawPos.y + i * configs.textData.fontHeight);
                            }
                        }
                        else if(ig.game['formatText' + noFormat].animEffect == 'shake') {
                            if(ig.game['formatText' + noFormat].speed == null) {
                                ig.game['formatText' + noFormat].speed = 1;
                            }

                            if(configs['showShake' + ig.game['formatText' + noFormat].speed]) {
                                ctx.fillText(arrText[j],
                                drawPos.x + widthText + 1,
                                drawPos.y + i * configs.textData.fontHeight);
                            } else {
                                ctx.fillText(arrText[j],
                                drawPos.x + widthText - 1,
                                drawPos.y + i * configs.textData.fontHeight);
                            }
                        }
                    } else {
                        if(configs.textType == 'divider') {
                            ctx.fillStyle = "white";
                            ctx.font = (configs.fontSize*ig.game.fontRatio) + "px " + ig.game.fontBubbleThin;
                        }

                        if(isStrokeText) {
                            ctx.lineCap = "round";
                            ctx.lineJoin = 'round'; 
                            ctx.strokeText(arrText[j],
                            drawPos.x + widthText,
                            drawPos.y + i * configs.textData.fontHeight);
                        }
                        ctx.fillText(arrText[j],
                            drawPos.x + widthText,
                            drawPos.y + i * configs.textData.fontHeight);
                    }
                }
            }

            if(configs.counterAnim != 0) {
                if(configs.counterAnim % 10 == 0) configs.showFlash5 = (configs.showFlash5) ? false : true;
                if(configs.counterAnim % 20 == 0) configs.showFlash4 = (configs.showFlash4) ? false : true;
                if(configs.counterAnim % 30 == 0) configs.showFlash3 = (configs.showFlash3) ? false : true;
                if(configs.counterAnim % 40 == 0) configs.showFlash2 = (configs.showFlash2) ? false : true;
                if(configs.counterAnim % 50 == 0) configs.showFlash1 = (configs.showFlash1) ? false : true;

                if(configs.counterAnim % 8 == 0) configs.showShake1 = (configs.showShake1) ? false : true;
                if(configs.counterAnim % 7 == 0) configs.showShake2 = (configs.showShake2) ? false : true;
                if(configs.counterAnim % 6 == 0) configs.showShake3 = (configs.showShake3) ? false : true;
                if(configs.counterAnim % 5 == 0) configs.showShake4 = (configs.showShake4) ? false : true;
                if(configs.counterAnim % 4 == 0) configs.showShake5 = (configs.showShake5) ? false : true;
            } 
            configs.counterAnim++;
            
            ctx.restore();
        }
    };

    ig.ChatBubble.Factory.Text.DEFAULT_CONFIGS = {
        text: "",
        fillStyle: "black",
        textAlign: "center", // [center|left|right];
        fontSize: 24,
        fontFamily: "Arial"
    };
});