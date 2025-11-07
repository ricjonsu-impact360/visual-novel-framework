ig.module('game.entities.particle.overlay_particle')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityOverlayParticle = ig.Entity.extend({
		objectID : "",

		init:function( x, y, settings ){
			this.parent( x, y, settings );
		},

		setPosition:function() {
			// //SIZE
			// this.size = {
			// 	x:this.imgSrc.width, 
			// 	y:this.imgSrc.height
			// };

			// //Z-INDEX
			// if(this.dataParticle.zIndex < 0) {
			// 	this.zIndex = _DATAGAME.zIndexData.particleBack - this.dataParticle.zIndex;
			// } else if(this.dataParticle.zIndex >= 0) {
			// 	this.zIndex = _DATAGAME.zIndexData.particleFront + this.dataParticle.zIndex;
			// } else {
			// 	this.zIndex = _DATAGAME.zIndexData.particleFront;
			// }

			//POSITION
			if(this.dataParticle.posX != null) this.pos.x = this.dataParticle.posX;
			if(this.dataParticle.posY != null) this.pos.y = this.dataParticle.posY;
			
		},

		update:function(){
			this.parent();
		},

		calculateOffset:function() {
			var initialPosX = this.pos.x - ig.game.screen.x;
			var initialPosY = this.pos.y - ig.game.screen.y; 

			var distX = (initialPosX + ig.game.currentWindow.posXBG) - (-ig.game.screen.x + ig.sizeHandler.minW * ig.game.currentWindow.bg.pntX);

            var widthY = (ig.system.height * ig.game.currentWindow.bg.pntY);
            var posScaleY = widthY;

            if(ig.sizeHandler.isPortrait && ig.game.currentWindow.bg.isImage) {
                widthY = ig.game.currentWindow.bg.cvsBG.height * ig.game.currentWindow.bg.pntY;
                posScaleY = -ig.game.screen.y + widthY;
            }

            // var distY = (initialPosY + ig.game.currentWindow.posYBG) - posScaleY;

            var heightBG = (ig.game.currentWindow.bg.isImage) ? ig.game.currentWindow.bg.cvsBG.height : (1280*_DATAGAME.ratioRes);
            var widthY = heightBG * ig.game.currentWindow.bg.pntY;
            var ratioY = widthY / heightBG;
            var posBGY = (heightBG * (ig.game.currentWindow.zoomBG - 1)) * ratioY;

            var posFinal = {
                x: -ig.game.screen.x + ig.sizeHandler.minW * ig.game.currentWindow.bg.pntX + distX * ig.game.currentWindow.zoomBG,
                y: -ig.game.screen.y + ig.game.currentWindow.posYBG - posBGY + (this.pos.y * ig.game.currentWindow.zoomBG)
            //     // y: ig.game.currentWindow.bg.pos.y + (((this.pos.y - (-ig.game.screen.y)) * ig.game.currentWindow.zoomBG) - ig.game.screen.y)
            //     // y: posScaleY + distY * ig.game.currentWindow.zoomBG
            };

            return posFinal;
		},

		draw:function(){
			this.parent();

			// if(this.imgSrc) {
			// 	var c = ig.system.context;

			// 	c.save();

			// 	var posFinal = this.calculateOffset();

			// 	c.translate(posFinal.x, posFinal.y);

			// 	c.rotate(this.angle * Math.PI / 180);

			// 	c.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);

			// 	// var targetX = (this.flip.x ? (1-this.pivot.x):this.pivot.x) * -this.size.x;
			// 	// var targetY = (this.flip.y ? (1-this.pivot.y):this.pivot.y) * -this.size.y;

			// 	this.imgSrc.draw(targetX, targetY);
			// 	c.restore();
			// }

			// c.save();
			// c.fillStyle = 'white';
			// c.fillRect(0+360-ig.game.screen.x, 0+640-ig.game.screen.y, 10, 10);
			// c.restore();
		}
	});
});