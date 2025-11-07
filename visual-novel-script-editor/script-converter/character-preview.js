//character-preview version 1.0.12
var myTimeout = setInterval(changePreview, 500);

function changePreview() {
	try {
		if (ig && ig.game) {
			clearInterval(myTimeout);
			characterPreview.initMenu();
		}
	} catch (e) {
		console.log("game is not ready...");
	}
}

var characterPreview = {
	currentCharName: "Amy",
	currentGender: "girl",
	currentBG: "office.png",
	currentAnimation: "ANIM_IDLE",
	currentEmotion: "EMO_NEUTRAL",
	charData: {},
	duPart: [],
	animationList: [],
	handheldList: [],
	defaultChar: {},
	charPosY: 750,
	charPosX: 0,
	optionList: {},
	dropdownList: {},
	initMenu: function() {

		this.setDefaultSpriterData(function() {
			ig.game.director.jumpTo(LevelPreview);
			//preset to avoid errors from engine
			ig.game.sessionData.dressUpTheme = [{ now: "amy" }, { now: "amy" }];
			ig.game.currentWindow.numChapter = 1;

			ig.game.boyPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.girlPreview.spriter.pos.y = ig.game.midY + this.charPosY;
			ig.game.boyPreview.spriter.root.alpha = 0;
			ig.game.girlPreview.charName = "Amy";
			ig.game.boyPreview.changePose("ANIM_IDLE");
			ig.soundHandler.bgmPlayer.volume(0);
			exportFiles.phpFile = "script-converter/script-editor.php";

			this.getFilesFromFolder("../../v2-visual-novel-assets/graphics/backgrounds", function(data) {

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
				this.createDiv(null, "ToggleDeveloperRight", "divDeveloperRight", "z-index: 5;position: absolute;float: right;background-color: rgba(0, 0, 0, 0.5);right: 1%;color: white;padding: 1em;display: block;")

				this.createLabel("divDeveloperRight", "speakerName", "Speaker box colors");
				this.createShowHide("divDeveloperRight", "divToggleDeveloperRight", true);
				this.createColorPick(null, "bgName", "bgName :", this.changeColors.bind(this));
				this.createColorPick(null, "textName", "textName :", this.changeColors.bind(this));
				this.createColorPick(null, "outlineName", "outlineName :", this.changeColors.bind(this));
				this.createButton("colorpickoutlineName", "btnNoneOutline", "Set None", this.setNoneOutline.bind(this), false);
				this.createButton("divDeveloperRight", "btnDeleteAll", "Delete All", this.deleteAllNameProperties.bind(this));
				this.createLabel("divDeveloperRight", "deleteDesc", "*Delete name properties for all characters", "small");


				this.createDropdownFilter("divCharacter", "character", "Character Name :", options, this.changeCharacter.bind(this), this.currentCharName);
				this.createDropdown("divCharacter", "characterType", "Character Type :", ["dynamic_character", "neutral_boy", "neutral_girl", "outfit"], this.changeType.bind(this), "dynamic_character");
				this.setValueDropdown("characterType", "none");

				// this.hideDressUP();
				this.createShowHide("divDressUp");
				this.createDropdown("divDressUp", "gender", "Gender :", ["girl", "boy"], this.changeGender.bind(this), this.currentGender);
				this.createButton("divDressUp", "btnRandom", "Random Character", this.randomCharacter.bind(this));
				this.createButton("btnbtnRandom", "btnSetNone", "Set None", this.setNoneDressUp.bind(this), false);

				this.loadPartAssets();
				this.loadAnimation();
				this.changeCharacter("character", this.currentCharName);
			}.bind(this))
		}.bind(this));



	},
	setNoneOutline: function() {
		this.changeColors("outlineName", "none");
	},
	exportCharacterData: function() {
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
			text: 'Character data has been logged to the console.',
		});
	},

	showImportModal: function() {
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

	importCharacterData: function(jsonString) {
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
				text: 'Invalid JSON data!',
			});
		}
	},
	showLoading: function(text = 'Loading...') {
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

	hideLoading: function() {
		var loadingOverlay = document.getElementById('loadingOverlay');
		if (loadingOverlay) {
			loadingOverlay.parentNode.removeChild(loadingOverlay);
		}
	},
	deleteAllNameProperties: function() {
		for (charName in this.charData) {
			delete this.charData[charName]["bgName"];
			delete this.charData[charName]["textName"];
			delete this.charData[charName]["outlineName"];

			_DATAGAME.spriterData[charName] = this.charData[charName];
		}

		this.saveCharacter();
	},

	createShowHide: function(divName, parent, isAppend = false) {
		var myParent = document.getElementById("divDeveloper");
		if (parent) myParent = document.getElementById(parent);

		var divShow = document.getElementById(divName);
		var div = document.createElement("div");
		var name = divName.substr(3);
		div.id = "divToggle" + name;
		divShow.style.display = "block";
		div.innerHTML = "[Hide " + name + "]";
		div.style.textDecoration = "underline";
		div.style.cursor = "pointer";
		div.onclick = function() {
			if (divShow.style.display === "none" || divShow.style.display == "") {
				divShow.style.display = "block";
				div.innerHTML = "[Hide " + name + "]";
			} else if (divShow.style.display === "block") {
				divShow.style.display = "none";
				div.innerHTML = "[Show " + name + "]";
			}
		}.bind(this);
		if (isAppend == true) {
			myParent.appendChild(div);
		} else
			myParent.insertBefore(div, divShow);
	},
	changeType: function(varName, value) {
		this.charData[this.currentCharName].type = value;
		this.checkType();
		this.showDressUP();
	},
	hideDressUP: function() {
		document.getElementById("divDressUp").style.display = "none";
	},
	showDressUP: function() {
		document.getElementById("divDressUp").style.display = "block";
	},
	setDefaultSpriterData: function(functComplete) {
		if (!_DATAGAME.spriterData.hasOwnProperty("amy") || !_DATAGAME.spriterData.hasOwnProperty("jack")) {
			_DATAGAME.spriterData["amy"] = {
				girl: convertFiles.copy(convertFiles.defaultOutfit.girl)
			};
			_DATAGAME.spriterData["jack"] = {
				girl: convertFiles.copy(convertFiles.defaultOutfit.girl),
				boy: convertFiles.copy(convertFiles.defaultOutfit.boy)
			};
		}
		exportFiles.readFile("media/text/customload.js", "_CUSTOMLOAD", function(obj, data) {
			convertFiles.engineVersion = "2.0.0";
			convertFiles.arrCustomLoad = obj.Chapter;
			var charDataLoad = convertFiles.createCharactersData({});
			var keysLoad = Object.keys(charDataLoad);

			exportFiles.readFile("script-converter/characters-data.js", "charData", function(obj, data) {
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

	loadAnimation: function() {
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
		// this.createAnimationNote();

		// Created here so that the buttons will be created at the bottom just before the dress up section
		this.createButton("divCharacter", "btnImportData", "Import Data", this.showImportModal.bind(this));
		this.createButton("btnbtnImportData", "btnExportData", "Export Data", this.exportCharacterData.bind(this), false);
	},

	checkEmotionandMouthFrown: function(char) {
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

	changeEmotion: function(varname, value) {

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

	loadPartAssets: function() {
		this.getFilesFromFolder("../../v2-visual-novel-assets/graphics/characters/" + this.currentGender, function(data) {
			this.duPart.forEach(function(key) {
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
			this.duPart.forEach(function(key) {
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

	randomCharacter: function() {
		this.duPart.forEach(function(key) {
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
	setNoneDressUp: function() {
		this.duPart.forEach(function(key) {
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

	changeHandheld: function(varName, value) {
		this.currentHandheld = value;
		if (value == "none") this.currentHandheld = "";

		this.changeAnimation("anim", this.currentAnimation);
	},
	changeAnimation: function(varName, value) {
		//loading all animations
		// Object.keys(ig.game.girlPreview.spriter.spriter.entities.items[0].animations.itemNames);
		this.currentAnimation = value;

		if (this.currentGender == "girl") {
			ig.game.girlPreview.changePose(value, this.currentHandheld);
		} else {
			ig.game.boyPreview.changePose(value, this.currentHandheld);
		}
		//         this.changeAllDU();
		this.changeEmotion("null", this.currentEmotion);
		this.createAnimationNote("animation is not used or not listed");
		var idxAnim = _DATAGAME.pose.indexOf(value);
		if (idxAnim >= 0) {
			this.createAnimationNote("");
		}
	},
	checkType: function() {
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
	changeCharacter: function(varName, value) {
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

	changeDU: function(varName, value) {
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
	changeAllDU: function() {
		// this.changeGender("gender",this.currentGender);

		for (var i = 0; i < this.duPart.length; i++) {
			this.changeDU(this.duPart[i]);
		}

	},
	changeGender: function(varName, value) {
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
	changeColors: function(varName, value) {
		this.charData[this.currentCharName][varName] = value;
		_DATAGAME.spriterData[this.currentCharName] = this.charData[this.currentCharName];
	},
	changeBackground: function(varName, value) {
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
		ig.game.bgPreviewBack.image.loadCallback = function() {
			ig.game.bgPreviewBack.repos();
		};
		ig.game.bgPreview.image.loadCallback = function() {
			ig.game.bgPreview.repos();
		};
		ig.game.sortEntitiesDeferred();
	},

	getFilesFromFolder: function(path, functComplete) {
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "script-converter/script-editor.php",
			data: {
				functionname: 'fetchFolderFiles',
				folderPath: path
			},
			success: function(data) {

				if (functComplete) functComplete(data);
			},
			error: function(e) {
				console.log(e);
			}

		});
	},

	// <input type="file" id="fileInput" webkitdirectory directory multiple>
	resetButtonNote: function() {
		this.createButtonNote("");
	},
	removeCharacter: function() {
		delete this.charData[this.currentCharName][this.currentGender];
		// for(obj in _DATAGAME.spriterData[this.currentCharName][this.currentGender]){
		//  this.charData[this.currentCharName][this.currentGender][obj]=_DATAGAME.spriterData[this.currentCharName][this.currentGender][obj];          
		// }

		var dataStr = "var charData=".concat(JSON.stringify(this.charData, null, 1), ";");
		exportFiles.exportFile('characters-data.js', dataStr, function() {
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
	clearBG: function() {
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
	exportPNG: function() {
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
	exportPNGWithTransparency: function(transparent, flipHorizontal, flipVertical) {
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
				_self.downloadCanvas(tempCanvas, function() {
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

	flipCanvas: function(canvas, flipHorizontal, flipVertical) {
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
	findContentBounds: function(ctx, width, height) {
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

	cropCanvasToContent: function(canvas) {
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

	downloadCanvas: function(canvas, callback, flipHorizontal, flipVertical) {
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
	saveCharacter: function() {
		//updating charData with current DU data

		//set charData and spriterData to dropdown value
		if (!_DATAGAME.spriterData[this.currentCharName][this.currentGender]) {
			_DATAGAME.spriterData[this.currentCharName][this.currentGender] = {};
			this.charData[this.currentCharName][this.currentGender] = {};
		}
		this.duPart.forEach(function(key) {
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
	checkDynamicCharacter: function() {
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

	createColorPick: function(parent, varName, text, functClick, isNewDiv = true) {
		var myParent;
		var div;
		if (isNewDiv == true) {
			if (document.getElementById(varName) != null) {
				document.getElementById("btn" + varName).remove();
			}
			myParent = document.getElementById((parent == null) ? "divDeveloperRight" : parent);
			div = document.createElement("div");
			myParent.appendChild(div);
			div.id = "colorpick" + varName;
		} else {
			div = document.getElementById((parent == null) ? "divDeveloperRight" : parent);
		}
		var input = document.createElement("input");
		div.innerHTML = text;
		input.type = "color";
		input.id = varName;
		div.style = "padding:0.5em;";
		input.value = "#000000";
		div.appendChild(input);
		input.addEventListener("change", (event) => {
			if (functClick != null) functClick(varName, event.target.value);
		});
		var valueDefault = this.charData[this.currentCharName][varName];
		input.value = valueDefault;
	},
	createDiv: function(parent, varName, divBefore, style = null) {
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
	createButton: function(parent, varName, text, functClick, isNewDiv = true) {
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
		button.style = "padding:1em; margin:1em;";
	},

	getValueDropdown: function(varName) {
		var selectList = document.getElementById(varName);
		if (selectList != null) {
			return selectList.value;
		}
		return null;
	},
	setValueDropdown: function(varName, value) {
		var selectList = document.getElementById(varName);

		if (selectList != null) {
			if (value == 'none' && selectList.type == 'color') value = '#000000'
			selectList.value = value;
			this.dropdownList[varName] = value;
		}
		ig.soundHandler.bgmPlayer.volume(0);
	},

	removeDropdown: function(varName) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		}
	},
	createEmoNote: function(text) {
		var label;
		if (document.getElementById("labelEmo") == null) {
			var myParent = document.getElementById("divemo");
			label = document.createElement("div");
			label.id = "labelEmo";
			label.style = "margin:1em";
			myParent.appendChild(label);
		} else label = document.getElementById("labelEmo");

		label.innerHTML = text;
	},
	createAnimationNote: function(text) {
		var label;
		if (document.getElementById("labelAnimation") == null) {
			var myParent = document.getElementById("divanimation");
			label = document.createElement("div");
			label.id = "labelAnimation";
			label.style = "margin:1em";
			myParent.appendChild(label);
		} else label = document.getElementById("labelAnimation");

		label.innerHTML = text;
	},
	createLabel: function(par, varName, text, fontSize) {
		var label;
		var myParent = document.getElementById(par);
		if (document.getElementById("label" + varName) == null) {

			label = document.createElement("div");
			label.id = "label" + varName;
			// label.style="margin:1em";
			myParent.appendChild(label);
		} else label = document.getElementById("label" + varName);
		if (fontSize) label.style = "fontSize:" + fontSize;
		label.innerHTML = text;
	},

	createButtonNote: function(text) {
		var label;
		if (document.getElementById("labelSaveNotification") == null) {
			var myParent = document.getElementById("divDeveloper");
			label = document.createElement("div");
			label.id = "labelSaveNotification";
			label.style = "margin:1em";
			myParent.appendChild(label);
		} else label = document.getElementById("labelSaveNotification");

		label.innerHTML = text;
	},

	createDropdownFilter: function(par, varName, text, arrOptions, functChange, defaultValue) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		} else {
			if (arrOptions.length > 0) this.optionList[varName] = arrOptions;
		}
		if (arrOptions.length == 0) return;

		var myParent = document.getElementById(par);
		var div = document.createElement("div");
		div.id = "div" + varName;
		div.style = "margin:1em;";
		myParent.appendChild(div);
		div.innerHTML = text;

		var dataList = document.createElement("datalist");
		dataList.id = "data" + varName;
		arrOptions.forEach(value => {
			const option = document.createElement('option');
			option.value = value;
			dataList.appendChild(option);

		});
		div.appendChild(dataList);

		var selectList = document.createElement("input");
		selectList.type = "search";
		selectList.setAttribute('list', "data" + varName);
		selectList.id = varName;
		selectList.style = "padding:0.5em;";
		div.appendChild(selectList);

		selectList.addEventListener('focus', () => {
			selectList.select();

			selectList.value = '';
			setTimeout(() => {
				selectList.value = this.dropdownList[varName];
				selectList.select();
			}, 0);
		});

		// Optional: also trigger on click
		selectList.addEventListener('click', () => {
			selectList.select();

			selectList.value = '';
			setTimeout(() => {
				selectList.value = this.dropdownList[varName];
				selectList.select();
			}, 0);
		});


		selectList.addEventListener('change', function(event) {
			if (arrOptions.indexOf(event.target.value) >= 0) {
				if (functChange) {
					functChange(varName, event.target.value);
					this.setValueDropdown(varName, event.target.value);
				}
			}
		}.bind(this));
		selectList.addEventListener('blur', function() {
			const value = selectList.value.trim().toLowerCase();
			const match = arrOptions.find(item => item.toLowerCase() === value);
			const filtered = arrOptions.filter(opt => opt.toLowerCase().includes(value));

			if (!match) {

				selectList.value = filtered[0]; // fallback to top of list
				functChange(varName, filtered[0]);
				this.setValueDropdown(varName, filtered[0]);
			}
		}.bind(this));


		//         // Add Previous and Next buttons on all dropdowns EXCEPT character type, character name, and gender
		if (varName !== 'characterType' && varName !== 'character' && varName !== 'gender') {
			// Previous Button
			var prevButton = document.createElement("button");
			prevButton.innerHTML = "◄"; // Left-pointing arrow
			prevButton.style = "padding: 0.5em; margin-left: 0.5em; cursor: pointer;";
			prevButton.onclick = function() {
				// var currentIndex = selectList.selectedIndex;
				// var newIndex = (currentIndex - 1 + selectList.options.length) % selectList.options.length;
				// selectList.selectedIndex = newIndex;
				var currentIndex = arrOptions.indexOf(selectList.value);
				if (currentIndex >= 0) {
					var nextIndex = (currentIndex - 1 >= 0) ? currentIndex - 1 : 0;
					if (functChange) {
						selectList.value = arrOptions[nextIndex];
						functChange(varName, arrOptions[nextIndex]);
					}
				}
			};
			div.appendChild(prevButton);

			// Next Button
			var nextButton = document.createElement("button");
			nextButton.innerHTML = "►"; // Right-pointing arrow
			nextButton.style = "padding: 0.5em; margin-left: 0.2em; cursor: pointer;";
			nextButton.onclick = function() {
				// var currentIndex = selectList.selectedIndex;
				// var newIndex = (currentIndex + 1) % selectList.options.length;
				// selectList.selectedIndex = newIndex;
				// if (functChange) functChange(varName, selectList.value);                
				var currentIndex = arrOptions.indexOf(selectList.value);
				if (currentIndex >= 0) {
					var nextIndex = (currentIndex + 1 < arrOptions.length) ? currentIndex + 1 : currentIndex;
					if (functChange) {
						selectList.value = arrOptions[nextIndex];
						functChange(varName, arrOptions[nextIndex]);
					}
				}
			};
			div.appendChild(nextButton);
		}


		//         //Create and append the options
		//         for (var i = 0; i < arrOptions.length; i++) {
		//             var option = document.createElement("option");
		//             option.value = arrOptions[i];
		//             option.text = arrOptions[i];
		//             selectList.appendChild(option);
		//         }
		if (defaultValue) {
			// selectList.value=defaultValue;
			this.setValueDropdown(varName, defaultValue);
		} else if (this.charData[this.currentCharName] && this.charData[this.currentCharName][this.currentGender]) {
			if (!this.charData[this.currentCharName][this.currentGender][varName]) this.charData[this.currentCharName][this.currentGender][varName] = varName + "-none";
			this.setValueDropdown(varName, this.charData[this.currentCharName][this.currentGender][varName]);
			//             if(!this.charData[this.currentCharName][this.currentGender][varName])this.charData[this.currentCharName][this.currentGender][varName]=varName+"-none";
			//             selectList.value=this.charData[this.currentCharName][this.currentGender][varName];
		}
		//        else selectList.selectedIndex=0;
		else selectList.value = arrOptions[0];
		ig.soundHandler.bgmPlayer.volume(0);
	},

	createDropdown: function(par, varName, text, arrOptions, functChange, defaultValue) {
		if (document.getElementById(varName) != null) {
			document.getElementById("div" + varName).remove();
		} else {
			if (arrOptions.length > 0) this.optionList[varName] = arrOptions;
		}
		if (arrOptions.length == 0) return;

		var myParent = document.getElementById(par);
		var div = document.createElement("div");
		div.id = "div" + varName;
		div.style = "margin:1em;";
		myParent.appendChild(div);
		div.innerHTML = text;

		var selectList = document.createElement("select");
		selectList.id = varName;
		selectList.style = "padding:0.5em;";
		div.appendChild(selectList);


		selectList.addEventListener('change', function(event) {
			if (functChange) functChange(varName, event.target.value);
		});

		// Add Previous and Next buttons on all dropdowns EXCEPT character type, character name, and gender
		if (varName !== 'characterType' && varName !== 'character' && varName !== 'gender') {
			// Previous Button
			var prevButton = document.createElement("button");
			prevButton.innerHTML = "◄"; // Left-pointing arrow
			prevButton.style = "padding: 0.5em; margin-left: 0.5em; cursor: pointer;";
			prevButton.onclick = function() {
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
			nextButton.onclick = function() {
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
}