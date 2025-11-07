ig.module('plugins.notification')
.requires('impact.entity')
.defines(function () {

    EntityNotification = ig.Entity.extend({
        // Constants
        lineHeight: 55,
        maxLines: 10,

        // Properties
        zIndex: _DATAGAME.zIndexData.notification,
        alpha: 0,
        text: '',
        fontFace: 'Arial',
        fontSize: 50,
        fontColor: '#fff',
        delayTimer: null,
        delayedFunction: null,
        notifWidth: 800,
        notifHeight: 50,
        notifPadding: 20,
        toBeRemoved: false,
        backgroundColor: '#2F463B',
        outlineColor: 'black',
        notifPosition:'top',

        configs: {},

        textAnchor: 'center',
        textVAlign: 'middle',
        textAlign: 'center',
        textBaseline: 'top',

        timeAlive:1,

        prevPos:{x:0, y:0},
        defPos:{x:0, y:0},

        formatText:{ formatText0:{reset: true}},
        
        scale: { x: 0, y: 1 },

        notifProperties: {},
        staticInstantiate: function () {
            if (typeof EntityNotification.notificationArr === 'undefined') {
                EntityNotification.notificationArr = [];
            }
            return undefined;
        },

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.anchorCenter();
            this.handleExistingNotifications();
            this.tweenIn();

            this.fontSize = _DATAGAME.toastBox.fontSize*_DATAGAME.ratioRes;
            this.lineHeight = _DATAGAME.toastBox.fontSize*_DATAGAME.ratioRes*1.1;
            this.fontFace = ig.game.fontNameThin;
            this.fontColor = _DATAGAME.toastBox.fontColor;
            this.backgroundColor = _DATAGAME.toastBox.boxColor;
            this.outlineColor = _DATAGAME.toastBox.outlineColor;

            // Precompute wrappedLines during initialization
            var ctx = ig.system.context;
            ctx.font = this.fontSize + 'px ' + this.fontFace;

            var wrapText = ig.game.wordWrapForChatBubble(this.text, this.notifWidth - 2 * this.notifPadding, this.fontSize, this.fontFace, true, this.formatText);
            var wrapTextwoFormat = wrapText.replaceAll("<>", "");
            var wrapTextwoFormatLines = wrapTextwoFormat.split("<br>");
            // this.wrappedLines = this.wrapTextAndGetLines(ctx, this.text, this.notifWidth - 2 * this.notifPadding);
            this.wrappedLines = wrapText.split("<br>");

            // Use precomputed wrappedLines
            this.notifProperties.lines = this.wrappedLines;
                    
            // Adjust the width and height of the notification based on the text
            // this.notifProperties.longestLineWidth = Math.max.apply(null, this.notifProperties.lines.map(function (line) {
            //     return ctx.measureText(line).width;
            // }));
            this.notifProperties.longestLineWidth = Math.max.apply(null, wrapTextwoFormatLines.map(function (line) {
                return ctx.measureText(line).width;
            }));

            this.notifProperties.adjustedWidth = Math.max(this.notifWidth, this.notifProperties.longestLineWidth + 2 * this.notifPadding);
            this.notifProperties.adjustedHeight = Math.min(this.notifProperties.lines.length, this.maxLines) * this.lineHeight + 2 * this.notifPadding;

            this.configs = {
                textData:{
                    textLines: this.notifProperties.lines
                },
                fontSize:this.fontSize,
                fillStyle:this.fontColor,
                fontFamily:this.fontFace,
                counterAnim:0,
                showFlash:[true, true, true, true, true, true],
                showShake:[true, true, true, true, true, true]
            };
 
            ig.game.sortEntitiesDeferred();
        },

        anchorCenter: function () {
            this.pos.x -= this.notifWidth * 0.5;
            this.pos.y -= this.notifHeight * 0.5;
        },

        handleExistingNotifications: function () {
            // for (var i = 0; i < EntityNotification.notificationArr.length; i++) {
            //     EntityNotification.notificationArr[i].tweenMoveUp();
            // }
            // EntityNotification.notificationArr.push(this);
            EntityNotification.notificationArr.unshift(this);
        },

        tweenIn: function () {
            this.tween({ alpha: 1, scale: { x: 1, y: 1 } }, 0.25, {
                easing: ig.Tween.Easing.Quadratic.EaseInOut,
                onComplete: function () {
                    this.delayTimer = new ig.Timer(this.timeAlive);
                    this.delayedFunction = this.tweenFadeOut;
                }.bind(this)
            }).start();
        },

        tweenFadeOut: function () {
            this.tween({ alpha: 0 }, 0.25, {
                onComplete: function () {
                    this.toBeRemoved = true;
                }.bind(this)
            }).start();
        },

        tweenMoveUp: function () {
            // this.tween({ pos: { y: this.pos.y - this.notifProperties.adjustedHeight - this.notifPadding } }, 0.1).start();
        },

        handleDelayTimer: function () {
            if (this.delayTimer && this.delayTimer.delta() > 0) {
                this.delayTimer = null;
                this.delayedFunction();
                this.delayedFunction = null;
            }
        },

        getStartX: function (longestLineWidth, adjustedWidth) {
            switch (this.textAnchor) {
                case 'center':
                    return this.getCenteredStartX(longestLineWidth, adjustedWidth);
                case 'right':
                    return this.getRightAlignedStartX(longestLineWidth, adjustedWidth);
                default: // 'left'
                    return this.getLeftAlignedStartX(longestLineWidth, adjustedWidth);
            }
        },

        getCenteredStartX: function (longestLineWidth, adjustedWidth) {
            if (this.textAlign === 'center') {
                return this.pos.x + adjustedWidth / 2;
            } else if (this.textAlign === 'left') {
                return this.pos.x + adjustedWidth / 2;
            } else { // 'right'
                return this.pos.x + adjustedWidth / 2 - longestLineWidth;
            }
        },

        getRightAlignedStartX: function (longestLineWidth, adjustedWidth) {
            if (this.textAlign === 'center') {
                return this.pos.x + adjustedWidth - longestLineWidth / 2;
            } else if (this.textAlign === 'left') {
                return this.pos.x + adjustedWidth - longestLineWidth;
            } else { // 'right'
                return this.pos.x + adjustedWidth;
            }
        },

        getLeftAlignedStartX: function (longestLineWidth, adjustedWidth) {
            if (this.textAlign === 'center') {
                return this.pos.x + longestLineWidth / 2 + this.notifPadding;
            } else if (this.textAlign === 'left') {
                return this.pos.x + this.notifPadding;
            } else { // 'right'
                return this.pos.x;
            }
        },

        getStartY: function (totalTextHeight, adjustedHeight, lineCount) {
            switch (this.textVAlign) {
                case 'middle':
                    return this.pos.y + adjustedHeight / 2 - lineCount * this.lineHeight / 2;
                case 'bottom':
                    return this.pos.y + adjustedHeight - totalTextHeight - this.notifPadding;
                default: // 'top'
                    return this.pos.y + this.notifPadding;
            }
        },
        
        wrapTextAndGetLines: function (ctx, text, maxWidth) {
            var words = text.split(' ');
            var line = '';
            var lines = [];
            for (var n = 0; n < words.length; n++) {
                while (ctx.measureText(words[n]).width > maxWidth) {
                    var tmp = words[n];
                    words[n] = tmp.substring(0, tmp.length - 1);
                    if (n < words.length - 1) {
                        words[n + 1] = tmp[tmp.length - 1] + words[n + 1];
                    } else {
                        words.push(tmp[tmp.length - 1]);
                    }
                }
                        
                var testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
    
            if (lines.length > this.maxLines) {
                lines = lines.slice(0, this.maxLines);
                var lastLine = lines[this.maxLines - 1].trim();
                if (lastLine.length > 3) {
                    lastLine = lastLine.substring(0, lastLine.length - 3);
                }
                lines[this.maxLines - 1] = lastLine + "...";
            }       
        
            return lines;
        },

        repos:function() {
            var _position = ig.system.height * 0.1;

            if(this.notifPosition == 'bottom') _position = ig.system.height * 0.95;
            else if(this.notifPosition == 'center' || this.notifPosition == 'middle') _position = ig.system.height * 0.5;

            this.defPos = {
                x:ig.system.width / 2,
                y:_position
            }
        },

        draw: function () {
            this.parent();
            var ctx = ig.system.context;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.defPos.x + this.pos.x + this.notifProperties.adjustedWidth * 0.5, this.pos.y + this.notifProperties.adjustedHeight * 0.5);
            ctx.scale(this.scale.x, this.scale.y);
            ctx.translate(-this.pos.x - this.notifProperties.adjustedWidth * 0.5, -this.pos.y - this.notifProperties.adjustedHeight * 0.5);

            // Set the font, textAlign, and textBaseline
            ctx.font = this.fontSize + 'px ' + this.fontFace;
            ctx.textAlign = 'left';
            ctx.textBaseline = this.textBaseline;
            ctx.fillStyle = this.fontColor;

            ctx.save();
            // ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            // ctx.shadowBlur = 6;
            // ctx.shadowOffsetX = 6;
            // ctx.shadowOffsetY = 6;
            ctx.globalAlpha = _DATAGAME.toastBox.opacity;
            ctx.fillStyle = this.backgroundColor;
            ctx.roundRect(this.pos.x, this.pos.y, this.notifProperties.adjustedWidth, this.notifProperties.adjustedHeight, _DATAGAME.toastBox.corner*_DATAGAME.ratioRes);

            if(this.outlineColor != null && this.outlineColor != 'none' && this.outlineColor != '') {
                ctx.lineWidth = 5;
                ctx.strokeStyle = this.outlineColor;
                ctx.stroke();
            }

            ctx.restore();

            // ctx.fillStyle = this.fontColor;

            // var startX = this.getStartX(this.notifProperties.longestLineWidth, this.notifProperties.adjustedWidth);
            // var startY = this.getStartY(this.notifProperties.lines.length * this.lineHeight, this.notifProperties.adjustedHeight, Math.min(this.notifProperties.lines.length, this.maxLines));

            // // Directly draw the precomputed wrappedLines
            // for (var i = 0; i < this.notifProperties.lines.length; i++) {
            //     ctx.fillText(this.notifProperties.lines[i], startX, startY + i * this.lineHeight);
            // }

            this.drawText(ctx, '');
        
            ctx.restore();
        },

        drawText: function (ctx, formatTextName) {
            var configs = this.configs;
            ctx.font = this.fontSize + 'px ' + this.fontFace;
            ctx.textAlign = 'left';
            ctx.textBaseline = this.textBaseline;
            ctx.fillStyle = this.fontColor;

            var startX = this.getStartX(this.notifProperties.longestLineWidth, this.notifProperties.adjustedWidth);
            var startY = this.getStartY(this.notifProperties.lines.length * this.lineHeight, this.notifProperties.adjustedHeight, Math.min(this.notifProperties.lines.length, this.maxLines));

            // // Directly draw the precomputed wrappedLines
            // for (var i = 0; i < this.notifProperties.lines.length; i++) {
            //     ctx.fillText(this.notifProperties.lines[i], startX, startY + i * this.lineHeight);
            // }
            // _____________________
           
            // var drawPos = this.getTextDrawPos(configs, ctx); 
            var noFormat = 0;
            for (var i = 0; i < configs.textData.textLines.length; i++) {
                var arrText = configs.textData.textLines[i].split("<>");
                var widthTextAll = ctx.measureText(configs.textData.textLines[i].replaceAll("<>", "")).width;
                var widthText = 0;

                var offsetX=0;
                if(this.textAlign == 'center' && this.textAnchor == 'center') offsetX = -widthTextAll/2;

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

                    if (noFormat == 0 || (noFormat != 0 && this.formatText['formatText' + formatTextName + noFormat].reset != null && this.formatText['formatText' + formatTextName + noFormat].reset == true)) {
                        ctx.fillStyle = configs.fillStyle;
                        ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
                    } else {
                        // console.log('formatText' + formatTextName + noFormat);
                        // console.log(this.formatText['formatText' + formatTextName + noFormat]);

                        if (this.formatText['formatText' + formatTextName + noFormat].color == null) {
                            ctx.fillStyle = configs.fillStyle;
                        } else {
                            ctx.fillStyle = this.formatText['formatText' + formatTextName + noFormat].color;
                        }
                        
                        if (this.formatText['formatText' + formatTextName + noFormat].format != null) {
                            if(ig.ua.iOS == true) {
                                if(this.formatText['formatText' + formatTextName + noFormat].format.search('bold') == -1) {
                                    ctx.font = this.formatText['formatText' + formatTextName + noFormat].format + " " + configs.fontSize + "px" + " " + configs.fontFamily;
                                } else {
                                    var tempFormatText = this.formatText['formatText' + formatTextName + noFormat].format.replaceAll('bold', '');
                                    ctx.font = tempFormatText + " " + configs.fontSize + "px" + " " + configs.fontFamily;
                                    isStrokeText = true;
                                }
                            } else {
                                ctx.font = this.formatText['formatText' + formatTextName + noFormat].format + " " + configs.fontSize + "px" + " " + configs.fontFamily;
                            }
                        } else {
                            ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
                        }
                    }

                    if(noFormat != 0 && this.formatText['formatText' + formatTextName + noFormat].animEffect != null) { // && ig.game.windowName == 'game' && !ig.game.currentWindow.loadSentence
                        if(this.formatText['formatText' + formatTextName + noFormat].animEffect == 'flash') {
                            if(this.formatText['formatText' + formatTextName + noFormat].speed == null) {
                                this.formatText['formatText' + formatTextName + noFormat].speed = 1;
                            }

                            if(configs['showFlash' + this.formatText['formatText' + formatTextName + noFormat].speed]) {
                                ctx.fillText(arrText[j],
                                    startX + widthText + offsetX, 
                                    startY + i * this.lineHeight);
                                // drawPos.x + widthText,
                                // drawPos.y + i * configs.textData.fontHeight);
                            }
                        }
                        else if(this.formatText['formatText' + formatTextName + noFormat].animEffect == 'shake') {
                            if(this.formatText['formatText' + formatTextName + noFormat].speed == null) {
                                this.formatText['formatText' + formatTextName + noFormat].speed = 1;
                            }

                            if(configs['showShake' + this.formatText['formatText' + formatTextName + noFormat].speed]) {
                                ctx.fillText(arrText[j],
                                    startX + widthText + offsetX + 1, 
                                    startY + i * this.lineHeight);
                                // drawPos.x + widthText + 1,
                                // drawPos.y + i * configs.textData.fontHeight);
                            } else {
                                ctx.fillText(arrText[j],
                                    startX + widthText + offsetX - 1, 
                                    startY + i * this.lineHeight);
                                // drawPos.x + widthText - 1,
                                // drawPos.y + i * configs.textData.fontHeight);
                            }
                        }
                    } else {
                        if(isStrokeText) {
                            ctx.lineCap = "round";
                            c.lineJoin = 'round'; 
                            ctx.strokeText(arrText[j],
                                startX + widthText + offsetX, 
                                startY + i * this.lineHeight);
                            // drawPos.x + widthText,
                            // drawPos.y + i * configs.textData.fontHeight);
                        }
                        ctx.fillText(arrText[j],
                            startX + widthText + offsetX, 
                            startY + i * this.lineHeight);
                            // drawPos.x + widthText,
                            // drawPos.y + i * configs.textData.fontHeight);
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
            
            // ctx.restore();
        },

        update: function () {
            if(ig.game.isPauseSetting) return;

            if (this.toBeRemoved) {
                var index = EntityNotification.notificationArr.indexOf(this);
                if (index > -1) {
                    EntityNotification.notificationArr.splice(index, 1);
                }
                this.kill();
                return;
            } else {
                var indexNow = EntityNotification.notificationArr.indexOf(this);
                var totalHeight = 0;
                for(var totHeight=0;totHeight <= indexNow;totHeight++) {
                    totalHeight += EntityNotification.notificationArr[totHeight].notifProperties.adjustedHeight;
                }

                var lastPos = this.defPos.y - totalHeight - this.notifPadding * indexNow;
                if(this.prevPos.y != lastPos) {
                    if(this.tweenMoveUPorDown != null) this.tweenMoveUPorDown.stop();
                    this.prevPos.y = lastPos;
                    this.tweenMoveUPorDown = this.tween({ pos: { y: lastPos } }, 0.1).start();
                }
            }
            this.parent();
            this.handleDelayTimer();
        }
    });

    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, stroke) {
        if (typeof stroke == "undefined" ) {
            stroke = false;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        this.save();
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
        if (stroke) {
            this.lineWidth = 4;
            this.stroke();
        }
        this.fill();
        this.restore();
    };
});
