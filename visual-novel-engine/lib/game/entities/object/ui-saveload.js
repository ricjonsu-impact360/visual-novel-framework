ig.module('game.entities.object.ui-saveload')
.requires(
	'impact.entity',
    'game.entities.object.ui-warning-save',
    'game.entities.buttons.button-save-preview',
    'game.entities.buttons.button-prev',
    'game.entities.buttons.button-next',
    'game.entities.buttons.button-close-big'
)
.defines(function() {
    EntityUISaveLoad = ig.Entity.extend({
        // size:{x:604*_DATAGAME.ratioRes, y:614*_DATAGAME.ratioRes},
        halfSize:{x:750, y:80},
        zIndex:_DATAGAME.zIndexData.UISaveLoad,
        offset:{x:0, y:40*_DATAGAME.ratioRes},
        paddingButton:{
            x:5*_DATAGAME.ratioRes, 
            y:5*_DATAGAME.ratioRes
        },
        sizeButton: {
            x: 477*_DATAGAME.ratioRes,
            y: 480*_DATAGAME.ratioRes
        },
        rounded:15*_DATAGAME.ratioRes,
        visible:true,
        totalItemPerPage:2,
        totalPage:1,
        totalSaveSlot:12,
        pageNow:1,
        lastIdxSlot:1,

        isWarning:false,

        isRepos:true,

        stateSaveLoad : 1,

        STAT_SAVE : 1,
        STAT_LOAD : 2,

        prevPage:[0, 0, 0, 0, 0, 0, 0, 0],

        posButton2:[ {x:0, y:0}, {x:0, y:0} ],
        posButton4:[ {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ],
        posButton6:[ {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ],

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.tweenCloseFalse = this.tween({
                paramClose:1
            }, 0.1, { 
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
                    ig.game.isClickClose = false;
                }.bind(this)
            });

            var yButtonTop = (-this.sizeButton.y/2)-this.paddingButton.y;
            var yButtonBottom = (this.sizeButton.y/2)+this.paddingButton.y;

            this.posButton2 = [ 
                {x:0, y:yButtonTop}, 
                {x:0, y:yButtonBottom} 
            ];
            this.posButton4 = [ 
                {x:(-this.sizeButton.x/2)-this.paddingButton.x, y:yButtonTop}, {x:(this.sizeButton.x/2)+this.paddingButton.x, y:yButtonTop}, 
                {x:(-this.sizeButton.x/2)-this.paddingButton.x, y:yButtonBottom}, {x:(this.sizeButton.x/2)+this.paddingButton.x, y:yButtonBottom} 
            ];
            this.posButton6 = [ 
                {x:-this.sizeButton.x-this.paddingButton.x*2, y:yButtonTop}, {x:0, y:yButtonTop}, {x:this.sizeButton.x+this.paddingButton.x*2, y:yButtonTop}, 
                {x:-this.sizeButton.x-this.paddingButton.x*2, y:yButtonBottom}, {x:0, y:yButtonBottom}, {x:this.sizeButton.x+this.paddingButton.x*2, y:yButtonBottom}
            ];

            // this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / _DATAGAME.chapters.totalChapter);
            this.totalSaveSlot = ig.game.sessionData.saveSlot.length;
            this.totalPage = Math.ceil(this.totalSaveSlot / this.totalItemPerPage);

            this.btnClose = ig.game.spawnEntity(EntityButtonCloseBig, 0, 0, { _parent:this, 
                clicked:function() {
                    if(ig.game.windowName == 'menu'){ 
                        ig.soundHandler.sfxPlayer.play('click');
                        this._parent.hide();
                    }
                    else { 
                        ig.game.resumeGameviaButton(this, 'uiSaveLoad');
                        ig.game.openMiniButton = ig.game.currentWindow.miniButtonOpenedBefore;
                        ig.game.currentWindow.reposMiniButton();
                    }
                },
            });

            // this.size.y = this.defaultSizeButton*_DATAGAME.chapters.totalChapter;

            // this.halfSize = {
            //     x:this.size.x/2,
            //     y:this.size.y/2
            // };

            for(var i=5;i>=0;i--) {
                this['btnSave' + i] = ig.game.spawnEntity(EntityButtonSavePreview, 0, 0, { _parent:this, noButton:i, noSlot:i+1, isClickable:false });
            }
            
            this.btnPrev = ig.game.spawnEntity(EntityButtonPrev, 0, 0, { _parent:this, zIndex:_DATAGAME.zIndexData.buttonUISaveLoad,
                repos: function () {
                    this.pos = {
                        x:ig.game.midX - (this._parent.sizeButton.x*((this._parent.totalItemPerPage/2)-1)/2) - 305*_DATAGAME.ratioRes - this.halfSize.x,
                        y:ig.game.midY - this.halfSize.y + this._parent.offset.y
                    };
                },
                onClicked:function() {
                    this._parent.prevPage = [0, 0, 0, 0, 0, 0, 0, 0];
                }
            });

            this.btnNext = ig.game.spawnEntity(EntityButtonNext, 0, 0, { _parent:this, zIndex:_DATAGAME.zIndexData.buttonUISaveLoad,
                repos: function () {
                    this.pos = {
                        x:ig.game.midX + (this._parent.sizeButton.x*((this._parent.totalItemPerPage/2)-1)/2) + 305*_DATAGAME.ratioRes - this.halfSize.x,
                        y:ig.game.midY - this.halfSize.y + this._parent.offset.y
                    };
                },
                onClicked:function() {
                    this._parent.prevPage = [0, 0, 0, 0, 0, 0, 0, 0];
                }
            });

            this.uiWarningSave = ig.game.spawnEntity(EntityUIWarningSave, 0, 0, { _parent:this });
            this.uiWarningSave.hide();
            this.uiWarningSave.repos();

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        show:function(_stat) {
            ig.game.boolChooseChapter = true;
            if(_stat != null) {
                this.stateSaveLoad = this['STAT_' + _stat.toUpperCase()];
            }
            
            this.loadPage();
            this.visible= true;
            this._parent.enabledButton(false);
            this.enabledButton(true);
            this.uiWarningSave.enabledButton(false);
            this.repos();
        },

        hide:function() {
            ig.game.boolChooseChapter = false;
            this.visible = false;
            if(ig.game.windowName == 'menu'){ this._parent.enabledButton(true, true); }
            else { this._parent.enabledButton(true); }
            this.uiWarningSave.enabledButton(false);
            this.uiWarningSave.hide();
            this.enabledButton(false);
        },

        enabledButton:function(bol) {
            this.btnClose.isClickable = bol;

            if(this.btnPrev != null) this.btnPrev.isClickable = bol;
            if(this.btnNext != null) this.btnNext.isClickable = bol;
            if(bol) {
                this.btnClose.repos();

                if(this.btnPrev != null) this.btnPrev.repos();
                if(this.btnNext != null) this.btnNext.repos();
            }

            for(var i=0;i<6;i++) {
                this['btnSave' + i].isClickable = bol;
                if(bol) this['btnSave' + i].repos();
            }
        },

        loadPage:function() {
            for(var i=0;i<6;i++) {
                this['btnSave' + i].visible = false;
                this['btnSave' + i].isClickable = false;
            }

            for(var i=0;i<this.totalItemPerPage;i++) {
                var idxArr = ((this.pageNow-1) * this.totalItemPerPage) + i;
                if(idxArr > ig.game.sessionData.saveSlot.length-1) {
                    this['btnSave' + i].visible = false;
                    this['btnSave' + i].isClickable = false;
                } else {
                    this['btnSave' + i].visible = true;
                    this['btnSave' + i].isClickable = true;
                    this['btnSave' + i].posButton = this['posButton' + this.totalItemPerPage][i];
                    this['btnSave' + i].repos();

                    
                    this['btnSave' + i].noSlot = ig.game.sessionData.saveSlot[idxArr].id; //ig.game.chapter_list[idxArr].chapterID
                    this['btnSave' + i].idxSlot = idxArr;
                    this.lastIdxSlot = idxArr;
                    this['btnSave' + i].reloadInfo();
                }
                // this['btnSave' + i].noChapter = ((this.pageNow-1) * _DATAGAME.chapters.totalChapter) + (i+1);
            }
        },

        repos:function() {
            this.pos = {
                x:ig.system.width/2,
                y:ig.system.height/2
            };

            if(this.prevPage[this.totalItemPerPage] == 0) this.prevPage[this.totalItemPerPage] = this.pageNow;

            var prevTotalPage = this.totalItemPerPage;

            if (ig.system.width < ig.sizeHandler.minW + this.sizeButton.x + this.paddingButton.x*2) this.totalItemPerPage = 2;
            else if(ig.system.width < ig.sizeHandler.minW + this.sizeButton.x*2 + this.paddingButton.x*4) this.totalItemPerPage = 4;
            else this.totalItemPerPage = 6;

            this.totalPage = Math.ceil(this.totalSaveSlot / this.totalItemPerPage);

            if(this.totalPage > 1) {
                this.btnPrev.visible = this.btnNext.visible = true;
                this.btnNext.repos(); this.btnPrev.repos();
            } else {
                this.btnPrev.visible = this.btnNext.visible = false;
            }

            if(this.prevPage[this.totalItemPerPage] == 0) {
                this.pageNow = Math.ceil((this.lastIdxSlot+1)/this.totalItemPerPage);
            } else {
                this.pageNow = this.prevPage[this.totalItemPerPage];
            }

            if(prevTotalPage != this.totalItemPerPage) this.loadPage();
        },

        draw:function(){
            this.parent();

            if(this.visible) {
            	var c = ig.system.context;
                
                if(!_DATAGAME.simplifiedUI) {
                    c.save();
                    c.fillStyle = 'black';
                    c.globalAlpha = 0.8;
                    c.fillRect(0, 0, ig.system.width, ig.system.height);
                    c.restore();
                } else {

                }

                c.save();
                // c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);

                c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*1.1*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].chapterNLTitle;
                c.textAlign = 'center';

                c.fillText((this.stateSaveLoad == this.STAT_LOAD) ? _STRINGS.Load.title : _STRINGS.Save.title, ig.game.midX, ig.game.midY-this.sizeButton.x-35*_DATAGAME.ratioRes + this.offset.y);

                c.restore();
            }
        }
    });
});