ig.module('game.entities.controller.preview-controller')
.requires(
	'impact.entity',
	'game.entities.object.girl',
	'game.entities.buttons.button-play'
)
.defines(function() {
    EntityPreviewController = ig.Entity.extend({
    	 type: ig.Entity.TYPE.BOTH,
        zIndex: 0,
        isLoad:0,
        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.lastposXBG = 0;
            this.posXBG = 0;
            this.posYBG = 0;
            this.zoomBG = 1;
            _DATAGAME.BGFileType["office"]="png";
            ig.game.bgPreview = ig.game.spawnEntity(EntityBackground, 0, 0, { _parent:this, placeName:"office" });
            

            ig.game.girlPreview=ig.game.spawnEntity(SpriterGirl, 0,0, { _parent:this, charName:"amy", noChar:1,zIndex:10 });                       
            ig.game.girlPreview.spriter.pos.y=ig.game.midY+500;
            ig.game.girlPreview.spriter.pos.x=ig.game.midX;  

            ig.game.boyPreview=ig.game.spawnEntity(SpriterBoy, 0,0, { _parent:this, charName:"jack", noChar:1,zIndex:10 });                       
            ig.game.boyPreview.spriter.pos.y=ig.game.midY+500;
            ig.game.boyPreview.spriter.pos.x=ig.game.midX;     

            ig.game.boyPreview.changePose("ANIM_IDLE");   	
        },        
        update:function(){
            this.parent();
            if(ig.game.midX>=0&&this.isLoad<10)
            {
                ig.game.bgPreview.repos();
                this.isLoad++;
            }
        },
   //      repos:function(){
			// ig.game.girlPreview.spriter.pos.y=ig.game.midY+500;
   //          ig.game.girlPreview.spriter.pos.x=ig.game.midX;        	

   //          ig.game.boyPreview.spriter.pos.y=ig.game.midY+500;
   //          ig.game.boyPreview.spriter.pos.x=ig.game.midX;   

   //      }
    });
});