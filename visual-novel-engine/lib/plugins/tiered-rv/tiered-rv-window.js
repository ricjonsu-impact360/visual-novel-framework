ig.module('plugins.tiered-rv.tiered-rv-window')
	.requires(
		'plugins.tiered-rv.tiered-rv-game-object'
	)
	.defines(function () {
		ig.TieredRvWindow = ig.TieredRvGameObject.extend({

			main: null,

			panels: [],
			objs: [],

			objAlpha: 0,
			posOrig: {},

			responsive: false,
			respTween: 0,

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				this.zIndex = this.main.windowBox.zIndex;

				this.size.x = this.main.windowBox.img.width;
				this.size.y = this.main.windowBox.img.height;

				this.repos();

				this.btnClose = ig.game.spawnEntity(ig.TieredRvBtnClose, 0, 0, {
					main: this,
					anchorObj: this,
					posOffset: this.main.windowBox.closeBtn_posOffset,
					zIndex: this.zIndex + 1,
					img: this.main.windowBox.closeBtn_img,
					isShow: false,
				});
				this.objs.push(this.btnClose);

				for (var i = 0; i < this.main.tiersData_cur.length; i++) {
					this.panels[i] = ig.game.spawnEntity(ig.TieredRvTierPanel, 0, 0, {
						main: this,
						index: i,
						// bg: this.main.tierPanel.imgBg,
						icon: this.main.tierPanel.tierIcons[i],
						posOffset: ((i === 0) ? this.main.tierPanel.posOffset_firstPanel : ({
							x: this.main.tierPanel.posOffset_firstPanel.x + this.main.tierPanel.posOffset_nextPanels.x * i,
							y: this.main.tierPanel.posOffset_firstPanel.y + this.main.tierPanel.posOffset_nextPanels.y * i
						})),
						posOffset_icon: this.main.tierPanel.posOffset_icon,

						zIndex: this.zIndex + 1,

						btn_posOffset: this.main.tierPanel_btn.posOffset,
						btn_size: this.main.tierPanel_btn.size,
						btn_img: this.main.tierPanel_btn.img,
					});

					this.objs.push(this.panels[i]);
				}

				this.hide_window();
			},

			draw: function () {
				if (!this.isShow) return;

				this.parent();

				var ctx = ig.system.context;
				ctx.save();

				ctx.fillStyle = '#000000';
				ctx.globalAlpha = this.objAlpha * 0.7;

				ctx.fillRect(0, 0, ig.system.width, ig.system.height);
				// ctx.translate(-ig.game.screen.x, -ig.game.screen.y);

				ctx.globalAlpha = this.objAlpha;
				this.main.windowBox.img.draw(this.pos.x, this.pos.y);

				ctx.font = this.main.windowBox.titleFont;
				ctx.fillStyle = this.main.windowBox.titleFillStyle;
				ctx.textAlign = 'center';
				ctx.fillText(
					this.main.windowBox.strTitle,
					this.pos.x + this.main.windowBox.title_posOffset.x,
					this.pos.y + this.main.windowBox.title_posOffset.y
				);

				ctx.font = this.main.windowBox.descFont;
				ctx.fillStyle = this.main.windowBox.descFillStyle;
				ctx.textAlign = 'center';
				ctx.fillText(
					this.main.windowBox.strDesc,
					this.pos.x + this.main.windowBox.desc_posOffset.x,
					this.pos.y + this.main.windowBox.desc_posOffset.y
				);
				ctx.fillText(
					this.main.windowBox.strDesc2,
					this.pos.x + this.main.windowBox.desc2_posOffset.x,
					this.pos.y + this.main.windowBox.desc2_posOffset.y
				);

				ctx.globalAlpha = 1;
				ctx.restore();
			},

			show: function () {
				this.isShow = true;

				for (var i = 0; i < this.objs.length; i++) {
					this.objs[i].show();
				}

				this.objAlpha = 0;
				this.tween({
					objAlpha: 1
				}, 0.5, {
					easing: ig.Tween.Easing.Exponential.EaseOut
				}).start();

				if (this.responsive) {
					this.respTween = -50;
					this.tween({
						respTween: 0
					}, 0.5, {
						easing: ig.Tween.Easing.Exponential.EaseOut
					}).start();
				} else {
					var _targPos = {
						x: this.posOrig.x,
						y: this.posOrig.y
					};
					this.pos = {
						x: this.posOrig.x - 50,
						y: this.posOrig.y
					};
					this.tween({
						pos: _targPos
					}, 0.5, {
						easing: ig.Tween.Easing.Exponential.EaseOut
					}).start();
				}

				this.main.update_panel_buttons_status();
			},

			hide: function () {
				this.tween({
					objAlpha: 0
				}, 0.5, {
					easing: ig.Tween.Easing.Exponential.EaseOut,
					onComplete: function () {
						this.hide_window();
					}.bind(this)
				}).start();

				if (this.responsive) {
					this.respTween = 0;
					this.tween({
						respTween: 50
					}, 0.5, {
						easing: ig.Tween.Easing.Exponential.EaseOut
					}).start();
				} else {
					var _targPos = {
						x: this.posOrig.x + 50,
						y: this.posOrig.y
					};
					this.pos = {
						x: this.posOrig.x,
						y: this.posOrig.y
					};
					this.tween({
						pos: _targPos
					}, 0.5, {
						easing: ig.Tween.Easing.Exponential.EaseOut
					}).start();

				}
			},

			enable_buttons: function (_status) {
				this.btnClose.isEnabled = _status;
				for (var i = 0; i < this.panels.length; i++) {
					this.panels[i].btn.isEnabled = _status;
				}
			},

			hide_window: function () {
				this.isShow = false;
				ig.game.currentWindow.enabledButton(true);

				for (var i = 0; i < this.objs.length; i++) {
					this.objs[i].hide();
				}

				if (this.popup) this.popup.kill();
			},

			update_panel_buttons_status: function () {
				for (var i = 0; i < this.panels.length; i++) {
					if (this.main.tiersData_cur[i].active) {
						this.panels[i].btn.img = this.main.tierPanel_btn.imgActive;
						this.panels[i].btn.isEnabled = false;
					}

					if (this.main.tiersData_cur[i].cd_cur <= 0) {
						this.panels[i].btn.img = this.main.tierPanel_btn.img;
						this.panels[i].btn.isEnabled = true;
					}

					if (i > 0) {
						if (!this.main.tiersData_cur[i - 1].active) {
							this.panels[i].btn.img = this.main.tierPanel_btn.imgOff;
							this.panels[i].btn.isEnabled = false;
						}
					}
				}
			},

			spawn_popup: function (_text) {
				this.popup = ig.game.spawnEntity(ig.TieredRvPopup, 0, 0, {
					txt: _text
				});
			},

			repos: function () {
				this.pos.x = this.posOrig.x = ig.game.midX - this.size.x / 2 //+ ig.game.screen.x;
				this.pos.y = this.posOrig.y = ig.game.midY - this.size.y / 2 //+ ig.game.screen.y;
			}
		});

		ig.TieredRvBtnClose = ig.TieredRvGameObject.extend({
			main: null,

			isBTN: true,

			init: function (x, y, settings) {
				this.parent(x, y, settings);
				this.size.x = this.img.width;
				this.size.y = this.img.height;
			},

			update: function () {
				this.parent();
			},

			interact: function () {
				this.main.hide();
			}
		});
	});