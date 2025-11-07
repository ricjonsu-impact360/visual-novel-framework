ig.module('game.entities.particle.dust_mote')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityDustMote = ig.Entity.extend({
		zIndex:-1,
		startX:0, 
		startY:0,
		speedX:0,
		speedY:0,
		radius:0,
		opacity:0,
		size:{x:9, y:60},
		speed:3,
		divider:5,
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.createDust();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		createDust:function() {
			var defStartX = this.random(0, ig.system.width);
		  	var defStartY = this.random(0, ig.system.height);
		  	this.speedX = this.random(-this.speed, this.speed)/this.divider;
		  	this.speedY = this.random(-this.speed, this.speed)/this.divider;
		  	this.radius = this.random(7, 20) * this.size;
		  	this.opacity = this.random(0.3, 0.7);

		  	this.startX = defStartX;
		  	this.startY = defStartY;

	        this.zIndex = this._parent.zIndex;
	        ig.game.sortEntitiesDeferred();
		},

		fadeOut:function() {
			this.tweenAlpha = this.tween({
	            opacity:0
	        }, 0.2, {
	            easing : ig.Tween.Easing.Linear.EaseNone,
	            onComplete:function() {
	            	this.kill();
	            }.bind(this)
	        });
	        this.tweenAlpha.start();
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

			this.startX += this.speedX;
			this.startY += this.speedY;

			if (this.startY > ig.system.height + this.radius) {
				this.speedY = this.random(-this.speed, 0)/this.divider;
				this.speedX = this.random(-this.speed, this.speed)/this.divider;

				this.startY = ig.system.height + this.radius + this.speedY;
			} else if (this.startY < 0 - this.radius) {
				this.speedY = this.random(0, this.speed)/this.divider;
				this.speedX = this.random(-this.speed, this.speed)/this.divider;

				this.startY = 0 - this.radius + this.speedY;
			} else if (this.startX > ig.system.width + this.radius) {
				this.speedX = this.random(-this.speed, 0)/this.divider;
				this.speedY = this.random(-this.speed, this.speed)/this.divider;

				this.startX = ig.system.width + this.radius + this.speedX;
			} else if (this.startX < 0 - this.radius) {
				this.speedX = this.random(0, this.speed)/this.divider;
				this.speedY = this.random(-this.speed, this.speed)/this.divider;

				this.startX = 0 - this.radius + this.speedX;
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
