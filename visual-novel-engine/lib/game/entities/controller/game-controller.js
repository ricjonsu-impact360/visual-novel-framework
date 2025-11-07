ig.module('game.entities.controller.game-controller')
.requires(
	'impact.entity',
    'plugins.data.vector',

    'game.entities.text-view',

    'plugins.tiered-rv.rv-sample-control',

    'game.entities.buttons.button-setting',
    'game.entities.buttons.button-option',
    'game.entities.buttons.button-show',
    'game.entities.buttons.button-save',
    'game.entities.buttons.button-load',
    'game.entities.buttons.button-log',
    'game.entities.buttons.button-auto',
    'game.entities.buttons.button-skip',

	'game.entities.particle.particle',
    'game.entities.particle.single_particle',
    'game.entities.topoverlay.topoverlay',
    'game.entities.object.overlay',
    'game.entities.object.phone',
    'game.entities.object.letter',
    'game.entities.object.email',
    'game.entities.object.ui-setting',
    'game.entities.object.ui-entername',
    'game.entities.object.ui-currency',
    'game.entities.object.ui-shop',
    'game.entities.object.ui-log',
    'game.entities.object.ui-saveload',
    'game.entities.object.ui-replay',
    'game.entities.object.girl',
    'game.entities.object.boy',
    'game.entities.object.flashback',
	'game.entities.object.background'
)
.defines(function() {
    EntityGameController = ig.Entity.extend({
        type: ig.Entity.TYPE.BOTH,
        zIndex: 0,

        buttons:{},
        images:{},
        // tweens:{},
        tweenParam:{},
        entityGame:{},
        entityOverlay:{},
        entitySingleParticle:{},
        entityWindowBoxing:{},
        objectList:[],
        overlayList:[],

        isAutoScroll: false,
        isStartDialog: false,
        isFirstLoad: true,
        isAnimChar: false,
        isAnimDU: false,

        timerAutoDialog:null,

        bg: null,
        sptCharDU1:null,
        sptCharDU2:null,

        alphaDU:0,
        alphaChar:1,
        optionType:'normal',

        longestDurWalkIn:1500,
        defDurWalkIn:1500,
        maxDurWalkIn:3000,
        maxWalkingSpeed:250, //200

        sptDU1:null,
        sptDU2:null,
        chatBubble:null,
        numChapter:1,
        numChat:0,
        prevChatIdForConsole:0,
        lastChatId:0,
        isOption:false,
        optionSelected:1,
        isBubbleOption:false,

        optionSelectedByKeyboard:0,

        plusYBubble:0,
        bubbleScriptOffsetY:0,
       
        offsetBubble:{x:100*_DATAGAME.ratioRes, y:-200*_DATAGAME.ratioRes},
        boolZoomPanCamera:false,
        dataZoomPanCamera:null,
        posXBG:0,
        lastposXBG:0,
        posYBG:0,
        lastposYBG:0,
        anchorBGX:0.5,
        anchorBGY:0.5,
        zoomBG:1,
        arrChar: [],
        posDefChar: [], //{x:0, y:0}, {x:0, y:0}, {x:0, y:0}
        offsetDefChar: [], //{x:0, y:500}, {x:0, y:500}, {x:0, y:500}
        posXIn: { left:-200*_DATAGAME.ratioRes, right:200*_DATAGAME.ratioRes, center:0 },
        posXOut: { left:-700*_DATAGAME.ratioRes, right:700*_DATAGAME.ratioRes, center:0 },

        offsetPivot:135*2*this.ratioRes,
        totalAllChar:3,
        isVisibleChar:[ ],

        miniButtonOpenedBefore:true,

        fullSentence:[],
        arrText:[],
        text:'', 
        textTrack:' ', 
        currentWord:0, 
        counterWord:0, 
        modWord:60, 
        loadSentence:false, 
        isBubble:false,
        isNarration:false,
        bubbleConfigs : {
            narrationWidth:480*_DATAGAME.ratioRes, //600
            width:440*_DATAGAME.ratioRes, //600
            height:60*_DATAGAME.ratioRes, //60
            fontSize:30*_DATAGAME.ratioRes, 
            fontSizeName:30, 
            fontName:'metromed',
            fontTextName:'metroblack',
            position:{x:0, y:0},
            bubbleWidth:440*_DATAGAME.ratioRes
        }, 
        TAIL_STATUS : { none:0, right:1, left:2 }, 

        totalChar:0,
        isCost:false,

        virtualCurrency1:0,
        virtualCurrency2:0,
        virtualCurrency3:0,
        virtualCurrency4:0,
        virtualCurrency5:0,
        virtualCurrency6:0,
        virtualCurrency7:0,
        virtualCurrency8:0,

        isInputKeyboard:false,
        isDelayFlashback:true,

        tempTextView:null,

        canClickStage:false,

        sfxAlreadyPlayed:false,
        finishAddOverlayObject:false,

        isClickButton:false,
        durDelayClick:0,
        isShowingButtonShop:false,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.maxWalkingSpeed = _DATAGAME.walkSpeed[_DATAGAME.walkSpeed.length - 1];
            ig.game.boolChooseChapter = false;

            if(ig.game.sessionData.playerName.toLowerCase() == 'default') {
                ig.game.sessionData.playerName = _DATAGAME.defaultName;
            }

            // if(ig.game.autoDialog) {
                this.timerAutoDialog = new ig.Timer(ig.game.delayDialog);
                this.timerAutoDialog.pause();
            // }

            this.modWord = ig.game.textDialogSpeed;

            this.bubbleConfigs.fontName = ig.game.fontBubbleThin;
            this.bubbleConfigs.fontTextName = ig.game.fontBubble;

            for(var i=0;i<this.totalAllChar;i++) {
                this.isVisibleChar.push(false);
            }

            this.numChapter = ig.game.numChapter;

            if(ig.game.sessionData.dressUpTheme[this.numChapter] == null) {
                ig.game.sessionData.dressUpTheme[this.numChapter] = { now:'amy', last:'amy' };
            } 
            
            if(ig.game.sessionData.numChat[this.numChapter] == null || ig.game.sessionData.numChat[this.numChapter] < 0) {
                this.numChat = 0;
                this.lastChatId = 0;

                if(ig.game.sessionData.isReward == null) {
                    ig.game.sessionData.isReward[this.numChapter] = true;
                }
            } else {
                this.numChat = ig.game.sessionData.numChat[this.numChapter];
                this.lastChatId = ig.game.sessionData.lastChatId[this.numChapter];
            }

            if(!_DATAGAME.enableCurrentProgress) this.numChat = 0;

            if(ig.game.startFromSceneID != -1 && ig.game.windowBefore == 'menu') {
                this.numChat = ig.game.startFromSceneID;
                ig.game.sessionData.isFlashback[this.numChapter] = false;
            }

            if(ig.game.loveGender != 'none') {
                ig.game.sessionData.loveInterest = ig.game.loveGender;
            }

            if(this.numChat == 0) {
                if(_DATAGAME.firstMCOutfit['chapter' + this.numChapter] != null && _DATAGAME.firstMCOutfit['chapter' + this.numChapter] != "") {
                    ig.game.sessionData.dressUpTheme[this.numChapter].now = (_DATAGAME.firstMCOutfit['chapter' + this.numChapter].toLowerCase() == 'default') ? 'amy' : _DATAGAME.firstMCOutfit['chapter' + this.numChapter];
                } else {
                    if(this.numChapter >= 2) {
                        if(ig.game.sessionData.dressUpTheme[this.numChapter - 1] == null) {
                            ig.game.sessionData.dressUpTheme[this.numChapter - 1] = { now:'amy', last:'amy' };
                        }

                        if(ig.game.sessionData.dressUpTheme[this.numChapter - 1].last == null) {
                            ig.game.sessionData.dressUpTheme[this.numChapter - 1].last = 'amy';
                        }
                        ig.game.sessionData.dressUpTheme[this.numChapter].now = ig.game.sessionData.dressUpTheme[this.numChapter - 1].last;
                    } else {
                        ig.game.sessionData.dressUpTheme[this.numChapter].now = 'amy';
                    }
                }
            }
            // ig.game.consoleLog("du now : " + ig.game.sessionData.dressUpTheme[this.numChapter].now);
            // ig.game.consoleLog('id : ' + this.numChat);

            for(var vc=1;vc<=_DATAGAME.totalVirtualCurrency;vc++) {
                this['virtualCurrency' + vc] = ig.game.sessionData['virtualCurrency' + vc];
            }

            // this.virtualCurrency1 = ig.game.sessionData.virtualCurrency1;
            // this.virtualCurrency2 = ig.game.sessionData.virtualCurrency2;
            // this.virtualCurrency3 = ig.game.sessionData.virtualCurrency3;

            ig.game.windowName = 'game';
            ig.game.currentWindow = this;
            ig.game.totalCart = 0;

            this.apiRVSample = ig.game.spawnEntity(EntityRvSampleControl, 0, 0);


            this.entityGame.uiCurrency = ig.game.spawnEntity(EntityUICurrency, 0, 0, {_parent: this});

            // Buttons
            // if(_DATAGAME.chapters.multipleChapter) {
            //     this.buttons.btnHome = ig.game.spawnEntity(EntityButtonHome, 0, 0, {_parent: this});
            // }

            if(ig.game.showUI) {
                // if(_DATAGAME.loadBackgroundMusic) this.buttons.btnSound = ig.game.spawnEntity(EntityButtonSound, 0, 0, {_parent: this});
                this.buttons.btnSetting = ig.game.spawnEntity(EntityButtonSetting, 0, 0, {_parent: this});
            }

            this.buttons.btnOption1 = ig.game.spawnEntity(EntityButtonOption, 0, 0, {_parent:this, noOption:1,  visible:false, zIndex:_DATAGAME.zIndexData.buttonOption});
            this.buttons.btnOption2 = ig.game.spawnEntity(EntityButtonOption, 0, 0, {_parent:this, noOption:2, visible:false, zIndex:_DATAGAME.zIndexData.buttonOption});
            this.buttons.btnOption3 = ig.game.spawnEntity(EntityButtonOption, 0, 0, {_parent:this, noOption:3, visible:false, zIndex:_DATAGAME.zIndexData.buttonOption});

            if(ig.game.showMiniButton == true) this.setMiniButton();

            this.uiShop = ig.game.spawnEntity(EntityUIShop, 0, 0, {_parent:this});
            this.uiShop.hide();
            this.uiShop.repos();

            this.uiSetting = ig.game.spawnEntity(EntityUISetting, 0, 0, {_parent:this});
            this.uiSetting.hide();
            this.uiSetting.repos();

            this.checkStory();
            this.checkChatBubble();

            this.entityGame.flashback = ig.game.spawnEntity(EntityFlashback, 0, 0, {_parent:this, visible:false});

            // this.cobaChar = ig.game.spawnEntity(SpriterBoyRear, ig.game.midX, ig.game.midY, { charName:'jack', _parent:this });

            this.keyboard = ig.game.spawnEntity(ig.EntityKeyboard, 0, 0, {
                zIndex: _DATAGAME.zIndexData.virtualKeyboard,  // mandatory to set the zIndex of the keyboard
                onKeyboardPressed: this.onKeyboardPressed.bind(this),  // callback when a keypad pressed
                fontStyle: "bold " + 34*_DATAGAME.ratioRes + "px arial,sans-serif", 
                fontColor: 'rgba(0,0,0,1)',
                keyboardBackground: 'rgba(221,223,228,1)',  // background of the keyboard
                backgroundColorRegular: 'rgba(255,255,255,1)',  // background of the regulat kepad such as numpad, character pad, and emoji pad
                backgroundColorSpecial: 'rgba(179,179,179,1)',  // background of the shift button, backspace button, enter button etc
                tileRounded: 10*_DATAGAME.ratioRes,
                space: 5*_DATAGAME.ratioRes,
                padding: {x: 50*_DATAGAME.ratioRes, y: 10*_DATAGAME.ratioRes},
                iconSize: 38*_DATAGAME.ratioRes
            });
            this.setupInput();

            this.keyboard.hide();

            if(!_DATAGAME.enableCurrentProgress) {
                if(ig.game.sessionData.historyLog['chapter' + this.numChapter] != null) {
                    ig.game.sessionData.historyLog['chapter' + this.numChapter] = [];
                }
            }

            if(ig.game.showGameArea == true) this.grid = ig.game.spawnEntity(EntityGrid, 0, 0, { _parent: this });

            ig.game.sortEntitiesDeferred();

            this.repos();

            this.prevChatIdForConsole = this.numChat;
            
        },

        setMiniButton:function() {
            this.buttons.btnShow = ig.game.spawnEntity(EntityButtonShow, 0, 0, { _parent: this });

            for(var buttonName in _DATAGAME.miniButton) {
                if(_DATAGAME.miniButton[buttonName] == true) {
                    this.buttons['btn' + ig.game.firstLetterCapslock(buttonName)] = ig.game.spawnEntity('EntityButton' + ig.game.firstLetterCapslock(buttonName), 0, 0, { _parent: this });
                }
            }

            if(_DATAGAME.miniButton.log == true) {
                this.uiLog = ig.game.spawnEntity(EntityUILog, 0, 0, {_parent:this});
                this.uiLog.hide();
                this.uiLog.repos();
            }

            if(_DATAGAME.miniButton.save == true) {
                this.uiSaveLoad = ig.game.spawnEntity(EntityUISaveLoad, 0, 0, {_parent:this});
                this.uiSaveLoad.hide();
                this.uiSaveLoad.repos();
            }
        },

        searchIdxPhone:function(_phoneStory) {
            // return _STRINGS.phone.map(function(e) { return e.title; }).indexOf(_phoneStory);
        },

        tweenDelay:function(_parent, duration, funcComplete) {
            var paramDelay = 0;
            this.tween({
                paramDelay:1
            }, duration / 1000, { 
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
                    _parent[funcComplete]();
                }.bind(_parent)
            }).start();
        },

        reposMiniButton:function() {
            if(ig.game.showMiniButton == true) {
                this.buttons.btnShow.repos();

                for(var buttonName in _DATAGAME.miniButton) {
                    if(_DATAGAME.miniButton[buttonName] == true) {
                        this.buttons['btn' + ig.game.firstLetterCapslock(buttonName)].repos();
                    }
                }
            }
        },

        enabledButton:function(boolEnable) {
            if(ig.game.showUI && this.buttons.btnSetting) this.buttons.btnSetting.isClickable = boolEnable;

            this.buttons.btnOption1.isClickable = boolEnable;
            this.buttons.btnOption2.isClickable = boolEnable;
            this.buttons.btnOption3.isClickable = boolEnable;
            // this.buttons.btnPlay.isClickable = boolEnable;
            // this.buttons.btnShop.isClickable = boolEnable;

            if(this.entityGame.uiReplay) {
                this.entityGame.uiReplay.btnYes.isClickable = boolEnable;
                this.entityGame.uiReplay.btnNo.isClickable = boolEnable;
                // if(boolEnable)  {
                //     this.entityGame.uiReplay.btnNo.show();
                // } else {
                //     this.entityGame.uiReplay.btnNo.hide();
                // }
            }

            if(ig.game.showMiniButton == true) {
                this.buttons.btnShow.isClickable = boolEnable;

                for(var buttonName in _DATAGAME.miniButton) {
                    if(_DATAGAME.miniButton[buttonName] == true) {
                        this.buttons['btn' + ig.game.firstLetterCapslock(buttonName)].isClickable = boolEnable;
                    }
                }
            }
        },

        onKeyboardPressed: function(id){
            // ig.game.consoleLog(id + ' is pressed');
            if(!this.isInputKeyboard) return;

            switch(id){
                case 'BACKSPACE':
                    this.tempTextView.removeText();
                    break;
                // case 'RETURN':
                //     this.textView.addText('\n');
                //     break;
                default:
                    this.tempTextView.addText(id);
            }
            
        },

        setupInputVirtualKeyboard:function(bool) {
            if(bool == false) {
                ig.input.unbind(ig.KEY.A, 'A');
                ig.input.unbind(ig.KEY.B, 'B');
                ig.input.unbind(ig.KEY.C, 'C');
                ig.input.unbind(ig.KEY.D, 'D');
                ig.input.unbind(ig.KEY.E, 'E');
                ig.input.unbind(ig.KEY.F, 'F');
                ig.input.unbind(ig.KEY.G, 'G');
                ig.input.unbind(ig.KEY.H, 'H');
                ig.input.unbind(ig.KEY.I, 'I');
                ig.input.unbind(ig.KEY.J, 'J');
                ig.input.unbind(ig.KEY.K, 'K');
                ig.input.unbind(ig.KEY.L, 'L');
                ig.input.unbind(ig.KEY.M, 'M');
                ig.input.unbind(ig.KEY.N, 'N');
                ig.input.unbind(ig.KEY.O, 'O');
                ig.input.unbind(ig.KEY.P, 'P');
                ig.input.unbind(ig.KEY.Q, 'Q');
                ig.input.unbind(ig.KEY.R, 'R');
                ig.input.unbind(ig.KEY.S, 'S');
                ig.input.unbind(ig.KEY.T, 'T');
                ig.input.unbind(ig.KEY.U, 'U');
                ig.input.unbind(ig.KEY.V, 'V');
                ig.input.unbind(ig.KEY.W, 'W');
                ig.input.unbind(ig.KEY.X, 'X');
                ig.input.unbind(ig.KEY.Y, 'Y');
                ig.input.unbind(ig.KEY.Z, 'Z');
                ig.input.unbind(ig.KEY.BACKSPACE, 'BACKSPACE');
                ig.input.unbind(ig.KEY.SHIFT, 'SHIFT');
            } else {
                ig.input.bind(ig.KEY.A, 'A');
                ig.input.bind(ig.KEY.B, 'B');
                ig.input.bind(ig.KEY.C, 'C');
                ig.input.bind(ig.KEY.D, 'D');
                ig.input.bind(ig.KEY.E, 'E');
                ig.input.bind(ig.KEY.F, 'F');
                ig.input.bind(ig.KEY.G, 'G');
                ig.input.bind(ig.KEY.H, 'H');
                ig.input.bind(ig.KEY.I, 'I');
                ig.input.bind(ig.KEY.J, 'J');
                ig.input.bind(ig.KEY.K, 'K');
                ig.input.bind(ig.KEY.L, 'L');
                ig.input.bind(ig.KEY.M, 'M');
                ig.input.bind(ig.KEY.N, 'N');
                ig.input.bind(ig.KEY.O, 'O');
                ig.input.bind(ig.KEY.P, 'P');
                ig.input.bind(ig.KEY.Q, 'Q');
                ig.input.bind(ig.KEY.R, 'R');
                ig.input.bind(ig.KEY.S, 'S');
                ig.input.bind(ig.KEY.T, 'T');
                ig.input.bind(ig.KEY.U, 'U');
                ig.input.bind(ig.KEY.V, 'V');
                ig.input.bind(ig.KEY.W, 'W');
                ig.input.bind(ig.KEY.X, 'X');
                ig.input.bind(ig.KEY.Y, 'Y');
                ig.input.bind(ig.KEY.Z, 'Z');
                ig.input.bind(ig.KEY.BACKSPACE, 'BACKSPACE');
                ig.input.bind(ig.KEY.SHIFT, 'SHIFT');
            }
        },

        setupInput: function () {
            ig.input.bind(ig.KEY.SPACE, 'SPACE');
            ig.input.bind(ig.KEY.ENTER, 'ENTER');
            ig.input.bind(ig.KEY.UP_ARROW, 'UP');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'DOWN');
        },

        checkKeyboardOption:function() {
            if (ig.input.pressed('ENTER') && this.optionSelectedByKeyboard != 0) {
                this.buttons['btnOption' + this.optionSelectedByKeyboard].clicked();
            }
            else if ((ig.input.pressed('UP') || ig.input.pressed('DOWN')) && this.optionSelectedByKeyboard == 0) {
                for(var noOp=1; noOp <=this.totalOption; noOp++){
                    if(this.buttons['btnOption' + noOp].enabled == true) {
                        this.optionSelectedByKeyboard = noOp;
                        this.buttons['btnOption' + noOp].isHover = true;
                        break;
                    }
                }
            }
            else if (ig.input.pressed('UP')) {
                for(var noOp=this.totalOption; noOp>=1; noOp--){
                    if(this.buttons['btnOption' + noOp].enabled == true && noOp < this.optionSelectedByKeyboard) {
                        this.buttons['btnOption' + this.optionSelectedByKeyboard].isHover = false;
                        this.optionSelectedByKeyboard = noOp;
                        this.buttons['btnOption' + noOp].isHover = true;
                        break;
                    }
                }
            }
            else if (ig.input.pressed('DOWN')) {
                for(var noOp=1; noOp <=this.totalOption; noOp++){
                    if(this.buttons['btnOption' + noOp].enabled == true && noOp > this.optionSelectedByKeyboard) {
                        this.buttons['btnOption' + this.optionSelectedByKeyboard].isHover = false;
                        this.optionSelectedByKeyboard = noOp;
                        this.buttons['btnOption' + noOp].isHover = true;
                        break;
                    }
                }
            }
        },

        checkButtonInput: function () {
            if(!this.isInputKeyboard) return;

            var isShift = false;
            var textToAdd = "";

            if(ig.input.state('SHIFT') != null)  { isShift = ig.input.state('SHIFT'); }

            if (ig.input.pressed('A')) {
                textToAdd = "a";
            } else if (ig.input.pressed('B')) {
                textToAdd = "b";
            } else if (ig.input.pressed('C')) {
                textToAdd = "c";
            } else if (ig.input.pressed('D')) {
                textToAdd = "d";
            } else if (ig.input.pressed('E')) {
                textToAdd = "e";
            } else if (ig.input.pressed('F')) {
                textToAdd = "f";
            } else if (ig.input.pressed('G')) {
                textToAdd = "g";
            } else if (ig.input.pressed('H')) {
                textToAdd = "h";
            } else if (ig.input.pressed('I')) {
                textToAdd = "i";
            } else if (ig.input.pressed('J')) {
                textToAdd = "j";
            } else if (ig.input.pressed('K')) {
                textToAdd = "k";
            } else if (ig.input.pressed('L')) {
                textToAdd = "l";
            } else if (ig.input.pressed('M')) {
                textToAdd = "m";
            } else if (ig.input.pressed('N')) {
                textToAdd = "n";
            } else if (ig.input.pressed('O')) {
                textToAdd = "o";
            } else if (ig.input.pressed('P')) {
                textToAdd = "p";
            } else if (ig.input.pressed('Q')) {
                textToAdd = "q";
            } else if (ig.input.pressed('R')) {
                textToAdd = "r";
            } else if (ig.input.pressed('S')) {
                textToAdd = "s";
            } else if (ig.input.pressed('T')) {
                textToAdd = "t";
            } else if (ig.input.pressed('U')) {
                textToAdd = "u";
            } else if (ig.input.pressed('V')) {
                textToAdd = "v";
            } else if (ig.input.pressed('W')) {
                textToAdd = "w";
            } else if (ig.input.pressed('X')) {
                textToAdd = "x";
            } else if (ig.input.pressed('Y')) {
                textToAdd = "y";
            } else if (ig.input.pressed('Z')) {
                textToAdd = "z";
            } else if (ig.input.pressed('SPACE')) {
                textToAdd = " ";
            } else if (ig.input.pressed('BACKSPACE')) {
                this.tempTextView.removeText();
            }

            if(textToAdd != "") {
                if(ig.input.isUpperCase) {
                    if(isShift) {
                         textToAdd = textToAdd.toLowerCase();
                    } else {
                        textToAdd = textToAdd.toUpperCase();
                    }
                } else {
                   if(!isShift) {
                         textToAdd = textToAdd.toLowerCase();
                    } else {
                        textToAdd = textToAdd.toUpperCase();
                    }
                }

                this.tempTextView.addText(textToAdd);
            }
        },

        enable_buttons:function(bool) {
            this.buttons.btnOption1.isClickable = bool;
            this.buttons.btnOption2.isClickable = bool;
            this.buttons.btnOption3.isClickable = bool;
            this.buttons.btnSetting.isClickable = bool;

            // if(_DATAGAME.chapters.multipleChapter) {
            //     this.buttons.btnHome.isClickable = bool;
            // }
            this.entityGame.uiCurrency.btnShop.isClickable = bool;
        },

        afterRVSuccess:function() {
            this.buttons.btnOption1.isClickable = false;
            this.buttons.btnOption2.isClickable = false;
            this.buttons.btnOption3.isClickable = false;
            this.buttons.btnOption1.showOption(false, true);
            this.buttons.btnOption2.showOption(false, false);
            this.buttons.btnOption3.showOption(false, false);
            
            this.buttons['btnOption' + this.optionSelected].hasClick = true;
            this.checkOptionReward();
            this.entityGame.uiCurrency.showUI(false);

            if(this.optionType == 'du') {
                var tempDU = this.buttons['btnOption' + this.optionSelected].textButton.replaceAll(" ", ""); 
                ig.game.sessionData.dressUpTheme[this.numChapter].now = tempDU.toLowerCase();
                var idxChar = this.arrChar.indexOf('Amy');
                this['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpTheme[this.numChapter].now);
            }
        },

        checkOptionReward:function() {
            var rewardAvailable = false;

            if(ig.game.sessionData.isReward[this.numChapter] && _DATAGAME.enableCurrency) {
                var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
                if(storyNow.option[this.optionSelected].reward != null) {
                    var totalReward = 0;

                    for(var i=1;i<=_DATAGAME.totalVirtualCurrency;i++) {
                        if(storyNow.option[this.optionSelected].reward['virtualCurrency' + i] != null) {
                            totalReward = storyNow.option[this.optionSelected].reward['virtualCurrency' + i];
                            this['virtualCurrency' + i] += parseInt(totalReward);
                            this.entityGame.uiCurrency.vcGain = i;
                            this.entityGame.uiCurrency.spawnChatBubble(_STRINGS.Game.reward + " " + totalReward);
                            this.entityGame.uiCurrency.repos();
                            rewardAvailable = true;
                        }
                    }
                } 
            }

            if(rewardAvailable) {
                ig.soundHandler.sfxPlayer.play('rewardTieredRV');
            }

            return rewardAvailable;
        },

        checkRewardStory:function() {
            if(ig.game.sessionData.isReward[this.numChapter] && _DATAGAME.enableCurrency) {
                var rewardAvailable = false;
                var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
                if(storyNow.reward != null) {
                    var totalReward = 0;

                    // for(var i=1;i<=3;i++) {
                    for(var i=0;i<=_DATAGAME.virtualCurrencyUsed.length;i++) {
                        var _numVC = _DATAGAME.virtualCurrencyUsed[i];
                        if(storyNow.reward['virtualCurrency' + _numVC] != null) {
                            totalReward = storyNow.reward['virtualCurrency' + _numVC];
                            this['virtualCurrency' + _numVC] += parseInt(totalReward);
                            this.entityGame.uiCurrency.vcGain = _numVC;
                            this.entityGame.uiCurrency.spawnChatBubble(_STRINGS.Game.reward + " " + totalReward);
                            this.entityGame.uiCurrency.repos();
                            rewardAvailable = true;
                        }
                    }
                } 

                this.entityGame.uiCurrency.isShop = false;
                if(rewardAvailable) {
                    ig.soundHandler.sfxPlayer.play('rewardTieredRV');
                    this.entityGame.uiCurrency.showUI(true);
                }
            }
        },

        afterRVFail:function() {
            this.buttons['btnOption' + this.optionSelected].spawnChatBubble(_STRINGS.Game.adserror);
        },

        searchIdxChar:function(_storyNow, _charName) {
            return _storyNow.char.map(function(e) { return e.name; }).indexOf(_charName);
        },

        searchIdxAnimEffectChar:function(_storyNow, _charName) {
            return _storyNow.animEffect.char.map(function(e) { return e.name; }).indexOf(_charName);
        },

        checkBGM:function() {
            if(!_DATAGAME.loadBackgroundMusic) return;
            
            var storyNow = _STRINGS['Chapter' + this.numChapter][this.numChat];

            if(storyNow.bgm != null && storyNow.bgm.name != null) {
                var bgmName = storyNow.bgm.name.replaceAll("-", "");
                if(bgmName == 'default') bgmName = 'bgmdefault';

                if(bgmName != ig.game.lastBGM) {
                    if((bgmName == 'bgmdefault' || bgmName == (_RESOURCESINFO.bgm).replaceAll("-", "")) && (ig.game.lastBGM == 'bgmdefault' || ig.game.lastBGM == (_RESOURCESINFO.bgm).replaceAll("-", ""))) {

                    } else {
                        ig.soundHandler.bgmPlayer.onStopBGM();
                        ig.game.lastBGM = bgmName;
                        ig.soundHandler.bgmPlayer.play(bgmName);
                        ig.soundHandler.bgmPlayer.volume(ig.game.sessionData.music/ig.game.maxVolume);
                    }
                }
            }
        },

        checkScriptVariable:function(storyNow, _firstLoad) {
            if(_firstLoad == null) _firstLoad = false;
            //ADD VARIABLE
            if(_CUSTOMLOAD.Chapter[this.numChapter].variable != null && _CUSTOMLOAD.Chapter[this.numChapter].variable.length>0) {
                for(var varBool=0;varBool<_CUSTOMLOAD.Chapter[this.numChapter].variable.length;varBool++) {
                    if(ig.game.sessionData[_CUSTOMLOAD.Chapter[this.numChapter].variable[varBool]] == null) {
                        ig.game.sessionData.varScript.push(_CUSTOMLOAD.Chapter[this.numChapter].variable[varBool]);
                        ig.game.save(_CUSTOMLOAD.Chapter[this.numChapter].variable[varBool], false);
                    }
                }
            }

            if(storyNow.variable && storyNow.variable.length > 0){
                for(var _varBool=0; _varBool<storyNow.variable.length;_varBool++){
                    if(typeof storyNow.variable[_varBool].value === 'number' && (typeof ig.game.sessionData[storyNow.variable[_varBool].type] != 'number')){
                        ig.game.sessionData[storyNow.variable[_varBool].type] = 0;
                    }

                    var _valueIntScript = storyNow.variable[_varBool].value;

                    if(!_firstLoad){
                        if(typeof storyNow.variable[_varBool].value === 'number' ||
                            (storyNow.variable[_varBool].value.min != null && storyNow.variable[_varBool].value.max != null)
                            ) {
                            if(storyNow.variable[_varBool].value.min != null && storyNow.variable[_varBool].value.max != null) {
                                _valueIntScript = ig.game.calculateRandom(storyNow.variable[_varBool].value.min, storyNow.variable[_varBool].value.max);
                            }

                            if(storyNow.variable[_varBool].operator == '+') {
                                ig.game.sessionData[storyNow.variable[_varBool].type] += _valueIntScript;
                            } else if(storyNow.variable[_varBool].operator == '-') {
                                ig.game.sessionData[storyNow.variable[_varBool].type] -= _valueIntScript;
                            } else if(storyNow.variable[_varBool].operator == '/') {
                                ig.game.sessionData[storyNow.variable[_varBool].type] /= _valueIntScript;
                            } else if(storyNow.variable[_varBool].operator == '*') {
                                ig.game.sessionData[storyNow.variable[_varBool].type] *= _valueIntScript;
                            } else {
                                ig.game.sessionData[storyNow.variable[_varBool].type] = _valueIntScript;
                            }
                        } else {
                            ig.game.sessionData[storyNow.variable[_varBool].type] = storyNow.variable[_varBool].value;
                        }
                    }

                    if(!_firstLoad) {
                        ig.game.consoleLog('VARIABLE ' + storyNow.variable[_varBool].type + ' ' + storyNow.variable[_varBool].operator + ' ' + _valueIntScript);
                    }
                    ig.game.consoleLog('VARIABLE ' + storyNow.variable[_varBool].type + ' = ' + ig.game.sessionData[storyNow.variable[_varBool].type]);
                }
            }
        },

        checkStory:function() {
            this.isDelayFlashback = false;
            var boolFreeze = false;
            var numStory = this.numChat; //console.log(this.numChapter + ' ' + numStory + ' ' + _STRINGS['Chapter' + this.numChapter]);
            var storyNow = _STRINGS['Chapter' + this.numChapter][numStory];
            this.checkScriptVariable(storyNow, true);

            this.checkAnimDelayOnTransition(storyNow);

            if(storyNow.animEffect != null && (ig.game.getString(storyNow.animEffect.type) == 'trans' || ig.game.getString(storyNow.animEffect.type) == 'flashback' || ig.game.getString(storyNow.animEffect.type) == 'flashback_end')) {
                this.checkAnimDelayOnTransition(storyNow);
                this.checkOutfitChar(storyNow);

                if(ig.game.getString(storyNow.animEffect.type) == 'flashback') {
                    ig.game.sessionData.isFlashback[this.numChapter] = true;
                    ig.game.sessionData.flashbackColor[this.numChapter] = storyNow.animEffect.color;
                } else if(!ig.game.getString(storyNow.animEffect.type) == 'flashback') {
                    ig.game.sessionData.isFlashback[this.numChapter] = false;
                }

                this.numChat++;

                // if(_STRINGS['Chapter' + this.numChapter][this.numChat].animEffect != null && ig.game.getString(_STRINGS['Chapter' + this.numChapter][this.numChat].animEffect.type) == 'text_chat') {
                //     this.entityGame.phone = ig.game.spawnEntity(EntityPhone, 0, 0 , {_parent:this});
                //     this.entityGame.phone.repos();
                // }
            }

            if(storyNow.animEffect != null && ig.game.getString(storyNow.animEffect.type) == 'text_chat') {
                this.canClickStage = false;
                var _idxPhoneStory = this.searchIdxPhone(storyNow.animEffect.name);
                this.entityGame.phone = ig.game.spawnEntity(EntityPhone, 0, 0 , {_parent:this, idxStory:storyNow.animEffect.name});
                this.entityGame.phone.repos();
            }

            if(storyNow.animEffect != null && ig.game.getString(storyNow.animEffect.type) == 'letter') {
                this.canClickStage = false;
                this.entityGame.letter = ig.game.spawnEntity(EntityLetter, 0, 0 , {_parent:this, idxStory:storyNow.animEffect.name});
                this.entityGame.letter.repos();
            }

            if(storyNow.animEffect != null && ig.game.getString(storyNow.animEffect.type) == 'email') {
                this.canClickStage = false;
                this.entityGame.email = ig.game.spawnEntity(EntityEmail, 0, 0 , {_parent:this, idxStory:storyNow.animEffect.name});
                this.entityGame.email.repos();
            }

            if(storyNow.animEffect != null && ig.game.getString(storyNow.animEffect.type) == 'freeze_frame') {
                boolFreeze = true;
                // this.backBG = ig.game.spawnEntity(EntityOverlayBackground, 0, 0, { _parent:this, placeName:_STRINGS['Chapter' + this.numChapter][this.lastChatId].bg.name });
                this.bg = ig.game.spawnEntity(EntityBackground, 0, 0, { _parent:this, placeName:_STRINGS['Chapter' + this.numChapter][this.lastChatId].bg.name });
                numStory = this.lastChatId;
                storyNow = _STRINGS['Chapter' + this.numChapter][numStory];
            } else {
                // this.backBG = ig.game.spawnEntity(EntityOverlayBackground, 0, 0, { _parent:this, placeName:_STRINGS['Chapter' + this.numChapter][this.numChat].bg.name });
                this.bg = ig.game.spawnEntity(EntityBackground, 0, 0, { _parent:this, placeName:_STRINGS['Chapter' + this.numChapter][this.numChat].bg.name });
                numStory = this.numChat;
                storyNow = _STRINGS['Chapter' + this.numChapter][numStory];
            }
            
            if(storyNow.bg.pos != null) {
                if(storyNow.bg.pos == 'left') {
                    this.lastposXBG = -700;
                    this.posXBG = -700;
                } else if(storyNow.bg.pos == 'center') {
                    this.lastposXBG = 0;
                    this.posXBG = 0;
                } else if(storyNow.bg.pos == 'right') {
                    this.lastposXBG = 700;
                    this.posXBG = 700;
                } 
                
                this.bg.repos();
                this.repos();
            }

            if (storyNow.object){
                this.placeOverlayObject(false, storyNow);
            }

            this.checkParticle(storyNow);

            this.checkTopOverlay(storyNow);

            this.checkWindowBoxing(storyNow);

            this.checkVignette(storyNow);

            this.checkProgressBar(storyNow);

            if(storyNow.char.length <= 0) return;
            for(var i=0;i<storyNow.char.length;i++) {
                if(storyNow.char[i]) {
                    var idxChar = 0;
                    
                    if(this.arrChar.indexOf(storyNow.char[i].name) == -1) {

                        if(storyNow.animEffect == null || (storyNow.animEffect.type != 'walk_in' && storyNow.animEffect.type != 'fade_in') || 
                            ((storyNow.animEffect.type == 'walk_in' && this.searchIdxAnimEffectChar(storyNow, storyNow.char[i].name) == -1) || (storyNow.animEffect.type == 'fade_in' && this.searchIdxAnimEffectChar(storyNow, storyNow.char[i].name) == -1)) || 
                            ((storyNow.animEffect.type == 'walk_in' && boolFreeze) || (storyNow.animEffect.type == 'fade_in' && boolFreeze))
                        ) {
                            this.arrChar.push(storyNow.char[i].name);
                            this.posDefChar.push({x:0, y:0});
                            this.offsetDefChar.push({x:0, y:500*_DATAGAME.ratioRes, alpha:1});

                            idxChar = this.arrChar.length - 1;

                            if(storyNow.char[i].name == 'Amy' || _DATAGAME.neutral_girl.indexOf(storyNow.char[i].name) >= 0) {
                                this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { _parent:this, charName:storyNow.char[i].name.toLowerCase(), noChar:idxChar });
                            } else if(_DATAGAME.neutral_boy.indexOf(storyNow.char[i].name) >= 0) {
                                this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterBoy, ig.game.midX, ig.game.midY, { charName:storyNow.char[i].name.toLowerCase(), _parent:this, noChar:idxChar });
                            }
                            else {
                                if(ig.game.sessionData.loveInterest == 'girl') {
                                     this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { _parent:this, charName:storyNow.char[i].name.toLowerCase(), noChar:idxChar });
                                } else {
                                    this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterBoy, ig.game.midX, ig.game.midY, { charName:storyNow.char[i].name.toLowerCase(), _parent:this, noChar:idxChar });
                                }
                            }

                            this['sptChar' + idxChar].checkShadow(storyNow.char[i].shadow);

                            if(storyNow.char[i].name == 'Amy') {
                                if(storyNow.char[i].outfit != null) {
                                    ig.game.sessionData.dressUpTheme[this.numChapter].now = storyNow.char[i].outfit.toLowerCase().replaceAll(" ", "");
                                }
                                ig.game.consoleLog('Amy : '  + ig.game.sessionData.dressUpTheme[this.numChapter].now);
                                this['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpTheme[this.numChapter].now);
                            } else {
                                var _currentName = storyNow.char[i].name.toLowerCase();
                                _currentName = _currentName.replaceAll(" ", "");
                                this.checkCurrentCharDU(_currentName);
                                if(storyNow.char[i].outfit != null) {
                                    var _outfitName = storyNow.char[i].outfit.toLowerCase();
                                    _outfitName = _outfitName.replaceAll(" ", "");
                                    ig.game.sessionData.dressUpChar[this.numChapter][_currentName] = _outfitName;
                                }
                                this['sptChar' + idxChar].charName = ig.game.sessionData.dressUpChar[this.numChapter][_currentName];
                                ig.game.consoleLog(storyNow.char[i].name + ' : ' + this['sptChar' + idxChar].charName);
                                this['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpChar[this.numChapter][_currentName]);
                            }

                            if((storyNow.char[i].posX != null && Math.abs(storyNow.char[i].posX) >= 5000) || (storyNow.char[i].posY != null && Math.abs(storyNow.char[i].posY) >= 5000)) {

                            } else {
                                this.totalChar++;
                            }
                            
                            this.isVisibleChar[idxChar] = true;

                            this.offsetDefChar[idxChar].x = this.posXIn[storyNow.char[i].position];

                            this.calculatePosChar(idxChar);

                            var isRear = (storyNow.char[i].anim.substring(storyNow.char[i].anim.length - 4, storyNow.char[i].anim.length).toLowerCase() == 'rear') ? true :false;

                            if(isRear) {
                                this['sptChar' + idxChar].changePose('ANIM_IDLE_REAR', storyNow.char[i].handheld, storyNow.char[i].shadow, storyNow.char[i].animSpeed, storyNow.char[i].tint);

                                //CHANGE SPRITER SCALE
                                this['sptChar' + idxChar].changeScale(storyNow.char[i].scale, this['sptChar' + idxChar].flipState);
                            }

                            if(this['sptChar' + idxChar]) { //console.log(storyNow.char[i]);
                                if(storyNow.char[i].position == null) {
                                    this.offsetDefChar[idxChar].x = (storyNow.char[i].posX == null) ? 200*_DATAGAME.ratioRes : (storyNow.char[i].posX - ig.sizeHandler.minW / 2);
                                    this.offsetDefChar[idxChar].y = (storyNow.char[i].posY == null) ? 500*_DATAGAME.ratioRes : (storyNow.char[i].posY - ig.sizeHandler.minH / 2);
                                } else {
                                    if(storyNow.char[i].faceTo == null) {
                                        if((storyNow.char[i].position == 'left' && !isRear) || ((storyNow.char[i].position == 'right' || storyNow.char[i].position == 'center') && isRear)) {
                                            this['sptChar' + idxChar].changeScale(1, -1);
                                        } 
                                        else {
                                            this['sptChar' + idxChar].changeScale(1, 1);
                                        }
                                    } else {
                                        if(storyNow.char[i].faceTo == 'right') {
                                            this['sptChar' + idxChar].changeScale(1, -1);
                                        } 
                                        else {
                                            this['sptChar' + idxChar].changeScale(1, 1);
                                        }
                                    }
                                }
                            }
                        } 
                    }

                }
            }
            
            if(this.numChat - 1 >= 0) {
                var storyAnim = _STRINGS['Chapter' + this.numChapter][this.numChat-1];
                if(storyAnim.animEffect != null && (ig.game.getString(storyAnim.animEffect.type) == 'trans' || ig.game.getString(storyAnim.animEffect.type) == 'flashback')) {
                    storyAnim = _STRINGS['Chapter' + this.numChapter][this.numChat];
                } 
                this.playAnimCharStory(storyAnim, true);
            } else {
                var storyAnim = _STRINGS['Chapter' + this.numChapter][this.numChat];
                this.playAnimCharStory(storyAnim, true, true);
            }
            this.checkBGM();
        },

        checkCurrentCharDU:function(_name) {
            if(ig.game.sessionData.dressUpChar[this.numChapter] == null) {
                ig.game.sessionData.dressUpChar[this.numChapter] = {  };
            }

            if(ig.game.sessionData.dressUpChar[this.numChapter][_name] == null) {
                ig.game.sessionData.dressUpChar[this.numChapter][_name] = _name;
            } 
        },

        checkOutfitChar:function(storyNow) {
            for(var i=0;i<storyNow.char.length;i++) {
                if(storyNow.char[i]) {
                   if(storyNow.char[i].name == 'Amy') {
                        if(storyNow.char[i].outfit != null) {
                            var _outfitNameMC = storyNow.char[i].outfit.toLowerCase();
                            _outfitNameMC = _outfitNameMC.replaceAll(" ", "");
                           ig.game.sessionData.dressUpTheme[this.numChapter].now = _outfitNameMC;
                        }
                    } else {
                        var _currentName = storyNow.char[i].name.toLowerCase();
                        _currentName = _currentName.replaceAll(" ", "");
                        this.checkCurrentCharDU(_currentName);
                        
                        if(storyNow.char[i].outfit != null) {
                            var _outfitName = storyNow.char[i].outfit.toLowerCase();
                            _outfitName = _outfitName.replaceAll(" ", "");
                            ig.game.sessionData.dressUpChar[this.numChapter][_currentName] = _outfitName;
                        }
                    }
                }
            }
        },

        checkBGAnimation:function(storyNow, boolStop) {
            if(boolStop == null) boolStop = false;

            if(storyNow.bg != null && storyNow.bg.type != null && storyNow.bg.type == 'scroll') {
                var directionBG = storyNow.bg.direction.toLowerCase();
                if(directionBG == 'up' || directionBG == 'down') {
                    if(!this.bg.isVertical) {
                        this.bg.isVertical = true;
                        this.bg.repos();
                    }
                } else {
                    if(this.bg.isVertical) {
                        this.bg.isVertical = false;
                        this.bg.repos();
                    }
                }

                this.bg.scrollDirection = directionBG;

                if(storyNow.bg.speed == null || storyNow.bg.speed == 0) {
                    this.bg.isScroll = false;
                } else {
                    if(directionBG == 'up' || directionBG == 'left') this.bg.speed = storyNow.bg.speed * -1;
                    else this.bg.speed = storyNow.bg.speed;
                    
                    if(boolStop == false) this.bg.isScroll = true;
                }
            } 
            else {
                this.bg.isScroll = false;
                // if(this.bg.isVertical) {
                //     this.bg.isVertical = false;
                //     this.bg.repos();
                // }
            }
        },

        checkAnimDelayOnTransition:function(storyNow) {
            if(storyNow.animEffect != null && storyNow.animEffect.animStart != null && storyNow.animEffect.animStart.toLowerCase() == 'instant') { 
                ig.game.animDelayed = false; 
            }
            else { 
                if(storyNow.animEffect != null && storyNow.animEffect.animStart != null) {
                    ig.game.animDelayed = true; 
                } else {
                    //CHECK IF SCROLLING BG
                    if(storyNow.bg != null && storyNow.bg.type != null && storyNow.bg.type == 'scroll') {
                        this.isAutoScroll = true;
                        ig.game.animDelayed = false;
                    } else {
                        ig.game.animDelayed = true;
                    }
                }
            }
        },

        playAnimCharStory:function(storyNow, boolStop, boolStart) {
            if(boolStop == null) boolStop = false;

            this.checkBGAnimation(storyNow, boolStop);

            if(storyNow.char.length > 0) {
                for(var i=0;i<storyNow.char.length;i++) {
                    if(this.arrChar.indexOf(storyNow.char[i].name) >= 0) {
                        if(boolStart == true) {
                            if(storyNow.char[i].anim.substring(0, 9) == 'ANIM_LAY_' ||
                                storyNow.char[i].anim.substring(0, 11) == 'ANIM_PIANO_'
                            ) {
                                this.changeAnimChar(storyNow, i, boolStop);
                            }
                        } else {
                            this.changeAnimChar(storyNow, i, boolStop);
                        }
                    }
                }
            }
        },

        changeAnimChar:function(storyNow, i, boolStop) {
            if(this['tweenDelayAnimChar' + i] != null) this['tweenDelayAnimChar' + i].stop(false);
            this['tweenDelayAnimChar' + i] = null;

            var durDelayAnim = (storyNow.char[i].anim_delay == null) ? 0 : storyNow.char[i].anim_delay;
            var paramDelay = 0;

            if(durDelayAnim == 0) {
                this.playCharPose(storyNow, i, boolStop);
            } else {
                this['tweenDelayAnimChar' + i] = this.tween({
                    paramDelay:1
                }, durDelayAnim, { 
                    easing: ig.Tween.Easing.Linear.EaseNone, 
                    onComplete: function (_storyNow, _i, _boolStop) {
                        this.playCharPose(_storyNow, _i, _boolStop);
                    }.bind(this, storyNow, i, boolStop)
                }).start();
            }
        },

        playCharPose:function(storyNow, i, boolStop) {
            //CHECK FACETO
            var isRear = (storyNow.char[i].anim.substring(storyNow.char[i].anim.length - 4, storyNow.char[i].anim.length).toLowerCase() == 'rear') ? true :false;
            var _idxArrChar = this.arrChar.indexOf(storyNow.char[i].name);

            if(storyNow.char[i].faceTo == null) {
                if((storyNow.char[i].position == 'left' && !isRear) || ((storyNow.char[i].position == 'right' || storyNow.char[i].position == 'center') && isRear)) {
                    this['sptChar' + _idxArrChar].changeScale(1, -1);
                } else {
                    this['sptChar' + _idxArrChar].changeScale(1, 1);
                }
            } else {
                if(storyNow.char[i].faceTo == 'right') {
                    this['sptChar' + _idxArrChar].changeScale(1, -1);
                } else {
                    this['sptChar' + _idxArrChar].changeScale(1, 1);
                }
            }

            this.checkEmotionandMouthFrown(_idxArrChar, storyNow, i);

            // //CHECK EMOTION
            // this['sptChar' + _idxArrChar].isHaveEmotion = true;
            // if(_DATAGAME.noEmotion.indexOf(storyNow.char[i].anim) >= 0) {
            //     this['sptChar' + _idxArrChar].isHaveEmotion = false;
            // }

            // //CHECK MOUTH FROWN
            // if(_DATAGAME.frownEmo.indexOf(storyNow.char[i].anim) >= 0 || _DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion) == _DATAGAME.listEmotion.indexOf("EMO_ANGRY") || _DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion) == _DATAGAME.listEmotion.indexOf("EMO_SAD")) {
            //     this['sptChar' + _idxArrChar].isFrown = true;
            // } else {
            //     this['sptChar' + _idxArrChar].isFrown = false;
            // }
            
            // if(_DATAGAME.frownEmo.indexOf(storyNow.char[i].anim) >= 0) {
            //     this['sptChar' + _idxArrChar].isMouthDefault = false;
            // } else {
            //     this['sptChar' + _idxArrChar].isMouthDefault = true;
            // }

            if(_idxArrChar != -1 && storyNow.char[i].anim != 'ANIM_NONE') { // _DATAGAME[storyNow.char[i].anim] != 'ANIM_NONE'
                //SET ANIM SPEED NORMAL
                var _defAnimSpeed = storyNow.char[i].animSpeed;
                if(storyNow.char[i].animSpeed == null || storyNow.char[i].animSpeed <= 0) _defAnimSpeed = 100;

                this['sptChar' + _idxArrChar].changePose(storyNow.char[i].anim.toUpperCase(), storyNow.char[i].handheld, storyNow.char[i].shadow, _defAnimSpeed, storyNow.char[i].tint);

                //CHANGE SPRITER SCALE
                this['sptChar' + _idxArrChar].changeScale(storyNow.char[i].scale, this['sptChar' + _idxArrChar].flipState);

                if(boolStop == true) {
                    var _timePausePose = this['sptChar' + _idxArrChar].timePausePose[_DATAGAME.pose.indexOf(storyNow.char[i].anim)]; //_DATAGAME[storyNow.char[i].anim]
                    if(_timePausePose > 0) {
                        this['sptChar' + _idxArrChar].boolStart = true;
                        this['sptChar' + _idxArrChar].boolPauseTalking = true;
                        this['sptChar' + _idxArrChar].spriter.time = _timePausePose;
                        this['sptChar' + _idxArrChar].spriter.pause = true;
                    }
                }
            }

            // if(_idxArrChar != -1 && _DATAGAME[storyNow.char[i].emotion] != 'ANIM_NONE') {
            if(_idxArrChar != -1 && storyNow.char[i].emotion != 'ANIM_NONE') {
                this['sptChar' + _idxArrChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion));
            }
        },

        checkEmotionandMouthFrown:function(_idxArrChar, storyNow, i) {
            //CHECK EMOTION
            this['sptChar' + _idxArrChar].isHaveEmotion = true;
            if(_DATAGAME.noEmotion.indexOf(storyNow.char[i].anim) >= 0) {
                //CHECK IF HAVE EMOTION
                // this['sptChar' + _idxArrChar].isHaveEmotion = false;
            }

            //CHECK MOUTH FROWN
            // if(_DATAGAME.frownEmo.indexOf(storyNow.char[i].anim) >= 0 || _DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion) == _DATAGAME.listEmotion.indexOf("EMO_ANGRY") || _DATAGAME.listEmotion.indexOf(storyNow.char[i].emotion) == _DATAGAME.listEmotion.indexOf("EMO_SAD")) {
            if(_DATAGAME.frownEmo.indexOf(storyNow.char[i].anim) >= 0 || _emoEye[storyNow.char[i].emotion].mouthFrown == true) {
                this['sptChar' + _idxArrChar].isFrown = true;
            } else {
                this['sptChar' + _idxArrChar].isFrown = false;
            }
            
            if(_DATAGAME.frownEmo.indexOf(storyNow.char[i].anim) >= 0) {
                this['sptChar' + _idxArrChar].isMouthDefault = false;
            } else {
                this['sptChar' + _idxArrChar].isMouthDefault = true;
            }
        },

        playSFXStory:function(storyNow) {
            if(this.sfxAlreadyPlayed) return;

            //CHECK SFX
            if(storyNow.sfx != null) { //console.log(ig.game.dataSFXLoop);
                if(storyNow.sfx.stop != null && storyNow.sfx.stop && ig.game.dataSFXLoop != null) {
                    ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXLoop.name, ig.game.dataSFXLoop.id);
                    ig.game.dataSFXLoop = null;
                }

                //ADD DELAY SFX
                if(storyNow.sfx.name != null) {
                    if(storyNow.sfx.loop == null || !storyNow.sfx.loop) {
                        if(storyNow.sfx.delay == null || storyNow.sfx.delay <= 0) {
                            ig.soundHandler.sfxPlayer.playSFX(storyNow.sfx.name, false);
                            ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
                        } else {
                            ig.game.tweenDelay(this, storyNow.sfx.delay*1000, function() {
                                ig.soundHandler.sfxPlayer.playSFX(storyNow.sfx.name, false);
                                ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
                            }.bind(this));
                        }
                        // ig.game.dataSFXLoop = null;
                    } else {
                        if(storyNow.sfx.delay == null || storyNow.sfx.delay <= 0) {
                            ig.game.dataSFXLoop = ig.soundHandler.sfxPlayer.playSFX(storyNow.sfx.name, storyNow.sfx.loop);
                            ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
                        } else {
                            ig.game.tweenDelay(this, storyNow.sfx.delay*1000, function() {
                                ig.game.dataSFXLoop = ig.soundHandler.sfxPlayer.playSFX(storyNow.sfx.name, storyNow.sfx.loop);
                                ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
                            }.bind(this));
                        }
                    }
                }
            }

            //CHECK VOICEOVER
            if(_DATAGAME.enableVoiceOver) {
                if(ig.game.dataVoiceOver != null) {
                    ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataVoiceOver.name, ig.game.dataVoiceOver.id);
                    ig.game.dataVoiceOver = null;
                }

                if(_CUSTOMLOAD.Chapter[ig.game.numChapter].voiceover != null && _CUSTOMLOAD.Chapter[ig.game.numChapter].voiceover.indexOf(storyNow.sceneID) >= 0) {
                    var sceneID = storyNow.sceneID;
                    var charTalk = storyNow.charTalk;
                    var voName = 'chapter' + this.numChapter + '_' + sceneID;
                    
                    if(_DATAGAME.dynamic_name.indexOf(charTalk)>=0) {
                        ig.game.dataVoiceOver = ig.soundHandler.sfxPlayer.playSFX(voName + '_' + ig.game.sessionData.loveInterest, false);
                    }
                    else {
                        ig.game.dataVoiceOver = ig.soundHandler.sfxPlayer.playSFX(voName, false);
                    }
                }
            }
            
            this.sfxAlreadyPlayed = true;
        },

        loadBubbleChat:function() {
            this.isBubbleOption = false;
            this.loadSentence = false; this.stopSFXText();
            this.currentWord = 0; 
            this.counterWord = 0;
            this.text = '';

            var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
            this.checkScriptVariable(storyNow);

            this.fullSentence = storyNow.text;
            this.fullSentence = this.fullSentence.replaceAll("{NAME}", ig.game.sessionData.playerName);

            for(var name_interest in _STRINGS.dynamic_character) {
                this.fullSentence = this.fullSentence.replaceAll("{" + name_interest + "}", _STRINGS.dynamic_character[name_interest][ig.game.sessionData.loveInterest]);
            }
 
            if(ig.game.noSpacing) {
                // this.arrText = this.fullSentence.split("");
                var _words = this.fullSentence.split("");
                this.arrText = [];
                ig.game.arrayWordWrapRegex(_words, this.arrText);
            } else {
                this.arrText = this.fullSentence.split(" ");
            }
            this.textTrack = ' ';

            this.isOption = (storyNow.option == null || storyNow.option.length <= 0) ? false : true;

            if(this.isOption) {
                this.isCost = false;
                for(var noOp=1; noOp <=storyNow.option.length-1; noOp++){
                    var textOption;

                    if(typeof storyNow.option[noOp].sceneID == 'string') {
                        textOption = storyNow.option[noOp].sceneID;
                    } else {
                        textOption = _STRINGS["Chapter" + this.numChapter][storyNow.option[noOp].sceneID].text;
                        textOption = textOption.replaceAll("{NAME}", ig.game.sessionData.playerName);
                        for(var name_option in _STRINGS.dynamic_character) {
                            textOption = textOption.replaceAll("{" + name_option + "}", _STRINGS.dynamic_character[name_option][ig.game.sessionData.loveInterest]);
                        }

                        //REMOVE FORMAT FROM OPTION
                        var arrFormatOptionMin = [];
                        var arrFormatOptionMax = [];
                        var boolStartFrmOption = false;
                        var resultFormat = textOption.split('');

                        for(var frm=0;frm<resultFormat.length;frm++){
                            if(resultFormat[frm] == '|') {
                                if(!boolStartFrmOption) {
                                    arrFormatOptionMin.push(frm);
                                    boolStartFrmOption = true;
                                } else {
                                    arrFormatOptionMax.push(frm);
                                    boolStartFrmOption = false;
                                }
                            }
                        }
                        
                        for(var frOption=arrFormatOptionMin.length-1;frOption>=0;frOption--) {
                            resultFormat.splice(arrFormatOptionMin[frOption], arrFormatOptionMax[frOption] - arrFormatOptionMin[frOption] + 2);
                        }
                        textOption = resultFormat.join('');
                    }
                    
                    this.buttons["btnOption" + noOp].textButton = textOption; 
                    if(storyNow.option[noOp].cost == null) {
                        this.buttons["btnOption" + noOp].costType = -1; 
                    } else {
                        // if(_DATAGAME.RVOption && _DATAGAME.CurrencyOption) {
                        if(_DATAGAME.CurrencyOption) {
                            //BENERIN INI
                            var typeCostVC = 0;

                            for(var cost=1;cost<=_DATAGAME.totalVirtualCurrency;cost++) {
                                if(storyNow.option[noOp].cost['virtualCurrency' + cost] != null) {
                                    typeCostVC = cost;
                                    break;
                                }
                            }

                            if(typeCostVC >= 1) {
                                this.isCost = true;
                                this.buttons["btnOption" + noOp].costType = typeCostVC; 
                                this.buttons["btnOption" + noOp].cost = storyNow.option[noOp].cost['virtualCurrency' + typeCostVC]; 
                            } else if(storyNow.option[noOp].cost.rv != null) {
                                if(_DATAGAME.RVOption) {
                                    this.isCost = true; this.buttons["btnOption" + noOp].costType = 0; 
                                }
                                else {
                                    this.buttons["btnOption" + noOp].costType = -1; 
                                }
                            }
                        } else if(!_DATAGAME.RVOption && !_DATAGAME.CurrencyOption) {
                            this.buttons["btnOption" + noOp].costType = -1; 
                        } else {
                            this.isCost = true;
                            this.buttons["btnOption" + noOp].costType = 0; 
                        }
                    }
                    this.buttons["btnOption" + noOp].reloadSize();
                }

                if (this.optionType =='du') {
                    
                } else {
                    this.buttons.btnOption1.posX = (this.isCost) ? this.buttons.btnOption1.posX : 0;
                    this.buttons.btnOption2.posX = (this.isCost) ? this.buttons.btnOption2.posX : 0;
                    this.buttons.btnOption3.posX = (this.isCost) ? this.buttons.btnOption3.posX : 0;
                }
            }

            var dirTail = "none";

            //SET TAIL
            if(storyNow.charTalk != "none") {
                dirTail = storyNow.char[this.searchIdxChar(storyNow, storyNow.charTalk)].position;
                // this['sptChar' + this.arrChar.indexOf(storyNow.charTalk)].isTalking = true;
            } 

            this.playAnimCharStory(storyNow);
            this.playSFXStory(storyNow);

            if(this.fullSentence != null && this.fullSentence != "") { 
                var _charName = storyNow.char[this.searchIdxChar(storyNow, storyNow.charTalk)];
                var _animName = '';
                if(_charName != null) _animName = _charName.anim;

                var durDelayText = (storyNow.text_delay == null) ? 0 : storyNow.text_delay;
                var paramDelay = 0;
                
                if(this.isAutoScroll == true) {
                    this.isAutoScroll = false;
                    durDelayText = 0.5;
                }

                this.tween({
                    paramDelay:1
                }, durDelayText, { 
                    easing: ig.Tween.Easing.Linear.EaseNone, 
                    onComplete: function () {
                        if(storyNow.charTalk != "none") {
                            this['sptChar' + this.arrChar.indexOf(storyNow.charTalk)].isTalking = true;
                        } 
                       this.spawnChatBubble(this.textTrack, this.fullSentence, this.TAIL_STATUS[dirTail], storyNow);
                    }.bind(this)
                }).start();
            } else { 
                var durDelayText = (storyNow.text_delay == null) ? 0 : storyNow.text_delay;
                var paramDelay = 0;
                
                if(this.isAutoScroll == true) {
                    this.isAutoScroll = false;
                    durDelayText = 0.5;
                }

                this.tween({
                    paramDelay:1
                }, durDelayText, { 
                    easing: ig.Tween.Easing.Linear.EaseNone, 
                    onComplete: function () {
                        // var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat + 1];
                        // this.playAnimCharStory(storyNow);
                        
                        // this.numChat++;
                        if(this.isOption == true && this.optionType == 'du') {

                        } else {
                            this.checkChatBubble();
                        }
                    }.bind(this)
                }).start();
            }

            this.checkRewardStory();
        },

        stopSFXText:function() {
            if(ig.game.dataSFXText != null) {
                ig.soundHandler.sfxPlayer.stopSFX(ig.game.dataSFXText.name, ig.game.dataSFXText.id);
                ig.game.dataSFXText = null;
            }
        },

        loadBubbleOption:function() {
            this.isOption = false;
            this.isBubbleOption = true;

            this.text = '';
            this.isBubble = false;
            this.chatBubble.chatBubbleAliveTime = 0.1;
        },

        trackTextFormat:function() {
            this.currentWord++;
            var word = this.arrText[this.currentWord];
            this.text += word;

            if(!ig.game.noSpacing) this.text += " ";

            if(word == '|') {
                this.finishTrackFormat();
            } else {
                this.trackTextFormat();
            }
        },

        finishTrackFormat:function() {
            this.currentWord++;
            this.textTrack = ig.game.wordWrapForChatBubble(this.text, (this.isNarration) ? this.bubbleConfigs.narrationWidth : this.bubbleConfigs.bubbleWidth, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true);
            if(this.textTrack.replaceAll(" ", "") != "|") {
                this.chatBubble._chatBubbleCanvasConfigs.textConfigs.text = this.textTrack;
            }
        }, 

        trackWord:function() {
            if(this.currentWord < this.arrText.length){
                var word = this.arrText[this.currentWord];
                this.text += word;

                if(!ig.game.noSpacing) this.text += " ";

                var startFormat = false;
                if(word == '|') startFormat = true;

                if(startFormat) {
                    this.trackTextFormat();
                } else {
                    this.finishTrackFormat();
                }
                
                // var word = this.arrText[this.currentWord];
                // this.text += word;
                // this.text += " ";
                // this.currentWord++;
                // this.textTrack = ig.game.wordWrapForChatBubble(this.text, (this.isNarration) ? this.bubbleConfigs.narrationWidth : this.bubbleConfigs.width, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true);
                // this.chatBubble._chatBubbleCanvasConfigs.textConfigs.text = this.textTrack;
            } else{
                this.loadSentence = false; this.stopSFXText();
                this.currentWord = 0; this.counterWord = 0;
                this.checkOption();

                // if(ig.game.autoDialog) { 
                    this.timerAutoDialog.set(ig.game.delayDialog);
                    this.timerAutoDialog.reset();
                    this.timerAutoDialog.unpause();
                // }
            }
        },        

        scaleBG:function(scl, pntX, pntY, xDest, funcComp) {
            if(pntX > 0) this.bg.pntX = pntX;
            if(pntY > 0) this.bg.pntY = pntY;
            if(xDest == null) xDest = 0;

            this.lastposXBG = this.posXBG + xDest;
            this.bg.statMove = (this.lastposXBG - this.posXBG > 0) ? this.bg.moveStatus.RIGHT : this.bg.moveStatus.LEFT;
            this.bg.repos();

            this.tween({
                zoomBG:scl,
                posXBG:this.lastposXBG
            }, Math.abs(this.zoomBG - scl)/1.5, {
                easing : ig.Tween.Easing.Linear.EaseNone,
                onComplete:function() {
                    this.bg.statMove = this.bg.moveStatus.NONE;
                    if(funcComp!=null) funcComp();
                }.bind(this)
            }).start();
        },

        panBG:function (xDest, delayDur, funcComp) {
            this.lastposXBG = xDest*_DATAGAME.ratioRes;
            this.bg.statMove = (this.lastposXBG - this.posXBG > 0) ? this.bg.moveStatus.RIGHT : this.bg.moveStatus.LEFT;
            this.bg.repos();

            this.tween({
                posXBG:this.lastposXBG
            }, Math.abs(this.lastposXBG - this.posXBG) / 500, {
                delay:delayDur,
                easing : ig.Tween.Easing.Linear.EaseNone,
                onComplete:function() {
                    this.bg.statMove = this.bg.moveStatus.NONE;
                    if(funcComp!=null) funcComp();
                }.bind(this)
            }).start();
        },

        spawnChatBubble:function(textBubble, fullTextBubble, statTail, _storyBubble) {
            this.bubbleScriptOffsetY = (_storyBubble.bubbleOffsetY == null) ? (_DATAGAME.dialogBox.offsetY * _DATAGAME.ratioRes) : (_storyBubble.bubbleOffsetY * _DATAGAME.ratioRes);

            if(_DATAGAME.speakerName.fontSize != null)  this.bubbleConfigs.fontSizeName = _DATAGAME.speakerName.fontSize*_DATAGAME.ratioRes;

            this.bubbleConfigs.fontSize = ig.game.fontBubbleSize*_DATAGAME.ratioRes;
            if(_storyBubble.textFontSize != null) {
                this.bubbleConfigs.fontSize = _storyBubble.textFontSize*_DATAGAME.ratioRes;
            }


            var charName = _storyBubble.charTalk;
            var bubbleType = _storyBubble.bubbleType;
            var nameTag = _storyBubble.nameTag;

            var dialogBoxName = _storyBubble.charTalk.toLowerCase().replaceAll(" ", "");
            if(_DATAGAME.dialogBox[dialogBoxName] == null) dialogBoxName = 'default';

            var _charName = _storyBubble.char[this.searchIdxChar(_storyBubble, _storyBubble.charTalk)];
            var animChar = '';
            var faceToChar = '';

            var isRear = false;

            if(_charName != null) {
                animChar = _charName.anim;

                var isRear = (animChar.substring(animChar.length - 4, animChar.length).toLowerCase() == 'rear') ? true :false;
                if(isRear == true) {
                    if(_charName.faceTo == null) {
                        if(_charName.position == 'right' || _charName.position == 'center') {
                            faceToChar = 'right';
                        } else {
                            faceToChar = 'left';
                        }
                    } else {
                        faceToChar = _charName.faceTo;
                    }
                }
            }

            this.plusYBubble = 0;
            var sizeName = { x:0, y:this.bubbleConfigs.fontSizeName+10*_DATAGAME.ratioRes };

            if(bubbleType == null) {
                bubbleType = "default";
            } else {
                bubbleType = bubbleType.toLowerCase();
            }
            
            var tempName = charName;
            if(charName != 'none') {
                if(charName.toLowerCase() == 'amy') {
                    tempName = ig.game.sessionData.playerName;
                } else if(_DATAGAME.neutral_girl.indexOf(charName) < 0 && _DATAGAME.neutral_boy.indexOf(charName) < 0) {
                    tempName = _STRINGS.dynamic_character[charName][ig.game.sessionData.loveInterest];
                }

                var ctx = ig.system.context;
                ctx.font = this.bubbleConfigs.fontSizeName + 'px ' + this.bubbleConfigs.fontTextName;
                sizeName.x = ctx.measureText(tempName).width + 40*_DATAGAME.ratioRes;
            } else {
                if(nameTag != null) {
                    if(nameTag.toLowerCase() == 'amy') {
                        tempName = ig.game.sessionData.playerName;
                    } else if(_DATAGAME.neutral_girl.indexOf(nameTag) < 0 && _DATAGAME.neutral_boy.indexOf(nameTag) < 0) {
                        if(_STRINGS.dynamic_character[nameTag] != null){
                            tempName = _STRINGS.dynamic_character[nameTag][ig.game.sessionData.loveInterest];
                        } else {
                            tempName = nameTag;
                        }
                    } else {
                        tempName = nameTag;
                    }

                    var ctx = ig.system.context;
                    ctx.font = this.bubbleConfigs.fontSizeName + 'px ' + this.bubbleConfigs.fontTextName;
                    sizeName.x = ctx.measureText(tempName).width + 40*_DATAGAME.ratioRes;
                }
            }

            var timeAlive = -1;
            var bubbleWidth = this.bubbleConfigs.width;
            this.isNarration = false;
            if(statTail == this.TAIL_STATUS.none && _DATAGAME.dialogStyle.toLowerCase() != 'rectangle') {
                this.isNarration = true;
                bubbleWidth = this.bubbleConfigs.narrationWidth;
            }
            var tailLength = 30*_DATAGAME.ratioRes;
            var tailWidth = 15*_DATAGAME.ratioRes;
            var posTail = { x:0.9, y:0 };
            var posStretch = { x:1, y:-1 };

            var tailPosition = 'right';

            if(isRear) {
                if(faceToChar == 'right') posStretch = { x:0.9, y:0 };
                else posStretch = { x:1, y:0 };
            }

            var posX = ig.sizeHandler.minW/2 + (bubbleWidth * posTail.x / 2) - (bubbleWidth * (1-posTail.x) / 2) + (5*_DATAGAME.ratioRes) - this.offsetBubble.x;

            if(isRear && faceToChar == 'left' && statTail == this.TAIL_STATUS.right) {
                posX += 100 *_DATAGAME.ratioRes;
            }

            // posTail = { x:0.5, y:0 };
            // posStretch = { x:0.5, y:0 };

            if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') {
                posTail = { x:0.5, y:0 };
                posStretch = { x:0.5, y:0 };
                tailPosition = 'center';

                posX = ig.sizeHandler.minW/2 + (bubbleWidth * posTail.x / 2) - (bubbleWidth * (1-posStretch.x) / 2)- (8*_DATAGAME.ratioRes);
                tailPosition = 'none';

                bubbleWidth = this.setBubbleWidth();
            } else {
                if(statTail == this.TAIL_STATUS.none) {
                    posTail = { x:0.5, y:0 };
                    posStretch = { x:0.5, y:0 };
                    tailPosition = 'center';

                    if(isRear) {
                        if(faceToChar == 'right') posStretch = { x:0.4, y:0 };
                        else posStretch = { x:0.6, y:0 };
                    }

                    posX = ig.sizeHandler.minW/2 + (bubbleWidth * posTail.x / 2) - (bubbleWidth * (1-posStretch.x) / 2)- (8*_DATAGAME.ratioRes);
                    // tailLength = 0; 
                    // tailWidth = 0;
                    // posTail = { x:0.5, y:0 };
                    // posStretch = { x:-1, y:-1 };
                    // posX = ig.sizeHandler.minW/2 - 8*_DATAGAME.ratioRes;
                    tailPosition = 'none';
                } else if(statTail == this.TAIL_STATUS.left) {
                    posTail = { x:0.1, y:0 };
                    posStretch = { x:0, y:-1 };
                    tailPosition = 'left';

                    if(isRear) {
                        if(faceToChar == 'right') posStretch = { x:0, y:0 };
                        else posStretch = { x:0.1, y:0 };
                    }

                    posX = ig.sizeHandler.minW/2 + (bubbleWidth * posTail.x / 2) - (bubbleWidth * (1-posStretch.x) / 2)- (8*_DATAGAME.ratioRes) + this.offsetBubble.x;

                    if(isRear && faceToChar == 'right') {
                        posX -= 100 *_DATAGAME.ratioRes;
                    }
                } else if(statTail == this.TAIL_STATUS.center) {
                    posTail = { x:0.5, y:0 };
                    posStretch = { x:0.5, y:0 };
                    tailPosition = 'center';

                    if(isRear) {
                        if(faceToChar == 'right') posStretch = { x:0.4, y:0 };
                        else posStretch = { x:0.6, y:0 };
                    }

                    posX = ig.sizeHandler.minW/2 + (bubbleWidth * posTail.x / 2) - (bubbleWidth * (1-posStretch.x) / 2)- (8*_DATAGAME.ratioRes);
                }
            }
            
            var posY = ig.sizeHandler.minH/2 + this.offsetBubble.y;
            if(_DATAGAME.dialogStyle.toLowerCase() != 'rectangle') {
                if((statTail != this.TAIL_STATUS.none && statTail != this.TAIL_STATUS.center && bubbleType != 'think') || bubbleType == 'think') {
                    posY -= (30*_DATAGAME.ratioRes);
                }
                else if(statTail == this.TAIL_STATUS.none || statTail == this.TAIL_STATUS.center) {
                    posY -= (30*_DATAGAME.ratioRes);
                }
            }

            posY += this.bubbleScriptOffsetY;

            if(ig.game.outputBubbleTextToConsole) {
                var textConsole = fullTextBubble.split(" ");
                var arrFormat = [];

                var startFormat = true;
                for(var txt=0; txt<textConsole.length;txt++) {
                    if(textConsole[txt] == "|" && startFormat) {
                        arrFormat.push({start:txt, end:0});
                        startFormat = false;
                    } else if(textConsole[txt] == "|" && !startFormat) {
                        arrFormat[arrFormat.length-1].end = txt;
                        startFormat = true;
                    }
                }

                for(var arr=arrFormat.length-1;arr>=0;arr--){
                    textConsole.splice(arrFormat[arr].start, arrFormat[arr].end - arrFormat[arr].start + 1);
                }

                var fullTextConsole = "";
                for(var fullTxt=0; fullTxt<textConsole.length;fullTxt++) {
                    fullTextConsole += textConsole[fullTxt] + " ";
                }

                var totalID = parseInt(this.prevChatIdForConsole) + 1;
                if(this.prevChatIdForConsole != null && this.numChat > totalID) {
                    ig.game.consoleLog('⚠️⚠️⚠️ WARNING: Chat ID jumped from ' + this.prevChatIdForConsole + ' to ' + this.numChat + '⚠️⚠️⚠️'); // (expected ' + totalID + ')
                }
                ig.game.consoleLog('id : ' + this.numChat);
                this.prevChatIdForConsole = this.numChat;
                ig.game.consoleLog(fullTextConsole);
            }

            if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') {

            } else {
                if(this.isOption && this.optionType == 'du') {
                    posY -= (350*_DATAGAME.ratioRes);
                } else {
                    if(animChar != null && animChar != '' && animChar.substring(0, 9) == 'ANIM_LAY_') {
                        this.plusYBubble = (150*_DATAGAME.ratioRes);
                        posY += this.plusYBubble;
                    }
                }
            }

            if(_DATAGAME.dialogStyle.toLowerCase() != 'rectangle') {
                this.bubbleConfigs.position.x = posX;
                this.bubbleConfigs.position.y = posY;
                this.bubbleConfigs.bubbleWidth = bubbleWidth;
            }

            var _chatBubbleAppearTime = 0.4;
            var _chatBubbleDisappearTime = 0.3;

            if(_storyBubble.tweenOut != null && _storyBubble.tweenOut == false) _chatBubbleDisappearTime = 0;
            if(_storyBubble.tweenIn != null && _storyBubble.tweenIn == false) _chatBubbleAppearTime = 0;

            // ig.game.consoleLog(textBubble);

            ig.game.sfxTextName = _storyBubble.sfxText;

        	this.chatBubble = ig.game.spawnChatBubble(this, {
                zIndex:_DATAGAME.zIndexData.dialogChatBubble,
                chatBubbleDrawConfigs: {
                    chatStyle:_DATAGAME.dialogStyle.toLowerCase(),
                    textConfigs: {
                        fullText: ig.game.wordWrapForChatBubble(fullTextBubble, this.bubbleConfigs.bubbleWidth, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true),
                        text: textBubble, // text display in chat bubble
                        sizeTextName:sizeName,
                        fillStyle: (_DATAGAME.dialogBox[dialogBoxName].textColor == null) ? _DATAGAME.dialogBox.default.textColor : _DATAGAME.dialogBox[dialogBoxName].textColor,
                        textAlign: "left", // [center|left|right];
                        fontSizeName: this.bubbleConfigs.fontSizeName,
                        fontSize: this.bubbleConfigs.fontSize,
                        fontFamily: this.bubbleConfigs.fontName,
                        counterAnim:0,
                        chatStyle:_DATAGAME.dialogStyle.toLowerCase(),
                        showFlash:[true, true, true, true, true, true],
                        showShake:[true, true, true, true, true, true]
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
                        textName:charName, //charName
                        realName:tempName,
                        sizeTextName:sizeName,
                        fontSizeName:this.bubbleConfigs.fontSizeName,
                        fontSize:this.bubbleConfigs.fontSize,
                        fontFamily:this.bubbleConfigs.fontTextName,
                        lineWidth: 4*_DATAGAME.ratioRes,
                        fillStyle: (_DATAGAME.dialogBox[dialogBoxName].boxColor == null) ? _DATAGAME.dialogBox.default.boxColor : _DATAGAME.dialogBox[dialogBoxName].boxColor,
                        fillOpacity: (_DATAGAME.dialogBox[dialogBoxName].boxOpacity == null) ? _DATAGAME.dialogBox.default.boxOpacity : _DATAGAME.dialogBox[dialogBoxName].boxOpacity,
                        strokeStyle: (_DATAGAME.dialogBox[dialogBoxName].outlineColor == null) ? _DATAGAME.dialogBox.default.outlineColor : _DATAGAME.dialogBox[dialogBoxName].outlineColor,

                        shadowColor: "black",
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        chatType:bubbleType,

                        box: {
                            width: this.bubbleConfigs.bubbleWidth, // content min width
                            height: (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') ? _DATAGAME.dialogBox.height*_DATAGAME.ratioRes : 60*_DATAGAME.ratioRes, // content min height
                            round: (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') ? 0 : 30*_DATAGAME.ratioRes, // round curves distance
                            padding: {
                                x: (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') ? _DATAGAME.dialogBox.padding.x*_DATAGAME.ratioRes : 25*_DATAGAME.ratioRes,
                                y: (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') ? _DATAGAME.dialogBox.padding.y*_DATAGAME.ratioRes : 30*_DATAGAME.ratioRes
                            } // extra space outside the content area
                        },
                        tail: {
                            position:tailPosition,
                            length: tailLength, // tail length - no tail = 0
                            width: tailWidth, // tail width - no tail = 0
                            direction: {
                                x: posTail.x,
                                y: posTail.y, 
                                stretchx:posStretch.x,
                                stretchy:posTail.y
                            } // tail direction, will be update if input invalid (0-1)
                        }
                    }
                },
                chatStyle:_DATAGAME.dialogStyle.toLowerCase(),
                chatBubbleAppearTime: (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle' && this.lastSpeakerName == charName) ? 0 : _chatBubbleAppearTime, // appear time - second
                chatBubbleAliveTime: timeAlive, // alive time - second
                chatBubbleDisappearTime: (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') ? 0 : _chatBubbleDisappearTime, // disappear time - second
                chatBubblePercent: {
                    x: 0.5,
                    y: 0,
                }, // position percent of ChatBubbleParentEntity (0-1) related to the ChatBubbleParentEntity position and size
                chatBubbleOffset: {
                    x: 0,
                    y: 0
                }, // extra offset from position percent of ChatBubbleParentEntity
                parentPos: {
                    x: this.bubbleConfigs.position.x, //posX
                    y: this.bubbleConfigs.position.y //posY
                },
                chatBubbleAlpha: 1 // chat bubble alpha
            });
            
            if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') {
                this.calculatePosBubble(true);
                this.chatBubble.repos();
                // this.chatBubble.
                // this.chatBubble._currentState = 0;
            }

            this.lastSpeakerName = charName;

            this.reposOption();

            ig.game.sortEntitiesDeferred();
        },

        hideDU:function() {
            this.isOption = false;
            this.text = '';

            var noBubble = false; 
            if(this.isBubble) {
                this.chatBubble.chatBubbleAliveTime = 0.1;
            } else{
                noBubble = true;
            }

            this.isBubble = false;

            this.alphaChar = 0;
            this.alphaDU = 1;

            this.isAnimDU = true;

            var tweenCharIn =  this.tween({
                alphaChar:1,
            }, 0.2, {
                easing : ig.Tween.Easing.Linear.EaseNone,
                onComplete:function() {
                    this.isAnimChar = false;
                    for(var ti=0;ti<this.totalAllChar;ti++) {
                        if(this.isVisibleChar[ti]){
                            this['sptChar' + ti].spriter.root.alpha = 1;
                        }
                    }
                    if(noBubble) {
                        this.checkChatBubble();
                    }
                }.bind(this)
            });

            this.tween({
                alphaDU:0,
            }, 0.2, {
                easing : ig.Tween.Easing.Linear.EaseNone,
                onComplete:function() {
                    this.isAnimDU = false;
                    this.isAnimChar = true;

                    this.sptCharDU1.spriter.root.alpha = 0;
                    this.sptCharDU2.spriter.root.alpha = 0;
                    
                    tweenCharIn.start();
                }.bind(this)
            }).start();
        },

        checkChatBubble:function() {
            var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];

            if(this.isStartDialog == false && ig.game.animDelayed == true) {
                return;
            } else {
                this.isStartDialog = true;
            }

            this.sfxAlreadyPlayed = false;

            var isCheckAnim = true;
            this.optionType = 'normal';
            
            // this.checkScriptVariable(storyNow);

            if(this.isBubbleOption) {
                if(storyNow.animEffect != null && storyNow.animEffect.type == 'love_gender') {
                    ig.game.sessionData.loveInterest = (this.optionSelected == 1) ? 'boy' : 'girl';
                    
                    this.saveToLogHistory(storyNow.option[this.optionSelected].sceneID, true);
                    
                    this.numChat = _STRINGS["Chapter" + this.numChapter][storyNow.option[this.optionSelected].sceneID].linkSceneID;
                    ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                } else {
                    this.numChat = storyNow.option[this.optionSelected].sceneID; 

                    if(!_DATAGAME.repeatOption) {
                        this.saveToLogHistory(this.numChat);

                        this.checkScriptVariable(_STRINGS["Chapter" + this.numChapter][this.numChat]);
                        if(_STRINGS["Chapter" + this.numChapter][storyNow.option[this.optionSelected].sceneID].linkSceneID != null) {
                            this.numChat = _STRINGS["Chapter" + this.numChapter][storyNow.option[this.optionSelected].sceneID].linkSceneID;
                        } else {
                            this.numChat++;
                        }
                    }
                    ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                }
                storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
                // this.checkScriptVariable(storyNow);
                // this.loadBubbleChat();
            } 
            else {
                if(storyNow.linkSceneID != null) {
                    if(this.isFirstLoad) {
                        this.isFirstLoad = false;
                    } else {
                        if (typeof storyNow.linkSceneID === 'number' && !isNaN(storyNow.linkSceneID)) {
                            this.numChat = storyNow.linkSceneID;
                            ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                        } else {
                            //CONDITIONAL FORMATIING
                            if(storyNow.linkSceneID[0].type != null && storyNow.linkSceneID[0].type.toLowerCase() == 'switch'){
                                //CONDITION MAX MIN
                                var _tempArrayMaxMin = [];
                                for(var _varSwitch=0;_varSwitch<storyNow.linkSceneID[0].variables.length;_varSwitch++){
                                    var _varNames = storyNow.linkSceneID[0].variables[_varSwitch];
                                    _tempArrayMaxMin.push({
                                        type:_varNames,
                                        total:ig.game.sessionData[_varNames]
                                    })
                                }

                                var _arraySorted;
                                if(storyNow.linkSceneID[0].operator.toLowerCase() == 'min') {
                                    _arraySorted = ig.game.sortArrayByProp(_tempArrayMaxMin, 'total', false);
                                } else {
                                    _arraySorted = ig.game.sortArrayByProp(_tempArrayMaxMin, 'total', true);
                                }

                                var _isConditionFulfilled = false;
                                for(var _varCheckSwitch=1;_varCheckSwitch<storyNow.linkSceneID.length;_varCheckSwitch++){
                                    if(storyNow.linkSceneID[_varCheckSwitch].condition.toLowerCase() == _arraySorted[0].type.toLowerCase()){
                                        _isConditionFulfilled = true;
                                        this.numChat = storyNow.linkSceneID[_varCheckSwitch].linkID;
                                        ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                                        break;
                                    }
                                }

                                if(!_isConditionFulfilled) {
                                    var _varDefaultIdx = storyNow.linkSceneID.map(function(e) { return e.condition ? e.condition.toLowerCase() : '' }).indexOf("default");
                                    this.numChat = storyNow.linkSceneID[_varDefaultIdx].linkID;
                                    ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                                }
                            }
                            else {
                                //CONDITION IF
                                for(var _conF=0;_conF<storyNow.linkSceneID.length;_conF++) {
                                    var _condition = storyNow.linkSceneID[_conF].condition;
                                    var _logicalOperator = storyNow.linkSceneID[_conF].type;
                                    var _linkID = storyNow.linkSceneID[_conF].linkID;

                                    if(_condition == null) {
                                        this.numChat = _linkID;
                                        ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                                        break;
                                    } else {
                                        if(ig.game.checkConditionFormatting(_condition, _logicalOperator) == true) {
                                            this.numChat = _linkID;
                                            ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                                            break;
                                        }
                                        else {
                                            if(_conF == storyNow.linkSceneID.length-1){
                                                this.numChat++;
                                                ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if(this.isFirstLoad) {
                        this.isFirstLoad = false;
                    } else {
                        this.numChat++;
                        ig.game.sessionData.numChat[this.numChapter] = this.numChat;
                    }
                }
                
                storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
                // this.checkScriptVariable(storyNow);
            }

            var isOverlay = false;
            if (storyNow.object){
                isOverlay = true; 
            }

            this.placeOverlayObject(true, storyNow);

            this.placeSingleParticle(storyNow);

            this.checkParticle(storyNow);

            this.checkTopOverlay(storyNow);

            this.checkWindowBoxing(storyNow);

            this.checkVignette(storyNow);

            this.checkProgressBar(storyNow);

            if (storyNow.toastBox){
                // ig.game.spawnNotification(storyNow.toastBox.text, storyNow.toastBox.time);
                for(var tb=0;tb<storyNow.toastBox.length;tb++) {
                    ig.game.tweenDelay(this, 0.2 * tb * 1000, function(_text, _time, _sfx) {
                        // console.log(_sfx);
                        if(_sfx != null && _sfx != '') {
                            ig.soundHandler.sfxPlayer.playSFX(_sfx, false);
                            ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
                        }

                        ig.game.spawnNotification(_text, _time);
                    }.bind(this, storyNow.toastBox[tb].text, storyNow.toastBox[tb].time, storyNow.toastBox[tb].sfx));
                }
            }
            
            if(isCheckAnim) {
                if(storyNow.animEffect != null) {
                    if(ig.game.getString(storyNow.animEffect.type) != 'freeze_frame') {
                        this.lastChatId = this.numChat;
                        ig.game.sessionData.lastChatId[this.numChapter] = this.lastChatId;
                    }

                    switch(ig.game.getString(storyNow.animEffect.type)) {
                        case "end" :
                            ig.game.isChapterEnd = true;
                            isCheckAnim = false;
                            ig.game.sessionData.numChat[this.numChapter] = 0;
                            ig.game.sessionData.dressUpTheme[this.numChapter].last = ig.game.sessionData.dressUpTheme[this.numChapter].now;

                            //UNCOMMENT THIS TO MAKE THE REWARD IS NOT REPEATED
                            // ig.game.sessionData.isReward[this.numChapter] = false;

                            if(this.numChapter == ig.game.sessionData.unlockChapter) {
                                ig.game.sessionData.unlockChapter++;
                            }

                            if(_DATAGAME.chapters.multipleChapter) {
                                if((storyNow.animEffect.char != null && storyNow.animEffect.char[0] != null) || storyNow.animEffect.color != null) {
                                    if(storyNow.animEffect.color != null) {
                                        ig.game.fadeInWindow(LevelMenu, null, storyNow.animEffect.color);
                                    } else if(storyNow.animEffect.char != null && storyNow.animEffect.char[0] != null) {
                                        ig.game.fadeInWindow(LevelMenu, null, storyNow.animEffect.char[0]);
                                    }
                                } else {
                                    ig.game.fadeInWindow(LevelMenu);
                                }
                            } else {
                                this.entityGame.uiReplay = ig.game.spawnEntity(EntityUIReplay, 0, 0, {_parent:this});
                            }
                            
                            break;
                        case "text_chat" :
                            this.canClickStage = false;
                            var _idxPhoneStory = this.searchIdxPhone(storyNow.animEffect.name);
                            if(this.entityGame.phone != null) {
                                this.entityGame.phone.idxStory = _idxPhoneStory;
                            } else {
                                this.entityGame.phone = ig.game.spawnEntity(EntityPhone, 0, 0 , {_parent:this, idxStory:storyNow.animEffect.name});
                            }
                            this.entityGame.phone.startText();
                            this.entityGame.phone.repos();
                            break;
                        case "letter" :
                            ig.game.consoleLog('letter');
                            this.canClickStage = false;
                            if(this.entityGame.letter == null) {
                                this.entityGame.letter = ig.game.spawnEntity(EntityLetter, 0, 0 , {_parent:this, idxStory:storyNow.animEffect.name});
                            }
                            // this.entityGame.letter.startText();
                            this.entityGame.letter.repos();
                            break;
                        case "email" :
                            ig.game.consoleLog('email');
                            this.canClickStage = false;
                            if(this.entityGame.email == null) {
                                this.entityGame.email = ig.game.spawnEntity(EntityEmail, 0, 0 , {_parent:this, idxStory:storyNow.animEffect.name});
                            }
                            // this.entityGame.email.startText();
                            this.entityGame.email.repos();
                            break;
                        case "freeze_frame" :
                            var caption = storyNow.text;
                            
                            caption = caption.replaceAll("{NAME}", ig.game.sessionData.playerName);

                            var _firstSound = storyNow.animEffect.sfxStart;
                            var _secondSound = storyNow.animEffect.sfxText;

                            if(_firstSound != null && _firstSound != '') {
                                if(_firstSound == 'none') _firstSound = null;
                            } else  {
                                _firstSound = 'freeze1';
                            }

                            if(_secondSound != null && _secondSound != '') {
                                if(_secondSound == 'none') _secondSound = null;
                            } else  {
                                _secondSound = 'freeze2';
                            }

                            for(var name_interest in _STRINGS.dynamic_character) {
                                caption = caption.replaceAll("{" + name_interest + "}", _STRINGS.dynamic_character[name_interest][ig.game.sessionData.loveInterest]);
                            }
                            this.freeze = ig.game.spawnEntity('EntityFreezeFrame' + storyNow.animEffect.frame_type ,0,0,{
                                _parent:this,
                                bg:new ig.Image(_BASEPATH.background + storyNow.animEffect.char[0].bg + "." + _DATAGAME.BGFileType[storyNow.animEffect.char[0].bg]), 
                                textBg:ig.FreezeFrame.images.textBg, 
                                charConfig:storyNow.animEffect.char[0], 
                                timeAlive:(storyNow.animEffect.timeAlive != null && storyNow.animEffect.timeAlive > 0) ? storyNow.animEffect.timeAlive : 4,
                                text:caption, 
                                font:2.18*ig.game.fontNameSize,//120
                                textColor:"#ffffff",
                                textShadowColor:"#000000",
                                textOffset:{x:-50, y:0},
                                firstSound:_firstSound,
                                secondSound:_secondSound,
                                callback: this.onFreezeFrameComplete.bind(this),
                            });
                            break;
                        case "dress_up" : 
                            this.optionType = 'du';
                            this.afterAnimation('du');
                            this.alphaChar = 1;
                            this.alphaDU = 0;

                            this.isAnimChar = true;

                            var tweenDUIn =  this.tween({
                                alphaDU:1,
                            }, 0.2, {
                                easing : ig.Tween.Easing.Linear.EaseNone,
                                onComplete:function() {
                                    this.isAnimDU = false;
                                    this.sptCharDU1.spriter.root.alpha = 1;
                                    this.sptCharDU2.spriter.root.alpha = 1;

                                    if(storyNow.text != null && storyNow.text == "") {
                                        this.checkOption();
                                    }
                                }.bind(this)
                            });

                            this.tween({
                                alphaChar:0,
                            }, 0.2, {
                                easing : ig.Tween.Easing.Linear.EaseNone,
                                onComplete:function() {
                                    this.isAnimChar = false;
                                    this.isAnimDU = true;
                                    for(var ti=0;ti<this.totalAllChar;ti++) {
                                        if(this.isVisibleChar[ti]){
                                            this['sptChar' + ti].spriter.root.alpha = 0;
                                        }
                                    }
                                    
                                    if(this.sptCharDU1 == null) {
                                        this.sptCharDU1 = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { scml: this.scmlGirl, _parent:this });
                                        this.sptCharDU1.spriter.scale.x = -1;
                                        this.sptCharDU1.changeDU(storyNow.option[1].sceneID.toLowerCase());
                                    }

                                    if(this.sptCharDU2 == null) {
                                        this.sptCharDU2 = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { scml: this.scmlGirl, _parent:this, noChar:idxChar });
                                        this.sptCharDU2.changeDU(storyNow.option[2].sceneID.toLowerCase());
                                    }
                                    ig.game.sortEntitiesDeferred();
                                    this.repos();
                                    tweenDUIn.start();
                                }.bind(this)
                            }).start();

                            ig.game.sortEntitiesDeferred();
                            break;
                        case "input_name" :
                            this.entityGame.uiEnterName = ig.game.spawnEntity(EntityUIEnterName, 0, 0 , {_parent:this});
                            this.entityGame.uiEnterName.repos();
                            this.tempTextView = this.entityGame.uiEnterName.textView;
                            // if(ig.ua.mobile) {
                                this.setupInputVirtualKeyboard(true);
                                this.keyboard.show();
                            // }
                            this.isInputKeyboard = true;
                            break;
                        case 'walk_in' :
                        case 'fade_in' :
                            this.longestDurWalkIn = this.defDurWalkIn;
                            if(ig.game.getString(storyNow.animEffect.type) == 'fade_in') this.longestDurWalkIn = 0;

                            for(var i=0;i<storyNow.animEffect.char.length;i++) {
                                var idxCharStory = this.searchIdxChar(storyNow, storyNow.animEffect.char[i].name);
                                var idxChar = 0;
                                
                                if(this.arrChar.indexOf(storyNow.char[idxCharStory].name) == -1) {
                                    this.arrChar.push(storyNow.char[idxCharStory].name);
                                    this.posDefChar.push({x:0, y:0});
                                    this.offsetDefChar.push({x:0, y:500*_DATAGAME.ratioRes, alpha:1});

                                    idxChar = this.arrChar.length - 1;

                                    if(storyNow.char[idxCharStory].name == 'Amy' || _DATAGAME.neutral_girl.indexOf(storyNow.char[idxCharStory].name) >= 0) {
                                        this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { _parent:this, charName:storyNow.char[idxCharStory].name.toLowerCase(), noChar:idxChar });
                                    } else if(_DATAGAME.neutral_boy.indexOf(storyNow.char[idxCharStory].name) >= 0) {
                                        this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterBoy, ig.game.midX, ig.game.midY, { charName:storyNow.char[idxCharStory].name.toLowerCase(), _parent:this, noChar:idxChar });
                                    }
                                    else {
                                        if(ig.game.sessionData.loveInterest == 'girl') {
                                             this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterGirl, ig.game.midX, ig.game.midY, { _parent:this, charName:storyNow.char[idxCharStory].name.toLowerCase(), noChar:idxChar });
                                        } else {
                                            this['sptChar' + idxChar] = ig.game.spawnEntity(SpriterBoy, ig.game.midX, ig.game.midY, { charName:storyNow.char[idxCharStory].name.toLowerCase(), _parent:this, noChar:idxChar });
                                        }
                                    }

                                    if(storyNow.char[idxCharStory].name == 'Amy') {
                                        if(storyNow.char[idxCharStory].outfit != null) {
                                            ig.game.sessionData.dressUpTheme[this.numChapter].now = storyNow.char[idxCharStory].outfit.toLowerCase().replaceAll(" ", "");
                                        }
                                        this['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpTheme[this.numChapter].now);
                                    } else {
                                        var _currentName = storyNow.char[idxCharStory].name.toLowerCase();
                                        _currentName = _currentName.replaceAll(" ", "");
                                        this.checkCurrentCharDU(_currentName);
                                        if(storyNow.char[idxCharStory].outfit != null) {
                                            var _outfitName = storyNow.char[idxCharStory].outfit.toLowerCase();
                                            _outfitName = _outfitName.replaceAll(" ", "");
                                            ig.game.sessionData.dressUpChar[this.numChapter][_currentName] = _outfitName;
                                        }
                                        this['sptChar' + idxChar].charName = ig.game.sessionData.dressUpChar[this.numChapter][_currentName];
                                        this['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpChar[this.numChapter][_currentName]);
                                        ig.game.consoleLog(ig.game.sessionData.dressUpChar[this.numChapter][_currentName]);
                                    }

                                    this['sptChar' + idxChar].spriter.root.alpha = 0;
                                    this['sptChar' + idxChar].speedAnimWalk = this['sptChar' + idxChar].defSpeedAnimWalk;
                                    
                                    if((storyNow.char[idxCharStory].posX != null && Math.abs(storyNow.char[idxCharStory].posX) >= 5000) || (storyNow.char[idxCharStory].posY != null && Math.abs(storyNow.char[idxCharStory].posY) >= 5000)) {

                                    } else {
                                        this.totalChar++;
                                    }
                                    this.isVisibleChar[idxChar] = true;
                                }

                                var durWalkIn = this.defDurWalkIn;

                                var distanceWalk = 0;

                                var posXFinal = 0;

                                //STARTING POINT
                                if(this['sptChar' + idxChar].spriter.root.alpha == 0) {
                                    var isRear = (storyNow.animEffect.char[i].rear) ? true : false;
                                    var faceTo = (storyNow.char[idxCharStory].faceTo) ? storyNow.char[idxCharStory].faceTo : storyNow.char[idxCharStory].position;
                                    if(faceTo == 'center') { faceTo = 'right'; }

                                    if((storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'left')
                                        || (storyNow.animEffect.char[i].from != null && storyNow.animEffect.char[i].from == 'left') ) {
                                        this['sptChar' + idxChar].changeScale(1, -1);
                                        this.offsetDefChar[idxChar].x = -(ig.system.width/2 + 100*_DATAGAME.ratioRes);

                                        posXFinal = this.posXIn[storyNow.char[idxCharStory].position];
                                        if(isRear) {
                                            if(faceTo == 'left') {
                                                posXFinal += this.offsetPivot;
                                            }
                                        }

                                        distanceWalk = this.offsetDefChar[idxChar].x + (this.posXIn.left - posXFinal);
                                    } 
                                    else if((storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'right') 
                                        || (storyNow.animEffect.char[i].from != null && storyNow.animEffect.char[i].from == 'right')
                                        || (storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'center')) {
                                        this['sptChar' + idxChar].changeScale(1, 1);
                                        this.offsetDefChar[idxChar].x = (ig.system.width/2 + 100*_DATAGAME.ratioRes);

                                        posXFinal = this.posXIn[storyNow.char[idxCharStory].position];
                                        if(isRear) {
                                            if(faceTo == 'right') {
                                                posXFinal -= this.offsetPivot;
                                            }
                                        }

                                        distanceWalk = this.offsetDefChar[idxChar].x + (this.posXIn.right - posXFinal);
                                    } 


                                    //CHECK FACETO
                                    if(storyNow.animEffect.char[i].faceTo!= null && storyNow.animEffect.char[i].faceTo != "") {
                                        if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'right') this['sptChar' + idxChar].changeScale(1, -1);
                                        else if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'left') this['sptChar' + idxChar].changeScale(1, 1);
                                    }
                                }

                                if(ig.game.getString(storyNow.animEffect.type) == 'fade_in') {
                                    var tempTime = (storyNow.animEffect.char[i].time == null) ? 500:storyNow.animEffect.char[i].time*1000;
                                    if(tempTime > this.longestDurWalkIn) this.longestDurWalkIn = tempTime;

                                    this.offsetDefChar[idxChar].x = posXFinal;
                                    this.offsetDefChar[idxChar].alpha = 0;
                                    this.calculatePosChar(idxChar);

                                    if(storyNow.animEffect.char[i].time <= 0) {
                                        this['sptChar' + idxChar].spriter.root.alpha = 1;
                                    } else {
                                        new ig.TweenDef(this.offsetDefChar[idxChar]).
                                        // to({x:this.posXIn[storyNow.char[idxCharStory].position]}, durWalkIn)
                                        to({alpha:1}, tempTime)
                                        .easing(ig.Tween.Easing.Linear.EaseNone)
                                        .onUpdate(function(_noChar) {
                                            this['sptChar' + _noChar].spriter.root.alpha = this.offsetDefChar[_noChar].alpha;
                                        }.bind(this, idxChar))
                                        .onComplete(function(_noChar, _position, _faceTo, _rear, _emotion) {
                                            this['sptChar' + _noChar].spriter.root.alpha = 1;
                                        }.bind(this, idxChar, storyNow.char[idxCharStory].position, storyNow.char[idxCharStory].faceTo, storyNow.animEffect.char[i].rear, storyNow.char[idxCharStory].emotion)).start();
                                    }

                                    //CHECK FACETO
                                    if(storyNow.animEffect.char[i].faceTo!= null && storyNow.animEffect.char[i].faceTo != "") {
                                        if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'right') this['sptChar' + idxChar].changeScale(1, -1);
                                        else if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'left') this['sptChar' + idxChar].changeScale(1, 1);
                                    }

                                    //CHECK ANIM AND EMO
                                    var _tempAnimNameFade = (storyNow.animEffect.char[i].anim == null) ? "ANIM_IDLE" : storyNow.animEffect.char[i].anim.toUpperCase();

                                    if(storyNow.animEffect.char[i].rear) {
                                        if(_tempAnimNameFade != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimNameFade, storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_IDLE_REAR', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                    } else {
                                        if(_tempAnimNameFade != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimNameFade, storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_IDLE', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                        
                                        //ADD EMO WHEN WALKING
                                        if(storyNow.animEffect.char[i].emo != null && storyNow.animEffect.char[i].emo != "") {
                                            this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.animEffect.char[i].emo), true);
                                        } else {
                                            if(storyNow.char[idxCharStory].emotion != 'ANIM_NONE') {
                                                this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.char[idxCharStory].emotion), true);
                                            } 
                                        }
                                    }
                                } else {
                                    var _tempAnimName = (storyNow.animEffect.char[i].anim == null) ? "ANIM_WALK" : storyNow.animEffect.char[i].anim.toUpperCase();
                                    if(_tempAnimName.substring(0, 5) != "ANIM_") _tempAnimName = "ANIM_" + storyNow.animEffect.char[i].anim.toUpperCase();

                                    durWalkIn = this.defDurWalkIn * Math.abs(distanceWalk) / (500*_DATAGAME.ratioRes);
                                    if(_tempAnimName != null) {
                                        durWalkIn = this.checkAnimationDurationForWalkInAndOut(_tempAnimName, durWalkIn);
                                        // switch(_tempAnimName) {
                                        //     case 'ANIM_JOG_HAND_CLOSE' :
                                        //     case 'ANIM_JOG_HAND_OPEN' :
                                        //         durWalkIn /= 1.5;
                                        //         break;
                                        //     case 'ANIM_RUN' :
                                        //     case 'ANIM_SPRINT_HAND_CLOSE' :
                                        //     case 'ANIM_SPRINT_HAND_OPEN' :
                                        //     case 'ANIM_RUN_WIDE_HAND_CLOSE' :
                                        //     case 'ANIM_RUN_WIDE_HAND_OPEN' :
                                        //         durWalkIn /= 2;
                                        //         break;
                                        //     case 'ANIM_STUMBLE' :
                                        //         durWalkIn *= 3;
                                        //         break;
                                        // }
                                    }
                                    durWalkIn = this.checkWalkingSpeed(durWalkIn, this['sptChar' + idxChar], storyNow.animEffect.char[i].speed);

                                    new ig.TweenDef(this.offsetDefChar[idxChar]).
                                    // to({x:this.posXIn[storyNow.char[idxCharStory].position]}, durWalkIn)
                                    to({x:posXFinal}, durWalkIn)
                                    .easing(ig.Tween.Easing.Linear.EaseNone)
                                    .onComplete(function(_noChar, _position, _faceTo, _rear, _emotion, _animSpeed, _animName, _currentAnim, _tint, _handheld, _scale) {
                                        this.offsetDefChar[_noChar].x = this.posXIn[_position];

                                        // console.log("anim" + _animName);

                                        // this['sptChar' + _noChar].changePose((_rear) ? 'ANIM_IDLE_REAR' : 'ANIM_IDLE', null, 'shadow', _animSpeed);
                                        // if(_animName == 'ANIM_IDLE' && (_currentAnim == "ANIM_MEDITATE_FLOATING")) {
                                            
                                        // } else {
                                            this['sptChar' + _noChar].changePose(_animName, _handheld, 'shadow', _animSpeed, _tint);

                                            //CHANGE SPRITER SCALE
                                            this['sptChar' + _noChar].changeScale(_scale, this['sptChar' + _noChar].flipState);
                                        // }

                                        //ADD EMO WHEN WALKING
                                        if(_DATAGAME[_emotion] != 'ANIM_NONE') {
                                            this['sptChar' + _noChar].changeEmotion(_DATAGAME.listEmotion.indexOf(_emotion), false);
                                        } 
                                        
                                        if(_faceTo == null) {
                                            if((_position == 'left' && !_rear) || ((_position == 'right' || _position == 'center') && _rear)) {
                                                //CHANGE SPRITER SCALE
                                                this['sptChar' + _noChar].changeScale(_scale, -1);
                                                // this['sptChar' + _noChar].changeScale(1, -1);
                                            } else {
                                                //CHANGE SPRITER SCALE
                                                this['sptChar' + _noChar].changeScale(_scale, 1);
                                                // this['sptChar' + _noChar].changeScale(1, 1);
                                            }
                                        } else {
                                            if(_faceTo == 'right') {
                                                //CHANGE SPRITER SCALE
                                                this['sptChar' + _noChar].changeScale(_scale, -1);
                                                // this['sptChar' + _noChar].changeScale(1, -1);
                                            } else {
                                                //CHANGE SPRITER SCALE
                                                this['sptChar' + _noChar].changeScale(_scale, 1);
                                                // this['sptChar' + _noChar].changeScale(1, 1);
                                            }
                                        }
                                    }.bind(this, idxChar, storyNow.char[idxCharStory].position, storyNow.char[idxCharStory].faceTo, storyNow.animEffect.char[i].rear, storyNow.char[idxCharStory].emotion, storyNow.char[idxCharStory].animSpeed, storyNow.char[idxCharStory].anim, _tempAnimName, storyNow.char[idxCharStory].tint, storyNow.char[idxCharStory].handheld, storyNow.char[idxCharStory].scale)).start();

                                    this.calculatePosChar(idxChar);
                                    this['sptChar' + idxChar].spriter.root.alpha = 1;

                                    if(this.idxChar != 0) { 
                                        this['sptChar' + idxChar].changeDU(this['sptChar' + idxChar].charName); 
                                    }

                                    // if(storyNow.char[idxCharStory].name == 'Amy') {
                                    //     this['sptChar' + idxChar].changeDU(ig.game.sessionData.dressUpTheme[this.numChapter].now);
                                    // }

                                    if(storyNow.animEffect.char[i].rear) {
                                        if(_tempAnimName != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimName + '_REAR', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_WALK_REAR', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                    } else {
                                        if(_tempAnimName != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimName, storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_WALK', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                        
                                        //ADD EMO WHEN WALKING
                                        if(storyNow.animEffect.char[i].emo != null && storyNow.animEffect.char[i].emo != "") {
                                            this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.animEffect.char[i].emo), true);
                                        } else {
                                            if(storyNow.char[idxCharStory].emotion != 'ANIM_NONE') {
                                                this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.char[idxCharStory].emotion), true);
                                            } 
                                        }
                                    }

                                    //CHANGE SPRITER SCALE
                                    this['sptChar' + idxChar].changeScale(storyNow.char[i].scale, this['sptChar' + idxChar].flipState);
                                }
                            }
                            // if(this.arrChar.indexOf('Amy') >= 0) { this['sptChar' + this.arrChar.indexOf('Amy')].changeDU(ig.game.sessionData.dressUpTheme[this.numChapter].now); }
                            ig.game.tweenDelay(this, this.longestDurWalkIn, 'afterAnimation');
                            break;
                        case 'walk_out' :
                        case 'fade_out' :
                            this.longestDurWalkIn = this.defDurWalkIn;
                            if(ig.game.getString(storyNow.animEffect.type) == 'fade_out') this.longestDurWalkIn = 0;

                            for(var i=0;i<storyNow.animEffect.char.length;i++) {
                                var idxCharStory = this.searchIdxChar(storyNow, storyNow.animEffect.char[i].name);
                                var idxChar = this.arrChar.indexOf(storyNow.char[idxCharStory].name);

                                var isRear = storyNow.animEffect.char[i].rear;
                                
                                this.totalChar--;
                                this.isVisibleChar[idxChar] = false;
                                
                                var durWalkOut = this.defDurWalkIn;
                                var distanceWalk = 0;
                                var xOut = 0;
                                var plusDis = 0;

                                this.offsetDefChar[idxChar].x = this.posXIn[storyNow.char[idxCharStory].position];

                                if(isRear) {
                                    plusDis = 300*_DATAGAME.ratioRes;
                                    if(this['sptChar' + idxChar].defScale.x < 0 && 
                                        (
                                            (storyNow.animEffect.char[i].from != null && storyNow.animEffect.char[i].from == 'left') || 
                                            (storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'left')
                                        )
                                    ) {
                                        this.offsetDefChar[idxChar].x -= this.offsetPivot;
                                        distanceWalk += this.offsetPivot;
                                    } else if(this['sptChar' + idxChar].defScale.x > 0 && 
                                        (
                                            (storyNow.animEffect.char[i].from != null && storyNow.animEffect.char[i].from == 'right') || 
                                            (storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'right')
                                        )
                                    ) {
                                        this.offsetDefChar[idxChar].x += this.offsetPivot;
                                        // plusDistance += this.offsetPivot;
                                        distanceWalk += this.offsetPivot;
                                    }
                                }

                                if(ig.game.getString(storyNow.animEffect.type) == 'fade_out') {
                                    var tempTime = (storyNow.animEffect.char[i].time == null || storyNow.animEffect.char[i].time <= 0) ? 500:storyNow.animEffect.char[i].time*1000;
                                    if(tempTime > this.longestDurWalkIn) this.longestDurWalkIn = tempTime;

                                    this.offsetDefChar[idxChar].alpha = 1;
                                    new ig.TweenDef(this.offsetDefChar[idxChar]).
                                    // to({x:this.posXIn[storyNow.char[idxCharStory].position]}, durWalkIn)
                                    to({alpha:0}, tempTime)
                                    .easing(ig.Tween.Easing.Linear.EaseNone)
                                    .onUpdate(function(_noChar) {
                                        this['sptChar' + _noChar].spriter.root.alpha = this.offsetDefChar[_noChar].alpha;
                                    }.bind(this, idxChar))
                                    .onComplete(function(_noChar) {
                                        this['sptChar' + _noChar].spriter.root.alpha = 0;
                                        this['sptChar' + _noChar].kill();
                                        this['sptChar' + _noChar] = null;
                                        this.arrChar[_noChar] = "";
                                    }.bind(this, idxChar)).start();

                                    //CHECK FACETO
                                    if(storyNow.animEffect.char[i].faceTo!= null && storyNow.animEffect.char[i].faceTo != "") {
                                        if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'right') this['sptChar' + idxChar].changeScale(1, -1);
                                        else if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'left') this['sptChar' + idxChar].changeScale(1, 1);
                                    }

                                    //CHECK ANIM AND EMO
                                    var _tempAnimNameFadeOut = (storyNow.animEffect.char[i].anim == null) ? "ANIM_IDLE" : storyNow.animEffect.char[i].anim.toUpperCase();

                                    if(storyNow.animEffect.char[i].rear) {
                                        if(_tempAnimNameFadeOut != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimNameFadeOut, storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_IDLE_REAR', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                    } else {
                                        if(_tempAnimNameFadeOut != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimNameFadeOut, storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_IDLE', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                        
                                        //ADD EMO WHEN WALKING
                                        if(storyNow.animEffect.char[i].emo != null && storyNow.animEffect.char[i].emo != "") {
                                            this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.animEffect.char[i].emo), true);
                                        } else {
                                            if(storyNow.char[idxCharStory].emotion != 'ANIM_NONE') {
                                                this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.char[idxCharStory].emotion), true);
                                            } 
                                        }
                                    }
                                } else {
                                    //END POINT
                                    if((storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'left')
                                        || (storyNow.animEffect.char[i].from != null && storyNow.animEffect.char[i].from == 'left')
                                        || (storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'center')) {
                                        this['sptChar' + idxChar].changeScale(1, 1);
                                        xOut = -(ig.system.width/2 + 100*_DATAGAME.ratioRes + plusDis);
                                        distanceWalk = xOut + (this.posXIn.left - this.posXIn[storyNow.char[idxCharStory].position]);
                                    } 
                                    else if((storyNow.animEffect.char[i].from == null && storyNow.char[idxCharStory].position == 'right') 
                                        || (storyNow.animEffect.char[i].from != null && storyNow.animEffect.char[i].from == 'right')
                                        ) {
                                        this['sptChar' + idxChar].changeScale(1, -1);
                                        xOut = (ig.system.width/2 + 100*_DATAGAME.ratioRes + plusDis);
                                        distanceWalk = xOut + (this.posXIn.right - this.posXIn[storyNow.char[idxCharStory].position]);
                                    } 

                                    //CHECK FACETO
                                    if(storyNow.animEffect.char[i].faceTo!= null && storyNow.animEffect.char[i].faceTo != "") {
                                        if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'right') this['sptChar' + idxChar].changeScale(1, -1);
                                        else if(storyNow.animEffect.char[i].faceTo.toLowerCase() == 'left') this['sptChar' + idxChar].changeScale(1, 1);
                                    }

                                    durWalkOut = this.defDurWalkIn * Math.abs(distanceWalk) / (500*_DATAGAME.ratioRes); 

                                    var _tempAnimNameOut = (storyNow.animEffect.char[i].anim == null) ? "ANIM_WALK" : storyNow.animEffect.char[i].anim.toUpperCase();
                                    if(_tempAnimNameOut.substring(0, 5) != "ANIM_") _tempAnimNameOut = "ANIM_" + storyNow.animEffect.char[i].anim.toUpperCase();

                                    if(_tempAnimNameOut != null) {
                                        durWalkOut = this.checkAnimationDurationForWalkInAndOut(_tempAnimNameOut, durWalkOut);
                                        //  switch(_tempAnimNameOut) {
                                        //     case 'ANIM_JOG_HAND_CLOSE' :
                                        //     case 'ANIM_JOG_HAND_OPEN' :
                                        //         durWalkOut /= 1.5;
                                        //         break;
                                        //     case 'ANIM_RUN' :
                                        //     case 'ANIM_SPRINT_HAND_CLOSE' :
                                        //     case 'ANIM_SPRINT_HAND_OPEN' :
                                        //     case 'ANIM_RUN_WIDE_HAND_CLOSE' :
                                        //     case 'ANIM_RUN_WIDE_HAND_OPEN' :
                                        //         durWalkOut /= 2;
                                        //         break;
                                        //     case 'ANIM_STUMBLE' :
                                        //         durWalkOut *= 3;
                                        //         break;
                                        // }
                                    }
                                    durWalkOut = this.checkWalkingSpeed(durWalkOut, this['sptChar' + idxChar], storyNow.animEffect.char[i].speed);

                                    new ig.TweenDef(this.offsetDefChar[idxChar]).
                                    to({x:xOut}, durWalkOut)
                                    .easing(ig.Tween.Easing.Linear.EaseNone)
                                     .onComplete(function(_noChar, _tint) {
                                        this['sptChar' + _noChar].changePose('ANIM_IDLE', null, 'shadow', null, _tint);
                                        this['sptChar' + _noChar].spriter.root.alpha = 0;
                                        this['sptChar' + _noChar].kill();
                                        this['sptChar' + _noChar] = null;
                                        this.arrChar[_noChar] = "";
                                    }.bind(this, idxChar, storyNow.animEffect.char[i].tint)).start();

                                    if(storyNow.animEffect.char[i].rear) {
                                        // this['sptChar' + idxChar].changePose('ANIM_WALK_REAR');
                                        if(_tempAnimNameOut != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimNameOut + '_REAR', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_WALK_REAR', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                    } else {
                                        if(_tempAnimNameOut != null) {
                                            this['sptChar' + idxChar].changePose(_tempAnimNameOut, storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        } else {
                                            this['sptChar' + idxChar].changePose('ANIM_WALK', storyNow.animEffect.char[i].handheld, storyNow.animEffect.char[i].shadow, null, storyNow.animEffect.char[i].tint, true);
                                        }
                                        // this['sptChar' + idxChar].changePose('ANIM_WALK');
                                        //ADD EMO WHEN WALKING
                                        if(storyNow.animEffect.char[i].emo != null && storyNow.animEffect.char[i].emo != "") {
                                            this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.animEffect.char[i].emo), true);
                                        } else {
                                            if(storyNow.char[idxCharStory].emotion != 'ANIM_NONE') {
                                                this['sptChar' + idxChar].changeEmotion(_DATAGAME.listEmotion.indexOf(storyNow.char[idxCharStory].emotion), true);
                                            } 
                                        }
                                    }

                                    //CHANGE SPRITER SCALE
                                    this['sptChar' + idxChar].changeScale(storyNow.char[i].scale, this['sptChar' + idxChar].flipState);
                                    this.calculatePosChar(idxChar);
                                }
                            }
                            
                            ig.game.tweenDelay(this, this.longestDurWalkIn, 'afterAnimation');
                            break;
                        case 'pan' :
                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }
                            this.playAnimCharStory(storyNow);

                            this.panBG(_DATAGAME.pan[storyNow.animEffect.panEnd], 0.1, 
                                function() {
                                    this.afterAnimation();
                                }.bind(this)
                            );
                            break;
                        case 'trans' :
                            this.checkOutfitChar(storyNow);

                            for(var ti=0;ti<this.totalAllChar;ti++) {
                                this.isVisibleChar[ti] = false;
                            }

                            this.totalChar = 0;

                            this.checkAnimDelayOnTransition(storyNow);

                            if(storyNow.animEffect.type == 'trans0') {
                                ig.game.windowBefore = 'game';
                                ig.game.sessionData.numChat[this.numChapter] = this.numChat + 1;
                                ig.game.withoutTransition();
                            }
                            else {
                                if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                    this.playSFXStory(storyNow);
                                }

                                if(storyNow.animEffect.color != null) {
                                    ig.game.fadeInWindow(LevelGame, ig.game.getNumber(storyNow.animEffect.type), storyNow.animEffect.color);
                                } else {
                                    ig.game.fadeInWindow(LevelGame, ig.game.getNumber(storyNow.animEffect.type));
                                }
                                ig.game.sessionData.numChat[this.numChapter] = this.numChat + 1;
                            }
                            break;
                        case 'flashback' :
                            this.checkOutfitChar(storyNow);

                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }

                            for(var ti=0;ti<this.totalAllChar;ti++) {
                                this.isVisibleChar[ti] = false;
                            }

                            this.totalChar = 0;

                            ig.game.fadeInWindow(LevelGame, 1, storyNow.animEffect.color);
                            
                            ig.game.sessionData.isFlashback[this.numChapter] = true;
                            this.isDelayFlashback = true;
                            ig.game.sessionData.flashbackColor[this.numChapter] = (storyNow.animEffect.color == null) ? 'white' : storyNow.animEffect.color;
                            ig.game.sessionData.numChat[this.numChapter] = this.numChat + 1;
                            break;
                        case 'flashback_end' :
                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }

                            for(var ti=0;ti<this.totalAllChar;ti++) {
                                this.isVisibleChar[ti] = false;
                            }

                            this.totalChar = 0;

                            ig.game.fadeInWindow(LevelGame, 1, ig.game.sessionData.flashbackColor[this.numChapter]);
                            
                            ig.game.sessionData.isFlashback[this.numChapter] = false;
                            this.isDelayFlashback = true;
                            ig.game.sessionData.numChat[this.numChapter] = this.numChat + 1;
                            break;
                        case 'heartbeat' :
                        case 'pulse' :
                        case 'hover' :
                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }
                            this.playAnimCharStory(storyNow);

                            if(storyNow.animEffect.remove != null && storyNow.animEffect.remove == true) {
                                if(this.zoomPanCameraTween != null) this.zoomPanCameraTween.stop();
                                if(this.zoomPanCameraTweenDuration != null) this.zoomPanCameraTweenDuration.stop();

                                this.afterAnimation();
                            } else {
                                var _zscaleStart = storyNow.animEffect.scaleStart;
                                var _zscale = storyNow.animEffect.scale;
                                var _zposX = storyNow.animEffect.posX;
                                var _zposY = storyNow.animEffect.posY;
                                var _zmoveX = storyNow.animEffect.moveX;
                                var _zmoveY = storyNow.animEffect.moveY;
                                var _zduration = storyNow.animEffect.time;
                                var _zinterval = storyNow.animEffect.interval;
                                var _zdelay = 0;
                                var _zeasing = storyNow.animEffect.easing;
                                var _zshakeDistance = storyNow.animEffect.shakeDistance;

                                if(storyNow.animEffect.delay != null && storyNow.animEffect.delay > 0) _zdelay = storyNow.animEffect.delay;
                                    var _isPropertiesChanged = false;
                                    if(this.dataZoomPanCamera == null)  _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.type != storyNow.animEffect.type.toLowerCase()) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.scaleStart != _zscaleStart) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.scale != _zscale) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.posX != _zposX) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.posY != _zposY) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.moveX != _zmoveX) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.moveY != _zmoveY) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.time != _zduration) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.interval != _zinterval) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.delay != _zdelay) _isPropertiesChanged = true;
                                    else if(this.dataZoomPanCamera.easing != _zeasing) _isPropertiesChanged = true;
                                    else if(ig.game.getString(storyNow.animEffect.type) == 'hover' && this.dataZoomPanCamera.shakeDistance != _zshakeDistance) _isPropertiesChanged = true;

                                    if(_isPropertiesChanged) {
                                        this.dataZoomPanCamera = {};
                                        this.dataZoomPanCamera.type = _DATAGAME['animEffect_' + storyNow.animEffect.type.toLowerCase()];
                                        this.dataZoomPanCamera.scaleStart = _zscaleStart;
                                        this.dataZoomPanCamera.scale = _zscale;
                                        this.dataZoomPanCamera.posX = _zposX;
                                        this.dataZoomPanCamera.posY = _zposY;
                                        this.dataZoomPanCamera.moveX = _zmoveX;
                                        this.dataZoomPanCamera.moveY = _zmoveY;
                                        this.dataZoomPanCamera.time = _zduration;
                                        this.dataZoomPanCamera.interval = _zinterval;
                                        this.dataZoomPanCamera.delay = _zdelay;
                                        this.dataZoomPanCamera.easing = _zeasing;
                                        this.dataZoomPanCamera.shakeDistance = _zshakeDistance;

                                        this.zoomPanCamera(_zscale, _zmoveX, _zmoveY, _zposX, _zposY, _zduration, _zdelay, 
                                            function() {
                                                this.afterAnimation();
                                            }.bind(this)
                                        , _zeasing, _zinterval, _zscaleStart, _zshakeDistance);
                                    }
                            }
                            break;
                        case 'zoom_pan' :
                            this.dataZoomPanCamera = null;
                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }
                            this.playAnimCharStory(storyNow);

                            var _zscale = storyNow.animEffect.scale;
                            var _zmoveX = storyNow.animEffect.moveX;
                            var _zmoveY = storyNow.animEffect.moveY;
                            var _zposX = storyNow.animEffect.posX;
                            var _zposY = storyNow.animEffect.posY;
                            var _zduration = storyNow.animEffect.time;
                            var _zdelay = 0;
                            var _zeasing = storyNow.animEffect.easing;
                            if(storyNow.animEffect.delay != null && storyNow.animEffect.delay > 0) _zdelay = storyNow.animEffect.delay;

                            this.zoomPanCamera(_zscale, _zmoveX, _zmoveY, _zposX, _zposY, _zduration, _zdelay, 
                                function() {
                                    this.afterAnimation();
                                }.bind(this)
                            , _zeasing);
                            break;
                        case 'zoom_in' :
                            this.dataZoomPanCamera = null;
                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }
                            this.playAnimCharStory(storyNow);

                            var posZoom = storyNow.char[this.searchIdxChar(storyNow, storyNow.animEffect.char[0])].position;

                            var _zscale = 2;
                            var _zmoveX = 0;
                            var _zmoveY = 0;
                            var _zposX = _DATAGAME.zoom[posZoom].x * _DATAGAME.originalSize.x * _DATAGAME.ratioRes;
                            var _zposY = _DATAGAME.zoom[posZoom].y * _DATAGAME.originalSize.y * _DATAGAME.ratioRes;
                            var _zduration = 0.5;
                            var _zdelay = 0;
                            var _zeasing = storyNow.animEffect.easing;
                            if(storyNow.animEffect.delay != null && storyNow.animEffect.delay > 0) _zdelay = storyNow.animEffect.delay;

                            this.zoomPanCamera(_zscale, _zmoveX, _zmoveY, _zposX, _zposY, _zduration, _zdelay, 
                                function() {
                                    this.afterAnimation();
                                }.bind(this)
                            , _zeasing);

                            // var posZoom = storyNow.char[this.searchIdxChar(storyNow, storyNow.animEffect.char[0])].position;
                            // this.scaleBG(_DATAGAME.zoom[posZoom].scale, _DATAGAME.zoom[posZoom].x, _DATAGAME.zoom[posZoom].y, 0,
                            //     function(){
                            //         this.afterAnimation();
                            //     }.bind(this)
                            // );
                            break;
                        case 'zoom_out' :
                            this.dataZoomPanCamera = null;
                            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                                this.playSFXStory(storyNow);
                            }
                            this.playAnimCharStory(storyNow);

                            var _zscale = 1;
                            var _zmoveX = 0;
                            var _zmoveY = 0;
                            var _zposX = 0;
                            var _zposY = 0;
                            var _zduration = 0.5;
                            var _zdelay = 0;
                            var _zeasing = storyNow.animEffect.easing;
                            if(storyNow.animEffect.delay != null && storyNow.animEffect.delay > 0) _zdelay = storyNow.animEffect.delay;

                            this.zoomPanCamera(_zscale, _zmoveX, _zmoveY, _zposX, _zposY, _zduration, _zdelay, 
                                function() {
                                    this.afterAnimation();
                                }.bind(this)
                            , _zeasing);
                            
                            // this.scaleBG(1, 0, 0, 0,
                            //     function(){
                            //         this.afterAnimation();
                            //     }.bind(this)
                            // );
                            break;
                        case 'love_gender' :
                            this.loadBubbleChat();
                            break;
                    }
                } else {
                    this.lastChatId = this.numChat;
                    ig.game.sessionData.lastChatId[this.numChapter] = this.lastChatId;

                    if(isOverlay) {
                        // this.placeOverlayObject(true, storyNow);
                        // this.placeSingleParticle(storyNow);
                        this.playSFXStory(storyNow);
                    } //else {
                        this.loadBubbleChat();
                    //}
                }
            }

            for(var vc=1;vc<=_DATAGAME.totalVirtualCurrency;vc++) {
                ig.game.sessionData['virtualCurrency' + vc] = this['virtualCurrency' + vc];
            }

            // ig.game.sessionData.virtualCurrency1 = this.virtualCurrency1;
            // ig.game.sessionData.virtualCurrency2 = this.virtualCurrency2;
            // ig.game.sessionData.virtualCurrency3 = this.virtualCurrency3;

            if(storyNow.animEffect != null) {
                if(ig.game.getString(storyNow.animEffect.type) != 'end' && ig.game.getString(storyNow.animEffect.type) != 'trans' && 
                    ig.game.getString(storyNow.animEffect.type) != 'flashback' && ig.game.getString(storyNow.animEffect.type) != 'flashback_end' && 
                    ig.game.getString(storyNow.animEffect.type) != 'input_name' && ig.game.getString(storyNow.animEffect.type) != 'freeze_frame' &&
                    ig.game.getString(storyNow.animEffect.type) != 'text_chat' && ig.game.getString(storyNow.animEffect.type) != 'email' &&
                    ig.game.getString(storyNow.animEffect.type) != 'letter' 
                ) {
                    if(storyNow.text.replaceAll(' ', '') != "") {
                        this.saveToLogHistory(this.numChat);
                    }
                } 
            } else {
                if(storyNow.text.replaceAll(' ', '') != "") {
                    this.saveToLogHistory(this.numChat);
                }
            }

            if(_DATAGAME.enableCurrentProgress == true) {
                ig.game.saveAll();
            }

            this.checkBGM();
        },

        checkAnimationDurationForWalkInAndOut:function(_currentAnimation, _currentDuration) {
            switch(_currentAnimation) {
                case 'ANIM_JOG_HAND_CLOSE' :
                case 'ANIM_JOG_HAND_OPEN' :
                case 'ANIM_WALK_SHIVER_MILD' :
                case 'ANIM_WALK_SHIVER_MEDIUM' :
                case 'ANIM_WALK_SHIVER_EXTREME' :
                    _currentDuration /= 1.5;
                    break;
                case 'ANIM_RUN' :
                    _currentDuration /= 2;
                    break;
                case 'ANIM_SPRINT_HAND_CLOSE' :
                case 'ANIM_SPRINT_HAND_OPEN' :
                case 'ANIM_RUN_WIDE_HAND_CLOSE' :
                case 'ANIM_RUN_WIDE_HAND_OPEN' :
                    _currentDuration /= 3;
                    break;
                case 'ANIM_STUMBLE' :
                    _currentDuration *= 3;
                    break;
            }
            return _currentDuration;
        },

        saveToLogHistory:function(_noScene, _optionGender) {
            if(_optionGender == null) _optionGender = false;

            if(ig.game.sessionData.historyLog['chapter' + this.numChapter] == null) {
                ig.game.sessionData.historyLog['chapter' + this.numChapter] = [];
            }
            
            if(_noScene >= 0) {
                if(ig.game.sessionData.historyLog['chapter' + this.numChapter][0] != this.numChat && !_optionGender) { 
                    ig.game.sessionData.historyLog['chapter' + this.numChapter].splice(0, 0, this.numChat);
                } else if(ig.game.sessionData.historyLog['chapter' + this.numChapter][0] != _noScene && _optionGender) {
                    ig.game.sessionData.historyLog['chapter' + this.numChapter].splice(0, 0, _noScene);
                }
            } else {
                if(ig.game.sessionData.historyLog['chapter' + this.numChapter][0] != _noScene) {
                    ig.game.sessionData.historyLog['chapter' + this.numChapter].splice(0, 0, _noScene);
                }
            }
            
        }, 

        zoomPanCamera:function(scl, moveX, moveY, posX, posY, duration, delayAnim, funcComp, tweenEasing, interval, sclStart, shakeDistance) { //easing, interval, sclStart for hearbeat and pulse animeffect, shakeDistance for hover animeffect
            if(scl == null) scl = this.zoomBG;
            if(moveX != null) this.lastposXBG = moveX*-1;
            if(moveY != null) this.lastposYBG = moveY*-1;
            // if(posX != null) this.bg.pntX = posX / ig.sizeHandler.minW;
            // if(posY != null) this.bg.pntY = posY / ig.sizeHandler.minH;

            var anchorX = this.bg.pntX;
            var anchorY = this.bg.pntY;
            if(posX != null) anchorX = posX / ig.sizeHandler.minW;
            if(posY != null) anchorY = posY / ig.sizeHandler.minH;
           
            this.bg.statMove = (this.lastposXBG - this.posXBG > 0) ? this.bg.moveStatus.RIGHT : this.bg.moveStatus.LEFT;
            this.bg.repos();

            var _easing = (tweenEasing && tweenEasing != "") ? tweenEasing.split(".") : ("Linear.EaseNone").split(".");

            if(this.zoomPanCameraTween != null) this.zoomPanCameraTween.stop();
            if(this.zoomPanCameraTweenDuration != null) this.zoomPanCameraTweenDuration.stop();

            if((duration == null || duration <= 0) && this.dataZoomPanCamera == null) {
                this.zoomBG = scl;
                this.posXBG = this.lastposXBG;
                this.posYBG = this.lastposYBG;
                this.anchorBGX = anchorX;
                this.anchorBGY = anchorY;

                this.bg.pntX = anchorX;
                this.bg.pntY = anchorY;

                this.bg.statMove = this.bg.moveStatus.NONE;
                if(funcComp!=null) funcComp();
            } else {
                this.boolZoomPanCamera = true;

                if(this.dataZoomPanCamera == null) {
                    this.zoomPanCameraTween = this.tween({
                        zoomBG:scl,
                        posXBG:this.lastposXBG,
                        posYBG:this.lastposYBG,
                        anchorBGX : anchorX,
                        anchorBGY : anchorY
                    }, duration, {
                        delay:delayAnim,
                        easing : ig.Tween.Easing[_easing[0]][_easing[1]],
                        onComplete:function() {
                            this.bg.pntX = anchorX;
                            this.bg.pntY = anchorY;

                            this.bg.statMove = this.bg.moveStatus.NONE;
                            this.boolZoomPanCamera = false;
                            if(funcComp!=null) funcComp();
                        }.bind(this)
                    });
                }
                else {
                    this.zoomBG = (this.dataZoomPanCamera.type == _DATAGAME.animEffect_hover) ? scl : sclStart;
                    this.posXBG = this.lastposXBG;
                    this.posYBG = this.lastposYBG;
                    this.anchorBGX = anchorX;
                    this.anchorBGY = anchorY;

                    this.bg.pntX = anchorX;
                    this.bg.pntY = anchorY;

                    // if(moveX != null) this.lastposXBG = moveX*-1;
                    // if(moveY != null) this.lastposYBG = moveY*-1;

                    if(this.dataZoomPanCamera.type == _DATAGAME.animEffect_hover) {
                        this.tweenHoverRepeat(true, scl, anchorX, anchorY, interval, delayAnim, _easing);
                    } else {
                        this.zoomPanCameraTween = this.tween({
                            zoomBG:scl,
                            posXBG:this.lastposXBG,
                            posYBG:this.lastposYBG,
                            anchorBGX : anchorX,
                            anchorBGY : anchorY
                        }, interval, {
                            delay:delayAnim,
                            easing : ig.Tween.Easing[_easing[0]][_easing[1]],
                            loop : (this.dataZoomPanCamera.type == _DATAGAME.animEffect_heartbeat) ? ig.Tween.Loop.Reverse : ig.Tween.Loop.Revert
                        });
                    }

                    if(duration < 0) {
                        if(funcComp!=null) funcComp();
                    } else {
                        this.dummyDurationEffect = 0;
                        this.zoomPanCameraTweenDuration = this.tween({
                            dummyDurationEffect:1
                        }, duration, {
                            delay:delayAnim,
                            easing : ig.Tween.Easing.Linear.EaseNone,
                            onComplete:function() {
                                this.zoomPanCameraTween.stop();
                                this.bg.pntX = anchorX;
                                this.bg.pntY = anchorY;

                                this.bg.statMove = this.bg.moveStatus.NONE;
                                this.boolZoomPanCamera = false;
                                if(funcComp!=null) funcComp();
                            }.bind(this)
                        });

                        this.zoomPanCameraTweenDuration.start();
                    } 
                }
                this.zoomPanCameraTween.start();
            }
        },

        tweenHoverRepeat:function(firstPlay, scl, anchorX, anchorY, interval, delayAnim, _easing) {
            if(this.zoomPanCameraTween != null) this.zoomPanCameraTween.stop();

            var _moveX = (this.dataZoomPanCamera.moveX != null) ? this.dataZoomPanCamera.moveX : 0;
            var _moveY = (this.dataZoomPanCamera.moveY != null) ? this.dataZoomPanCamera.moveY : 0;

            this.bg.statMove = (this.lastposXBG - this.posXBG > 0) ? this.bg.moveStatus.RIGHT : this.bg.moveStatus.LEFT;

            if(this.arrHoverShake == null || this.arrHoverShake.length == 0) {
                this.arrHoverShake = [ 1, 2, 3, 4 ];
                this.arrHoverShake = ig.game.shuffleArray(this.arrHoverShake);
                if(this.lastRandomShake != null && this.lastRandomShake == this.arrHoverShake[0]){
                    var tempArrHoverShake = this.arrHoverShake.concat([]);
                    this.arrHoverShake = [];
                    this.arrHoverShake.push(tempArrHoverShake[1]);
                    this.arrHoverShake.push(tempArrHoverShake[0]);
                    this.arrHoverShake.push(tempArrHoverShake[2]);
                    this.arrHoverShake.push(tempArrHoverShake[3]);
                }
            }

            if(this.arrHoverShake[0] == 1) _moveX += this.dataZoomPanCamera.shakeDistance;
            else if(this.arrHoverShake[0] == 2) _moveX -= this.dataZoomPanCamera.shakeDistance;
            else if(this.arrHoverShake[0] == 3) _moveY += this.dataZoomPanCamera.shakeDistance;
            else if(this.arrHoverShake[0] == 4) _moveY -= this.dataZoomPanCamera.shakeDistance;

            this.lastRandomShake = this.arrHoverShake[0];

            this.lastposXBG = _moveX*-1;
            this.lastposYBG = _moveY*-1;

            this.zoomPanCameraTween = this.tween({
                zoomBG:scl,
                posXBG:this.lastposXBG,
                posYBG:this.lastposYBG,
                anchorBGX : anchorX,
                anchorBGY : anchorY
            }, interval, {
                delay:(firstPlay == true) ? delayAnim : 0,
                easing : ig.Tween.Easing[_easing[0]][_easing[1]],
                onComplete:function(_scl, _anchorX, _nchorY, _interval, _delayAnim, _easingg) {
                    if(this.zoomPanCameraTween != null) this.zoomPanCameraTween.stop();
                    this.arrHoverShake.splice(0, 1);
                    this.tweenHoverRepeat(false, _scl, _anchorX, _nchorY, _interval, _delayAnim, _easingg);
                    this.zoomPanCameraTween.start();
                }.bind(this, scl, anchorX, anchorY, interval, delayAnim, _easing)
            });
        },

        killWindowBoxing:function(_position) {
            if(this.entityWindowBoxing[_position.toLowerCase()] != null) {
                this.entityWindowBoxing[_position.toLowerCase()].kill();
                this.entityWindowBoxing[_position.toLowerCase()] = null;
            }
        },

        spawnWindowBoxing:function(storyNow, _position) {
            var boxData = storyNow.windowBoxing[_position.toLowerCase()];
            if(boxData != null) {
                //ALREADY SPAWN BEFORE
                if(this.entityWindowBoxing[_position.toLowerCase()] != null) {
                    
                } 
                else {
                    this.entityWindowBoxing[_position.toLowerCase()] = ig.game.spawnEntity(EntityWindowBoxing, 0, 0, {
                        _parent:this, 
                        position:_position.toLowerCase()
                    });
                }

                //Z-INDEX
                if(boxData.zIndex == null) {
                    this.entityWindowBoxing[_position.toLowerCase()].zIndex = _DATAGAME.windowBoxing[_position.toLowerCase()].zIndex;
                } else {
                    this.entityWindowBoxing[_position.toLowerCase()].zIndex = (boxData.zIndex < 0) ? _DATAGAME.zIndexData.windowBoxingBelow : _DATAGAME.zIndexData.windowBoxingTop;
                }

                //THICKNESS
                if(boxData.thickness == null) {
                    this.entityWindowBoxing[_position.toLowerCase()].thickness = _DATAGAME.windowBoxing[_position.toLowerCase()].thickness;
                } else {
                    this.entityWindowBoxing[_position.toLowerCase()].thickness = (boxData.thickness > 0) ? boxData.thickness : _DATAGAME.windowBoxing[_position.toLowerCase()].thickness;
                }

                //COLOR
                if(boxData.color == null || boxData.color == '' || boxData.color == 'none') {
                    this.entityWindowBoxing[_position.toLowerCase()].color = _DATAGAME.windowBoxing[_position.toLowerCase()].color;
                } else {
                    this.entityWindowBoxing[_position.toLowerCase()].color = boxData.color;
                }
            } else {
                this.killWindowBoxing(_position.toLowerCase());
            }
        },

        checkProgressBar:function(storyNow) {
            if(storyNow.progressBar) {
                var _position = ig.system.height * 0.04;

                if(_DATAGAME.defaultProgressBar.position.toLowerCase() == 'bottom') _position = ig.system.height * 0.96;
                else if(_DATAGAME.defaultProgressBar.position.toLowerCase() == 'center' || _DATAGAME.defaultProgressBar.position.toLowerCase() == 'middle') _position = ig.system.height * 0.5;

                for(var i=0;i<storyNow.progressBar.length;i++){
                    var _idxBar = -1;
                    if(EntityProgressBar.progressBarArr != null) _idxBar = EntityProgressBar.progressBarArr.map(function(e) { return e.id; }).indexOf(storyNow.progressBar[i].progressID)
                    var _dataProp = storyNow.progressBar[i];
                    var _dataPropOri = _DATAGAME.progressBar[storyNow.progressBar[i].progressID];
                    var _dataPropDefault = _DATAGAME.defaultProgressBar;

                    var _strokeColor = (_dataProp.strokeColor == null) ? ((_dataPropOri.strokeColor == null) ? _dataPropDefault.strokeColor : _dataPropOri.strokeColor) : _dataProp.strokeColor;
                    var _strokeWidth = (_dataProp.strokeThickness == null) ? ((_dataPropOri.strokeThickness == null) ? _dataPropDefault.strokeThickness*_DATAGAME.ratioRes : _dataPropOri.strokeThickness*_DATAGAME.ratioRes) : _dataProp.strokeThickness*_DATAGAME.ratioRes;
                    var _isStroke = (_strokeColor == null || _strokeColor == 'none' || _strokeColor == '' || _strokeWidth == 0) ? false : true;
                    var _showText = (_dataProp.showText == null) ? ((_dataPropOri.showText == null) ? _dataPropDefault.showText : _dataPropOri.showText) : _dataProp.showText;
                    //CONTINUE OTHER DATA HERE
                    var _showMaxValue = (_dataProp.showMaxValue == null) ? ((_dataPropOri.showMaxValue == null) ? _dataPropDefault.showMaxValue : _dataPropOri.showMaxValue) : _dataProp.showMaxValue;
                    var _width = (_dataProp.width == null) ? ((_dataPropOri.width == null) ? _dataPropDefault.width*_DATAGAME.ratioRes : _dataPropOri.width*_DATAGAME.ratioRes) : _dataProp.width*_DATAGAME.ratioRes;
                    var _height = (_dataProp.height == null) ? ((_dataPropOri.height == null) ? _dataPropDefault.height*_DATAGAME.ratioRes : _dataPropOri.height*_DATAGAME.ratioRes) : _dataProp.height*_DATAGAME.ratioRes;
                    var _progressColor = (_dataProp.progressColor == null) ? ((_dataPropOri.progressColor == null) ? _dataPropDefault.progressColor : _dataPropOri.progressColor) : _dataProp.progressColor;
                    var _corner = (_dataProp.corner == null) ? ((_dataPropOri.corner == null) ? _dataPropDefault.corner*_DATAGAME.ratioRes : _dataPropOri.corner*_DATAGAME.ratioRes) : _dataProp.corner*_DATAGAME.ratioRes;
                    var _textColor = (_dataProp.textColor == null) ? ((_dataPropOri.textColor == null) ? _dataPropDefault.textColor : _dataPropOri.textColor) : _dataProp.textColor;
                    var _textSize = (_dataProp.textSize == null) ? ((_dataPropOri.textSize == null) ? _dataPropDefault.textSize*_DATAGAME.ratioRes : _dataPropOri.textSize*_DATAGAME.ratioRes) : _dataProp.textSize*_DATAGAME.ratioRes;
                    var _strokeTextColor = (_dataProp.strokeTextColor == null) ? ((_dataPropOri.strokeTextColor == null) ? _dataPropDefault.strokeTextColor : _dataPropOri.strokeTextColor) : _dataProp.strokeTextColor;
                    var _strokeTextThickness = (_dataProp.strokeTextThickness == null) ? ((_dataPropOri.strokeTextThickness == null) ? _dataPropDefault.strokeTextThickness*_DATAGAME.ratioRes : _dataPropOri.strokeTextThickness*_DATAGAME.ratioRes) : _dataProp.strokeTextThickness*_DATAGAME.ratioRes;

                    if(EntityProgressBar.progressBarArr == null || _idxBar < 0) {
                        ig.game.spawnEntity(EntityProgressBar, 0, _position, { 
                            id:storyNow.progressBar[i].progressID,
                            zIndex: _DATAGAME.zIndexData.progressBar, 
                            barPosition:_DATAGAME.defaultProgressBar.position.toLowerCase(),
                            prevPos: {x:ig.system.width * 0.5, y:_position},
                            defPos : {x:ig.system.width * 0.5, y:_position},
                            barProperties: {
                                "showText" : _showText,
                                "showMaxValue" : _showMaxValue,
                                "width" : _width,
                                "height" : _height,
                                "progressColor" : _progressColor,
                                "strokeColor" : _strokeColor,
                                "strokeThickness" : _strokeWidth,
                                "corner" : _corner,
                                "textColor" : _textColor,
                                "textSize" : _textSize,
                                "isStroke" : _isStroke,
                                "strokeTextColor" : _strokeTextColor,
                                "strokeTextThickness" : _strokeTextThickness
                            },
                            barPadding : (_isStroke == true) ? ((13 *_DATAGAME.ratioRes) + _strokeWidth) : (13 *_DATAGAME.ratioRes)
                        });
                    } else {
                        EntityProgressBar.progressBarArr[_idxBar].barProperties = {
                            "showText" : _showText,
                            "showMaxValue" : _showMaxValue,
                            "width" : _width,
                            "height" : _height,
                            "progressColor" : _progressColor,
                            "strokeColor" : _strokeColor,
                            "strokeThickness" : _strokeWidth,
                            "corner" : _corner,
                            "textColor" : _textColor,
                            "textSize" : _textSize,
                            "isStroke" : _isStroke,
                            "strokeTextColor" : _strokeTextColor,
                            "strokeTextThickness" : _strokeTextThickness
                        };
                        EntityProgressBar.progressBarArr[_idxBar].barPadding = (_isStroke == true) ? ((13 *_DATAGAME.ratioRes) + _strokeWidth) : (13 *_DATAGAME.ratioRes);
                    }
                }
            } 

            if(EntityProgressBar.progressBarArr != null) {
                for(var j=0;j<EntityProgressBar.progressBarArr.length;j++){
                    if(storyNow.progressBar == null) {
                        EntityProgressBar.progressBarArr[j].tweenFadeOut();
                    } else {
                        if(
                            (storyNow.progressBar.map(function(e) { return e.progressID; }).indexOf(EntityProgressBar.progressBarArr[j].id) < 0)
                        ) {
                            EntityProgressBar.progressBarArr[j].tweenFadeOut();
                        } 
                    }
                }
            }
        },

        checkVignette:function(storyNow) {
            if(storyNow.vignette) {
                // this.spawnWindowBoxing(storyNow, 'top');
                // this.spawnWindowBoxing(storyNow, 'bottom');
                // this.spawnWindowBoxing(storyNow, 'left');
                // this.spawnWindowBoxing(storyNow, 'right');

                // ig.game.sortEntitiesDeferred();
            }
            else {
                // this.killWindowBoxing('top');
                // this.killWindowBoxing('bottom');
                // this.killWindowBoxing('left');
                // this.killWindowBoxing('right');
            }
        },

        checkWindowBoxing:function(storyNow) {
            if(storyNow.windowBoxing) {
                this.spawnWindowBoxing(storyNow, 'top');
                this.spawnWindowBoxing(storyNow, 'bottom');
                this.spawnWindowBoxing(storyNow, 'left');
                this.spawnWindowBoxing(storyNow, 'right');

                ig.game.sortEntitiesDeferred();
            }
            else {
                this.killWindowBoxing('top');
                this.killWindowBoxing('bottom');
                this.killWindowBoxing('left');
                this.killWindowBoxing('right');
            }
        },

        checkTopOverlay:function(storyNow) {
            if (storyNow.overlayType) {
                var isSpawn = true;
                if(this.entityTopOverlay != null) {
                    if(this.entityTopOverlay.overlayType != storyNow.overlayType.toLowerCase()) {
                        this.entityTopOverlay.kill();
                        this.entityTopOverlay = null;
                    }  else {
                        isSpawn = false;
                    }
                }

                if(isSpawn){
                    this.entityTopOverlay = ig.game.spawnEntity('Entity' + storyNow.overlayType.toLowerCase(), 0, 0, {_parent:this, overlayType:storyNow.overlayType.toLowerCase()});
                }

                ig.game.sortEntitiesDeferred();
            }
            else {
                if(this.entityTopOverlay != null) {
                    this.entityTopOverlay.kill();
                    this.entityTopOverlay = null;
                    ig.game.consoleLog('kill top overlay');
                }
            }
        },

        checkParticle:function(storyNow) {
            if (storyNow.particle) {
                if(this.entityParticle == null) {
                    this.entityParticle = ig.game.spawnEntity(EntityParticle, 0, 0, {_parent:this, dataParticle:storyNow.particle});
                    this.entityParticle.setInitialProp();
                    ig.game.sortEntitiesDeferred();
                }
                else  {
                    if(this.entityParticle.dataParticle.type != storyNow.particle.type) {
                        this.entityParticle.dataParticle = storyNow.particle;
                        this.entityParticle.setInitialProp();
                        ig.game.sortEntitiesDeferred();
                    } 
                }
            }
            else {
                if(this.entityParticle != null) {
                    if(this.entityParticle.animType == this.entityParticle.TYPE_MATRIX) {
                        this.entityParticle.killEntityMatrix();
                        this.entityParticle.killOtherEntity();
                        ig.game.consoleLog('kill particle matrix');
                    } else {
                        this.entityParticle.killOtherEntity();
                        this.entityParticle.kill();
                        this.entityParticle = null;
                        ig.game.consoleLog('kill particle');
                    }
                }
            }
        },

        placeOverlayObject:function(boolAnim, storyNow) {
            this.finishAddOverlayObject = false;
            this.overlayList = [];
            this.objectList = (storyNow.object == null) ? [] : storyNow.object;

            var listObjectID = [];

            var noTween = true;

            if (storyNow.object) {
                for(var tw=0;tw<storyNow.object.length;tw++) {
                    var objTween = storyNow.object[tw];

                    this.overlayList.push(false);
                    listObjectID.push(objTween.objectID);

                    if(objTween.to != null) noTween = false;

                    if(noTween == true && tw == storyNow.object.length - 1) this.finishAddOverlayObject = true;
                    
                    if(objTween.chain >= 0) {
                        
                    } else {
                        if(this.entityOverlay[objTween.objectID]) { 
                            if(this.entityOverlay[objTween.objectID].isFirstLoad == true ||
                                this.entityOverlay[objTween.objectID].dataTween.loop == null || 
                                this.entityOverlay[objTween.objectID].dataTween.loop.toLowerCase() == 'none' || 
                                this.entityOverlay[objTween.objectID].dataTween.loop != objTween.loop || 
                                this.entityOverlay[objTween.objectID].dataTween.time != objTween.time
                            ) {
                                this.entityOverlay[objTween.objectID].objectID = objTween.objectID;
                                this.entityOverlay[objTween.objectID].dataTween = objTween;
                                this.entityOverlay[objTween.objectID].tweenID = objTween.id;
                                this.entityOverlay[objTween.objectID].setInitialProp(boolAnim);

                                if(boolAnim == true) this.entityOverlay[objTween.objectID].isFirstLoad = false;
                            } else {
                                var _isDifferent = false; 

                                //CHECK FROM
                                if(this.entityOverlay[objTween.objectID].dataTween.from.angle != objTween.from.angle) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.from.scaleX != objTween.from.scaleX) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.from.scaleY != objTween.from.scaleY) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.from.x != objTween.from.x) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.from.y != objTween.from.y) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.from.alpha != objTween.from.alpha) _isDifferent = true;

                                //CHECK TO
                                if(this.entityOverlay[objTween.objectID].dataTween.to.angle != objTween.to.angle) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.to.scaleX != objTween.to.scaleX) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.to.scaleY != objTween.to.scaleY) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.to.x != objTween.to.x) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.to.y != objTween.to.y) _isDifferent = true;
                                if(this.entityOverlay[objTween.objectID].dataTween.to.alpha != objTween.to.alpha) _isDifferent = true;

                                //CHECK TINT
                                if(this.entityOverlay[objTween.objectID].dataTween.tint != objTween.tint) _isDifferent = true;

                                // console.log('different : ' + _isDifferent);

                                if(_isDifferent == true) {
                                    this.entityOverlay[objTween.objectID].objectID = objTween.objectID;
                                    this.entityOverlay[objTween.objectID].dataTween = objTween;
                                    this.entityOverlay[objTween.objectID].tweenID = objTween.id;
                                    this.entityOverlay[objTween.objectID].setInitialProp(boolAnim);
                                }
                            }
                        } else {
                            // console.log('new');
                            this.entityOverlay[objTween.objectID] = ig.game.spawnEntity(EntityOverlay, 0, 0, {_parent:this, objectID:objTween.objectID, dataTween:objTween, tweenID:objTween.id});
                            this.entityOverlay[objTween.objectID].setInitialProp(boolAnim);
                        }
                    }
                }

                this.finishAddOverlayObject = true;
            }

            if(this.objectList.length <= 0) {
                for(var itemOl in this.entityOverlay) {
                    if(this.entityOverlay[itemOl]) {
                        this.entityOverlay[itemOl].kill();
                        this.entityOverlay[itemOl] = null;
                    }
                }
                this.entityOverlay = {};

                // if(boolAnim) {
                //     this.afterAnimation('du');
                // }
            } else {
                for(var itemOverlay in this.entityOverlay) {
                    if(listObjectID.indexOf(itemOverlay) < 0 && this.entityOverlay[itemOverlay]) {
                        this.entityOverlay[itemOverlay].kill();
                        this.entityOverlay[itemOverlay] = null;
                    }
                }
            }

            ig.game.sortEntitiesDeferred();
        },

        placeSingleParticle:function(storyNow) {
            this.singleParticleList = (storyNow.singleParticle == null) ? [] : storyNow.singleParticle;
            var listSingleParticleID = [];

            if(storyNow.singleParticle) {
                for(var _single=0;_single<storyNow.singleParticle.length;_single++) {
                    var idParticle = storyNow.singleParticle[_single].objectID;
                    var _particle = storyNow.singleParticle[_single];
                    listSingleParticleID.push(idParticle);

                    if(this.entitySingleParticle[idParticle]) {
                        // this.entityOverlay[idParticle].objectID = objTween.objectID;

                        // if(_particle.type)
                        var _tempColorSingPar = this.entitySingleParticle[idParticle].dataParticle.color;
                        var _tempSizeSingPar = this.entitySingleParticle[idParticle].dataParticle.size;

                        this.entitySingleParticle[idParticle].dataParticle = _particle;

                        if(this.entitySingleParticle[idParticle].dataParticle.color == null) {
                            this.entitySingleParticle[idParticle].dataParticle.color = _tempColorSingPar;
                        }

                        if(this.entitySingleParticle[idParticle].dataParticle.size == null) {
                            this.entitySingleParticle[idParticle].dataParticle.size = _tempSizeSingPar;
                        }

                        if(this.entitySingleParticle[idParticle].entitySP != null) {
                            this.entitySingleParticle[idParticle].entitySP.dataParticle = this.entitySingleParticle[idParticle].dataParticle;
                        }
                        // console.log('warna ' + idParticle);
                        // console.log(this.entitySingleParticle[idParticle].dataParticle.color);
                        // this.entityOverlay[objTween.objectID].setInitialProp(boolAnim);

                    } else {
                        this.entitySingleParticle[idParticle] = ig.game.spawnEntity(EntitySingleParticle, 0, 0, {_parent:this, 
                            objectID:idParticle,
                            dataParticle: _particle
                        });
                        this.entitySingleParticle[idParticle].setInitialProp();

                        ig.game.sortEntitiesDeferred();
                    }
                }
            }

            if(this.singleParticleList.length <= 0) {
                for(var itemSP in this.entitySingleParticle) {
                    if(this.entitySingleParticle[itemSP]) {
                        if(this.entitySingleParticle[itemSP].entitySP != null) {
                            this.entitySingleParticle[itemSP].entitySP.kill();
                            this.entitySingleParticle[itemSP].entitySP = null;
                        }
                        this.entitySingleParticle[itemSP].kill();
                        this.entitySingleParticle[itemSP] = null;
                    }
                }
                this.entitySingleParticle = {};
            } else {
                for(var itemSinglePar in this.entitySingleParticle) {
                    if(listSingleParticleID.indexOf(itemSinglePar) < 0 && this.entitySingleParticle[itemSinglePar]) {
                        if(this.entitySingleParticle[itemSinglePar].entitySP != null) {
                            this.entitySingleParticle[itemSinglePar].entitySP.kill();
                            this.entitySingleParticle[itemSinglePar].entitySP = null;
                        }
                        this.entitySingleParticle[itemSinglePar].kill();
                        this.entitySingleParticle[itemSinglePar] = null;
                    }
                }
            }

            ig.game.sortEntitiesDeferred();
        },

        finishAllOverlay:function() {
            ig.game.consoleLog('continue dialog after overlay');
            // this.afterAnimation();
            // this.afterAnimation('du');
        },

        checkWalkingSpeed:function(durWalkIn, charWalk, speed) {
            var speedWalk;
            if(speed == null || speed == 0) {
                speedWalk = _DATAGAME.walkSpeed[2];
            } else {
                if(speed >= 6) {
                    speedWalk = _DATAGAME.walkSpeed[5] + ((speed - 5)*10);
                } else {
                    speedWalk = _DATAGAME.walkSpeed[speed];
                }
            }
            // ig.game.consoleLog(durWalkIn + " " + charWalk.defSpeedAnimWalk + " " + charWalk.speedAnimWalk);
            // if(speed != 2) {
                durWalkIn = charWalk.defSpeedAnimWalk / speedWalk * durWalkIn;
            // }

            if(durWalkIn >= this.maxDurWalkIn) {
                var speedWalk = durWalkIn / this.maxDurWalkIn * charWalk.defSpeedAnimWalk;
                if(speedWalk >= this.maxWalkingSpeed) { 
                    charWalk.speedAnimWalk = this.maxWalkingSpeed;
                    durWalkIn = charWalk.defSpeedAnimWalk / charWalk.speedAnimWalk * durWalkIn;
                } else {
                    charWalk.speedAnimWalk = speedWalk;
                    durWalkIn = this.maxDurWalkIn;
                }
            } else {
                charWalk.speedAnimWalk = speedWalk;
            }
            // ig.game.consoleLog(speedWalk + " " +  this.maxDurWalkIn);
            if(this.longestDurWalkIn < durWalkIn) this.longestDurWalkIn = durWalkIn;

            return durWalkIn;
        },

        onFreezeFrameComplete:function() {
            this.checkChatBubble();
        }, 

        afterAnimation:function(stat) {
            if(_STRINGS["Chapter" + this.numChapter][this.numChat].text == null || _STRINGS["Chapter" + this.numChapter][this.numChat].text == "") {
                if(stat =='du' || (_STRINGS["Chapter" + this.numChapter][this.numChat].text_delay != null && _STRINGS["Chapter" + this.numChapter][this.numChat].text_delay > 0)) {
                    this.loadBubbleChat(); 
                } else {
                    this.isBubbleOption = false;
                    var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
                    // this.checkScriptVariable(storyNow);
                    this.playAnimCharStory(storyNow);
                    this.checkChatBubble();
                }
            } else {
               this.loadBubbleChat(); 
           }
        },

        reposOption:function() {
            if(this.optionType == 'du') {
                this.buttons.btnOption1.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW/2 - this.buttons.btnOption1.halfSize.x - 200*_DATAGAME.ratioRes,
                    y: -ig.game.screen.y + ig.sizeHandler.minH - 400*_DATAGAME.ratioRes
                };

                this.buttons.btnOption2.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW/2 - this.buttons.btnOption2.halfSize.x + 200*_DATAGAME.ratioRes,
                    y: -ig.game.screen.y + ig.sizeHandler.minH - 400*_DATAGAME.ratioRes
                };

                this.buttons.btnOption3.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW/2,
                    y: -ig.game.screen.y + ig.sizeHandler.minH
                };
            } else {
                var heightBub = this.getBubbleHeight();
                var offsetFromScript = this.bubbleScriptOffsetY;
                if(heightBub <= 94*_DATAGAME.ratioRes) { heightBub = 104*_DATAGAME.ratioRes; }

                if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') {
                    heightBub = 0;
                    offsetFromScript = 0;
                }

                this.buttons.btnOption1.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW/2 - this.buttons.btnOption1.halfSize.x - this.buttons.btnOption1.posX,
                    y: -ig.game.screen.y + ig.sizeHandler.minH/2 + heightBub + 50*_DATAGAME.ratioRes + this.offsetBubble.y + this.plusYBubble + offsetFromScript
                };

                this.buttons.btnOption2.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW/2 - this.buttons.btnOption2.halfSize.x - this.buttons.btnOption2.posX,
                    y: -ig.game.screen.y + ig.sizeHandler.minH/2 + heightBub + 50*_DATAGAME.ratioRes + 140*_DATAGAME.ratioRes + this.offsetBubble.y + this.plusYBubble + offsetFromScript
                };

                this.buttons.btnOption3.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW/2 - this.buttons.btnOption3.halfSize.x - this.buttons.btnOption3.posX,
                    y: -ig.game.screen.y + ig.sizeHandler.minH/2 + heightBub + 50*_DATAGAME.ratioRes + 280*_DATAGAME.ratioRes + this.offsetBubble.y + this.plusYBubble + offsetFromScript
                };
            }
        },

        repos:function() {
            this.reposOption();  	

            if(this.sptCharDU1 != null) {
                this.sptCharDU1.spriter.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW / 2 + this.posXIn.left, 
                    y: -ig.game.screen.y + ig.sizeHandler.minH / 2 + this.offsetDefChar[0].y
                };
            }

            if(this.sptCharDU2 != null) {
                this.sptCharDU2.spriter.pos = {
                    x: -ig.game.screen.x + ig.sizeHandler.minW / 2 + this.posXIn.right, 
                    y: -ig.game.screen.y + ig.sizeHandler.minH / 2 + this.offsetDefChar[0].y
                };
            }

            if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle' && this.chatBubble != null) {
                this.calculatePosBubble();
            }
        },

        setBubbleWidth:function() {
            var _bubbleWidth = 0;

            var _paddingX= (_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') ? _DATAGAME.dialogBox.padding.x*_DATAGAME.ratioRes*2 : 0;

            if(ig.system.width >= ig.sizeHandler.minW *1.5){
                _bubbleWidth = (ig.system.width * 0.7) -_paddingX;
            } else {
                _bubbleWidth = (ig.sizeHandler.minW * 0.95) - _paddingX;
            }
            return _bubbleWidth;
        },

        calculatePosBubble:function(boolFirst) {
            var bubbleWidth = this.setBubbleWidth();
            this.bubbleConfigs.position.x = ig.sizeHandler.minW/2 + (bubbleWidth * 0.5 / 2) - (bubbleWidth * (1-0.5) / 2) - (4*_DATAGAME.ratioRes);
            // this.bubbleConfigs.position.y = ig.game.screen.y + ig.system.height - this.chatBubble._chatBubbleCanvas.height;
            this.bubbleConfigs.bubbleWidth = bubbleWidth;

            if(this.chatBubble != null) {
                this.chatBubble._chatBubbleCanvasConfigs.bubbleConfigs.box.width = this.bubbleConfigs.bubbleWidth;
                this.chatBubble._chatBubbleCanvasConfigs.textConfigs.fullText = ig.game.wordWrapForChatBubble(this.fullSentence, this.bubbleConfigs.bubbleWidth, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true);

                this.textTrack = ig.game.wordWrapForChatBubble(this.text, (this.isNarration) ? this.bubbleConfigs.narrationWidth : this.bubbleConfigs.bubbleWidth, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true);
                this.chatBubble._chatBubbleCanvasConfigs.textConfigs.text = this.textTrack;

                // var plusY = 0;
                // if(boolFirst == true) plusY = this.bubbleConfigs.fontSizeName+10*_DATAGAME.ratioRes;

                // this.chatBubble._chatBubbleCanvas.height += plusY;
                this.bubbleConfigs.position.y = ig.game.screen.y + ig.system.height - (this.chatBubble._chatBubbleCanvas.height) + this.bubbleScriptOffsetY;

                this.chatBubble.parentPos = {
                    x:this.bubbleConfigs.position.x,
                    y:this.bubbleConfigs.position.y
                };

                this.chatBubble.repos();
            }
        },

        ready: function() {
            
        },

        calculatePosChar:function(numChar) {
            this.posDefChar[numChar] = {
                x : -ig.game.screen.x + ig.sizeHandler.minW / 2 + this.offsetDefChar[numChar].x,
                y : -ig.game.screen.y + ig.sizeHandler.minH / 2 + this.offsetDefChar[numChar].y
            };

            var distX = (this.posDefChar[numChar].x + this.posXBG) - (-ig.game.screen.x + ig.sizeHandler.minW * this.bg.pntX);

            // var distY = (this.posDefChar[numChar].y + this.posYBG) - (-ig.game.screen.y + ig.sizeHandler.minH * this.bg.pntY);

            // var widthY = (ig.system.height * this.bg.pntY);
            // var posScaleY = widthY;

            // if(ig.sizeHandler.isPortrait && this.bg.isImage) {
            //     widthY = this.bg.cvsBG.height * this.bg.pntY;
            //     posScaleY = -ig.game.screen.y + widthY;
            // }

            // var distY = (this.posDefChar[numChar].y + this.posYBG) - posScaleY;

            var heightBG = (1280*_DATAGAME.ratioRes); //(this.bg.isImage) ? this.bg.cvsBG.height : 
            var widthY = heightBG * this.bg.pntY;
            var ratioY = widthY / heightBG;

            var posBGY = (heightBG * (this.zoomBG - 1)) * ratioY;

            var _tempPosYBG = this.posYBG;
            if(this.bg.isVertical) _tempPosYBG = this.posYBG*this.zoomBG;

            this['sptChar' + numChar].spriter.pos = {
                x: -ig.game.screen.x + ig.sizeHandler.minW * this.bg.pntX + distX * this.zoomBG,
                // y: -ig.game.screen.y + ig.sizeHandler.minH * this.bg.pntY + distY * this.zoomBG
                y: -ig.game.screen.y + _tempPosYBG - posBGY + ((this.posDefChar[numChar].y - (-ig.game.screen.y)) * this.zoomBG) //+ this.bg.offetYBG
            };
            
            this['sptChar' + numChar].spriter.scale.x = this['sptChar' + numChar].defScale.x * this.zoomBG;
            this['sptChar' + numChar].spriter.scale.y = this['sptChar' + numChar].defScale.y * this.zoomBG;
        },

        // reposCoba:function() {
        //     this.posDefCobaChar = {
        //         x : -ig.game.screen.x + ig.sizeHandler.minW / 2,
        //         y : -ig.game.screen.y + ig.sizeHandler.minH / 2 + 500
        //     };

        //     var distX = (this.posDefCobaChar.x + this.posXBG) - (-ig.game.screen.x + ig.sizeHandler.minW * this.bg.pntX);

        //     var widthY = (ig.system.height * this.bg.pntY);
        //     var posScaleY = widthY;

        //     if(ig.sizeHandler.isPortrait) {
        //         widthY = this.bg.cvsBG.height * this.bg.pntY;
        //         posScaleY = -ig.game.screen.y + widthY;
        //     }

        //     var distY = (this.posDefCobaChar.y + this.posYBG) - posScaleY;

        //     this.cobaChar.spriter.pos = {
        //         x: -ig.game.screen.x + ig.sizeHandler.minW * this.bg.pntX + distX * this.zoomBG,
        //         y: posScaleY + distY * this.zoomBG
        //     };
            
        //     this.cobaChar.spriter.scale.x = this.cobaChar.defScale.x * this.zoomBG;
        //     this.cobaChar.spriter.scale.y = this.cobaChar.defScale.y * this.zoomBG;
        // },

        // clicked:function() {
        //     ig.game.consoleLog('stage clicked');
        // },

        // /* OVERRIDE DEFAULT METHOD */
        // underPointer: function () {
        //     var p = ig.game.io.getClickPos();
        //     return this.containPoint(p);
        // },

        checkOption:function() {
            if(this.isOption) {
                var storyNow = _STRINGS["Chapter" + this.numChapter][this.numChat];
                this.totalOption = 0;
                for(var noOp=1; noOp <=storyNow.option.length-1; noOp++){
                    this.buttons['btnOption' + noOp].showOption(true);
                    this.totalOption++;
                }
                if(_DATAGAME.enableCurrency) {
                    this.entityGame.uiCurrency.isShop = _DATAGAME.enableShop;
                    this.entityGame.uiCurrency.showUI(true);
                    this.entityGame.uiCurrency.repos();
                }
            }
        },

        getBubbleHeight:function() {
            var heightBubble = 0;
            if(this.chatBubble) {
                heightBubble = this.chatBubble._chatBubbleCanvasConfigs.bubbleConfigs.contentArea.h;
            }
            console.log("heightbubble",heightBubble);
            return heightBubble;
        },

        startWindow:function() {
            if(this.isStartDialog == false) {
                this.isStartDialog = true;
                this.checkChatBubble();
            }
            this.canClickStage = true;
        },

        checkClickStagePos:function() {
            if(ig.game.io.getClickPos().x >= ig.system.width - this.buttons.btnSetting.size.x - 25 && ig.game.io.getClickPos().y <= this.buttons.btnSetting.size.y + 25) {
                return false;
            } else {
                return true;
            }
        },

        checkFowardDialog: function () {
            var isClicked = false;
            if (ig.input.pressed('SPACE')) {
                isClicked = true;
            } else if (ig.input.pressed('ENTER')) {
                isClicked = true;
            } 

            return isClicked;
        },

        delayClickButton:function() {
            if(this.tweenDelayClick != null) this.tweenDelayClick.stop();

            this.isClickButton = true;
            this.durDelayClick = 0;

            this.tweenDelayClick = this.tween({
                durDelayClick:1
            }, 0.5, {
                easing : ig.Tween.Easing.Linear.EaseNone,
                onComplete:function() {
                    this.isClickButton = false;
                }.bind(this)
            }).start();
        },

        update:function(){
            this.parent();

            // if(this.chatBubble != null) console.log(this.chatBubble._chatBubbleCanvas.height);

            this.checkButtonInput();

            if(this.boolZoomPanCamera) {
                this.bg.pntX = this.anchorBGX;
                this.bg.pntY = this.anchorBGY;
            }


            for(var i=0;i<this.arrChar.length;i++) {
                if(this['sptChar' + i] != null) this.calculatePosChar(i);
            }

            // if(this.cobaChar != null) this.reposCoba();

            if(this.isBubble && this.canClickStage && !ig.game.isPauseSetting && !ig.game.isClickClose && !this.isClickButton) {
                if(this.loadSentence) {
                    this.counterWord++;
                    if(this.counterWord % this.modWord == 0) {
                        this.trackWord();
                    }

                    if ((ig.input.released('click') || this.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL) {//!ig.game.autoDialog
                        this.loadSentence = false; this.stopSFXText();
                        this.currentWord = 0; this.counterWord = 0;
                        this.textTrack = ig.game.wordWrapForChatBubble(this.fullSentence, (this.isNarration) ? this.bubbleConfigs.narrationWidth : this.bubbleConfigs.bubbleWidth, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true);
                        this.chatBubble._chatBubbleCanvasConfigs.textConfigs.text = this.textTrack;
                        this.checkOption();
                    }
                } else {
                    if(ig.game.dialogAutoStatus != ig.game.STAT_DIALOG_NORMAL) {//ig.game.autoDialog
                        if(!this.isOption && this.timerAutoDialog != null && this.timerAutoDialog.delta() > 0){
                            this.timerAutoDialog.set(ig.game.delayDialog);
                            this.timerAutoDialog.reset();
                            this.timerAutoDialog.pause();
                            this.text = '';
                            this.isBubble = false;
                            this.chatBubble.chatBubbleAliveTime = 0.1;
                        }
                    } else {
                        if (!this.isOption && (ig.input.released('click') || this.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL) {//!ig.game.autoDialog
                            this.text = '';
                            this.isBubble = false;
                            this.chatBubble.chatBubbleAliveTime = 0.1;
                        }
                    }

                    if(this.isOption) {
                        this.checkKeyboardOption();
                    }
                }
            }

            // console.log(this.canClickStage + ' ' + this.isClickButton);
            // if(this.canClickStage == true && this.isClickButton == true) {
            //     this.isClickButton = false;
            // }

            if(this.isAnimChar) {
                for(var ti=0;ti<this.totalAllChar;ti++) {
                    if(this.isVisibleChar[ti]){
                        this['sptChar' + ti].spriter.root.alpha = this.alphaChar;
                    }
                }
            }

            if(this.isAnimDU) {
                this.sptCharDU1.spriter.root.alpha = this.alphaDU;
                this.sptCharDU2.spriter.root.alpha = this.alphaDU;
            }
        },

        draw:function(){
            this.parent();

            var c = ig.system.context;

            if((ig.game.sessionData.isFlashback[this.numChapter] && !this.isDelayFlashback) || 
                (!ig.game.sessionData.isFlashback[this.numChapter] && this.isDelayFlashback)) {
                this.entityGame.flashback.show();
            } else {
                this.entityGame.flashback.hide();
            }
        }
    });

    EntityGrid = ig.Entity.extend({
        zIndex:90000,

        init:function(x, y, settings) {
            this.parent(x,y,settings);

            this.gridCanvas = document.createElement('canvas');
            this.gridCanvas.width = 1080;
            this.gridCanvas.height = 1920;
            this.gridCtx = this.gridCanvas.getContext('2d', { alpha: true });

            this.gridCanvas.style.position = 'absolute';   // must be positioned
            this.gridCanvas.style.left = '0px';
            this.gridCanvas.style.top = '0px';
            this.gridCanvas.style.zIndex = 9999;

            this.gridCtx.strokeStyle = 'white';
            this.gridCtx.lineWidth = 10;
            this.gridCtx.strokeRect(0, 0, 1080, 1920);

            this.gridCtx.strokeStyle = 'red';
            this.gridCtx.lineWidth = 5;
            this.gridCtx.strokeRect(0, 0, 1080, 1920);
        },

        draw:function(){
            this.parent();

            var c = ig.system.context;

            c.save();
            c.drawImage(this.gridCanvas, -ig.game.screen.x, -ig.game.screen.y);
            c.restore();
        }
    });
});