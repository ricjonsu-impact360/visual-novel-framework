ig.module('game.entities.buttons.button-save-preview')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonSavePreview = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			size: {
	            x: 477*_DATAGAME.ratioRes,
	            y: 480*_DATAGAME.ratioRes
	        },
	        sizeBGTitle: {
	            x: 438*_DATAGAME.ratioRes,
	            y: 50*_DATAGAME.ratioRes
	        },
	        roundedTag:5*_DATAGAME.ratioRes,
			textButton:'Encounter',
			noButton:0,
			zIndex:_DATAGAME.zIndexData.buttonSavePreview,
			noSlot:1,
			idxSlot:0,
			isClickable:true,
			imgPanel:new ig.Image(_RESOURCESINFO.image.chapterPanel),
			isHover:false,
			imgThumbnail:new ig.Image(_RESOURCESINFO.image.crown),
			multiplierFontHeight:1.1,

			paddingText:{x:40*_DATAGAME.ratioRes, y:40*_DATAGAME.ratioRes},

			fontSize: {
				title : Math.round(55*0.7*_DATAGAME.ratioRes),
				desc : Math.round(55*0.5*_DATAGAME.ratioRes)
			},

			desc:[],
			widthTag:[ 0, 0, 0, 0, 0, 0, 0],

			fontSizeDesc : 50,

			posButton:{x:0, y:0},

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				// if(_DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptercorner != null) {
				// 	this.rounded = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptercorner*_DATAGAME.ratioRes;
				// }

				this.fontSize = {
					title : Math.round(ig.game.fontNameSize*0.7*_DATAGAME.ratioRes*ig.game.fontRatio),
					desc : Math.round(ig.game.fontNameSize*0.55*_DATAGAME.ratioRes*ig.game.fontRatio)
				};

				this.halfSize = {
	                x:this.size.x/2,
	                y:this.size.y/2
	            };

				if (ig.global.wm) {
					return;
				}

				this.defPos = { x:-this.halfSize.x, y:-this.halfSize.y };
				// this.posBGTitle = { x:this.posThumbnail.x, y:this.posThumbnail.y + this.sizeThumbnail.y - this.sizeBGTitle.y + _DATAGAME.ratioRes};

				this.repos();
			},

			clicked:function(){ 
				if(this.visible && this._parent.visible && this.isClickable && !this._parent.isWarning)
				{ 
					// this.noChapter = ig.game.chapter_list[this.idxChapter].chapterID;

					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();

					
					ig.game.slotSelected = { no:this.noSlot, idx:this.idxSlot, numButton:this.noButton };
					if(ig.game.sessionData.saveSlot[this.idxSlot].currentChapter == null) {
						if(this._parent.stateSaveLoad == this._parent.STAT_SAVE) {
							this._parent.uiWarningSave.show('save');
						} 
					} else {
						if(this._parent.stateSaveLoad == this._parent.STAT_SAVE) {
							this._parent.uiWarningSave.show('replace');
						} else {
							this._parent.uiWarningSave.show('load');
						}
					}
					this._parent.uiWarningSave.repos();
					
					// this.addDUtoCustomLoad();

					// this.proceedToSelectedChapter();
				}
			},

			reloadInfo:function() {
				// this.imgThumbnail = new ig.Image(_BASEPATH.thumbnail + ig.game.chapter_list[this.idxChapter].thumbnail);

				// this.fontSizeDesc = Math.round(ig.game.fontNameSize*0.4*_DATAGAME.ratioRes*ig.game.fontRatio);

				// this.desc = ig.game.wordWrapLetter(ig.game.chapter_list[this.idxChapter].description, this.sizeBGTitle.x - (10*_DATAGAME.ratioRes*2), this.fontSizeDesc, ig.game.fontNameThin);

				var dataSlot = ig.game.sessionData.saveSlot[this.idxSlot];

				if(dataSlot.currentChapter != null) {
					var _numDialog = dataSlot.historyLog['chapter' + dataSlot.currentChapter][0];
					var tempText = '';
	            	if(_numDialog >= 0 && _STRINGS["Chapter" + dataSlot.currentChapter] != null) {
	            		var _storyBubble = _STRINGS["Chapter" + dataSlot.currentChapter][_numDialog];
	                    var charName = _storyBubble.charTalk;
	                    var nameTag = _storyBubble.nameTag;

	                    if(charName == 'none') {
	                        charName = _STRINGS.Log.none;

	                        if(nameTag != null) {
	                            if(nameTag.toLowerCase() == 'amy') {
	                                charName = ig.game.sessionData.playerName;
	                            } else if(_DATAGAME.neutral_girl.indexOf(nameTag) < 0 && _DATAGAME.neutral_boy.indexOf(nameTag) < 0) {
	                                if(_STRINGS.dynamic_character[nameTag] != null){
	                                    charName = _STRINGS.dynamic_character[nameTag][ig.game.sessionData.loveInterest];
	                                } else {
	                                    charName = nameTag;
	                                }
	                            } else {
	                                charName = nameTag;
	                            }
	                        }
	                    } else {
	                        if(charName.toLowerCase() == 'amy') {
	                            charName = ig.game.sessionData.playerName;
	                        } else if(_DATAGAME.neutral_girl.indexOf(charName) < 0 && _DATAGAME.neutral_boy.indexOf(charName) < 0) {
	                            charName = _STRINGS.dynamic_character[charName][ig.game.sessionData.loveInterest];
	                        }
	                    }

	                    tempText = charName + ' : ' + _STRINGS["Chapter" + dataSlot.currentChapter][_numDialog].text;
	            	} else {
	                    tempText = _STRINGS.Log.none + ' : ' + _numDialog;
	            	}

	            	this.textDialog = ig.game.removeFormatDialog(
	                    tempText, 
	                    this.size.x - (this.paddingText.x * 2), 
	                    this.fontSize.desc, 
	                    ig.game.fontNameThin, 
	                    true
	                );
	            }
			},

			draw:function() {
				var c = ig.system.context;
				if(this._parent.visible && this.visible) {
	                c.save();
	                c.translate(this.pos.x+this.halfSize.x+this.offset.x, this.pos.y+this.halfSize.y + this.offset.y);

	                if (this.underPointer() && !this._parent.isWarning) {
	                	c.scale(0.97, 0.97);
	                } else {
	                	c.scale(1, 1);
	                }	                

	                this.imgPanel.draw(this.defPos.x, this.defPos.y);

	                var startX = this.defPos.x + this.paddingText.x;
	                var startY = this.defPos.y + this.paddingText.y;

	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textsaveui;
	                c.font = this.fontSize.title + "px " + ig.game.fontName;
	                c.textAlign = 'left';
	                c.textBaseline = 'top';
	                c.fillText(_STRINGS.Save.slot + ' ' + this.noSlot, startX, startY);

	                var dataSlot = ig.game.sessionData.saveSlot[this.idxSlot];
	                if(dataSlot.currentChapter == null) {
	                	c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textsaveui;
		                c.font = this.fontSize.title + "px " + ig.game.fontName;
		                c.textAlign = 'center';
		                c.textBaseline = 'middle';
	                	c.fillText(_STRINGS.Save.empty, 0, 0);
	                } else {
	                	c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].textsaveui;
		                c.font = this.fontSize.desc + "px " + ig.game.fontNameThin;
		                c.textAlign = 'left';
		                c.textBaseline = 'top';

		                startY += this.fontSize.title * 1.5;
	                	c.fillText(_STRINGS.Save.chapter + ' ' + dataSlot.currentChapter, startX, startY);

	                	startY += this.fontSize.desc * this.multiplierFontHeight;
	                	c.fillText(_STRINGS.Save.months[dataSlot.month] + ' ' + dataSlot.date, startX, startY);

	                	startY += this.fontSize.desc * this.multiplierFontHeight;
	                	c.fillText(dataSlot.time, startX, startY);

	                	startY += this.fontSize.desc * this.multiplierFontHeight * 2;
	                	ig.game.drawText(this.textDialog, this.fontSize.desc, c, startX, startY, this.multiplierFontHeight);
	                }
	                c.restore();
	            }
			},

			repos: function () {
				this.pos = {
					x : ig.game.midX - this.halfSize.x + this.posButton.x,
					y : ig.game.midY - this.halfSize.y + this.posButton.y + this._parent.offset.y
				};
			}
		});
	});