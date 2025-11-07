ig.module('game.entities.buttons.button-close')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonClose = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.buttonClose,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.buttonExit),
			defsize: {
				x: 60*_DATAGAME.ratioRes,
				y: 60*_DATAGAME.ratioRes,
			},
			size: {
				x: 60*_DATAGAME.ratioRes,
				y: 60*_DATAGAME.ratioRes,
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
				this._parent.hide();

				if(this.onClicked) this.onClicked();
			},

			clicked:function(){
				if(this.visible && this.isClickable) {
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();


				}
			},

			draw:function() {
            	this.parent();
            
	            if(this._parent.visible) {
		            var c = ig.system.context;
					c.save();
					c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
					this.image.draw(0, 0);
					c.restore();
				}
	        },

			repos: function () {
				this.pos = {
					x:this._parent.pos.x + this._parent.halfSize.x - this.size.x - 20*_DATAGAME.ratioRes,
					y:this._parent.pos.y - this._parent.halfSize.y - 60*_DATAGAME.ratioRes - 20*_DATAGAME.ratioRes
				};
			}
		});
	});