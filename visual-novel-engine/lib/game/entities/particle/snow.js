ig.module('game.entities.particle.snow')
.requires(
	'impact.entity'
)

.defines(function(){
	EntitySnow = ig.Entity.extend({
		zIndex:-1,
		startX:0, 
		startY:0,
		speedX:0,
		speedY:0,
		radius:0,
		opacity:1,
		defSize:{x:9, y:60},
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.createSnow();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		createSnow:function() {
			var defStartX = this.random(0, ig.system.width);
		  	var defStartY = this.random(-10, -5);
		  	this.speedX = this.random(-4, 4);
		  	this.speedY = this.random(5, 10);
		  	this.radius = this.random(7, 20);
		  	this.opacity = this.random(0, 0.9);

		  	this.startX = defStartX;
		  	this.startY = defStartY;

	        this.zIndex = this._parent.zIndex;
	        ig.game.sortEntitiesDeferred();
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

			this.startX += this.speedX;
			this.startY += this.speedY;

			if (this.startY >= ig.system.height + this.radius) {
				this.kill();
			}
		},

		draw:function(){
			this.parent();

			var ctx = ig.system.context;

			ctx.save();

			ctx.translate(this.startX, this.startY);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			ctx.globalAlpha = this.opacity;
			var grad=ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
			grad.addColorStop(0, this.color); 
			grad.addColorStop(0.8, ig.game.hexToRGBA(this.color, 0));
			

			// Fill circle with gradient
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
			ctx.fillStyle = grad;
			ctx.fill();

			ctx.restore();
		}
	});
});
