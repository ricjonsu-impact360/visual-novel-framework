ig.module('plugins.freezeframe.freezeframe1')
    .requires(
        'impact.entity',
        'plugins.freezeframe.freezeframe'
    )
    .defines(function () {

        EntityFreezeFrame1 = EntityFreezeFrame.extend({
            //necessary type1
            bgColor:'#FFFFFF',
            bgTextColor:'#9D183B',
            stripe1Color:'#F63C30',
            stripe2Color:'#FE9C08',
            stripe3Color:'#58C8BF',
            stripe4Color:'#6FA4D1',
            arrText:[],
            fontSizeRatio:0,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.fontSizeRatio = 1;

                ig.game.consoleLog('freeze1');

                this.repos();

                this.bgColor = ig.FreezeFrame.animation.type1.bgColor;
                this.bgTextColor = ig.FreezeFrame.animation.type1.bgTextColor;
                this.stripe1Color = ig.FreezeFrame.animation.type1.stripe1Color;
                this.stripe2Color = ig.FreezeFrame.animation.type1.stripe2Color;
                this.stripe3Color = ig.FreezeFrame.animation.type1.stripe3Color;
                this.stripe4Color = ig.FreezeFrame.animation.type1.stripe4Color;
                
                ig.game.sortEntitiesDeferred();
            },

            startAnimation:function() {
                if(this.firstSound != null) { 
                    ig.soundHandler.sfxPlayer.play(this.firstSound);
                }

                this.posXBG = -this.plusBorderX/2;
                this.posYBG = this.plusBorderY/2;

                this.tweenBG = this.tween({
                    posYBG:-this.plusBorderY/2
                }, 3, {
                    easing: ig.Tween.Easing.Linear.EaseNone 
                });

                this.tweenAlpha = this.tween({ 
                    alphaBG: 1,
                    posXBG:0
                }, 0.4, { 
                    // delay:1,
                    easing: ig.Tween.Easing.Linear.EaseNone ,
                    onComplete: function () {
                        
                    }.bind(this)
                });

                this.tweenAlpha.chain(this.tweenBG);
                this.tweenAlpha.start();

                this.posYBGText = -ig.sizeHandler.minH/4;
                this.tweenBGText = this.tween({ 
                    alphaBGText: 1,
                    posYBGText:-ig.sizeHandler.minH/4/4
                }, 0.3, { 
                    delay:0.2,
                    easing: ig.Tween.Easing.Linear.EaseNone,
                    onComplete: function () {
                        this.posXChar = -600*_DATAGAME.ratioRes;
                        this.boolShowChar = true;
                        this.playAnimSpriter();

                        this.tweenChar = this.tween({ 
                            alphaChar:1,
                            posXChar:-30*_DATAGAME.ratioRes
                        }, 0.1, { 
                            easing: ig.Tween.Easing.Linear.EaseNone,
                            onComplete: function () {
                                this.posXText = ig.system.width-ig.game.midX;
                                this.boolShowText = true;

                                var distanceText = (ig.system.width-ig.game.midX)/(20*_DATAGAME.ratioRes);
                                this.tweenText = this.tween({ 
                                    posXText:distanceText,
                                }, 0.1, { 
                                    easing: ig.Tween.Easing.Linear.EaseNone
                                });

                                this.tweenTextLoop = this.tween({ 
                                    posXText:0,
                                }, 3, { 
                                    easing: ig.Tween.Easing.Linear.EaseNone
                                });

                                this.tweenText.chain(this.tweenTextLoop);

                                if(this.secondSound != null) { 
                                    ig.soundHandler.sfxPlayer.play(this.secondSound);
                                }

                                this.tweenText.start();

                                this.tryDelay =0;
                                this.tween({
                                    tryDelay:1
                                }, 2.5, {
                                    easing: ig.Tween.Easing.Linear.EaseNone,
                                    onComplete:function() {
                                        if(ig.game.windowName == 'game'){
                                            
                                        }
                                    }
                                }).start();

                                this.tween({ 
                                    alphaBG:0,
                                    alphaBGText:0,
                                    alphaChar:0,
                                    alphaText:0,
                                }, 0.1, { 
                                    delay:2.7,
                                    easing: ig.Tween.Easing.Linear.EaseNone,
                                    onComplete:function() {
                                        this.alphaBG=0;
                                        this.alphaBGText=0;
                                        this.alphaChar=0;
                                        this.alphaText=0;
                                        
                                        this.boolShowChar = false;
                                        this.sptChar.spriter.root.alpha = 0;
                                        this.isVisible = false;
                                        this.kill();
                                        if(this.callback!=null) { this.callback(); }
                                    }.bind(this)
                                }).start();
                            }.bind(this)
                        });

                        this.tweenCharLoop = this.tween({ 
                            posXChar:0
                        }, 3, { 
                            easing: ig.Tween.Easing.Linear.EaseNone
                        });

                        this.tweenChar.chain(this.tweenCharLoop);

                        this.tweenChar.start();
                    }.bind(this)
                });

                this.tweenBGTextSlow = this.tween({ 
                    posYBGText:0
                }, 3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenBGText.chain(this.tweenBGTextSlow);
                this.tweenBGText.start();
            },

            drawObject:function() {
                var c = ig.system.context;

                c.save();
                c.fillStyle = this.bgColor;
                c.globalAlpha = this.alphaBG;
                c.fillRect(0, 0, ig.system.width, ig.system.height);
                c.restore();

                c.save();
                c.translate(this.posXBG, this.posYBG);
                c.globalAlpha = this.alphaBG;
                c.fillStyle = this.stripe1Color;
                c.beginPath();
                c.moveTo(this.startX, this.startY+this.totalHeight*3/8);
                c.lineTo(this.startX, this.startY+this.totalHeight*4/8);
                c.lineTo(this.startX + this.totalWidth*1.3/8, this.startY);
                c.lineTo(this.startX + this.totalWidth*1/8, this.startY);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe2Color;
                c.beginPath();
                c.moveTo(this.startX, this.startY+this.totalHeight*5/8);
                c.lineTo(this.startX, this.startY+this.totalHeight*6.5/8);
                c.lineTo(this.startX + this.totalWidth*2.9/8, this.startY);
                c.lineTo(this.startX + this.totalWidth*1.8/8, this.startY);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe3Color;
                c.beginPath();
                c.moveTo(this.startX, this.startY+this.totalHeight*7.5/8);
                c.lineTo(this.startX, this.endY);
                c.lineTo(this.startX + this.totalWidth*3.9/8, this.startY);
                c.lineTo(this.startX + this.totalWidth*3.5/8, this.startY);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe4Color;
                c.beginPath();
                c.moveTo(this.startX + this.totalWidth*0.4/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*0.6/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*5.3/8, this.startY);
                c.lineTo(this.startX + this.totalWidth*4.7/8, this.startY);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe2Color;
                c.beginPath();
                c.moveTo(this.startX + this.totalWidth*1.1/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*1.3/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*6.7/8, this.startY);
                c.lineTo(this.startX + this.totalWidth*6.2/8, this.startY);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe3Color;
                c.beginPath();
                c.moveTo(this.startX + this.totalWidth*1.9/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*2.3/8, this.endY);
                c.lineTo(this.endX, this.startY + this.totalHeight*1.1/8);
                c.lineTo(this.endX, this.startY);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe4Color;
                c.beginPath();
                c.moveTo(this.startX + this.totalWidth*3/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*3.3/8, this.endY);
                c.lineTo(this.endX, this.startY + this.totalHeight*3/8);
                c.lineTo(this.endX, this.startY + this.totalHeight*2.5/8);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe1Color;
                c.beginPath();
                c.moveTo(this.startX + this.totalWidth*4/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*5/8, this.endY);
                c.lineTo(this.endX, this.startY + this.totalHeight*5.3/8);
                c.lineTo(this.endX, this.startY + this.totalHeight*4.2/8);
                c.closePath();
                c.fill();

                c.fillStyle = this.stripe2Color;
                c.beginPath();
                c.moveTo(this.startX + this.totalWidth*6.2/8, this.endY);
                c.lineTo(this.startX + this.totalWidth*6.8/8, this.endY);
                c.lineTo(this.endX, this.startY + this.totalHeight*7.3/8);
                c.lineTo(this.endX, this.startY + this.totalHeight*6.5/8);
                c.closePath();
                c.fill();
                c.restore();

                c.save();
                c.translate(0, this.posYBGText - ig.game.screen.y);
                c.globalAlpha = this.alphaBGText;
                c.fillStyle = this.bgTextColor;
                c.beginPath();
                c.moveTo(0, this.bgTextHeight*4.5/8);
                c.lineTo(0, this.bgTextHeight*8/8);
                c.lineTo(ig.system.width, this.bgTextHeight*5/8);
                c.lineTo(ig.system.width, this.bgTextHeight*1/8);
                c.closePath();
                c.fill();
                c.restore();

               
                if(this.boolShowText) {
                    c.save();
                    c.globalAlpha = this.alphaText;
                    c.translate(this.posXText, 0);
                    c.font = ig.game.fontNameWeight + ' ' + Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio) + "px " + ig.game.fontName;


                    var halfHeightText = (this.arrText.length-2) * this.font*_DATAGAME.ratioRes*this.fontSizeRatio * 1.2 / 2;
                    if(this.textShadowColor != null) {
                        c.fillStyle = this.textShadowColor;
                        c.textAlign = 'left';
                        ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio, c, 
                            ig.game.midX+this.textOffset.x +this.shadowOffset.x*this.fontSizeRatio, 
                            ig.game.midY+this.textOffset.y + this.shadowOffset.y*this.fontSizeRatio - halfHeightText
                        );
                    }

                    c.fillStyle = this.textColor;
                    c.textAlign = 'left';
                    ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio,c, ig.game.midX+this.textOffset.x, ig.game.midY+this.textOffset.y - halfHeightText);
                    c.restore();
                }
            },

            repos:function() {
                if (ig.system.width > ig.system.height) {
                    this.plusBorderX = ig.system.width*0.2;
                    this.plusBorderY = ig.system.width*0.2;
                    this.totalWidth = ig.system.width+this.plusBorderX;
                    this.totalHeight = ig.system.width+this.plusBorderY;                    
                } else {
                    this.plusBorderX = ig.system.height*0.2;
                    this.plusBorderY = ig.system.height*0.2;
                    this.totalWidth = ig.system.height+this.plusBorderX;
                    this.totalHeight = ig.system.height+this.plusBorderY;
                }

                this.startX = -(this.totalWidth-ig.system.width)/2;
                this.endX = ig.system.width+((this.totalWidth-ig.system.width)/2);
                this.startY = -(this.totalHeight-ig.system.height)/2;
                this.endY = ig.system.height+((this.totalHeight-ig.system.height)/2);
                this.bgTextHeight = ig.sizeHandler.minH;

                this.fontSizeRatio = ig.sizeHandler.isPortrait ? 0.5 : 1;
                var widthText = ig.sizeHandler.isPortrait ? 350*_DATAGAME.ratioRes : ig.sizeHandler.minH/2-30*_DATAGAME.ratioRes;
                this.arrText = ig.game.wordWrap(this.text, widthText, Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio), ig.game.fontName, true);
            },

            update: function () {
                this.parent();

                if(this.boolShowChar && this.sptChar != null) {
                    this.sptChar.spriter.root.alpha = this.alphaChar;
                    this.sptChar.spriter.pos.x = ig.game.midX-200*_DATAGAME.ratioRes+this.posXChar;
                    this.sptChar.spriter.pos.y = ig.game.midY+500*_DATAGAME.ratioRes;
                }

                //  if(this.boolShowChar) {
                //     c.save();
                //     c.globalAlpha = this.alphaChar;
                //     // c.translate(this.posXChar, 0);
                //     // c.drawImage(this.character, ig.game.midX-this.character.width*3/4, ig.game.midY-this.character.height*2/5);
                //     c.restore();
                // }
            }
        });
    });