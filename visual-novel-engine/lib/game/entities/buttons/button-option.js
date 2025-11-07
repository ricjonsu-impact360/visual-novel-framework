ig.module('game.entities.buttons.button-option')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonOption = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			size: {
				x: (510 + 120 + 10)*_DATAGAME.ratioRes,
				y: 120*_DATAGAME.ratioRes
			},
			sizeOption: {
				x: 510*_DATAGAME.ratioRes,
				y: 120*_DATAGAME.ratioRes
			},
			sizeCurrency: {
				x: 170*_DATAGAME.ratioRes,
				y: 120*_DATAGAME.ratioRes
			},
			distButton:10*_DATAGAME.ratioRes,
			rounded:15*_DATAGAME.ratioRes,
			halfSize:null,
			zIndex:_DATAGAME.zIndexData.buttonOption,
			alpha:1,
			textButton:'',
			fontSize:30*_DATAGAME.ratioRes,
			fontSizeCost:35*_DATAGAME.ratioRes,
			hasClick:false,
			noOption:1,
			dummy:0,
			enabled:true,
			cost:0, 
			costType:-1,
			posX:0,
			iconCurrency:new ig.Image(_BASEPATH.ui + _DATAGAME.uiTheme + '/rv-icon.png'),
			chatBubble:null,
			startXDef:0,
			isHover:false,
			isMouseOver:false,

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				if(_DATAGAME.uiColor[_DATAGAME.uiTheme].optioncorner != null) {
					this.rounded = _DATAGAME.uiColor[_DATAGAME.uiTheme].optioncorner*_DATAGAME.ratioRes;
				}
				
				if(_DATAGAME.optionButton.corner >= 0) {
					this.rounded = _DATAGAME.optionButton.corner * _DATAGAME.ratioRes;
				}

				this.reloadSize();

				if (ig.global.wm) {
					return;
				}

				this.repos();
			},

			reloadSize:function() {
				if(this._parent.optionType == 'du') {
					this.size = {
						x: 300*_DATAGAME.ratioRes,
						y: (this.costType != -1) ? 60*_DATAGAME.ratioRes + this.distButton + 60*_DATAGAME.ratioRes : 60*_DATAGAME.ratioRes
					};
					this.sizeOption = {
						x: 300*_DATAGAME.ratioRes,
						y: 60*_DATAGAME.ratioRes
					};
					this.sizeCurrency= {
						x: 170*_DATAGAME.ratioRes,
						y: 60*_DATAGAME.ratioRes
					};

					this.halfSize = {
	                    x: this.size.x / 2,
	                    y: this.size.y / 2
	                }

	                this.halfSizeOption = {
	                    x: this.sizeOption.x / 2,
	                    y: this.sizeOption.y / 2
	                }
				} else {
					if(this.costType == -1) {
						this.size = {
							x: this.sizeOption.x,
							y: 120*_DATAGAME.ratioRes
						};
						this.posX = (this.sizeCurrency.x + this.distButton)/2;
					} else {
						this.size = {
							x: this.sizeOption.x + this.sizeCurrency.x + this.distButton,
							y: 120*_DATAGAME.ratioRes
						};
						this.posX = 0;
					}

					this.halfSize = {
	                    x: this.size.x / 2,
	                    y: this.size.y / 2
	                }

	                this.halfSizeOption = {
	                    x: this.sizeOption.x / 2,
	                    y: this.sizeOption.y / 2
	                }
	            }

	            if(this._parent.optionType == 'du') {
					this.startXDef = this.halfSizeOption.x - this.sizeCurrency.x/2;
					// startY += this.sizeOption.y + this.distButton;
				} else {
					this.startXDef = this.sizeOption.x + this.distButton;
				}

	            if(this.costType != -1) {
	            	if(this.costType == 0) {
						this.iconCurrency = new ig.Image(_BASEPATH.ui + _DATAGAME.uiTheme + '/rv-icon.png');
					} else {
						this.iconCurrency = new ig.Image(_RESOURCESINFO.image['vc' + this.costType]);

						var c = ig.system.context;
						c.font = this.fontSizeCost + 'px metromed';
						this.wCost = c.measureText(this.cost).width;
			            this.xCost = this.startXDef + this.sizeCurrency.x/2;
			            this.wAll = this.iconCurrency.width + 10*_DATAGAME.ratioRes + this.wCost;
			            this.xCostText = this.xCost - this.wAll/2 + this.iconCurrency.width + 10*_DATAGAME.ratioRes;
					}
	            }
			},

			hover:function() {
				this.isHover = true;
				this.isMouseOver = true;
				if(ig.game.currentWindow.optionSelectedByKeyboard != 0 && this.noOption != ig.game.currentWindow.optionSelectedByKeyboard) {
					ig.game.currentWindow.buttons['btnOption'+ ig.game.currentWindow.optionSelectedByKeyboard].isHover = false;
				}
				ig.game.currentWindow.optionSelectedByKeyboard = this.noOption;
			},

			leave:function() {
				if(this.isMouseOver) { 
					this.isHover = false;
					this.isMouseOver = false;
					ig.game.currentWindow.optionSelectedByKeyboard = 0;
				}
			},

			drawBox:function(c) {
				var startX = 0;
				var startY = 8*_DATAGAME.ratioRes;

				c.beginPath();
				c.moveTo(startX + this.rounded, startY);
				c.lineTo(startX + this.sizeOption.x - this.rounded, startY);
				c.quadraticCurveTo(startX + this.sizeOption.x, startY, startX + this.sizeOption.x, startY + this.rounded);
				c.lineTo(startX + this.sizeOption.x, startY + this.sizeOption.y - this.rounded);
				c.quadraticCurveTo(startX + this.sizeOption.x, startY + this.sizeOption.y, startX + this.sizeOption.x - this.rounded, startY + this.sizeOption.y);
				c.lineTo(startX + this.rounded, startY + this.sizeOption.y);
				c.quadraticCurveTo(startX, startY + this.sizeOption.y, startX, startY + this.sizeOption.y - this.rounded);
				c.lineTo(startX, startY + this.rounded);
				c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
				c.closePath();

				if(this.enabled) {
					c.fillStyle = (this.hasClick) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionclickshadow : 
					((this.isHover) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionhovershadow : _DATAGAME.uiColor[_DATAGAME.uiTheme].optionupshadow);
				} else {
					c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].optiongreyshadow;
				}
				
				c.fill();

				if(this.costType != -1) {
					startX = this.startXDef;

					if(this._parent.optionType == 'du') {
						startY += this.sizeOption.y + this.distButton;
					}
					c.beginPath();
					c.moveTo(startX + this.rounded, startY);
					c.lineTo(startX + this.sizeCurrency.x - this.rounded, startY);
					c.quadraticCurveTo(startX + this.sizeCurrency.x, startY, startX + this.sizeCurrency.x, startY + this.rounded);
					c.lineTo(startX + this.sizeCurrency.x, startY + this.sizeCurrency.y - this.rounded);
					c.quadraticCurveTo(startX + this.sizeCurrency.x, startY + this.sizeCurrency.y, startX + this.sizeCurrency.x - this.rounded, startY + this.sizeCurrency.y);
					c.lineTo(startX + this.rounded, startY + this.sizeCurrency.y);
					c.quadraticCurveTo(startX, startY + this.sizeCurrency.y, startX, startY + this.sizeCurrency.y - this.rounded);
					c.lineTo(startX, startY + this.rounded);
					c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
					c.closePath();

					if(this.enabled) {
						c.fillStyle = (this.hasClick) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionclickshadow : 
						((this.isHover) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionhovershadow : _DATAGAME.uiColor[_DATAGAME.uiTheme].optionupshadow);
					} else {
						c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].optiongreyshadow;
					}

					c.fill();
				}

				startX = 0;
				startY = 0;

				c.beginPath();
				c.moveTo(startX + this.rounded, startY);
				c.lineTo(startX + this.sizeOption.x - this.rounded, startY);
				c.quadraticCurveTo(startX + this.sizeOption.x, startY, startX + this.sizeOption.x, startY + this.rounded);
				c.lineTo(startX + this.sizeOption.x, startY + this.sizeOption.y - this.rounded);
				c.quadraticCurveTo(startX + this.sizeOption.x, startY + this.sizeOption.y, startX + this.sizeOption.x - this.rounded, startY + this.sizeOption.y);
				c.lineTo(startX + this.rounded, startY + this.sizeOption.y);
				c.quadraticCurveTo(startX, startY + this.sizeOption.y, startX, startY + this.sizeOption.y - this.rounded);
				c.lineTo(startX, startY + this.rounded);
				c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
				c.closePath();

				if(this.enabled) {
					c.fillStyle = (this.hasClick) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionclick : 
					((this.isHover) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionhover : _DATAGAME.uiColor[_DATAGAME.uiTheme].optionup);
				} else {
					c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].optiongrey;
				}

				c.fill();

				if(this.costType != -1) {
					startX = this.startXDef;
					if(this._parent.optionType == 'du') {
						startY = this.sizeOption.y + this.distButton;
					} 
					c.beginPath();
					c.moveTo(startX + this.rounded, startY);
					c.lineTo(startX + this.sizeCurrency.x - this.rounded, startY);
					c.quadraticCurveTo(startX + this.sizeCurrency.x, startY, startX + this.sizeCurrency.x, startY + this.rounded);
					c.lineTo(startX + this.sizeCurrency.x, startY + this.sizeCurrency.y - this.rounded);
					c.quadraticCurveTo(startX + this.sizeCurrency.x, startY + this.sizeCurrency.y, startX + this.sizeCurrency.x - this.rounded, startY + this.sizeCurrency.y);
					c.lineTo(startX + this.rounded, startY + this.sizeCurrency.y);
					c.quadraticCurveTo(startX, startY + this.sizeCurrency.y, startX, startY + this.sizeCurrency.y - this.rounded);
					c.lineTo(startX, startY + this.rounded);
					c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
					c.closePath();

					if(this.enabled) {
						c.fillStyle = (this.hasClick) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionclick : 
						((this.isHover) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optionhover : _DATAGAME.uiColor[_DATAGAME.uiTheme].optionup);
					} else {
						c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].optiongrey;
					}

					c.fill();
				}

				if(this.costType != -1) {
					if(this.costType == 0) {
						var imgW = this.iconCurrency.width;
						var imgH = this.iconCurrency.height;

						if(this._parent.optionType == 'du') {
							var sclRV = 0.73;
							this.iconCurrency.draw(startX + this.sizeCurrency.x/2 - this.iconCurrency.width/2*sclRV, startY + this.sizeCurrency.y/2 - this.iconCurrency.height/2*sclRV, 0, 0, imgW, imgH, imgW * sclRV, imgH * sclRV);
						} else {
							this.iconCurrency.draw(startX + this.sizeCurrency.x/2 - this.iconCurrency.width/2, startY + this.sizeCurrency.y/2 - this.iconCurrency.height/2);
						}
						
					} else {
						this.iconCurrency.draw(this.xCost - this.wAll/2, startY + this.sizeCurrency.y/2 - this.iconCurrency.height/2);
						
						c.font = this.fontSizeCost + 'px metromed';
						c.textAlign = 'left';
						c.fillStyle = (this.enabled) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optiontext:_DATAGAME.uiColor[_DATAGAME.uiTheme].optiontextgrey;
						c.fillText(this.cost, this.xCostText, startY + this.sizeCurrency.y/2+11*_DATAGAME.ratioRes);
					}
				}
			},

			spawnChatBubble:function(textBubble) {
				var tailLength = 30*_DATAGAME.ratioRes;
            	var tailWidth = 15*_DATAGAME.ratioRes;

            	var _tailXDirection = 1;
            	var _tailYDirection = (this.noOption == 3) ? 0 : 1;
            	var _stretchX = (this.noOption == 3) ? 1 : 0;
            	var _parentPosX = ig.sizeHandler.minW/2 - (this.sizeCurrency.x/2);
            	var _parentPosY = (this.noOption == 3) ? (ig.sizeHandler.minH/2 + this._parent.getBubbleHeight() + ((this.noOption-1)*(140*_DATAGAME.ratioRes)) - (this.sizeCurrency.y/2)) : (ig.sizeHandler.minH/2 + this._parent.getBubbleHeight() + ((this.noOption-1)*(140*_DATAGAME.ratioRes)) - this.sizeCurrency.y + 10*_DATAGAME.ratioRes);

            	if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') {
            		_parentPosY = (ig.sizeHandler.minH/2 + 0 + ((this.noOption-1)*(140*_DATAGAME.ratioRes)) - this.sizeCurrency.y + 10*_DATAGAME.ratioRes);
            	}

            	if(this._parent.optionType == 'du') {
            		_parentPosY = ig.sizeHandler.minH - 300*_DATAGAME.ratioRes;
            		if(this.noOption == 1) {
            			_parentPosX -= 200*_DATAGAME.ratioRes;
            			_tailXDirection = 0;
            			_tailYDirection = 1;
            			_stretchX = 0;
            		} else {
            			_parentPosX += 150*_DATAGAME.ratioRes;
            		}
            	}

	        	this.chatBubble = ig.game.spawnChatBubble(this, {
	                zIndex:_DATAGAME.zIndexData.chatBubbleOption,
	                chatBubbleDrawConfigs: {
	                    textConfigs: {
	                        fullText: textBubble,
	                        text: textBubble, // text display in chat bubble
	                        fillStyle: "black",
	                        textAlign: "left", // [center|left|right];
	                        fontSize: Math.round(ig.game.fontBubbleSize*1*_DATAGAME.ratioRes*ig.game.fontRatio),
	                        fontFamily: ig.game.fontBubbleThin
	                    },
	                    avatarConfigs: {
	                        image: null, // image display in chat bubble 
	                        size: {
	                            x: 100,
	                            y: 100
	                        }, // image size
	                        padding: {
	                            x: 4,
	                            y: 4
	                        } // extra space outside image
	                    },
	                    bubbleConfigs: {
	                        lineWidth: 4*_DATAGAME.ratioRes,
	                        fillStyle: "white",
	                        strokeStyle: "black",

	                        shadowColor: "black",
	                        shadowBlur: 0,
	                        shadowOffsetX: 0,
	                        shadowOffsetY: 0,

	                        box: {
	                            width: 100*_DATAGAME.ratioRes, // content min width
	                            height: 60*_DATAGAME.ratioRes, // content min height
	                            round: 30*_DATAGAME.ratioRes, // round curves distance
	                            padding: {
	                                x: 25*_DATAGAME.ratioRes,
	                                y: 30*_DATAGAME.ratioRes
	                            } // extra space outside the content area
	                        },
	                        tail: {
	                            length: tailLength, // tail length - no tail = 0
	                            width: tailWidth, // tail width - no tail = 0
	                            direction: {
	                                x: _tailXDirection,
	                                y: _tailYDirection, 
	                                stretchx:_stretchX,
	                                stretchy:0
	                            } // tail direction, will be update if input invalid (0-1)
	                        }
	                    }
	                },
	                chatBubbleAppearTime: 0.3, // appear time - second
	                chatBubbleAliveTime: 2, // alive time - second
	                chatBubbleDisappearTime: 0.3, // disappear time - second
	                chatBubblePercent: {
	                    x: 0.5,
	                    y: 0
	                }, // position percent of ChatBubbleParentEntity (0-1) related to the ChatBubbleParentEntity position and size
	                chatBubbleOffset: {
	                    x: 0,
	                    y: 0
	                }, // extra offset from position percent of ChatBubbleParentEntity
	                parentPos: {
	                    // x: this.pos.x + (this.size.x/2) - (this.sizeCurrency.x/2),
	                    // y: (this.noOption == 3) ? (this.pos.y - this.sizeCurrency.y/2 - 30) : (this.pos.y - this.sizeCurrency.y - 20)
	                    x:_parentPosX, 
	                    y:_parentPosY
	                },
	                chatBubbleAlpha: 1, // chat bubble alpha
	                boolNotif:true
	            });

	        },

			draw:function() {
	            this.parent();

	            if(this.costType >= 1 && this.costType <= _DATAGAME.totalVirtualCurrency && this.cost > ig.game.currentWindow["virtualCurrency" + this.costType]) {
	     	  		this.enabled = false;
	     	  	} else {
	     	  		this.enabled = true;
	     	  	}
                
                if(this.visible) {
	                var c = ig.system.context;
					c.save();
					c.globalAlpha = this.alpha;
					c.translate(this.pos.x+this.offset.x, this.pos.y+this.offset.y);

					this.drawBox(c);

					var _fontSize = Math.round(ig.game.fontNameSize*0.54*_DATAGAME.ratioRes*ig.game.fontRatio);
					c.font = _fontSize + 'px ' + ig.game.fontNameThin;
					c.textAlign = 'center';
					c.fillStyle = (this.enabled) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optiontext:_DATAGAME.uiColor[_DATAGAME.uiTheme].optiontextgrey;

					var wrapText = ig.game.wordWrap(this.textButton, this.sizeOption.x - 20*_DATAGAME.ratioRes, _fontSize, ig.game.fontNameThin);
					ig.game.drawText(wrapText, (this.fontSize*ig.game.fontRatio), c, this.halfSizeOption.x + 5*_DATAGAME.ratioRes, this.halfSizeOption.y + 10*_DATAGAME.ratioRes - ((wrapText.length - 1)*(this.fontSize*ig.game.fontRatio)* 1.1/2));
					// ig.game.drawText(wrapText, this.fontSize, c, this.halfSizeOption.x, this.halfSizeOption.y + 10 - ((wrapText.length - 1)*this.fontSize* 1.1/2));
					
					c.restore();
				}
	        },

	        showOption:function(boolShow, boolComplete) {
	        	if(boolShow) {
	        		this.hasClick = false;
	        		this.alpha = 0;
	        		this.visible = true;
	        		this.isClickable = false;
	        		this.enabled = true;
	        		this.tween(
						{
							alpha:1
						}, 0.2, {
		     	  		onComplete:function() {
		     	  			this.isClickable = true;
		     	  		}.bind(this)
		     	  	}).start();

		     	  	if(this.costType >= 1 && this.costType <= 3 && this.cost > ig.game.currentWindow["virtualCurrency" + this.costType]) {
		     	  		this.enabled = false;
		     	  	}
	        	} else {
	        		this.isClickable = false;
	        		this.tween(
						{
							alpha:0
						}, 0.1, {
							delay:0.3,
			     	  		onComplete:function() {
			     	  			this.visible = false;
			     	  			if(boolComplete) {
			     	  				if(this._parent.optionType == 'du') {
			     	  					this._parent.hideDU();
			     	  				} else {
			     	  					this._parent.isBubble = false;
			     	  					this._parent.loadBubbleOption();
			     	  				}
			     	  			}
			     	  		}.bind(this)
		     	  	}).start();
	        	}
	        },

	        funcComplete:function() {
	        	// ig.game.fadeInWindow(LevelGame);
				// ig.game.director.jumpTo(LevelGame);
			},

			clicked:function(){
				if(this.visible && this.isClickable) {			
					this.sinkingEffect();

					if (this.enabled) {
						if(this.costType == 0) {
							//call RV
							ig.soundHandler.sfxPlayer.play('click');
							this._parent.optionSelected = this.noOption;
							ig.tieredRV.rv_btn_pressed (5, ig.tieredRV);
						} else {
							if(this._parent.optionType == 'du') {
								var tempDU = this.textButton.replaceAll(" ", ""); 
								ig.game.sessionData.dressUpTheme[this._parent.numChapter].now = tempDU.toLowerCase();
								var idxChar = this._parent.arrChar.indexOf('Amy');
								this._parent['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpTheme[this._parent.numChapter].now);

								ig.game.currentWindow.saveToLogHistory(this.textButton);
							}

							this._parent.optionSelected = this.noOption;
							this._parent.buttons.btnOption1.isClickable = false;
							this._parent.buttons.btnOption2.isClickable = false;
							this._parent.buttons.btnOption3.isClickable = false;
							this._parent.buttons.btnOption1.showOption(false, true);
							this._parent.buttons.btnOption2.showOption(false, false);
							this._parent.buttons.btnOption3.showOption(false, false);
							
							this.hasClick = true;

							if(this.costType != -1) {
								ig.soundHandler.sfxPlayer.play('cashier');
								this._parent['virtualCurrency' + this.costType] -= this.cost;
							} else {
								ig.soundHandler.sfxPlayer.play('click');
							}
							
							this._parent.checkOptionReward();
							this._parent.entityGame.uiCurrency.repos();
							this._parent.entityGame.uiCurrency.showUI(false);

							for(var vc=1;vc<=_DATAGAME.totalVirtualCurrency;vc++) {
				                ig.game.sessionData['virtualCurrency' + vc] = this['virtualCurrency' + vc] ;
				            }

							// ig.game.sessionData.virtualCurrency1 = this.virtualCurrency1;
				   //          ig.game.sessionData.virtualCurrency2 = this.virtualCurrency2;
				   //          ig.game.sessionData.virtualCurrency3 = this.virtualCurrency3;
						}
					} else {
						ig.soundHandler.sfxPlayer.play('click');
						if(this.costType>=1) {
							this.spawnChatBubble(_STRINGS.Game.notenough + ' ' + _STRINGS.Currency['vc' + this.costType].toLowerCase());
						// } else if(this.costType>=2 && this.costType <=3) {
						// 	this.spawnChatBubble(_STRINGS.Game.buymore);
						} else {
							// this.spawnChatBubble(_STRINGS.Game.noads);
						}
					}
				}
			},

			clicking:function(){
				
			},

			released:function(){
				// ig.soundHandler.sfxPlayer.play('click');
			},

			repos: function () {
				// this.pos.x = ig.game.midX-this.halfSize.x;
    //             this.pos.y = ig.game.midY+100;

    			// if(this.chatBubble) {
    			// 	this.chatBubble.parentPos
    			// }
			}
		});
	});