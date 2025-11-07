ig.module('plugins.tiered-rv.tiered-rv-game-object')
	.requires(
		'impact.entity'
	)
	.defines(function () {

		ig.TieredRvGameObject = ig.Entity.extend({

			main: null,

			isBTN: false,

			img: null,

			isClicking: false,
			isEnabled: true,
			isHidden: false,
			isHover: false,
			isShow: true,
			btnDelay: 0,

			interactable: true,
			hasPressAnim: false,

			size: {
				x: 0,
				y: 0
			},
			scale: {
				x: 1,
				y: 1
			},
			objAlpha: 1,

			anchorObj: null,
			posOffset: null,

			init: function (x, y, settings) {
				this.parent(x, y, settings);
			},

			update: function () {
				this.parent();

				if (this.anchorObj) {
					this.pos = {
						x: this.anchorObj.pos.x + this.posOffset.x,
						y: this.anchorObj.pos.y + this.posOffset.y
					};
				}

				if (!this.isEnabled || this.isHidden || !this.isShow) return;

				if (this.isBTN) {
					if (ig.input.state('click')) {
						this.isHover = this.checkMousePos();
						if (this.isHover) {
							if (!this.isFirstPressed) {
								this.clicked();
								this.isFirstPressed = true;
							}

							this.clicking();
						} else {
							this.isClicking = false;
							this.isFirstPressed = false;

							this.tween({
								scale: {
									x: 1,
									y: 1
								}
							}, 0.5, {
								easing: ig.Tween.Easing.Exponential.EaseOut
							}).start();
						}
					} else {
						if (this.isClicking) {
							this.released();

							this.tween({
								scale: {
									x: 1,
									y: 1
								}
							}, 0.5, {
								easing: ig.Tween.Easing.Exponential.EaseOut
							}).start();
						}
					}

					if (this.btnDelay > 0) this.btnDelay--;
				}
			},

			draw: function () {
				if (!this.isShow) return;

				var ctx = ig.system.context;
				ctx.save();

				if (this.main) {
					if (this.main.objAlpha) this.objAlpha = this.main.objAlpha;
				}

				ctx.globalAlpha = this.objAlpha;

				if (this.img) {
					this.img.drawImage(
						this.pos.x + (this.size.x * (1 - this.scale.x)) / 2,
						this.pos.y + (this.size.y * (1 - this.scale.y)) / 2,
						this.size.x * this.scale.x,
						this.size.y * this.scale.y
					);
				}

				ctx.globalAlpha = 1;
				ctx.restore();
			},

			show: function () {
				this.isShow = true;
			},

			hide: function () {
				this.isShow = false;
			},

			checkMousePos: function () {
				var _pointer = ig.game.io.getClickPos();
				return (_pointer.x > this.pos.x &&
					_pointer.x < this.pos.x + this.size.x &&
					_pointer.y > this.pos.y &&
					_pointer.y < this.pos.y + this.size.y);
			},

			clicked: function () {
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList[ig.tieredRV.soundsID.click]);
			},

			clicking: function () {
				if (!this.isClicking && this.isEnabled && this.isShow && this.btnDelay <= 0) {
					this.isClicking = true;

					this.tween({
						scale: {
							x: 0.9,
							y: 0.9
						}
					}, 0.5, {
						easing: ig.Tween.Easing.Exponential.EaseOut
					}).start();
				}
			},

			released: function () {
				
				if (this.isClicking && this.isEnabled && this.isShow) {
					this.isClicking = false;
					this.isFirstPressed = false;

					this.interact();
					this.btnDelay = 3;
				}
			},

			interact: function () {

			}
		});
	});