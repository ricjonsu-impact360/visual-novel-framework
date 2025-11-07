ig.module(
		'game.main'
	)
	.requires(
		'impact.game',	
		'plugins.packer.packer-plugin',	
		// 'impact.debug.debug',
		//Patches
		"plugins.patches.fps-limit-patch",
		"plugins.patches.timer-patch",
		'plugins.patches.user-agent-patch',
		'plugins.patches.webkit-image-smoothing-patch',
		'plugins.patches.windowfocus-onMouseDown-patch',
		'plugins.patches.input-patch',
		// Data types
		'plugins.data.vector',
		'plugins.data.color-rgb',
		// PLUGINS
		'plugins.pointer',
		'plugins.responsive',
		'plugins.font.font-loader',
		'plugins.handlers.dom-handler',
		'plugins.handlers.size-handler',
		'plugins.handlers.api-handler',
		'plugins.handlers.visibility-handler',
		'plugins.audio.sound-handler',
		'plugins.io.io-manager',
		'plugins.io.storage-manager',
		'plugins.splash-loader',
		'plugins.custom-loader',
		'plugins.tweener',
		'plugins.tween',
		'plugins.tweens-handler',
		'plugins.url-parameters',
		'plugins.director',
		'plugins.impact-storage',
		'plugins.fullscreen',
		'plugins.spriter.spriter',
		'plugins.chat-bubble.chat-bubble-manager',
		'plugins.responsive-keyboard.keyboard',
		'plugins.tiered-rv.tiered-rv',
		'plugins.secure-ls',
		'plugins.freezeframe.freezeframe-plugin',
		'plugins.multilang',	
		'plugins.notification',	
		'plugins.progressbar',	
		// MORE GAMES
		'game.entities.buttons.button-more-games',
		// ENTITIES
		'game.entities.pointer',
		'game.entities.pointer-selector',
		'game.entities.select',

		//add transition
		'game.entities.object.transition',

		// LEVELS		
		'game.levels.menu',
		'game.levels.game',
		'game.levels.preview'
		// 'game.levels.result',
		// 'game.levels.select'
	)
	.defines(function () {
		this.START_OBFUSCATION;
		this.FRAMEBREAKER;

		MyGame = ig.Game.extend({
			name: _GAMESETTING._LOCALSTORAGE_KEY, // Name of the game, used as part of the key name in localstorage
			version: "1.0.0", // Version of game data, used as part of the key name in localStorage
			frameworkVersion: "2.0.2",
			sessionData: {},
			io: null,

			isClickClose:false,
			isPauseSetting:false,

			animDelayed:true,
			
			paused: false,
			tweens: null,
			theme:0, //dress up theme
			currentWindow:null, //entity window now
			isChapterEnd:false, 
			windowName:'menu', 
			windowBefore:'menu', 
			selectedIcon : [ 1, 1, 1, 1, 1, 1 ],
			totalCart : 0,
			photoAnimAnchor:{x:0, y:0},
			paramDurDelay:0,
			datePartner:1,
			transType:1,
			transColor:1,
			dataVoiceOver:null,
			dataSFXLoop:null,
			boolChooseChapter:false,
			isFullScreen:true,
			maxVolume:12,
			prevLang:'en',

			lastBGM:'bgmdefault',

			chapter_list:[],

			autoDialog:false, //TRUE = DIALOG CONTINUE WITHOUT CLICKING, FALSE = LIKE USUAL VN
			delayDialog:2, //TIME DELAY IN SECONDS FOR AUTO DIALOG
			delayTextChat:2, //TIME DELAY IN SECONDS FOR AUTO TEXT CHAT
			mouthTalkingSpeed:0.05, //TIME IN SECONDS INDICATE WHEN TO CHANGE THE MOUTH ANIMATION WHEN TALKING ( SMALLER NUMBER MEANS MORE FAST )
			textDialogSpeed:2, //TEXT DIALOG ANIMATION SPEED IN INTEGER ( START FROM 1, SMALLER NUMBER MEANS MORE FAST )
			textDialogSpeedDef:2, //TEXT DIALOG ANIMATION SPEED IN INTEGER ( START FROM 1, SMALLER NUMBER MEANS MORE FAST )
			
			fontNameWeight:'',
			fontName:'metroblack',
			fontNameThin:'metromed',
			fontNameSize:50,
			buttonTextColor:'white',

			fontBubbleWeight:'',
			fontBubble:'metroblack',
			fontBubbleThin:'metromed',
			fontBubbleSize:30,

			openMiniButton:true, //false
			dialogAutoStatus:0,
			STAT_DIALOG_NORMAL:0,
			STAT_DIALOG_SKIP:1, //SKIP : dialogSpeed = 0.5, autoDialog = true
			STAT_DIALOG_AUTO:2, //AUTO : dialogSpeed = 1, autoDialog = true

			// fontNameScript: ['script', 'script1', 'script2', 'script3', 'script4' ],

			languageOn: true, //ENABLE LANGUAGE, IF OFF DEFAULT IS ENGLISH
			noSpacing: true, //DETECT LANGUAGE HAVE SPACING/NOT, E.G JAPAN & CHINESE HAVE NO SPACING

			// startFresh: false, //CHAPTER STARTED FROM SCENEID 0
			directLoadChapter: 0, //DIRECT LOAD CHAPTER FROM START, 0 = GOING TO HOME FIRST
			startFromSceneID: -1, //CHAPTER STARTED FROM SCENEID STATED, -1 = CONTINUE FROM OLD DATA
			loveGender: 'boy', //CHAPTER STARTED FROM SCENEID STATED, -1 = CONTINUE FROM OLD DATA
			openAllChapter: false, //UNLOCKED ALL CHAPTER

			showGameArea:true, //set this use showGameArea in setting.js

			showShop:false, //set this use enableShop in setting.js
			showCurrency:false, //set this use enableShop in setting.js
			showUI:true, //set this use enableLanguage in setting.js
			showBubbleTextInGame:true, //DIALOG BUBBLE VISIBLITY
			outputBubbleTextToConsole:true, //TEXT DIALOG APPEAR ON CONSOLE
			
			init: function () {
				for(var cLoad =1; cLoad <= _STRINGS.Chapter.title.length - 1; cLoad++) {
					ig.game.statusLoad.push(0);
				}

				this.showShop = _DATAGAME.enableShop;
				this.showCurrency = _DATAGAME.enableCurrency;
				this.languageOn = _DATAGAME.enableLanguage;
				this.isFullScreen = _DATAGAME.enableFullScreen;
				this.showGameArea = _DATAGAME.showGameArea;

				// console.log("show game area : ", _DATAGAME.showGameArea);

				//QUERY
				if(_DATAGAME.enableURLParam) {
					if(getQueryVariable("showGameArea")!=null) {
						this.showGameArea = (getQueryVariable("showGameArea")=='true') ? true : false;
					}
					
					if(getQueryVariable("openAllChapter")!=null) {
						this.openAllChapter = (getQueryVariable("openAllChapter")=='true') ? true : false;
					}
					this.loveGender=(getQueryVariable("loveGender")!=null)?getQueryVariable("loveGender"):'none';
					this.startFromSceneID=(getQueryVariable("startFromSceneID")!=null)?getQueryVariable("startFromSceneID"):this.startFromSceneID;
					this.directLoadChapter=(getQueryVariable("directLoadChapter")!=null)?getQueryVariable("directLoadChapter"):this.directLoadChapter;
					if(getQueryVariable("showBubbleTextInGame")!=null) {
						this.showBubbleTextInGame = (getQueryVariable("showBubbleTextInGame")=='true') ? true : false;
					}

					if(getQueryVariable("autoDialog")!=null) {
						this.autoDialog = (getQueryVariable("autoDialog")=='true') ? true : false;
					}
					// this.autoDialog=(getQueryVariable("autoDialog")!=null)?getQueryVariable("automaticDialog"):this.autoDialog;
					var speedDialog=(getQueryVariable("dialogSpeed")!=null)?getQueryVariable("dialogSpeed"):1;
					this.mouthTalkingSpeed=0.05*speedDialog;
					this.textDialogSpeed=Math.round(this.textDialogSpeedDef*speedDialog);
					this.speedModDialog = speedDialog;

					if(this.autoDialog == true) {  
						if(speedDialog == 1) this.dialogAutoStatus = this.STAT_DIALOG_AUTO;
						else this.dialogAutoStatus = this.STAT_DIALOG_SKIP;
					} 

					//SET DELAY DIALOG BEFORE CONTINUING TO ANOTHER DIALOG
					this.delayDialog = this.textDialogSpeed;
					if(this.dialogAutoStatus == this.STAT_DIALOG_SKIP) this.delayDialog = 0.001;
					this.delayTextChat = this.textDialogSpeed;
				}

				// this.transition.create();
				this.languageSelector = new SelectLanguage({
					// showButton:{
					// 	bg: '#6C7FA2'
					// },
                    onSelected: function(langCode){
                    	ig.game.onLangChange();
						// var charSelector = ig.game.getEntitiesByType(EntityCharacterSelect)[0];
						// if(charSelector){
						// 	charSelector.refreshPlayer(charSelector.currentPlayerId)
						// }
                    },
                });

				ig.tieredRV = new ig.TieredRv();

				this.tweens = new ig.TweensHandler();
				// SERVER-SIDE INTEGRATIONS
				this.setupMarketJsGameCenter();
				// The io manager so you can access ig.game.io.mouse
				this.io = new IoManager();
				// Uses Storage Manager (https://docs.google.com/document/d/14kzaC8yl2QbJzMFEIkIJWviY78GW0Cnz7WF9GRh9Klg)
				this.setupStorageManager();
				this.setupUrlParams = new ig.UrlParameters();
				this.removeLoadingWheel();

				this.checkFont();

				if(!_DATAGAME.isLinearChapter || (_DATAGAME.isLinearChapter && _DATAGAME.linearChapterWithThumbnail)) this.sortChapterList();



				this.finalize();

				// Set volume from sessionData
				ig.soundHandler.bgmPlayer.volume(ig.game.sessionData.music/ig.game.maxVolume);
				ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
			},

			setAutoDialog:function() {
			// 	STAT_DIALOG_NORMAL:0,
			// STAT_DIALOG_SKIP:1, //SKIP : dialogSpeed = 0.5, autoDialog = true
			// STAT_DIALOG_AUTO:2, //AUTO : dialogSpeed = 1, autoDialog = true
				if(_DATAGAME.miniButton.skip == true || _DATAGAME.miniButton.auto == true) {
					var speedDialog = 1;
					switch(this.dialogAutoStatus) {
						case this.STAT_DIALOG_NORMAL :
							this.autoDialog = false;
							speedDialog = 1;
							break;
						case this.STAT_DIALOG_SKIP :
							if(_DATAGAME.miniButton.skip == true) {
								this.autoDialog = true;
								speedDialog = 0.5;
							}
							break;
						case this.STAT_DIALOG_AUTO :
							if(_DATAGAME.miniButton.auto == true) {
								this.autoDialog = true;
								speedDialog = 1;
							}
							break;
					}

					this.autoDialog=(getQueryVariable("autoDialog")!=null)?getQueryVariable("autoDialog"):this.autoDialog;
					speedDialog=(getQueryVariable("dialogSpeed")!=null)?getQueryVariable("dialogSpeed"):speedDialog;

					this.mouthTalkingSpeed=0.05*speedDialog;
					this.textDialogSpeed=Math.round(this.textDialogSpeedDef*speedDialog);
					this.speedModDialog = speedDialog;

					//SET DELAY DIALOG BEFORE CONTINUING TO ANOTHER DIALOG
					this.delayDialog = this.textDialogSpeed;
					if(this.dialogAutoStatus == this.STAT_DIALOG_SKIP) this.delayDialog = 0.001;
					this.delayTextChat = this.textDialogSpeed;

					if(this.windowName == 'game') { 
						ig.game.currentWindow.modWord = this.textDialogSpeed;
					}
				}
			},

			checkArialOffset:function(_fontSize) {
				var offset = 0;
				if(_DATAGAME.defaultFontLang.indexOf(ig.game.languageSelector.selected) >= 0) {
					offset = _fontSize/10;
				}
				return offset;
			},

			getDateNow:function() {
				var _dateString = '';
				var _timeString = '';
				var _dateNow = new Date();
				// var _months = _STRINGS.Save.months;

				_dateString = _dateNow.getDate() + ', ' + _dateNow.getFullYear();
				_timeString = _dateNow.getHours() + ':' + this.addZeroMinuteSecond(_dateNow.getMinutes()) + ':' + this.addZeroMinuteSecond(_dateNow.getSeconds());

				return { month: _dateNow.getMonth(), date : _dateString, time:_timeString };
			},

			addZeroMinuteSecond:function(_digit) {
				if(_digit.toString().length == 1) {
					return '0' + _digit;
				} else {
					return _digit;
				}
			},

			saveDatatoSlot:function(_idxSlot) {
				var _idNow = ig.game.sessionData.saveSlot[_idxSlot].id;

				var _dateNow = this.getDateNow();

				var dataSaveSlot = {
					id : _idNow,
					date : _dateNow.date,
					month : _dateNow.month,
					time : _dateNow.time,
					currentChapter : ig.game.currentWindow.numChapter,
					isReward : ig.game.sessionData.isReward.concat([]),
					unlockChapter : ig.game.sessionData.unlockChapter,
					numChat : ig.game.sessionData.numChat.concat([]),
					lastChatId : ig.game.sessionData.lastChatId.concat([]),
					virtualCurrency1 : ig.game.sessionData.virtualCurrency1,
					virtualCurrency2 : ig.game.sessionData.virtualCurrency2,
					virtualCurrency3 : ig.game.sessionData.virtualCurrency3,
					virtualCurrency4 : ig.game.sessionData.virtualCurrency4,
					virtualCurrency5 : ig.game.sessionData.virtualCurrency5,
					virtualCurrency6 : ig.game.sessionData.virtualCurrency6,
					virtualCurrency7 : ig.game.sessionData.virtualCurrency7,
					virtualCurrency8 : ig.game.sessionData.virtualCurrency8,
					playerName : ig.game.sessionData.playerName,
					dressUpTheme : ig.game.sessionData.dressUpTheme.concat([]),
					dressUpChar : ig.game.sessionData.dressUpChar.concat([]),
					isFlashback : ig.game.sessionData.isFlashback.concat([]),
					flashbackColor : ig.game.sessionData.flashbackColor.concat([]),
					historyLog : {},
					varScript : ig.game.sessionData.varScript.concat([])
				};

				for(var i=1;i<ig.game.sessionData.varScript.length;i++) {
					dataSaveSlot[ig.game.sessionData.varScript[i]] = ig.game.sessionData[ig.game.sessionData.varScript[i]];
				}

				for(var _log in ig.game.sessionData.historyLog) {
					dataSaveSlot.historyLog[_log] = ig.game.sessionData.historyLog[_log].concat([]);
				}
				
				var tempSave = ig.game.sessionData.saveSlot.concat([]);
				tempSave[_idxSlot] = dataSaveSlot;
				ig.game.save("saveSlot", tempSave);

				this.consoleLog("save");
				this.consoleLog(tempSave[_idxSlot]);
			},

			loadDataSlot:function(_idxSlot){
				var dataLoadSlot = ig.game.sessionData.saveSlot[_idxSlot];

				ig.game.sessionData.isReward = dataLoadSlot.isReward.concat([]);
				ig.game.sessionData.unlockChapter = dataLoadSlot.unlockChapter;
				ig.game.sessionData.numChat = dataLoadSlot.numChat.concat([]); 
				ig.game.sessionData.lastChatId = dataLoadSlot.lastChatId.concat([]); 
				ig.game.sessionData.virtualCurrency1 = dataLoadSlot.virtualCurrency1;
				ig.game.sessionData.virtualCurrency2 = dataLoadSlot.virtualCurrency2;
				ig.game.sessionData.virtualCurrency3 = dataLoadSlot.virtualCurrency3;
				ig.game.sessionData.virtualCurrency4 = dataLoadSlot.virtualCurrency4;
				ig.game.sessionData.virtualCurrency5 = dataLoadSlot.virtualCurrency5;
				ig.game.sessionData.virtualCurrency6 = dataLoadSlot.virtualCurrency6;
				ig.game.sessionData.virtualCurrency7 = dataLoadSlot.virtualCurrency7;
				ig.game.sessionData.virtualCurrency8 = dataLoadSlot.virtualCurrency8;
				ig.game.sessionData.playerName = dataLoadSlot.playerName;
				ig.game.sessionData.dressUpTheme = dataLoadSlot.dressUpTheme.concat([]);
				ig.game.sessionData.dressUpChar = dataLoadSlot.dressUpChar.concat([]);
				ig.game.sessionData.isFlashback = dataLoadSlot.isFlashback.concat([]);
				ig.game.sessionData.flashbackColor = dataLoadSlot.flashbackColor.concat([]);
				ig.game.sessionData.historyLog = {};

				for(var _log in dataLoadSlot.historyLog) {
					ig.game.sessionData.historyLog[_log] = dataLoadSlot.historyLog[_log].concat([]);
				}

				for(var i=1;i<ig.game.sessionData.varScript.length;i++) {
					ig.game.sessionData[ig.game.sessionData.varScript[i]] = null;
				}
				
				ig.game.sessionData.varScript = dataLoadSlot.varScript;

				for(var j=1;j<ig.game.sessionData.varScript.length;j++) {
					ig.game.sessionData[ig.game.sessionData.varScript[j]] = dataLoadSlot[ig.game.sessionData.varScript[j]];
				}

				ig.game.numChapter = dataLoadSlot.currentChapter;
                if(ig.game.statusLoad[ig.game.numChapter] == null) { ig.game.statusLoad[ig.game.numChapter] = 0; }

                console.log("load");
				this.consoleLog(dataLoadSlot);
				// console.log(tempSave[_idxSlot]);
			},

			resetAllData:function() {
				ig.game.sessionData.isReward = [ true, true ];
				ig.game.sessionData.unlockChapter = 1;
				ig.game.sessionData.numChat = [ 0, 0 ]; 
				ig.game.sessionData.lastChatId = [ 0, 0 ]; 
				ig.game.sessionData.virtualCurrency1 = 1000;
				ig.game.sessionData.virtualCurrency2 = 0;
				ig.game.sessionData.virtualCurrency3 = 0;
				ig.game.sessionData.virtualCurrency4 = 0;
				ig.game.sessionData.virtualCurrency5 = 0;
				ig.game.sessionData.virtualCurrency6 = 0;
				ig.game.sessionData.virtualCurrency7 = 0;
				ig.game.sessionData.virtualCurrency8 = 0;
				ig.game.sessionData.playerName = _DATAGAME.defaultName;
				ig.game.sessionData.dressUpTheme = [ { now:'amy', last:'amy' } ];
				ig.game.sessionData.dressUpChar = [ { carl:'carl' } ];
				ig.game.sessionData.isFlashback = [false, false];
				ig.game.sessionData.flashbackColor =['white', 'white'];
				ig.game.sessionData.historyLog = {};

				for(var i=1;i<ig.game.sessionData.varScript.length;i++) {
					ig.game.sessionData[ig.game.sessionData.varScript[i]] = null;
				}
				
				ig.game.sessionData.varScript=[ 'default' ];

				ig.game.saveAll();
			},

			consoleLog:function(_strLog) {
				if(!_DATAGAME.enableConsoleLog) return;
				
				console.log(_strLog);
			}, 

			onLangChange:function(){
				// ig.merge(ig.Minigame, _STRINGS['Minigames'])
			},

			sortChapterList:function() {
				if(_DATAGAME.isLinearChapter && _DATAGAME.linearChapterWithThumbnail){
					this.chapter_list = ig.game.sortArrayByProp(_STRINGS.chapter_list, 'chapterID', false);
				} else {
					this.chapter_list = ig.game.sortArrayByProp(_STRINGS.chapter_list, 'timestamp');
				}
	        },

	        firstLetterCapslock:function(_string) {
	        	var _first = _string.toLowerCase().substring(0, 1).toUpperCase();
	        	var _last = _string.toLowerCase().substring(1, _string.length);

	        	return (_first + _last);
	        },

			checkFont:function() {
				if(_DATAGAME.ratioLangFont[ig.game.languageSelector.selected] == null){
					this.fontRatio = 1;
				} else {
					this.fontRatio = _DATAGAME.ratioLangFont[ig.game.languageSelector.selected];
				}

				var buttonProp = _DATAGAME.uiColor[_DATAGAME.uiTheme].button;
				var bubbleProp = _DATAGAME.uiColor[_DATAGAME.uiTheme].bubble;

				if(ig.ua.iOS == true) {
					this.fontName = buttonProp.iosfont; 
					this.fontNameThin = buttonProp.iosfontThin; 
					this.fontNameSize = buttonProp.iosfontSize;

					this.fontBubble = bubbleProp.iosfont; 
					this.fontBubbleThin = bubbleProp.iosfontThin; 
					this.fontBubbleSize = bubbleProp.iosfontSize;

					this.fontNameWeight = buttonProp.iosfontWeight;
					this.fontBubbleWeight = bubbleProp.iosfontWeight;
					if(this.fontNameWeight == 'none' || this.fontNameWeight == '' || this.fontNameWeight == null) this.fontNameWeight = '';
					if(this.fontBubbleWeight == 'none' || this.fontBubbleWeight == '' || this.fontBubbleWeight == null) this.fontBubbleWeight = '';
				} else {
					if(_DATAGAME.defaultFontLang.indexOf(ig.game.languageSelector.selected) >= 0
						// ig.game.languageSelector.selected === 'ru' || ig.game.languageSelector.selected === 'jp' || 
						// ig.game.languageSelector.selected === 'cn' || ig.game.languageSelector.selected === 'tw' || 
						// ig.game.languageSelector.selected === 'kr' 
					) {
						this.fontName = buttonProp.langfont; 
						this.fontNameThin = buttonProp.langfontThin; 
						this.fontNameSize = buttonProp.langfontSize; 

						this.fontBubble = bubbleProp.langfont; 
						this.fontBubbleThin = bubbleProp.langfontThin; 
						this.fontBubbleSize = bubbleProp.langfontSize;

						this.fontNameWeight = buttonProp.langfontWeight;
						this.fontBubbleWeight = bubbleProp.langfontWeight;
						if(this.fontNameWeight == 'none' || this.fontNameWeight == '' || this.fontNameWeight == null) this.fontNameWeight = '';
						if(this.fontBubbleWeight == 'none' || this.fontBubbleWeight == '' || this.fontBubbleWeight == null) this.fontBubbleWeight = '';
					} 
					else { 
						this.fontName = buttonProp.font; 
						this.fontNameThin = buttonProp.fontThin; 
						this.fontNameSize = buttonProp.fontSize; 

						this.fontBubble = bubbleProp.font; 
						this.fontBubbleThin = bubbleProp.fontThin; 
						this.fontBubbleSize = bubbleProp.fontSize;

						this.fontNameWeight = buttonProp.fontWeight;
						this.fontBubbleWeight = bubbleProp.fontWeight;
						if(this.fontNameWeight == 'none' || this.fontNameWeight == '' || this.fontNameWeight == null) this.fontNameWeight = '';
						if(this.fontBubbleWeight == 'none' || this.fontBubbleWeight == '' || this.fontBubbleWeight == null) this.fontBubbleWeight = '';
					}
				}

				this.buttonTextColor = buttonProp.textColor;
				if(this.buttonTextColor == '' || this.buttonTextColor == null) this.buttonTextColor = 'white';

				this.noSpacing = (_DATAGAME.noSpaceLang.indexOf(ig.game.languageSelector.selected) >= 0) ? true : false;
			},

			checkLang:function() {
				return ig.game.languageSelector.selected;
			},

			tweenDelay:function(_parent, duration, funcComplete) {
				var paramDelay = { dur : 0 };
                var tweenDelay = new ig.TweenDef(paramDelay)
                .to({
	                dur:1000
	            }, 10)
                .delay(duration)
                .easing(ig.Tween.Easing.Linear.EaseNone)
                .onComplete(function() {
                	if(typeof funcComplete === 'function') {
                		funcComplete();
                	} else {
                		_parent[funcComplete]();
                	}
                }.bind(_parent)).start();
            },

			disableButtons:function(){
				for(var a = 0; a < ig.game.entities.length; a++){
	        		var obj = ig.game.entities[a];
	        		obj.inputEnabled = false;
	        	}

	        	if(_SETTINGS['MoreGames']['Enabled']){
	        		if(ig.game.currentWindow.buttons.btnMoreGames && ig.game.currentWindow.buttons.btnMoreGames.exists){
	        			ig.game.currentWindow.buttons.btnMoreGames.hide();
	        		}
	        	}

	        	if(this.isFullScreen){
	        		if(ig.game.windowName == 'menu' && ig.game.currentWindow.buttons.btnFullScreen && ig.game.currentWindow.buttons.btnFullScreen.exists){
	        			ig.Fullscreen.enableFullscreenButton = false;
	        			ig.game.currentWindow.buttons.btnFullScreen.hide();
	        		}
	        	}
			},

			sortArrayByProp:function(_array, _prop, _isDescending){ //descending = bigger to smaller
				if(_isDescending == null) _isDescending = true;

				var sortedEntities = _array.slice().sort(function(a, b) {
					if(_isDescending == true) return b[_prop] - a[_prop];
	                else return a[_prop] - b[_prop];
	            });

	            return sortedEntities;
			},

			frameConvertToHourMinSec:function(timeFrame){
				var result;
				var time = timeFrame / 60;
				var hours = 100;
				var minutes = 100;
				var seconds = 100;
				var miliseconds = 100;
				hours += Math.floor(time / 3600);
				minutes += Math.floor(time / 60);
				seconds += time % 60;
				miliseconds += timeFrame % 60;
				result = hours.toString().substr(1, 2) + ":" + minutes.toString().substr(1, 2) + ":" + seconds.toString().substr(1, 2) + ":" + miliseconds.toString().substr(1, 2);
				return result;
			},

			convertToMinuteSeconds:function(time)	{
				var result;
				var minutes = 100;
				var seconds = 100;
				minutes += Math.floor(time / 60);
				seconds += time % 60;
				result = (minutes).toString().substr(1, 2) + ":" + seconds.toString().substr(1, 2);
				return result;
			},

			removeAllProgressBar:function() {
				if(EntityProgressBar.progressBarArr != null) {
	                for(var j=0;j<EntityProgressBar.progressBarArr.length;j++){
	                    EntityProgressBar.progressBarArr[j].tweenFadeOut();
	                }
	            }
			},

			fadeInWindow:function(toWindow, animType, color) { //, boolFade, animation type, color
				// if(boolFade) {
					if(this.transition == null || !this.transition.isRunning){
						this.removeAllProgressBar();
						ig.game.tweens.removeAll();
						this.disableButtons();
						// this.transColor = (color == null) ? 'black' : color; 
						this.transColor = (color == null) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].basebg : color; 
						this.transType = (animType == null) ? 1 : animType; 
						this.transition = ig.game.spawnEntity('EntityTransition' + this.transType, 0, 0, {_parent: this, transAlpha:0, fill:this.transColor });
						this.transition.close(toWindow);
					}
				// } else {
				// 	ig.game.director.jumpTo(toWindow);
				// }
			},

			fadeOutWindow:function(){
				if(this.transition != null) this.transition.kill();
				this.transition = ig.game.spawnEntity('EntityTransition' + this.transType, 0, 0, {_parent: this, fill:this.transColor });
				this.transition.open();
			},

			fadeOutWindowSplash:function(){
				this.transColor = _DATAGAME.uiColor[_DATAGAME.uiTheme].basebg; 
				ig.game.tweens.removeAll();
				ig.game.director.jumpTo(LevelGame);
				if(this.transition != null) this.transition.kill();
				this.transition = ig.game.spawnEntity('EntityTransition' + this.transType, 0, 0, {_parent: this, fill:this.transColor });
				this.transition.open();
			},

			withoutTransition:function(){
				// ig.game.tweens.removeAll();
				ig.game.director.jumpTo(LevelGame);
				ig.game.currentWindow.startWindow();
				// if(this.transition != null) this.transition.kill();
			},

			initData: function () {
				// Properties of ig.game to save & load
				return this.sessionData = {
					sound: 8,
					music: 8,
					level: 1,
					isReward:[ true, true, true, true, true, true ],
					unlockChapter: 1,
					numChat: [ 0, 0 ], //0
					lastChatId: [ 0, 0 ], //0
					historyLog: {},
					varScript:[ 'default' ],
					virtualCurrency1:1000, 
					virtualCurrency2:0, 
					virtualCurrency3:0, 
					virtualCurrency4:0, 
					virtualCurrency5:0, 
					virtualCurrency6:0, 
					virtualCurrency7:0, 
					virtualCurrency8:0, 
					loveInterest:'boy',
					playerName:'default',
					dressUpTheme:[ { now:'amy', last:'amy' } ],
					dressUpChar: [ { carl:'carl' } ],
					isFlashback: [false, false],
					flashbackColor:['white', 'white'],
					saveSlot:[ { id:1 }, { id:2 }, { id:3 }, { id:4 }, { id:5 }, { id:6 }, { id:7 }, { id:8 }, { id:9 }, { id:10 }, { id:11 }, { id:12 } ],
					isClaimedStarter:false,
					isShowedStarter:false
				};
			},

			pauseGameviaButton:function(_currentButton, _UIName) {
				if(_currentButton.visible && _currentButton.isClickable && (ig.game.transition == null || !ig.game.transition.isRunning)) { // && this._parent.enableButton
					// ig.soundHandler.sfxPlayer.play('click');

					// if(ig.game.dataSFXLoop != null) {
	    //                 ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXLoop.name, ig.game.dataSFXLoop.id);
	    //             }

	    //             if(ig.game.dataSFXText != null) {
		   //              ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXText.name, ig.game.dataSFXText.id);
		   //          }
					
					if(ig.game.windowName == 'game') {
						ig.game.isPauseSetting = true;
						ig.game.currentWindow.canClickStage = false;
						ig.game.pauseGame();
					} else {
						_currentButton.sinkingEffect();
					}

					ig.soundHandler.sfxPlayer.play('click');

					_currentButton._parent[_UIName].show();
				}
			},

			resumeGameviaButton:function(_currentButton) {
				if(_currentButton.visible && _currentButton.isClickable) {
                    ig.soundHandler.sfxPlayer.play('click');
                    
                    _currentButton.sinkingEffect();

                    _currentButton._parent.tweenCloseFalse.stop();
                    ig.game.isClickClose = true;
                    _currentButton._parent.tweenCloseFalse.start();
                    
                    ig.game.isPauseSetting = false;
                    _currentButton._parent.hide();
                    if(ig.game.windowName == 'game') {
                        ig.game.resumeGame();
                        ig.game.currentWindow.canClickStage = true;
                    }
                }
			},

			setupMarketJsGameCenter: function () {
				if (_SETTINGS) {
					if (_SETTINGS['MarketJSGameCenter']) {
						var el = ig.domHandler.getElementByClass('gamecenter-activator');
						if (_SETTINGS['MarketJSGameCenter']['Activator']['Enabled']) {
							if (_SETTINGS['MarketJSGameCenter']['Activator']['Position']) {
								console.log('MarketJSGameCenter activator settings present ....')
								ig.domHandler.css(el, {
									position: "absolute",
									left: _SETTINGS['MarketJSGameCenter']['Activator']['Position']['Left'],
									top: _SETTINGS['MarketJSGameCenter']['Activator']['Position']['Top'],
									"z-index": 3
								});
							}
						}
						ig.domHandler.show(el);
					} else {
						// console.log('MarketJSGameCenter settings not defined in game settings')
					}
				}
			},

			checkVariableFormat:function(_condition, _logicalOperator) {
				
			},

			spawnNotification: function (text, _timeAlive) {
				if(_timeAlive == null) _timeAlive = _DATAGAME.toastBox.timeAlive;

				var _position = ig.system.height * 0.1;

				if(_DATAGAME.toastBox.position.toLowerCase() == 'bottom') _position = ig.system.height * 0.95;
				else if(_DATAGAME.toastBox.position.toLowerCase() == 'center' || _DATAGAME.toastBox.position.toLowerCase() == 'middle') _position = ig.system.height * 0.5;

                ig.game.spawnEntity(EntityNotification, 0, _position, { zIndex: 8500, text: text, timeAlive:_timeAlive, 
                	notifPosition:_DATAGAME.toastBox.position.toLowerCase(),
                	prevPos: {x:ig.system.width * 0.5, y:_position},
                	defPos : {x:ig.system.width * 0.5, y:_position}
                });
            },

			checkConditionFormatting:function(_condition, _logicalOperator) {
				// Map operators to their corresponding functions
				var operators = {
				  "<": function(a, b){ return a < b},
				  ">": function(a, b){ return a > b},
				  "===": function(a, b){ return a === b},
				  "==": function(a, b){ return a == b},
				  "<=": function(a, b){ return a <= b},
				  ">=": function(a, b){ return a >= b},
				  "!=": function(a, b){ return a != b}
				};

				// Evaluate each condition
				var results = _condition.map(function(cond) {
					var _isBoolValue = true;
					// if(cond.value.toString() =='0' || cond.value.toString() == '1') _isBoolValue = false;
					if(typeof cond.value === 'number') _isBoolValue = false;

					// console.log(_isBoolValue + ' ' + cond.value);
					if((cond.value == true || cond.value == false) && _isBoolValue == true) {
						return operators["=="](ig.game.sessionData[cond.type], cond.value);
					} else {
						if(cond.operator == null) cond.operator = "==";

						//ANOTHER VARIABLE
						if(typeof cond.value === 'string') {
							return operators[cond.operator](ig.game.sessionData[cond.type], ig.game.sessionData[cond.value]);
						} else {
							return operators[cond.operator](ig.game.sessionData[cond.type], cond.value);
						}
					}
				});

				// Combine results based on logicalOperator
				var finalResult = _logicalOperator === "AND"
				  ? results.every(function(res) { return res; }) // AND logic: all conditions must be true
				  : results.some(function(res) { return res; }); // OR logic: at least one condition must be true

				// Log result
				if (finalResult) {
				  console.log("result");
				  return true;
				} else {
				  console.log("condition not met");
				  return false;
				}
			},

			drawTextFormat: function (ctx, _configs, _fontConfig, formatTextName) {
	            var configs = _configs;
	            ctx.font = _fontConfig.fontSize + 'px ' + _fontConfig.fontFace;
	            ctx.textAlign = 'left';
	            ctx.textBaseline = _fontConfig.textBaseline;
	            ctx.fillStyle = _fontConfig.fontColor;

	            var startX = 0;
	            var startY = 0;

	            // var startX = this.getStartX(this.notifProperties.longestLineWidth, this.notifProperties.adjustedWidth);
	            // var startY = this.getStartY(this.notifProperties.lines.length * this.lineHeight, this.notifProperties.adjustedHeight, Math.min(this.notifProperties.lines.length, this.maxLines));

	            var noFormat = 0;
	            for (var i = 0; i < configs.textData.textLines.length; i++) {
	                var arrText = configs.textData.textLines[i].split("<>");
	                var widthTextAll = ctx.measureText(configs.textData.textLines[i].replaceAll("<>", "")).width;
	                var widthText = 0;

	                var offsetX=0;
	                if(_fontConfig.textAlign == 'center' && _fontConfig.textAnchor == 'center') offsetX = -widthTextAll/2;

	                for(var j = 0; j < arrText.length; j++) {
	                    var isStrokeText = false;

	                    if(j > 0) {
	                        noFormat++;
	                        widthText += ctx.measureText(
	                            arrText[j-1]).width;
	                    }

	                    if(j + 1 < arrText.length) {
	                        if(arrText[j + 1].substr(0, 1) == "." || arrText[j + 1].substring(0, 1) == "," || arrText[j + 1].substring(0, 1) == "!" || arrText[j + 1].substring(0, 1) == "?") {
	                            if(arrText[j].substr(arrText[j].length - 1, 1) == " ") {
	                                arrText[j] = arrText[j].substr(0, arrText[j].length - 1);
	                            }
	                        }
	                    }

	                    if (noFormat == 0 || (noFormat != 0 && _fontConfig.formatText['formatText' + formatTextName + noFormat].reset != null && this.formatText['formatText' + formatTextName + noFormat].reset == true)) {
	                        ctx.fillStyle = configs.fillStyle;
	                        ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
	                    } else {
	                        // console.log('formatText' + formatTextName + noFormat);
	                        // console.log(this.formatText['formatText' + formatTextName + noFormat]);

	                        if (_fontConfig.formatText['formatText' + formatTextName + noFormat].color == null) {
	                            ctx.fillStyle = configs.fillStyle;
	                        } else {
	                            ctx.fillStyle = _fontConfig.formatText['formatText' + formatTextName + noFormat].color;
	                        }
	                        
	                        if (_fontConfig.formatText['formatText' + formatTextName + noFormat].format != null) {
	                            if(ig.ua.iOS == true) {
	                                if(_fontConfig.formatText['formatText' + formatTextName + noFormat].format.search('bold') == -1) {
	                                    ctx.font = _fontConfig.formatText['formatText' + formatTextName + noFormat].format + " " + configs.fontSize + "px" + " " + configs.fontFamily;
	                                } else {
	                                    var tempFormatText = _fontConfig.formatText['formatText' + formatTextName + noFormat].format.replaceAll('bold', '');
	                                    ctx.font = tempFormatText + " " + configs.fontSize + "px" + " " + configs.fontFamily;
	                                    isStrokeText = true;
	                                }
	                            } else {
	                                ctx.font = _fontConfig.formatText['formatText' + formatTextName + noFormat].format + " " + configs.fontSize + "px" + " " + configs.fontFamily;
	                            }
	                        } else {
	                            ctx.font = configs.fontSize + "px" + " " + configs.fontFamily;
	                        }
	                    }

	                    if(noFormat != 0 && _fontConfig.formatText['formatText' + formatTextName + noFormat].animEffect != null) { // && ig.game.windowName == 'game' && !ig.game.currentWindow.loadSentence
	                        if(_fontConfig.formatText['formatText' + formatTextName + noFormat].animEffect == 'flash') {
	                            if(_fontConfig.formatText['formatText' + formatTextName + noFormat].speed == null) {
	                                _fontConfig.formatText['formatText' + formatTextName + noFormat].speed = 1;
	                            }

	                            if(configs['showFlash' + _fontConfig.formatText['formatText' + formatTextName + noFormat].speed]) {
	                                ctx.fillText(arrText[j],
	                                    startX + widthText + offsetX, 
	                                    startY + i * _fontConfig.lineHeight);
	                                // drawPos.x + widthText,
	                                // drawPos.y + i * configs.textData.fontHeight);
	                            }
	                        }
	                        else if(_fontConfig.formatText['formatText' + formatTextName + noFormat].animEffect == 'shake') {
	                            if(_fontConfig.formatText['formatText' + formatTextName + noFormat].speed == null) {
	                                _fontConfig.formatText['formatText' + formatTextName + noFormat].speed = 1;
	                            }

	                            if(configs['showShake' + _fontConfig.formatText['formatText' + formatTextName + noFormat].speed]) {
	                                ctx.fillText(arrText[j],
	                                    startX + widthText + offsetX + 1, 
	                                    startY + i * _fontConfig.lineHeight);
	                                // drawPos.x + widthText + 1,
	                                // drawPos.y + i * configs.textData.fontHeight);
	                            } else {
	                                ctx.fillText(arrText[j],
	                                    startX + widthText + offsetX - 1, 
	                                    startY + i * _fontConfig.lineHeight);
	                                // drawPos.x + widthText - 1,
	                                // drawPos.y + i * configs.textData.fontHeight);
	                            }
	                        }
	                    } else {
	                        if(isStrokeText) {
	                            ctx.lineCap = "round";
	                            c.lineJoin = 'round'; 
	                            ctx.strokeText(arrText[j],
	                                startX + widthText + offsetX, 
	                                startY + i * _fontConfig.lineHeight);
	                            // drawPos.x + widthText,
	                            // drawPos.y + i * configs.textData.fontHeight);
	                        }
	                        ctx.fillText(arrText[j],
	                            startX + widthText + offsetX, 
	                            startY + i * _fontConfig.lineHeight);
	                            // drawPos.x + widthText,
	                            // drawPos.y + i * configs.textData.fontHeight);
	                    }
	                }
	            }

	            if(configs.counterAnim != 0) {
	                if(configs.counterAnim % 10 == 0) configs.showFlash5 = (configs.showFlash5) ? false : true;
	                if(configs.counterAnim % 20 == 0) configs.showFlash4 = (configs.showFlash4) ? false : true;
	                if(configs.counterAnim % 30 == 0) configs.showFlash3 = (configs.showFlash3) ? false : true;
	                if(configs.counterAnim % 40 == 0) configs.showFlash2 = (configs.showFlash2) ? false : true;
	                if(configs.counterAnim % 50 == 0) configs.showFlash1 = (configs.showFlash1) ? false : true;

	                if(configs.counterAnim % 8 == 0) configs.showShake1 = (configs.showShake1) ? false : true;
	                if(configs.counterAnim % 7 == 0) configs.showShake2 = (configs.showShake2) ? false : true;
	                if(configs.counterAnim % 6 == 0) configs.showShake3 = (configs.showShake3) ? false : true;
	                if(configs.counterAnim % 5 == 0) configs.showShake4 = (configs.showShake4) ? false : true;
	                if(configs.counterAnim % 4 == 0) configs.showShake5 = (configs.showShake5) ? false : true;
	            } 
	            configs.counterAnim++;
	            
	            // ctx.restore();
	        },

			measureLine: function (ctx, textLines) {
	            var metrics = ctx.measureText(textLines[0]);
	            for (var i = 1; i < textLines.length; i++) {
	                var newMetrics = ctx.measureText(textLines[i]);
	                if (newMetrics.width >= metrics.width) {
	                    metrics = newMetrics;
	                }
	            }

	            return metrics;
	        },

			wrapText:function(ctx, text, x, y, maxWidth, lineHeight) {
	            var lines = text.split("<br>");

	            for (var i = 0; i < lines.length; i++) {

	                var words = lines[i].split(' ');
	                var line = '';

	                for (var n = 0; n < words.length; n++) {
	                    var testLine = line + words[n] + ' ';
	                    var metrics = this.measureLine(ctx, testLine);
	                    var testWidth = metrics.width;
	                    if (testWidth > maxWidth && n > 0) {
	                        this.fillText(line, x, y);
	                        line = words[n] + ' ';
	                        y += lineHeight;
	                    }
	                    else {
	                        line = testLine;
	                    }
	                }

	                ctx.fillText(line, x, y);
	                y += lineHeight;
	            }
	        },

	        drawText:function(arrText, fontSize, ctx, x, y, multiply){
	        	if(multiply == null) multiply = 1.1;

                for(var i=0;i<arrText.length;i++) {
                    ctx.fillText(arrText[i], x, y);
                    y += fontSize * multiply;
                }
            }, 

            arrayWordWrapRegex:function(_words, words) {
            	var regex = /[^A-Za-z0-9!@#$%^&*()\-+=\]:;"'<>,.?\/\\]/;

	        	var tempStr = '';
	        	for(var wo=0;wo<_words.length;wo++) {
	        		if(regex.test(_words[wo])){
	        			if(tempStr != '') {
	        				words.push(tempStr);
	        				tempStr = '';
	        			}
	        			words.push(_words[wo]);
	        		} else {
	        			//there is regex character
	        			tempStr += _words[wo];
	        		}
	        	}
            },

            wordWrapLetter: function(text, maxWidth, fontSize, font, preserveWordsFlag) {
	        	if(preserveWordsFlag == null) { preserveWordsFlag = true; }

		        var ctx = ig.system.context;
		        ctx.font = fontSize + "px " + font;

		        var words = text.split(" "); 

		        // if(this.noSpacing) words = text.split("");
		        if(this.noSpacing) {
		        	var _words = text.split("");
		        	words = [];
		        	this.arrayWordWrapRegex(_words, words);
		        }


		        for(var w=words.length-1; w>-1; w--) {
		        	words[w] = words[w].replaceAll("<br>", " <br> ");
		        	var wordsenter = words[w].split(" ");

		        	if(wordsenter.length > 1) {
		        		for(var we=wordsenter.length-1; we>-1;we--) {
		        			if(we == wordsenter.length-1) {
		        				words.splice(w, 1, wordsenter[we]);
		        			}
		        			else {
		        				words.splice(w, 0, wordsenter[we]);
		        			}
		        		}
		        	}
		        } 

		        var line = "";

		        var arr = [];
		        if(words.length == 1){
		            for(var n=0, nl=text.length; n<nl; n++){
		                var testLine = line + text[n];
		                var metrics = ctx.measureText(testLine);
		                var testWidth = metrics.width;

		                if(text[n] == '<br>') {
	                    	arr.push(line);
	                    	line = "";
	                    } else {
			                if (testWidth > maxWidth && n > 0) {
			                    arr.push(line);
			                    line = text[n];
			                }
			                else {
			                    line = testLine;
			                }
			            }
		            }
		            arr.push(line);
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }else{
		            //for each word
		            for(var n=0, nl=words.length; n<nl; n++){
		                //condition for splitting: if word length is too long
		                var metrics = ctx.measureText(line + words[n]);
		                if (!preserveWordsFlag && metrics.width > maxWidth){
		                    //for each character in the word
		                    for(var c=0, cl=words[n].length; c<cl; c++){
		                        var testLine = line + words[n][c];
		                        var metrics = ctx.measureText(testLine);
		                        var testWidth = metrics.width;

		                        if(words[n] == '<br>') {
			                    	arr.push(line);
			                    	line = "";
			                    } else {
			                        if (testWidth > maxWidth && c > 0) {
			                            arr.push(line);
			                            line = words[n][c];
			                        }
			                        else {
			                            line = testLine;
			                        }
			                    }
		                    }
		                    
		                    if(this.noSpacing) {
		                    	line = line;
		                    } else {
			                    line = line + " ";
			                }
		                }else{
		                    var testLine = line + words[n] + " ";
		                    if(this.noSpacing) {
	                			testLine = line + words[n];
	                		}

		                    var metrics = ctx.measureText(testLine);
		                    var testWidth = metrics.width;

		                    if(words[n] == '<br>') {
		                    	arr.push(line);
		                    	line = "";
		                    }
		                    else {
		                     	if (testWidth > maxWidth && n > 0){
			                        arr.push(line);
			                        if(this.noSpacing) {
				                    	line = words[n];
				                    } else {
				                        line = words[n] + " ";
				                    }
			                    }else{
			                        line = testLine;
			                    }
			                }
		                }
		            }
		            arr.push(line);
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }
		        return arr;
		    },

	        wordWrap: function(text, maxWidth, fontSize, font, preserveWordsFlag) {
	        	if(preserveWordsFlag == null) { preserveWordsFlag = true; }

		        var ctx = ig.system.context;
		        ctx.font = fontSize + "px " + font;

		        var words = text.split(" "); 

		        // if(this.noSpacing) words = text.split("");
		        if(this.noSpacing) {
		        	var _words = text.split("");
		        	words = [];
		        	this.arrayWordWrapRegex(_words, words);
		        }

		        var line = "";

		        var arr = [];
		        if(words.length == 1){
		            for(var n=0, nl=text.length; n<nl; n++){
		                var testLine = line + text[n];
		                var metrics = ctx.measureText(testLine);
		                var testWidth = metrics.width;
		                if (testWidth > maxWidth && n > 0) {
		                    arr.push(line);
		                    line = text[n];
		                }
		                else {
		                    line = testLine;
		                }
		            }
		            arr.push(line);
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }else{
		            //for each word
		            for(var n=0, nl=words.length; n<nl; n++){
		                //condition for splitting: if word length is too long
		                var metrics = ctx.measureText(line + words[n]);
		                if (!preserveWordsFlag && metrics.width > maxWidth){
		                    //for each character in the word
		                    for(var c=0, cl=words[n].length; c<cl; c++){
		                        var testLine = line + words[n][c];
		                        var metrics = ctx.measureText(testLine);
		                        var testWidth = metrics.width;
		                        if (testWidth > maxWidth && c > 0) {
		                            arr.push(line);
		                            line = words[n][c];
		                        }
		                        else {
		                            line = testLine;
		                        }
		                    }
		                    
		                    if(this.noSpacing) {
		                    	line = line;
		                    } else {
			                    line = line + " ";
			                }
		                }else{
		                    var testLine = line + words[n] + " ";
		                    if(this.noSpacing) {
	                			testLine = line + words[n];
	                		}

		                    var metrics = ctx.measureText(testLine);
		                    var testWidth = metrics.width;
		                    if (testWidth > maxWidth && n > 0){
		                        arr.push(line);
		                        
		                        if(this.noSpacing) {
			                    	line = words[n];
			                    } else {
			                        line = words[n] + " ";
			                    }
		                    }else{
		                        line = testLine;
		                    }
		                }
		            }
		            arr.push(line);
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }
		        // console.log(arr);
		        return arr;
		    },

		    wordWrapForChatBubble: function(text, maxWidth, fontSize, font, preserveWordsFlag, varFormatText) {
		    	if(preserveWordsFlag == null) { preserveWordsFlag = true; }
		    	var formatTextName = '';

		        var ctx = ig.system.context;
		        ctx.font = fontSize + "px " + font;

		        var words = text.split(" ");
		        var line = "";

		        // if(this.noSpacing) words = text.split("");
		        if(this.noSpacing) {
		        	var _words = text.split("");
		        	words = [];
		        	this.arrayWordWrapRegex(_words, words);
		        }

		        for(var w=words.length-1; w>-1; w--) {
			    	words[w] = words[w].replaceAll("<br>", " <br> ");
			    	var wordsenter = words[w].split(" ");

			    	if(wordsenter.length > 1) {
			    		for(var we=wordsenter.length-1; we>-1;we--) {
			    			if(we == wordsenter.length-1) {
			    				words.splice(w, 1, wordsenter[we]);
			    			}
			    			else {
			    				words.splice(w, 0, wordsenter[we]);
			    			}
			    		}
			    	}
			    } 

		        var allWords = "";

		        var arr = [];

		        var boolStartFormat = false;
		        var tempFormat = '';

		        if(words.length == 1){
		            for(var n=0, nl=text.length; n<nl; n++){
		                var testLine = line + text[n];
		                var metrics = ctx.measureText(testLine);
		                var testWidth = metrics.width;

		                if(text[n] == '<br>') { 
		                	allWords += line + '<br>';
			            	// arr.push(line);
			            	line = "";
			            } else {
			                if (testWidth > maxWidth && n > 0) {
			                	allWords += line + '<br>';
			                    // arr.push(line);
			                    line = text[n];
			                }
			                else {
			                    line = testLine;
			                }
			            }

		                // if (testWidth > maxWidth && n > 0) {
		                // 	allWords += line + '<br>';
		                //     // arr.push(line);
		                //     line = text[n];
		                // }
		                // else {
		                //     line = testLine;
		                // }
		            }
		            allWords += line;
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }else{
		        	var noFormat = 0;
		            //for each word
		            for(var n=0, nl=words.length; n<nl; n++){
		                //condition for splitting: if word length is too long
		                var metrics = ctx.measureText(line + words[n]);
		                if (!preserveWordsFlag && metrics.width > maxWidth){
		                    //for each character in the word
		                    for(var c=0, cl=words[n].length; c<cl; c++){
		                        var testLine = line + words[n][c];

		                        var testLineClean = testLine.replaceAll("<>", "");
		                        
		                        var metrics = ctx.measureText(testLineClean);
		                        var testWidth = metrics.width;

		                        if(words[n] == '<br>') {
		                        	allWords += line + '<br>';
			                    	// arr.push(line);
			                    	line = "";
			                    } else {
			                        if (testWidth > maxWidth && c > 0) {
			                        	allWords += line + '<br>';
			                            // arr.push(line);
			                            line = words[n][c];
			                        }
			                        else {
			                            line = testLine;
			                        }
			                    }

		                        // if (testWidth > maxWidth && c > 0) {
		                        //     arr.push(line);
		                        //     line = words[n][c];
		                        // }
		                        // else {
		                        //     line = testLine;
		                        // }
		                    }
		                    if(this.noSpacing) {
		                    	line = line;
		                    } else {
			                    line = line + " ";
			                }
		                } else {
		                	if(words[n] == "|") {
		                		if(!boolStartFormat) {
		                			noFormat++;
		                			boolStartFormat = true;
		                			tempFormat = '';
		                		} else {
		                			boolStartFormat = false;
		                			var _tempFormat = tempFormat.replaceAll(" ", "").toLowerCase();
		                			if(_tempFormat == 'reset') {
		                				if(varFormatText != null) {
		                					varFormatText["formatText" + noFormat] = JSON.parse('{ "reset":true }');
		                				} else {
			                				ig.game["formatText" + formatTextName + noFormat] = JSON.parse('{ "reset":true }');
			                			}
		                			} else {
		                				if(varFormatText != null) {
		                					varFormatText["formatText" + noFormat] = JSON.parse('{' + tempFormat + '}');
		                				} else {
				                			ig.game["formatText" + formatTextName  + noFormat] = JSON.parse('{' + tempFormat + '}');
				                		}
			                		}
			                		line += '<>';

		                			// console.log("formatText" + formatTextName + noFormat);
		                			// console.log(ig.game["formatText" + formatTextName + noFormat]);
		                		}
		                	} else {
		                		if(boolStartFormat) {
		                			if(!this.noSpacing) {
		                				tempFormat += words[n] + " ";
		                			} else {
			                			tempFormat += words[n];
			                		}
		                		} else {
				                    if(words[n] == "<br>") { 
			                    		allWords += line + '<br>';
					                    line = "";
					                }
					                else {
					                	var testLine = line + words[n] + " ";
				                		if(this.noSpacing) {
				                			testLine = line + words[n];
				                		} 

				                		var testLineClean = testLine.replaceAll("<>", "");

					                    var metrics = ctx.measureText(testLineClean);
					                    var testWidth = metrics.width;	
					                 	if (testWidth > maxWidth && n > 0){
					                 		allWords += line + '<br>';
					                        // arr.push(line);
					                        if(this.noSpacing) {
						                    	line = words[n];
						                    } else {
						                        line = words[n] + " ";
						                    }
					                    }else{
					                        line = testLine;
					                    }
					                }

				                    // if (testWidth > maxWidth && n > 0){
				                    // 	allWords += line + '<br>';
				                    //     // arr.push(line);
				                    //     if(this.noSpacing) {
					                   //  	line = words[n];
					                   //  } else {
					                   //      line = words[n] + " ";
					                   //  }
				                    // }else{
				                    //     line = testLine;
				                    // }
				                }
		                	}
		                    
		                }
		            }
		            // arr.push(line);
		            allWords += line;
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }
		        // console.log(arr);
		        // console.log(allWords);
		        return allWords;
		    },

		    removeFormatDialog: function(text, maxWidth, fontSize, font, preserveWordsFlag) {
		    	if(preserveWordsFlag == null) { preserveWordsFlag = true; }

		    	text = text.replaceAll('<br>', ' ');
		    	text = text.replaceAll('  ', ' ');

		    	text = text.replaceAll("{NAME}", ig.game.sessionData.playerName);

	            for(var name_interest in _STRINGS.dynamic_character) {
	                text = text.replaceAll("{" + name_interest + "}", _STRINGS.dynamic_character[name_interest][ig.game.sessionData.loveInterest]);
	            }

		        var ctx = ig.system.context;
		        ctx.font = fontSize + "px " + font;

		        var words = text.split(" ");
		        var line = "";

		        // if(this.noSpacing) words = text.split("");
		        if(this.noSpacing) {
		        	var _words = text.split("");
		        	words = [];
		        	this.arrayWordWrapRegex(_words, words);
		        }

		        var allWords = "";

		        var arr = [];

		        var boolStartFormat = false;
		        var tempFormat = '';

		        if(words.length == 1){
		            for(var n=0, nl=text.length; n<nl; n++){
		                var testLine = line + text[n];
		                var metrics = ctx.measureText(testLine);
		                var testWidth = metrics.width;

		                if (testWidth > maxWidth && n > 0) {
		                	allWords += line + '<br>';
		                	arr.push(line);
		                    line = text[n];
		                }
		                else {
		                    line = testLine;
		                }
		            }
		            arr.push(line);
		            allWords += line;
		        }else{
		        	var noFormat = 0;
		            //for each word
		            for(var n=0, nl=words.length; n<nl; n++){
		                //condition for splitting: if word length is too long
		                var metrics = ctx.measureText(line + words[n]);
		                if (!preserveWordsFlag && metrics.width > maxWidth){
		                    //for each character in the word
		                    for(var c=0, cl=words[n].length; c<cl; c++){
		                        var testLine = line + words[n][c];

		                        var testLineClean = testLine.replaceAll("<>", "");
		                        
		                        var metrics = ctx.measureText(testLineClean);
		                        var testWidth = metrics.width;

		                        
		                        if (testWidth > maxWidth && c > 0) {
		                        	allWords += line + '<br>';
		                            arr.push(line);
		                            line = words[n][c];
		                        }
		                        else {
		                            line = testLine;
		                        }
		                    }

		                    if(this.noSpacing) {
		                    	line = line;
		                    } else {
			                    line = line + " ";
			                }
		                } else {
		                	if(words[n] == "|") {
		                		if(!boolStartFormat) {
		                			noFormat++;
		                			boolStartFormat = true;
		                			tempFormat = '';
		                		} else {
		                			boolStartFormat = false;
		                			var _tempFormat = tempFormat.replaceAll(" ", "").toLowerCase();
		                			if(_tempFormat == 'reset') {
		                				ig.game["formatText" + noFormat] = JSON.parse('{ "reset":true }');
		                			} else {
			                			ig.game["formatText" + noFormat] = JSON.parse('{' + tempFormat + '}');
			                		}
			                		// line += '<>';
		                			// console.log(ig.game["formatText" + noFormat]);
		                		}
		                	} else {
		                		if(boolStartFormat) {
		                			// if(!this.noSpacing) {
		                			// 	tempFormat += words[n] + " ";
		                			// } else {
			                		// 	tempFormat += words[n];
			                		// }
		                		} else {
				                    
				                	var testLine = line + words[n] + " ";
			                		if(this.noSpacing) {
			                			testLine = line + words[n];
			                		} 

			                		var testLineClean = testLine.replaceAll("<>", "");

				                    var metrics = ctx.measureText(testLineClean);
				                    var testWidth = metrics.width;	
				                 	if (testWidth > maxWidth && n > 0){
				                 		allWords += line + '<br>';
				                        arr.push(line);
				                        if(this.noSpacing) {
					                    	line = words[n];
					                    } else {
					                        line = words[n] + " ";
					                    }
				                    }else{
				                        line = testLine;
				                    }
				                }
		                	}
		                    
		                }
		            }
		            arr.push(line);
		            allWords += line;
		            // ctx.fillText(line, x, y);
	                // y += fontSize;
		        }
		        // console.log(allWords);
		        return arr;
		    },

	        shuffleArray: function (arr) {
                var m = arr.length, t, i;

                // While there remain elements to shuffle…
                while (m) {

                    // Pick a remaining element…
                    i = Math.floor(Math.random() * m--);

                    // And swap it with the current element.
                    t = arr[m];
                    arr[m] = arr[i];
                    arr[i] = t;
                }

                return arr;
            },

            getNumber:function(word) {			
				temp = "";
				var a = [];
				
				for(var i=0;i<word.length;i++) {
					if ((a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]).indexOf(word.substr(i, 1)) > -1) {
						temp += word.substr(i, 1);
					}
				}
				return parseInt(temp);
			},

			getString:function(word) {			
				temp = "";
				var a = [];

				for(var i=0;i<word.length;i++) {
					if ((a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]).indexOf(word.substr(i, 1)) == -1) {
						temp += word.substr(i, 1);
					}
				}
				return temp;
			},

			getHexColor:function(colorStr) {
				if(colorStr.substr(0, 1) != '#') {
				    var a = document.createElement('div');
				    a.style.color = colorStr;
				    var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
				    document.body.removeChild(a);
				    return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
				} else {
					return colorStr;
				}
			},

			hexToRGBA:function(hex, alpha) {
				if(hex.substr(0, 1) != '#') hex = this.getHexColor(hex);

				var r = parseInt(hex.slice(1, 3), 16);
				var g = parseInt(hex.slice(3, 5), 16);
				var b = parseInt(hex.slice(5, 7), 16);

				if(alpha == null)  alpha = 1;

				return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
			},
	
			calculateRandom: function(minValue, maxValue) {
				return (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
			},

			calculateRandomDecimal: function(minValue, maxValue) {
				return (Math.random() * (maxValue - minValue + 1) + minValue);
			},

			calculateDistance:function(x1, y1, x2, y2) {
				return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			},

			finalize: function () {
				this.start();

				ig.sizeHandler.reorient();
			},
			removeLoadingWheel: function () {
				// Remove the loading wheel
				try {
					$('#ajaxbar').css('background', 'none');
				} catch (err) {
					console.log(err)
				}
			},
			showDebugMenu: function () {
				console.log('showing debug menu ...');
				// SHOW DEBUG LINES
				ig.Entity._debugShowBoxes = true;
				// SHOW DEBUG PANELS
				$('.ig_debug').show();
			},
			start: function () {
				// TEST Eg: load level using Director plugin
				this.director = new ig.Director(this, [					
					LevelMenu,
					LevelGame,
					LevelPreview
					// LevelSelect,
					// LevelResult
				]);
				
				// CALL LOAD LEVELS
				ig.soundHandler.bgmPlayer.play("bgmdefault");
				this.director.loadLevel(this.director.currentLevel);
				
				// if(_SETTINGS['Branding']['Splash']['Enabled'] || _SETTINGS['DeveloperBranding']['Splash']['Enabled']) {
					// this.spawnEntity(EntityPointerSelector, 50, 50);
				// }

				// Set volume from sessionData
				ig.soundHandler.bgmPlayer.volume(ig.game.sessionData.music/ig.game.maxVolume);
				ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
			},
			fpsCount: function() {
				if(!this.fpsTimer) {
					this.fpsTimer = new ig.Timer(1);
				}
				if(this.fpsTimer && this.fpsTimer.delta() < 0) {
					if(this.fpsCounter != null) {
						this.fpsCounter++;
					} else {
						ig.game.fps = this.fpsCounter;
						this.fpsCounter = 0;
						this.fpsTimer.reset();
					}
				}
			},
			endGame: function () {
				console.log('End game')
				// IMPORTANT
				ig.soundHandler.bgmPlayer.stop();
				// SUBMIT STATISTICS - USE ONLY WHEN MARKETJS API IS CONFIGURED
				// this.submitStats();
				ig.apiHandler.run("MJSEnd");
			},
			pauseGame: function () {
				ig.Timer.timeScale = 0;
				// ig.system.stopRunLoop.call(ig.system);
				ig.game.tweens.onSystemPause();
				ig.soundHandler.onSystemPause(false);
				console.log('Game Paused');
			},
			resumeGame: function () {
				if (ig.game.isPauseSetting) return;
				
				ig.Timer.timeScale = 1;
				// ig.system.startRunLoop.call(ig.system);
				ig.game.tweens.onSystemResume();
				ig.soundHandler.onSystemResume(false);
				console.log('Game Resumed');
			},
			showOverlay: function (divList) {
				for (i = 0; i < divList.length; i++) {
					if ($('#' + divList[i])) $('#' + divList[i]).show();
					if (document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "visible";
				}
				// OPTIONAL
				//this.pauseGame();
			},
			hideOverlay: function (divList) {
				for (i = 0; i < divList.length; i++) {
					if ($('#' + divList[i])) $('#' + divList[i]).hide();
					if (document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "hidden";
				}
				// OPTIONAL
				//this.resumeGame();
			},
			currentBGMVolume: 1,
			addition: 0.1,
			// MODIFIED UPDATE() function to utilize Pause button. See EntityPause (pause.js)
			update: function () {
				//Optional - to use
				//this.fpsCount();
				if (this.paused) {
					// only update some of the entities when paused:
					this.updateWhilePaused();
					this.checkWhilePaused();
				} else {
					// call update() as normal when not paused
					this.parent();
					/** Update tween time.
					 * TODO I need to pass in the current time that has elapsed
					 * its probably the engine tick time
					 */

					this.tweens.update(this.tweens.now());
					//BGM looping fix for mobile
					// if(ig.ua.mobile && ig.soundHandler) // A win phone fix by yew meng added into ig.soundHandler
					// {
					// 	ig.soundHandler.forceLoopBGM();
					// }
				}
			},
			updateWhilePaused: function () {
				for (var i = 0; i < this.entities.length; i++) {
					if (this.entities[i].ignorePause) {
						this.entities[i].update();
					}
				}
			},
			checkWhilePaused: function () {
				var hash = {};
				for (var e = 0; e < this.entities.length; e++) {
					var entity = this.entities[e];
					if (entity.ignorePause) {
						if (entity.type == ig.Entity.TYPE.NONE && entity.checkAgainst == ig.Entity.TYPE.NONE && entity.collides == ig.Entity.COLLIDES.NEVER) {
							continue;
						}
						var checked = {},
							xmin = Math.floor(entity.pos.x / this.cellSize),
							ymin = Math.floor(entity.pos.y / this.cellSize),
							xmax = Math.floor((entity.pos.x + entity.size.x) / this.cellSize) + 1,
							ymax = Math.floor((entity.pos.y + entity.size.y) / this.cellSize) + 1;
						for (var x = xmin; x < xmax; x++) {
							for (var y = ymin; y < ymax; y++) {
								if (!hash[x]) {
									hash[x] = {};
									hash[x][y] = [entity];
								} else if (!hash[x][y]) {
									hash[x][y] = [entity];
								} else {
									var cell = hash[x][y];
									for (var c = 0; c < cell.length; c++) {
										if (entity.touches(cell[c]) && !checked[cell[c].id]) {
											checked[cell[c].id] = true;
											ig.Entity.checkPair(entity, cell[c]);
										}
									}
									cell.push(entity);
								}
							}
						}
					}
				}
			},

			draw: function () {
				this.parent();

				
				//Optional - to use , debug console , e.g : ig.game.debugCL("debug something");
				//hold click on screen for 2s to enable debug console
				//this.drawDebug();

				// var c = ig.system.context;
				// c.save();
				// c.scale(2, 2);
				// c.restore();

				// COPYRIGHT
				
				this.dctf();
				

				// VERSION
				// this.drawVersion();
			},

			dctf: function () {
				this.COPYRIGHT;
			},

			/**
			 * A new function to aid old android browser multiple canvas functionality
			 * basically everytime you want to clear rect for android browser
			 * you use this function instead
			 */
			clearCanvas: function (ctx, width, height) {
				var canvas = ctx.canvas;
				ctx.clearRect(0, 0, width, height);
				/*
				var w=canvas.width;
				canvas.width=1;
				canvas.width=w;
				*/
				/*
				canvas.style.visibility = "hidden"; // Force a change in DOM
				canvas.offsetHeight; // Cause a repaint to take play
				canvas.style.visibility = "inherit"; // Make visible again
				*/
				canvas.style.display = "none"; // Detach from DOM
				canvas.offsetHeight; // Force the detach
				canvas.style.display = "inherit"; // Reattach to DOM
			},
			drawDebug: function () { //-----draw debug-----
				if (!ig.global.wm) {
					// enable console
					this.debugEnable();
					//debug postion set to top left
					if (this.viewDebug) {
						//draw debug bg
						ig.system.context.fillStyle = '#000000';
						ig.system.context.globalAlpha = 0.35;
						ig.system.context.fillRect(0, 0, ig.system.width / 4, ig.system.height);
						ig.system.context.globalAlpha = 1;
						if (this.debug && this.debug.length > 0) {
							//draw debug console log
							for (i = 0; i < this.debug.length; i++) {
								ig.system.context.font = "10px Arial";
								ig.system.context.fillStyle = '#ffffff';
								ig.system.context.fillText(this.debugLine - this.debug.length + i + ": " + this.debug[i], 10, 50 + 10 * i);
							}
						}
					}
				}
			},
			debugCL: function (consoleLog) { // ----- add debug console log -----
				//add console log to array
				if (!this.debug) {
					this.debug = [];
					this.debugLine = 1;
					this.debug.push(consoleLog);
				} else {
					if (this.debug.length < 50) {
						this.debug.push(consoleLog);
					} else {
						this.debug.splice(0, 1);
						this.debug.push(consoleLog);
					}
					this.debugLine++;
				}
				console.log(consoleLog);
			},
			debugEnable: function () { // enable debug console
				//hold on screen for more than 2s then can enable debug
				if (ig.input.pressed('click')) {
					this.debugEnableTimer = new ig.Timer(2);
				}
				if (this.debugEnableTimer && this.debugEnableTimer.delta() < 0) {
					if (ig.input.released('click')) {
						this.debugEnableTimer = null;
					}
				} else if (this.debugEnableTimer && this.debugEnableTimer.delta() > 0) {
					this.debugEnableTimer = null;
					if (this.viewDebug) {
						this.viewDebug = false;
					} else {
						this.viewDebug = true;
					}
				}
			},

			drawVersion: function () {
				if (typeof (_SETTINGS.Versioning) !== "undefined" && _SETTINGS.Versioning !== null) {
					if (_SETTINGS.Versioning.DrawVersion) {
						var ctx = ig.system.context;
						fontSize = _SETTINGS.Versioning.FontSize,
							fontFamily = _SETTINGS.Versioning.FontFamily,
							fillStyle = _SETTINGS.Versioning.FillStyle

						ctx.save();
						ctx.textBaseline = "bottom";
						ctx.textAlign = "left";
						ctx.font = fontSize + " " + fontFamily || "10px Arial";
						ctx.fillStyle = fillStyle || '#ffffff';
						ctx.fillText("v" + _SETTINGS.Versioning.Version + "+build." + _SETTINGS.Versioning.Build, 10, ig.system.height - 10);
						ctx.restore();
					}
				}
			}
		});

		ig.packer.initPacker(function () {     
			ig.domHandler = null;
			ig.domHandler = new ig.DomHandler();
			ig.domHandler.forcedDeviceDetection();
			ig.domHandler.forcedDeviceRotation();
			//API handler
			ig.apiHandler = new ig.ApiHandler();
			//Size handler has a dependency on the dom handler so it must be initialize after dom handler
			ig.sizeHandler = new ig.SizeHandler(ig.domHandler);
			//Setup the canvas
			var fps = 60;
			if (ig.ua.mobile) {
				ig.Sound.enabled = false;
				ig.main('#canvas', MyGame, fps, ig.sizeHandler.mobile.actualResolution.x, ig.sizeHandler.mobile.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
				ig.sizeHandler.resize();
			} else {
				ig.main('#canvas', MyGame, fps, ig.sizeHandler.desktop.actualResolution.x, ig.sizeHandler.desktop.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
			}
			//VisibilityHandler
			ig.visibilityHandler = new ig.VisibilityHandler();

			//Added sound handler with the tag ig.soundHandler
			ig.soundHandler = null;
			ig.soundHandler = new ig.SoundHandler();
			ig.sizeHandler.reorient();

			
		}.bind(this));

		this.DOMAINLOCK_BREAKOUT_ATTEMPT;
		this.END_OBFUSCATION;
	});

var savedCanvas = {};