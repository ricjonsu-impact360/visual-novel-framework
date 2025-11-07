ig.module('game.entities.particle.light_sunshine')
.requires(
	'impact.entity',
	'game.entities.particle.overlay_particle'
)

.defines(function(){
	EntityLightSunshine = EntityOverlayParticle.extend({
		opacity:1,
		multiplierRay:{x:1.4, y:1.1},
		angle : {
			"spark1":0, 
			"spark2": 45,
			"ray1": 0,
			"ray2": 0,
			"ray3": 0,
			"ray4": 0,
			"ray5": 0,
			"ray6": 0,
			"ray7": 0,
			"ray8": 0,
			"ray9": 0,
			"ray10": 0,
			"ray11": 0,
			"ray12": 0
		},
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.setInitialProp();
		},

		setInitialProp:function() {
			this.setPosition();
			
		  	this.radius = 50*this.dataParticle.size;
		  	this.opacity = 0.5;

	        this.zIndex = this._parent.zIndex;

	        this.tweenAngle('spark1', 0, 11, 4.6);
	        this.tweenAngle('spark2', 45, 11, 4.3);
	        this.tweenAngle('ray1', 0, 15, 4.2);
			this.tweenAngle('ray2', 45,30,8.1);
			this.tweenAngle('ray3', 90,65,12.6);
			this.tweenAngle('ray4', 135,20,16.8);
			this.tweenAngle('ray5', 170,11,6.1);
			this.tweenAngle('ray6', 245,40,9.3);
			this.tweenAngle('ray7', 290,95,20.1);
			this.tweenAngle('ray8', 335,25,22.8);
			this.tweenAngle('ray9', 152,11,6.3);
			this.tweenAngle('ray10', 198,40,11.1);
			this.tweenAngle('ray11', 221,95,20.9);
			this.tweenAngle('ray12', 375,25,22.1);

			ig.game.sortEntitiesDeferred();
		},

		tweenAngle:function(_angleName, _startAngle, _rotation, _duration) {
			this.angle[_angleName] = _startAngle - _rotation;

			var angleObj = {};
			angleObj[_angleName] = _startAngle + _rotation;

			var _tweenAngle = this.tween( {
	           	angle : angleObj
	        }, _duration, {
	            easing : ig.Tween.Easing.Linear.EaseNone,
	            loop : ig.Tween.Loop.Reverse
	        }).start();
		},

		random:function(min, max) {
			return Math.random() * (max - min) + min;
		},

		update:function() {
			this.parent();

			if (ig.game.isPauseSetting) return;
			if (ig.Timer.timeScale == 0) return;

		},

		drawRay:function(ctx, _width, _height, _angleName){
			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.rotate(this.angle[_angleName] * Math.PI / 180);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);

			var grad = ctx.createLinearGradient(0, 0, 0, -_height);
			grad.addColorStop(0, ig.game.hexToRGBA(this.dataParticle.color, 0.2));
			grad.addColorStop(0.8, ig.game.hexToRGBA(this.dataParticle.color, 0));

			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(-_width/2, -_height);
			ctx.lineTo(_width/2, -_height);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		},

		drawPlusSign:function(ctx, _radius, _angleName){
			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.rotate(this.angle[_angleName] * Math.PI / 180);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			ctx.globalAlpha = 0.7;
			this.drawCircle(ctx, _radius/3*2);
			ctx.restore();

			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.rotate(this.angle[_angleName] * Math.PI / 180);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG*0.05);
			this.drawCircle(ctx, _radius);
			ctx.restore();

			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.rotate(this.angle[_angleName] * Math.PI / 180);
			ctx.scale(ig.game.currentWindow.zoomBG*0.05, ig.game.currentWindow.zoomBG);
			this.drawCircle(ctx, _radius);
			ctx.restore();
		},

		drawCircle:function(ctx, _radius, _opacity) {
			if(_opacity == null) _opacity = 1; 

			var grad=ctx.createRadialGradient(0, 0, 0, 0, 0, _radius);
			grad.addColorStop(0, ig.game.hexToRGBA(this.dataParticle.color, _opacity)); 
			grad.addColorStop(0.3, ig.game.hexToRGBA(this.dataParticle.color, _opacity/2));
			grad.addColorStop(0.8, ig.game.hexToRGBA(this.dataParticle.color, 0));

			// Fill circle with gradient
			ctx.beginPath();
			ctx.arc(0, 0, _radius, 0, Math.PI*2, false);
			ctx.fillStyle = grad;
			ctx.fill();
		},

		draw:function(){
			this.parent();
			
			var ctx = ig.system.context;
			this.posFinal = this.calculateOffset();

			this.drawRay(ctx, this.radius*this.multiplierRay.x, this.radius*this.multiplierRay.y, 'ray1');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*1.04, this.radius*this.multiplierRay.y*1.28, 'ray2');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*1.1, this.radius*this.multiplierRay.y*1.57, 'ray3');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*1.13, this.radius*this.multiplierRay.y*1.85, 'ray4');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*0.81, this.radius*this.multiplierRay.y*0.82, 'ray5');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*1.04, this.radius*this.multiplierRay.y*1.18, 'ray6');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*1.09, this.radius*this.multiplierRay.y*0.85, 'ray7');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*1.1, this.radius*this.multiplierRay.y*1.85, 'ray8');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*0.5, this.radius*this.multiplierRay.y*1.57, 'ray9');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*0.31, this.radius*this.multiplierRay.y*1.28, 'ray10');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*0.92, this.radius*this.multiplierRay.y*1, 'ray11');
			this.drawRay(ctx, this.radius*this.multiplierRay.x*0.7, this.radius*this.multiplierRay.y*0.58, 'ray12');

			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			ctx.beginPath();
			ctx.arc(0, 0, this.radius/20, 0, Math.PI*2, false);
			ctx.fillStyle = this.dataParticle.color;
			ctx.fill();
			ctx.restore();

			this.drawPlusSign(ctx, this.radius, 'spark1');			
			this.drawPlusSign(ctx, this.radius/2, 'spark2');		

			ctx.save();
			ctx.translate(this.posFinal.x, this.posFinal.y);
			ctx.scale(ig.game.currentWindow.zoomBG, ig.game.currentWindow.zoomBG);
			this.drawCircle(ctx, this.radius/5);
			ctx.restore();	
			
		}
	});
});
