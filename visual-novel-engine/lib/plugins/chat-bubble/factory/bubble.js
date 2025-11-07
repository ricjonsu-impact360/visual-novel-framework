ig.module(
    'plugins.chat-bubble.factory.bubble'
).defines(function () {
    "use strict";

    ig.ChatBubble.Factory.Bubble = {
        generate: function (configs, contentCanvas) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            // update canvas size with content
            if (contentCanvas) {
                canvas.width = contentCanvas.width;
                canvas.height = contentCanvas.height;
            } else {
                canvas.width = configs.box.width;
                canvas.height = configs.box.height;
            }

            // update canvas size with bubble
            var contentArea = this.updateCanvasSize(configs, canvas);
            configs.contentArea = contentArea;

            // draw bubble
            this.draw(configs, context);
            this.drawContentCanvas(configs, context, contentCanvas);
            // console.log(canvas.height);
            return {
                configs: configs,
                canvas: canvas
            };
        },

        updateCanvasSize: function (configs, canvas) {
            // console.log(canvas.height);
            
            var width = canvas.width;
            var height = canvas.height;

            // content min size
            if (width < configs.box.width) width = configs.box.width;
            if (height < configs.box.height) height = configs.box.height;

            // content center pos
            var contentArea = {
                x: width * 0.5,
                y: height * 0.5,
                w: width,
                h: height
            };

            // add line width  
            contentArea.x += configs.lineWidth;
            contentArea.y += configs.lineWidth;
            contentArea.w += configs.lineWidth;
            contentArea.h += configs.lineWidth;
            width += configs.lineWidth * 2;
            height += configs.lineWidth * 2;

            // add padding
            contentArea.x += configs.box.padding.x;
            contentArea.y += configs.box.padding.y;
            contentArea.w += configs.box.padding.x;
            contentArea.h += configs.box.padding.y;
            width += configs.box.padding.x * 2;
            height += configs.box.padding.y * 2;

            // add tail offset
            this.handleTailOffset(configs, contentArea);

            if (configs.tail.offset.x <= 0) contentArea.x += Math.abs(configs.tail.offset.x);
            if (configs.tail.offset.y <= 0) contentArea.y += Math.abs(configs.tail.offset.y);
            width += Math.abs(configs.tail.offset.x);
            height += Math.abs(configs.tail.offset.y);

            // add shadow offset     
            contentArea.x += configs.shadowOffsetX;
            contentArea.y += configs.shadowOffsetY;
            width += configs.shadowOffsetX * 2;
            height += configs.shadowOffsetY * 2;

            // add shadow blur   
            contentArea.x += configs.shadowBlur;
            contentArea.y += configs.shadowBlur;
            width += configs.shadowBlur * 2;
            height += configs.shadowBlur * 2;

            // update canvas size
            canvas.width = width;
            canvas.height = height; //+ configs.sizeTextName.y;

            // return content center pos
            return contentArea;
        },

        handleTailOffset: function (configs, contentArea) {
            // prevent tail inside
            if (configs.tail.direction.x < 0) configs.tail.direction.x = 0;
            if (configs.tail.direction.x > 1) configs.tail.direction.x = 1;
            if (configs.tail.direction.y < 0) configs.tail.direction.y = 0;
            if (configs.tail.direction.y > 1) configs.tail.direction.y = 1;
            // lock a direction
            configs.tail.direction.xLock = (configs.tail.direction.x == 0) || (configs.tail.direction.x == 1);
            configs.tail.direction.yLock = (configs.tail.direction.y == 0) || (configs.tail.direction.y == 1);

            if (!configs.tail.direction.xLock && !configs.tail.direction.yLock) {
                var tempX = (configs.tail.direction.x - 0.5);
                var tempY = (configs.tail.direction.y - 0.5);
                if (Math.abs(tempX) > Math.abs(tempY)) {
                    configs.tail.direction.x = (tempX < 0) ? 0 : 1;
                    configs.tail.direction.xLock = true;
                } else {
                    configs.tail.direction.y = (tempY < 0) ? 0 : 1;
                    configs.tail.direction.yLock = true;
                }
            } else {
                if (configs.tail.direction.yLock && configs.tail.direction.xLock) {
                    if (contentArea.w > contentArea.h) {
                        configs.tail.direction.xLock = false;
                    } else {
                        configs.tail.direction.yLock = false;
                    }
                }
            }

            configs.tail.offset = {
                x: configs.tail.direction.xLock ? Math.round((configs.tail.direction.x - 0.5) * configs.tail.length * 2) : 0,
                y: configs.tail.direction.yLock ? Math.round((configs.tail.direction.y - 0.5) * configs.tail.length * 2) : 0
            };
        },

        draw: function (configs, ctx) {
            // console.log(configs.contentArea.h);
            var _sizeTextNameY= 0;
            if(configs.sizeTextName != null && configs.sizeTextName.y != null) _sizeTextNameY = configs.sizeTextName.y;

            var round = configs.box.round;
            var x = configs.contentArea.x - configs.contentArea.w * 0.5;
            var y = configs.contentArea.y - configs.contentArea.h * 0.5;
            var w = configs.contentArea.w;
            var h = configs.contentArea.h - _sizeTextNameY;
            var xMax = x + w;
            var yMax = y + h;

            var tailWidth = configs.tail.width;

            var tail = {
                x: x + w * configs.tail.direction.x + configs.tail.offset.x,
                y: y + h * configs.tail.direction.y + configs.tail.offset.y
            };

            if(configs.chatType == 'think' || configs.tail.position == 'none') { //configs.tail.position == 'center' || 
                tailWidth = 0;
                tail = {
                    x: x + w * configs.tail.direction.x + 0,
                    y: y + h * configs.tail.direction.y + 0
                };
            }

            if (tail.y < y || tail.y > yMax) {
                var tail1 = Math.min(Math.max(x + round, tail.x - tailWidth), xMax - round - tailWidth * 2);
                var tail2 = Math.min(Math.max(x + round + tailWidth * 2, tail.x + tailWidth), xMax - round);
            } else {
                var tail1 = Math.min(Math.max(y + round, tail.y - tailWidth), yMax - round - tailWidth * 2);
                var tail2 = Math.min(Math.max(y + round + tailWidth * 2, tail.y + tailWidth), yMax - round);
            }
            
            var direction;
            if (tail.y < y) direction = "top";
            if (tail.y > y) direction = "bottom";
            if (tail.x < x && tail.y >= y && tail.y <= yMax) direction = "left";
            if (tail.x > x && tail.y >= y && tail.y <= yMax) direction = "right";
            if (tail.x >= x && tail.x <= xMax && tail.y >= y && tail.y <= yMax) direction = "center"; // should'nt fall here

            var stretchTail = {
                x:xMax*(configs.tail.direction.stretchx - configs.tail.direction.x),
                y:yMax*(configs.tail.direction.stretchy - configs.tail.direction.y),
            };

            if(configs.tail.direction.stretchx < 0) stretchTail.x = 0;
            if(configs.tail.direction.stretchy < 0) stretchTail.y = 0;

            if(configs.chatType == 'think' || configs.tail.position == 'none') { //configs.tail.position == 'center' || 
                stretchTail.x = 0;
                stretchTail.y = 0;
            }

            var plusTailY = (configs.chatType == 'text') ? 30 : 0;

            if(configs.textType != 'divider') {
                if(configs.chatType != 'none') {
                    ctx.save();
                    ctx.translate(0, _sizeTextNameY);
                    ctx.beginPath();
                    ctx.moveTo(x + round, y);
                    if (direction == "top") {
                        ctx.lineTo(tail1, y);
                        ctx.lineTo(tail.x + stretchTail.x, tail.y);
                        ctx.lineTo(tail2, y);
                        ctx.lineTo(xMax - round, y);
                    } else ctx.lineTo(xMax - round, y);
                    ctx.quadraticCurveTo(xMax, y, xMax, y + round);

                    if (direction == "right") {
                        if(configs.chatType == 'text') {
                            if(!configs.noTail){
                                ctx.lineTo(xMax, 34);
                                ctx.lineTo(tail.x-10, 34+13);
                                ctx.lineTo(xMax, 60);
                                ctx.lineTo(xMax, yMax - round);
                            } else ctx.lineTo(xMax, yMax - round);
                        } else {
                            ctx.lineTo(xMax, tail1);
                            ctx.lineTo(tail.x, tail.y+plusTailY);
                            ctx.lineTo(xMax, tail2);
                            ctx.lineTo(xMax, yMax - round);
                        } 
                    } else ctx.lineTo(xMax, yMax - round);
                    ctx.quadraticCurveTo(xMax, yMax, xMax - round, yMax);


                    if (direction == "bottom") {
                        ctx.lineTo(tail2, yMax);
                        ctx.lineTo(tail.x, tail.y);
                        ctx.lineTo(tail1, yMax);
                        ctx.lineTo(x + round, yMax);
                    } else ctx.lineTo(x + round, yMax);+
                    ctx.quadraticCurveTo(x, yMax, x, yMax - round);

                    if (direction == "left") {
                        if(configs.chatType == 'text') {
                            if(!configs.noTail){
                                ctx.lineTo(x, 60);
                                ctx.lineTo(tail.x+10, 34+13);
                                ctx.lineTo(x, 34); 
                                ctx.lineTo(x, y + round);
                            } else ctx.lineTo(x, y + round);
                        } else {
                            ctx.lineTo(x, tail2);
                            ctx.lineTo(tail.x, tail.y+plusTailY);
                            ctx.lineTo(x, tail1);
                            ctx.lineTo(x, y + round);
                        }
                    } else ctx.lineTo(x, y + round);
                    ctx.quadraticCurveTo(x, y, x + round, y);
                    ctx.closePath();
                }

                ctx.save();
                ctx.globalAlpha = configs.fillOpacity;
                ctx.shadowColor = configs.shadowColor;
                ctx.shadowBlur = configs.shadowBlur;
                ctx.shadowOffsetX = configs.shadowOffsetX;
                ctx.shadowOffsetY = configs.shadowOffsetY;
                ctx.fillStyle = configs.fillStyle;
                ctx.fill();
                ctx.restore();

                ctx.globalAlpha = 1;
                ctx.lineWidth = configs.lineWidth;
                ctx.strokeStyle = configs.strokeStyle;
                ctx.stroke();

                ctx.restore();

                ctx.save();
                ctx.translate(0, _sizeTextNameY);
                ctx.fillStyle = configs.fillStyle;
                ctx.lineWidth = configs.lineWidth+1;
                ctx.strokeStyle = configs.strokeStyle;

                if(configs.chatType == 'think') {
                    if(configs.tail.position == 'right') {
                        ctx.beginPath();
                        ctx.arc(xMax - 45, y - 18, 9, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(xMax - 24, y - 30, 6, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(xMax - 10, y - 40, 3, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                    } else if(configs.tail.position == 'left') {
                        ctx.beginPath();
                        ctx.arc(x + 45, y - 18, 9, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(x + 24, y - 30, 6, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(x + 10, y - 40, 3, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                    } else if(configs.tail.position == 'center') {
                        ctx.beginPath();
                        ctx.arc(x + (w/2) + 45, y - 18, 9, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(x + (w/2) + 24, y - 30, 6, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(x + (w/2) + 10, y - 40, 3, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                    }
                }
                ctx.restore();
            }

            if(configs.textName != null && (configs.realName != null && configs.realName.toLowerCase() != 'none')) { //&& configs.textName.toLowerCase() != 'none'
                this.drawTextName(configs, ctx);
            }
        },

        drawTextName:function(configs, c) {
            c.save();
            var _sizeTextNameY= 0;
            if(configs.sizeTextName != null && configs.sizeTextName.y != null) _sizeTextNameY = configs.sizeTextName.y;
            
            c.translate(0, _sizeTextNameY);

            // var startX = 40*_DATAGAME.ratioRes;
            var startX = configs.contentArea.x - configs.contentArea.w * 0.5;//left
            var startY = (configs.contentArea.y - configs.contentArea.h * 0.5) - _sizeTextNameY + (10*_DATAGAME.ratioRes);
            var rounded = 10*_DATAGAME.ratioRes;

            if(configs.tail.position == 'left') {
                startX = 80*_DATAGAME.ratioRes;
            } else if(configs.tail.position == 'right') {
                startX = 420*_DATAGAME.ratioRes-configs.sizeTextName.x;
            } else if(configs.tail.position == 'none') {
                if(configs.chatStyle == 'rectangle') {
                    if(_DATAGAME.speakerName.align.toLowerCase() =='center') {
                        startX += (configs.contentArea.w/2 - configs.sizeTextName.x/2);
                    } else if(_DATAGAME.speakerName.align.toLowerCase() =='right') {
                        startX += (configs.contentArea.w - configs.sizeTextName.x - 15*_DATAGAME.ratioRes);
                    } else {
                        startX += 15*_DATAGAME.ratioRes;
                    }
                }
                // startX = 30*_DATAGAME.ratioRes;
                // startY = -_sizeTextNameY/2 + 10*_DATAGAME.ratioRes;
            }
            // console.log(configs.sizeTextName);
            c.beginPath();
            c.moveTo(startX + rounded, startY);
            c.lineTo(startX + configs.sizeTextName.x - rounded, startY);
            c.quadraticCurveTo(startX + configs.sizeTextName.x, startY, startX + configs.sizeTextName.x, startY + rounded);
            c.lineTo(startX + configs.sizeTextName.x, startY + _sizeTextNameY - rounded);
            c.quadraticCurveTo(startX + configs.sizeTextName.x, startY + _sizeTextNameY, startX + configs.sizeTextName.x - rounded, startY + _sizeTextNameY);
            c.lineTo(startX + rounded, startY + _sizeTextNameY);
            c.quadraticCurveTo(startX, startY + _sizeTextNameY, startX, startY + _sizeTextNameY - rounded);
            c.lineTo(startX, startY + rounded);
            c.quadraticCurveTo(startX, startY, startX + rounded, startY);
            c.closePath();

            var colorBG = configs.textName.toLowerCase();
            colorBG = colorBG.replaceAll(" ", ""); 
            
            c.globalAlpha = _DATAGAME.speakerName.bgOpacity;
            //BG COLOR
            c.fillStyle = _DATAGAME.speakerName.bgColor;
            if(colorBG == 'none') {
                if(_DATAGAME.speakerName.bgColor != null && _DATAGAME.speakerName.bgColor.toLowerCase() != 'none') {
                    c.fillStyle = _DATAGAME.speakerName.bgColor;
                    c.fill();
                }
            } else {
                if(_DATAGAME.spriterData[colorBG].bgName == null) {
                    if(_DATAGAME.speakerName.bgColor != null && _DATAGAME.speakerName.bgColor.toLowerCase() != 'none') {
                        c.fillStyle = _DATAGAME.speakerName.bgColor;
                        c.fill();
                    }
                } else {
                    if(_DATAGAME.spriterData[colorBG].bgName.toLowerCase() != 'none') {
                        c.fillStyle = _DATAGAME.spriterData[colorBG].bgName;
                        c.fill();
                    } 
                }
            }

            c.font = ig.game.fontBubbleWeight + ' ' + configs.fontSizeName + 'px ' + configs.fontFamily;
            c.textAlign = 'center';

            //TEXT COLOR
            if(colorBG == 'none') {
                c.fillStyle = 'white';
                if(_DATAGAME.speakerName.textColor != null && _DATAGAME.speakerName.textColor.toLowerCase() != 'none') {
                    c.fillStyle = _DATAGAME.speakerName.textColor;
                }
            } else {
                c.fillStyle = 'white';
                if(_DATAGAME.spriterData[colorBG].textName == null) {
                    if(_DATAGAME.speakerName.textColor != null && _DATAGAME.speakerName.textColor.toLowerCase() != 'none') {
                        c.fillStyle = _DATAGAME.speakerName.textColor;
                    } 
                } else {
                    if(_DATAGAME.spriterData[colorBG].textName.toLowerCase() != 'none') {
                        c.fillStyle = _DATAGAME.spriterData[colorBG].textName;
                    } 
                }
            }

            c.globalAlpha = 1;
            //STROKE COLOR
            c.lineWidth = 4*_DATAGAME.ratioRes;
            if(colorBG == 'none') {
                if(_DATAGAME.speakerName.strokeColor != null && _DATAGAME.speakerName.strokeColor.toLowerCase() != 'none') {
                    c.strokeStyle = _DATAGAME.speakerName.strokeColor;
                    c.stroke();
                }
            } else {
                if(_DATAGAME.spriterData[colorBG].outlineName == null) {
                    if(_DATAGAME.speakerName.strokeColor != null && _DATAGAME.speakerName.strokeColor.toLowerCase() != 'none') {
                        c.strokeStyle = _DATAGAME.speakerName.strokeColor;
                        c.stroke();
                    }
                } else {
                    if(_DATAGAME.spriterData[colorBG].outlineName.toLowerCase() != 'none') {
                        c.strokeStyle = _DATAGAME.spriterData[colorBG].outlineName;
                        c.stroke();
                    } 
                }
            }

            // if(colorBG == 'none') {
            //     c.fillStyle = 'white';
            // } else {
            //     c.fillStyle = (_DATAGAME.spriterData[colorBG].outlineName == null) ? 'white' : _DATAGAME.spriterData[colorBG].textName;
            // }                

            var tempName = configs.realName; //textName
            if(tempName.toLowerCase() == 'amy') tempName = ig.game.sessionData.playerName;
            c.textAlign = 'center';
            c.textBaseline = "middle";
            c.fillText(tempName, startX + configs.sizeTextName.x/2, startY + _sizeTextNameY/2);
            // c.fillText(tempName, startX + configs.sizeTextName.x/2, startY + configs.sizeTextName.y/2 + 10*_DATAGAME.ratioRes);
            c.restore();
        },

        drawContentCanvas: function (configs, ctx, contentCanvas) {
            if (!contentCanvas) return ctx;

            var x = configs.contentArea.x - contentCanvas.width * 0.5;
            var y = configs.contentArea.y - contentCanvas.height * 0.5;

            ctx.drawImage(contentCanvas, x, y);
        }
    };

    ig.ChatBubble.Factory.Bubble.DEFAULT_CONFIGS = {
        lineWidth: 2,
        fillStyle: "lightblue",
        strokeStyle: "black",

        shadowColor: "black",
        shadowBlur: 4,
        shadowOffsetX: 4,
        shadowOffsetY: 4,

        box: { width: 200, height: 100, round: 10, padding: { x: 10, y: 10 } },
        tail: { length: 30, width: 15, direction: { x: 0.5, y: 0 } }
    };
});