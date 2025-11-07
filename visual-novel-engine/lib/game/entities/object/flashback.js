ig.module('game.entities.object.flashback')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityFlashback = ig.Entity.extend({
        // size:{x:604, y:614},
        zIndex:_DATAGAME.zIndexData.flashback,
        visible:true,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            ig.game.sortEntitiesDeferred();

            this.repos();
        },

        show:function() {
            this.visible = true;
        },

        hide:function() {
            this.visible = false;
        },

        repos:function() {
            
        },

        update:function(){
            this.parent();
            
        },

        drawFlashback:function(ctx) {
            if(ig.game.sessionData.flashbackColor[this._parent.numChapter] != null) {
                var systemW = ig.system.width;
                var systemH = ig.system.height;

                var rectW = 300;

                ctx.save();            
                if(systemW > systemH) {
                    rectW = systemW; 
                    ctx.scale(1, systemH/systemW);
                } else {
                    rectW = systemH; 
                    ctx.scale(systemW/systemH, 1);
                }


                // Create Gradient
                var grd = ctx.createRadialGradient(rectW/2, rectW/2, 0, rectW/2, rectW/2, rectW);
                grd.addColorStop(0.45, "rgba(255, 255, 255, 0)");
                grd.addColorStop(0.7, ig.game.sessionData.flashbackColor[this._parent.numChapter]);
                // Draw filled Rectangle
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, rectW, rectW);

                ctx.restore();

                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = ig.game.sessionData.flashbackColor[this._parent.numChapter];
                ctx.fillRect(0, 0, systemW, systemH);
                ctx.restore();
            }
        },
        
        draw:function(){
            this.parent();

            if(this.visible) {
                this.drawFlashback(ig.system.context);
            }
        }
    });
});