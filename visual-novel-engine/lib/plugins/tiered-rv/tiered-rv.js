ig.module('plugins.tiered-rv.tiered-rv')
.requires(
	"plugins.secure-ls",
	'plugins.tiered-rv.tiered-rv-window',
	'plugins.tiered-rv.tiered-rv-starter-window',
	'plugins.tiered-rv.tiered-rv-game-object',
	'plugins.tiered-rv.tiered-rv-tier-panel',
	'plugins.tiered-rv.tiered-rv-popup'
)
.defines(function () {
	ig.TieredRv = ig.Class.extend({
		
		pluginVersion: '1.1.4',
		tierDataVersion: '1',
		
		/*
			USER'S FUNCTIONS LIST:
			- ig.tieredRV.show ();
			- ig.tieredRV.hide ();
			
			- ig.tieredRV.get_tier_is_active (_tierIndex);
			- ig.tieredRV.get_highest_active_tier_index (); - returns the index number of the highest tier unlocked
		*/
		
		//////////// EDITABLE SETTINGS - TIERS DATA AND RV BTN ////////////
		
		// Set the default value of the tiers here
		// cd is in minutes
		tiersData: [
			{name: 'tier1', cd: 1440, timeOfWatch: 0, timeTarg: 0, active: false},
			{name: 'tier2', cd: 1440, timeOfWatch: 0, timeTarg: 0, active: false},
			{name: 'tier3', cd: 1440, timeOfWatch: 0, timeTarg: 0, active: false},
			{name: 'tier4', cd: 1440, timeOfWatch: 0, timeTarg: 0, active: false},
			{name: 'tier5', cd: 1440, timeOfWatch: 0, timeTarg: 0, active: false}
		],

		item: {
			width:530,
			height:111,
			stroke:6,
            strokeColor:'#ffffff',
            color: "#A350EE",
        },

		checkNotif:function() {
			var boolNotif = false;
			for (var i = 0; i < ig.tieredRV.tiersData_cur.length - 1; i++) {
                // this.visible = false;
                if (ig.tieredRV.tiersData_cur[i].active == false) {
                    boolNotif = true;
                    break;
                }
            }
           	return boolNotif;
		},
		
		rv_btn_pressed: function (_btnIndex, _window){
			this.curRVBtn = _btnIndex;
			if(_btnIndex != 5) {
				for (var i = 0; i < _window.panels.length; i++) {
					_window.panels [i].btn.isEnabled = false;
				}
			}
			
			// Insert your API RV code here
			// _btnIndex is the index number of the pressed button

			// Plugin Code
			if(_btnIndex != 5) {
				this.winBox = _window;
				this.winBox.enable_buttons (false);
			} else {
				ig.game.currentWindow.enabledButton(false);
			}

			// Here is a sample API:
			var _apiSample = ig.game.getEntitiesByType (EntityRvSampleControl) [0];
			_apiSample.sample_rv_start (this.rv_end_success.bind (this), this.rv_end_fail.bind (this));

			
			
			// this.rv_end_success();
		},
		
		rv_end_success: function (){
			// Put your extra RV success codes here, use this.curRVBtn to identify the reward

			if(this.curRVBtn == 5) {//option rv
				ig.game.currentWindow.enabledButton(true);
				ig.game.currentWindow.afterRVSuccess();
			} else {
				ig.game.sessionData.coin += ig.tieredRV.tierPanel.rewards[this.curRVBtn];
				ig.game.saveAll();

				// Plugin code
				var _curTime = new Date().getTime();
				var _cdTime = this.tiersData_cur [this.curRVBtn].cd * 60 * 1000;
				
				this.tiersData_cur [this.curRVBtn].timeOfWatch = _curTime;
				this.tiersData_cur [this.curRVBtn].timeTarg = _curTime + _cdTime;
				this.tiersData_cur [this.curRVBtn].active = true;
				
				this.save_data ();
				this.update_panel_buttons_status ();
				if (this.winBox) this.winBox.spawn_popup(this.popup.txtStr_success + ig.tieredRV.tierPanel.rewards[this.curRVBtn] + this.popup.txtStr_coins);
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList[this.soundsID.reward]);
			}
			

			// var prize = this.tiersData[this.curRVBtn].value;
			// // console.log(prize)
			// ig.game.sessionData.plCoins += prize;
			// ig.game.save('plCoins', ig.game.sessionData.plCoins)
			
		},
		
		rv_end_fail: function (){
			// Put your extra RV fail codes here
			
			if(this.curRVBtn == 5) {
				ig.game.currentWindow.enabledButton(true);
				ig.game.currentWindow.afterRVFail();
			} else {
			
				// Plugin code
				this.update_panel_buttons_status ();
				
				if (this.winBox) this.winBox.spawn_popup (this.popup.txtStr_fail);
				
			}

			ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList[this.soundsID.error]);
		},
		
		tier_dur_ends: function (_tierIndex) {
			// This function is called when a tier's duration ends
			
			
			
			// Plugin code
			this.tiersData_cur [_tierIndex].timeOfWatch = 0;
			this.tiersData_cur [_tierIndex].timeTarg = 0;
			this.tiersData_cur [_tierIndex].active = false;
			
			this.save_data ();
			this.update_panel_buttons_status ();
		},
		
		//////////// EDITABLE SETTINGS - UI ////////////
		// Window Settings
		windowBox: {
			img: new ig.Image(_RESOURCESINFO.image.btnBlank2, 604, 1014),
			
			zIndex: _DATAGAME.zIndexData.RVWindow,
			
			titleFont: '50px metroblack',
			titleFillStyle: 'white',
			descFont: '30px metroblack',
			descFillStyle: 'white',
			
			starterTitle: 'Starter Pack',
			starterDesc: 'Take someone to Date Night now!',
			starterDesc2: 'Unlock this special date today',
			strTitle: 'Get More Coins',
			strDesc: 'Watch daily to get more coins!',
			strDesc2: '',
			
			title_posOffset: {x: 300, y: 90},
			desc_posOffset: {x: 300, y: 140},
			desc2_posOffset: {x: 290, y: 125},

			title_starter_posOffset: {x: 300, y: 225},
			desc_starter_posOffset: {x: 300, y: 680},
			desc2_starter_posOffset: {x: 300, y: 720},
			
			closeBtn_img: new ig.Image (_BASEPATH.media +'graphics/tiered-rv/close.png', 60, 60),
			closeBtn_posOffset: {x: 520, y: 25},
			closeBtnStarter_posOffset: {x: 517, y: 159},
		},
		
		// Tier Panel Settings
		tierPanel: {
			tierIcons: [
				new ig.Image (_BASEPATH.media +'graphics/tiered-rv/icon-01.png'),
				new ig.Image (_BASEPATH.media +'graphics/tiered-rv/icon-01.png'),
				new ig.Image (_BASEPATH.media +'graphics/tiered-rv/icon-01.png'),
				new ig.Image (_BASEPATH.media +'graphics/tiered-rv/icon-01.png'),
				new ig.Image (_BASEPATH.media +'graphics/tiered-rv/icon-01.png'),
			],
			str_tierTitles: [
				'TIER 1',
				'TIER 2',
				'TIER 3',
				'TIER 4',
				'TIER 5',
			],
			str_tierDesc: [
				'Get 10k coins',
				'Get 20k coins',
				'Get 35k coins',
				'Get 60k coins',
				'Get 120k coins',
			],

			rewards: [
				10000,
				20000,
				35000,
				60000,
				120000,
			], 
			
			// imgBg: new ig.Image (_BASEPATH.media +'graphics/tiered-rv/panel-bg.png'),
			
			posOffset_firstPanel: {x: 40, y: 210}, // Offset from window box's position
			posOffset_nextPanels: {x: 0, y: 150}, // Offset from first panel's position
			
			posOffset_icon: {x: 11, y: 9}, // Offset of a panel's icon img from panel's position
			
			titleFont: '35px metroblack',
			titleFillStyle: 'white',
			descFont: '27px metroblack',
			descFillStyle: 'white',
			
			title_posOffset: {x: 110, y: 47},
			desc_posOffset: {x: 110, y: 89},
			desc_wrapSize: {x: 220, ySpacing: 22},
		},
		
		// Tier Panel "Watch Video" Button Settings
		tierPanel_btn: {
			img: new ig.Image (_BASEPATH.media +'graphics/tiered-rv/btn-watch-ad.png'),
			imgOff: new ig.Image (_BASEPATH.media +'graphics/tiered-rv/btn-watch-ad-disabled.png'),
			imgActive: new ig.Image (_BASEPATH.media +'graphics/tiered-rv/btn-watch-ad-active.png'),
			size: {x: 200, y: 80},
			
			posOffset: {x: 315, y: 15}, // Offset from parent panel's position
			
			str_get: 'Get it',
			str_watchAd: 'Watch Ad',
			txtFontSize: '25',
			txtFontType: 'metroblack',
			txtFillStyle: 'white',
			txtTimeFillStyle: 'white',
			
			txt_posOffset: {x: 120, y: 50}, // Offset from the button's position
			txtStarter_posOffset: {x: 120, y: 53}, // Offset from the button's position
		},
		
		// Popup Settings
		popup: {
			img: new ig.Image (_BASEPATH.media +'graphics/tiered-rv/popup.png'),

			posOffset: {x: 0, y: 0}, // Offset from screen center, anchored at center
			
			dur: 2.25,
			
			txtFont: '30px metroblack',
			txtFillStyle: '#3F0E77',
			txtPosOffset: {x: 318, y: 62}, // Offset from popup
			
			txtStr_success: 'You have received ',
			txtStr_coins: ' coins!',
			txtStr_fail: 'RV ad has errored. Try again later.',
		},
		
		// Sounds
		soundsID: {
			click: "clickTieredRV",
			reward: "rewardTieredRV",
			error: "errorTieredRV"
		},
		
		//////////// PLUGIN VARIABLES ////////////
		saveName: null,
		
		isShow: false,
		
		tiersData_cur: null,
		curRVBtn: 0,
		
		winBox: null,
		winBox_pos: null,
		
		init: function (){
			this.load_data ();
			
			this.calc_remaining_time ();
		},
		
		update: function (){
			this.calc_remaining_time ();
		},
		
		get_tier_is_active: function (_tierIndex){
			return this.tiersData_cur [_tierIndex].active;
		},
		
		get_highest_active_tier_index: function (){
			for (var i = this.tiersData_cur.length - 1; i >= 0; i--) {
				if (this.tiersData_cur [i].active) {
					return i;
				}
			}
		},
		
		update_panel_buttons_status: function (){
			try {
				var _window = ig.game.getEntitiesByType (ig.TieredRvWindow) [0];
				if(ig.game.windowName == 'lootbox') {
					_window = ig.game.getEntitiesByType(ig.TieredRvStarterWindow)[0];
				}
				if (!_window) return;
			}catch (ex){
				return;
			}
			
			for (var i = 0; i < _window.panels.length; i++) {
				if (i <= 0) {
					this._set_btn_status (_window.panels [i].btn, ((this.tiersData_cur [i].active) ? 'running' : 'clickable'), _window);
				} else {
					if (this.check_past_buttons_status (i) && !this.tiersData_cur [i].active) {
						this._set_btn_status (_window.panels [i].btn, 'clickable', _window);
					} else if (this.tiersData_cur [i].active) {
						this._set_btn_status (_window.panels [i].btn, 'running', _window);
					} else {
						this._set_btn_status (_window.panels [i].btn, 'locked', _window);
					}
				}
			}
		},
		
		check_past_buttons_status: function (_index){
			for (var i = 0; i < _index; i++) {
				if (!this.tiersData_cur [i].active) {
					return false;
				}
			}
			
			return true;
		},
		
		_set_btn_status: function (_btn, _status, _window) {
			var _isEnabled = false;
			switch (_status) {
				case 'clickable': 
					_btn.img = this.tierPanel_btn.img; 
					_isEnabled = true; 
					break;
				case 'running': 
					_btn.img = this.tierPanel_btn.imgActive;
					break;
				case 'locked': 
					_btn.img = this.tierPanel_btn.imgOff;
					break;
			}
			_btn.isEnabled = _isEnabled;
			_btn.status = _status;
		},
		
		save_data: function (){
			var dataString = JSON.stringify(this.tiersData_cur);
			ig.LSTieredRV.set(this.saveName, dataString);
		},
		
		isWindowStorageUsable: function () {
			try {
				window.localStorage.setItem("test", "test");
				window.localStorage.removeItem("test");
				return true;
			} catch (e) {
				return false;
			}
		},
		
		load_data: function (){
			if (!ig.LSTieredRV) {
				if (this.isWindowStorageUsable()) ig.LSTieredRV = new SecureLS({ encodingType: 'aes' });
				else {
					ig.LSTieredRV = {
						get: function (saveName) {
							if (ig[saveName]) return ig[saveName];
							else return ""
						},
						set: function (saveName, dataString) {
							ig[saveName] = dataString;
						}
					}
				}
				this.saveName = this.hash(ig.game.name + "-mjs-tiered-rv-save-data", '').replace("-", "s");
			}
			
			if (!this.saveName){
				this.saveName = this.hash(ig.game.name + "-tiered-rv-data-" + this.tierDataVersion, '').replace("-", "s");
			}
			
			var dataString = ig.LSTieredRV.get(this.saveName);
			
			if (dataString == "") {
				this.clear_data();
			} else {
				this.tiersData_cur = JSON.parse(dataString);
			}
		},
		
		clear_data: function (){
			this.tiersData_cur = this.tiersData;
			this.save_data();
		},
		
		calc_remaining_time: function (){
			var _curTime = new Date ().getTime ();
			
			for (var i = 0; i < this.tiersData_cur.length; i++ ){
				if (this.tiersData_cur [i].active && this.tiersData_cur [i].timeTarg <= _curTime) {
					this.tier_dur_ends (i);
				}
			}
		},
		
		convert_time_text: function (time){
			time /= 1000;
			
			var hours   = Math.floor(time / 3600);
			var minutes = Math.floor((time % 3600) / 60);
			var seconds = Math.floor(time % 60);
			
			if (hours <= 0) 		hours = "";
			else if (hours < 10)    hours = "0" + hours + ":";
			else hours += ":";
			
			if (minutes < 10) 		minutes  = "0" + minutes + ":";
			else minutes += ":";
			
			if (seconds < 10) 		seconds  = "0" + seconds;
			
			return hours + minutes + seconds;
		},
		
		hash: function (s){
			var hash = 0, i, chr;
			if (s.length === 0) return hash;
			for (i = 0; i < s.length; i++) {
				chr = s.charCodeAt(i);
				hash = ((hash << 5) - hash) + chr;
				hash |= 0; // Convert to 32bit integer
			}
			var hexHash = hash.toString(36);
			return hexHash;
		},
		
		draw_text_wrapped: function (ctx, text, x, y, maxWidth, lineHeight){
			var words = text.split(' ');
			var line = '';
			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					ctx.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
				} else {
					line = testLine;
				}
			}
			ctx.fillText(line, x, y);
		}
	});

	ig.Image.inject({
		drawImage: function (sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
			sx = sx ? sx : 0;
			sy = sy ? sy : 0;
			if (arguments.length <= 2) {//if pass 2 vars or fewer
				this.draw(sx, sy)
			} else if (arguments.length <= 4) { // pass 3/4 vars
				sWidth = sWidth ? sWidth : this.width;
				sHeight = sHeight ? sHeight : this.height;
				this.draw(sx, sy, 0, 0, this.width, this.height, sWidth, sHeight);
			} else {//more than 4 vars
				dx = dx ? dx : 0;
				dy = dy ? dy : 0;
				sWidth = sWidth ? sWidth : this.width;
				sHeight = sHeight ? sHeight : this.height;
				dWidth = dWidth ? dWidth : this.width;
				dHeight = dHeight ? dHeight : this.height;
				this.draw(dx, dy, sx, sy, sWidth, sHeight, dWidth, dHeight);
			}
		}
	});
});