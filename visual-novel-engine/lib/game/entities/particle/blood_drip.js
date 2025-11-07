ig.module('game.entities.particle.blood_drip')
.requires(
	'impact.entity',
	'game.entities.particle.overlay_particle'
)

.defines(function(){
	EntityBloodDrip = EntityOverlayParticle.extend({
		opacity:1,
		options : {
		    scatter: 0,
		    gravity: 0.2,
		    consistency: 0.04,
		    pollock: false,
		    burst: true,
		    shade: true
		},

		items:[],
		shadowItems:[],
		
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.setInitialProp();
		},

		setInitialProp:function() {
			this.setPosition();

			this.splat(this.items);

	        this.zIndex = this._parent.zIndex;

	        ig.game.sortEntitiesDeferred();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		splat:function(arr) {

		    for (var i = 0; i < 30; i++) {
		        var s = Math.random() * Math.PI;
		        var dirx = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * this.options.scatter;
		        var diry = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * this.options.scatter;

		        arr.push({
		        	x:0,
		        	y:0,
		            dx: dirx, 
		            dy: diry, 
		            size: s
		        })
		    }

		},

		drawsplat:function(arr, ctx) {

		    var i = arr.length
		    while (i--) {
		        var t = arr[i];
		        var x = t.x,
		            y = t.y,
		            s = t.size;
		        this.circle(x, y, s, ctx);

		        t.dy -= this.options.gravity
		        t.x -= t.dx
		        t.y -= t.dy
		        t.size -= 0.05;

		        if (arr[i].size < 0.3 || Math.random() < this.options.consistency) {
		        	this.shadowItems.push({
		        		x:x,
		        		y:y,
		        		s:s
		        	});

		            arr.splice(i, 1)

		        }

		    }
		},

		circle:function(x, y, s, c) { 
			c.save();
			c.translate(this.posFinal.x, this.posFinal.y);
			c.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			c.fillStyle = this.dataParticle.color;
		    c.beginPath();
		    c.arc(x, y, s * this.dataParticle.size, 0, 2 * Math.PI, false);
		    c.fill();
		    c.closePath();
		    c.restore();
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;



		},

		draw:function(){
			this.parent();
			
			var ctx = ig.system.context;
			this.posFinal = this.calculateOffset();

			this.drawsplat(this.items, ctx);

			if(this.shadowItems != null && this.shadowItems.length > 0) {
				for(var _shadow=0;_shadow<this.shadowItems.length;_shadow++) {
				 	this.circle(this.shadowItems[_shadow].x, this.shadowItems[_shadow].y, this.shadowItems[_shadow].s, ctx);
				}
			}
		}
	});
});
