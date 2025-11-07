ig.module('plugins.freezeframe.freezeframe')
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityFreezeFrame = ig.Entity.extend({
            zIndex: _DATAGAME.zIndexData.freezeFrame,

            //param
            bg:null,
            character:null,
            charConfig:null,
            sptChar:null,
            textBg:'',
            text:'',
            font:'',
            textColor:null,
            textShadowColor:null,
            callback:null,
            firstSound:null,
            secondSound:null,
            shadowOffset:{ x:10, y:10 },
            textOffset:{ x:50, y:0 },
            offsetCharX:0, 

            posXBG:0,
            posYBG:0,
            posXBGText:0,
            posYBGText:0,
            posXChar:0,
            posXText:0,
            boolShowChar:false,
            boolShowText:false,

            alphaBG:0,
            alphaBGText:0,
            alphaText:1,
            alphaChar:0,
            isVisible:true,

            timeAlive:4,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                if(this.charConfig.name == 'Amy' || _DATAGAME.neutral_girl.indexOf(this.charConfig.name) >= 0) {
                    this.sptChar = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { _parent:this, charName:this.charConfig.name.toLowerCase(), freezeFrame:true, zIndex:this.zIndex });
                } else if(_DATAGAME.neutral_boy.indexOf(this.charConfig.name) >= 0) {
                    this.sptChar = ig.game.spawnEntity(SpriterBoy, ig.game.midX, ig.game.midY, { charName:this.charConfig.name.toLowerCase(), _parent:this, freezeFrame:true, zIndex:this.zIndex });
                }
                else {
                    if(ig.game.sessionData.loveInterest == 'girl') {
                         this.sptChar = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { _parent:this, charName:this.charConfig.name.toLowerCase(), freezeFrame:true, zIndex:this.zIndex });
                    } else {
                        this.sptChar = ig.game.spawnEntity(SpriterBoy, ig.game.midX, ig.game.midY, { charName:this.charConfig.name.toLowerCase(), _parent:this, freezeFrame:true, zIndex:this.zIndex });
                    }
                }

                if(this.charConfig.name == 'Amy') {
                    this.sptChar.changeDU(ig.game.sessionData.dressUpTheme[this._parent.numChapter].now);
                } else {
                    var _currentName = this.charConfig.name.toLowerCase();
                    _currentName = _currentName.replaceAll(" ", "");
                    if(ig.game.sessionData.dressUpChar[this._parent.numChapter][_currentName] != null) {
                        this.sptChar.charName = ig.game.sessionData.dressUpChar[this._parent.numChapter][_currentName];
                        this.sptChar.changeDU(ig.game.sessionData.dressUpChar[this._parent.numChapter][_currentName]);
                    }
                    else {
                        this.sptChar.charName = this.charConfig.name.toLowerCase();
                        this.sptChar.changeDU(this.charConfig.name.toLowerCase());
                    }
                }

                // this.sptChar = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { scml: this.scmlGirl, _parent:this, freezeFrame:true });
                this.sptChar.spriter.scale.x = -1.1;
                this.sptChar.spriter.scale.y = 1.1;
                this.sptChar.spriter.root.alpha = 0;
                this.sptChar.spriter.zIndex = _DATAGAME.zIndexData.freezeFrameSpriter;

                this.repos();

                console.log(this.charConfig);

                this.startAnimation();
                
                ig.game.sortEntitiesDeferred();
            },

            playAnimSpriter:function()  {
                // this.sptChar.changePose(this.charConfig.anim);
                var _isShadow = false;
                var _animSpeed = this.charConfig.animSpeed;
                if(_animSpeed == null && _animSpeed <= 0) _animSpeed = 100;
                
                this.sptChar.changePose(this.charConfig.anim, this.charConfig.handheld, _isShadow, _animSpeed);

                if(this.charConfig.emotion != 'ANIM_NONE') {
                    this.sptChar.changeEmotion(_DATAGAME.listEmotion.indexOf(this.charConfig.emotion), false);
                }
            },

            draw: function () {
                this.parent();

                if(this.isVisible) {
                    this.drawObject();
                }
            },

            repos:function() {

            },

            update: function () {
                this.parent();
            }
        });
    });