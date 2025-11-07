ig.module('game.entities.buttons.button-play')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonPlay = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			image: new ig.Image(_RESOURCESINFO.image.btnBlank, 384*_DATAGAME.ratioRes, 114*_DATAGAME.ratioRes),
			size: {
				x: 384*_DATAGAME.ratioRes,
				y: 114*_DATAGAME.ratioRes,
			},
			halfSize:null,
			zIndex:_DATAGAME.zIndexData.buttonOnMenu,
			noCoba:0,

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				this.halfSize = {
                    x: this.size.x / 2,
                    y: this.size.y / 2
                }

				if (ig.global.wm) {
					return;
				}

				this.repos();
			},

			draw:function() {
	            this.parent();
                
                var c = ig.system.context;
				c.save();
				c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
				this.image.draw(0, 0);

				var _fontSize = Math.round(ig.game.fontNameSize*1*_DATAGAME.ratioRes * ig.game.fontRatio);
				c.font = ig.game.fontNameWeight + ' ' + _fontSize + 'px ' + ig.game.fontName;
				c.textAlign = 'center';
				c.textBaseline = 'middle';
				c.fillStyle = ig.game.buttonTextColor;
				c.fillText(_STRINGS['Button']['play'], this.halfSize.x, this.halfSize.y + ig.game.checkArialOffset(_fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes));
				
				c.restore();
	        },

	        funcComplete:function() {
	        	if(!_DATAGAME.chapters.multipleChapter) {
					ig.game.fadeInWindow(LevelGame);
	        	} else {
		        	if(_DATAGAME.isCheat) {
		        		ig.game.numChapter = 1;
						ig.game.fadeInWindow(LevelGame);
		        	} else {
		        		this._parent.uiChapter.show();
		        	}
		        }
			},

			clicked:function(){ 
				if(this.visible && this.isClickable && (ig.game.transition == null || !ig.game.transition.isRunning)) {
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();


					if(!_DATAGAME.chapters.multipleChapter) {
						ig.game.boolChooseChapter = true;
						this.addDUtoCustomLoad();
						this.proceedToSelectedChapter();
					}
					
					// ig.game.spawnNotification("Not enough money!");
					// ig.game.spawnNotification("Not enough money!<br>Not enough money!<br>Not enough money!");
					
					// ig.game.spawnNotification("Hey! I can't believe to meet | \"color\":\"#FF3333\", \"format\":\"bold italic\" | you | RESET | here! Not enough money! Not enough money! Not enough money!");

					// if(this.noCoba == 3) {
					// 	EntityProgressBar.progressBarArr[1].tweenFadeOut();
					// } else {
					// 	var _position = ig.system.height * 0.95;

			  //           ig.game.spawnEntity(EntityProgressBar, 0, _position, { 
			  //           		id:'bar'+ this.noCoba,
			  //           		zIndex: _DATAGAME.zIndexData.progressBar, 
			  //                   barPosition:'bottom',
			  //                   prevPos: {x:ig.system.width * 0.5, y:_position},
			  //                   defPos : {x:ig.system.width * 0.5, y:_position}
			  //               });
			  //       }
			  //       this.noCoba++;
		   //          console.log(EntityProgressBar.progressBarArr[0].id);


				}
			},

			proceedToSelectedChapter:function() {
				ig.game.numChapter = 1;
				if(ig.game.statusLoad[ig.game.numChapter] == null) { ig.game.statusLoad[ig.game.numChapter] = 0; }
				this._parent.enabledButton(false);
			},

			addDUtoCustomLoad:function() {
				this.noChapter = 1;
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

			clicking:function(){
				
			},

			released:function(){
				// ig.soundHandler.sfxPlayer.play('click');
			},

			repos: function () {
				this.pos.x = ig.game.midX-this.halfSize.x;
                this.pos.y = ig.game.midY+100*_DATAGAME.ratioRes;
			}
		});
	});