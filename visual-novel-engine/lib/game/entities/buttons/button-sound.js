ig.module('game.entities.buttons.button-sound')
.requires(
	'game.entities.buttons.button'
)
.defines(function() {
	EntityButtonSound = EntityButton.extend({
		image1: new ig.Image(_RESOURCESINFO.image.btnSoundOn),
		image2: new ig.Image(_RESOURCESINFO.image.btnSoundOff),

		type:ig.Entity.TYPE.A,
		gravityFactor:0,
		zIndex:_DATAGAME.zIndexData.miniButton,
		size:{x:98*_DATAGAME.ratioRes,
			y:96*_DATAGAME.ratioRes,
		},
        volume: 1,
        mutedFlag:false,
        
		name:"soundtest",

		init:function(x,y,settings){
			this.parent(x,y,settings);

			this.halfSize = {
                x: this.size.x / 2,
                y: this.size.y / 2
            }

			if(ig.game.sessionData.music == 0) this.mutedFlag = true;

			this.repos();

			if(ig.global.wm)
			{
				return;
			}
		},

		repos: function () {
			if(_DATAGAME.loadBackgroundMusic) {
				if(_DATAGAME.chapters.multipleChapter) {
					this.pos.x = this._parent.pos.x - this.halfSize.x + 115*_DATAGAME.ratioRes;
				}
				else {
					this.pos.x = this._parent.pos.x - this.halfSize.x + 60*_DATAGAME.ratioRes;
				}
			} else {
				// this.pos.x = this._parent.pos.x - this.halfSize.x;
				if(_DATAGAME.chapters.multipleChapter) {
					this.pos.x = this._parent.pos.x - this.halfSize.x + 60*_DATAGAME.ratioRes;
				} else {
					this.pos.x = this._parent.pos.x - this.halfSize.x;
				}
			}
			this.pos.y = this._parent.pos.y - this.halfSize.y;

			// if(_DATAGAME.chapters.multipleChapter) {
			// 	this.pos.x = this._parent.pos.x - this.halfSize.x + 60*_DATAGAME.ratioRes;
			// 	this.pos.y = this._parent.pos.y - this.halfSize.y;
			// } else {
			// 	this.pos.x = this._parent.pos.x - this.halfSize.x;
			// 	this.pos.y = this._parent.pos.y - this.halfSize.y;
			// }

			// this.pos.x = ig.system.width - this.size.x - 25;
			// this.pos.y = 25;
		},

        draw:function()
        {
            if(this._parent.visible && this.visible) {
	            this.parent();
	            if(this.mutedFlag) {
	            	this.image2.draw(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
	            } else {
	            	this.image1.draw(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
	            }
	        }
        },

        clicked:function()
		{
			this.sinkingEffect();
			
            console.log("pressed");
			if(this.mutedFlag)
            {
                console.log("unmute")
                
				/** unmute */
                // ig.soundHandler.unmuteBGM();

				/** volume */
				// ig.soundHandler.bgmPlayer.volume(this.volume);
				ig.soundHandler.sfxPlayer.volume(this.volume);

				/** save session data */
				// ig.game.save("music", 1);
				ig.game.save("sound", 1);

                this.mutedFlag=false;
            }
            else
            {
                console.log("mute")

				/** mute */
                // ig.soundHandler.muteBGM();

				/** volume */
				// ig.soundHandler.bgmPlayer.volume(0);
				ig.soundHandler.sfxPlayer.volume(0);

				/** save session data */
				// ig.game.save("music", 0);
				ig.game.save("sound", 0);

                this.mutedFlag=true;
            }
			
		},
		clicking:function()
		{
			
		},
		released:function()
		{
			
		}
	});

	EntityButtonBGM = EntityButton.extend({
		image1: new ig.Image(_RESOURCESINFO.image.btnBGMOn),
		image2: new ig.Image(_RESOURCESINFO.image.btnBGMOff),

		type:ig.Entity.TYPE.A,
		gravityFactor:0,
		zIndex:_DATAGAME.zIndexData.miniButton,
		size:{x:98*_DATAGAME.ratioRes,
			y:96*_DATAGAME.ratioRes,
		},
        volume: 1,
        mutedFlag:false,
        
		name:"soundtest",

		init:function(x,y,settings){
			this.parent(x,y,settings);

			this.halfSize = {
                x: this.size.x / 2,
                y: this.size.y / 2
            }

			if(ig.game.sessionData.music == 0) this.mutedFlag = true;

			this.repos();

			if(ig.global.wm)
			{
				return;
			}
		},

		repos: function () {
			// if(_DATAGAME.chapters.multipleChapter) {
			// 	this.pos.x = this._parent.pos.x - this.halfSize.x + 60*_DATAGAME.ratioRes;
			// 	this.pos.y = this._parent.pos.y - this.halfSize.y;
			// } else {
			// 	this.pos.x = this._parent.pos.x - this.halfSize.x;
				
			// }

			if(_DATAGAME.loadBackgroundMusic) {
				if(_DATAGAME.chapters.multipleChapter) {
					this.pos.x = this._parent.pos.x - this.halfSize.x; 
				}
				else {
					this.pos.x = this._parent.pos.x - this.halfSize.x - 60*_DATAGAME.ratioRes;
				}
			} else {
				// this.pos.x = this._parent.pos.x - this.halfSize.x;
				this.pos.x = this._parent.pos.x - this.halfSize.x + 60*_DATAGAME.ratioRes;
			}
			this.pos.y = this._parent.pos.y - this.halfSize.y;

			// this.pos.x = ig.system.width - this.size.x - 25;
			// this.pos.y = 25;
		},

        draw:function()
        {
            if(this._parent.visible && this.visible) {
	            this.parent();
	            if(this.mutedFlag) {
	            	this.image2.draw(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
	            } else {
	            	this.image1.draw(this.pos.x+this.offset.x, this.pos.y+this.offset.y);
	            }
	        }
        },

        clicked:function()
		{
			this.sinkingEffect();
			
            console.log("pressed");
			if(this.mutedFlag)
            {
                console.log("unmute")
                
				/** unmute */
                // ig.soundHandler.unmuteBGM();

				/** volume */
				ig.soundHandler.bgmPlayer.volume(this.volume);
				// ig.soundHandler.sfxPlayer.volume(this.volume);

				/** save session data */
				ig.game.save("music", 1);
				// ig.game.save("sound", 1);

                this.mutedFlag=false;
            }
            else
            {
                console.log("mute")

				/** mute */
                // ig.soundHandler.muteBGM();

				/** volume */
				ig.soundHandler.bgmPlayer.volume(0);
				// ig.soundHandler.sfxPlayer.volume(0);

				/** save session data */
				ig.game.save("music", 0);
				// ig.game.save("sound", 0);

                this.mutedFlag=true;
            }
			
		},
		clicking:function()
		{
			
		},
		released:function()
		{
			
		}
	});
});