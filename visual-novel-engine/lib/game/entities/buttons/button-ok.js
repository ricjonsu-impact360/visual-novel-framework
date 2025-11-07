ig.module('game.entities.buttons.button-ok')
	.requires(
		'game.entities.buttons.button', 'plugins.clickable-div-layer'
	)
	.defines(function () {
		EntityButtonOk = EntityButton.extend({
			type: ig.Entity.TYPE.A,
			image: new ig.Image(_RESOURCESINFO.image.btnBlank3, 184*_DATAGAME.ratioRes, 76*_DATAGAME.ratioRes),
			imageGrey: new ig.Image(_RESOURCESINFO.image.btnBlank3Grey, 184*_DATAGAME.ratioRes, 76*_DATAGAME.ratioRes),
			size: {
				x: 184*_DATAGAME.ratioRes,
				y: 76*_DATAGAME.ratioRes,
			},
			halfSize:null,
			zIndex:_DATAGAME.zIndexData.buttonOK,

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
				if(this._parent.textView.text.length < 3) {
					this.imageGrey.draw(0, 0);
				} else {
					this.image.draw(0, 0);
				}

				var _fontSize = Math.round(ig.game.fontNameSize*0.72*_DATAGAME.ratioRes*ig.game.fontRatio);
				c.font = ig.game.fontNameWeight + ' ' + _fontSize + "px " + ig.game.fontName;
				c.textAlign = 'center';
				c.textBaseline = 'middle';
				if(this._parent.textView.text.length < 3) {
					c.fillStyle = '#c7c7c7';
				} else {
					c.fillStyle = ig.game.buttonTextColor;
				}
				
				c.fillText(_STRINGS['Button']['ok'], this.halfSize.x, this.halfSize.y + ig.game.checkArialOffset(_fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes*_DATAGAME.multiplierOffsetTextButtonBlankSmall));
				
				c.restore();
	        },

	        funcComplete:function() {
	        	var allText = '';
	        	for(var i = 0; i < this._parent.textView.lines.length; i++){
            		allText += this._parent.textView.lines[i];
            	}

            	ig.game.sessionData.playerName = allText;

	        	this.kill();
	        	this._parent.kill();
	        	this._parent.killed();
			},

			clicked:function(){
				if(this.visible && this.isClickable && this._parent.textView.text.length >= 3) {
					this.isClickable = false;
					ig.soundHandler.sfxPlayer.play('click');
					
					this.sinkingEffect();
				}
			},

			clicking:function(){
				
			},

			released:function(){
				// ig.soundHandler.sfxPlayer.play('click');
			},

			repos: function () {
				this.pos.x = ig.game.midX-this.halfSize.x;
                this.pos.y = ig.game.midY+90*_DATAGAME.ratioRes;
			}
		});
	});