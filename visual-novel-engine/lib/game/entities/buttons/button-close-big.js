ig.module('game.entities.buttons.button-close-big')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonCloseBig = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.buttonCloseBig,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.buttonCloseBig),
			defsize: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},
			size: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
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
					x:25,
					y:25
				};
			}
		});
	});