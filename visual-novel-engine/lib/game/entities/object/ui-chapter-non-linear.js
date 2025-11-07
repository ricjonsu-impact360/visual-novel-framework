ig.module('game.entities.object.ui-chapter-non-linear')
.requires(
	'impact.entity',
    'game.entities.buttons.button-chapter-non-linear',
    'game.entities.buttons.button-prev',
    'game.entities.buttons.button-next',
    'game.entities.buttons.button-close-big'
)
.defines(function() {
    EntityUIChapterNonLinear = ig.Entity.extend({
        // size:{x:604*_DATAGAME.ratioRes, y:614*_DATAGAME.ratioRes},
        halfSize:{x:750, y:80},
        zIndex:_DATAGAME.zIndexData.UIChapterNonLinear,
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
        totalChapter:2,
        totalPage:1,
        pageNow:1,
        lastIdxChapter:1,

        isRepos:true,

        prevPage:[0, 0, 0, 0, 0, 0, 0, 0],

        posButton2:[ {x:0, y:0}, {x:0, y:0} ],
        posButton4:[ {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ],
        posButton6:[ {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ],

        init:function(x,y,settings){
            this.parent(x,y,settings);

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

            this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / _DATAGAME.chapters.totalChapter);

            this.btnClose = ig.game.spawnEntity(EntityButtonCloseBig, 0, 0, { _parent:this });

            // this.size.y = this.defaultSizeButton*_DATAGAME.chapters.totalChapter;

            // this.halfSize = {
            //     x:this.size.x/2,
            //     y:this.size.y/2
            // };

            for(var i=5;i>=0;i--) {
                this['btnChapter' + i] = ig.game.spawnEntity(EntityButtonChapterNonLinear, 0, 0, { _parent:this, noButton:i, noChapter:i+1, isClickable:false });
            }
            
            this.btnPrev = ig.game.spawnEntity(EntityButtonPrev, 0, 0, { _parent:this,
                repos: function () {
                    this.pos = {
                        x:ig.game.midX - (this._parent.sizeButton.x*((this._parent.totalChapter/2)-1)/2) - 305*_DATAGAME.ratioRes - this.halfSize.x,
                        y:ig.game.midY - this.halfSize.y + this._parent.offset.y
                    };
                },
                onClicked:function() {
                    this._parent.prevPage = [0, 0, 0, 0, 0, 0, 0, 0];
                }
            });

            this.btnNext = ig.game.spawnEntity(EntityButtonNext, 0, 0, { _parent:this,
                repos: function () {
                    this.pos = {
                        x:ig.game.midX + (this._parent.sizeButton.x*((this._parent.totalChapter/2)-1)/2) + 305*_DATAGAME.ratioRes - this.halfSize.x,
                        y:ig.game.midY - this.halfSize.y + this._parent.offset.y
                    };
                },
                onClicked:function() {
                    this._parent.prevPage = [0, 0, 0, 0, 0, 0, 0, 0];
                }
            });

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        show:function() {
            ig.game.boolChooseChapter = true;
            this.loadPage();
            this.visible= true;
            this._parent.enabledButton(false, true);
            this.enabledButton(true);
            this.repos();
        },

        hide:function() {
            ig.game.boolChooseChapter = false;
            this.visible = false;
            this._parent.enabledButton(true, true);
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
                this['btnChapter' + i].isClickable = bol;
                if(bol) this['btnChapter' + i].repos();
            }
        },

        loadPage:function() {
            for(var i=0;i<6;i++) {
                this['btnChapter' + i].visible = false;
                this['btnChapter' + i].isClickable = false;
            }

            for(var i=0;i<this.totalChapter;i++) {
                var idxArr = ((this.pageNow-1) * this.totalChapter) + i;
                if(idxArr > ig.game.chapter_list.length-1) {
                    this['btnChapter' + i].visible = false;
                    this['btnChapter' + i].isClickable = false;
                } else {
                    this['btnChapter' + i].visible = true;
                    this['btnChapter' + i].isClickable = true;
                    this['btnChapter' + i].posButton = this['posButton' + this.totalChapter][i];
                    this['btnChapter' + i].repos();

                    
                    this['btnChapter' + i].noChapter = ig.game.chapter_list[idxArr].chapterID;
                    this['btnChapter' + i].idxChapter = idxArr;
                    this.lastIdxChapter = idxArr;
                    this['btnChapter' + i].reloadInfo();
                }
                // this['btnChapter' + i].noChapter = ((this.pageNow-1) * _DATAGAME.chapters.totalChapter) + (i+1);
            }
        },

        repos:function() {
            if(this.visible) {
                this.pos = {
                    x:ig.system.width/2,
                    y:ig.system.height/2
                };

                if(this.prevPage[this.totalChapter] == 0) this.prevPage[this.totalChapter] = this.pageNow;

                var prevTotalPage = this.totalChapter;

                if (ig.system.width < ig.sizeHandler.minW + this.sizeButton.x + this.paddingButton.x*2) this.totalChapter = 2;
                else if(ig.system.width < ig.sizeHandler.minW + this.sizeButton.x*2 + this.paddingButton.x*4) this.totalChapter = 4;
                else this.totalChapter = 6;

                this.totalPage = Math.ceil(ig.game.chapter_list.length / this.totalChapter);

                if(this.totalPage > 1) {
                    this.btnPrev.visible = this.btnNext.visible = true;
                    this.btnNext.repos(); this.btnPrev.repos();
                } else {
                    this.btnPrev.visible = this.btnNext.visible = false;
                }

                if(this.prevPage[this.totalChapter] == 0) {
                    this.pageNow = Math.ceil((this.lastIdxChapter+1)/this.totalChapter);
                } else {
                    this.pageNow = this.prevPage[this.totalChapter];
                }

                if(prevTotalPage != this.totalChapter) this.loadPage();
            }
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

                c.fillText(_STRINGS.Chapter.select, ig.game.midX, ig.game.midY-this.sizeButton.x-35*_DATAGAME.ratioRes + this.offset.y);

                if(_DATAGAME.chapterPage.visible == true) {
                    if(_DATAGAME.chapterPage.fontSize <= 0 || _DATAGAME.chapterPage.fontSize == null) {
                        c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.7*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                    } else {
                        c.font = ig.game.fontNameWeight + ' ' + Math.round(_DATAGAME.chapterPage.fontSize*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                    }

                    if(_DATAGAME.chapterPage.color == null || _DATAGAME.chapterPage.color == '' ||  _DATAGAME.chapterPage.color == 'none') {
                        c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].chapterNLTitle;
                    } else {
                        c.fillStyle = _DATAGAME.chapterPage.color;
                    }

                    c.textBaseline = 'top';
                    c.fillText(this.pageNow + " / " + this.totalPage, ig.game.midX, ig.game.midY + this.sizeButton.y/2 + this.posButton2[1].y + this.offset.y + 15*_DATAGAME.ratioRes); //ig.system.height-10*_DATAGAME.ratioRes
                }

                c.restore();
            }
        }
    });
});