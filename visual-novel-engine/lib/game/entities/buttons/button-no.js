ig.module('game.entities.buttons.button-no')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonNo = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			gravityFactor: 0,
			visible:true,
			image: new ig.Image(_RESOURCESINFO.image.btnBlank4),
			size: {
				x: 300*_DATAGAME.ratioRes,
				y: 76*_DATAGAME.ratioRes,
			},
			zIndex: _DATAGAME.zIndexData.buttonNo,
			clickableLayer: null,
			link: null,
			newWindow: false,
			div_layer_name: "story-collection",
			name: "storycollection",
			init: function (x, y, settings) {
				this.parent(x, y, settings);

				this.halfSize = {
	                x: this.size.x / 2,
	                y: this.size.y / 2
	            }

				if (ig.global.wm) {
					return;
				}

				if (settings.div_layer_name) {
					this.div_layer_name = settings.div_layer_name;
				} else {
					this.div_layer_name = 'story-collection'
				}

				if (_SETTINGS.StoryCollection.Link) {
					this.link = _SETTINGS.StoryCollection.Link;
				}

				if (_SETTINGS.StoryCollection.NewWindow) {
					this.newWindow = _SETTINGS.StoryCollection.NewWindow;
				}

				// this.addAnim("idle", 1, [0], true);

				this.clickableLayer = new ClickableDivLayer(this);
				// this.repos();
				ig.sizeHandler.resizeLayers();
			},

			show: function () {
				var elem = ig.domHandler.getElementById("#" + this.div_layer_name);
				if (elem) {
					ig.domHandler.show(elem);
				}
			},
			hide: function () {
				var elem = ig.domHandler.getElementById("#" + this.div_layer_name);
				if (elem) {
					ig.domHandler.hide(elem);
				}
			},
			draw: function () {
				this.parent();

				if(this._parent.visible) {
	            	if(this.visible) {
			            var c = ig.system.context;
						c.save();
						c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
						this.image.draw(0, 0);
						
						c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.6*_DATAGAME.ratioRes * ig.game.fontRatio) + 'px ' + ig.game.fontName;
						c.textAlign = 'center';
						c.textBaseline = 'middle';
						c.fillStyle = 'white';
						c.fillText(_STRINGS.Replay.no, this.halfSize.x, this.halfSize.y + ig.game.checkArialOffset(_fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes*_DATAGAME.multiplierOffsetTextButtonBlankSmall));
						c.restore();
					}
				}
			},
			repos: function () {
				var x = this._parent.pos.x - this.halfSize.x,
					y = this._parent.pos.y - this._parent.halfSize.y + 309*_DATAGAME.ratioRes;
				
				this.pos.x = x;
				this.pos.y = y;

				this.clickableLayer && this.clickableLayer.updatePos(x, y);


				// this.textX = x + this.size.x / 2;
				// this.textY1 = y + this.size.y / 2 - 14;
				// this.textY2 = this.textY1 + 36;
			}
		});
	});