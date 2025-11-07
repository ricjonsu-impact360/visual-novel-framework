ig.module('game.entities.object.ui-setting')
.requires(
	'impact.entity',
    'game.entities.buttons.button-yes',
    'game.entities.buttons.button-no-reset',
    'game.entities.buttons.button-menu',
    'game.entities.buttons.button-prev',
    'game.entities.buttons.button-next',
    'game.entities.buttons.button-reset'
)
.defines(function() {
    EntityUISetting = ig.Entity.extend({
        defSize:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        size:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        halfSize:{x:750*_DATAGAME.ratioRes, y:80*_DATAGAME.ratioRes},
        zIndex:_DATAGAME.zIndexData.UISetting,
        offset:{x:0, y:0},
        sizeOption: {
            x: 485*_DATAGAME.ratioRes,
            y: 115*_DATAGAME.ratioRes
        },
        rounded:15*_DATAGAME.ratioRes,
        visible:true,
        totalPage:1,
        pageNow:1,
        bgReset: new ig.Image(_RESOURCESINFO.image.bgInput, 604*_DATAGAME.ratioRes, 450*_DATAGAME.ratioRes),

        stateNow:1,
        STATE_SETTING : 1, 
        STATE_RESET : 2,

        paddingTextSound : { x:50*_DATAGAME.ratioRes, y:50*_DATAGAME.ratioRes },
        scaleButtonVolume : 0.7,
        volumeMusic : 8,
        volumeSound : 8,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.volumeMusic = ig.game.sessionData.music;
            this.volumeSound = ig.game.sessionData.sound;

            this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / 3);

            this.resizeBG();

            this.tweenCloseFalse = this.tween({
                paramClose:1
            }, 0.1, { 
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
                    ig.game.isClickClose = false;
                }.bind(this)
            });

            this.btnClose = ig.game.spawnEntity(EntityButtonClose, 0, 0, { _parent:this, ignorePause:true,
                repos: function () {
                    this.pos = {
                        x:this._parent.pos.x + this._parent.halfSize.x - this.size.x - 20*_DATAGAME.ratioRes,
                        y:this._parent.pos.y - this._parent.halfSize.y + 20*_DATAGAME.ratioRes
                    };
                },
                clicked:function() {
                    if(this.visible && this.isClickable) {
                        ig.soundHandler.sfxPlayer.play('click');
                        
                        this.sinkingEffect();

                        this._parent.tweenCloseFalse.stop();
                        ig.game.isClickClose = true;
                        this._parent.tweenCloseFalse.start();
                        
                        ig.game.isPauseSetting = false;
                        this._parent.hide();
                        if(ig.game.windowName == 'game') {
                            // if(ig.game.dataSFXLoop != null) {
                            //     ig.soundHandler.sfxPlayer.playSFX(ig.game.dataSFXLoop.name, true);
                            // }

                            // if(ig.game.dataSFXText != null) {
                            //     ig.soundHandler.sfxPlayer.playSFX(ig.game.dataSFXText.name, true);
                            // }

                            ig.game.resumeGame();
                            ig.game.currentWindow.canClickStage = true;
                            
                            ig.game.openMiniButton = ig.game.currentWindow.miniButtonOpenedBefore;
                            ig.game.currentWindow.reposMiniButton();
                        }

                    }
                },
                funcComplete:function() {
                    
                }
            });

            if(_DATAGAME.showButtonMenuSetting) {
                this.btnHome = ig.game.spawnEntity(EntityButtonMenu, 0, 0, {_parent: this});
            }

            if(_DATAGAME.loadBackgroundMusic) {
                this.btnPrevBGM = ig.game.spawnEntity(EntityButtonPrev, 0, 0, { _parent:this, scaleSize:this.scaleButtonVolume, zIndex:_DATAGAME.zIndexData.buttonUISetting,
                    repos: function () {
                        if(!_DATAGAME.loadBackgroundMusic){
                            this.pos = {
                                x:this._parent.pos.x-this.size.x, 
                                y:this._parent.pos.y-this.halfSize.y
                            };
                        } else {
                            this.pos = {
                                x:this._parent.pos.x-this.size.x, 
                                y:this._parent.pos.y-this._parent.paddingTextSound.y-this.halfSize.y
                            };
                        }
                    },
                    onClicked:function() {
                        if(this._parent.volumeMusic <= 0) {
                            this._parent.volumeMusic = 0;
                        } else {
                            this._parent.volumeMusic--;
                        }
                        ig.soundHandler.bgmPlayer.volume(this._parent.volumeMusic/ig.game.maxVolume);
                        ig.game.save("music", this._parent.volumeMusic);
                    },
                    funcComplete:function() {

                    }
                });

                this.btnNextBGM = ig.game.spawnEntity(EntityButtonNext, 0, 0, { _parent:this, scaleSize:this.scaleButtonVolume, zIndex:_DATAGAME.zIndexData.buttonUISetting,
                    repos: function () {
                        if(!_DATAGAME.loadBackgroundMusic){
                            this.pos = {
                                x:this._parent.pos.x+this._parent.halfSize.x-this.size.x-this._parent.paddingTextSound.x, 
                                y:this._parent.pos.y-this.halfSize.y
                            };
                        } else {
                            this.pos = {
                                x:this._parent.pos.x+this._parent.halfSize.x-this.size.x-this._parent.paddingTextSound.x, 
                                y:this._parent.pos.y-this._parent.paddingTextSound.y-this.halfSize.y
                            };
                        }
                    },
                    onClicked:function() {
                        if(this._parent.volumeMusic >= 12) {
                            this._parent.volumeMusic = 12;
                        } else {
                            this._parent.volumeMusic++;
                        }
                        ig.soundHandler.bgmPlayer.volume(this._parent.volumeMusic/ig.game.maxVolume);
                        ig.game.save("music", this._parent.volumeMusic);
                    },
                    funcComplete:function() {
                        
                    }
                });
            }

            this.btnPrevSFX = ig.game.spawnEntity(EntityButtonPrev, 0, 0, { _parent:this, scaleSize:this.scaleButtonVolume, zIndex:_DATAGAME.zIndexData.buttonUISetting,
                repos: function () {
                    if(!_DATAGAME.loadBackgroundMusic){
                        this.pos = {
                            x:this._parent.pos.x-this.size.x, 
                            y:this._parent.pos.y-this.halfSize.y
                        };
                    } else {
                        this.pos = {
                            x:this._parent.pos.x-this.size.x, 
                            y:this._parent.pos.y+this._parent.paddingTextSound.y-this.halfSize.y
                        };
                    }
                },
                onClicked:function() {
                    if(this._parent.volumeSound <= 0) {
                        this._parent.volumeSound = 0;
                    } else {
                        this._parent.volumeSound--;
                    }
                    ig.soundHandler.sfxPlayer.volume(this._parent.volumeSound/ig.game.maxVolume);
                    ig.game.save("sound", this._parent.volumeSound);
                },
                funcComplete:function() {

                }
            });

            this.btnNextSFX = ig.game.spawnEntity(EntityButtonNext, 0, 0, { _parent:this, scaleSize:this.scaleButtonVolume, zIndex:_DATAGAME.zIndexData.buttonUISetting,
                repos: function () {
                    if(!_DATAGAME.loadBackgroundMusic){
                        this.pos = {
                            x:this._parent.pos.x+this._parent.halfSize.x-this.size.x-this._parent.paddingTextSound.x, 
                            y:this._parent.pos.y-this.halfSize.y
                        };
                    } else {
                        this.pos = {
                            x:this._parent.pos.x+this._parent.halfSize.x-this.size.x-this._parent.paddingTextSound.x, 
                            y:this._parent.pos.y+this._parent.paddingTextSound.y-this.halfSize.y
                        };
                    }
                },
                onClicked:function() {
                    if(this._parent.volumeSound >= 12) {
                        this._parent.volumeSound = 12;
                    } else {
                        this._parent.volumeSound++;
                    }
                    ig.soundHandler.sfxPlayer.volume(this._parent.volumeSound/ig.game.maxVolume);
                    ig.game.save("sound", this._parent.volumeSound);
                },
                funcComplete:function() {
                    
                }
            });

            this.btnReset = ig.game.spawnEntity(EntityButtonReset, 0, 0, {_parent: this});

            this.btnYes = ig.game.spawnEntity(EntityButtonYes, 0, 0, {_parent: this, 
                repos:function() {
                    this.pos = {
                        x:this._parent.pos.x - this.halfSize.x,
                        y:this._parent.pos.y - this.halfSize.y + 20*_DATAGAME.ratioRes
                    };
                },
                clicked:function() {
                    if(this.visible && this.isClickable) {
                        ig.soundHandler.sfxPlayer.play('click');
                        
                        this.sinkingEffect();

                        this._parent.enabledButton(false);

                        ig.game.resetAllData();

                        for(var vc=1;vc<=_DATAGAME.totalVirtualCurrency;vc++) {
                            ig.game.currentWindow['virtualCurrency' + vc] = ig.game.sessionData['virtualCurrency' + vc];
                        }

                        // ig.game.currentWindow.virtualCurrency1 = ig.game.sessionData.virtualCurrency1;
                        // ig.game.currentWindow.virtualCurrency2 = ig.game.sessionData.virtualCurrency2;
                        // ig.game.currentWindow.virtualCurrency3 = ig.game.sessionData.virtualCurrency3;

                        ig.game.isPauseSetting = false;
                        if(ig.game.windowName == 'game') {
                            ig.game.openMiniButton = ig.game.currentWindow.miniButtonOpenedBefore;
                            ig.game.resumeGame();
                            if(_DATAGAME.chapters.multipleChapter) {
                                ig.game.fadeInWindow(LevelMenu);
                            } else {
                                ig.game.fadeInWindow(LevelGame);
                            }
                        } else {
                            this._parent.hide();
                        }
                    }
                },
                funcComplete:function() {
                    
                }
            });

            this.btnNo = ig.game.spawnEntity(EntityButtonNoReset, 0, 0, {_parent: this});

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        resizeBG:function() {
            if(this.stateNow == this.STATE_RESET) {
                this.size.x = this.defSize.x * 0.85;
                this.size.y = this.defSize.y * 0.85;
            } else {
                if(!_DATAGAME.chapters.multipleChapter && !_DATAGAME.loadBackgroundMusic) {
                    this.size.x = this.defSize.x * 0.85;
                    this.size.y = this.defSize.y * 0.85;
                } else {
                    this.size.x = this.defSize.x;
                    this.size.y = this.defSize.y;
                }
            }

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };
        },

        show:function() {
            this.changeState(this.STATE_SETTING);
            this.visible= true;
            this._parent.enabledButton(false);
            this.enabledButton(true);
            this.repos();
            ig.game.sortEntitiesDeferred();
        },

        hide:function() {
            this.visible = false;
            this._parent.enabledButton(true);
            this.enabledButton(false);
        },

        enabledButton:function(bol) {
            if(bol) {
                var _enabledSetting = false;
                var _enabledReset = false;
                
                if(this.stateNow == this.STATE_RESET) {
                    _enabledSetting = false;
                    _enabledReset = true;
                }
                else if(this.stateNow == this.STATE_SETTING) {
                    _enabledSetting = true;
                    _enabledReset = false;
                }

                if(this.btnHome) this.btnHome.visible = _enabledSetting;
                if(this.btnPrevSFX) this.btnPrevSFX.visible = _enabledSetting;
                if(this.btnNextSFX) this.btnNextSFX.visible = _enabledSetting;
                if(this.btnPrevBGM) this.btnPrevBGM.visible = _enabledSetting;
                if(this.btnNextBGM) this.btnNextBGM.visible = _enabledSetting;
                this.btnReset.visible = _enabledSetting;
                if(this.btnHome) this.btnHome.isClickable = _enabledSetting;
                if(this.btnPrevSFX) this.btnPrevSFX.isClickable = _enabledSetting;
                if(this.btnNextSFX) this.btnNextSFX.isClickable = _enabledSetting;
                if(this.btnPrevBGM) this.btnPrevBGM.isClickable = _enabledSetting;
                if(this.btnNextBGM) this.btnNextBGM.isClickable = _enabledSetting;
                this.btnReset.isClickable = _enabledSetting;

                this.btnYes.visible = _enabledReset;
                this.btnNo.visible = _enabledReset;
                this.btnYes.isClickable = _enabledReset;
                this.btnNo.isClickable = _enabledReset;

                this.btnClose.isClickable = bol;
            }
            else {
                this.btnClose.isClickable = bol;
                if(this.btnHome) this.btnHome.isClickable = bol;
                if(this.btnPrevSFX) this.btnPrevSFX.isClickable = bol;
                if(this.btnNextSFX) this.btnNextSFX.isClickable = bol;
                if(this.btnPrevBGM) this.btnPrevBGM.isClickable = bol;
                if(this.btnNextBGM) this.btnNextBGM.isClickable = bol;
                this.btnReset.isClickable = bol;
                this.btnYes.isClickable = bol;
                this.btnNo.isClickable = bol;
            }

            if(bol) {
                this.btnClose.repos();
                if(this.btnHome) this.btnHome.repos();
                if(this.btnPrevSFX) this.btnPrevSFX.repos();
                if(this.btnNextSFX) this.btnNextSFX.repos();
                if(this.btnPrevBGM) this.btnPrevBGM.repos();
                if(this.btnNextBGM) this.btnNextBGM.repos();
                this.btnReset.repos();
                this.btnYes.repos();
                this.btnNo.repos();
            }
        },

        changeState:function(stateUI) {
            this.stateNow = stateUI;

            this.resizeBG();

            this.enabledButton(true);
        },

        repos:function() {
            this.pos = {
                x:ig.system.width/2,
                y:ig.system.height/2
            };
        },

        update:function(){
            this.parent();
            
        },
        
        draw:function(){
            this.parent();

            if(this.visible) {
            	var c = ig.system.context;
                
                c.save();
                c.fillStyle = 'black';
                c.globalAlpha = 0.7;
                c.fillRect(0, 0, ig.system.width, ig.system.height);
                c.restore();
                
                c.save();
                c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);
                this.bgReset.draw(0, 0, 0, 0, this.bgReset.width, this.bgReset.height, this.size.x, this.size.y);

                if(this.stateNow == this.STATE_RESET) {
                    var fontSizeText = Math.round(ig.game.fontNameSize*0.54*_DATAGAME.ratioRes);
                    var yText = 45*_DATAGAME.ratioRes;
                    c.font = ig.game.fontNameWeight + ' ' + (fontSizeText*ig.game.fontRatio) + "px " + ig.game.fontName;
                    c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].settingTitle;
                    c.textAlign = 'center';
                    c.textBaseline = 'top';
                    c.fillText(_STRINGS.Settings.textreset1, this.halfSize.x, yText);
                    yText += (fontSizeText*ig.game.fontRatio) + 5*_DATAGAME.ratioRes;
                    c.fillText(_STRINGS.Settings.textreset2, this.halfSize.x, yText);
                    yText += (fontSizeText*ig.game.fontRatio) + 5*_DATAGAME.ratioRes;
                    c.fillText(_STRINGS.Settings.textreset3, this.halfSize.x, yText);
                } else {
                    c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*1.09*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                    c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].settingTitle;
                    c.textAlign = 'center';
                    c.fillText(_STRINGS.Settings.settings, this.halfSize.x, 100*_DATAGAME.ratioRes);

                    c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.7*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                    c.textAlign = 'left';
                    c.textBaseline = 'middle';

                    var _distButton = (this.btnNextSFX.pos.x-(this.btnPrevSFX.pos.x+this.btnPrevSFX.size.x)) / 2;
                    if(_DATAGAME.loadBackgroundMusic) {
                        c.fillText(_STRINGS.Settings.music, this.paddingTextSound.x, this.halfSize.y - this.paddingTextSound.y);
                        c.fillText(_STRINGS.Settings.sfx, this.paddingTextSound.x, this.halfSize.y + this.paddingTextSound.y);

                        c.textAlign = 'center';
                        c.fillText(this.volumeMusic, this.halfSize.x + _distButton, this.halfSize.y - this.paddingTextSound.y);
                        c.fillText(this.volumeSound, this.halfSize.x + _distButton, this.halfSize.y + this.paddingTextSound.y);
                    } else {
                        c.fillText(_STRINGS.Settings.sfx, this.paddingTextSound.x, this.halfSize.y);

                        c.textAlign = 'center';
                        c.fillText(this.volumeSound, this.halfSize.x + _distButton, this.halfSize.y);
                    }
                    
                }
                c.restore();
            }
        }
    });
});