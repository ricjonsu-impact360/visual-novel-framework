ig.module('plugins.progressbar')
.requires('impact.entity')
.defines(function () {

    EntityProgressBar = ig.Entity.extend({
        id:'',
        zIndex: _DATAGAME.zIndexData.progressBar,
        alpha: 0,
        barPadding: 20,
        lastCurrentProgress: -1,
        toBeRemoved: false,
        barPosition:'top',
        clippingWidth:0,

        prevPos:{x:0, y:0},
        defPos:{x:0, y:0},
        
        scale: { x: 1, y: 1 },

        barProperties: {
            "showText" : true,
            "showMaxValue" : true,
            "width" : 400,
            "height" : 100,
            "progressColor" : 'white',
            "strokeColor" : 'black',
            "strokeThickness" : 15,
            "corner" : 15,
            "textColor" : 'black',
            "textSize" : 50
        },

        staticInstantiate: function () {
            if (typeof EntityProgressBar.progressBarArr === 'undefined') {
                EntityProgressBar.progressBarArr = [];
            }
            return undefined;
        },

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.anchorCenter();
            this.handleExistingBar();
            this.tweenIn();

            ig.game.sortEntitiesDeferred();
        },

        anchorCenter: function () {
            this.pos.x -= this.barProperties.width * 0.5;
            this.pos.y -= this.barProperties.height * 0.5;
        },

        handleExistingBar: function () {
            EntityProgressBar.progressBarArr.unshift(this);
        },

        tweenIn: function () {
            this.tween({ alpha: 1, scale: { x: 1, y: 1 } }, 0.25, {
                easing: ig.Tween.Easing.Quadratic.EaseInOut,
                onComplete: function () {
                    // this.delayTimer = new ig.Timer(this.timeAlive);
                    // this.delayedFunction = this.tweenFadeOut;
                }.bind(this)
            }).start();
        },

        tweenFadeOut: function () {
            this.tween({ alpha: 0 }, 0.1, { //0.25
                onComplete: function () {
                    this.toBeRemoved = true;
                }.bind(this)
            }).start();
        },

        handleDelayTimer: function () {
            if (this.delayTimer && this.delayTimer.delta() > 0) {
                this.delayTimer = null;
                this.delayedFunction();
                this.delayedFunction = null;
            }
        },

        repos:function() {
            var _position = ig.system.height * 0.04;

            if(this.barPosition == 'bottom') _position = ig.system.height * 0.96;
            else if(this.barPosition == 'center' || this.barPosition == 'middle') _position = ig.system.height * 0.5;

            this.defPos = {
                x:ig.system.width / 2,
                y:_position
            }
        },

        checkClippingProgress:function() {
            if(this.lastCurrentProgress >= 0) {
                if(this.lastCurrentProgress != ig.game.sessionData[_DATAGAME.progressBar[this.id].current]) {
                    var _finalClip = ig.game.sessionData[_DATAGAME.progressBar[this.id].current] / ig.game.sessionData[_DATAGAME.progressBar[this.id].max] * this.barProperties.width;
                    if(_finalClip >= this.barProperties.width) _finalClip = this.barProperties.width;
                    else if(_finalClip <= 0) _finalClip = 0;

                    var _distance = Math.abs(_finalClip - this.clippingWidth) / this.barProperties.width;

                    if(this.tweenProgress != null) this.tweenProgress.stop();
                    this.tweenProgress = this.tween({ clippingWidth: _finalClip }, _distance).start();
                }
                this.lastCurrentProgress = ig.game.sessionData[_DATAGAME.progressBar[this.id].current];
            } else {
                this.lastCurrentProgress = ig.game.sessionData[_DATAGAME.progressBar[this.id].current];
                this.clippingWidth = ig.game.sessionData[_DATAGAME.progressBar[this.id].current] / ig.game.sessionData[_DATAGAME.progressBar[this.id].max] * this.barProperties.width;
                if(this.clippingWidth >= this.barProperties.width) this.clippingWidth = this.barProperties.width;
                else if(this.clippingWidth <= 0) _finalClip = 0;
            }           
        },

        draw: function () {
            this.parent();
            var ctx = ig.system.context;
            ctx.save();
            ctx.globalAlpha = this.alpha;

            ctx.translate(this.defPos.x + this.pos.x + this.barProperties.width * 0.5, this.pos.y + this.barProperties.height * 0.5);
            ctx.scale(this.scale.x, this.scale.y);
            ctx.translate(-this.pos.x - this.barProperties.width * 0.5, -this.pos.y - this.barProperties.height * 0.5);

            if(this.barProperties.isStroke) {
                ctx.fillStyle = this.barProperties.strokeColor;
                ctx.strokeStyle = this.barProperties.strokeColor;
                ctx.roundRect(this.pos.x, this.pos.y, this.barProperties.width, this.barProperties.height, this.barProperties.corner, this.barProperties.isStroke, this.barProperties.strokeThickness);
            }
            
            ctx.save();
            ctx.beginPath();
            this.checkClippingProgress();
            ctx.rect(this.pos.x, this.pos.y, this.clippingWidth, this.barProperties.height);
            ctx.clip();

            ctx.fillStyle = this.barProperties.progressColor;
            ctx.strokeStyle = this.barProperties.strokeColor;
            ctx.roundRect(this.pos.x, this.pos.y, this.barProperties.width, this.barProperties.height, this.barProperties.corner, this.barProperties.isStroke, this.barProperties.strokeThickness);
            ctx.restore();

            if(this.barProperties.showText == true) {
                var _fontSize = Math.round(this.barProperties.textSize * ig.game.fontRatio);
                ctx.font = _fontSize + 'px ' + ig.game.fontName;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                
                if(this.barProperties.strokeTextThickness > 0) {
                    ctx.lineCap = "round";
                    ctx.lineJoin = 'round'; 
                    ctx.strokeStyle = this.barProperties.strokeTextColor;
                    ctx.lineWidth = this.barProperties.strokeTextThickness;
                    ctx.strokeText(_DATAGAME.progressBar[this.id].text, this.pos.x + 10*_DATAGAME.ratioRes, this.pos.y+ this.barProperties.height * 0.5);
                }

                ctx.fillStyle = this.barProperties.textColor;
                ctx.fillText(_DATAGAME.progressBar[this.id].text, this.pos.x + 10*_DATAGAME.ratioRes, this.pos.y+ this.barProperties.height * 0.5);

                ctx.textAlign = 'right';
                var _currentProgress = this.convertNumber(ig.game.sessionData[_DATAGAME.progressBar[this.id].current]);
                var _maxProgress = this.convertNumber(ig.game.sessionData[_DATAGAME.progressBar[this.id].max]);

                if(this.barProperties.strokeTextThickness > 0) {
                    ctx.lineCap = "round";
                    ctx.lineJoin = 'round'; 
                    ctx.strokeStyle = this.barProperties.strokeTextColor;
                    ctx.lineWidth = this.barProperties.strokeTextThickness;
                    if(!this.barProperties.showMaxValue) {
                        ctx.strokeText(_currentProgress, this.pos.x + this.barProperties.width - 10*_DATAGAME.ratioRes, this.pos.y+ this.barProperties.height * 0.5);
                    } else {
                        ctx.strokeText(_currentProgress + ' / ' + _maxProgress, this.pos.x + this.barProperties.width - 10*_DATAGAME.ratioRes, this.pos.y+ this.barProperties.height * 0.5);
                    }
                }

                if(!this.barProperties.showMaxValue) {
                    ctx.fillText(_currentProgress, this.pos.x + this.barProperties.width - 10*_DATAGAME.ratioRes, this.pos.y+ this.barProperties.height * 0.5);
                } else {
                    ctx.fillText(_currentProgress + ' / ' + _maxProgress, this.pos.x + this.barProperties.width - 10*_DATAGAME.ratioRes, this.pos.y+ this.barProperties.height * 0.5);
                }
                
            }
        
            ctx.restore();
        },

        formatNumberWithCommas:function(num) {
            if (num == null) return "0";
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        convertNumber:function(_numToConvert) {
            if(_DATAGAME.defaultProgressBar.simplifyNumber && _numToConvert >= 1000) {
                return this.formatNumberWithCommas(_numToConvert / 1000) + 'K';
            } else {
                return this.formatNumberWithCommas(_numToConvert);
            }
        },

        update: function () {
            if(ig.game.isPauseSetting) return;

            if (this.toBeRemoved) {
                var index = EntityProgressBar.progressBarArr.indexOf(this);
                if (index > -1) {
                    EntityProgressBar.progressBarArr.splice(index, 1);
                }
                this.kill(); 
                return;
            } else {
                var indexNow = EntityProgressBar.progressBarArr.indexOf(this);
                var totalHeight = 0;
                for(var totHeight=0;totHeight < indexNow;totHeight++) {
                    totalHeight += this.barProperties.height;
                    // totalHeight += EntityProgressBar.progressBarArr[totHeight].notifProperties.adjustedHeight;
                }

                var lastPos = this.defPos.y + totalHeight + this.barPadding * indexNow;
                if(this.barPosition == 'top') {
                    lastPos = this.defPos.y + totalHeight + this.barPadding * indexNow - this.barProperties.height*0.5;
                } else if(this.barPosition == 'bottom') {
                    lastPos = this.defPos.y - totalHeight - this.barPadding * indexNow - this.barProperties.height*0.5;
                } else if(this.barPosition == 'center' || this.barPosition == 'middle') {
                    this.defPos.y = ig.system.height * 0.5 - (EntityProgressBar.progressBarArr.length* this.barProperties.height)/2 - (EntityProgressBar.progressBarArr.length*this.barPadding)/2;
                    lastPos = this.defPos.y + this.barProperties.height*indexNow + this.barPadding * indexNow;
                }

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

    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, stroke, strokeWidth) {
        if (typeof stroke == "undefined" ) {
            stroke = false;
        }
        if (typeof radius === "undefined") {
            radius = 0;
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
            this.lineWidth = strokeWidth;
            this.stroke();
        }
        this.fill();
        this.restore();
    };
});
