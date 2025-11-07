ig.module('game.entities.particle.fire_ember')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityFireEmber = ig.Entity.extend({
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

			this.createBubble();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		createBubble:function() {
		  	this.speedX = this.random(-2, 2);
		  	this.speedY = this.random(1, 3) / 2 * this.speed;
		  	this.radius = this.random(1, 5) * this.size;
		  	this.opacity = 1;

		  	var defStartX = this.random(0, ig.system.width);
		  	var defStartY = ig.system.height + this.radius;

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
			this.startY -= this.speedY;

			if (this.startY <= -this.radius) {
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

			// Fill circle with gradient
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
			ctx.fillStyle = this.color;
			ctx.fill();

			ctx.restore();
		}
	});
});
