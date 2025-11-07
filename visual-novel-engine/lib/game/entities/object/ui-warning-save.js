ig.module('game.entities.object.ui-warning-save')
.requires(
	'impact.entity',
    'game.entities.buttons.button-yes',
    'game.entities.buttons.button-no-reset'
)
.defines(function() {
    EntityUIWarningSave = ig.Entity.extend({
        size:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        halfSize:{x:750*_DATAGAME.ratioRes, y:80*_DATAGAME.ratioRes},
        zIndex:_DATAGAME.zIndexData.UIWarningSave,
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

        STAT_SAVE:1,
        STAT_REPLACE:2,
        STAT_LOAD:3,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / 3);

            this.size.x *= 0.85;
            this.size.y *= 0.85;

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.tweenCloseFalse = this.tween({
                paramClose:1
            }, 0.1, { 
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
                    ig.game.isClickClose = false;
                }.bind(this)
            });

            this.btnYes = ig.game.spawnEntity(EntityButtonYes, 0, 0, {_parent: this, zIndex:_DATAGAME.zIndexData.buttonUIWarningSave,
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

                        this._parent.hide();

                        if(this._parent.stateNow == this._parent.STAT_LOAD) {
                            ig.game.loadDataSlot(ig.game.slotSelected.idx);

                            if(ig.game.windowName == 'game') {
                                ig.game.isPauseSetting = false;
                                ig.game.resumeGame();

                                ig.game.openMiniButton = ig.game.currentWindow.miniButtonOpenedBefore;
                            }
                        
                            this._parent.enabledButton(false);

                            this._parent.noChapter = ig.game.numChapter;

                            this._parent.addDUtoCustomLoad();

                            ig.game.fadeInWindow(LevelGame);
                        } else {
                            ig.game.saveDatatoSlot(ig.game.slotSelected.idx);
                            this._parent._parent['btnSave' + ig.game.slotSelected.numButton].reloadInfo();
                        }
                    }
                },
                funcComplete:function() {
                    
                }
            });

            this.btnNo = ig.game.spawnEntity(EntityButtonNoReset, 0, 0, {_parent: this, 
                onClicked:function() {
                    this._parent.hide();
                }
            });

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        addDUtoCustomLoad:function() {
            //ADD DU TO CUSTOM LOAD
            var arrChar = _CUSTOMLOAD.Chapter[this.noChapter].duTheme;
            if(arrChar == null)  arrChar = [];

            if(_DATAGAME.firstMCOutfit['chapter' + this.noChapter] != null && _DATAGAME.firstMCOutfit['chapter' + this.noChapter] != "") {
                var outfit = _DATAGAME.firstMCOutfit['chapter' + this.noChapter];
                var idxOutfit = arrChar.findIndex(function(item) {
                    return (item.toLowerCase() == outfit.toLowerCase());
                });

                if(_DATAGAME.firstMCOutfit['chapter' + this.noChapter] != "" && _DATAGAME.firstMCOutfit['chapter' + this.noChapter].toLowerCase() != "default" && idxOutfit < 0) {
                    _CUSTOMLOAD.Chapter[this.noChapter].duTheme.push(_DATAGAME.firstMCOutfit['chapter' + this.noChapter]);
                }
            }

            var lastDU = (ig.game.sessionData.dressUpTheme[this.noChapter - 1] == null) ? 'amy' : ig.game.sessionData.dressUpTheme[this.noChapter - 1].last;
            var idxLastDU = arrChar.findIndex(function(item) {
                return (item.toLowerCase() == lastDU.toLowerCase());
            });

            if(this.noChapter >= 2 && ig.game.sessionData.dressUpTheme[this.noChapter - 1] != null && ig.game.sessionData.dressUpTheme[this.noChapter - 1].last != null && idxLastDU < 0) {
                _CUSTOMLOAD.Chapter[this.noChapter].duTheme.push(ig.game.sessionData.dressUpTheme[this.noChapter - 1].last);
            }
            //END OF ADD DU TO CUSTOM LOAD
        },

        show:function(_state) {
            this.stateNow = this['STAT_' + _state.toUpperCase()];
            this.visible= true;
            this._parent.isWarning = true;
            this._parent.btnPrev.isClickable = false;
            this._parent.btnNext.isClickable = false;
            this.enabledButton(true);
            this.repos();
            ig.game.sortEntitiesDeferred();
        },

        hide:function() {
            this.visible = false;
            this._parent.btnPrev.isClickable = true;
            this._parent.btnNext.isClickable = true;
            this._parent.isWarning = false;
            this.enabledButton(false);
        },

        enabledButton:function(bol) {
            this.btnYes.visible = bol;
            this.btnNo.visible = bol;

            this.btnYes.isClickable = bol;
            this.btnNo.isClickable = bol;
        },

        repos:function() {
            this.pos = {
                x:ig.system.width/2,
                y:ig.system.height/2
            };

            if(this.btnYes) this.btnYes.repos();
            if(this.btnNo) this.btnNo.repos();
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

                
                var fontSizeText = Math.round(ig.game.fontNameSize*0.54*_DATAGAME.ratioRes);
                var yText = 45*_DATAGAME.ratioRes;
                c.font = ig.game.fontNameWeight + ' ' + (fontSizeText*ig.game.fontRatio) + "px " + ig.game.fontName;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].settingTitle;
                c.textAlign = 'center';
                c.textBaseline = 'top';

                var text1 = '';
                var text2 = '';
                var text3 = '';

                if(this.stateNow == this.STAT_SAVE) {
                    text1 = _STRINGS.Save.textSave1; text1 = text1.replaceAll('<>', ig.game.slotSelected.no);
                    text2 = _STRINGS.Save.textSave2; text2 = text2.replaceAll('<>', ig.game.slotSelected.no);
                    text3 = _STRINGS.Save.textSave3; text3 = text3.replaceAll('<>', ig.game.slotSelected.no);
                } else if(this.stateNow == this.STAT_REPLACE) {
                    text1 = _STRINGS.Save.textReplace1; text1 = text1.replaceAll('<>', ig.game.slotSelected.no);
                    text2 = _STRINGS.Save.textReplace2; text2 = text2.replaceAll('<>', ig.game.slotSelected.no);
                    text3 = _STRINGS.Save.textReplace3; text3 = text3.replaceAll('<>', ig.game.slotSelected.no);
                } else if(this.stateNow == this.STAT_LOAD) {
                    text1 = _STRINGS.Load.textLoad1; text1 = text1.replaceAll('<>', ig.game.slotSelected.no);
                    text2 = _STRINGS.Load.textLoad2; text2 = text2.replaceAll('<>', ig.game.slotSelected.no);
                    text3 = _STRINGS.Load.textLoad3; text3 = text3.replaceAll('<>', ig.game.slotSelected.no);
                }

                c.fillText(text1, this.halfSize.x, yText);
                yText += (fontSizeText*ig.game.fontRatio) + 5*_DATAGAME.ratioRes;
                c.fillText(text2, this.halfSize.x, yText);
                yText += (fontSizeText*ig.game.fontRatio) + 5*_DATAGAME.ratioRes;
                c.fillText(text3, this.halfSize.x, yText);

                c.restore();
            }
        }
    });
});