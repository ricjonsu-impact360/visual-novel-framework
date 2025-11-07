ig.module('game.entities.buttons.button-chapter')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonChapter = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			size: {
	            x: 485*_DATAGAME.ratioRes,
	            y: 115*_DATAGAME.ratioRes
	        },
	        rounded:15*_DATAGAME.ratioRes,
			textButton:'Encounter',
			noButton:0,
			zIndex:_DATAGAME.zIndexData.buttonChapter,
			noChapter:1,
			isClickable:true,
			imgLock:new ig.Image(_RESOURCESINFO.image.lock),
			imgCrown:new ig.Image(_RESOURCESINFO.image.crown),
			imgCheck:new ig.Image(_RESOURCESINFO.image.checkChapter),

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				if(_DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptercorner != null) {
					this.rounded = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptercorner*_DATAGAME.ratioRes;
				}

				this.halfSize = {
	                x:this.size.x/2,
	                y:this.size.y/2
	            };

				if (ig.global.wm) {
					return;
				}

				this.repos();
			},

	        funcComplete:function() {
	        	ig.game.fadeInWindow(LevelGame);
				// ig.game.director.jumpTo(LevelGame);
			},

			clicked:function(){
				if(this.visible && this._parent.visible == true && this.isClickable && 
					(
						_STRINGS.Chapter.title[this.noChapter] != null && 
						(
							(!_DATAGAME.lockPreviousChapter && this.noChapter <= ig.game.sessionData.unlockChapter) ||
							(_DATAGAME.lockPreviousChapter && this.noChapter == ig.game.sessionData.unlockChapter)
						)
					)
				) {
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();

					this.addDUtoCustomLoad();

					this.proceedToSelectedChapter();
				}
			},

			proceedToSelectedChapter:function() {
				ig.game.numChapter = this.noChapter;
				if(ig.game.statusLoad[ig.game.numChapter] == null) { ig.game.statusLoad[ig.game.numChapter] = 0; }
				this._parent.enabledButton(false);
			},

			addDUtoCustomLoad:function() {
				//ADD DU TO CUSTOM LOAD
				var arrChar = _CUSTOMLOAD.Chapter[this.noChapter].duTheme;
				if(arrChar == null)  arrChar = [];

				if(_DATAGAME.firstMCOutfit['chapter' + this.noChapter] != null && _DATAGAME.firstMCOutfit['chapter' + this.noChapter] != "") {
					var outfit = _DATAGAME.firstMCOutfit['chapter' + this.noChapter];
					var idxOutfit = arrChar.findIndex(function(item) {
						return (item.toLowerCase() == outfit.toLowerCase());
					});

					if(_DATAGAME.firstMCOutfit['chapter' + this.noChapter] != "" && _DATAGAME.firstMCOutfit['chapter' + this.noChapter].toLowerCase() != "default" && idxOutfit < 0) {
						_CUSTOMLOAD.Chapter[this.noChapter].duTheme.push(_DATAGAME.firstMCOutfit['chapter' + this.noChapter]);
					}
				}

				var lastDU = (ig.game.sessionData.dressUpTheme[this.noChapter - 1] == null) ? 'amy' : ig.game.sessionData.dressUpTheme[this.noChapter - 1].last;
				var idxLastDU = arrChar.findIndex(function(item) {
					return (item.toLowerCase() == lastDU.toLowerCase());
				});

				if(this.noChapter >= 2 && ig.game.sessionData.dressUpTheme[this.noChapter - 1] != null && ig.game.sessionData.dressUpTheme[this.noChapter - 1].last != null && idxLastDU < 0) {
					_CUSTOMLOAD.Chapter[this.noChapter].duTheme.push(ig.game.sessionData.dressUpTheme[this.noChapter - 1].last);
				}
				//END OF ADD DU TO CUSTOM LOAD
			},

			openQueenPack:function() {
				ig.game.currentWindow.uiChapterVisibility = true;
				ig.game.currentWindow.uiChapter.hide();
				ig.game.currentWindow.packPlugin.onClicked();
			},

			clicking:function(){
				
			},

			released:function(){
				// ig.soundHandler.sfxPlayer.play('click');
			},

			draw:function() {
				var c = ig.system.context;
				if(this._parent.visible) {
	                c.save();
	                c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);

					var startX = 0;
	                var startY = 0;

	                c.beginPath();
	                c.moveTo(startX + this.rounded, startY);
	                c.lineTo(startX + this.size.x - this.rounded, startY);
	                c.quadraticCurveTo(startX + this.size.x, startY, startX + this.size.x, startY + this.rounded);
	                c.lineTo(startX + this.size.x, startY + this.size.y - this.rounded);
	                c.quadraticCurveTo(startX + this.size.x, startY + this.size.y, startX + this.size.x - this.rounded, startY + this.size.y);
	                c.lineTo(startX + this.rounded, startY + this.size.y);
	                c.quadraticCurveTo(startX, startY + this.size.y, startX, startY + this.size.y - this.rounded);
	                c.lineTo(startX, startY + this.rounded);
	                c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
	                c.closePath();
	                c.fillStyle = (_STRINGS.Chapter.title[this.noChapter] != null && this.noChapter <= ig.game.sessionData.unlockChapter) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterbg : _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterbggray;
	                c.fill();

	                c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.69*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
	                c.fillStyle = (_STRINGS.Chapter.title[this.noChapter] != null && this.noChapter <= ig.game.sessionData.unlockChapter) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptertitle : _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterinfogray;
	                c.textAlign = 'left';

	                if(_STRINGS.Chapter.title[this.noChapter] != null) {
	                	c.fillText(_STRINGS.Chapter.chapter + ' ' + this.noChapter, startX + 20*_DATAGAME.ratioRes, startY + 50*_DATAGAME.ratioRes);
	                } else {
	                	c.fillText(_STRINGS.Chapter.soon, startX + 20*_DATAGAME.ratioRes, startY + 50*_DATAGAME.ratioRes);
	                }
	                
	                c.font = Math.round(ig.game.fontNameSize*0.58*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontNameThin;
	                c.fillStyle = (_STRINGS.Chapter.title[this.noChapter] != null && this.noChapter <= ig.game.sessionData.unlockChapter) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterinfo : _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterinfogray;
	                c.textAlign = 'left';
	                if(_STRINGS.Chapter.title[this.noChapter] != null) {
	                	c.fillText(_STRINGS.Chapter.title[this.noChapter], startX + 20*_DATAGAME.ratioRes, startY + 90*_DATAGAME.ratioRes);
	                }

	                if(_STRINGS.Chapter.title[this.noChapter] != null) {
	                	if(this.noChapter > ig.game.sessionData.unlockChapter) {
		                	this.imgLock.draw(startX + this.size.x - this.imgLock.width - 20*_DATAGAME.ratioRes, startY + this.size.y/2 - this.imgLock.height/2);
		                } else if(this.noChapter < ig.game.sessionData.unlockChapter && _DATAGAME.lockPreviousChapter) {
		                	this.imgCheck.draw(startX + this.size.x - this.imgCheck.width - 18*_DATAGAME.ratioRes, startY + this.size.y/2 - this.imgCheck.height/2);
		                }
	                }
	               
	                c.restore();
	            }
			},

			repos: function () {
				this.pos = {
					x : this._parent.pos.x-this._parent.halfSize.x + this._parent.halfSize.x - this.size.x/2,
					y : this._parent.pos.y-this._parent.halfSize.y + (this.noButton*(142*_DATAGAME.ratioRes)) + 45*_DATAGAME.ratioRes
				};
			}
		});
	});