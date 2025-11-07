ig.module('game.entities.buttons.button-home')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonHome = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.buttonHome,
			gap:{x:0, y:0},
			// image:new ig.Image(_BASEPATH.ui + _DATAGAME.uiTheme + '/btn-home.png'),
			image:new ig.Image(_RESOURCESINFO.image.btnHome),
			defsize: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},
			size: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},
			defPos: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},//without scale

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				this.halfSize = {
	                x: this.size.x / 2,
	                y: this.size.y / 2
	            }

				if (ig.global.wm) {
					return;
				}

				this.repos();
			},

	        funcComplete:function() {
				// this._parent.chatBubble.chatBubbleAliveTime = 0.1;
				// this.visible = false;
			},

			clicked:function(){
				if(this.visible && this.isClickable) { // && this._parent.enableButton
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();

					if(ig.game.dataSFXLoop != null) {
	                    ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXLoop.name, ig.game.dataSFXLoop.id);
	                }

	                if(ig.game.dataSFXText != null) { 
		                ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXText.name, ig.game.dataSFXText.id);
		            }

					if(ig.game.windowName == 'menu') {
						this._parent.hide();
					} else {
						ig.game.isPauseSetting = false;
						ig.game.resumeGame();
						
						this._parent.enabledButton(false);
						ig.game.fadeInWindow(LevelMenu);
					}
				}
			},

			draw:function() {
            	this.parent();
            
	            if(ig.game.showUI && this.visible && this._parent.visible) {
		            var c = ig.system.context;
					c.save();
					c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
					this.image.draw(0, 0);
					c.restore();
				}
	        },

			repos: function () {
				if(_DATAGAME.loadBackgroundMusic) {
					this.pos.x = this._parent.pos.x - this.halfSize.x - 115*_DATAGAME.ratioRes;
				} else {
					// this.pos.x = this._parent.pos.x - this.halfSize.x;
					this.pos.x = this._parent.pos.x - this.halfSize.x - 60*_DATAGAME.ratioRes;
				}
				this.pos.y = this._parent.pos.y - this.halfSize.y;
				// this.pos.x = 25;
				// this.pos.y = 25;
			}
		});
	});