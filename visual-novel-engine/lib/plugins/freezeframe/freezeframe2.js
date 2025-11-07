ig.module('plugins.freezeframe.freezeframe2')
    .requires(
        'impact.entity',
        'plugins.freezeframe.freezeframe'
    )
    .defines(function () {

        EntityFreezeFrame2 = EntityFreezeFrame.extend({

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                ig.game.consoleLog('freeze2');

                this.repos();
                
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
                }, this.timeAlive, {
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
                            posXChar:-30
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
                                }, this.timeAlive, { 
                                    easing: ig.Tween.Easing.Linear.EaseNone
                                });

                                this.tweenText.chain(this.tweenTextLoop);

                                if(this.secondSound != null) { 
                                    ig.soundHandler.sfxPlayer.play(this.secondSound);
                                }

                                this.tweenText.start();

                                this.tween({ 
                                    alphaBG:0,
                                    alphaBGText:0,
                                    alphaChar:0,
                                    alphaText:0,
                                }, 0.3, { 
                                    delay:this.timeAlive-0.5,
                                    easing: ig.Tween.Easing.Linear.EaseNone,
                                    onComplete:function() {
                                        this.alphaBG=0;
                                        this.alphaBGText=0;
                                        this.alphaChar=0;
                                        this.alphaText=0;
                                        
                                        this.boolShowChar = false;
                                        this.alphaChar = 0;
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
                        }, this.timeAlive, { 
                            easing: ig.Tween.Easing.Linear.EaseNone
                        });

                        this.tweenChar.chain(this.tweenCharLoop);

                        this.tweenChar.start();
                    }.bind(this)
                });

                this.tweenBGTextSlow = this.tween({ 
                    posYBGText:0
                }, this.timeAlive, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenBGText.chain(this.tweenBGTextSlow);
                this.tweenBGText.start();
            },

            drawObject:function() {
                var c = ig.system.context;

                c.save();
                c.translate(this.posXBG, this.posYBG);
                c.globalAlpha = this.alphaBG;
                this.updatePosition();
                this.bg.draw(this.startX, this.startY, this.bgX, this.bgY, this.bgW, this.bgH, this.totalWidth, this.totalHeight);
                c.restore();

                c.save();
                c.translate(0, this.posYBGText);
                c.globalAlpha = this.alphaBGText;
                var textBgHeight = this.textBg.height*ig.system.width/this.textBg.width;
                this.textBg.draw(0, ig.game.midY-(textBgHeight*2/5), 0, 0, this.textBg.width, this.textBg.height, ig.system.width, textBgHeight);
                c.restore();

                // if(this.boolShowChar) {
                //     c.save();
                //     c.globalAlpha = this.alphaChar;
                //     c.translate(this.posXChar, 0);
                //     if(ig.sizeHandler.isPortrait) {
                //         this.character.draw(ig.game.midX-this.character.width-10, ig.game.midY-this.character.height/2);
                //     } else {
                //         this.character.draw(ig.game.midX-this.character.width-10, ig.game.midY-this.character.height/3);
                //     }
                //     c.restore();
                // }

                if(this.boolShowChar && this.sptChar != null) {
                    this.sptChar.spriter.root.alpha = this.alphaChar;
                    this.sptChar.spriter.pos.x = ig.game.midX-200*_DATAGAME.ratioRes+this.posXChar;
                    this.sptChar.spriter.pos.y = ig.game.midY+500*_DATAGAME.ratioRes;
                }

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
                            ig.game.midX+this.textOffset.x +this.shadowOffset.x*_DATAGAME.ratioRes*this.fontSizeRatio, 
                            ig.game.midY+this.textOffset.y + this.shadowOffset.y*_DATAGAME.ratioRes*this.fontSizeRatio - halfHeightText
                        );
                    }

                    c.fillStyle = this.textColor;
                    c.textAlign = 'left';
                    ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio,c, ig.game.midX+this.textOffset.x, ig.game.midY+this.textOffset.y - halfHeightText);
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

                this.fontSizeRatio = ig.sizeHandler.isPortrait ? 0.5 : 1;
                var widthText = ig.sizeHandler.isPortrait ? 350*_DATAGAME.ratioRes : ig.sizeHandler.minH/2-30*_DATAGAME.ratioRes;
                this.arrText = ig.game.wordWrap(this.text, widthText, Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio), ig.game.fontName, true);
            },

            update: function () {
                this.parent();
            }
        });
    });