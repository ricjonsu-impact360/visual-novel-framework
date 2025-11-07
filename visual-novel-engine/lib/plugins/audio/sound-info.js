/**
 *  SoundHandler
 *
 *  Created by Justin Ng on 2014-08-19.
 *  Copyright (c) 2014 __MyCompanyName__. All rights reserved.
 */

ig.module('plugins.audio.sound-info')
.requires(
)
.defines(function () {
    SoundInfo = ig.Class.extend({
		/* MP3 ONLY, root folder is media/audio/ */

		sfx: {
			logosplash1: { path: _BASEPATH.media +"audio/opening/logosplash1", preload:true },
			logosplash2: { path: _BASEPATH.media +"audio/opening/logosplash2", preload:true },
			click: { path: _BASEPATH.media +"audio/play/click", preload:true },
			clickTieredRV: { path: _BASEPATH.media +"audio/tiered-rv/click", preload:true },
			rewardTieredRV: { path: _BASEPATH.media +"audio/tiered-rv/reward", preload:true },
			errorTieredRV: { path: _BASEPATH.media +"audio/tiered-rv/error", preload:true },
			freeze1: { path: _BASEPATH.media +"audio/play/freeze1", preload:true },
			freeze2: { path: _BASEPATH.media +"audio/play/freeze2", preload:true },
			notif: { path: _BASEPATH.media +"audio/play/notif", preload:true },
			send: { path: _BASEPATH.media +"audio/play/send", preload:true },
			equip: { path: _BASEPATH.media +"audio/play/equip", preload:true },
			cashier: { path: _BASEPATH.media +"audio/play/cashier", preload:true },
			flash: { path: _BASEPATH.media +"audio/play/flash" },
			camera: { path: _BASEPATH.media +"audio/play/camera" },
			pop: { path: _BASEPATH.media +"audio/play/pop" },
			rewind: { path: _BASEPATH.media +"audio/play/rewind" }
		},
		
		bgm:{
			bgmdefault: { path:_BASEPATH.bgm+_RESOURCESINFO.bgm, loop: true, preload:_DATAGAME.loadBackgroundMusic?true:null }
		}
    });

});
