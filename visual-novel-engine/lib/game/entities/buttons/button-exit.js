ig.module('game.entities.buttons.button-exit')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonExit = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			image: new ig.Image(_RESOURCESINFO.image.btnBlank, 384*_DATAGAME.ratioRes, 114*_DATAGAME.ratioRes),
			size: {
				x: 384*_DATAGAME.ratioRes,
				y: 114*_DATAGAME.ratioRes,
			},
			halfSize:null,
			zIndex:_DATAGAME.zIndexData.buttonOnMenu, 

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

			draw:function() {
	            this.parent();
                
                var c = ig.system.context;
				c.save();
				c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
				this.image.draw(0, 0);

				var _fontSize = Math.round(ig.game.fontNameSize*1*_DATAGAME.ratioRes * ig.game.fontRatio)
	            c.font = ig.game.fontNameWeight + ' ' + _fontSize + 'px ' + ig.game.fontName;
				c.textAlign = 'center';
				c.textBaseline = 'middle';
				c.fillStyle = ig.game.buttonTextColor;
				c.fillText(_STRINGS['Button']['exit'], this.halfSize.x, this.halfSize.y + ig.game.checkArialOffset(_fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes));
				
				c.restore();
	        },

	        funcComplete:function() {
	        	this._parent.uiExit.show();
			},

			clicked:function(){
				if(this.visible && this.isClickable && (ig.game.transition == null || !ig.game.transition.isRunning)) {
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();
				}
			},

			clicking:function(){
				
			},

			released:function(){
				// ig.soundHandler.sfxPlayer.play('click');
			},

			repos: function () {
				this.pos.x = ig.game.midX-this.halfSize.x;
				if(_DATAGAME.enableShop) {
					this.pos.y = ig.game.midY+(225+125)*_DATAGAME.ratioRes;
				} else {
					this.pos.y = ig.game.midY+225*_DATAGAME.ratioRes;
				}
			}
		});
	});