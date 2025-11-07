ig.module('game.entities.buttons.button')
.requires(
	'impact.entity',
	'plugins.data.vector'
)
.defines(function() {
	EntityButton = ig.Entity.extend({
		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		size:new Vector2(48,48),
		fillColor:null,
		zIndex:_DATAGAME.zIndexData.buttonOnMenu,
		visible:true,
		isClickable: true,
		isHover:false, 
		isMouseOver:false,
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			
			if(!ig.global.wm)
			{
				if(!isNaN(settings.zIndex))
				{
					this.zIndex=settings.zIndex;
				}
			}
			//Pick a random color
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			var a=1;
			this.fillColor = "rgba("+r+","+b+","+g+","+a+")";
		},

		hover:function() {

		},

		leave:function() {

		},

		update: function(){
			this.parent();

			//HOVER
			if(this.underPointer()) {
				this.hover();
			} else {
				this.leave();
			}
			
			// Add your own, additional update code here
			// if(ig.globalSettingsClicked == false){
			// 	this.play();
			// } else {
				// console.log('b');
			// 	this.play();
			// }

			if(this.boolSinking == true) {
				if(this.statSinking == 1) {
					if(this.offset.y + 1 >= 5) {
						this.offset.y = 5;
						this.statSinking = 2;
					} else {
						this.offset.y += 1;
					}
				} else if(this.statSinking == 2) {
					if(this.offset.y - 1 <= 0) {
						this.offset.y = 0;
						this.statSinking = 1;
						this.boolSinking = false;
						this.funcComplete();
					} else {
						this.offset.y -= 1;
					}
				}
			}
		 },
		
		clicked:function(){
			// console.warn("no implementation on clicked()");
			if(this.visible) {
				ig.soundHandler.sfxPlayer.play('click');
				
				this.sinkingEffect();
			}
		},
		
		clicking:function(){
			// console.warn("no implementation on clicking()");
			
		},
		released:function(){
			// console.warn("no implementation on released()");
			
		},

		funcComplete:function() {
			
		},

		sinkingEffect:function(settings) {
			this.boolSinking = true;
			this.statSinking = 1;
			// var tweenStart = 
			// this.tween(
			// 	{
			// 		offset:{y:5}
			// 	}, 0.1 , {
			// 		ignorePause:true
			// 	}
			// );
   //   	  	var tweenBack = this.tween(
   //   	  		{
   //   	  			offset:{y:0}
   //   	  	}, 0.1, {
   //   	  		ignorePause:true,
   //   	  		onComplete:this.funcComplete.bind(this)
   //   	  	});

   //   	    tweenStart.chain(tweenBack);
			// tweenStart.start('bbbbb');

		},

		/* OVERRIDE DEFAULT METHOD */
	    underPointer: function () {
	        var p = ig.game.io.getClickPos();
	        return this.containPoint(p);
	    }
	});

	EntityButtonIcon = EntityButton.extend({
		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		image: new ig.Image(_RESOURCESINFO.image.btnBlank2, 253, 75),
		size: {
			x: 253,
			y: 75,
		},
		textButton:'',
		halfSize:null,
		fillColor:null,
		zIndex:_DATAGAME.zIndexData.buttonOnMenu,
		
		init:function(x,y,settings){
			this.parent(x,y,settings);

			// this.size= {
			// 	x: 253,
			// 	y: 75,
			// },

			this.halfSize = {
                x: this.size.x / 2,
                y: this.size.y / 2
            }
			
			if(!ig.global.wm)
			{
				if(!isNaN(settings.zIndex))
				{
					this.zIndex=settings.zIndex;
				}
			}
			//Pick a random color
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			var a=1;
			this.fillColor = "rgba("+r+","+b+","+g+","+a+")";
		},

		draw:function() {
            this.parent();
            
            if(this.visible) {
	            var c = ig.system.context;
				c.save();
				c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
				this.image.draw(0, 0);
				this.icon.draw(-this.icon.width/2, this.halfSize.y-(this.icon.height/2));

				c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.5*ig.game.fontRatio) + "px " + ig.game.fontName;
				c.textAlign = 'center';
				c.fillStyle = 'white';
				c.fillText(this.textButton, this.halfSize.x + 12, this.halfSize.y + 9);
				
				c.restore();

				this.drawObject();
			}
        },

        drawObject:function() {

        },

		update: function(){
			this.parent();
			
			// Add your own, additional update code here
			// if(ig.globalSettingsClicked == false){
			// 	this.play();
			// } else {
			// 	console.log('b');
			// 	this.play();
			// }
		 },

		funcComplete:function() {
			
		},
		
		clicked:function(){
			// console.warn("no implementation on clicked()");
			if(this.visible && this.isClickable) {
				ig.soundHandler.sfxPlayer.play('click');
				
				this.sinkingEffect();

				if(ig.game.windowName == 'menu' || ig.game.windowName == 'after photoshoot') {
					ig.game.currentWindow.enabledButton(false);
				}
			}
		}
	});

	EntityButtonText = EntityButton.extend({
		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		image: new ig.Image(_RESOURCESINFO.image.btnBlank2, 253, 75),
		size: {
			x: 253,
			y: 75,
		},
		textButton:'',
		textSize:35,
		yText:11,
		halfSize:null,
		fillColor:null,
		zIndex:_DATAGAME.zIndexData.buttonOnMenu,
		
		init:function(x,y,settings){
			this.parent(x,y,settings);

			this.halfSize = {
                x: this.size.x / 2,
                y: this.size.y / 2
            }
			
			if(!ig.global.wm)
			{
				if(!isNaN(settings.zIndex))
				{
					this.zIndex=settings.zIndex;
				}
			}
			//Pick a random color
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			var a=1;
			this.fillColor = "rgba("+r+","+b+","+g+","+a+")";
		},

		draw:function() {
            this.parent();
            
            if(this.visible) {
	            var c = ig.system.context;
				c.save();
				c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
				this.image.draw(0, 0);

				c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.63*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
				c.textAlign = 'center';
				c.fillStyle = 'white';
				c.fillText(this.textButton, this.halfSize.x, this.halfSize.y + this.yText);
				
				c.restore();
			}
        },

		update: function(){
			this.parent();
			
		 },

		funcComplete:function() {
			
		},
		
		clicked:function(){
			// console.warn("no implementation on clicked()");
			if(this.visible) {
				ig.soundHandler.sfxPlayer.play('click');
				
				this.sinkingEffect();
			}
		}
	});
});