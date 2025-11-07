ig.module('plugins.tiered-rv.tiered-rv-popup')
	.requires(
		'plugins.tiered-rv.tiered-rv-game-object'
	)
	.defines(function () {

		ig.TieredRvPopup = ig.TieredRvGameObject.extend({

			main: null,

			img: null,
			icon: null,

			index: 0,

			posOffset: {
				x: 0,
				y: 0
			},
			posOffset_orig: {},
			size: {
				x: 0,
				y: 0
			},
			objAlpha: 0,

			txt: '',
			dur: 0,

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				var _plugin = ig.tieredRV;
				this.dur = _plugin.popup.dur;
				this.img = _plugin.popup.img;
				this.size.x = this.img.width;
				this.size.y = this.img.height;
				this.posOffset = _plugin.popup.posOffset;
				this.posOffset_orig = {
					x: this.posOffset.x,
					y: this.posOffset.y
				};

				this.tween_in();
			},

			tween_in: function () {
				this.posOffset = {
					x: this.posOffset_orig.x,
					y: this.posOffset_orig.y
				};
				this.posOffset.x -= 50;

				var _dur = 0.5;

				this.tween({
					posOffset: {
						x: this.posOffset_orig.x,
						y: this.posOffset_orig.y
					}
				}, _dur, {
					easing: ig.Tween.Easing.Exponential.EaseOut
				}).start();

				this.tween({
					objAlpha: 1
				}, _dur, {
					easing: ig.Tween.Easing.Exponential.EaseOut
				}).start();

				var _window = ig.game.getEntitiesByType(ig.TieredRvWindow)[0];
				if(ig.game.windowName == 'lootbox') {
					_window = ig.game.getEntitiesByType(ig.TieredRvStarterWindow)[0];
				}
				_window.enable_buttons(false);
			},

			tween_out: function () {
				this.posOffset = {
					x: this.posOffset_orig.x,
					y: this.posOffset_orig.y
				};
				var _targ = {
						x: this.posOffset_orig.x + 50,
						y: this.posOffset_orig.y
					},
					_dur = 0.5;

				this.tween({
					posOffset: _targ
				}, _dur, {
					easing: ig.Tween.Easing.Exponential.EaseOut,
					onComplete: function () {
						var _window = ig.game.getEntitiesByType(ig.TieredRvWindow)[0];
						if(ig.game.windowName == 'lootbox') {
							_window = ig.game.getEntitiesByType(ig.TieredRvStarterWindow)[0];
						}
						_window.enable_buttons(true);
						_window.update_panel_buttons_status();

						this.kill();
					}.bind(this)
				}).start();

				this.tween({
					objAlpha: 0
				}, _dur, {
					easing: ig.Tween.Easing.Exponential.EaseOut
				}).start();
			},

			update: function () {
				this.parent();

				this.pos = {
					x: ig.game.midX - (this.size.x / 2) + this.posOffset.x,
					y: ig.game.midY - (this.size.y / 2) + this.posOffset.y
				};

				this.dur -= ig.system.tick;
				if (this.dur <= 0) {
					this.tween_out();
				}
			},

			draw: function () {
				this.parent();

				var ctx = ig.system.context;
				ctx.save();
				ctx.globalAlpha = this.objAlpha;

				this.img.drawImage(
					this.pos.x, this.pos.y,
					this.size.x, this.size.y
				);

				var _plugin = ig.tieredRV;

				ctx.font = _plugin.popup.txtFont;
				ctx.fillStyle = _plugin.popup.txtFillStyle;
				ctx.textAlign = 'center';
				ctx.fillText(
					this.txt,
					this.pos.x + _plugin.popup.txtPosOffset.x,
					this.pos.y + _plugin.popup.txtPosOffset.y
				);

				ctx.globalAlpha = 1;
				ctx.restore();
			}
		});
	});