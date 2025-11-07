ig.module('game.entities.buttons.button-chapter-non-linear')
	.requires(
		'game.entities.buttons.button-chapter',
		'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonChapterNonLinear = EntityButtonChapter.extend({
			type: ig.Entity.TYPE.A,
			size: {
	            x: 477*_DATAGAME.ratioRes,
	            y: 480*_DATAGAME.ratioRes
	        },
	        sizeThumbnail: {
	            x: Math.round(534*0.82*_DATAGAME.ratioRes),
	            y: Math.round(402*0.82*_DATAGAME.ratioRes)
	        },
	        sizeBGTitle: {
	            x: 438*_DATAGAME.ratioRes,
	            y: 50*_DATAGAME.ratioRes
	        },
	        sizeLock: {
	            x: Math.round(47*0.7*_DATAGAME.ratioRes),
	            y: Math.round(57*0.7*_DATAGAME.ratioRes)
	        },
	        sizeCheck: {
	            x: Math.round(50*0.7*_DATAGAME.ratioRes),
	            y: Math.round(50*0.7*_DATAGAME.ratioRes)
	        },
	        roundedTag:5*_DATAGAME.ratioRes,
			textButton:'Encounter',
			noButton:0,
			zIndex:_DATAGAME.zIndexData.buttonChapterNonLinear,
			noChapter:1,
			idxChapter:0,
			isClickable:true,
			imgPanel:new ig.Image(_RESOURCESINFO.image.chapterPanel),
			imgCrown:new ig.Image(_RESOURCESINFO.image.crown),
			isHover:false,
			imgThumbnail:new ig.Image(_RESOURCESINFO.image.crown),

			imgLock:new ig.Image(_RESOURCESINFO.image.lockChapter),
			imgCheck:new ig.Image(_RESOURCESINFO.image.checkChapter),

			desc:[],
			widthTag:[ 0, 0, 0, 0, 0, 0, 0],

			fontSizeDesc : 50,

			posButton:{x:0, y:0},

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				// if(_DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptercorner != null) {
				// 	this.rounded = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchaptercorner*_DATAGAME.ratioRes;
				// }

				this.halfSize = {
	                x:this.size.x/2,
	                y:this.size.y/2
	            };

				if (ig.global.wm) {
					return;
				}

				this.defPos = { x:-this.halfSize.x, y:-this.halfSize.y };
				this.posThumbnail = { x:-this.sizeThumbnail.x/2, y:this.defPos.y + 20*_DATAGAME.ratioRes};
				this.posBGTitle = { x:this.posThumbnail.x, y:this.posThumbnail.y + this.sizeThumbnail.y - this.sizeBGTitle.y + _DATAGAME.ratioRes};

				this.repos();
			},

			clicked:function(){  
				if(this.visible && this._parent.visible == true && this.isClickable && 
					(
						_DATAGAME.isLinearChapter == false || 
						(_DATAGAME.isLinearChapter == true && (
								(!_DATAGAME.lockPreviousChapter && ig.game.chapter_list[this.idxChapter].chapterID <= ig.game.sessionData.unlockChapter) ||
								(_DATAGAME.lockPreviousChapter && ig.game.chapter_list[this.idxChapter].chapterID == ig.game.sessionData.unlockChapter)
							)
						)
					)
				) {
				// if(this.visible && this._parent.visible == true && this.isClickable)
				// { 
					this.noChapter = ig.game.chapter_list[this.idxChapter].chapterID;

					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();

					this.addDUtoCustomLoad();

					this.proceedToSelectedChapter();
				}
			},

			reloadInfo:function() {
				this.imgThumbnail = new ig.Image(_BASEPATH.thumbnail + ig.game.chapter_list[this.idxChapter].thumbnail);

				this.fontSizeDesc = Math.round(ig.game.fontNameSize*0.4*_DATAGAME.ratioRes*ig.game.fontRatio);

				this.desc = ig.game.wordWrapLetter(ig.game.chapter_list[this.idxChapter].description, this.sizeBGTitle.x - (10*_DATAGAME.ratioRes*2), this.fontSizeDesc, ig.game.fontNameThin);
			},

			drawTag:function(c, _idxTag){
				var startX = this.posBGTitle.x + 10*_DATAGAME.ratioRes;
				var startY = this.posBGTitle.y + this.sizeBGTitle.y + 5*_DATAGAME.ratioRes;

				var plusWidth = 0;
				if(_idxTag > 0) {
					plusWidth = (5*_DATAGAME.ratioRes + this.widthTag[_idxTag-1]);
					startX += plusWidth;
				}

				var tagText = '#' + ig.game.chapter_list[this.idxChapter].tags[_idxTag].title;

				c.font = this.fontSizeDesc + 'px ' + ig.game.fontNameThin;
				var widthText = c.measureText(tagText).width;
				var heightText = this.fontSizeDesc;

				this.widthTag[_idxTag] = widthText + plusWidth;

				c.beginPath();
                c.moveTo(startX + this.roundedTag, startY);
                c.lineTo(startX + widthText - this.roundedTag, startY);
                c.quadraticCurveTo(startX + widthText, startY, startX + widthText, startY + this.roundedTag);
                c.lineTo(startX + widthText, startY + heightText + - this.roundedTag);
                c.quadraticCurveTo(startX + widthText, startY + heightText, startX + widthText - this.roundedTag, startY + heightText);
                c.lineTo(startX + this.roundedTag, startY + heightText);
                c.quadraticCurveTo(startX, startY + heightText, startX, startY + heightText - this.roundedTag);
                c.lineTo(startX, startY + this.roundedTag);
                c.quadraticCurveTo(startX, startY, startX + this.roundedTag, startY);
                c.closePath();
                c.fillStyle = ig.game.chapter_list[this.idxChapter].tags[_idxTag].color;
                c.fill();

                c.textAlign = 'center';
                c.textBaseline = "middle";
                c.font = this.fontSizeDesc*0.9 + 'px ' + ig.game.fontNameThin;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterNLtag;
                c.fillText(tagText, startX + widthText/2, startY + heightText/2);
			}, 

			draw:function() {
				var c = ig.system.context;
				if(this._parent.visible && this.visible) {
	                c.save();
	                c.translate(this.pos.x+this.halfSize.x+this.offset.x, this.pos.y+this.halfSize.y + this.offset.y);

	                if (this.underPointer()) {
	                	c.scale(0.97, 0.97);
	                } else {
	                	c.scale(1, 1);
	                }	                

	                this.imgPanel.draw(this.defPos.x, this.defPos.y);

	                this.imgThumbnail.draw(this.posThumbnail.x, this.posThumbnail.y, 0, 0, this.imgThumbnail.width, this.imgThumbnail.height, this.sizeThumbnail.x, this.sizeThumbnail.y);

	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterNLtitlebg;
	                
	                c.globalAlpha = 0.6;
	                if(_DATAGAME.isLinearChapter) {
	                	if(ig.game.chapter_list[this.idxChapter].chapterID > ig.game.sessionData.unlockChapter) {
		                	c.fillRect(this.posThumbnail.x, this.posThumbnail.y, this.sizeThumbnail.x, this.sizeThumbnail.y);
		                }
	                }

	                c.globalAlpha = 0.7;
	                c.fillRect(this.posBGTitle.x, this.posBGTitle.y, this.sizeBGTitle.x, this.sizeBGTitle.y);

	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterNLtitle;
	                c.globalAlpha = 1;
	                c.font = Math.round(ig.game.fontNameSize*0.58*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;
	                c.textBaseline = "middle";

	                if(_DATAGAME.isLinearChapter) {
	                	c.fillText(_STRINGS.Chapter.chapter + ' ' + ig.game.chapter_list[this.idxChapter].chapterID, this.posBGTitle.x + 10*_DATAGAME.ratioRes, this.posBGTitle.y + (this.sizeBGTitle.y/2) + 4*_DATAGAME.ratioRes);
	                	// + ' : ' + ig.game.chapter_list[this.idxChapter].title
	                } else {
		                c.fillText(ig.game.chapter_list[this.idxChapter].title, this.posBGTitle.x + 10*_DATAGAME.ratioRes, this.posBGTitle.y + (this.sizeBGTitle.y/2) + 4*_DATAGAME.ratioRes);
		            }

	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnchapterNLinfo;
	                c.font = this.fontSizeDesc + "px " + ig.game.fontNameThin;
	                c.textBaseline = "top";
	                ig.game.drawText(this.desc, this.fontSizeDesc, c, this.posBGTitle.x + 10*_DATAGAME.ratioRes, this.posBGTitle.y + this.sizeBGTitle.y + 5*_DATAGAME.ratioRes * 2 + this.fontSizeDesc, 1);

	                for(var tag=0;tag<ig.game.chapter_list[this.idxChapter].tags.length;tag++) {
	                	this.drawTag(c, tag);
	                }

	                if(_DATAGAME.isLinearChapter) {
	                	if(ig.game.chapter_list[this.idxChapter].chapterID > ig.game.sessionData.unlockChapter) {
		                	this.imgLock.draw(this.posBGTitle.x + this.sizeBGTitle.x - this.sizeLock.x - 10*_DATAGAME.ratioRes, this.posBGTitle.y + this.sizeBGTitle.y/2 - this.sizeLock.y/2, 0, 0, this.imgLock.width, this.imgLock.height, this.sizeLock.x, this.sizeLock.y);
		                } else if(ig.game.chapter_list[this.idxChapter].chapterID < ig.game.sessionData.unlockChapter && _DATAGAME.lockPreviousChapter) {
		                	this.imgCheck.draw(this.posBGTitle.x + this.sizeBGTitle.x - this.sizeCheck.x - 10*_DATAGAME.ratioRes, this.posBGTitle.y + this.sizeBGTitle.y/2 - this.sizeCheck.y/2, 0, 0, this.imgCheck.width, this.imgCheck.height, this.sizeCheck.x, this.sizeCheck.y);
		                }
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