ig.module('game.entities.buttons.button-no-reset')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonNoReset = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.buttonNoReset,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.btnBlank4),
			imageHover:new ig.Image(_RESOURCESINFO.image.btnBlank4Hover),
			defsize: {
				x: 300*_DATAGAME.ratioRes,
				y: 76*_DATAGAME.ratioRes,
			},
			size: {
				x: 300*_DATAGAME.ratioRes,
				y: 76*_DATAGAME.ratioRes,
			},
			enableHover:false,

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
				if(this.visible && this.isClickable) {
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();

					if(this.onClicked) this.onClicked();
				}
			},

			onClicked:function() {
				this._parent.changeState(this._parent.STATE_SETTING);
			},

			hover:function() {
				if(this.enableHover) {
					this.isHover = true;
					this.isMouseOver = true;
					if(this._parent.selectedButton != 0 && this._parent.selectedButton != this._parent.SELECTED_BUTTON_NO) {
						this._parent.btnYes.isHover = false;
					}
					this._parent.selectedButton = 2;
				}
			},

			leave:function() {
				if(this.enableHover) {
					if(this.isMouseOver) { 
						this.isHover = false;
						this.isMouseOver = false;
						this._parent.selectedButton = 0;
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
						if(this.isHover && this.enableHover) {
							this.imageHover.draw(0, 0);
						} else {
							this.image.draw(0, 0);
						}
						
						var _fontSize = Math.round(ig.game.fontNameSize*0.6*_DATAGAME.ratioRes * ig.game.fontRatio)
						c.font = ig.game.fontNameWeight + ' ' + _fontSize + 'px ' + ig.game.fontName;
						c.textAlign = 'center';
						c.textBaseline = 'middle';
						c.fillStyle = ig.game.buttonTextColor;
						c.fillText(_STRINGS.Replay.no, this.halfSize.x, this.halfSize.y + ig.game.checkArialOffset(_fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes*_DATAGAME.multiplierOffsetTextButtonBlankSmall));
						c.restore();
					}
				}
	        },

			repos: function () {
				this.pos = {
                    x:this._parent.pos.x - this.halfSize.x,
                    y:this._parent.pos.y - this.halfSize.y + 115*_DATAGAME.ratioRes
                };
			}
		});
	});