ig.module('game.entities.particle.rain')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityRain = ig.Entity.extend({
		zIndex:-1,
		startX:0, 
		startY:0,
		opacity:1,
		defSize:{x:9, y:60},
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.createRaindrop();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		createRaindrop:function() {
			var defStartX = this.random(0, ig.system.width);
		  	var defStartY = this.random(-10, -5);
		  	this.startX = defStartX;
		  	this.startY = defStartY;
		  	var duration = this.random(0.5, 2) * ig.system.height / ig.sizeHandler.minH ;

		  	this.tweenRain = this.tween({
	            startX:defStartX+60,
	            startY:ig.system.height+this.defSize.y,
	            opacity:0
	        }, duration, {
	            easing : ig.Tween.Easing.Linear.EaseNone,
	            onComplete:function() {
	                this.kill();
	            }.bind(this)
	        });
	        this.tweenRain.start();

	        this.zIndex = this._parent.zIndex;
	        ig.game.sortEntitiesDeferred();
		},

		draw:function(){
			this.parent();

			var ctx = ig.system.context;

			ctx.save();
			ctx.translate(this.startX, this.startY);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			ctx.globalAlpha = this.opacity;
			var grad=ctx.createLinearGradient(0,0,0,this.defSize.y);
			grad.addColorStop(0, "rgba(255, 255, 255, 0)");
			grad.addColorStop(1, this.color); 

			// Fill rectangle with gradient
			ctx.fillStyle = grad;
			ctx.fillRect(0,0,this.defSize.x,this.defSize.y);
			ctx.restore();
		}
	});
});
