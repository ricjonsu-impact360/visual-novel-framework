ig.module('game.entities.particle.meteor')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityMeteor = ig.Entity.extend({
		zIndex:-1,
		startX:0, 
		startY:0,
		opacity:0.9,
		radiusGlow:40,
		radius:15,
		speedX:0, 
		speedY:0,
		minSpeed:20,
		maxSpeed:40,
		defSize:{x:600, y:4},
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.createMeteor();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		createMeteor:function() {
			var defStartX = this.random(ig.system.width / 4, ig.system.width);
		  	var defStartY = this.random(-10, -5);

			if(this.random(0, 100) <= 50) {
				var defStartX = ig.system.width + this.random(this.radius, this.radiusGlow);
		  		var defStartY = this.random(0, ig.system.height / 2);
			}
			
		  	this.speedX = this.random(this.minSpeed, this.maxSpeed) * -1;
		  	this.speedY = Math.abs(this.speedX);
		  	this.opacity = 0.9;

		  	this.startX = defStartX;
		  	this.startY = defStartY;

		  	this.tweenMeteor = this.tween({
	            opacity:0
	        }, (this.maxSpeed + (10*this.maxSpeed/30) - this.speedY) / this.maxSpeed * 2, {
	            easing : ig.Tween.Easing.Linear.EaseNone,
	            onComplete:function() {
	                this.kill();
	            }.bind(this)
	        });
	        this.tweenMeteor.start();

	        this.zIndex = this._parent.zIndex;
	        ig.game.sortEntitiesDeferred();
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

			this.startX += this.speedX;
			this.startY += this.speedY;

			if (this.startY >= ig.system.height + this.radius + (this.defSize.x/2)) {
				this.kill();
			}
		},

		draw:function(){
			this.parent();

			var ctx = ig.system.context;

			ctx.save();
			ctx.translate(this.startX, this.startY);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			ctx.rotate(315 * Math.PI / 180);

			// Fill meteor tail with gradient
			ctx.globalAlpha = this.opacity;
			var grad=ctx.createLinearGradient(0,0,this.defSize.x,0);
			grad.addColorStop(0, this.color); 
			grad.addColorStop(1, "rgba(255, 255, 255, 0)");

			ctx.fillStyle = grad;
			ctx.fillRect(0,-this.defSize.y / 2,this.defSize.x,this.defSize.y);
			
			// Fill meteor glow with gradient
			ctx.globalAlpha = 0.5 * this.opacity;
			var gradGlow=ctx.createRadialGradient(0, 0, 0, 0, 0, this.radiusGlow);
			gradGlow.addColorStop(0, this.color); 
			gradGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
			
			ctx.beginPath();
			ctx.arc(0, 0, this.radiusGlow, 0, Math.PI*2, false);
			ctx.fillStyle = gradGlow;
			ctx.fill();

			// Fill meteor with gradient
			ctx.globalAlpha = 1 * this.opacity;
			var gradCircle=ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
			gradCircle.addColorStop(0, this.color); 
			gradCircle.addColorStop(1, "rgba(255, 255, 255, 0)");

			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
			ctx.fillStyle = gradCircle;
			ctx.fill();

			ctx.restore();
		}
	});
});
