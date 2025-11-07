ig.module('game.entities.buttons.button-vc')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonVC = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			size: {
	            x: 540*_DATAGAME.ratioRes,
	            y: 115*_DATAGAME.ratioRes
	        },
	        sizePrice: {
	            x: 150*_DATAGAME.ratioRes,
	            y: 68*_DATAGAME.ratioRes
	        },
	        rounded:15*_DATAGAME.ratioRes,
			textButton:'Encounter',
			noButton:0,
			zIndex:_DATAGAME.zIndexData.buttonVC,
			noChapter:1,
			isClickable:true,
			fontSizeCost:30*_DATAGAME.ratioRes,
			cost:600,
			startXDef:380*_DATAGAME.ratioRes,

			icon:null,
			iconVC1:new ig.Image(_RESOURCESINFO.image.vc1),

			init: function (x, y, settings) {
				this.parent(x, y, settings);

				if(_DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopcorner != null) {
	                this.rounded = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopcorner*_DATAGAME.ratioRes;
	            }

				this.cost = _STRINGS.Shop.price[this.noButton];
				this.vcType = _STRINGS.Shop.vcType[this.noButton];

				this.icon = new ig.Image(_RESOURCESINFO.image['vc' + this.vcType]);

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
	        	// ig.game.fadeInWindow(LevelGame);
				// ig.game.director.jumpTo(LevelGame);
			},

			clicked:function(){
				if(this.visible && this.isClickable && ig.game.sessionData.virtualCurrency1 >= _STRINGS.Shop.price[this.noButton]) {
					// ig.soundHandler.sfxPlayer.play('click');
					ig.soundHandler.sfxPlayer.play('cashier');
					
					this.sinkingEffect();

					ig.game.currentWindow.virtualCurrency1 -= _STRINGS.Shop.price[this.noButton];
					ig.game.currentWindow['virtualCurrency' + this.vcType] += _STRINGS.Shop.reward[this.noButton];

					for(var vc=1;vc<=_DATAGAME.totalVirtualCurrency;vc++) {
		                ig.game.sessionData['virtualCurrency' + vc] = ig.game.currentWindow['virtualCurrency' + vc] ;
		            }
					// ig.game.sessionData.virtualCurrency1 = ig.game.currentWindow.virtualCurrency1;
					// ig.game.sessionData.virtualCurrency2 = ig.game.currentWindow.virtualCurrency2;
					// ig.game.sessionData.virtualCurrency3 = ig.game.currentWindow.virtualCurrency3;
					ig.game.saveAll();

					if(ig.game.windowName == 'game') {
						ig.game.currentWindow.entityGame.uiCurrency.repos();
					} else {
						ig.game.currentWindow.uiCurrency.repos();
					}
				}
			},

			clicking:function(){
				
			},

			released:function(){
				// ig.soundHandler.sfxPlayer.play('click');
			},

			draw:function() {
				if(this._parent.visible) {
					this.fontSizeCost = Math.round(ig.game.fontNameSize*0.54*_DATAGAME.ratioRes*ig.game.fontRatio);
					
					var c = ig.system.context;
	                
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
	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopbg;
	                //(_STRINGS.Shop.price[this.noButton] > ig.game.sessionData.virtualCurrency1) ? '#9c9b9a' : 
	                c.fill();

	                this.icon.draw(startX + 20*_DATAGAME.ratioRes, startY + 10*_DATAGAME.ratioRes);

	                c.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.69*_DATAGAME.ratioRes) + "px " + ig.game.fontName;
	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshoptitle;
	                c.textAlign = 'left';
	                c.fillText(_STRINGS.Shop.reward[this.noButton] + ' ' + _STRINGS.Currency['vc' + _STRINGS.Shop.vcType[this.noButton]], startX + 80*_DATAGAME.ratioRes, startY + 48*_DATAGAME.ratioRes);

	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopinfo;
	                c.font = Math.round(ig.game.fontNameSize*0.58*_DATAGAME.ratioRes) + "px " + ig.game.fontNameThin;
	                c.textAlign = 'left';
	                c.fillText(_STRINGS.Shop.info[this.noButton], startX + 20*_DATAGAME.ratioRes, startY + 95*_DATAGAME.ratioRes);


	                startX = 380*_DATAGAME.ratioRes;
	                startY = 30*_DATAGAME.ratioRes;

	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopshadow;

	                c.beginPath();
	                c.moveTo(startX + this.rounded, startY);
	                c.lineTo(startX + this.sizePrice.x - this.rounded, startY);
	                c.quadraticCurveTo(startX + this.sizePrice.x, startY, startX + this.sizePrice.x, startY + this.rounded);
	                c.lineTo(startX + this.sizePrice.x, startY + this.sizePrice.y - this.rounded);
	                c.quadraticCurveTo(startX + this.sizePrice.x, startY + this.sizePrice.y, startX + this.sizePrice.x - this.rounded, startY + this.sizePrice.y);
	                c.lineTo(startX + this.rounded, startY + this.sizePrice.y);
	                c.quadraticCurveTo(startX, startY + this.sizePrice.y, startX, startY + this.sizePrice.y - this.rounded);
	                c.lineTo(startX, startY + this.rounded);
	                c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
	                c.closePath();
	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopupshadow; 
	                //(_STRINGS.Shop.price[this.noButton] > ig.game.sessionData.virtualCurrency1) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optiongreyshadow : 
	                c.fill();

	                startY = 20*_DATAGAME.ratioRes;
	                c.beginPath();
	                c.moveTo(startX + this.rounded, startY);
	                c.lineTo(startX + this.sizePrice.x - this.rounded, startY);
	                c.quadraticCurveTo(startX + this.sizePrice.x, startY, startX + this.sizePrice.x, startY + this.rounded);
	                c.lineTo(startX + this.sizePrice.x, startY + this.sizePrice.y - this.rounded);
	                c.quadraticCurveTo(startX + this.sizePrice.x, startY + this.sizePrice.y, startX + this.sizePrice.x - this.rounded, startY + this.sizePrice.y);
	                c.lineTo(startX + this.rounded, startY + this.sizePrice.y);
	                c.quadraticCurveTo(startX, startY + this.sizePrice.y, startX, startY + this.sizePrice.y - this.rounded);
	                c.lineTo(startX, startY + this.rounded);
	                c.quadraticCurveTo(startX, startY, startX + this.rounded, startY);
	                c.closePath();
	                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshopup; 
	                //(_STRINGS.Shop.price[this.noButton] > ig.game.sessionData.virtualCurrency1) ? _DATAGAME.uiColor[_DATAGAME.uiTheme].optiongrey : 
	                c.fill();

	                this.iconVC1.draw(this.xCost - this.wAll/2, startY + this.sizePrice.y/2 - this.iconVC1.height/2);
						
					c.font = this.fontSizeCost + "px " + ig.game.fontNameThin;
					c.textAlign = 'left';
					c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnvctext;
					c.fillText(this.cost, this.xCostText, startY + this.sizePrice.y/2+11*_DATAGAME.ratioRes);

					if(_STRINGS.Shop.price[this.noButton] > ig.game.sessionData.virtualCurrency1) {
						startX = 0; startY = 0;
						c.globalAlpha = 0.7;
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
		                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].btnshoptint;
		                c.fill();
		            }
	                
	                c.restore();
	            }
			},

			repos: function () {
				this.pos = {
					x : this._parent.pos.x-this._parent.halfSize.x + this._parent.halfSize.x - this.size.x/2,
					y : this._parent.pos.y-this._parent.halfSize.y + (130*_DATAGAME.ratioRes) + ((this.noButton-1)*(142*_DATAGAME.ratioRes))
				};

				var c = ig.system.context;
				c.font = this.fontSizeCost + "px " + ig.game.fontNameThin;
				this.wCost = c.measureText(this.cost).width;
	            this.xCost = this.startXDef + this.sizePrice.x/2;
	            this.wAll = this.iconVC1.width + (10*_DATAGAME.ratioRes) + this.wCost;
	            this.xCostText = this.xCost - this.wAll/2 + this.iconVC1.width + (10*_DATAGAME.ratioRes);
			}
		});
	});