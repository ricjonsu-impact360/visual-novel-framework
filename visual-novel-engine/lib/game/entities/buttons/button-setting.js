ig.module('game.entities.buttons.button-setting')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonSetting = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.miniButton,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.btnSetting),
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
				if(this.visible && this.isClickable && (ig.game.transition == null || !ig.game.transition.isRunning)) { // && this._parent.enableButton
					// ig.soundHandler.sfxPlayer.play('click');

					// if(ig.game.dataSFXLoop != null) {
	    //                 ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXLoop.name, ig.game.dataSFXLoop.id);
	    //             }

	    //             if(ig.game.dataSFXText != null) {
		   //              ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXText.name, ig.game.dataSFXText.id);
		   //          }
					
					if(ig.game.windowName == 'game') {
						ig.game.isPauseSetting = true;
						ig.game.currentWindow.canClickStage = false;
					// 	ig.game.tweens.onSystemPause();
					// 	ig.soundHandler.onSystemPause();
						ig.game.pauseGame();

						ig.game.openMiniButton = false;
						ig.game.currentWindow.reposMiniButton();
					} //else {
						this.sinkingEffect();
					//}

					ig.soundHandler.sfxPlayer.play('click');
					
					// ig.soundHandler.onSystemPause();

					this._parent.uiSetting.show();

					// ig.game.pauseGame();
					// ig.game.paused = true;

					// ig.game.fadeInWindow(LevelMenu);
				}
			},

			draw:function() {
            	this.parent();
            
	            if(ig.game.showUI && this.visible) {
		            var c = ig.system.context;
					c.save();
					c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
					this.image.draw(0, 0);
					c.restore();
				}
	        },

			repos: function () {
				this.pos.x = ig.system.width - this.size.x - 25;
				this.pos.y = 25;
			}
		});
	});