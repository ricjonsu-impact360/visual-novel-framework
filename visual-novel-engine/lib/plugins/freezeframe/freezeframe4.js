ig.module('plugins.freezeframe.freezeframe4')
    .requires(
        'impact.entity',
        'plugins.freezeframe.freezeframe'
    )
    .defines(function () {
        EntityFreezeFrame4 = EntityFreezeFrame.extend({

            scaleBG:0.3,
            scaleBGText:5,
            scaleText:0,
            scaleChar:0,
            alphaChar:0, 
            alphaText:0, 

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                ig.game.consoleLog('freeze4');

                this.repos();
                
                ig.game.sortEntitiesDeferred();
            },

            startAnimation:function() {
                if(this.firstSound != null) { 
                    ig.soundHandler.sfxPlayer.play(this.firstSound);
                }

                // this.posXBG = -this.plusBorderX/2;
                // this.posYBG = this.plusBorderY/2;

                this.tweenBG = this.tween({
                    scaleBG:1.1
                }, this.timeAlive, {
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenAlpha = this.tween({ 
                    scaleBG: 1,
                    alphaBG: 1
                }, 0.3, { 
                    // delay:1,
                    easing: ig.Tween.Easing.Linear.EaseNone ,
                    onComplete: function () {
                        this.animBGText();
                    }.bind(this)
                });

                this.tweenAlpha.chain(this.tweenBG);
                this.tweenAlpha.start();

            },

            animBGText:function() {
                this.tweenBGText = this.tween({
                    alphaBGText:1,
                    scaleBGText:1.05, 
                }, 0.2, {
                    easing: ig.Tween.Easing.Linear.EaseNone, 
                    onComplete:function() {
                        this.animChar();
                        this.animText();
                    }.bind(this)
                });

                this.tweenBGTextSlow = this.tween({ 
                    scaleBGText:1
                }, this.timeAlive, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenBGText.chain(this.tweenBGTextSlow);
                this.tweenBGText.start();
            },

            animChar:function() {
                this.boolShowChar = true;

                this.tweenChar = this.tween({ 
                    scaleChar:0.95,
                    alphaChar:1
                }, 0.3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone,
                    onComplete:function() {
                        this.playAnimSpriter();
                    }.bind(this)
                });

                this.tweenCharLoop = this.tween({ 
                    scaleChar:1,
                }, this.timeAlive, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenChar.chain(this.tweenCharLoop);
                this.tweenChar.start();

                this.tween({ 
                    alphaBG:0,
                    alphaBGText:0,
                    alphaText:0,
                    alphaChar:0, 
                    scaleBG:2, 
                    scaleBGText:2, 
                    scaleText:2, 
                    scaleChar:2,
                }, 0.2, { 
                    delay:this.timeAlive - 0.5,
                    easing: ig.Tween.Easing.Linear.EaseNone,
                    onComplete:function() {
                        this.alphaBG=0;
                        this.alphaBGText=0;
                        this.alphaText=0;
                        this.alphaChar=0;
                        this.scaleBG=2;
                        this.scaleBGText=2;
                        this.scaleText=2; 
                        this.scaleChar=2;

                        this.boolShowAll=false;
                        this.boolShowChar = false;
                        this.alphaChar = 0;
                        this.sptChar.spriter.root.alpha = 0;
                        this.tween({ 
                            alphaTransBlack:0,
                        }, 0.2, { 
                            easing: ig.Tween.Easing.Linear.EaseNone,
                            onComplete:function() {
                                this.isVisible = false;
                                this.kill();
                                if(this.callback!=null) { this.callback(); }
                            }.bind(this)
                        }).start();
                    }.bind(this)
                }).start();

                this.tweenCharLoop = this.tween({ 
                    posXChar:0
                }, this.timeAlive * 4/3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

            },

            animText:function() {
                // this.posXText = (ig.system.width-ig.game.midX)/20;

                this.boolShowText = true;

                this.tweenText = this.tween({ 
                    scaleText:0.95,
                    alphaText:1
                }, 0.3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenTextLoop = this.tween({ 
                    scaleText:1.05,
                }, this.timeAlive, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenText.chain(this.tweenTextLoop);

                if(this.secondSound != null) { 
                    ig.soundHandler.sfxPlayer.play(this.secondSound);
                }

                this.tweenText.start();
            },

            drawObject:function() {
                var c = ig.system.context;

                c.save();
                this.updatePosition();
                c.translate(this.posXBG, this.posYBG);
                c.scale(this.scaleBG, this.scaleBG);
                c.globalAlpha = this.alphaBG;
                this.bg.draw(-this.totalWidth/2, -this.totalHeight/2, this.bgX, this.bgY, this.bgW, this.bgH, this.totalWidth, this.totalHeight);
                c.restore();

                c.save();
                var textBgHeight = this.textBg.height*ig.system.width/this.textBg.width;
                c.translate(ig.game.midX, ig.game.midY);
                c.scale(this.scaleBGText, this.scaleBGText);
                c.globalAlpha = this.alphaBGText;
                // this.textBg.draw(0, ig.game.midY-(textBgHeight*2/5), 0, 0, this.textBg.width, this.textBg.height, ig.system.width, textBgHeight);
                this.textBg.draw(-ig.system.width/2, -textBgHeight/2, 0, 0, this.textBg.width, this.textBg.height, ig.system.width, textBgHeight);
                c.restore();

                // if(this.boolShowChar) {
                //     c.save();
                //     if(ig.sizeHandler.isPortrait) {
                //         c.translate(ig.game.midX-this.character.width/2-10, ig.game.midY);
                //     } else {
                //         c.translate(ig.game.midX-this.character.width/2-10, ig.game.midY+this.character.height/6);
                //     }
                //     c.scale(this.scaleChar, this.scaleChar);
                //     c.globalAlpha = this.alphaChar;
                //     this.character.draw(-this.character.width/2, -this.character.height/2);
                //     c.restore();
                // }

                if(this.boolShowChar && this.sptChar != null) {
                    this.sptChar.spriter.root.alpha = this.alphaChar;
                    this.sptChar.spriter.pos.x = ig.game.midX-200*_DATAGAME.ratioRes+this.posXChar + this.offsetCharX;;
                    this.sptChar.spriter.pos.y = ig.game.midY+500*_DATAGAME.ratioRes;

                    this.sptChar.spriter.scale.x = -1.1 * this.scaleChar;
                    this.sptChar.spriter.scale.y = 1.1 * this.scaleChar;
                }

                if(this.boolShowText) {
                    c.save();
                    c.globalAlpha = this.alphaText;
                    c.translate(ig.game.midX+this.textOffset.x+ig.FreezeFrame.textDimension.width/2+this.posXText, ig.game.midY+this.textOffset.y+ig.FreezeFrame.textDimension.height/5);
                    c.scale(this.scaleText, this.scaleText);
                    c.globalAlpha = this.alphaText;
                    
                    c.font = this.font*_DATAGAME.ratioRes*this.fontSizeRatio;
                    if(this.textShadowColor != null) {
                        c.fillStyle = this.textShadowColor;
                        c.textAlign = 'left';
                        ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio, c, 
                            -ig.FreezeFrame.textDimension.width/2 + this.shadowOffset.x, 
                            -ig.FreezeFrame.textDimension.height/2 + this.shadowOffset.y
                        );
                    }

                    c.fillStyle = this.textColor;
                    c.textAlign = 'left';
                    ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio, c, 
                        -ig.FreezeFrame.textDimension.width/2, 
                        -ig.FreezeFrame.textDimension.height/2
                    );
                    c.restore();
                }
            },

            updatePosition:function() {
                var r1 = this.bg.width / this.bg.height, //ratio image
                    r2 = this.totalWidth / this.totalHeight; //ratio window
                    // r2 = ig.system.width / ig.system.height; //ratio window
                if (r1 > r2) {
                    this.bgH = this.bg.height;
                    this.bgW = this.bgH * r2;
                    this.bgX = (this.bg.width - this.bgW) / 2;
                    this.bgY = 0;
                } else {
                    this.bgW = this.bg.width;
                    this.bgH = this.bgW / r2;
                    this.bgX = 0;
                    this.bgY = (this.bg.height - this.bgH) / 2;
                }
            },

            repos:function() {
                this.plusBorderX = ig.system.width*0.2;
                this.plusBorderY = ig.system.height*0.2;
                this.totalWidth = ig.system.width+this.plusBorderX;
                this.totalHeight = ig.system.height+this.plusBorderY;
                this.startX = -this.plusBorderX/2;
                this.endX = ig.system.width+this.plusBorderX/2;
                this.startY = -this.plusBorderY/2;
                this.endY = ig.system.height+this.plusBorderY/2;

                this.posXBG = this.totalWidth/2-this.plusBorderX/2;
                this.posYBG = this.totalHeight/2-this.plusBorderY/2;

                this.fontSizeRatio = ig.sizeHandler.isPortrait ? 0.5 : 1;
                var widthText = ig.sizeHandler.isPortrait ? 350*_DATAGAME.ratioRes : ig.sizeHandler.minH/2-30*_DATAGAME.ratioRes;
                this.arrText = ig.game.wordWrap(this.text, widthText, Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio), ig.game.fontName, true);

                var c = ig.system.context;
                ig.FreezeFrame.measure({text:this.arrText, fontSize:Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio), fontFamily: ig.game.fontName}, c);

                this.offsetCharX = ig.sizeHandler.isPortrait ? 0 : -20*_DATAGAME.ratioRes;
            },

            update: function () {
                this.parent();
            }
        });
    });