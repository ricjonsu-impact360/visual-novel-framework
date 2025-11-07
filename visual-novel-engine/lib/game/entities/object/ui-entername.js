ig.module('game.entities.object.ui-entername')
.requires(
	'impact.entity',
    'game.entities.buttons.button-ok'
)
.defines(function() {
    EntityUIEnterName = ig.Entity.extend({
        size:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        halfSize:{x:750, y:80},
        zIndex:_DATAGAME.zIndexData.UIEnterName,
        offset:{x:0, y:0},
        bgInput: new ig.Image(_RESOURCESINFO.image.bgInput, 604*_DATAGAME.ratioRes, 450*_DATAGAME.ratioRes),

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            // this.offset.y = (!ig.ua.mobile) ? 0 : -100;

            this.textView = ig.game.spawnEntity(EntityTextView, 0, 0, { _parent:this, size:{x:510*_DATAGAME.ratioRes, y:76*_DATAGAME.ratioRes}, fontStyle: (40*_DATAGAME.ratioRes) + 'px metromed' });

            this.btnOK = ig.game.spawnEntity(EntityButtonOk, 0, 0, { _parent:this });
            
            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        killed:function() {
            this.textView.kill();
            this._parent.keyboard.hide();
            this._parent.isInputKeyboard = false;
            this._parent.setupInputVirtualKeyboard(false);

            this._parent.afterAnimation();
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

        	var c = ig.system.context;
    
            c.save();
            c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);
            this.bgInput.draw(0, 0);

            c.font = (55*_DATAGAME.ratioRes) + "px metroblack";
            c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].enterTitle;
            c.textAlign = 'center';
            c.fillText(_STRINGS.Game.entername, this.halfSize.x, this.halfSize.y - 100*_DATAGAME.ratioRes);
            c.restore();
        }
    });
});