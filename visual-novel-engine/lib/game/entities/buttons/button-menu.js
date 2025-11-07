ig.module('game.entities.buttons.button-menu')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonMenu = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.buttonMenu,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.btnBlank2),
			defsize: {
				x: 260*_DATAGAME.ratioRes, //300
				y: 76*_DATAGAME.ratioRes,
			},
			size: {
				x: 260*_DATAGAME.ratioRes,
				y: 76*_DATAGAME.ratioRes,
			},

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

						ig.game.openMiniButton = ig.game.currentWindow.miniButtonOpenedBefore;
						
						this._parent.enabledButton(false);
						ig.game.fadeInWindow(LevelMenu);
					}
				}
			},

			draw:function() {
            	this.parent();
            
	            if(this._parent.visible) {
	            	if(this.visible) {
			            var c = ig.system.context;
						c.save();
						c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
						this.image.draw(0, 0);
						
						var _fontSize = Math.round(ig.game.fontNameSize*0.6*_DATAGAME.ratioRes * ig.game.fontRatio);
						c.font = ig.game.fontNameWeight + ' ' + _fontSize + 'px ' + ig.game.fontName;
						c.textAlign = 'center';
						c.textBaseline = 'middle';
						c.fillStyle = ig.game.buttonTextColor;
						c.fillText(_STRINGS.Settings.menu, this.halfSize.x, this.halfSize.y + ig.game.checkArialOffset(_fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes*_DATAGAME.multiplierOffsetTextButtonBlankSmall));
						c.restore();
					}
				}
	        },

			repos: function () {
				// if(!_DATAGAME.chapters.multipleChapter && !_DATAGAME.loadBackgroundMusic) {
				// 	this.pos = {
				// 		x:this._parent.pos.x - this.halfSize.x,
				// 		y:this._parent.pos.y - this.halfSize.y + 40*_DATAGAME.ratioRes
				// 	};
				// } 
				// else {
				var _offsetYBtn = 150;
				if(!_DATAGAME.loadBackgroundMusic && !_DATAGAME.chapters.multipleChapter) _offsetYBtn = 110;

					this.pos = {
						x:this._parent.pos.x - this.size.x - 10*_DATAGAME.ratioRes,
						y:this._parent.pos.y - this.halfSize.y + _offsetYBtn*_DATAGAME.ratioRes
					};
				// }
			}
		});
	});