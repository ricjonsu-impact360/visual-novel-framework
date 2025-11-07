ig.module('plugins.freezeframe.freezeframe3')
    .requires(
        'impact.entity',
        'plugins.freezeframe.freezeframe'
    )
    .defines(function () {

        EntityFreezeFrame3 = EntityFreezeFrame.extend({

            angleText:340,
            scaleText:5,
            alphaChar:1, 
            alphaTrans:0, 
            alphaTransBlack:0, 
            boolShowAll:false,
            boolIn:true,
            
            init: function (x, y, settings) {
                this.parent(x, y, settings);

                ig.game.consoleLog('freeze3');

                this.repos();
                
                ig.game.sortEntitiesDeferred();
            },

            startAnimation:function() {
                if(this.firstSound != null) { 
                    ig.soundHandler.sfxPlayer.play(this.firstSound);
                }

                this.posXBG = -this.plusBorderX/2;
                this.posYBG = this.plusBorderY/2;

                this.bgWhite = ig.game.spawnEntity(EntityBlack ,0,0,{ color:'white', alphaTrans:0});

                this.tweenInWhite = this.tween({
                    alphaTrans:1
                }, 0.2, {
                    easing:ig.Tween.Easing.Linear.EaseNone,
                    onComplete: function(){
                        this.boolShowAll =true;
                        this.tweenOutWhite.start();
                        this.tweenBG.start();
                        this.tweenBGTextSlow.start();
                        this.animChar();
                    }.bind(this)
                });
                this.tweenInWhite.start();

                this.tweenOutWhite = this.tween({
                    alphaTrans:0
                }, 0.2, {
                    easing:ig.Tween.Easing.Linear.EaseNone,
                    onComplete: function(){
                        this.boolIn = false;
                        this.animText();
                    }.bind(this)
                });

                this.tweenBG = this.tween({
                    posYBG:-this.plusBorderY/2,
                    posXBG:0
                }, this.timeAlive, {
                    easing: ig.Tween.Easing.Linear.EaseNone 
                });

                this.posYBGText = 0;

                this.tweenBGTextSlow = this.tween({ 
                    posYBGText:-ig.sizeHandler.minH/(20*_DATAGAME.ratioRes)
                }, this.timeAlive, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });
            },

            animText:function() {
                this.posXText = (ig.system.width-ig.game.midX)/(20*_DATAGAME.ratioRes);

                this.boolShowText = true;
                this.repos();

                this.tweenText = this.tween({ 
                    scaleText:1,
                }, 0.3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenTextLoop = this.tween({ 
                    posXText:10,
                }, this.timeAlive*5/3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenText.chain(this.tweenTextLoop);

                if(this.secondSound != null) { 
                    ig.soundHandler.sfxPlayer.play(this.secondSound);
                }

                this.tweenText.start();
            },

            animChar:function() {
                // this.posXChar = -this.character.width;
                // this.posXChar = -this.character.width / 20;
                this.posXChar = -30*_DATAGAME.ratioRes;
                this.boolShowChar = true;
                this.playAnimSpriter();

                this.bgBlack = ig.game.spawnEntity(EntityBlack ,0,0,{ color:'black', alphaTrans:0});

                this.tween({ 
                    alphaTransBlack:1,
                }, 0.2, { 
                    delay:this.timeAlive-0.5,
                    easing: ig.Tween.Easing.Linear.EaseNone,
                    onComplete:function() {
                        this.boolShowAll=false;
                        this.alphaChar = 0;
                        this.sptChar.spriter.root.alpha = 0;
                        this.sptChar.spriter.zIndex = _DATAGAME.zIndexData.freezeFrame3Spriter;
                        ig.game.sortEntitiesDeferred();
                        this.tween({ 
                            alphaTransBlack:0,
                        }, 0.2, { 
                            easing: ig.Tween.Easing.Linear.EaseNone,
                            onComplete:function() {
                                this.alphaTransBlack = 0;
                                if(this.bgWhite != null) this.bgWhite.alphaTrans = this.alphaTrans;
                                if(this.bgBlack != null) this.bgBlack.alphaTrans = this.alphaTransBlack;

                                this.isVisible = false;
                                this.kill();
                                if(this.callback!=null) { this.callback(); }
                            }.bind(this)
                        }).start();
                    }.bind(this)
                }).start();

                this.tweenCharLoop = this.tween({ 
                    posXChar:0
                }, this.timeAlive*4/3, { 
                    easing: ig.Tween.Easing.Linear.EaseNone
                });

                this.tweenCharLoop.start();
            },

            drawObject:function() {
                var c = ig.system.context;

                this.updatePosition();
                if(this.boolShowAll) {
                    c.save();
                    c.translate(this.posXBG, this.posYBG);
                    this.bg.draw(this.startX, this.startY, this.bgX, this.bgY, this.bgW, this.bgH, this.totalWidth, this.totalHeight);
                    c.restore();

                    c.save();
                    c.translate(this.posXBGText, this.posYBGText);
                    var textBgHeight = this.textBg.height*ig.system.width/this.textBg.width;
                    if(textBgHeight <= 600*_DATAGAME.ratioRes) { textBgHeight = 600*_DATAGAME.ratioRes; }
                    
                    this.textBg.draw(0, ig.game.midY-(textBgHeight*2/5), 0, 0, this.textBg.width, this.textBg.height, ig.system.width, textBgHeight);
                    c.restore();

                    if(this.boolShowChar && this.sptChar != null) {
                        this.sptChar.spriter.root.alpha = this.alphaChar;
                        this.sptChar.spriter.pos.x = ig.game.midX-200*_DATAGAME.ratioRes+this.posXChar + this.offsetCharX;
                        this.sptChar.spriter.pos.y = ig.game.midY+500*_DATAGAME.ratioRes;
                    }

                    if(this.boolShowText) {
                        c.save();
                        c.globalAlpha = this.alphaText;
                        c.translate(ig.game.midX+this.textOffset.x+ig.FreezeFrame.textDimension.width/2+this.posXText, ig.game.midY+this.textOffset.y+ig.FreezeFrame.textDimension.height / 2 - ig.FreezeFrame.textDimension.height / 4); 
                        c.scale(this.scaleText, this.scaleText);
                        c.rotate(this.angleText*Math.PI / 180);
                        c.font = ig.game.fontNameWeight + ' ' + Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio) + "px " + ig.game.fontName;

                        // console.log(ig.FreezeFrame.textDimension.width);
                        var halfHeightText = 0;
                        if(this.textShadowColor != null) {
                            c.fillStyle = this.textShadowColor;
                            c.textAlign = 'left';
                            ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio, c, 
                                -ig.FreezeFrame.textDimension.width/2 + this.shadowOffset.x*this.fontSizeRatio, 
                                -ig.FreezeFrame.textDimension.height/2 + this.shadowOffset.y*this.fontSizeRatio - halfHeightText
                            );
                        }

                        c.fillStyle = this.textColor;
                        c.textAlign = 'left';
                        ig.game.drawText(this.arrText, this.font*_DATAGAME.ratioRes*this.fontSizeRatio,c, 
                            -ig.FreezeFrame.textDimension.width/2, 
                            -ig.FreezeFrame.textDimension.height/2 - halfHeightText
                        );
                        c.restore();
                    }
                }

                if(this.bgWhite != null) this.bgWhite.alphaTrans = this.alphaTrans;
                if(this.bgBlack != null) this.bgBlack.alphaTrans = this.alphaTransBlack;
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

                var c = ig.system.context;
                ig.FreezeFrame.measure({text:this.arrText, fontSize:Math.round(this.font*_DATAGAME.ratioRes*this.fontSizeRatio*ig.game.fontRatio), fontFamily: ig.game.fontName}, c);

                this.offsetCharX = ig.sizeHandler.isPortrait ? 0 : -20*_DATAGAME.ratioRes;
            },

            update: function () {
                this.parent();
            }
        });

        EntityBlack = ig.Entity.extend({
            zIndex: _DATAGAME.zIndexData.freezeFrame3Black,
            alphaTrans:0,
            color:'white',
            isVisible:true,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                ig.game.sortEntitiesDeferred();
            },

            draw: function () {
                if(!this.isVisible) return;

                var c = ig.system.context;

                c.save();
                c.globalAlpha = this.alphaTrans;
                c.fillStyle = this.color;
                c.fillRect(0, 0, ig.system.width, ig.system.height);
                c.restore();

                this.parent();
            },

            repos:function() {

            },

            update: function () {
                this.parent();
            }
        });
    });