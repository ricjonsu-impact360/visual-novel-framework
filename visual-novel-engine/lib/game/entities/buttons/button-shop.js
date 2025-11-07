ig.module('game.entities.buttons.button-shop')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonShop = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.miniButton,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.btnShop),
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
			alphaNow:1,

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
				this._parent._parent.uiShop.show();
			},

			clicked:function(){
				if(this.visible && this.isClickable && this._parent.isShop && !ig.game.isPauseSetting && (ig.game.transition == null || !ig.game.transition.isRunning)) { // && this._parent.enableButton
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();
				}
			},

			draw:function() {
            	this.parent();
            
	            if(this.visible && this._parent.isShop) {
		            var c = ig.system.context;
					c.save();
					c.globalAlpha = this.alphaNow;
					c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
					this.image.draw(0, 0);
					c.restore();
				}
	        },

			repos: function () {
				if(ig.game.windowName == 'game' && _DATAGAME.dialogStyle.toLowerCase() == 'rectangle') { // && ig.game.currentWindow.optionType == 'normal'
					this.pos.x = ig.system.width - this.size.x - 25;
					this.pos.y = 25 + this.size.y + 25;
				} else {
					this.pos.x = 25;
					this.pos.y = 25;
				}
				// this.pos.x = ig.game.midX - 355*_DATAGAME.ratioRes;
				// this.pos.y = ig.system.height-11*_DATAGAME.ratioRes-this.size.y;
			}
		});
	});