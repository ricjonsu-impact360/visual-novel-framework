ig.module('game.entities.object.ui-replay')
.requires(
	'impact.entity',
    'game.entities.buttons.button-yes',
    'game.entities.buttons.button-no-reset'
)
.defines(function() {
    EntityUIReplay = ig.Entity.extend({
        size:{x:604*_DATAGAME.ratioRes, y:450*_DATAGAME.ratioRes},
        halfSize:{x:750*_DATAGAME.ratioRes, y:80*_DATAGAME.ratioRes},
        zIndex:_DATAGAME.zIndexData.UIReplay,
        fontSize:45*_DATAGAME.ratioRes,
        visible:true,
        selectedButton:0,

        SELECTED_BUTTON_YES:1, 
        SELECTED_BUTTON_NO:2,
       
        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.bgReplay = new ig.Image(_RESOURCESINFO.image.bgInput);

            this.size.x *= 0.85;
            this.size.y *= 0.85;

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.btnYes = ig.game.spawnEntity(EntityButtonYes, 0, 0, { _parent:this, zIndex:_DATAGAME.zIndexData.buttonUIReplay, enableHover:true,
                repos:function() {
                    this.pos = {
                        x:this._parent.pos.x - this.halfSize.x,
                        y:this._parent.pos.y - this.halfSize.y + 20*_DATAGAME.ratioRes
                    };
                }
            });
            // this.btnNo = ig.game.spawnEntity(EntityButtonNo, 0, 0, { _parent:this, zIndex:_DATAGAME.zIndexData.buttonUIReplay });
            this.btnNo = ig.game.spawnEntity(EntityButtonNoReset, 0, 0, { _parent:this, zIndex:_DATAGAME.zIndexData.buttonUIReplay, enableHover:true,
                onClicked:function() {
                    this._parent.enabledButton(false);
                    ig.game.fadeInWindow(LevelMenu);
                }
            });

            ig.game.sortEntitiesDeferred();

            this.repos();
            this.btnNo.repos();
            ig.sizeHandler.resizeLayers();
            this.enabledButton(true);
        },

        enabledButton:function(bol) {
            if(this.btnYes != null) this.btnYes.isClickable = bol;
            if(this.btnNo != null) this.btnNo.isClickable = bol;
            if(bol) {
                if(this.btnYes != null) this.btnYes.repos();
                if(this.btnNo != null) this.btnNo.repos();
            }
        },

        repos:function() {
            this.pos = {
                x:ig.system.width/2,
                y:ig.system.height/2
            };
        },

        update:function(){
            this.parent();
            
        },

        checkKeyboardButton:function() {
            if (ig.input.pressed('ENTER') && this.selectedButton != 0) {
                if(this.selectedButton == this.SELECTED_BUTTON_YES) {
                    this.btnYes.clicked();
                }
                else if(this.selectedButton == this.SELECTED_BUTTON_NO) {
                    this.btnNo.clicked();
                }
            }
            else if ((ig.input.pressed('UP') || ig.input.pressed('DOWN')) && this.selectedButton == 0) {
                this.selectedButton = 1;
                this.btnYes.isHover = true;
            }
            else if (ig.input.pressed('UP')) {
                this.btnNo.isHover = false;
                this.selectedButton = 1;
                this.btnYes.isHover = true;
            }
            else if (ig.input.pressed('DOWN')) {
                this.btnYes.isHover = false;
                this.selectedButton = 2;
                this.btnNo.isHover = true;
            }
        },
        
        draw:function(){
            this.parent();

            if(this.visible) {
                this.checkKeyboardButton();

                this.fontSize = Math.round(ig.game.fontNameSize*0.81*_DATAGAME.ratioRes);
            	var c = ig.system.context;
                
                c.save();
                c.fillStyle = 'black';
                c.globalAlpha = 0.7;
                c.fillRect(0, 0, ig.system.width, ig.system.height);
                c.restore();
                
                c.save();
                c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);
                this.bgReplay.draw(0, 0, 0, 0, this.bgReplay.width, this.bgReplay.height, this.size.x, this.size.y);
                c.restore();

                c.save();
                c.translate(this.pos.x-this.halfSize.x, this.pos.y-this.halfSize.y);

                // c.font = ig.game.fontNameWeight + ' ' + (this.fontSize*ig.game.fontRatio) + 'px ' + ig.game.fontName;
                // c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].replayText;
                // c.textAlign = 'center';
                // c.textBaseline = 'top';
                // var wrapText = ig.game.wordWrap(_STRINGS.Replay.text, this.size.x - 60*_DATAGAME.ratioRes, this.fontSize, ig.game.fontName);
                // ig.game.drawText(wrapText, this.fontSize, c, this.halfSize.x + 2*_DATAGAME.ratioRes, 68*_DATAGAME.ratioRes);

                var fontSizeText = Math.round(ig.game.fontNameSize*0.72*_DATAGAME.ratioRes);
                var yText = 55*_DATAGAME.ratioRes;
                c.font = ig.game.fontNameWeight + ' ' + (fontSizeText*ig.game.fontRatio) + "px " + ig.game.fontName;
                c.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].replayText;
                c.textAlign = 'center';
                c.textBaseline = 'top';
                c.fillText(_STRINGS.Replay.textReplay1, this.halfSize.x, yText);
                yText += (fontSizeText*ig.game.fontRatio) + 8*_DATAGAME.ratioRes;
                c.fillText(_STRINGS.Replay.textReplay2, this.halfSize.x, yText);

                c.restore();
            }
        }
    });
});