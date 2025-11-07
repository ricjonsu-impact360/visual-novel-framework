ig.module('game.entities.object.ui-exit')
.requires(
	'impact.entity',
    'game.entities.buttons.button-yes',
    'game.entities.buttons.button-no-reset'
)
.defines(function() {
    EntityUIExit = ig.Entity.extend({
        size:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        halfSize:{x:750, y:80},
        zIndex:_DATAGAME.zIndexData.UIExit,
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

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.totalPage = Math.ceil((_STRINGS.Chapter.title.length-1) / 3);

            this.size.x *= 0.85;
            this.size.y *= 0.85;

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

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

                        this._parent.hide();

                        if(ig.gameExit) ig.gameExit();
                    }
                },
                funcComplete:function() {
                    
                }
            });

            this.btnNo = ig.game.spawnEntity(EntityButtonNoReset, 0, 0, {_parent: this, 
                clicked:function() {
                    if(this.visible && this.isClickable) {
                        ig.soundHandler.sfxPlayer.play('click');
                        
                        this.sinkingEffect();

                        this._parent.enabledButton(false);

                        this._parent.hide();
                    }
                },
                funcComplete:function() {
                    
                }
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
        },

        hide:function() {
            this.visible = false;
            this._parent.enabledButton(true);
            this.enabledButton(false);
        },

        enabledButton:function(bol) {
            if(bol) {
                this.btnYes.isClickable = bol;
                this.btnNo.isClickable = bol;
            }
            else {
                this.btnYes.isClickable = bol;
                this.btnNo.isClickable = bol;
            }

            if(bol) {
                this.btnYes.repos();
                this.btnNo.repos();
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
                
                c.save();
                c.fillStyle = 'black';
                c.globalAlpha = 0.7;
                c.fillRect(0, 0, ig.system.width, ig.system.height);
                c.restore();
                
                c.save();
                c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);
                this.bgReset.draw(0, 0, 0, 0, this.bgReset.width, this.bgReset.height, this.size.x, this.size.y);

                var fontSizeText = Math.round(ig.game.fontNameSize*0.72*_DATAGAME.ratioRes);
                var yText = 55*_DATAGAME.ratioRes;
                c.font = ig.game.fontNameWeight + ' ' + (fontSizeText*ig.game.fontRatio) + "px " + ig.game.fontName;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].exitText;
                c.textAlign = 'center';
                c.textBaseline = 'top';
                c.fillText(_STRINGS.Exit.textexit1, this.halfSize.x, yText);
                yText += (fontSizeText*ig.game.fontRatio) + 8*_DATAGAME.ratioRes;
                c.fillText(_STRINGS.Exit.textexit2, this.halfSize.x, yText);
                
                c.restore();
            }
        }
    });
});