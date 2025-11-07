ig.module('game.entities.buttons.button-more-games')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonMoreGames = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			gravityFactor: 0,
			animSheet: new ig.AnimationSheet(_RESOURCESINFO.image.btnMoreGames, 98*_DATAGAME.ratioRes, 96*_DATAGAME.ratioRes),
			size: {
				x: 98*_DATAGAME.ratioRes,
				y: 96*_DATAGAME.ratioRes,
			},
			zIndex: _DATAGAME.zIndexData.buttonMoreGames,
			clickableLayer: null,
			link: null,
			newWindow: false,
			div_layer_name: "more-games",
			name: "moregames",
			init: function (x, y, settings) {
				this.parent(x, y, settings);

				if (ig.global.wm) {
					return;
				}

				if (!_SETTINGS.MoreGames.Enabled) {
					this.kill();
					return;
				}

				if (settings.div_layer_name) {
					this.div_layer_name = settings.div_layer_name;
				} else {
					this.div_layer_name = 'more-games'
				}

				if (_SETTINGS.MoreGames.Link) {
					this.link = _SETTINGS.MoreGames.Link;
				}

				if (_SETTINGS.MoreGames.NewWindow) {
					this.newWindow = _SETTINGS.MoreGames.NewWindow;
				}

				this.addAnim("idle", 1, [0], true);

				this.clickableLayer = new ClickableDivLayer(this);
				this.repos();
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
			},
			repos: function () {
				var x = ig.system.width - this.size.x - 30*_DATAGAME.ratioRes - 98*_DATAGAME.ratioRes,
					y = 25;
				// if(!_DATAGAME.loadBackgroundMusic) {
				// 	x = ig.system.width - this.size.x - 25;
				// }
				this.pos.x = x + ig.game.screen.x;
				this.pos.y = y + ig.game.screen.y;
				this.clickableLayer && this.clickableLayer.updatePos(x, y);

				// this.textX = x + this.size.x / 2;
				// this.textY1 = y + this.size.y / 2 - 14;
				// this.textY2 = this.textY1 + 36;
			}
		});
	});