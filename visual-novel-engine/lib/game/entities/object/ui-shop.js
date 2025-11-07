ig.module('game.entities.object.ui-shop')
.requires(
	'impact.entity',
    'game.entities.buttons.button-vc',
    'game.entities.buttons.button-close'
)
.defines(function() {
    EntityUIShop = ig.Entity.extend({
        size:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        halfSize:{x:750, y:80},
        zIndex:_DATAGAME.zIndexData.UIShop,
        offset:{x:0, y:0},
        sizeOption: {
            x: 485*_DATAGAME.ratioRes,
            y: 115*_DATAGAME.ratioRes
        },
        rounded:15*_DATAGAME.ratioRes,
        visible:true,
        bgChapter: new ig.Image(_RESOURCESINFO.image.bgShop, 604*_DATAGAME.ratioRes, 450*_DATAGAME.ratioRes),

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.btnClose = ig.game.spawnEntity(EntityButtonClose, 0, 0, { _parent:this, 
                repos: function () {
                    this.pos = {
                        x:this._parent.pos.x + this._parent.halfSize.x - this.size.x - 20*_DATAGAME.ratioRes,
                        y:this._parent.pos.y - this._parent.halfSize.y + 20*_DATAGAME.ratioRes
                    };
                }, 
                onClicked:function() {
                    if(ig.game.windowName == 'menu') {
                        ig.game.currentWindow.uiCurrency.showUI(false, false);
                    }
                }
            });

            this.btnVC1 = ig.game.spawnEntity(EntityButtonVC, 0, 0, { _parent:this, noButton:1 });
            this.btnVC2 = ig.game.spawnEntity(EntityButtonVC, 0, 0, { _parent:this, noButton:2 });

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        show:function() {
            this.visible= true;
            this._parent.enabledButton(false);
            this.enabledButton(true);
            this.repos();
        },

        hide:function() {
            this.visible = false;
            this._parent.enabledButton(true);
            this.enabledButton(false);
        },

        enabledButton:function(bol) {
            this.btnClose.isClickable = bol;
            this.btnVC1.isClickable = bol;
            this.btnVC2.isClickable = bol;
            if(bol) {
                this.btnClose.repos();
                this.btnVC1.repos();
                this.btnVC2.repos();
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
                this.bgChapter.draw(0, 0);

                c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.9*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].shoptitle;
                c.textAlign = 'center';
                c.fillText(_STRINGS.Shop.title, this.halfSize.x, 80*_DATAGAME.ratioRes);

                c.restore();
            }
        }
    });
});