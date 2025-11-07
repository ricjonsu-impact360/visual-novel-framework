ig.module('game.entities.particle.fireworks')
.requires(
	'impact.entity'
)
.defines(function(){
	EntityFireworks = ig.Entity.extend({
		zIndex:-1,
		posLaunch: {x:0, y:0},
		posTail: [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ],

		statFireworks:0,
		STAT_LAUNCH:1,
		STAT_SPARK:2,

		sparkType:['circle','star','double-spiral','cross','swirl','flower','heart','ring-of-rings','diamond','hexagon','spiral','flurry','triple-star','random-burst','wave'],
		sparkSize:['large','medium', 'small'], //'small',
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.launchRocket();
			
			// this.zIndex = this._parent.zIndex;
			// ig.game.sortEntitiesDeferred();

			// this.repos();
		},

		repos:function() {
			
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		launchRocket:function() {
			this.endPos = {
				x: ig.system.width * ig.game.calculateRandom(15, 85) / 100,
				y: ig.system.height * ig.game.calculateRandom(20, 80) / 100
			};
			var durationLaunch = 1500 + Math.random() * 500;

			var rocket = ig.game.spawnEntity(EntityRocket, 0, 0, {
				_parent:this, 
				_particleParent:this._parent, 
				// zIndex:this.zIndex,
				radLaunch:10,
				color:this.color,
				posLaunch:{
					x:this.endPos.x,
					y:ig.system.height-50
				},
				endPos:this.endPos.y,
				durLaunch:durationLaunch,
				delay:0
			});

			for(var tail=1;tail<=6;tail++) {
				var tailRocket = ig.game.spawnEntity(EntityRocket, 0, 0, {
					_parent:this, 
					_particleParent:this._parent, 
					radLaunch:8-tail,
					alpha:1-(tail/10),
					color:this.color,
					posLaunch:{
						x:this.endPos.x,
						y:ig.system.height-50+(tail*50)
					},
					endPos:this.endPos.y,
					durLaunch:durationLaunch,
					delay:0
				});
			}

			ig.game.tweenDelay(this, durationLaunch-100, function() {
				this.explode(this.color, this.sparkType[ig.game.calculateRandom(0, this.sparkType.length-1)], this.sparkSize[ig.game.calculateRandom(0, this.sparkSize.length-1)]);
				// this.explode(this.color, 'double-spiral', this.sparkSize[ig.game.calculateRandom(0, this.sparkSize.length-1)]);
			}.bind(this));
  		},

	  	explode:function(color, explosionType, size) {
	  		this.statFireworks = this.STAT_SPARK;

			// Determine how many fragments
			var fragmentCount = 50;
			if (size === 'small') fragmentCount = 30;
			else if (size === 'large') fragmentCount = 80;
			else fragmentCount = 50;

			// Get pattern
			var pattern = this.getExplosionPattern(explosionType);

			// Create explosion fragments
			for (var i = 0; i < fragmentCount; i++) {
				var angle = pattern.angles && pattern.angles.length
			    ? pattern.angles[i % pattern.angles.length]
			    : Math.random() * 2 * Math.PI;

			    var magnitude = pattern.magnitude && pattern.magnitude.length
			    ? pattern.magnitude[i % pattern.magnitude.length]
			    : 1;

			    this.createFragment(this.endPos.x, this.endPos.y, this.color, angle, size, magnitude);
			 }
		},

		createFragment:function(posX, posY, color, angle, size, magnitude) {
			var _baseVelocity = size === 'small' ? 2 : size === 'large' ? 4 : 3;
			var _velocity = _baseVelocity * magnitude;
			var _multiplyBy = 70; //100
			var _offsetX = Math.cos(angle) * _velocity * _multiplyBy; 
			var _offsetY = Math.sin(angle) * _velocity * _multiplyBy; 
			var _duration = 2000 + Math.random() * 800; //2000->1000

			var spark = ig.game.spawnEntity(EntitySpark, 0, 0, {
				_parent:this,
				_particleParent:this._parent,
				radLaunch:10,
				baseVelocity:_baseVelocity,
				velocity:_velocity,
				offsetX:_offsetX,
				offsetY:_offsetY,
				duration:_duration,
				color:this.color,
				posLaunch:{x:posX, y:posY}
			});
		},

		generateRandomArray:function(length, generator) {
		    var arr = [];
		    for (var i = 0; i < length; i++) {
		        arr.push(generator());
		    }
		    return arr;
		},

		getExplosionPattern:function(type) {
		 // Original "circle" pattern
		 	if (type === 'circle') {
		    	var angles = [];
		    	for(var i = 0; i < 30; i++){
		    		angles.push((i / 30) * 2 * Math.PI);
		    	}
		    	return { "angles":angles };
			}

		  	// Original "star" pattern
		  	if (type === 'star') {
		    	var angles = [];
		    	for (var i = 0; i < 15; i++) {
		      		angles.push((i / 15) * 2 * Math.PI);
		      		angles.push(((i + 0.2) / 15) * 2 * Math.PI);
		    	}
		    	return { "angles":angles };
		  	}

		  	// -------------------------------------------------------------------
		  	// 15 NEW PATTERNS:
		  	// -------------------------------------------------------------------
		  	if (type === 'double-spiral') {
		    	var angles = [];
		    	for (var i = 0; i < 40; i++) {
		      		angles.push((i / 10) * Math.PI);
		    	}

		    	var magnitude =[];
		    	for(var j = 0; j < angles.length; j++) {
		    		magnitude.push(j % 2 === 0 ? 1 : 2)
		    	} 
		    	return { "angles":angles, "magnitude":magnitude };
		  	}

		  	if (type === 'cross') {
		    	var baseAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
		    	var repeated = [];
		    	var repeats = 10;
		    	for (var r = 0; r < repeats; r++) {
		    		for (var i = 0; i < baseAngles.length; i++) {
				    	repeated.push(baseAngles[i]);
					}
		      	// repeated.push(...baseAngles);
		    	}
		    	return { "angles": repeated };
		  	}

		  	if (type === 'swirl') {
		    	var angles = [];
		    	for (var i = 0; i < 60; i++) {
		      		angles.push(i * 0.2);
		    	}
		    	// var magnitude = angles.map((_, i) => 0.5 + i * 0.05);
		    	var magnitude =[];
			    for(var j = 0; j < angles.length; j++) {
			    	magnitude.push(0.5 + i * 0.05)
			    } 
		    	return { "angles":angles, "magnitude":magnitude };
		  	}

		  	if (type === 'flower') {
		    	var angles = [];
		    	var magnitude = [];
		    	for (var i = 0; i < 36; i++) {
		      		angles.push((2 * Math.PI * i) / 36);
		      		magnitude.push(i % 2 === 0 ? 1.2 : 0.7);
		    	}
		    	return { "angles":angles, "magnitude":magnitude };
		  	}

		  	if (type === 'heart') {
		    	var angles = [];
		    	for (var i = 0; i < 50; i++) {
		      		// parametric approximation for a heart shape
		      		var t = (i / 25) * Math.PI;
		      		angles.push(t);
		    	}
		    	// var magnitude = angles.map(() => 1 + Math.random() * 1);
		    	var magnitude = this.generateRandomArray(angles.length, function() { return 1 + Math.random() * 1 });
		    	return { "angles":angles, "magnitude":magnitude };
		  }

		  	if (type === 'ring-of-rings') {
		    	var angles = [];
		    	var magnitude = [];
		    	for (var ring = 1; ring <= 3; ring++) {
		      		for (var i = 0; i < 20; i++) {
		        		angles.push((2 * Math.PI * i) / 20);
		        		magnitude.push(ring);
		      		}
		    	}
		    	return { "angles":angles, "magnitude":magnitude };
		  	}

		  	if (type === 'diamond') {
		    	var baseAngles = [
		      		Math.PI / 4,
		      		(3 * Math.PI) / 4,
		      		(5 * Math.PI) / 4,
		      		(7 * Math.PI) / 4,
		    	];
		    	var angles = [];
		    	for (var i = 0; i < 10; i++) {
		    		for (var j = 0; j < baseAngles.length; j++) {
					    angles.push(baseAngles[j]);
					}
		      		// angles.push(...baseAngles);
		    	}
		    	return { "angles":angles };
		  	}

		  	if (type === 'hexagon') {
		    	var angles = [];
		    	var baseAngles = [
		      		0,
		      		Math.PI / 3,
		      		(2 * Math.PI) / 3,
		      		Math.PI,
		      		(4 * Math.PI) / 3,
		      		(5 * Math.PI) / 3,
		    	];
		    	for (var i = 0; i < 10; i++) {
		    		for (var j = 0; j < baseAngles.length; j++) {
					    angles.push(baseAngles[j]);
					}
		      		// angles.push(...baseAngles);
		    	}
		    	return { "angles":angles };
		  	}

		  	if (type === 'spiral') {
		    	var angles = [];
		    	for (var i = 0; i < 50; i++) {
		      		angles.push(i * 0.3);
		    	}
		    	// var magnitude = angles.map((_, i) => 0.4 + i * 0.1);
		    	var magnitude =[];
			    for(var j = 0; j < angles.length; j++) {
			    	magnitude.push(0.4 + j * 0.1)
			    } 

		    	return { "angles":angles, "magnitude":magnitude };
		  	}

		  	if (type === 'flurry') {
		    	var angles = this.generateRandomArray(60, function() { return Math.random() * 2 * Math.PI; }); 
				var magnitude = this.generateRandomArray(60, function() { return 0.5 + Math.random() * 1.5 });
				return { "angles":angles, "magnitude":magnitude };
		  	}

		  	if (type === 'triple-star') {
		    	var angles = [];
		    	for (var s = 0; s < 3; s++) {
		      		for (var i = 0; i < 15; i++) {
		        		angles.push((i / 15) * 2 * Math.PI);
		        		angles.push(((i + 0.2) / 15) * 2 * Math.PI);
		      		}
		    	}
		    	return { "angles":angles };
		  	}

		  	if (type === 'random-burst') {
		    	var angles = this.generateRandomArray(50, function() { return Math.random() * 2 * Math.PI; }); 
				var magnitude = this.generateRandomArray(50, function() { return 0.5 + Math.random() * 2 });
		    	return { "angles":angles, "magnitude":magnitude };
		  	}

			if (type === 'wave') {
			    var angles = [];
			    var magnitude = [];
			    for (var i = 0; i < 40; i++) {
			      var a = (i / 40) * 2 * Math.PI;
			      angles.push(a);
			      magnitude.push(1 + Math.sin(a * 4));
			    }
			    return { "angles":angles, "magnitude":magnitude };
			}

			// Default random scatter if none is recognized
			var angles = this.generateRandomArray(30, function() { return Math.random() * 2 * Math.PI; }); 
			var magnitude = this.generateRandomArray(30, function() { return 0.5 + Math.random() * 1.5 });
			return { "angles":angles, "magnitude":magnitude };
		},


		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

		},

		draw:function(ctx){
			this.parent();

		}
	});

	EntitySpark = ig.Entity.extend({
		zIndex:-1,
		posLaunch: {x:0, y:0},
		radLaunch:10,
		delay:0,
		alpha:1,
		scale:1,

		statFireworks:0,
		STAT_NONE:0,
		STAT_SPARK:1,
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.createSpark();
			
			// this.zIndex = this._parent.zIndex;
			// ig.game.sortEntitiesDeferred();

			// this.repos();
		},

		repos:function() {
			
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		createSpark:function() {
			this.offset = {x:0, y:0};
			this.tweenSpark = this.tween({
	            offset: {x:this.offsetX, y:this.offsetY},
	            alpha:0, 
	            scale:0.3
	        }, this.duration/1000, {
	            easing : ig.Tween.Easing.Quadratic.EaseOut,
	            onComplete:function() {
	                // this.statFireworks = this.STAT_NONE;
	                this.kill();
	            }.bind(this)
	        });
	        this.tweenSpark.start();

	        this.zIndex = this._particleParent.zIndex;
	        ig.game.sortEntitiesDeferred();
  		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

		},

		draw:function(ctx){
			this.parent();

			var ctx = ig.system.context;

			// if(this.statFireworks == this.STAT_LAUNCH) {
				ctx.save();
				ctx.globalAlpha = this.alpha;
				ctx.translate(this.posLaunch.x+this.offset.x, this.posLaunch.y+this.offset.y);
				// ctx.scale(this.scale, this.scale);
				ctx.scale(this.scale*ig.game.currentWindow.zoomBG, this.scale*ig.game.currentWindow.zoomBG);
				// ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
				ctx.beginPath();
				ctx.arc(0, 0, this.radLaunch, 0, Math.PI*2, false);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.restore();
			// }
		}
	});

	EntityRocket = ig.Entity.extend({
		zIndex:-1,
		posLaunch: {x:0, y:0},
		radLaunch:10,
		delay:0,
		alpha:1,

		statFireworks:0,
		STAT_NONE:0,
		STAT_LAUNCH:1,
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			if(this.delay <= 0){
				this.launchRocket();
			} else {
				ig.game.tweenDelay(this, this.delay*1000, this.launchRocket.bind(this));
			}

			this.launchRocket();
			
			// this.zIndex = this._parent.zIndex;
			// ig.game.sortEntitiesDeferred();

			// this.repos();
		},

		repos:function() {
			
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		launchRocket:function() {
			// console.log(this.delay);
			this.statFireworks = this.STAT_LAUNCH;

			this.tweenLaunch = this.tween({
	            posLaunch: {y:this.endPos}
	        }, this.durLaunch/1000, {
	            easing : ig.Tween.Easing.Quadratic.EaseOut,
	            onComplete:function() {
	                this.statFireworks = this.STAT_NONE;
	                this.kill();
	            }.bind(this)
	        });
	        this.tweenLaunch.start();

	        this.zIndex = this._particleParent.zIndex;
	        ig.game.sortEntitiesDeferred();
  		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

		},

		draw:function(ctx){
			this.parent();

			var ctx = ig.system.context;

			if(this.statFireworks == this.STAT_LAUNCH) {
				ctx.save();
				ctx.globalAlpha = this.alpha;
				ctx.translate(this.posLaunch.x, this.posLaunch.y);
				ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
				ctx.beginPath();
				ctx.arc(0, 0, this.radLaunch, 0, Math.PI*2, false);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.restore();
			}
		}
	});
});
