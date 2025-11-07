ig.module('game.entities.particle.explosion')
.requires(
	'impact.entity',
	'game.entities.particle.overlay_particle'
)

.defines(function(){
	EntityExplosion = EntityOverlayParticle.extend({
		opacity:1,

		requestId : null,
		rad : Math.PI / 180, 
		spring : 1 / 10, 
		friction : 0.85,
		particles : [],
		
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.setInitialProp();
		},

		setInitialProp:function() {
			this.setPosition();

			for (var i = 0; i < 50; i++) {
			  	var _randomData = this.setParticleData({x:0, y:0});
			    this.particles.push(_randomData);
			}

	        this.zIndex = this._parent.zIndex;

	        ig.game.sortEntitiesDeferred();
		},

		randomIntFromInterval:function(mn, mx) {
			return Math.floor(Math.random() * (mx - mn + 1) + mn);
		},
		

		setParticleData:function(o) {
			var _decay = 0.95; //randomIntFromInterval(80, 95)/100;//
			var _r = this.randomIntFromInterval(10, 70)*(this.dataParticle.size/5);
			var _R = 100*(this.dataParticle.size/5) - _r;
			var _angle = Math.random() * 2 * Math.PI;
			var _center = o; //{x:cx,y:cy} 
			var _pos = {
				x : _center.x + _r * Math.cos(_angle),
				y : _center.y + _r * Math.sin(_angle)
			};
			
			var _dest = {
				x : _center.x + _R * Math.cos(_angle),
				y : _center.y + _R * Math.sin(_angle)
			};
			
			var _color = this.dataParticle.color[~~(Math.random() * this.dataParticle.color.length)];
			var _vel = {
				x: 0,
			    y: 0
			};
			var _acc = {
			    x: 0,
			    y: 0
			};

			return {
				decay : _decay,
				r : _r,
				R : _R, 
				angle : _angle, 
				center : _center, 
				pos : _pos, 
				dest : _dest, 
				color : _color, 
				vel : _vel, 
				acc : _acc
			};
		},

		drawParticle:function(ctx, _data) {
			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			// ctx.globalCompositeOperation = "lighter";
			ctx.fillStyle = _data.color;
		    ctx.beginPath();
		    ctx.arc(_data.pos.x, _data.pos.y, _data.r, 0, 2 * Math.PI);
		    ctx.fill();
		    ctx.restore();
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

			for (var i = 0; i < this.particles.length; i++) {
				var dx = (this.particles[i].dest.x - this.particles[i].pos.x);
			    var dy = (this.particles[i].dest.y - this.particles[i].pos.y);

			    this.particles[i].acc.x = dx * this.spring;
			    this.particles[i].acc.y = dy * this.spring;
			    this.particles[i].vel.x += this.particles[i].acc.x;
			    this.particles[i].vel.y += this.particles[i].acc.y;

			    this.particles[i].vel.x *= this.friction;
			    this.particles[i].vel.y *= this.friction;

			    this.particles[i].pos.x += this.particles[i].vel.x;
			    this.particles[i].pos.y += this.particles[i].vel.y;

			    if (this.particles[i].r > 0) this.particles[i].r *= this.particles[i].decay;

			    if (this.particles[i].r < 0.5) {
			    	this.particles.splice(i, 1);
			    }
			}
		},

		draw:function(){
			this.parent();
			
			var ctx = ig.system.context;
			this.posFinal = this.calculateOffset();

			for (var i = 0; i < this.particles.length; i++) {
				this.drawParticle(ctx, this.particles[i]);
			}
		}
	});
});
