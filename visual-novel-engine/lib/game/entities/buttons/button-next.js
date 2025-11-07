ig.module('game.entities.buttons.button-next')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonNext = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			zIndex:_DATAGAME.zIndexData.buttonNext,
			gap:{x:0, y:0},
			image:new ig.Image(_RESOURCESINFO.image.btnNext),
			defsize: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},
			size: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},
			scaleSize:1,

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				this.size.x *= this.scaleSize;
				this.size.y *= this.scaleSize;

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
				this._parent.pageNow++;
				if(this._parent.pageNow > this._parent.totalPage) this._parent.pageNow = 1;
				this._parent.loadPage();
			},

			clicked:function(){
				if(this.visible && this.isClickable) {
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();

					if(this.onClicked) this.onClicked();
				}
			},

			draw:function() {
            	this.parent();
            
	            if(this._parent.visible) {
	            	if(this.visible) {
			            var c = ig.system.context;
						c.save();
						c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
						this.image.draw(0, 0, 0, 0, this.image.width, this.image.height, this.size.x, this.size.y);
						c.restore();
					}
				}
	        },

			repos: function () {
				this.pos = {
					x:this._parent.pos.x - this.halfSize.x + 305*_DATAGAME.ratioRes,
					y:this._parent.pos.y - 15*_DATAGAME.ratioRes
				};
			}
		});
	});