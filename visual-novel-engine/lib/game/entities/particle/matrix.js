ig.module('game.entities.particle.matrix')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityMatrix = ig.Entity.extend({
		zIndex:-1,
		fontSize:60,
		delay:0,
		counter:0,
		limit:3,
		letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>?/',
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );
			
			this.zIndex = this._parent.zIndex;
			ig.game.sortEntitiesDeferred();

			this.repos();
		},

		repos:function() {
			this.columns = Math.floor(ig.system.width / this.fontSize);
			this.drops = [];
			this.text = [];
			this.opacity = [];
			for (var i = 0; i < this.columns; i++) {
			  this.drops[i] = ig.game.calculateRandom(0, 100);
			  this.text[i] = this.letters[Math.floor(Math.random() * this.letters.length)];
			  this.opacity[i] = Math.random();
			}
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

			this.counter++;
			if(this.counter >= this.limit) {
				for (var i = 0; i < this.drops.length; i++) {
					this.opacity[i] = Math.random();
					this.text[i] = this.letters[Math.floor(Math.random() * this.letters.length)];
				    this.drops[i]++;
				    if (this.drops[i] * this.fontSize > ig.system.height && Math.random() > .95) {
				      this.drops[i] = 0;
				    }
				 }
				this.counter = 0;
			}
		},

		draw:function(ctx){
			this.parent();

			var ctx = ig.system.context;

			for (var i = 0; i < this.drops.length; i++) {
				ctx.save();
				ctx.globalAlpha = this.opacity[i] * this._parent.opacityMatrix; 
				ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			    ctx.fillStyle = this.color;
			    ctx.fillText(this.text[i], i * this.fontSize, this.drops[i] * this.fontSize);
			    ctx.restore();
			}
		}
	});
});
