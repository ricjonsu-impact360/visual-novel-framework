ig.module('game.entities.particle.single_particle')
.requires(
	'impact.entity',
	'game.entities.particle.light_sunshine',
	'game.entities.particle.explosion',
	'game.entities.particle.blood_drip'
)

.defines(function(){
	EntitySingleParticle = ig.Entity.extend({
		dataParticle:{},
		zIndex:-1,
		animType:1,
		opacityMatrix:1,

		entitySP:null,

		dummyParam:0,

		arrayColor:[ 'white', 'red', 'blue', 'green', 'yellow' ],
		numColor:0,

		arrType:['TYPE_LIGHT_SUNSHINE', 'TYPE_BLOOD_DRIP', 'TYPE_EXPLOSION' ],

		typeName:'',

		init:function( x, y, settings ){
			this.parent( x, y, settings );
		},

		setInitialProp:function() {
			//Z-INDEX
			if(this.dataParticle.zIndex == null) this.dataParticle.zIndex = -1;

			if(this.dataParticle.zIndex < 0) {
				this.zIndex = _DATAGAME.zIndexData.singleParticleBack - this.dataParticle.zIndex;
			} else if(this.dataParticle.zIndex >= 0) {
				this.zIndex = _DATAGAME.zIndexData.singleParticleFront + this.dataParticle.zIndex;
			} else {
				this.zIndex = _DATAGAME.zIndexData.singleParticleFront;
			}

			// this.animType = this['TYPE_' + this.dataParticle.type.toUpperCase()];
			this.animType = this.arrType.indexOf('TYPE_' + this.dataParticle.type.toUpperCase());
			this.typeName = 'TYPE_' + this.dataParticle.type.toUpperCase();

			var isSpeedNull = false;
			var isSizeNull = false;
			if(this.dataParticle.speed == null) { this.dataParticle.speed = 1; isSpeedNull = true; }
			if(this.dataParticle.size == null) { this.dataParticle.size = 1; isSizeNull = true; }

			switch(this.animType) {
				case this.arrType.indexOf('TYPE_LIGHT_SUNSHINE') :
					if(isSizeNull == true) this.dataParticle.size = 3;
					if(this.dataParticle.color == null) this.dataParticle.color = 'white';
					break;
				case this.arrType.indexOf('TYPE_BLOOD_DRIP') :
					if(isSizeNull == true) this.dataParticle.size = 5;
					if(this.dataParticle.color == null) this.dataParticle.color = '#aa0707';
					break;
				case this.arrType.indexOf('TYPE_EXPLOSION') :
					if(isSizeNull == true) this.dataParticle.size = 5;
					if(this.dataParticle.color == null) {
						this.dataParticle.color = ["#6A0000", "#900000", "#902B2B", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#f93801"];
					}
					else {
						if(typeof this.dataParticle.color === 'string') {
							var _tempColor = this.dataParticle.color;
							this.dataParticle.color = [ _tempColor ];
						}
					}
					break;
			}

			this.drawParticle();

			ig.game.sortEntitiesDeferred();
		},

		drawParticle:function(firstDraw) {
			var _duration = 1;

			var _entityName = '';
			switch(this.animType) {
				case this.arrType.indexOf('TYPE_LIGHT_SUNSHINE') :
					_entityName = 'LightSunshine';
					break;
				case this.arrType.indexOf('TYPE_BLOOD_DRIP') :
					_entityName = 'BloodDrip';
					break;	
				case this.arrType.indexOf('TYPE_EXPLOSION') :
					_entityName = 'Explosion';
					break;	
			}

			_duration = (this.dataParticle.delay == null) ? 0.05 : this.dataParticle.delay;

			this.dummyParam = 0;
			this.tweenLight = this.tween({
	            dummyParam:1
	        }, _duration, {
	            easing : ig.Tween.Easing.Linear.EaseNone,
	            onComplete:function() { 
	            	if(this.animType != this.arrType.indexOf(this.typeName)) return;

	                this.entitySP = ig.game.spawnEntity('Entity' + _entityName, 0, 0, {
	                	_parent:this,
	                	dataParticle:this.dataParticle
	                });
	            }.bind(this)
	        });
	        this.tweenLight.start();
		},

		update:function(){
			this.parent();
		},

		draw:function(){
			this.parent();

		}
	});
});
