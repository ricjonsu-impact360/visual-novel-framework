ig.module('game.entities.object.ui-chapter')
.requires(
	'impact.entity',
    'game.entities.buttons.button-chapter',
    'game.entities.buttons.button-prev',
    'game.entities.buttons.button-next',
    'game.entities.buttons.button-close'
)
.defines(function() {
    EntityUIChapter = ig.Entity.extend({
        size:{x:604*_DATAGAME.ratioRes, y:614*_DATAGAME.ratioRes},
        halfSize:{x:750, y:80},
        zIndex:_DATAGAME.zIndexData.UIChapter,
        offset:{x:0, y:0},
        sizeOption: {
            x: 485*_DATAGAME.ratioRes,
            y: 115*_DATAGAME.ratioRes
        },
        rounded:15*_DATAGAME.ratioRes,
        visible:true,
        totalPage:1,
        pageNow:1,
        defaultSizeButton:142*_DATAGAME.ratioRes,
       

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / _DATAGAME.chapters.totalChapter);

            if(!_DATAGAME.simplifiedUI) {
                this.bgChapter1 = new ig.Image(_RESOURCESINFO.image.bgChapter1, 604*_DATAGAME.ratioRes, 614*_DATAGAME.ratioRes);
                this.bgChapter2 = new ig.Image(_RESOURCESINFO.image.bgChapter2, 604*_DATAGAME.ratioRes, 614*_DATAGAME.ratioRes);
                this.bgChapter3 = new ig.Image(_RESOURCESINFO.image.bgChapter3, 604*_DATAGAME.ratioRes, 614*_DATAGAME.ratioRes);
                this.btnClose = ig.game.spawnEntity(EntityButtonClose, 0, 0, { _parent:this });
            } 

            this.size.y = this.defaultSizeButton*_DATAGAME.chapters.totalChapter;

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            for(var i=0;i<_DATAGAME.chapters.totalChapter;i++) {
                this['btnChapter' + i] = ig.game.spawnEntity(EntityButtonChapter, 0, 0, { _parent:this, noButton:i, noChapter:i+1, isClickable:false });
            }
            
            if(this.totalPage > 1) {
                this.btnPrev = ig.game.spawnEntity(EntityButtonPrev, 0, 0, { _parent:this });
                this.btnNext = ig.game.spawnEntity(EntityButtonNext, 0, 0, { _parent:this });
            }

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        show:function() {
            ig.game.boolChooseChapter = true;
            this.visible= true;
            this._parent.enabledButton(false);
            this.enabledButton(true);
            this.repos();

            if(_DATAGAME.lockPreviousChapter) {
                this.pageNow = Math.ceil(ig.game.sessionData.unlockChapter / _DATAGAME.chapters.totalChapter);
                this.loadPage();
            }
        },

        hide:function() {
            ig.game.boolChooseChapter = false;
            this.visible = false;
            this._parent.enabledButton(true);
            this.enabledButton(false);
        },

        enabledButton:function(bol) {
            if(!_DATAGAME.simplifiedUI) this.btnClose.isClickable = bol;

            if(this.btnPrev != null) this.btnPrev.isClickable = bol;
            if(this.btnNext != null) this.btnNext.isClickable = bol;
            if(bol) {
                if(!_DATAGAME.simplifiedUI) this.btnClose.repos();

                if(this.btnPrev != null) this.btnPrev.repos();
                if(this.btnNext != null) this.btnNext.repos();
            }

            for(var i=0;i<_DATAGAME.chapters.totalChapter;i++) {
                this['btnChapter' + i].isClickable = bol;
                if(bol) this['btnChapter' + i].repos();
            }
        },

        loadPage:function() {
            for(var i=0;i<_DATAGAME.chapters.totalChapter;i++) {
                this['btnChapter' + i].noChapter = ((this.pageNow-1) * _DATAGAME.chapters.totalChapter) + (i+1);
            }
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
                
                if(!_DATAGAME.simplifiedUI) {
                    c.save();
                    c.fillStyle = 'black';
                    c.globalAlpha = 0.7;
                    c.fillRect(0, 0, ig.system.width, ig.system.height);
                    c.restore();
                    
                    c.save();
                    c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);

                    var offsetY = -99*_DATAGAME.ratioRes;
                    this.bgChapter1.draw(0, offsetY+50*_DATAGAME.ratioRes, 0, 87*_DATAGAME.ratioRes, this.bgChapter2.width, this.bgChapter2.height, this.bgChapter2.width, this.bgChapter2.height + ((_DATAGAME.chapters.totalChapter-3)*this.defaultSizeButton));

                    var offsetYBottom = offsetY + (((_DATAGAME.chapters.totalChapter-3)*this.defaultSizeButton) / 2) + (67*_DATAGAME.ratioRes * (_DATAGAME.chapters.totalChapter-3));
                    this.bgChapter2.draw(0, offsetYBottom);

                    this.bgChapter3.draw(0, offsetY);

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
                        c.textAlign = 'center';
                        c.fillText(this.pageNow + " / " + this.totalPage, this.halfSize.x, offsetYBottom + this.bgChapter2.height + 15*_DATAGAME.ratioRes); //ig.system.height-10*_DATAGAME.ratioRes
                    }
                    c.restore();
                } else {

                }

                c.save();
                c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);

                c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.81*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].chapterTitle;
                c.textAlign = 'center';

                c.fillText(_STRINGS.Chapter.choose, this.halfSize.x, 0);

                c.restore();
            }
        }
    });
});