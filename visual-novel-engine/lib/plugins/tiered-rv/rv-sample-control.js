ig.module('plugins.tiered-rv.rv-sample-control')
	.requires(
		'impact.entity'
	)
	.defines(function () {
		EntityRvSampleControl = ig.Entity.extend({
			ignorePause: true,
			zIndex: 9999999,

			init: function (x, y, settings) {
				this.parent(x, y, settings);
			},

			update: function () {
				this.parent();

				if (this.sampleRV_curDur > 0) {
					this.sampleRV_curDur -= ig.system.tick;

					if (this.sampleRV_curDur <= 0) {
						this.sample_rv_end();
					}
				}
			},

			draw: function () {
				var ctx = ig.system.context;
				ctx.save();

				if (this.sampleRV_curDur > 0) {
					ctx.globalAlpha = 0.25;
					ctx.fillStyle = '#000000';
					ctx.fillRect(0, 0, ig.system.width, ig.system.height);
					ctx.globalAlpha = 1;

					ctx.font = '100px Arial';
					ctx.fillStyle = '#FFFFFF';
					ctx.textAlign = 'center';
					ctx.fillText(
						'Test RV is playing...',
						ig.system.width / 2,
						ig.system.height / 2
					);
				}

				ctx.restore();
			},

			sampleRV_dur: 1, sampleRV_curDur: 0,
			sampleRV_cbSuccess: null, sampleRV_cbFail: null,
			sample_rv_start: function (_callbackSuccess, _callbackFail) {
				this.sampleRV_curDur = this.sampleRV_dur;

				this.sampleRV_cbSuccess = _callbackSuccess;
				this.sampleRV_cbFail = _callbackFail;
			},

			sample_rv_end: function () {
				this.sampleRV_cbSuccess();
				// ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.openFreeChest);
			}
		});
	});