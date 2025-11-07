ig.module('game.entities.object.ui-log')
.requires(
	'impact.entity',
    'game.entities.buttons.button-prev',
    'game.entities.buttons.button-next',
    'game.entities.buttons.button-close'
)
.defines(function() {
    EntityUILog = ig.Entity.extend({
        size:{x:580*_DATAGAME.ratioRes, y:1060*_DATAGAME.ratioRes},
        halfSize:{x:580*_DATAGAME.ratioRes, y:1060*_DATAGAME.ratioRes},
        heightText:890*_DATAGAME.ratioRes,
        zIndex:_DATAGAME.zIndexData.UILog,
        offset:{x:0, y:0},
        rounded:15*_DATAGAME.ratioRes,
        visible:true,
        totalPage:1,
        pageNow:1,
        fontSize:20,

        tempPageRepos:[ 0, 0, 0, 0 ],

        multiplierFontHeight:1.1,
        paddingDialog:0.5,
        paddingTop:35,
        paddingLeft:35,

        stateSize:1,

        paddingEachLine:{ x:0, y:0 },
        totalLineAccepted:1,
        pageContent:[ [{ min:0, max:1 }], [{ min:0, max:1 }], [{ min:0, max:1 }], [{ min:0, max:1 }] ],

        init:function(x,y,settings){
            this.parent(x,y,settings);

            // this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / 3);

            this.fontSize = Math.round(ig.game.fontBubbleSize*_DATAGAME.ratioRes*ig.game.fontRatio);

            this.totalLineAccepted = Math.floor(this.heightText / (this.fontSize*this.multiplierFontHeight));

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

            this.btnClose = ig.game.spawnEntity(EntityButtonClose, 0, 0, { _parent:this, ignorePause:true,
                repos: function () {
                    this.pos = {
                        x:this._parent.pos.x - this._parent.halfSize.x + 20*_DATAGAME.ratioRes, 
                        y:this._parent.pos.y - this._parent.halfSize.y + 20*_DATAGAME.ratioRes
                    };
                },
                clicked:function() {
                    ig.game.resumeGameviaButton(this, 'uiLog');
                    ig.game.openMiniButton = ig.game.currentWindow.miniButtonOpenedBefore;
                    ig.game.currentWindow.reposMiniButton();
                },
                funcComplete:function() {
                    
                }
            });

            this.btnPrev = ig.game.spawnEntity(EntityButtonPrev, 0, 0, { _parent:this,
                zIndex:_DATAGAME.zIndexData.buttonUILog,
                repos: function () {
                    this.pos = {
                        x:this._parent.pos.x - this.halfSize.x - this._parent.halfSize.x*3/4,
                        y:this._parent.pos.y + this._parent.halfSize.y - this.halfSize.y
                    };
                },
                onClicked:function() {
                    // this._parent.prevPage = [0, 0, 0, 0, 0, 0, 0, 0];
                },
                funcComplete:function() {
                    this.pageNow--;
                    if(this.pageNow <= 1) {
                        this.pageNow = 1;
                    }
                    this.tempPageRepos = [ 0, 0, 0, 0 ];
                    this.tempPageRepos[this.stateSize] = this.pageNow;

                    if(this.pageContent[this.stateSize][this.pageNow]) {
                        this.lastScene = this.pageContent[this.stateSize][this.pageNow].max;
                    }
                    this.checkPrevNext(true);
                }.bind(this)
            });

            this.btnNext = ig.game.spawnEntity(EntityButtonNext, 0, 0, { _parent:this,
                zIndex:_DATAGAME.zIndexData.buttonUILog,
                repos: function () {
                    this.pos = {
                        x:this._parent.pos.x - this.halfSize.x + this._parent.halfSize.x*3/4,
                        y:this._parent.pos.y + this._parent.halfSize.y - this.halfSize.y
                    };
                },
                onClicked:function() {

                    // this._parent.prevPage = [0, 0, 0, 0, 0, 0, 0, 0];
                },
                funcComplete:function() {
                    this.pageNow++;
                    if(this.pageNow >= this.pageContent[this.stateSize].length - 1) {
                        this.pageNow = this.pageContent[this.stateSize].length - 1;
                    }
                    this.tempPageRepos = [ 0, 0, 0, 0 ];
                    this.tempPageRepos[this.stateSize] = this.pageNow;

                    if(this.pageContent[this.stateSize][this.pageNow]) {
                        this.lastScene = this.pageContent[this.stateSize][this.pageNow].max;
                    }
                    this.checkPrevNext(true);
                }.bind(this)
            });

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        show:function() {
            this.visible= true;
            this._parent.enabledButton(false);
            this.enabledButton(true);
            this.repos();
            ig.game.sortEntitiesDeferred();

            this.checkAllDialogLine();
            // this.tempPageRepos = [ 0, 0, 0, 0 ];
            // this.tempPageRepos[this.stateSize] = this.pageNow;
            // this.checkPrevNext();
        },

        hide:function() {
            this.visible = false;
            this._parent.enabledButton(true);
            this.enabledButton(false);
        },

        checkAllDialogLine:function() {
            this.dataLog = ig.game.sessionData.historyLog['chapter' + ig.game.currentWindow.numChapter];

            if(ig.game.totalLineDialog == null) {
                ig.game.totalLineDialog = {};
            }
            
            if(ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter] == null || 
                (ig.game.languageSelector.selected != ig.game.prevLang)
            ) {
                ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter] = {
                    stat1:[],
                    stat2:[],
                    stat3:[]
                };
                for(var i=0;i<_STRINGS["Chapter" + ig.game.currentWindow.numChapter].length;i++) {
                    var _storyBubble = _STRINGS["Chapter" + ig.game.currentWindow.numChapter][i];
                    var charName = _storyBubble.charTalk;
                    var nameTag = _storyBubble.nameTag;

                    // ig.game.consoleLog(charName + ' ' + nameTag);

                    if(charName == 'none') {
                        charName = _STRINGS.Log.none;

                        if(nameTag != null) {
                            if(nameTag.toLowerCase() == 'amy') {
                                charName = ig.game.sessionData.playerName;
                            } else if(_DATAGAME.neutral_girl.indexOf(nameTag) < 0 && _DATAGAME.neutral_boy.indexOf(nameTag) < 0) {
                                if(_STRINGS.dynamic_character[nameTag] != null){
                                    charName = _STRINGS.dynamic_character[nameTag][ig.game.sessionData.loveInterest];
                                } else {
                                    charName = nameTag;
                                }
                            } else {
                                charName = nameTag;
                            }
                        }
                    } else {
                        if(charName.toLowerCase() == 'amy') {
                            charName = ig.game.sessionData.playerName;
                        } else if(_DATAGAME.neutral_girl.indexOf(charName) < 0 && _DATAGAME.neutral_boy.indexOf(charName) < 0) {
                            charName = _STRINGS.dynamic_character[charName][ig.game.sessionData.loveInterest];
                        }
                    }

                    var _arrText1 = ig.game.removeFormatDialog(
                        charName + ' : ' + _STRINGS["Chapter" + ig.game.currentWindow.numChapter][i].text, 
                        580*_DATAGAME.ratioRes - (this.paddingLeft*2), 
                        this.fontSize, 
                        ig.game.fontBubbleThin, 
                        true
                    );
                    var _arrText2 = ig.game.removeFormatDialog(
                        charName + ' : ' + _STRINGS["Chapter" + ig.game.currentWindow.numChapter][i].text, 
                        580*2*_DATAGAME.ratioRes - (this.paddingLeft*2), 
                        this.fontSize, 
                        ig.game.fontBubbleThin, 
                        true
                    );
                    var _arrText3 = ig.game.removeFormatDialog(
                        charName + ' : ' + _STRINGS["Chapter" + ig.game.currentWindow.numChapter][i].text, 
                        580*3*_DATAGAME.ratioRes - (this.paddingLeft*2), 
                        this.fontSize, 
                        ig.game.fontBubbleThin, 
                        true
                    );
                    ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter].stat1.push({ text:_arrText1, total:_arrText1.length });
                    ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter].stat2.push({ text:_arrText2, total:_arrText2.length });
                    ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter].stat3.push({ text:_arrText3, total:_arrText3.length });
                }
            }

            // console.log(ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter]);

            this.setPage(1);
            this.setPage(2);
            this.setPage(3);
            // console.log(this.pageContent);
        },

        setPage:function(_sizeType) {
            var boolStartPage = true;
            var totalLineNow = 0;
            var currentPage = 1;
            var heightNow = 0;

            for(var j=0;j<this.dataLog.length;j++) {
                var lengthLine = 0;
                if(this.dataLog[j] >= 0) {
                    lengthLine = ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter]['stat' + _sizeType][this.dataLog[j]].total;
                } else {
                    lengthLine = ig.game.removeFormatDialog(
                        _STRINGS.Log.none + ' : ' + this.dataLog[j], 
                        580*_sizeType*_DATAGAME.ratioRes - (this.paddingLeft*2), 
                        this.fontSize, 
                        ig.game.fontBubbleThin, 
                        true
                    ).length;
                }

                var _heightDialog = (lengthLine * this.fontSize * this.multiplierFontHeight);

                if(j != 0) {
                    // if(totalLineNow + lengthLine > this.totalLineAccepted) {
                    if(heightNow + _heightDialog > this.heightText) {
                        heightNow = 0;
                        totalLineNow = 0;
                        boolStartPage = true;
                        currentPage++;
                    } else {
                        this.pageContent[_sizeType][currentPage].max = j;
                        totalLineNow += lengthLine; 
                        heightNow += (_heightDialog + this.fontSize*this.paddingDialog);
                    }
                }

                if(boolStartPage == true) {
                    if(this.pageContent[_sizeType][currentPage] == null) {
                        this.pageContent[_sizeType][currentPage] = {min: j, max:j};
                    } 

                    this.pageContent[_sizeType][currentPage].min = j;

                    totalLineNow += lengthLine;
                    heightNow += (_heightDialog + this.fontSize*this.paddingDialog);
                    boolStartPage = false;
                } 
            }
        },

        checkPrevNext:function(bol) {
            if(this.btnPrev) {
                if(this.pageNow == 1) {
                    if(this.btnPrev) {
                        this.btnPrev.visible = false;
                        this.btnPrev.isClickable = false;
                    }
                } else {
                    this.btnPrev.visible = bol;
                    this.btnPrev.isClickable = bol;
                }
            }

            if(this.btnNext) {
                if(this.pageNow == this.pageContent[this.stateSize].length - 1) {
                    if(this.btnNext) {
                        this.btnNext.visible = false;
                        this.btnNext.isClickable = false;
                    }
                } else {
                    this.btnNext.visible = bol;
                    this.btnNext.isClickable = bol;
                }
            }
        },

        enabledButton:function(bol) {
            this.checkPrevNext(bol);
            
            if(this.btnClose) this.btnClose.visible = bol;

            this.btnClose.isClickable = bol;

            if(bol) {
                if(this.btnPrev) this.btnPrev.repos();
                if(this.btnNext) this.btnNext.repos();
                if(this.btnClose) this.btnClose.repos();
            }
        },

        repos:function() {
            if(ig.system.width < ig.sizeHandler.minW*2) {
                this.size = {x:580*_DATAGAME.ratioRes, y:1060*_DATAGAME.ratioRes};
                this.stateSize = 1;
            } else if(ig.system.width < ig.sizeHandler.minW*3) {
                this.size = {x:580*2*_DATAGAME.ratioRes, y:1060*_DATAGAME.ratioRes};
                this.stateSize = 2;
            } else {
                this.size = {x:580*3*_DATAGAME.ratioRes, y:1060*_DATAGAME.ratioRes};
                this.stateSize = 3;
            }

            if(this.lastScene) {
                if(this.tempPageRepos[this.stateSize] == 0) {
                    for(var i=1;i<this.pageContent[this.stateSize].length;i++) {
                        if(this.lastScene >= this.pageContent[this.stateSize][i].min && this.lastScene <= this.pageContent[this.stateSize][i].max) {
                            this.tempPageRepos[this.stateSize] = i;
                            break;
                        }
                    }
                } 

                this.pageNow = this.tempPageRepos[this.stateSize];
                this.checkPrevNext(true);
            }

            this.heightText = this.size.y - 25 - this.paddingTop*2 - this.btnClose.size.y - this.btnPrev.halfSize.y;

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.pos = {
                x:ig.system.width/2,
                y:ig.system.height/2
            };
        },

        update:function(){
            this.parent();
            
        },

        drawTextLog:function(c) {
            c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textuilog;
            c.textAlign = 'left';
            c.textBaseline = 'top';
            c.font = ig.game.fontBubbleWeight + ' ' + Math.round(this.fontSize) + "px " + ig.game.fontBubbleThin;
            
            var prevY = 0;
            for(var i=this.pageContent[this.stateSize][this.pageNow].min;i<=this.pageContent[this.stateSize][this.pageNow].max;i++){
                var arrText = [];
                var lengthLine = 0;
                    
                if(this.dataLog[i] >= 0) {
                    arrText = ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter]['stat' + this.stateSize][this.dataLog[i]].text;
                    lengthLine = ig.game.totalLineDialog['chapter' + ig.game.currentWindow.numChapter]['stat' + this.stateSize][this.dataLog[i]].total;
                } else {
                    arrText = ig.game.removeFormatDialog(
                        _STRINGS.Log.none + ' : ' + this.dataLog[i], 
                        580*this.stateSize*_DATAGAME.ratioRes - (this.paddingLeft*2), 
                        this.fontSize, 
                        ig.game.fontBubbleThin, 
                        true
                    );
                    lengthLine = arrText.length;
                }

                ig.game.drawText(arrText, this.fontSize, c, this.paddingLeft, prevY + 25 + this.btnClose.size.y + this.paddingTop, this.multiplierFontHeight);

                prevY += (lengthLine * this.fontSize * this.multiplierFontHeight) + this.fontSize*this.paddingDialog;
            }
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

                c.strokeStyle =  _DATAGAME.uiColor[_DATAGAME.uiTheme].strokeuilog;
                c.lineWidth = 10*_DATAGAME.ratioRes;
                c.strokeRect(0, 0, this.size.x, this.size.y);

                c.fillStyle =  _DATAGAME.uiColor[_DATAGAME.uiTheme].bguilog;
                c.fillRect(0, 0, this.size.x, this.size.y);

                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textuilog;
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.font = ig.game.fontBubbleWeight + ' ' + Math.round(this.fontSize*1.5) + "px " + ig.game.fontBubble;
                c.fillText(_STRINGS.Log.title, this.halfSize.x, this.btnClose.halfSize.y + 25);

                this.drawTextLog(c);
                
                c.restore();
            }
        }
    });
});