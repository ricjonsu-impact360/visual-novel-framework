//character-preview version 1.1.0
var myTimeout = setInterval(changePreview, 500);


function changePreview () {
	try {
		if (ig && ig.game) {
			
			ig.SizeHandler.inject({
			resize:function(){
					this.parent();
					if(ig.game&&ig.game.boyPreview!=null){
						ig.game.boyPreview.spriter.pos.x = ig.game.midX + 350;
						ig.game.girlPreview.spriter.pos.x = ig.game.midX + 350;
					}
				}
			});

			clearInterval(myTimeout);
			characterPreview.initMenu();
		}
	} catch (e) {
		console.log("game is not ready...");
	}
}

var characterPreview = {
	// Panel Opacity Configuration (0.0 to 1.0)
	panelOpacity: 0.8,

	currentCharName: "Amy",
	currentGender: "girl",
	currentBG: "office.png",
	currentAnimation: "ANIM_IDLE",
	currentEmotion: "EMO_NEUTRAL",
	currentShadow:true,
	currentTint:null,
	charData: {},
	duPart: [],
	animationList: [],
	handheldList: [],
	defaultChar: {},
	charPosY: 750,
	charPosX: 0,
	optionList: {},
	dropdownList: {},


	setPanelOpacity: function () {
		var leftPanel = document.getElementById('divDeveloper');
		var rightPanel = document.getElementById('divDeveloperRightPanel');

		if (leftPanel) {
			leftPanel.style.background = 'linear-gradient(135deg, rgba(30,30,40,' + this.panelOpacity + ') 0%, rgba(20,20,30,' + this.panelOpacity + ') 100%)';
		}

		if (rightPanel) {
			rightPanel.style.background = 'linear-gradient(135deg, rgba(30,30,40,' + this.panelOpacity + ') 0%, rgba(20,20,30,' + this.panelOpacity + ') 100%)';
		}
	},

	initMenu: function () {

		this.setDefaultSpriterData(function () {
			ig.game.director.jumpTo(LevelPreview);
			//preset to avoid errors from engine
			ig.game.sessionData.dressUpTheme = [{ now: "amy" }, { now: "amy" }];
			ig.game.currentWindow.numChapter = 1;

			ig.game.boyPreview.spriter.pos.x = ig.game.midX + 350;
			ig.game.girlPreview.spriter.pos.x = ig.game.midX + 350;

			ig.game.boyPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.girlPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.boyPreview.spriter.root.alpha = 0;
			ig.game.girlPreview.charName = "Amy";
			ig.game.boyPreview.changePose("ANIM_IDLE");
			ig.soundHandler.bgmPlayer.volume(0);
			exportFiles.phpFile = "script-converter/script-editor.php";

			this.getFilesFromFolder("../../v2-visual-novel-assets/graphics/backgrounds", function (data) {

				for (var i = 0; i < data.length; i++) {
					// _DATAGAME.BGFileType[data[i]] = 'png';
					var split = data[i].split(".");
					_DATAGAME.BGFileType[split[0]] = split[1];

				}

				this.createDropdownFilter("divCharacter", "Background", "Background :", data, this.changeBackground.bind(this), this.currentBG);
				//                this.createDropdown("divCharacter","Background","Background :",data,this.changeBackground.bind(this),this.currentBG);           
				this.changeBackground("Background", "office.png");


				var options = Object.keys(this.charData);
				options.sort();

				// Create content container inside divDeveloperRightPanel
				var rightPanel = document.getElementById("divDeveloperRightPanel");
				var contentDiv = document.createElement("div");
				contentDiv.id = "divDeveloperRight";
				rightPanel.appendChild(contentDiv);

				// Create toggle button for the right panel content
				this.createShowHide("divDeveloperRight", "divDeveloperRightPanel", false);
				this.createLabel("divDeveloperRight", "speakerName", "Speaker box colors");
				this.createColorPick("divDeveloperRight", "bgName", "bgName :", this.changeColors.bind(this));
				this.createColorPick("divDeveloperRight", "textName", "textName :", this.changeColors.bind(this));
				this.createColorPick("divDeveloperRight", "outlineName", "outlineName :", this.changeColors.bind(this),true,true);
				// this.createButton("colorpickoutlineName", "btnNoneOutline", "Set None", this.setNoneOutline.bind(this), false);
				this.createButton("divDeveloperRight", "btnDeleteAll", "Delete All", this.deleteAllNameProperties.bind(this));
				this.createLabel("divDeveloperRight", "deleteDesc", "*Delete name properties for all characters", "small");

				this.createDiv(null,"AudioPreview","divDeveloper",`
					z-index: 3;
					position: fixed;
					right: 10px;
					bottom: 10px;
				`);
				this.createButton("divAudioPreview","btnAudioPreview","Go to Audio Preview",this.toAudioPreview.bind(this),false);

				this.createDropdownFilter("divCharacter", "character", "Character Name :", options, this.changeCharacter.bind(this), this.currentCharName);
				this.createDropdown("divCharacter", "characterType", "Character Type :", ["dynamic_character", "neutral_boy", "neutral_girl", "outfit"], this.changeType.bind(this), "dynamic_character");
				this.setValueDropdown("characterType", "none");

				// this.hideDressUP();
				this.createShowHide("divDressUp");
				this.createDropdown("divDressUp", "gender", "Gender :", ["girl", "boy"], this.changeGender.bind(this), this.currentGender);
				this.createButton("divDressUp", "btnRandom", "Random Character", this.randomCharacter.bind(this));
				this.createButton("btnbtnRandom", "btnSetNone", "Set None Dress Up", this.setNoneDressUp.bind(this), false);

				this.loadPartAssets();
				this.loadAnimation();
				this.changeCharacter("character", this.currentCharName);
			}.bind(this));
		}.bind(this));

		this.setPanelOpacity();

	},
	toAudioPreview:function(){
		window.location.href = 'audio-previewer.html';
	},
	setNoneoutlineName: function () {
		this.changeColors("outlineName", "none");
	},
	exportCharacterData: function () {
		var characterData = this.charData[this.currentCharName];
		var exportData = {
			bgName: characterData.bgName,
			textName: characterData.textName,
			outlineName: characterData.outlineName,
			girl: characterData.girl,
			boy: characterData.boy
		};

		var jsonString = JSON.stringify(exportData, null, 2);
		console.log(jsonString);
		Swal.fire({
			icon: 'success',
			title: 'Data Exported!',
			text: 'Character data has been logged to the console.'
		});
	},

	showImportModal: function () {
		Swal.fire({
			title: 'Import Character Data',
			html: '<textarea id="swal-import-data" class="swal2-textarea" placeholder="Paste your JSON/Object data here..." style="height: 200px;"></textarea>',
			focusConfirm: false,
			preConfirm: () => {
				return document.getElementById('swal-import-data').value;
			}
		}).then((result) => {
			if (result.isConfirmed) {
				this.importCharacterData(result.value);
			}
		});
	},

	importCharacterData: function (jsonString) {
		if (!jsonString) {
			console.log("No data pasted");
			return;
		}

		try {
			var importedData = JSON.parse(jsonString);

			// Update properties
			if (this.charData[this.currentCharName]) {
				this.charData[this.currentCharName].bgName = importedData.bgName;
				this.charData[this.currentCharName].textName = importedData.textName;
				this.charData[this.currentCharName].outlineName = importedData.outlineName;

				// Update girl properties
				if (importedData.girl) {
					for (var key in importedData.girl) {
						if (importedData.girl.hasOwnProperty(key)) {
							this.charData[this.currentCharName].girl[key] = importedData.girl[key];
						}
					}
				}

				if (importedData.boy) {
					for (var key in importedData.boy) {
						if (importedData.boy.hasOwnProperty(key)) {
							this.charData[this.currentCharName].boy[key] = importedData.boy[key];
						}
					}
				}

				// Refresh UI
				this.setValueDropdown('bgName', importedData.bgName);
				this.setValueDropdown('textName', importedData.textName);
				this.setValueDropdown('outlineName', importedData.outlineName);

				if (importedData.girl && this.currentGender == "girl") {
					for (var key in importedData.girl) {
						this.setValueDropdown(key, importedData.girl[key]);
					}
				}

				if (importedData.boy && this.currentGender == "boy") {
					for (var key in importedData.boy) {
						this.setValueDropdown(key, importedData.boy[key]);
					}
				}

				this.changeAllDU();
				// enable if you want to save after importing, but I don't recommend it
				// this.saveCharacter();
			}

		} catch (e) {
			console.error("Error parsing JSON string:", e);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Invalid JSON data!'
			});
		}
	},
	showLoading: function (text = 'Loading...') {
		var loadingOverlay = document.getElementById('loadingOverlay');
		if (loadingOverlay) return; // Prevent multiple overlays

		loadingOverlay = document.createElement('div');
		loadingOverlay.id = 'loadingOverlay';
		loadingOverlay.style.position = 'fixed';
		loadingOverlay.style.top = '0';
		loadingOverlay.style.left = '0';
		loadingOverlay.style.width = '100%';
		loadingOverlay.style.height = '100%';
		loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		loadingOverlay.style.color = 'white';
		loadingOverlay.style.display = 'flex';
		loadingOverlay.style.justifyContent = 'center';
		loadingOverlay.style.alignItems = 'center';
		loadingOverlay.style.zIndex = '10000';
		loadingOverlay.style.fontSize = '2em';
		loadingOverlay.innerHTML = `<div style="text-align: center;">${text}<br><span style="font-size: 0.5em;">Please wait...</span></div>`;
		document.body.appendChild(loadingOverlay);
	},

	hideLoading: function () {
		var loadingOverlay = document.getElementById('loadingOverlay');
		if (loadingOverlay) {
			loadingOverlay.parentNode.removeChild(loadingOverlay);
		}
	},
	deleteAllNameProperties: function () {
		for (charName in this.charData) {
			delete this.charData[charName]["bgName"];
			delete this.charData[charName]["textName"];
			delete this.charData[charName]["outlineName"];

			_DATAGAME.spriterData[charName] = this.charData[charName];
		}

		this.saveCharacter();
	},

	createShowHide: function (divName, parent, isAppend = false) {
		var myParent = document.getElementById("divDeveloper");
		if (parent) myParent = document.getElementById(parent);

		var divShow = document.getElementById(divName);
		var div = document.createElement("div");
		var name = divName.substr(3);
		div.id = "divToggle" + name;
		divShow.style.display = "block";
		div.innerHTML = "▼ Hide " + name;
		div.style.cssText = `
			cursor: pointer;
			padding: 10px 15px;
			margin: 10px 0;
			background: rgba(255,255,255,0.05);
			border-radius: 6px;
			border: 1px solid rgba(255,255,255,0.1);
			font-weight: 500;
			font-size: 13px;
			letter-spacing: 0.5px;
			transition: all 0.2s ease;
		`;
		div.onmouseenter = function () {
			this.style.background = "rgba(255,255,255,0.1)";
		};
		div.onmouseleave = function () {
			this.style.background = "rgba(255,255,255,0.05)";
		};
		div.onclick = function () {
			if (divShow.style.display === "none" || divShow.style.display == "") {
				divShow.style.display = "block";
				div.innerHTML = "▼ Hide " + name;
			} else if (divShow.style.display === "block") {
				divShow.style.display = "none";
				div.innerHTML = "▶ Show " + name;
			}
		}.bind(this);
		if (isAppend == true) {
			myParent.appendChild(div);
		} else
			myParent.insertBefore(div, divShow);
	},
	changeType: function (varName, value) {
		this.charData[this.currentCharName].type = value;
		this.checkType();
		this.showDressUP();
	},
	hideDressUP: function () {
		document.getElementById("divDressUp").style.display = "none";
	},
	showDressUP: function () {
		document.getElementById("divDressUp").style.display = "block";
	},
	setDefaultSpriterData: function (functComplete) {
		if (!_DATAGAME.spriterData.hasOwnProperty("amy") || !_DATAGAME.spriterData.hasOwnProperty("jack")) {
			_DATAGAME.spriterData["amy"] = {
				girl: convertFiles.copy(convertFiles.defaultOutfit.girl)
			};
			_DATAGAME.spriterData["jack"] = {
				girl: convertFiles.copy(convertFiles.defaultOutfit.girl),
				boy: convertFiles.copy(convertFiles.defaultOutfit.boy)
			};
		}
		exportFiles.readFile("media/text/customload.js", "_CUSTOMLOAD", function (obj, data) {
			convertFiles.engineVersion = "2.0.0";
			convertFiles.arrCustomLoad = obj.Chapter;
			var charDataLoad = convertFiles.createCharactersData({});
			var keysLoad = Object.keys(charDataLoad);

			exportFiles.readFile("script-converter/characters-data.js", "charData", function (obj, data) {
				var keys = Object.keys(obj);
				//charData empty, set default from customload
				if (keys.length == 0) {
					this.charData = charDataLoad;
				} else {
					this.charData = convertFiles.merge(charDataLoad, obj);
				}
				for (var i = 0; i < keys.length; i++) {
					if (keysLoad.indexOf(keys[i]) == -1) {
						delete this.charData[keys[i]];
					}
				}

				var charName = Object.keys(this.charData);
				this.currentCharName = charName[0];

				if (this.charData[this.currentCharName]["girl"]) this.currentGender = "girl";
				else this.currentGender = "boy";
				functComplete();
			}.bind(this));
		}.bind(this));
		//         console.log(this.charData);
	},

	loadAnimation: function () {
		if (this.currentGender == "girl") {
			this.animationList = Object.keys(ig.game.girlPreview.spriter.spriter.entities.items[0].animations.itemNames);
		} else
			this.animationList = Object.keys(ig.game.boyPreview.spriter.spriter.entities.items[0].animations.itemNames);
		this.animationList.sort();

		this.emoList = _DATAGAME.listEmotion;
		this.emoList.sort();


		this.handheldList = Object.keys(_DATAGAME.objectHandheld);
		this.handheldList.sort();
		this.handheldList.unshift("none");

		this.createDropdownFilter("divCharacter", "animation", "Animation :", this.animationList, this.changeAnimation.bind(this), "ANIM_IDLE");
		this.createDropdownFilter("divCharacter", "emo", "Emo :", this.emoList, this.changeEmotion.bind(this), "EMO_NEUTRAL");
		this.createDropdownFilter("divCharacter", "handheld", "Handheld :", this.handheldList, this.changeHandheld.bind(this), "none");
		this.createCheckbox("divCharacter","shadow","Shadow",this.changeShadow.bind(this),this.currentShadow);		
		this.createColorPick("divCharacter", "tint", "Tint :", this.changeTint.bind(this),true,true);
		// this.createButton("colorpicktint", "btnTintNone", "Set Tint None", this.changeTintNull.bind(this));
		// this.createAnimationNote();

		// Created here so that the buttons will be created at the bottom just before the dress up section
		this.createButton("divCharacter", "btnImportData", "Import Data", this.showImportModal.bind(this));
		this.createButton("btnbtnImportData", "btnExportData", "Export Data", this.exportCharacterData.bind(this), false);
	},

	checkEmotionandMouthFrown: function (char) {
		//CHECK EMOTION
		ig.game[char].isHaveEmotion = true;
		if (_DATAGAME.noEmotion.indexOf(this.currentAnimation) >= 0) {
			//CHECK IF HAVE EMOTION
			// this['sptChar' + _idxArrChar].isHaveEmotion = false;
		}
		//CHECK MOUTH FROWN
		// if(_DATAGAME.frownEmo.indexOf(storyNow.char[i].anim) >= 0 || _DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion) == _DATAGAME.listEmotion.indexOf("EMO_ANGRY") || _DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion) == _DATAGAME.listEmotion.indexOf("EMO_SAD")) {
		if (_DATAGAME.frownEmo.indexOf(this.currentAnimation) >= 0 || _emoEye[this.currentEmotion].mouthFrown == true) {
			ig.game[char].isFrown = true;
		} else {
			ig.game[char].isFrown = false;
		}

		if (_DATAGAME.frownEmo.indexOf(this.currentAnimation) >= 0) {
			ig.game[char].isMouthDefault = false;
		} else {
			ig.game[char].isMouthDefault = true;
		}

	},

	//     checkEmotionandMouthFrown:function(char){       
	//         ig.game[char].isHaveEmotion = true;
	//         
	//         if(_DATAGAME.noEmotion.indexOf(this.currentAnimation) >= 0) {
	//             ig.game[char].isHaveEmotion = false;
	//         }

	//         //CHECK MOUTH FROWN
	//         if(_DATAGAME.frownEmo.indexOf(this.currentAnimation) >= 0 || _DATAGAME.listEmotion.indexOf(this.currentEmotion) == _DATAGAME.listEmotion.indexOf("EMO_ANGRY") || _DATAGAME.listEmotion.indexOf(this.currentEmotion) == _DATAGAME.listEmotion.indexOf("EMO_SAD")) {
	//             ig.game[char].isFrown = true;
	//         } else {
	//             ig.game[char].isFrown = false;
	//         }
	//         
	//         if(_DATAGAME.frownEmo.indexOf(this.currentAnimation) >= 0) {
	//             ig.game[char].isMouthDefault = false;
	//         } else {
	//             ig.game[char].isMouthDefault = true;
	//         }
	//     },

	changeEmotion: function (varname, value) {

		this.currentEmotion = value;
		// this.changeAllDU();
		if (varname != "null") {
			var temp = this.currentAnimation;
			this.changeAnimation("animation", "ANIM_IDLE", this.currentHandheld);
			this.changeAnimation("animation", temp, this.currentHandheld);
		}


		var idxAnim = _DATAGAME.noEmotion.indexOf(this.currentAnimation);
		var idxEmo = _DATAGAME.listEmotion.indexOf(value);

		if (idxEmo < 0) idxEmo = 0;

		//         if(idxAnim==-1){
		//             this.createEmoNote("");
		//         }else {
		//             this.createEmoNote("Animation doesn't have emo");
		//         }

		if (this.currentGender == "girl") {
			this.checkEmotionandMouthFrown("girlPreview");
			ig.game.girlPreview.changeEmotion(idxEmo);
		} else {
			this.checkEmotionandMouthFrown("boyPreview");
			ig.game.boyPreview.changeEmotion(idxEmo);
		}

	},

	loadPartAssets: function () {
		this.getFilesFromFolder("../../v2-visual-novel-assets/graphics/characters/" + this.currentGender, function (data) {
			this.duPart.forEach(function (key) {
				this.removeDropdown(key);
			}.bind(this));
			var objPartList = {};
			this.duPart = [];
			this.defaultChar = {};
			for (var i = 0; i < data.length; i++) {
				var partName = data[i].split("-")[0];
				if (data[i] != "blank" && data[i].split(".").length == 1) {
					if (this.duPart.indexOf(partName) == -1) {
						this.duPart.push(partName);
						objPartList[partName] = [];
					}

					if (objPartList[partName].indexOf(data[i]) == -1) {
						if (objPartList[partName].length == 0) {
							this.defaultChar[partName] = data[i];
						}
						objPartList[partName].push(data[i]);
					}
				}
			}
			this.duPart.forEach(function (key) {
				this.createDropdownFilter("divDressUp", key, key + " :", objPartList[key], this.changeDU.bind(this));
			}.bind(this));

			// }
			this.changeAllDU();
			this.createButton(null, "btnSave", "Save Character", this.saveCharacter.bind(this));
			// this.createButton(null, "btnToggleForExport", "Clear BG", this.clearBG.bind(this));
			this.createButton(null, "btnExportPNG", "Export PNG", this.exportPNG.bind(this));
			// this.createButton("btnRemove","Remove Gender",this.removeCharacter.bind(this));
		}.bind(this));
	},

	randomCharacter: function () {
		this.duPart.forEach(function (key) {
			var dropdown = document.getElementById(key);
			var isFilter = false;
			if (dropdown.options == null) {
				dropdown = document.getElementById("data" + key);
				isFilter = true;
			}
			var total = dropdown.options.length;
			var randIdx = Math.floor(Math.random() * total);
			//dropdown.selectedIndex = randIdx;
			this.setValueDropdown(key, dropdown.options[randIdx].value);

			// this.setValueDropdown("gender","girl");
			this.changeDU(key, dropdown.options[randIdx].value);
		}.bind(this));
	},
	setNoneDressUp: function () {
		this.currentTint=null;						

		this.duPart.forEach(function (key) {
			var dropdown = document.getElementById(key);
			var total = dropdown.options.length;
			var randIdx = Math.floor(Math.random() * total);
			dropdown.selectedIndex = randIdx;
			var hasNone = false;
			for (i = 0; i < total; i++) {
				if (dropdown.options[i].value == key + "-none") {
					hasNone = true;
					dropdown.selectedIndex = i;
				}
			}
			// this.setValueDropdown("gender","girl");
			if (hasNone == true)
				this.changeDU(key, key + "-none");
			else {
				this.changeDU(key, dropdown.options[0].value);
				dropdown.selectedIndex = 0;
			}
		}.bind(this));
	},
	setNonetint:function(varName,value){
		this.currentTint=null;
		this.changeAnimation("null",this.currentAnimation);
	},
	changeTint:function(varName,value){
		this.currentTint=value;
		// if (this.currentGender == "girl") {
		// 	ig.game.girlPreview.changePose(this.currentAnimation,this.currentHandheld,this.currentShadow,100,this.currentTint);
		// }else{
		// 	ig.game.boyPreview.checkShadow(this.currentAnimation,this.currentHandheld,this.currentShadow,100,this.currentTint);
		// }
		this.changeAnimation("null",this.currentAnimation);
	},
	changeShadow:function(varName,value){
		console.log("changesh",value);
		this.currentShadow=value;
		if (this.currentGender == "girl") {
			ig.game.girlPreview.checkShadow(value);
		}else{
			ig.game.boyPreview.checkShadow(value);
		}
	},
	changeHandheld: function (varName, value) {
		this.currentHandheld = value;
		if (value == "none") this.currentHandheld = "";

		this.changeAnimation("anim", this.currentAnimation);
	},
	changeAnimation: function (varName, value) {
		//loading all animations
		// Object.keys(ig.game.girlPreview.spriter.spriter.entities.items[0].animations.itemNames);
		this.currentAnimation = value;

		if (this.currentGender == "girl") {
			ig.game.girlPreview.changePose(value, this.currentHandheld,this.currentShadow,100,this.currentTint);
		} else {
			ig.game.boyPreview.changePose(value, this.currentHandheld,this.currentShadow,100,this.currentTint);
		}
		//         this.changeAllDU();
		this.changeEmotion("null", this.currentEmotion);
		this.createAnimationNote("animation is not used or not listed");
		var idxAnim = _DATAGAME.pose.indexOf(value);
		if (idxAnim >= 0) {
			this.createAnimationNote("");
		}
	},
	checkType: function () {
		if (this.charData[this.currentCharName].type == "neutral_boy") {
			this.changeGender("gender", "boy");
			this.setValueDropdown("gender", "boy");
		} else if (this.charData[this.currentCharName].type == "neutral_girl" || this.charData[this.currentCharName].type == "outfit") {
			this.changeGender("gender", "girl");
			this.setValueDropdown("gender", "girl");
		}
		document.querySelectorAll("#gender option").forEach(opt => {
			if (this.charData[this.currentCharName].type == "neutral_boy") {
				if (opt.value == "boy") opt.disabled = false;
				else opt.disabled = true;
			} else if (this.charData[this.currentCharName].type == "neutral_girl") {
				if (opt.value == "girl")
					opt.disabled = false;
				else opt.disabled = true;
			} else opt.disabled = false;
		});
	},
	changeCharacter: function (varName, value) {
		this.resetButtonNote();

		this.currentCharName = value;
		this.setValueDropdown("characterType", this.charData[this.currentCharName].type);
		this.setValueDropdown("bgName", this.charData[this.currentCharName].bgName);
		this.setValueDropdown("textName", this.charData[this.currentCharName].textName);
		this.setValueDropdown("outlineName", this.charData[this.currentCharName].outlineName);

		this.checkType();

		this.changeAllDU();
		this.changeAnimation("animation", "ANIM_IDLE");
	},

	changeDU: function (varName, value) {
		if(this.currentTint!=null){
			this.currentTint=null;
			this.changeAnimation("null",this.currentAnimation);
		}

		_DATAGAME.spriterData[this.currentCharName] = this.charData[this.currentCharName];
		// _DATAGAME.spriterData["jack"]=this.charData[this.currentCharName];
		// _DATAGAME.spriterData["amy"]=this.charData[this.currentCharName];

		if (_DATAGAME.spriterData[this.currentCharName][this.currentGender] == undefined || _DATAGAME.spriterData[this.currentCharName][this.currentGender].skin == "INSERT_ITEM") {
			_DATAGAME.spriterData[this.currentCharName][this.currentGender] = {};
			for (obj in this.defaultChar) {
				_DATAGAME.spriterData[this.currentCharName][this.currentGender][obj] = this.defaultChar[obj];
				this.setValueDropdown(obj, this.defaultChar[obj]);
			}

		}

		if (value) this.charData[this.currentCharName][this.currentGender][varName] = value;

		if (this.currentGender == "girl") {
			ig.game.girlPreview.charName = this.currentCharName;
			ig.game.girlPreview.changeDU(this.currentCharName);
		} else {
			ig.game.boyPreview.charName = this.currentCharName;
			ig.game.boyPreview.changeDU(this.currentCharName);
		}

		this.changeEmotion("null", this.currentEmotion);
	},
	changeAllDU: function () {
		// this.changeGender("gender",this.currentGender);

		for (var i = 0; i < this.duPart.length; i++) {
			this.changeDU(this.duPart[i]);
		}

	},
	changeGender: function (varName, value) {
		this.resetButtonNote();
		this.currentGender = value;
		if (this.currentGender == "boy") {
			ig.game.boyPreview.zIndex = 100;
			ig.game.girlPreview.zIndex = 0;
			ig.game.boyPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.boyPreview.spriter.root.alpha = 1;
			ig.game.girlPreview.spriter.root.alpha = 0;
		} else {
			ig.game.boyPreview.zIndex = 0;
			ig.game.girlPreview.zIndex = 100;
			ig.game.girlPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.girlPreview.spriter.root.alpha = 1;
			ig.game.boyPreview.spriter.root.alpha = 0;
		}
		this.loadPartAssets();
		this.loadAnimation();
		ig.game.sortEntitiesDeferred();
	},
	changeColors: function (varName, value) {
		this.charData[this.currentCharName][varName] = value;
		_DATAGAME.spriterData[this.currentCharName] = this.charData[this.currentCharName];
	},
	changeBackground: function (varName, value) {
		var par = ig.game.bgPreview._parent;
		var zIndex = ig.game.bgPreview.zIndex;
		this.currentBG = value;
		ig.game.bgPreview.kill();
		if (ig.game.bgPreviewBack != null) ig.game.bgPreviewBack.kill();
		var nameBG = value.split(".")[0];

		if (_DATAGAME.BGFileType[nameBG].toString() == "undefined") _DATAGAME.BGFileType[nameBG] = value.split(".")[1];

		ig.game.bgPreviewBack = ig.game.spawnEntity(EntityOverlayBackground, 0, 0, {
			zIndex: zIndex,
			_parent: par,
			placeName: nameBG
		});
		ig.game.bgPreview = ig.game.spawnEntity(EntityBackground, 0, 0, {
			zIndex: zIndex + 1,
			_parent: par,
			placeName: nameBG
		});


		ig.sizeHandler.resize();
		// ig.game.bgPreview.placeName=value.split(".png")[0];
		// ig.game.bgPreview.image = new ig.Image(_BASEPATH.background +value, ig.game.bgPreview.size.x, ig.game.bgPreview.size.y);
		ig.game.bgPreviewBack.image.loadCallback = function () {
			ig.game.bgPreviewBack.repos();
		};
		ig.game.bgPreview.image.loadCallback = function () {
			ig.game.bgPreview.repos();
		};
		ig.game.sortEntitiesDeferred();
	},

	getFilesFromFolder: function (path, functComplete) {
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "script-converter/script-editor.php",
			data: {
				functionname: 'fetchFolderFiles',
				folderPath: path
			},
			success: function (data) {

				if (functComplete) functComplete(data);
			},
			error: function (e) {
				console.log(e);
			}

		});
	},

	// <input type="file" id="fileInput" webkitdirectory directory multiple>
	resetButtonNote: function () {
		this.createButtonNote("");
	},
	removeCharacter: function () {
		delete this.charData[this.currentCharName][this.currentGender];
		// for(obj in _DATAGAME.spriterData[this.currentCharName][this.currentGender]){
		//  this.charData[this.currentCharName][this.currentGender][obj]=_DATAGAME.spriterData[this.currentCharName][this.currentGender][obj];          
		// }

		var dataStr = "var charData=".concat(JSON.stringify(this.charData, null, 1), ";");
		exportFiles.exportFile('characters-data.js', dataStr, function () {
			// var timerDelay = setTimeout(function(){
			//  clearTimeout(timerDelay);

			// }.bind(this), 500);          
		}.bind(this));

		exportFiles.updateSpriterData("script-converter/", convertFiles.copy(this.charData));
		this.createButtonNote("SpriterData for " + this.currentCharName + " gender: " + this.currentGender + " is removed.");
		this.checkDynamicCharacter();
		// ig.game.girlPreview.changeDU("amy"); 
	},
	isClearBG: false,
	canvasSize: {
		x: 0,
		y: 0
	},
	clearBG: function () {
		var currentCanvas = document.getElementById("canvas");
		if (this.isClearBG == false) {
			this.isClearBG = true;
			this.canvasSize = {
				x: ig.sizeHandler.minW,
				y: ig.sizeHandler.minH
			};
			this.charPosX = ig.game.girlPreview.spriter.pos.x;
            var scaleFactor = 1.5;
			ig.sizeHandler.minW *= scaleFactor;
			ig.sizeHandler.minH *= scaleFactor;
			ig.sizeHandler.resize();
			ig.game.bgPreview.isClear = true;
			// ig.game.boyPreview.spriter.scale={x:1.5,y:1.5};
			// ig.game.girlPreview.spriter.scale={x:1.5,y:1.5};
			ig.game.boyPreview.spriter.scale = {
				x: scaleFactor,
				y: scaleFactor
			};
			ig.game.girlPreview.spriter.scale = {
				x: scaleFactor,
				y: scaleFactor
			};
			ig.game.boyPreview.spriter.pos.x = 2000;
			ig.game.girlPreview.spriter.pos.x = 2000;
			ig.game.boyPreview.spriter.pos.y = ig.game.midY + this.charPosY + 200;
			ig.game.girlPreview.spriter.pos.y = ig.game.midY + this.charPosY + 200;
		} else {
			this.isClearBG = false;
			ig.sizeHandler.minW = this.canvasSize.x;
			ig.sizeHandler.minH = this.canvasSize.y;
			ig.sizeHandler.resize();
			ig.game.bgPreview.isClear = false;
			ig.game.boyPreview.spriter.scale = {
				x: scaleFactor,
				y: scaleFactor
			};
			ig.game.girlPreview.spriter.scale = {
				x: scaleFactor,
				y: scaleFactor
			};

			ig.game.boyPreview.spriter.pos.x = this.charPosX;
			ig.game.girlPreview.spriter.pos.x = this.charPosX;
			ig.game.boyPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.girlPreview.spriter.pos.y = ig.game.midY + this.charPosY;
		}
	},
	exportPNG: function () {
		// Ask user if they want transparent background and flip options
		Swal.fire({
			title: 'Export PNG',
			html: `
                <div style="margin-bottom: 1em;">
                    <p>Do you want to export with a transparent background?</p>
                </div>
                <div style="text-align: left; margin: 1em 0;">
                    <label style="display: block; margin-bottom: 0.5em;">
                        <input type="checkbox" id="flipHorizontal" style="margin-right: 0.5em;">
                        Flip Horizontally
                    </label>
                    <label style="display: block;">
                        <input type="checkbox" id="flipVertical" style="margin-right: 0.5em;">
                        Flip Vertically
                    </label>
                </div>
            `,
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Transparent',
			cancelButtonText: 'Current Background',
			reverseButtons: true,
			preConfirm: () => {
				return {
					flipHorizontal: document.getElementById('flipHorizontal').checked,
					flipVertical: document.getElementById('flipVertical').checked
				};
			}
		}).then((result) => {
			if (result.isConfirmed) {
				// Export with transparent background
				this.exportPNGWithTransparency(true, result.value.flipHorizontal, result.value.flipVertical);
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				// Export with current background
				var flipH = document.getElementById('flipHorizontal') ? document.getElementById('flipHorizontal').checked : false;
				var flipV = document.getElementById('flipVertical') ? document.getElementById('flipVertical').checked : false;
				this.exportPNGWithTransparency(false, flipH, flipV);
			}
		});
	},
	exportPNGWithTransparency: function (transparent, flipHorizontal, flipVertical) {
		if (transparent) {
			this.showLoading('Exporting transparent PNG...');
			// Store original state
			var originalBGState = ig.game.bgPreview.isClear;
			var originalClearBGState = this.isClearBG;
			var originalCanvasSize = {
				x: ig.sizeHandler.minW,
				y: ig.sizeHandler.minH
			};
			var originalCharPosX = this.currentGender == "girl" ? ig.game.girlPreview.spriter.pos.x : ig.game.boyPreview.spriter.pos.x;
			var originalCharPosY = this.currentGender == "girl" ? ig.game.girlPreview.spriter.pos.y : ig.game.boyPreview.spriter.pos.y;
			var originalScale = this.currentGender == "girl" ? {
				x: ig.game.girlPreview.spriter.scale.x,
				y: ig.game.girlPreview.spriter.scale.y
			} : {
				x: ig.game.boyPreview.spriter.scale.x,
				y: ig.game.boyPreview.spriter.scale.y
			};
            var scaleFactor = 1;
			// Apply clearBG transformations (Make the BG Transparent)
			ig.sizeHandler.minW *= scaleFactor;
			ig.sizeHandler.minH *= scaleFactor;
			ig.sizeHandler.resize();
			ig.game.bgPreview.isClear = true;

			if (this.currentGender == "girl") {
				ig.game.girlPreview.spriter.scale = {
					x: scaleFactor,
					y: scaleFactor
				};
				ig.game.girlPreview.spriter.pos.x = ig.game.midX + this.charPosX;
				ig.game.girlPreview.spriter.pos.y = ig.game.midY + this.charPosY;
				ig.game.girlPreview.calculateShadow();
			} else {
				ig.game.boyPreview.spriter.scale = {
					x: scaleFactor,
					y: scaleFactor
				};
				ig.game.boyPreview.spriter.pos.x = ig.game.midX + this.charPosX;
				ig.game.boyPreview.spriter.pos.y = ig.game.midY + this.charPosY;
				ig.game.boyPreview.calculateShadow();
			}

			// Force a render to update the canvas
			ig.game.draw();
			var _self = this;
			// Small delay to ensure canvas is updated, then capture
			setTimeout(() => {
				var currentCanvas = document.getElementById("canvas");
				var tempCanvas = document.createElement("canvas");
				tempCanvas.width = currentCanvas.width;
				tempCanvas.height = currentCanvas.height;
				var ctx = tempCanvas.getContext("2d");
				ctx.drawImage(currentCanvas, 0, 0);

				// Restore original state
				ig.sizeHandler.minW = originalCanvasSize.x;
				ig.sizeHandler.minH = originalCanvasSize.y;
				ig.sizeHandler.resize();
				ig.game.bgPreview.isClear = originalBGState;

				if (_self.currentGender == "girl") {
					ig.game.girlPreview.spriter.scale = originalScale;
					ig.game.girlPreview.spriter.pos.x = originalCharPosX;
					ig.game.girlPreview.spriter.pos.y = originalCharPosY;
					ig.game.girlPreview.calculateShadow();
				} else {
					ig.game.boyPreview.spriter.scale = originalScale;
					ig.game.boyPreview.spriter.pos.x = originalCharPosX;
					ig.game.boyPreview.spriter.pos.y = originalCharPosY;
					ig.game.boyPreview.calculateShadow();
				}

				ig.game.draw();

				// Export the image and hide loading screen on completion
				_self.downloadCanvas(tempCanvas, function () {
					_self.hideLoading();
				}, flipHorizontal, flipVertical);
			}, 1000);
		} else {
			// Export with current background
			var currentCanvas = document.getElementById("canvas");
			var tempCanvas = document.createElement("canvas");
			tempCanvas.width = currentCanvas.width;
			tempCanvas.height = currentCanvas.height;
			var ctx = tempCanvas.getContext("2d");
			ctx.drawImage(currentCanvas, 0, 0);
			this.downloadCanvas(tempCanvas, null, flipHorizontal, flipVertical);
		}
	},

	flipCanvas: function (canvas, flipHorizontal, flipVertical) {
		if (!flipHorizontal && !flipVertical) {
			return canvas;
		}

		var flippedCanvas = document.createElement("canvas");
		flippedCanvas.width = canvas.width;
		flippedCanvas.height = canvas.height;
		var ctx = flippedCanvas.getContext("2d");

		// Apply transformations
		ctx.save();

		if (flipHorizontal && flipVertical) {
			// Flip both
			ctx.scale(-1, -1);
			ctx.drawImage(canvas, -canvas.width, -canvas.height);
		} else if (flipHorizontal) {
			// Flip horizontally
			ctx.scale(-1, 1);
			ctx.drawImage(canvas, -canvas.width, 0);
		} else if (flipVertical) {
			// Flip vertically
			ctx.scale(1, -1);
			ctx.drawImage(canvas, 0, -canvas.height);
		}

		ctx.restore();
		return flippedCanvas;
	},

	/**
	 * Finds the bounding box of non-transparent pixels in a canvas
	 * @param {CanvasRenderingContext2D} ctx - The canvas context
	 * @param {number} width - Canvas width
	 * @param {number} height - Canvas height
	 * @returns {Object} Bounding box with {top, left, bottom, right, width, height}
	 */
	findContentBounds: function (ctx, width, height) {
		var imageData = ctx.getImageData(0, 0, width, height);
		var data = imageData.data;

		var top = height;
		var left = width;
		var bottom = 0;
		var right = 0;
		var found = false;

		// Scan for non-transparent pixels
		for (var i = 0; i < data.length; i += 4) {
			var alpha = data[i + 3]; // Alpha channel

			if (alpha > 0) { // Non-transparent pixel
				found = true;
				var pixelIndex = i / 4;
				var y = Math.floor(pixelIndex / width);
				var x = pixelIndex % width;

				if (y < top) top = y;
				if (x < left) left = x;
				if (y > bottom) bottom = y;
				if (x > right) right = x;
			}
		}

		// If no content found, return full canvas
		if (!found) {
			return {
				top: 0,
				left: 0,
				bottom: height - 1,
				right: width - 1,
				width: width,
				height: height
			};
		}

		return {
			top: top,
			left: left,
			bottom: bottom,
			right: right,
			width: right - left + 1,
			height: bottom - top + 1
		};
	},

	cropCanvasToContent: function (canvas) {
		var ctx = canvas.getContext("2d");
		var bounds = this.findContentBounds(ctx, canvas.width, canvas.height);

		// Add small padding to avoid cutting off edges (especially shadows)
		var padding = 2;
		var croppedLeft = Math.max(0, bounds.left - padding);
		var croppedTop = Math.max(0, bounds.top - padding);
		var croppedWidth = Math.min(canvas.width - croppedLeft, bounds.width + padding * 2);
		var croppedHeight = Math.min(canvas.height - croppedTop, bounds.height + padding * 2);

		// Create new canvas with cropped dimensions
		var croppedCanvas = document.createElement("canvas");
		croppedCanvas.width = croppedWidth;
		croppedCanvas.height = croppedHeight;

		var croppedCtx = croppedCanvas.getContext("2d");
		croppedCtx.drawImage(
			canvas,
			croppedLeft, croppedTop, croppedWidth, croppedHeight,
			0, 0, croppedWidth, croppedHeight
		);

		return croppedCanvas;
	},

	downloadCanvas: function (canvas, callback, flipHorizontal, flipVertical) {
		// Apply flip transformations if needed
		var processedCanvas = canvas;
		if (flipHorizontal || flipVertical) {
			processedCanvas = this.flipCanvas(canvas, flipHorizontal, flipVertical);
		}

		// Crop the canvas to content bounds
		var croppedCanvas = this.cropCanvasToContent(processedCanvas);

		croppedCanvas.toBlob((blob) => {
			var url = URL.createObjectURL(blob);

			// Create and click the download link
			var link = document.createElement("a");
			link.href = url;
			link.download = "pose.png";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);


			URL.revokeObjectURL(url);
			if (callback) {
				callback();
			}
		}, "image/png");
		// if(this.currentGender=="girl")ctx.drawImage(ig.game.girlPreview, 0, 0, w, h);
		// else ctx.drawImage(ig.game.boyPreview, 0, 0, w, h);
	},
	saveCharacter: function () {
		//updating charData with current DU data

		//set charData and spriterData to dropdown value
		if (!_DATAGAME.spriterData[this.currentCharName][this.currentGender]) {
			_DATAGAME.spriterData[this.currentCharName][this.currentGender] = {};
			this.charData[this.currentCharName][this.currentGender] = {};
		}
		this.duPart.forEach(function (key) {
			var value = this.getValueDropdown(key);
			_DATAGAME.spriterData[this.currentCharName][this.currentGender][key] = value;
			this.charData[this.currentCharName][this.currentGender][key] = value;
		}.bind(this));

		var dataStr = "var charData=".concat(JSON.stringify(this.charData, null, 1), ";");
		exportFiles.exportFile('characters-data.js', dataStr, null);

		exportFiles.updateSpriterData("script-converter/", convertFiles.copy(this.charData));
		this.createButtonNote("SpriterData for " + this.currentCharName + " gender: " + this.currentGender + " is saved.");
		this.checkDynamicCharacter();
		// ig.game.girlPreview.changeDU("amy"); 
	},
	checkDynamicCharacter: function () {
		var charName = convertFiles.capitalizeFirstLetter(this.currentCharName.replace("_", " "));
		if (this.charData[this.currentCharName].type == "dynamic_character") {
			if (!_LANG["en"]["dynamic_character"][charName]) {
				convertFiles.dynamicWords.push(charName);
				exportFiles.exportDynamicCharacter("");
			}
		} else {
			if (_LANG["en"]["dynamic_character"][charName]) {
				exportFiles.exportDynamicCharacter("", charName);
				delete _LANG["en"]["dynamic_character"][charName];
			}
		}
	},

	createColorPick: function (parent, varName, text, functClick, isNewDiv = true,isButtonNone=false) {
		var myParent;
		var div;
		if (isNewDiv == true) {
			if (document.getElementById(varName) != null&&document.getElementById("colorpick" + varName)) {
				document.getElementById("colorpick" + varName).remove();
			}
			myParent = document.getElementById((parent == null) ? "divDeveloperRightPanel" : parent);
			div = document.createElement("div");
			myParent.appendChild(div);
			div.id = "colorpick" + varName;
		} else {
			div = document.getElementById((parent == null) ? "divDeveloperRightPanel" : parent);
		}
		var label = document.createElement("label");
		label.innerHTML = text;
		label.style.cssText = `
			display: block;
			margin-bottom: 6px;
			font-size: 16px;
			font-weight: 500;
			color: rgba(255,255,255,0.9);
			letter-spacing: 0.3px;
		`;
		div.appendChild(label);

		var input = document.createElement("input");
		input.type = "color";
		input.id = varName;
		input.value = "#000000";
		input.style.cssText = `
			width: 100%;
			height: 40px;
			border: 2px solid rgba(255,255,255,0.2);
			border-radius: 6px;
			cursor: pointer;
			transition: all 0.2s ease;
		`;

		
		input.onmouseenter = function () {
			this.style.borderColor = "rgba(100,100,255,0.5)";
		};
		input.onmouseleave = function () {
			this.style.borderColor = "rgba(255,255,255,0.2)";
		};
		div.appendChild(input);
		div.style.cssText = "padding: 10px 0; margin: 8px 0;";

		if(isButtonNone==true){
			input.style.width=`40%`;
			this.createButton("colorpick" + varName,"btnNone"+varName,"Set None",this["setNone"+varName].bind(this),false);
			var btnNone=document.getElementById("btnNone"+varName);
			btnNone.style.width="40%";
			btnNone.style.marginLeft="12px";
			btnNone.style.verticalAlign="top";
		}
		input.addEventListener("change", (event) => {			
			if (functClick != null) functClick(varName, event.target.value);
		});

		input.addEventListener("input", (event) => {						
			if (functClick != null) functClick(varName, event.target.value);
		});
		var valueDefault = this.charData[this.currentCharName][varName];
		input.value = valueDefault;
	},
	createDiv: function (parent, varName, divBefore, style = null) {
		var myParent;
		var div;

		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		}
		myParent = (parent == null) ? document.body : document.getElementById(parent);

		div = document.createElement("div");
		myParent.insertBefore(div, document.getElementById(divBefore));
		div.id = "div" + varName;
		if (style) div.style = style;
	},
	createButton: function (parent, varName, text, functClick, isNewDiv = true) {
		var myParent;
		var div;
		if (isNewDiv == true) {
			if (document.getElementById(varName) != null) {
				document.getElementById("btn" + varName).remove();
			}
			myParent = document.getElementById((parent == null) ? "divDeveloper" : parent);
			div = document.createElement("div");
			myParent.appendChild(div);
			div.id = "btn" + varName;
		} else {
			div = document.getElementById((parent == null) ? "divDeveloper" : parent);
		}
		var button = document.createElement("button");
		button.id = varName;
		div.appendChild(button);
		button.innerHTML = text;
		button.onclick = functClick;
		button.style.cssText = `
			padding: 8px 16px;
			margin: 4px 2px;
			background: linear-gradient(135deg, rgba(100,100,255,0.8), rgba(80,80,200,0.8));
			color: white;
			border: 1px solid rgba(255,255,255,0.2);
			border-radius: 6px;
			cursor: pointer;
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 0.3px;
			transition: all 0.2s ease;
			box-shadow: 0 2px 8px rgba(0,0,0,0.2);
			width: calc(100% - 4px);
			text-align: center;
		`;
		button.onmouseenter = function () {
			this.style.background = "linear-gradient(135deg, rgba(120,120,255,0.9), rgba(100,100,220,0.9))";
			this.style.boxShadow = "0 4px 12px rgba(100,100,255,0.3)";
		};
		button.onmouseleave = function () {
			this.style.background = "linear-gradient(135deg, rgba(100,100,255,0.8), rgba(80,80,200,0.8))";
			this.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
		};
	},

	getValueDropdown: function (varName) {
		var selectList = document.getElementById(varName);
		if (selectList != null) {
			return selectList.value;
		}
		return null;
	},
	setValueDropdown: function (varName, value) {
		var selectList = document.getElementById(varName);

		if (selectList != null) {
			if (value == 'none' && selectList.type == 'color') value = '#000000';
			selectList.value = value;
			this.dropdownList[varName] = value;
		}
		ig.soundHandler.bgmPlayer.volume(0);
	},

	removeDropdown: function (varName) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		}
	},
	createEmoNote: function (text) {
		var label;
		if (document.getElementById("labelEmo") == null) {
			var myParent = document.getElementById("divemo");
			label = document.createElement("div");
			label.id = "labelEmo";
			myParent.appendChild(label);
		} else label = document.getElementById("labelEmo");

		if (text && text.length > 0) {
			label.style.cssText = `
				margin: 8px 0;
				padding: 8px 12px;
				background: rgba(255,150,50,0.1);
				border-left: 3px solid rgba(255,150,50,0.5);
				border-radius: 4px;
				color: rgba(255,200,100,0.9);
				font-size: 14px;
				font-style: italic;
			`;
		} else {
			label.style.cssText = "display: none;";
		}

		label.innerHTML = text;
	},
	createAnimationNote: function (text) {
		var label;
		if (document.getElementById("labelAnimation") == null) {
			var myParent = document.getElementById("divanimation");
			label = document.createElement("div");
			label.id = "labelAnimation";
			if(myParent!=null)myParent.appendChild(label);			
		} else label = document.getElementById("labelAnimation");

		if (text && text.length > 0) {
			label.style.cssText = `
				margin: 8px 0;
				padding: 8px 12px;
				background: rgba(255,150,50,0.1);
				border-left: 3px solid rgba(255,150,50,0.5);
				border-radius: 4px;
				color: rgba(255,200,100,0.9);
				font-size: 14px;
				font-style: italic;
			`;
		} else {
			label.style.cssText = "display: none;";
		}

		label.innerHTML = text;
	},
	createLabel: function (par, varName, text, fontSize) {
		var label;
		var myParent = document.getElementById(par);
		if (document.getElementById("label" + varName) == null) {
			label = document.createElement("div");
			label.id = "label" + varName;
			myParent.appendChild(label);
		} else label = document.getElementById("label" + varName);
		label.style.cssText = `
			margin: 10px 0;
			padding: 8px 0;
			font-weight: 500;
			letter-spacing: 0.3px;
			color: rgba(255,255,255,0.95);
			${fontSize ? 'font-size: ' + fontSize + ';' : 'font-size: 14px;'}
		`;
		label.innerHTML = text;
	},

	createButtonNote: function (text) {
		var label;
		if (document.getElementById("labelSaveNotification") == null) {
			var myParent = document.body;
			label = document.createElement("div");
			label.id = "labelSaveNotification";
			myParent.appendChild(label);
		} else {
			label = document.getElementById("labelSaveNotification");
		}

		// Always set the base positioning styles
		label.style.position = "fixed";
		label.style.bottom = "20px";
		label.style.left = "50%";
		label.style.transform = "translateX(-50%)";
		label.style.zIndex = "9999";
		label.style.padding = "12px 24px";
		label.style.borderRadius = "8px";
		label.style.fontSize = "14px";
		label.style.fontWeight = "500";
		label.style.letterSpacing = "0.3px";
		label.style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
		label.style.maxWidth = "80%";
		label.style.textAlign = "center";
		label.style.transition = "opacity 0.3s ease, transform 0.3s ease";

		if (text && text.length > 0) {
			label.style.display = "block";
			label.style.background = "linear-gradient(135deg, rgba(100,200,100,0.95), rgba(80,180,80,0.95))";
			label.style.backdropFilter = "blur(10px)";
			label.style.border = "1px solid rgba(100,200,100,0.6)";
			label.style.color = "white";
			label.style.opacity = "1";
			label.innerHTML = text;
		} else {
			label.style.opacity = "0";
			// Delay hiding to allow fade out animation
			setTimeout(function () {
				if (label.style.opacity === "0") {
					label.style.display = "none";
				}
			}, 300);
		}
	},

	createDropdownFilter: function (par, varName, text, arrOptions, functChange, defaultValue) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		} else {
			if (arrOptions.length > 0) this.optionList[varName] = arrOptions;
		}
		if (arrOptions.length == 0) return;

		var myParent = document.getElementById(par);
		var div = document.createElement("div");
		div.id = "div" + varName;
		div.style.cssText = `
			margin: 6px 0;
			padding: 6px;
			background: rgba(255,255,255,0.03);
			border-radius: 6px;
			border: 1px solid rgba(255,255,255,0.08);
		`;
		myParent.appendChild(div);

		var label = document.createElement("label");
		label.innerHTML = text;
		label.style.cssText = `
			display: block;
			margin-bottom: 4px;
			font-size: 16px;
			font-weight: 500;
			color: rgba(255,255,255,0.9);
			letter-spacing: 0.3px;
		`;
		div.appendChild(label);

		// Create container for dropdown
		var dropdownContainer = document.createElement("div");
		dropdownContainer.style.cssText = "position: relative; margin-bottom: 4px;";

		// Hidden select for value storage
		var selectList = document.createElement("select");
		selectList.id = varName;
		selectList.style.display = "none";
		div.appendChild(selectList);

		// Display field showing current selection (clickable)
		var displayField = document.createElement("div");
		displayField.id = "display-" + varName;
		displayField.style.cssText = `
			padding: 6px 24px 6px 8px;
			background: rgba(255,255,255,0.08);
			border: 1px solid rgba(255,255,255,0.15);
			border-radius: 4px;
			color: rgba(255,255,255,0.7);
			font-size: 14px;
			min-height: 16px;
			cursor: pointer;
			transition: all 0.2s ease;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		`;
		displayField.textContent = "No selection";

		// Add dropdown arrow indicator (points right since dropdown opens to the right)
		var arrow = document.createElement("span");
		arrow.innerHTML = "▶";
		arrow.style.cssText = `
			position: absolute;
			right: 6px;
			top: 50%;
			transform: translateY(-50%);
			font-size: 10px;
			color: rgba(255,255,255,0.5);
			pointer-events: none;
		`;
		displayField.appendChild(arrow);

		displayField.onmouseenter = function () {
			this.style.background = "rgba(255,255,255,0.12)";
			this.style.borderColor = "rgba(100,100,255,0.6)";
		};
		displayField.onmouseleave = function () {
			if (suggestionsList.style.display !== 'block') {
				this.style.background = "rgba(255,255,255,0.08)";
				this.style.borderColor = "rgba(255,255,255,0.15)";
			}
		};
		dropdownContainer.appendChild(displayField);

		// Create suggestions list (dropdown options) - positioned to the right of left panel
		var suggestionsList = document.createElement("div");
		suggestionsList.id = "suggestions-" + varName;
		suggestionsList.className = "dropdown-suggestions";
		suggestionsList.style.cssText = `
			position: fixed;
			left: 350px;
			min-width: 300px;
			max-width: 600px;
			width: auto;
			background: rgba(20,20,30,` + this.panelOpacity + `);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(100,100,255,0.4);
			border-radius: 8px;
			max-height: 500px;
			overflow: hidden;
			z-index: 2000;
			display: none;
			box-shadow: 0 8px 24px rgba(0,0,0,0.5);
			resize: horizontal;
			scrollbar-width: thin;
			scrollbar-color: rgba(255,255,255,0.3) rgba(0,0,0,0.2);
			flex-direction: column;
		`;
		document.body.appendChild(suggestionsList);

		// Create search input (appears when dropdown is opened)
		var searchInput = document.createElement("input");
		searchInput.type = "text";
		searchInput.id = "search-" + varName;
		searchInput.placeholder = "Type to filter...";
		searchInput.style.cssText = `
			width: 100%;
			padding: 8px 10px;
			background: rgba(255,255,255,0.15);
			border: none;
			border-bottom: 1px solid rgba(255,255,255,0.1);
			color: white;
			font-size: 14px;
			box-sizing: border-box;
			outline: none;
			flex-shrink: 0;
			height: 40px;
			z-index: 2001;
		`;

		// Options container (separate from search input to prevent focus loss)
		var optionsContainer = document.createElement("div");
		optionsContainer.id = "options-" + varName;
		optionsContainer.style.cssText = `
			overflow-y: auto;
			overflow-x: hidden;
		`;

		// Add resize handle indicator
		var resizeHandle = document.createElement("div");
		resizeHandle.style.cssText = `
			position: absolute;
			bottom: 4px;
			right: 4px;
			width: 12px;
			height: 12px;
			background: linear-gradient(135deg, transparent 50%, rgba(100,100,255,0.5) 50%);
			pointer-events: none;
			border-bottom-right-radius: 8px;
		`;

		div.appendChild(dropdownContainer);

		// Populate hidden select
		arrOptions.forEach(function (value) {
			var option = document.createElement('option');
			option.value = value;
			option.text = value;
			selectList.appendChild(option);
		});

		var currentHighlightIndex = -1;
		var isDropdownOpen = false;

		// Position dropdown to maximize vertical space and align with parent
		var positionDropdown = function () {
			var leftPanel = document.getElementById('divDeveloper');
			var panelRect = leftPanel.getBoundingClientRect();
			var displayRect = displayField.getBoundingClientRect();

			// Get viewport height
			var viewportHeight = window.innerHeight;

			// Calculate the panel height (this is our target MAX height)
			var panelHeight = panelRect.height;

			// Calculate natural height based on content
			var itemCount = optionsContainer.children.length;
			var itemHeight = 29; // 8px padding top + 8px padding bottom + 12px font + 1px border
			var searchInputHeight = 40;
			var naturalHeight = searchInputHeight + (itemCount * itemHeight) + 20; // +20 for padding/margins

			// Use natural height if there are few items, otherwise use panel height
			var dropdownHeight;
			var useFlex = false;
			// Only maximize if natural height would be >= 70% of panel height (many items)
			if (naturalHeight >= panelHeight * 0.85) {
				// Many items: maximize to panel height
				dropdownHeight = panelHeight;
				useFlex = true;
			} else {
				// Few/moderate items: use natural height
				dropdownHeight = Math.min(naturalHeight, panelHeight); // Cap at panel height
				useFlex = false;
			}

			var topPosition;

			if (useFlex) {
				// Many items: align to panel top/bottom based on trigger position
				var displayFieldMiddle = displayRect.top + (displayRect.height / 2);
				var panelMiddle = panelRect.top + (panelRect.height / 2);

				if (displayFieldMiddle > panelMiddle) {
					// Display field is in bottom half - align bottoms
					topPosition = panelRect.bottom - dropdownHeight;
				} else {
					// Display field is in top half - align tops
					topPosition = panelRect.top;
				}
			} else {
				// Few items: align near the trigger element
				topPosition = displayRect.top;

				// Adjust if dropdown would go off bottom of screen
				if (topPosition + dropdownHeight > viewportHeight) {
					topPosition = displayRect.bottom - dropdownHeight;
				}

				// Ensure it stays within panel bounds when possible
				if (topPosition < panelRect.top) {
					topPosition = panelRect.top;
				}
			}

			// Final bounds check - ensure dropdown doesn't go off screen
			if (topPosition < 0) {
				topPosition = 0;
			}
			if (topPosition + dropdownHeight > viewportHeight) {
				topPosition = viewportHeight - dropdownHeight;
			}

			// Apply positioning
			suggestionsList.style.top = topPosition + 'px';

			// For few items, set exact height; for many items, set max-height and let it flex
			if (useFlex) {
				suggestionsList.style.height = dropdownHeight + 'px';
				suggestionsList.style.maxHeight = dropdownHeight + 'px';
				optionsContainer.style.flex = '1';
			} else {
				suggestionsList.style.height = 'auto';
				suggestionsList.style.maxHeight = dropdownHeight + 'px';
				optionsContainer.style.flex = '0 1 auto';
			}
		};

		// Show suggestions function with live filtering
		var showSuggestions = function (filter, showAll) {
			// Close all other open dropdowns first and reset their display fields
			var allDropdowns = document.querySelectorAll('.dropdown-suggestions');
			allDropdowns.forEach(function (dropdown) {
				if (dropdown.id !== suggestionsList.id) {
					dropdown.style.display = 'none';
					// Extract varName from dropdown id (format: "suggestions-varName")
					var otherVarName = dropdown.id.replace('suggestions-', '');
					var otherDisplayField = document.getElementById('display-' + otherVarName);
					if (otherDisplayField) {
						otherDisplayField.style.background = "rgba(255,255,255,0.08)";
						otherDisplayField.style.borderColor = "rgba(255,255,255,0.15)";
					}
				}
			});

			// Clear only the options container, not the search input
			optionsContainer.innerHTML = '';
			currentHighlightIndex = -1;
			var filteredOptions = [];

			if (filter && filter.length > 0) {
				filteredOptions = arrOptions.filter(function (opt) {
					return opt.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
				});
			} else {
				// Show all options when clicked (up to 1000 for performance)
				filteredOptions = arrOptions.slice(0, showAll ? 1000 : arrOptions.length);
			}

			// Build dropdown structure if not already built
			if (suggestionsList.childNodes.length === 0) {
				suggestionsList.appendChild(searchInput);
				suggestionsList.appendChild(optionsContainer);
				suggestionsList.appendChild(resizeHandle);
			}

			if (filteredOptions.length > 0) {
				var currentValue = selectList.value;
				filteredOptions.forEach(function (opt, index) {
					var item = document.createElement('div');
					item.className = 'suggestion-item';
					item.textContent = opt;

					// Check if this is the currently selected value
					var isCurrentValue = (opt === currentValue);

					if (isCurrentValue) {
						item.classList.add('current-value');
					}

					item.style.cssText = `
						padding: 8px 10px;
						cursor: pointer;
						border-bottom: 1px solid rgba(255,255,255,0.05);
						color: rgba(255,255,255,0.9);
						font-size: 14px;
						transition: all 0.15s ease;
						white-space: nowrap;
						overflow: visible;
						${isCurrentValue ? 'background: rgba(100,200,100,0.2); border-left: 3px solid rgba(100,200,100,0.6); padding-left: 7px; font-weight: 500;' : ''}
					`;
					item.onmouseenter = function () {
						this.style.background = "rgba(100,100,255,0.3)";
						this.style.color = "white";
					};
					item.onmouseleave = function () {
						if (!this.classList.contains('highlighted')) {
							if (this.classList.contains('current-value')) {
								this.style.background = "rgba(100,200,100,0.2)";
								this.style.color = "rgba(255,255,255,0.9)";
							} else {
								this.style.background = "transparent";
								this.style.color = "rgba(255,255,255,0.9)";
							}
						}
					};
					item.onclick = function () {
						selectValue(opt);
					};
					optionsContainer.appendChild(item);
				});

				// Position dropdown intelligently
				positionDropdown();

				suggestionsList.style.display = 'flex';
				isDropdownOpen = true;
				displayField.style.background = "rgba(255,255,255,0.12)";
				displayField.style.borderColor = "rgba(100,100,255,0.6)";

				// Scroll to current value if it exists
				setTimeout(function () {
					var currentItem = optionsContainer.querySelector('.current-value');
					if (currentItem) {
						currentItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
					}
				}, 50);
			} else {
				var noResults = document.createElement('div');
				noResults.textContent = 'No matches found';
				noResults.style.cssText = `
					padding: 8px 10px;
					color: rgba(255,255,255,0.5);
					font-size: 14px;
					font-style: italic;
				`;
				optionsContainer.appendChild(noResults);

				// Position dropdown intelligently
				positionDropdown();

				suggestionsList.style.display = 'flex';
			}
		};

		// Toggle dropdown on display field click
		displayField.onclick = function (e) {
			e.stopPropagation();
			// Check actual visibility state instead of just the flag
			var isActuallyOpen = (suggestionsList.style.display === 'flex');

			if (isActuallyOpen) {
				suggestionsList.style.display = 'none';
				isDropdownOpen = false;
				displayField.style.background = "rgba(255,255,255,0.08)";
				displayField.style.borderColor = "rgba(255,255,255,0.15)";
			} else {
				// Close all other dropdowns first and reset their display fields
				var allDropdowns = document.querySelectorAll('.dropdown-suggestions');
				allDropdowns.forEach(function (dropdown) {
					if (dropdown.id !== suggestionsList.id) {
						dropdown.style.display = 'none';
						// Extract varName and reset display field
						var otherVarName = dropdown.id.replace('suggestions-', '');
						var otherDisplayField = document.getElementById('display-' + otherVarName);
						if (otherDisplayField) {
							otherDisplayField.style.background = "rgba(255,255,255,0.08)";
							otherDisplayField.style.borderColor = "rgba(255,255,255,0.15)";
						}
					}
				});

				showSuggestions('', true);
				// Focus search input after a brief delay
				setTimeout(function () {
					searchInput.focus();
				}, 100);
			}
		};

		// Select value function
		var selectValue = function (value) {
			selectList.value = value;
			var displayText = value;
			if (displayText.length > 35) {
				displayText = displayText.substring(0, 32) + '...';
			}
			displayField.childNodes[0].textContent = displayText;
			displayField.style.color = "white";
			searchInput.value = '';
			suggestionsList.style.display = 'none';
			isDropdownOpen = false;
			displayField.style.background = "rgba(255,255,255,0.08)";
			displayField.style.borderColor = "rgba(255,255,255,0.15)";
			characterPreview.setValueDropdown(varName, value);
			if (functChange) {
				functChange(varName, value);
			}
		};

		// Search input event
		searchInput.addEventListener('input', function (e) {
			showSuggestions(e.target.value, false);
		});

		// Prevent closing when clicking search input
		searchInput.addEventListener('click', function (e) {
			e.stopPropagation();
		});

		// Keyboard navigation
		searchInput.addEventListener('keydown', function (e) {
			var items = suggestionsList.querySelectorAll('.suggestion-item');

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (items.length > 0) {
					currentHighlightIndex = Math.min(currentHighlightIndex + 1, items.length - 1);
					updateHighlight(items);
				}
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (currentHighlightIndex > 0) {
					currentHighlightIndex--;
					updateHighlight(items);
				}
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (currentHighlightIndex >= 0 && items[currentHighlightIndex]) {
					selectValue(items[currentHighlightIndex].textContent);
				}
			} else if (e.key === 'Escape') {
				suggestionsList.style.display = 'none';
				isDropdownOpen = false;
				displayField.style.background = "rgba(255,255,255,0.08)";
				displayField.style.borderColor = "rgba(255,255,255,0.15)";
				searchInput.blur();
			}
		});

		var updateHighlight = function (items) {
			items.forEach(function (item, index) {
				if (index === currentHighlightIndex) {
					item.classList.add('highlighted');
					item.style.background = "rgba(100,100,255,0.5)";
					item.style.color = "white";
					item.scrollIntoView({ block: 'nearest' });
				} else {
					item.classList.remove('highlighted');
					item.style.background = "transparent";
					item.style.color = "rgba(255,255,255,0.8)";
				}
			});
		};

		// Click outside to close suggestions
		document.addEventListener('click', function (e) {
			if (!dropdownContainer.contains(e.target) && !suggestionsList.contains(e.target)) {
				suggestionsList.style.display = 'none';
				isDropdownOpen = false;
				displayField.style.background = "rgba(255,255,255,0.08)";
				displayField.style.borderColor = "rgba(255,255,255,0.15)";
			}
		});

		// Reposition dropdown on window resize
		window.addEventListener('resize', function () {
			if (isDropdownOpen && suggestionsList.style.display === 'flex') {
				positionDropdown();
			}
		});

		// Add Previous, Next, and Copy buttons (exclude only characterType and gender)
		if (varName !== 'characterType' && varName !== 'gender') {
			var buttonContainer = document.createElement("div");
			buttonContainer.style.cssText = `
				display: flex;
				gap: 4px;
			`;

			// Previous Button
			var prevButton = document.createElement("button");
			prevButton.innerHTML = "◄";
			prevButton.style.cssText = `
				flex: 1;
				padding: 4px;
				background: rgba(255,255,255,0.08);
				color: white;
				border: 1px solid rgba(255,255,255,0.15);
				border-radius: 4px;
				cursor: pointer;
				font-size: 14px;
				transition: all 0.2s ease;
			`;
			prevButton.onmouseenter = function () {
				this.style.background = "rgba(100,100,255,0.3)";
				this.style.borderColor = "rgba(100,100,255,0.5)";
			};
			prevButton.onmouseleave = function () {
				this.style.background = "rgba(255,255,255,0.08)";
				this.style.borderColor = "rgba(255,255,255,0.15)";
			};
			prevButton.onclick = function () {
				var currentIndex = arrOptions.indexOf(selectList.value);
				if (currentIndex >= 0) {
					var nextIndex = (currentIndex - 1 >= 0) ? currentIndex - 1 : 0;
					selectValue(arrOptions[nextIndex]);
				}
			};
			buttonContainer.appendChild(prevButton);

			// Next Button
			var nextButton = document.createElement("button");
			nextButton.innerHTML = "►";
			nextButton.style.cssText = `
				flex: 1;
				padding: 4px;
				background: rgba(255,255,255,0.08);
				color: white;
				border: 1px solid rgba(255,255,255,0.15);
				border-radius: 4px;
				cursor: pointer;
				font-size: 14px;
				transition: all 0.2s ease;
			`;
			nextButton.onmouseenter = function () {
				this.style.background = "rgba(100,100,255,0.3)";
				this.style.borderColor = "rgba(100,100,255,0.5)";
			};
			nextButton.onmouseleave = function () {
				this.style.background = "rgba(255,255,255,0.08)";
				this.style.borderColor = "rgba(255,255,255,0.15)";
			};
			nextButton.onclick = function () {
				var currentIndex = arrOptions.indexOf(selectList.value);
				if (currentIndex >= 0) {
					var nextIndex = (currentIndex + 1 < arrOptions.length) ? currentIndex + 1 : currentIndex;
					selectValue(arrOptions[nextIndex]);
				}
			};
			buttonContainer.appendChild(nextButton);

			// Copy Button
			var copyButton = document.createElement("button");
			copyButton.innerHTML = "📋";
			copyButton.title = "Copy to clipboard";
			copyButton.style.cssText = `
				flex: 0 0 32px;
				padding: 4px;
				background: rgba(100,150,200,0.2);
				color: white;
				border: 1px solid rgba(100,150,200,0.3);
				border-radius: 4px;
				cursor: pointer;
				font-size: 14px;
				transition: all 0.2s ease;
			`;
			copyButton.onmouseenter = function () {
				this.style.background = "rgba(100,150,200,0.4)";
				this.style.borderColor = "rgba(100,150,200,0.6)";
			};
			copyButton.onmouseleave = function () {
				this.style.background = "rgba(100,150,200,0.2)";
				this.style.borderColor = "rgba(100,150,200,0.3)";
			};
			copyButton.onclick = function () {
				var textToCopy = selectList.value;
				if (!textToCopy) {
					characterPreview.createButtonNote("Nothing to copy");
					setTimeout(function () { characterPreview.resetButtonNote(); }, 2000);
					return;
				}
				var textArea = document.createElement('textarea');
				textArea.value = textToCopy;
				textArea.style.position = 'fixed';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				try {
					var successful = document.execCommand('copy');
					if (successful) {
						characterPreview.createButtonNote("Copied: " + textToCopy);
						setTimeout(function () { characterPreview.resetButtonNote(); }, 2000);
					} else {
						characterPreview.createButtonNote("Failed to copy");
						setTimeout(function () { characterPreview.resetButtonNote(); }, 2000);
					}
				} catch (err) {
					characterPreview.createButtonNote("Error copying: " + err);
					setTimeout(function () { characterPreview.resetButtonNote(); }, 2000);
				}
				document.body.removeChild(textArea);
			};
			buttonContainer.appendChild(copyButton);

			div.appendChild(buttonContainer);
		}

		// Set default value
		if (defaultValue) {
			selectValue(defaultValue);
		} else if (characterPreview.charData[characterPreview.currentCharName] &&
				characterPreview.charData[characterPreview.currentCharName][characterPreview.currentGender]) {
			var savedValue = characterPreview.charData[characterPreview.currentCharName][characterPreview.currentGender][varName];
			if (!savedValue) {
				savedValue = varName + "-none";
				characterPreview.charData[characterPreview.currentCharName][characterPreview.currentGender][varName] = savedValue;
			}
			if (arrOptions.indexOf(savedValue) >= 0) {
				selectValue(savedValue);
			} else {
				selectValue(arrOptions[0]);
			}
		} else {
			selectValue(arrOptions[0]);
		}

		ig.soundHandler.bgmPlayer.volume(0);
	},

	createCheckbox: function (par, varName, text, functChange, defaultValue) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		} 
		var myParent = document.getElementById(par);
		var div = document.createElement("div");
		div.id = "div" + varName;
		div.style.cssText = `
			margin: 6px 0;
			padding: 6px;
			background: rgba(255,255,255,0.03);
			border-radius: 6px;
			border: 1px solid rgba(255,255,255,0.08);
		`;
		myParent.appendChild(div);

		var label = document.createElement("label");		
		label.innerHTML = text;
		label.htmlFor =varName;
		label.style.cssText = `			
			margin-bottom: 4px;
			font-size: 16px;
			font-weight: 500;
			color: rgba(255,255,255,0.9);
			letter-spacing: 0.3px;
		`;
		

		var inputCheckbox = document.createElement("input");
		//  <input type="checkbox" id="flipHorizontal" style="margin-right: 0.5em;">
        //                 Flip Horizontally
		inputCheckbox.id = varName;
		inputCheckbox.type="checkbox";
		inputCheckbox.checked=defaultValue;
		inputCheckbox.style.cssText = `
			margin-right: 0.5em;			
		`;
		
		div.appendChild(inputCheckbox);
		div.appendChild(label);

		inputCheckbox.addEventListener('change', function (event) {
			if (functChange) functChange(varName, event.target.checked);
		});

		// if (defaultValue) {
		// 	this.setValueDropdown(varName, defaultValue);
		// } else if (this.charData[this.currentCharName] && this.charData[this.currentCharName][this.currentGender]) {
		// 	if (!this.charData[this.currentCharName][this.currentGender][varName]) this.charData[this.currentCharName][this.currentGender][varName] = varName + "-none";
		// 	this.setValueDropdown(varName, this.charData[this.currentCharName][this.currentGender][varName]);
		// } else selectList.selectedIndex = 0;
		ig.soundHandler.bgmPlayer.volume(0);
	},

	createDropdown: function (par, varName, text, arrOptions, functChange, defaultValue) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		} else {
			if (arrOptions.length > 0) this.optionList[varName] = arrOptions;
		}
		if (arrOptions.length == 0) return;

		var myParent = document.getElementById(par);
		var div = document.createElement("div");
		div.id = "div" + varName;
		div.style.cssText = `
			margin: 6px 0;
			padding: 6px;
			background: rgba(255,255,255,0.03);
			border-radius: 6px;
			border: 1px solid rgba(255,255,255,0.08);
		`;
		myParent.appendChild(div);

		var label = document.createElement("label");
		label.innerHTML = text;
		label.style.cssText = `
			display: block;
			margin-bottom: 4px;
			font-size: 16px;
			font-weight: 500;
			color: rgba(255,255,255,0.9);
			letter-spacing: 0.3px;
		`;
		div.appendChild(label);

		var selectList = document.createElement("select");
		selectList.id = varName;
		selectList.style.cssText = `
			width: 100%;
			padding: 6px 8px;
			background: rgba(255,255,255,0.08);
			border: 1px solid rgba(255,255,255,0.15);
			border-radius: 4px;
			color: white;
			font-size: 14px;
			cursor: pointer;
			transition: all 0.2s ease;
			box-sizing: border-box;
		`;
		selectList.onfocus = function () {
			this.style.background = "rgba(255,255,255,0.12)";
			this.style.borderColor = "rgba(100,100,255,0.6)";
			this.style.outline = "none";
		};
		selectList.onblur = function () {
			this.style.background = "rgba(255,255,255,0.08)";
			this.style.borderColor = "rgba(255,255,255,0.15)";
		};
		div.appendChild(selectList);


		selectList.addEventListener('change', function (event) {
			if (functChange) functChange(varName, event.target.value);
		});

		// Add Previous and Next buttons on all dropdowns EXCEPT character type, character name, and gender
		if (varName !== 'characterType' && varName !== 'character' && varName !== 'gender') {
			// Previous Button
			var prevButton = document.createElement("button");
			prevButton.innerHTML = "◄"; // Left-pointing arrow
			prevButton.style = "padding: 0.5em; margin-left: 0.5em; cursor: pointer;";
			prevButton.onclick = function () {
				var currentIndex = selectList.selectedIndex;
				var newIndex = (currentIndex - 1 + selectList.options.length) % selectList.options.length;
				selectList.selectedIndex = newIndex;
				if (functChange) functChange(varName, selectList.value);
			};
			div.appendChild(prevButton);

			// Next Button
			var nextButton = document.createElement("button");
			nextButton.innerHTML = "►"; // Right-pointing arrow
			nextButton.style = "padding: 0.5em; margin-left: 0.2em; cursor: pointer;";
			nextButton.onclick = function () {
				var currentIndex = selectList.selectedIndex;
				var newIndex = (currentIndex + 1) % selectList.options.length;
				selectList.selectedIndex = newIndex;
				if (functChange) functChange(varName, selectList.value);
			};
			div.appendChild(nextButton);
		}


		//Create and append the options
		for (var i = 0; i < arrOptions.length; i++) {
			var option = document.createElement("option");
			option.value = arrOptions[i];
			option.text = arrOptions[i];
			option.style.cssText = `
				background: rgba(30,30,40,0.95);
				color: rgba(255,255,255,0.9);
				padding: 4px;
			`;
			selectList.appendChild(option);
		}
		if (defaultValue) {
			this.setValueDropdown(varName, defaultValue);
		} else if (this.charData[this.currentCharName] && this.charData[this.currentCharName][this.currentGender]) {
			if (!this.charData[this.currentCharName][this.currentGender][varName]) this.charData[this.currentCharName][this.currentGender][varName] = varName + "-none";
			this.setValueDropdown(varName, this.charData[this.currentCharName][this.currentGender][varName]);
		} else selectList.selectedIndex = 0;
		ig.soundHandler.bgmPlayer.volume(0);
	}
};