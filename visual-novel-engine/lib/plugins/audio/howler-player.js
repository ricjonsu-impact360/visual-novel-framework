ig.module(
	'plugins.audio.howler-player'
).defines(function () {
	HowlerPlayer = ig.Class.extend({
		tagName: "HowlerPlayer",
		playerName:"",

		isMuted: false,

		soundList: {},

		activeSoundList: {},

		init: function (list) {
			var player = this;
			// var folder = "media/audio/";

			for (var soundName in list) {
				var soundPath = list[soundName].path;
				var soundLoopable = !!list[soundName].loop;
				var pathMp3 = soundPath + ".mp3";

				this.soundList[soundName] = new Howl({
					preload:(list[soundName].preload == null) ? false:true,
					src: [pathMp3],
					loop: soundLoopable,
					onend: function(soundId) {
						if (!this._loop) {
							player.unregisterActiveSound(this, soundId);
						}
					}
				});
			}
		},

		addAudioData:function(soundDetail, soundName) {
			var player = this;

			var soundPath = soundDetail.path;
			var soundLoopable = !!soundDetail.loop;
			var pathMp3 = soundPath + ".mp3";

	    	this.soundList[soundName] = new Howl({
				preload:(soundDetail.preload == null) ? false:true,
				src: [pathMp3],
				loop: soundLoopable,
				onend: function(soundId) {
					if (!this._loop) {
						player.unregisterActiveSound(this, soundId);
					}
				}
			});
		},

		loadSound:function(id)
		{
			if(typeof(id) === "object")
			{
				//console.log(id+" exists")		
				id.load();
				return id;
				
			}
			else if(typeof(id) === "string")
			{				
				this.soundList[id].load();
				return id;
				
			}
		},
		

		onStopBGM: function() {
			// var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
			// soundId = parseInt(soundId);
			// if (audio.playing(soundId)) audio.stop(soundId);
			for (var soundId in this.activeSoundList) {
				var audio = this.activeSoundList[soundId];
				this.stop(audio, soundId);				
				this.unregisterActiveSound(audio, soundId);
			}
		},

		onSystemPause: function() {
			for (var soundId in this.activeSoundList) {
				var audio = this.activeSoundList[soundId];
				this.pause(audio, soundId);
			}
		},

		onSystemResume: function() {
			for (var soundId in this.activeSoundList) {
				var audio = this.activeSoundList[soundId];
				this.resume(audio, soundId);
			}
		},

		play: function (soundName) {
			if (!this.isMuted) {
				if(this.playerName.toLowerCase() == 'bgm') {
					this.onStopBGM();
				}
				
				var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
				audio.mute(false);
				var soundId = audio.play();
				this.registerActiveSound(audio, soundId); 

				// this.reCheckBGM();
			}
		},

		// reCheckBGM:function() {
		// 	console.log('check bgm ' + this.playerName);
		// 	if(this.playerName.toLowerCase() == 'bgm') {
		// 		var foundBGM = false;
		// 		var arrActiveList = [];
		// 		for (var soundID in this.activeSoundList) {
		// 			arrActiveList.push(soundID);
		// 		}

		// 		console.log(this.activeSoundList);
		// 		console.log(arrActiveList);

		// 		for (var i = 0; i < arrActiveList.length ; i++) {
		// 			var soundId = arrActiveList[i];
		// 			var audio = this.activeSoundList[soundId];
		// 			var arrSrc = audio._src.split('/');
		// 			var arrBGMName = arrSrc[arrSrc.length - 1].split('.');
		// 			var bgmName = arrBGMName[0].replaceAll('-', '');
		// 		// 	// console.log("play : " + arrBGMName[0]);
		// 			// if(bgmName != ig.game.lastBGM) {
		// 		// 		console.log('tidak sama');
		// 				this.stop(audio, soundId);
		// 				// this.unregisterActiveSound(audio, soundId);
		// 			// } else {
		// 		// 		if(foundBGM == false) {
		// 		// 			foundBGM = true;
		// 		// 		} else {
		// 		// 			this.stop(audio, soundId);
		// 		// 			this.unregisterActiveSound(audio, soundId);
		// 		// 		}
		// 			// }
		// 			console.log("play : " + arrBGMName[0].replaceAll('-', '') + ' ' + ig.game.lastBGM);
		// 		}
		// 	}
		// },

		playSFX: function (soundName, loopable) {
			if (!this.isMuted) {
				var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;

				if(loopable != null) {
					audio._loop = loopable;
				}

				audio.mute(false);
				var soundId = audio.play();
				this.registerActiveSound(audio, soundId);
				return { name:soundName, id:soundId };
			}
		},

		stopSFX: function (soundName, soundId) {
			var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
			soundId = parseInt(soundId);
			if (audio.playing(soundId)) audio.stop(soundId);
			this.unregisterActiveSound(audio, soundId);
		},

		pause: function (soundName, soundId) {
			var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
			soundId = parseInt(soundId);
			if (audio.playing(soundId)) audio.pause(soundId);
		},

		resume: function (soundName, soundId) {
			if (!this.isMuted) {
				var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
				soundId = parseInt(soundId);
				if (!audio.playing(soundId)) audio.play(soundId);
			}
		},

		stop: function (soundName, soundId) {
			var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
			soundId = parseInt(soundId);
			if (audio.playing(soundId)) audio.stop(soundId);
			this.unregisterActiveSound(audio, soundId);
		},

		seek: function (soundName) {
			var audio = typeof (soundName) === "string" ? this.soundList[soundName] : soundName;
			return audio.seek();
		},

		mute: function (fromFocusBlur) {
			if (!fromFocusBlur) this.isMuted = true;
			for (var soundName in this.soundList) {
				var audio = this.soundList[soundName];
				audio.mute(true);
			}
		},

		unmute: function (fromFocusBlur) {
			if (!fromFocusBlur) this.isMuted = false;
			if (!this.isMuted) {
				for (var soundName in this.soundList) {
					var audio = this.soundList[soundName];
					audio.mute(false);
				}
			}
		},

		volume: function (value, soundName) {
			if (typeof value !== "number") {
				console.warn("Argument needs to be a number!");
				return;
			}
			// console.log('volume : ' + value);
			value = value.limit(0, 1);
			if (soundName in this.soundList) {
				var audio = this.soundList[soundName];
				audio.volume(value);
			}
			else {
				for (var soundName in this.soundList) {
					var audio = this.soundList[soundName];
					audio.volume(value);
				}
			}			
		},

		getVolume: function (soundName) {
			var volume = Howler.volume() || 1;
			if (soundName in this.soundList) {
				var audio = this.soundList[soundName];
				if (audio !== null || typeof(audio) !== "undefined") {
					volume = audio.volume();
					return volume;
				}
			}
			else {
				for (var soundName in this.soundList) {
					var audio = this.soundList[soundName];
					if (audio !== null || typeof(audio) !== "undefined") {
						volume = audio.volume();
						return volume;
					}
				}
			}
			return volume;
		},

		registerActiveSound: function(audio, soundId) {
			if (this.activeSoundList === null || typeof(this.activeSoundList) === "undefined") this.activeSoundList = {};
			if (audio === null || typeof(audio) === "undefined") return;

			this.activeSoundList[soundId] = audio;
		},

		unregisterActiveSound: function(audio, soundId) {
			if (this.activeSoundList === null || typeof(this.activeSoundList) === "undefined") this.activeSoundList = [];
			if (audio === null || typeof(audio) === "undefined") return;

			this.activeSoundList[soundId] = null;
			delete this.activeSoundList[soundId];
		}
	});
});