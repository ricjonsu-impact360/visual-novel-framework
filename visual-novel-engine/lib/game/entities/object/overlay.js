ig.module('game.entities.object.overlay')
.requires(
	'impact.entity',
	'impact.entity-pool'
)

.defines(function(){
	EntityOverlay = ig.Entity.extend({
		tweenID : -1,
		tweenList : {},
		objectID : "",
		// zIndex:0,
		imgSrc:null,
		textSrc:null,
		flip:{x:false, y:false},
		scale:{x:1, y:1},
		pivot:{x:0.5, y:0.5},
		angle:0,
		size:{x:0, y:0},
		alpha:0,
		isFirstLoad:true,
		objectType:1,

		fontSize:30,

		TYPE_IMAGE:1,
		TYPE_TEXT:2,
		TYPE_SPRITESHEET:3,

		configs:{},

	    
	 //    dataTween:null,

		init:function( x, y, settings ){
			this.parent( x, y, settings );
		},

		setInitialProp:function(boolAnim) {
			if(this.dataTween.source != null) {
				this.objectType = this.TYPE_IMAGE;
				this.imgSrc = new ig.Image(_BASEPATH.object + this.dataTween.source + ".png");

				//SIZE
				this.size = {
					x:this.imgSrc.width, 
					y:this.imgSrc.height
				};
			}
			// else if(this.dataTween.text != null) {
			// 	this.objectType = this.TYPE_TEXT;
			// 	this.textSrc = this.dataTween.text;
			// 	this.wrapText = ig.game.wordWrapForChatBubble(this.text, this.notifWidth - 2 * this.notifPadding, this.fontSize, this.fontFace, true, this.formatText)

			// 	if(this.dataTween.fontSize != null) this.fontSize = this.dataTween.fontSize*ig.game.fontRatio*_DATAGAME.ratioRes;

			// 	//SIZE
			// 	this.size = {
			// 		x:this.imgSrc.width, 
			// 		y:this.imgSrc.height
			// 	};

			// 	this.configs = {
	  //               textData:{
	  //                   textLines: this.notifProperties.lines
	  //               },
	  //               fontSize:this.dataTween.fontSize,
	  //               fillStyle:this.dataTween.fontColor,
	  //               fontFamily:this.dataTween.fontFamily,
	  //               // outline:this.dataTween.fontOutline,
	  //               counterAnim:0,
	  //               showFlash:[true, true, true, true, true, true],
	  //               showShake:[true, true, true, true, true, true]
	  //           };
			// }			

			//Z-INDEX
			if(this.dataTween.zIndex < 0) {
				this.zIndex = _DATAGAME.zIndexData.overlayObjectBack - this.dataTween.zIndex;
			} else if(this.dataTween.zIndex >= 0) {
				this.zIndex = _DATAGAME.zIndexData.overlayObjectFront + this.dataTween.zIndex;
			} else {
				this.zIndex = _DATAGAME.zIndexData.overlayObjectFront;
			}

			//PIVOT
			if(this.dataTween.pivotX != null) this.pivot.x = this.dataTween.pivotX;
			if(this.dataTween.pivotY != null) this.pivot.y = this.dataTween.pivotY;

			//FLIP
			if(this.dataTween.flipX != null) this.flip.x = this.dataTween.flipX;
			if(this.dataTween.flipY != null) this.flip.y = this.dataTween.flipY;
			
			if(this.dataTween.from) {
				//ANGLE
				if(this.dataTween.from.angle != null) this.angle = this.dataTween.from.angle;

				//SCALE
				if(this.dataTween.from.scaleX != null) this.scale.x = this.dataTween.from.scaleX;
				if(this.dataTween.from.scaleY != null) this.scale.y = this.dataTween.from.scaleY;

				//POSITION
				if(this.dataTween.from.x != null) this.pos.x = this.dataTween.from.x;
				if(this.dataTween.from.y != null) this.pos.y = this.dataTween.from.y;

				//ALPHA
				if(this.dataTween.from.alpha != null) this.alpha = this.dataTween.from.alpha; 
				else this.alpha = 1;
			}

			if(boolAnim) {
				if(this.tweenID != -1 && this.dataTween.to != null) {
					this.animTween();
				} else {
					if(this.tweenList['tween' + this.tweenID] != null) {
						this.tweenList['tween' + this.tweenID].loop = 0;
						this.tweenList['tween' + this.tweenID].stop();
					}
					this._parent.overlayList[this.tweenID] = true;

					// ig.game.consoleLog(this._parent.finishAddOverlayObject);

					if(this._parent.finishAddOverlayObject && this._parent.overlayList.indexOf(false) < 0) {
	                	this._parent.finishAllOverlay();
	                }
				}
			}
		},

		animTween:function() {
			var _loop = 0;
			var _alpha = this.alpha;
			var _angle = this.angle;
			var _scale = { x:this.scale.x, y:this.scale.y };
			var _position = { x:this.pos.x, y:this.pos.y };
			var _easing = (this.dataTween.easing && this.dataTween.easing != "") ? this.dataTween.easing.split(".") : ("Linear.EaseNone").split(".");


			//ANGLE
			if(this.dataTween.to.angle != null) _angle = this.dataTween.to.angle;

			//SCALE
			if(this.dataTween.to.scaleX != null) _scale.x = this.dataTween.to.scaleX;
			if(this.dataTween.to.scaleY != null) _scale.y = this.dataTween.to.scaleY;

			//POSITION
			if(this.dataTween.to.x != null) _position.x = this.dataTween.to.x;
			if(this.dataTween.to.y != null) _position.y = this.dataTween.to.y;

			//ALPHA
			if(this.dataTween.to.alpha != null) _alpha = this.dataTween.to.alpha;

			//LOOP
			if(this.dataTween.loop != null) {
				if(this.dataTween.loop.toLowerCase() == 'revert') _loop = ig.Tween.Loop.Revert;
				else if(this.dataTween.loop.toLowerCase() == 'reverse') _loop = ig.Tween.Loop.Reverse;
			}

			this.tweenList['tween' + this.tweenID] = this.tween({
				pos: _position, 
				alpha:_alpha,
				angle:_angle,
				scale:_scale
			}, this.dataTween.time, {
				delay: (this.dataTween.delay) ? this.dataTween.delay : 0,
				easing: ig.Tween.Easing[_easing[0]][_easing[1]], 
				loop : _loop,
                onComplete: function () {
                	this._parent.overlayList[this.tweenID] = true;

                    if(this.dataTween.remove == true) {
                    	this.kill();
                    	this._parent.entityOverlay[this.objectID] = null;
                    }
                    
                    if(this._parent.finishAddOverlayObject && this._parent.overlayList.indexOf(false) < 0) {
                    	this._parent.finishAllOverlay();
                    } else {
                    	this.checkChain();
                    }
                }.bind(this)
            });

			this.tweenList['tween' + this.tweenID].start();
            ig.game.sortEntitiesDeferred();
		},

		checkChain:function() {
			var boolChainSelf = false;
			var tempChainSelf;

			for(var i=0;i<this._parent.overlayList.length;i++) {
				if(!this._parent.overlayList[i] && this._parent.objectList[i].chain == this.tweenID){
					if(this._parent.objectList[i].objectID == this.objectID) {
						boolChainSelf = true;
						tempChainSelf = this._parent.objectList[i];
					} else {
						var tempData = this._parent.objectList[i];
						if(this._parent.entityOverlay[tempData.objectID]) {
							this._parent.entityOverlay[tempData.objectID].dataTween = this._parent.objectList[i];
							this._parent.entityOverlay[tempData.objectID].tweenID = this.dataTween.id;
							this._parent.entityOverlay[tempData.objectID].setInitialProp();
						} else {
							this._parent.entityOverlay[tempData.objectID] = ig.game.spawnEntity(EntityOverlay, 0, 0, {_parent:this._parent, objectID:tempData.objectID, dataTween:tempData, tweenID:tempData.id});
							ig.game.sortEntitiesDeferred();
						}
					}
				}
			}

			if(boolChainSelf) {
				this.dataTween = tempChainSelf;
				this.tweenID = this.dataTween.id;
				this.setInitialProp(true);
			}
		},

		update:function(){
			this.parent();
		},

		calculateOffset:function() {
			var initialPosX = this.pos.x - ig.game.screen.x;
			var initialPosY = this.pos.y - ig.game.screen.y; 

			var distX = (initialPosX + ig.game.currentWindow.posXBG) - (-ig.game.screen.x + ig.sizeHandler.minW * ig.game.currentWindow.bg.pntX);

            var widthY = (ig.system.height * ig.game.currentWindow.bg.pntY);
            var posScaleY = widthY;

            if(ig.sizeHandler.isPortrait && ig.game.currentWindow.bg.isImage) {
                widthY = ig.game.currentWindow.bg.cvsBG.height * ig.game.currentWindow.bg.pntY;
                posScaleY = -ig.game.screen.y + widthY;
            }

            // var distY = (initialPosY + ig.game.currentWindow.posYBG) - posScaleY;

            var heightBG = (ig.game.currentWindow.bg.isImage) ? ig.game.currentWindow.bg.cvsBG.height : (1280*_DATAGAME.ratioRes);
            var widthY = heightBG * ig.game.currentWindow.bg.pntY;
            var ratioY = widthY / heightBG;
            var posBGY = (heightBG * (ig.game.currentWindow.zoomBG - 1)) * ratioY;

            var posFinal = {
                x: -ig.game.screen.x + ig.sizeHandler.minW * ig.game.currentWindow.bg.pntX + distX * ig.game.currentWindow.zoomBG,
                y: -ig.game.screen.y + ig.game.currentWindow.posYBG - posBGY + (this.pos.y * ig.game.currentWindow.zoomBG)
            //     // y: ig.game.currentWindow.bg.pos.y + (((this.pos.y - (-ig.game.screen.y)) * ig.game.currentWindow.zoomBG) - ig.game.screen.y)
            //     // y: posScaleY + distY * ig.game.currentWindow.zoomBG
            };

            return posFinal;
		},

		draw:function(){
			this.parent();

			var c = ig.system.context;

			if(this.objectType == this.TYPE_IMAGE && this.imgSrc) {
				c.save();

				var posFinal = this.calculateOffset();

				c.globalAlpha = this.alpha;

				c.translate(posFinal.x, posFinal.y);
				// c.translate((this.pos.x-ig.game.screen.x), (this.pos.y-ig.game.screen.y));

				c.rotate(this.angle * Math.PI / 180);

				c.scale(this.scale.x * (this.flip.x ? -1:1)*ig.game.currentWindow.zoomBG, this.scale.y * (this.flip.y ? -1:1)*ig.game.currentWindow.zoomBG);

				var targetX = (this.flip.x ? (1-this.pivot.x):this.pivot.x) * -this.size.x;
				var targetY = (this.flip.y ? (1-this.pivot.y):this.pivot.y) * -this.size.y;

				if(this.dataTween.tint == null) {
					this.imgSrc.draw(targetX, targetY);
				} else {
					this.imgSrc.drawTint(this.dataTween.tint, 1, targetX, targetY);
				}
				
				c.restore();
			}
			else if(this.objectType == this.TYPE_TEXT && this.textSrc) {
				c.save();

				var posFinal = this.calculateOffset();

				c.globalAlpha = this.alpha;

				c.translate(posFinal.x, posFinal.y);
				// c.translate((this.pos.x-ig.game.screen.x), (this.pos.y-ig.game.screen.y));

				c.rotate(this.angle * Math.PI / 180);

				c.scale(this.scale.x * (this.flip.x ? -1:1)*ig.game.currentWindow.zoomBG, this.scale.y * (this.flip.y ? -1:1)*ig.game.currentWindow.zoomBG);

				var targetX = (this.flip.x ? (1-this.pivot.x):this.pivot.x) * -this.size.x;
				var targetY = (this.flip.y ? (1-this.pivot.y):this.pivot.y) * -this.size.y;

				c.fillText(this.textSrc, targetX, targetY);

				// if(this.dataTween.tint == null) {
				// 	this.imgSrc.draw(targetX, targetY);
				// } else {
				// 	this.imgSrc.drawTint(this.dataTween.tint, 1, targetX, targetY);
				// }
				
				c.restore();
			}

			// c.save();
			// c.fillStyle = 'white';
			// c.fillRect(0+360-ig.game.screen.x, 0+640-ig.game.screen.y, 10, 10);
			// c.restore();
		}
	});
});
