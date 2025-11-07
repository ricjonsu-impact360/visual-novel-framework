ig.module('game.entities.particle.bubble')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityBubble = ig.Entity.extend({
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
		  	this.speedY = this.random(2, 5);
		  	this.radius = this.random(50, 70);
		  	this.opacity = 0.5;

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

			var gradwhite=ctx.createRadialGradient(0, 0, 1, 1, 1, this.radius);
			gradwhite.addColorStop(0.4, ig.game.hexToRGBA('white', 0));
			gradwhite.addColorStop(1, ig.game.hexToRGBA('white', 1)); 
			
			// Fill circle with gradient
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
			ctx.fillStyle = gradwhite;
			ctx.fill();

			var grad=ctx.createRadialGradient(0, 0, 1, 1, 1, this.radius);
			grad.addColorStop(0.4, ig.game.hexToRGBA(this.color, 0));
			grad.addColorStop(0.8, ig.game.hexToRGBA(this.color, 0.3));
			grad.addColorStop(0.95, ig.game.hexToRGBA(this.color, 0.5)); 
			

			// Fill circle with gradient
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
			ctx.fillStyle = grad;
			ctx.fill();
			ctx.restore();

			ctx.save();
			ctx.translate(this.startX - this.radius/2, this.startY- this.radius/2);
			ctx.rotate(315 * Math.PI / 180);
			ctx.scale(1.7, 0.8);
			ctx.globalAlpha = 0.8;
			ctx.beginPath();
			ctx.arc(0, 0, this.radius*0.15, 0, Math.PI*2, false);
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.restore();
		}
	});
});
