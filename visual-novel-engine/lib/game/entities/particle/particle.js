ig.module('game.entities.particle.particle')
.requires(
	'impact.entity',
	'game.entities.particle.bubble',
	'game.entities.particle.snow',
	'game.entities.particle.rain',
	'game.entities.particle.matrix',
	'game.entities.particle.fireworks',
	'game.entities.particle.meteor',
	'game.entities.particle.dust_mote',
	'game.entities.particle.fire_ember'
)

.defines(function(){
	EntityParticle = ig.Entity.extend({
		dataParticle:{},
		zIndex:-1,
		animType:1,
		opacityMatrix:1,

		dummyParam:0,

		arrayColor:[ 'white', 'red', 'blue', 'green', 'yellow' ],
		numColor:0,

		arrType:['TYPE_SNOW', 'TYPE_RAIN', 'TYPE_MATRIX', 'TYPE_FIREWORKS', 'TYPE_METEOR', 'TYPE_BUBBLE', 'TYPE_DUST_MOTE', 'TYPE_FIRE_EMBER' ],

		init:function( x, y, settings ){
			this.parent( x, y, settings );
		},

		setInitialProp:function() {
			//Z-INDEX
			if(this.dataParticle.zIndex == null) this.dataParticle.zIndex = -1;

			if(this.dataParticle.zIndex < 0) {
				this.zIndex = _DATAGAME.zIndexData.particleBack - this.dataParticle.zIndex;
			} else if(this.dataParticle.zIndex >= 0) {
				this.zIndex = _DATAGAME.zIndexData.particleFront + this.dataParticle.zIndex;
			} else {
				this.zIndex = _DATAGAME.zIndexData.particleFront;
			}

			// this.animType = this['TYPE_' + this.dataParticle.type.toUpperCase()];
			this.animType = this.arrType.indexOf('TYPE_' + this.dataParticle.type.toUpperCase());

			var isSpeedNull = false;
			if(this.dataParticle.speed == null) { this.dataParticle.speed = 1; isSpeedNull = true; }
			if(this.dataParticle.size == null) this.dataParticle.size = 1;

			switch(this.animType) {
				case this.arrType.indexOf('TYPE_SNOW') :
					if(this.dataParticle.color == null) this.dataParticle.color = 'white';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 10;
					break;
				case this.arrType.indexOf('TYPE_RAIN') :
					if(this.dataParticle.color == null) this.dataParticle.color = '#8cef';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 10;
					break;
				case this.arrType.indexOf('TYPE_MATRIX') :
					if(this.dataParticle.color == null) this.dataParticle.color = '#11e809';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 8;
					break;
				case this.arrType.indexOf('TYPE_FIREWORKS') :
					if(this.dataParticle.color == null) {
						this.dataParticle.color = [ 'white', 'red', 'blue', 'green', 'yellow' ];
					} else {
						if(typeof this.dataParticle.color === 'string') {
							var _tempColor = this.dataParticle.color;
							this.dataParticle.color = [ _tempColor ];
						}
					}

					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 1;
					this.numColor = 0;
					this.arrayColor = []; this.arrayColor = this.dataParticle.color.concat([]);
					this.arrayColor = ig.game.shuffleArray(this.arrayColor); 
					break;
				case this.arrType.indexOf('TYPE_METEOR') :
					if(this.dataParticle.color == null) this.dataParticle.color = 'white';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 2;
					break;
				case this.arrType.indexOf('TYPE_BUBBLE') :
					if(this.dataParticle.color == null) this.dataParticle.color = '#54e1ff';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 2;
					break;
				case this.arrType.indexOf('TYPE_DUST_MOTE') :
					if(isSpeedNull == true) this.dataParticle.speed = 3;
					if(this.dataParticle.color == null) this.dataParticle.color = 'gray';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 100;
					break;
				case this.arrType.indexOf('TYPE_FIRE_EMBER') :
					if(this.dataParticle.color == null) this.dataParticle.color = 'red';
					if(this.dataParticle.quantity == null || this.dataParticle.quantity <= 0) this.dataParticle.quantity = 2;
					break;
			}

			this.drawParticle(true);
		},

		drawParticle:function(firstDraw) {
			var _duration = 1;
			switch(this.animType) {
				case this.arrType.indexOf('TYPE_SNOW') :
					if(firstDraw!=true) _duration = 1 / (this.dataParticle.quantity);
					this.dummyParam = 0;
					this.tweenSnow = this.tween({
			            dummyParam:1
			        }, _duration, {
			            easing : ig.Tween.Easing.Linear.EaseNone,
			            onComplete:function() {
			            	if(this.animType != this.arrType.indexOf('TYPE_SNOW')) return;

			                var snow = ig.game.spawnEntity(EntitySnow, 0, 0, {
			                	_parent:this,
			                	color:this.dataParticle.color, 
			                	speed:this.dataParticle.speed,
			                	size:this.dataParticle.size
			                });
			                this.drawParticle();
			            }.bind(this)
			        });
			        this.tweenSnow.start();
					break;
				case this.arrType.indexOf('TYPE_RAIN') :
					if(firstDraw!=true) _duration = 1 / (this.dataParticle.quantity * 5);
					this.dummyParam = 0;
					this.tweenRain = this.tween({
			            dummyParam:1
			        }, _duration, {
			            easing : ig.Tween.Easing.Linear.EaseNone,
			            onComplete:function() {
			            	if(this.animType != this.arrType.indexOf('TYPE_RAIN')) return;

			                var raindrop = ig.game.spawnEntity(EntityRain, 0, 0, {
			                	_parent:this,
			                	color:this.dataParticle.color, 
			                	speed:this.dataParticle.speed,
			                	size:this.dataParticle.size
			                });
			                this.drawParticle();
			            }.bind(this)
			        });
			        this.tweenRain.start();
					break;
				case this.arrType.indexOf('TYPE_MATRIX') :
					this.opacityMatrix = 1;
					var delayMultiply = (this.dataParticle.quantity >= 10) ? 0.1 : (1 / this.dataParticle.quantity);
					for(var i=0; i<this.dataParticle.quantity; i++) {
						this['entityMatrix' + i] = ig.game.spawnEntity(EntityMatrix, 0, 0, {
							_parent:this, 
							delay:delayMultiply*i,
			                color:this.dataParticle.color, 
		                	speed:this.dataParticle.speed,
		                	size:this.dataParticle.size
						});
					}
					break;
				case this.arrType.indexOf('TYPE_FIREWORKS') :
					if(firstDraw!=true) _duration = 4 / (this.dataParticle.quantity);
					this.dummyParam = 0;
					this.numColor++;
					if(this.numColor > this.arrayColor.length - 1) {
						this.arrayColor = ig.game.shuffleArray(this.arrayColor); 
						this.numColor = 0;
					}
					this.tweenFireworks = this.tween({
			            dummyParam:1
			        }, _duration, {
			            easing : ig.Tween.Easing.Linear.EaseNone,
			            onComplete:function() {
			            	if(this.animType != this.arrType.indexOf('TYPE_FIREWORKS')) return;

			                var fireworks = ig.game.spawnEntity(EntityFireworks, 0, 0, {
			                	_parent:this, 
			                	color:this.arrayColor[this.numColor], 
			                	speed:this.dataParticle.speed,
			                	size:this.dataParticle.size
			                });
			                this.drawParticle();
			            }.bind(this)
			        });
			        this.tweenFireworks.start();
					break;
				case this.arrType.indexOf('TYPE_METEOR') :
					if(firstDraw!=true) _duration = 1 / (this.dataParticle.quantity);
					this.dummyParam = 0;
					this.tweenMeteor = this.tween({
			            dummyParam:1
			        }, _duration, {
			            easing : ig.Tween.Easing.Linear.EaseNone,
			            onComplete:function() {
			            	if(this.animType != this.arrType.indexOf('TYPE_METEOR')) return;

			                var meteor = ig.game.spawnEntity(EntityMeteor, 0, 0, {
			                	_parent:this,
			                	color:this.dataParticle.color, 
			                	speed:this.dataParticle.speed,
			                	size:this.dataParticle.size
			                });
			                this.drawParticle();
			            }.bind(this)
			        });
			        this.tweenMeteor.start();
					break;
				case this.arrType.indexOf('TYPE_BUBBLE') :
					if(firstDraw!=true) _duration = 1 / (this.dataParticle.quantity);
					this.dummyParam = 0;
					this.tweenBubble = this.tween({
			            dummyParam:1
			        }, _duration, {
			            easing : ig.Tween.Easing.Linear.EaseNone,
			            onComplete:function() {
			            	if(this.animType != this.arrType.indexOf('TYPE_BUBBLE')) return;

			                var bubble = ig.game.spawnEntity(EntityBubble, 0, 0, {
			                	_parent:this,
			                	color:this.dataParticle.color, 
			                	speed:this.dataParticle.speed,
			                	size:this.dataParticle.size
			                });
			                this.drawParticle();
			            }.bind(this)
			        });
			        this.tweenBubble.start();
					break;
				case this.arrType.indexOf('TYPE_DUST_MOTE') :
					for(var _dust=0; _dust<this.dataParticle.quantity;_dust++) {
						this['dustMote' + _dust] = ig.game.spawnEntity(EntityDustMote, 0, 0, {
		                	_parent:this,
		                	color:this.dataParticle.color, 
		                	speed:this.dataParticle.speed,
		                	size:this.dataParticle.size
		                });
					}
					break;
				case this.arrType.indexOf('TYPE_FIRE_EMBER') :
					if(firstDraw!=true) _duration = 1 / (this.dataParticle.quantity);
					this.dummyParam = 0;
					this.tweenFireEmber = this.tween({
			            dummyParam:1
			        }, _duration, {
			            easing : ig.Tween.Easing.Linear.EaseNone,
			            onComplete:function() {
			            	if(this.animType != this.arrType.indexOf('TYPE_FIRE_EMBER')) return;

			                var fireEmber = ig.game.spawnEntity(EntityFireEmber, 0, 0, {
			                	_parent:this,
			                	color:this.dataParticle.color, 
			                	speed:this.dataParticle.speed,
			                	size:this.dataParticle.size
			                });
			                this.drawParticle();
			            }.bind(this)
			        });
			        this.tweenFireEmber.start();
					break;
			}
		},

		killOtherEntity:function() {
			switch(this.animType) {
				case this.arrType.indexOf('TYPE_DUST_MOTE') :
					for(var _dust=0; _dust<this.dataParticle.quantity;_dust++) {
						this['dustMote' + _dust].fadeOut();
					}
			}
		},

		killEntityMatrix:function() {
			this.opacityMatrix = 1;
			this.tweenKillMatrix = this.tween({
	            opacityMatrix:0
	        }, 0.1, {
	            easing : ig.Tween.Easing.Linear.EaseNone,
	            onComplete:function() {
	                for(var i=0; i<this.dataParticle.quantity; i++) {
						if(this['entityMatrix' + i] != null) {
							this['entityMatrix' + i].kill();
							this['entityMatrix' + i] = null;
						}
					}
					this._parent.entityParticle.kill();
					this._parent.entityParticle = null;
	            }.bind(this)
	        });
	        this.tweenKillMatrix.start();
			
		},

		update:function(){
			this.parent();
		},

		draw:function(){
			this.parent();

			// this.drawParticle(ig.system.context);

			// if(this.imgSrc) {
			// 	var c = ig.system.context;

			// 	c.save();

			// 	var posFinal = this.calculateOffset();

			// 	c.translate(posFinal.x, posFinal.y);
			// 	// c.translate((this.pos.x-ig.game.screen.x), (this.pos.y-ig.game.screen.y));

			// 	c.rotate(this.angle * Math.PI / 180);

			// 	c.scale(this.scale.x * (this.flip.x ? -1:1)*ig.game.currentWindow.zoomBG, this.scale.y * (this.flip.y ? -1:1)*ig.game.currentWindow.zoomBG);

			// 	var targetX = (this.flip.x ? (1-this.pivot.x):this.pivot.x) * -this.size.x;
			// 	var targetY = (this.flip.y ? (1-this.pivot.y):this.pivot.y) * -this.size.y;

			// 	this.imgSrc.draw(targetX, targetY);
			// 	c.restore();
			// }

			// c.save();
			// c.fillStyle = 'white';
			// c.fillRect(0+360-ig.game.screen.x, 0+640-ig.game.screen.y, 10, 10);
			// c.restore();
		}
	});
});
