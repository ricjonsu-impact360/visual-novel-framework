ig.module('game.entities.buttons.button-auto')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonAuto = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.miniButton,
			gap:{x:0, y:0},
			// image:new ig.Image(_BASEPATH.ui + _DATAGAME.uiTheme + '/btn-home.png'),
			imageAutoOff:new ig.Image(_RESOURCESINFO.image.btnAuto),
			imageAutoOn:new ig.Image(_RESOURCESINFO.image.btnAuto2),
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
					ig.soundHandler.sfxPlayer.play('click');

					ig.game.dialogAutoStatus = (ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_AUTO) ? ig.game.STAT_DIALOG_NORMAL : ig.game.STAT_DIALOG_AUTO;
					ig.game.setAutoDialog();
					
					this.sinkingEffect();

					ig.game.currentWindow.delayClickButton();

					this.repos();
				}
			},

			draw:function() {
            	this.parent();
            
	            if(this.visible && ig.game.showMiniButton) {
		            var c = ig.system.context;
					c.save();
					c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
					// console.log(ig.game.dialogAutoStatus);
					if(ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_AUTO) this.imageAutoOn.draw(0, 0);
					else  this.imageAutoOff.draw(0, 0);

					c.font = Math.round(_DATAGAME.miniButton.fontSize*_DATAGAME.ratioRes * ig.game.fontRatio) + 'px ' + ig.game.fontName;
					c.textAlign = 'center';
					c.textBaseline = 'bottom';

					if(_DATAGAME.miniButton.outlineColor != 'none' && _DATAGAME.miniButton.outlineColor != '') {
						c.strokeStyle = _DATAGAME.miniButton.outlineColor;
						c.lineWidth = 5*_DATAGAME.ratioRes;
						c.lineCap = "round";
						c.lineJoin = 'round'; //bevel / round / miter
						c.strokeText(_STRINGS.Button.auto, this.halfSize.x, this.size.y + _DATAGAME.miniButton.textOffset.y*_DATAGAME.ratioRes);
					}

					c.fillStyle = _DATAGAME.miniButton.textColor;
					c.fillText(_STRINGS.Button.auto, this.halfSize.x, this.size.y + _DATAGAME.miniButton.textOffset.y*_DATAGAME.ratioRes);

					c.restore();
				}
	        },

			repos: function () {
				this.pos.x = ig.system.width - this.size.x - 25;
				if(!ig.game.openMiniButton) {
					this.pos.y = -this.size.y*2;
				} else {
					if(ig.game.currentWindow.isShowingButtonShop) {
						// this.pos.y = 25 + (this.size.y + _DATAGAME.miniButton.padding.y)*2;
						this.pos.y = 25 + this.size.y + (_DATAGAME.miniButton.padding.y+this.size.y)*(ig.game.listMiniButton.indexOf('auto') + 1) + _DATAGAME.miniButton.padding.y;
					} else {
						this.pos.y = 25 + this.size.y + (_DATAGAME.miniButton.padding.y+this.size.y)*ig.game.listMiniButton.indexOf('auto') + _DATAGAME.miniButton.padding.y;
					}
				}
			}
		});
	});