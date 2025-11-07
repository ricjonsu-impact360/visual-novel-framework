ig.module('game.entities.object.demo-text')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityDemoText = ig.Entity.extend({
        // size:{x:604, y:614},
        zIndex:_DATAGAME.zIndexData.demoText,
        visible:true,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            ig.game.sortEntitiesDeferred();

        },

        update:function(){
            this.parent();
            
        },

        drawDemo:function(ctx) {
            ctx.save();
            ctx.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.54*_DATAGAME.ratioRes) + "px " + ig.game.fontName; //*ig.game.fontRatio
            if(ctx.measureText(_STRINGS.Demo.title).width > ig.system.width) {
                ctx.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.4*_DATAGAME.ratioRes) + "px " + ig.game.fontName; //*ig.game.fontRatio
            }
            ctx.textAlign = 'right';
            if(_DATAGAME.demoText.stroke != null && _DATAGAME.demoText.stroke != 'none' && _DATAGAME.demoText.stroke != '') {
                ctx.strokeStyle = _DATAGAME.demoText.stroke;
                ctx.lineWidth = _DATAGAME.demoText.lineWidth;
                ctx.strokeText(_STRINGS.Demo.title, ig.system.width - 10, ig.system.height - 10);
            }

            ctx.fillStyle = _DATAGAME.demoText.color;
            ctx.fillText(_STRINGS.Demo.title, ig.system.width - 10, ig.system.height - 10);
            ctx.restore();
        },

        draw:function(){
            this.parent();

            if(_DATAGAME.enableDemo) this.drawDemo(ig.system.context);
        }
    });
});