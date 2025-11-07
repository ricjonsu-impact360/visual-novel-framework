ig.module('game.entities.object.ui-currency')
.requires(
	'impact.entity',
    'game.entities.buttons.button-shop'
)
.defines(function() {
    EntityUICurrency= ig.Entity.extend({
        icon1:new ig.Image(_RESOURCESINFO.image.vc1),
        icon2:new ig.Image(_RESOURCESINFO.image.vc2),
        icon3:new ig.Image(_RESOURCESINFO.image.vc3),
        icon4:new ig.Image(_RESOURCESINFO.image.vc4),
        icon5:new ig.Image(_RESOURCESINFO.image.vc5),
        icon6:new ig.Image(_RESOURCESINFO.image.vc6),
        icon7:new ig.Image(_RESOURCESINFO.image.vc7),
        icon8:new ig.Image(_RESOURCESINFO.image.vc8),
        size:{x:200*_DATAGAME.ratioRes, y:80*_DATAGAME.ratioRes},
        halfSize:{x:750*_DATAGAME.ratioRes, y:80*_DATAGAME.ratioRes},
        alphaNow:0,
        wCoin:0,
        xCoin:0,
        xCoinText:0,
        wFollow:0,
        xFollow:0,
        xFollowText:0,
        wHeart:0,
        xHeart:0,
        xHeartText:0,
        xMiddle:0,
        zIndex:_DATAGAME.zIndexData.UICurrency,
        plusY:0,
        fontSize:35*_DATAGAME.ratioRes,
        chatBubble:null,
        vcGain:1,
        posBubble:{x:0, y:0},
        isOnTop:false,

        isShowBubble:false,
        durShowBubble:1,
        isShop:false,

        totalColumnNow : 3,
        maxVCColumn : 3,
        totalCurrency : 3,
        arrPosition : [  ],
        arrColumn : [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        arrRow : [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],

        posIcon : [ {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ],

        startPosition : { x : 15*_DATAGAME.ratioRes, y:15*_DATAGAME.ratioRes },
        paddingPosition : { x:200*_DATAGAME.ratioRes, y:30*_DATAGAME.ratioRes },

        scaleUI:1,


        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.totalCurrency = _DATAGAME.virtualCurrencyUsed.length;

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.btnShop = ig.game.spawnEntity(EntityButtonShop, 0, 0, {_parent: this, alphaNow: 0});
            this.btnShop.isClickable = false;

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        spawnChatBubble:function(textBubble) {
            this.isShowBubble = true;
            this.repos();
            this.calculatePosBubble();

            var tailLength = 30*_DATAGAME.ratioRes;
            var tailWidth = 15*_DATAGAME.ratioRes;

            var tailX = 0.9;
            var tailY = 1;
            var stretchX = 0;
            var stretchY = 0;

            if(this.isOnTop) {
                tailY = 0; 
                stretchX = 0.9;
            }

            if(this.totalColumnNow+1 == 2) {
                tailX = 0.5;
                if(this.isOnTop) stretchX = 0.5;
            } else {
                if(this.arrColumn[this.vcGain] == 0) {
                    tailX = 0.1;
                    stretchX = 0.1;
                }
                else if(this.arrColumn[this.vcGain] == 1) {
                    tailX = 0.5;
                    if(this.isOnTop) stretchX = 0.5;
                }
                else if(this.arrColumn[this.vcGain] == 2) {
                    if(this.totalColumnNow+1 == 4) {
                        tailX = 0.5;
                        if(this.isOnTop) stretchX = 0.5;
                    }
                }
            }
            // ig.game.consoleLog(this.arrColumn);
            // if(this.vcGain == 1) { tailX = 0.1; }
            // else if(this.vcGain == 2) { tailX = 0.5; }
            // else if(this.vcGain == 3) {  }

            this.chatBubble = ig.game.spawnChatBubble(this, {
                zIndex:_DATAGAME.zIndexData.chatBubbleUICurrency,
                chatBubbleDrawConfigs: {
                    textConfigs: {
                        isReward:true,
                        fullText: textBubble,
                        text: textBubble, // text display in chat bubble
                        fillStyle: "black",
                        textAlign: "left", // [center|left|right];
                        fontSize: Math.round(ig.game.fontBubbleSize*1*_DATAGAME.ratioRes*ig.game.fontRatio),
                        fontFamily: ig.game.fontBubbleThin
                    },
                    avatarConfigs: {
                        image: null, // image display in chat bubble 
                        size: {
                            x: 100,
                            y: 100
                        }, // image size
                        padding: {
                            x: 4,
                            y: 4
                        } // extra space outside image
                    },
                    bubbleConfigs: {
                        lineWidth: 4*_DATAGAME.ratioRes,
                        fillStyle: "white",
                        strokeStyle: "black",

                        shadowColor: "black",
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,

                        isReward:true,

                        box: {
                            width: 100*_DATAGAME.ratioRes, // content min width
                            height: 60*_DATAGAME.ratioRes, // content min height
                            round: 30*_DATAGAME.ratioRes, // round curves distance
                            padding: {
                                x: 25*_DATAGAME.ratioRes,
                                y: 30*_DATAGAME.ratioRes
                            } // extra space outside the content area
                        },
                        tail: {
                            length: tailLength, // tail length - no tail = 0
                            width: tailWidth, // tail width - no tail = 0
                            direction: {
                                x: tailX,
                                y: tailY, 
                                stretchx:stretchX,
                                stretchy:stretchY
                            } // tail direction, will be update if input invalid (0-1)
                        }
                    }
                },
                chatBubbleAppearTime: 0.2, // appear time - second
                chatBubbleAliveTime: this.durShowBubble, // alive time - second
                chatBubbleDisappearTime: 0.2, // disappear time - second
                chatBubblePercent: {
                    x: (this.isOnTop) ? 0 : 0.5,
                    y: 0
                }, // position percent of ChatBubbleParentEntity (0-1) related to the ChatBubbleParentEntity position and size
                chatBubbleOffset: {
                    x: 0,
                    y: 0
                }, // extra offset from position percent of ChatBubbleParentEntity
                parentPos: {
                    // x: this.pos.x + (this.size.x/2) - (this.sizeCurrency.x/2),
                    // y: (this.noOption == 3) ? (this.pos.y - this.sizeCurrency.y/2 - 30) : (this.pos.y - this.sizeCurrency.y - 20)
                    x:this.posBubble.x,
                    y:this.posBubble.y
                },
                chatBubbleAlpha: 1, // chat bubble alpha
                boolNotif:true
            });
            this.repos();
        },

        showUI:function(bool, boolAnim) {
            if(boolAnim == null) boolAnim = true;

            if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle' && this.isShop == true && bool == true) {
                ig.game.currentWindow.isShowingButtonShop = true;
            } else {
                ig.game.currentWindow.isShowingButtonShop = false;
            }

            if(ig.game.windowName == 'game') {
                ig.game.currentWindow.reposMiniButton();
            }

            this.btnShop.repos();

            if(_DATAGAME.CurrencyOption) {
                var durAnim = 300;
                if(boolAnim == false) durAnim = 0;

                if(bool) {
                    new ig.TweenDef(this)
                    .to({
                        alphaNow:1
                    }, durAnim)
                    .easing(ig.Tween.Easing.Linear.EaseNone)
                    .onComplete(function() {
                        
                    }.bind(this)).start();

                    new ig.TweenDef(this.btnShop)
                    .to({
                        alphaNow:1
                    }, durAnim)
                    .easing(ig.Tween.Easing.Linear.EaseNone)
                    .onComplete(function() {
                        this.btnShop.isClickable = true;
                    }.bind(this)).start();
                } else {
                    if(!this.isShowBubble) {
                        this.btnShop.isClickable = false;

                        new ig.TweenDef(this)
                        .to({
                            alphaNow:0
                        }, durAnim)
                        .easing(ig.Tween.Easing.Linear.EaseNone)
                        .onComplete(function() {
                            
                        }.bind(this)).start();

                        new ig.TweenDef(this.btnShop)
                        .to({
                            alphaNow:0
                        }, durAnim)
                        .easing(ig.Tween.Easing.Linear.EaseNone)
                        .onComplete(function() {
                            
                        }.bind(this)).start();
                    }
                }
            }
        },

        repos:function() {
            // if(this.isShop) {
                // this.pos.x = ig.game.midX-this.halfSize.x+50*_DATAGAME.ratioRes;
            // } else {
                // this.pos.x = ig.game.midX-this.halfSize.x;
            // }
            
            // this.pos.y = ig.system.height - this.size.y- 20*_DATAGAME.ratioRes + this.plusY;

            // var c = ig.system.context;
            // c.font = this.fontSize + 'px ' + ig.game.fontName;
            // this.wCoin = c.measureText(ig.game.sessionData.virtualCurrency1).width;
            // this.xCoin = 20*_DATAGAME.ratioRes;
            // this.xCoinText = this.xCoin + this.icon1.width + 5*_DATAGAME.ratioRes;

            // this.wFollow = c.measureText(ig.game.sessionData.virtualCurrency3).width;
            // this.xFollowText = this.size.x - 20*_DATAGAME.ratioRes - this.wFollow;
            // this.xFollow = this.xFollowText - this.icon3.width - 5*_DATAGAME.ratioRes;

            // this.wHeart = c.measureText(ig.game.sessionData.virtualCurrency2).width;
            // this.xMiddle = this.xCoinText+this.wCoin + (((this.xFollow)-(this.xCoinText+this.wCoin))/2) + ((5*_DATAGAME.ratioRes+this.icon2.width)/2);
            // this.xHeartText = this.xMiddle-this.wHeart/2;
            // this.xHeart = this.xHeartText - 5*_DATAGAME.ratioRes - this.icon2.width;

            this.arrPosition = [ [ -1, -1, -1, -1 ], [ -1, -1, -1, -1 ], [ -1, -1, -1, -1 ] ];
            if (ig.system.width >= ig.sizeHandler.minW + 200*_DATAGAME.ratioRes + 50*_DATAGAME.ratioRes) {
                this.maxVCColumn = 4;
            } else {
                this.maxVCColumn = 3;
            }

            var row = 0;
            var column = 0;

            this.totalColumnNow = 1;
            var totalRowNow = 1;

            var totalPerRow = 0;
            for(var i=0;i<this.totalCurrency;i++) {
                var totalNow = this.totalCurrency - (i + 1);
                this.arrPosition[row][column] = i;
                this.arrColumn[_DATAGAME.virtualCurrencyUsed[i]] = column;
                this.arrRow[_DATAGAME.virtualCurrencyUsed[i]] = row;
                totalPerRow++;
                totalRowNow = row;

                if(column > this.totalColumnNow) this.totalColumnNow = column;
                
                if(totalPerRow == this.maxVCColumn - 1 && totalNow == 2) {
                    row++; column = 0;
                } else {
                    column++;
                    if(column > this.maxVCColumn - 1) {
                        row++; column = 0;
                    }
                }
            }

            this.size = {
                x:this.paddingPosition.x * (this.totalColumnNow+1) + this.startPosition.x,
                y:(this.paddingPosition.y + this.fontSize) * (totalRowNow+1) + this.startPosition.y
            }

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            // if(ig.game.windowName == 'game') {
            //     this.pos.x = 25; 
            //     this.pos.y = 25;
            // } else {
            if(ig.game.windowName == 'game' && _DATAGAME.dialogStyle.toLowerCase() == 'rectangle') { // && ig.game.currentWindow.optionType == 'normal'
                this.isOnTop = true;
                this.pos.x = 25;            
                this.pos.y = 25 + this.plusY;
            }
            else {
                this.isOnTop = false;
                this.pos.x = ig.game.midX-this.halfSize.x;            
                this.pos.y = ig.system.height - this.size.y - 20*_DATAGAME.ratioRes + this.plusY;
            }

            if(this.chatBubble != null) {
                this.calculatePosBubble();

                this.chatBubble.parentPos = {
                    x:this.posBubble.x,
                    y:this.posBubble.y
                };
            }
        },

        calculatePosBubble:function() {
            var plusXBubble = 0; //this.startPosition.x
            var offsetBubble = { x:0, y:this.paddingPosition.y };
            if(this.totalColumnNow+1 == 3) offsetBubble.x = 95*_DATAGAME.ratioRes;
            else if(this.totalColumnNow+1 == 2) offsetBubble.x = 100*_DATAGAME.ratioRes*2;

            if(this.isOnTop == true) {
                this.posBubble = {
                    x:ig.game.screen.x+ this.pos.x + ((this.startPosition.x+this.icon1.width/2)*this.scaleUI) + (this.paddingPosition.x*this.arrColumn[this.vcGain]*this.scaleUI),
                    y:ig.game.screen.y+ this.pos.y + this.plusY + ((offsetBubble.y+this.icon1.height/4)*this.scaleUI) + ((this.paddingPosition.y+this.fontSize)*this.arrRow[this.vcGain]*this.scaleUI)
                }
            } else {
                this.posBubble = {
                    x:-this.halfSize.x+offsetBubble.x+this.paddingPosition.x*this.arrColumn[this.vcGain],
                    y:ig.sizeHandler.minH + (ig.system.height-ig.sizeHandler.minH)/2 - this.size.y - 20*_DATAGAME.ratioRes + this.plusY + offsetBubble.y+(this.paddingPosition.y+this.fontSize)*this.arrRow[this.vcGain]
                }
            }
            

            // var plusXBubble = this.xCoinText;
            // if(this.vcGain == 2) { plusXBubble = this.xHeartText; }
            // else if(this.vcGain == 3) { plusXBubble = this.xFollowText; }

            // var offsetBubble = 0;
            // if(!this.isShop) offsetBubble = -50*_DATAGAME.ratioRes;

            // this.posBubble = {
            //     x:-this.halfSize.x+100*_DATAGAME.ratioRes+plusXBubble+offsetBubble,
            //     y:-ig.game.screen.y + ig.sizeHandler.minH - this.size.y- 20*_DATAGAME.ratioRes + this.plusY + 30*_DATAGAME.ratioRes
            // }
        },

        update:function(){
            this.parent();
            
        },

        drawCurrency:function(c) {
            c.globalAlpha = this.alphaNow;

            c.font = this.fontSize + 'px ' + ig.game.fontName;
            c.textAlign = 'left';
            c.textBaseline = "middle";
            c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textcurrency;

            for(var row=0;row<=2;row++) {
                for(var column=0;column<=3;column++) {
                    if(this.arrPosition[row][column] != -1) {
                        var noCurrency = _DATAGAME.virtualCurrencyUsed[this.arrPosition[row][column]];
                        var _xIcon = this.startPosition.x + this.paddingPosition.x * column;
                        var _yIcon = this.startPosition.y + ((this.fontSize + this.paddingPosition.y) * row);
                        this.posIcon[noCurrency].x = _xIcon;
                        this.posIcon[noCurrency].y = _yIcon;
                        this['icon' + noCurrency].draw(_xIcon, _yIcon);

                        var _xTextVC = _xIcon + this['icon' + noCurrency].width + 10*_DATAGAME.ratioRes;
                        var _yTextVC = _yIcon + this['icon' + noCurrency].height/2;
                        c.fillText(this._parent['virtualCurrency' + noCurrency], _xTextVC, _yTextVC);
                    }
                }
            }
        },
        
        draw:function(){
            this.parent();

            this.fontSize = Math.round(ig.game.fontNameSize*0.63*_DATAGAME.ratioRes);

        	var c = ig.system.context;
    
            c.save();
            c.globalAlpha = this.alphaNow; // * _DATAGAME.uiColor[_DATAGAME.uiTheme].opacitycurrency
            c.translate(this.pos.x, this.pos.y);
            if(this.isOnTop == true && ig.system.width <= ig.sizeHandler.minW + 50*_DATAGAME.ratioRes) {
                this.scaleUI = 0.93;
                c.scale(this.scaleUI, this.scaleUI);
            } else {
                this.scaleUI = 1;
            }
            var strokeWidth = 4*_DATAGAME.ratioRes;
            c.lineWidth = strokeWidth;
            c.strokeStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].strokeuicurrency;
            c.strokeRect(-strokeWidth/2, -strokeWidth/2, this.size.x+strokeWidth, this.size.y+strokeWidth);

            c.globalAlpha = this.alphaNow * _DATAGAME.uiColor[_DATAGAME.uiTheme].opacitycurrency; //0.8 * 
            c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].bguicurrency;
            c.fillRect(0, 0, this.size.x, this.size.y);

            this.drawCurrency(c);

            // c.globalAlpha = this.alphaNow;
            // c.font = this.fontSize + 'px ' + ig.game.fontName;
            // c.textAlign = 'left';
            // c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textcurrency;
            // c.fillText(this._parent.virtualCurrency1, this.xCoinText, 52*_DATAGAME.ratioRes);
            // this.icon1.draw(this.xCoin, this.yIcon);

            // c.fillText(this._parent.virtualCurrency3, this.xFollowText, 52*_DATAGAME.ratioRes);
            // this.icon3.draw(this.xFollow, this.yIcon);

            // c.fillText(this._parent.virtualCurrency2, this.xHeartText, 52*_DATAGAME.ratioRes);
            // this.icon2.draw(this.xHeart, this.yIcon);
            
            c.restore();
        }
    });
});