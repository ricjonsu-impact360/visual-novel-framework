ig.module('game.entities.object.char')
.requires(
	'impact.entity',
	'plugins.spriter.spriter-display',
    'plugins.spriter.scml'
)
.defines(function() {
    SpriterChar = ig.Entity.extend({
        zIndex: _DATAGAME.zIndexData.character,
        boolStart: false,
        boolLoop: false,
        animationName:'',
        _keyIndex:-1,
        loopCount:0,
        arrPose:[2, 3, 4, 5, 6, 7, 8],
        arrDance:[1, 2, 3],
        totalLoop:1,
        numMouth:1,
        statMouth:'open',
        emotionNow:0,
        poseNow:'idle',
        durTimerTalking:0.1,
        defSpeedAnimWalk:150,
        speedAnimWalk:150,
        isFrown:false,
        isMouthDefault:true, 
        isHaveEmotion:true,
        talkingMouthType:_DATAGAME.TALKING_NORMAL,
        isRear:false,
        noChar:0,

        timePausePose: [0,1200,900,1100,1100,0,900,0,0,0,0,1200,0,900,900,1500,1500,1200,900,1500,1000,1400,1400,5300,0,0,1200,700,1200,1400,1400,5300,700,0,1400,0,800,1400,900,1500,1500,1300,0,0,0,0,0,0,0,1200,0,1200,1300,1200,0,0,0,0,0,0,0,0,0,0,0,0,1190,900,0,1600,0,1790,1000,1150,0,0,0,1400,0,0,900,0,2580,1800,1800,1400,1600,1800,0,0,0,900,900,0,0,0,0,0,0,0,0,0,0,1600,1600,0,0,0,0,0,0,0,0,1000,1000,700,700,0,0,0,0,0,800,1150,1200,1500,0,0,0,1000,1000,0,1000,800,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1300,1300,1300,1300,1300,0,1200,0,1200,700,0,0,0,2000,0,1500,0,0,0,900,0,900,1000,1000,1000,1600,600,600,1350,1300,600,0,0],

        boolStartTalking:false,
        boolLoopTalking:false,
        boolPauseTalking:false,
        boolFinishTalking:false,
        timerTalking:null, 

        isTalking:false,
        isWalkInAndOut:false,

        defScale:{x:1, y:1},

        spriter: null,
        scmlSprite: null,

        charName:'',

        radShadow : 146,
        hScaleShadow:36,
        offsetShadowY:-66,
        offsetShadowX:0,
        isShadow:true,

        flipState:1,

        animSpeed:100,

        boolContinueIdle:false,
        lastPoseBeforeIdle:'ANIM_IDLE',
        
        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.durTimerTalking = ig.game.mouthTalkingSpeed;

            // this.durTimerTalking = 0.1;

            this.poseNow = 'ANIM_IDLE';
            this.emotionNow = _DATAGAME.listEmotion.indexOf("EMO_NEUTRAL");
        },

        changeScale:function(scl, flip) {
            if(scl == null || scl <= 0) scl = 1;

            this.defScale.x = (scl) * flip;
            this.defScale.y = (scl);

            this.flipState = flip;
        },

        changePoseDefault:function(poseName) {
            this.spriter.entityName = 'du';

            this.spriter.setAnimationSpeedPercent(this.animSpeed);
            this.spriter.setAnimationByName(this.poseNow);
            
            if(ig.game.windowName == 'photoshoot') {
                this._parent.playPose = true;
            }

        },

        removeHandheld:function(idxPose) { 
            if(idxPose >= 0) {
                var duTheme = this.charName.toLowerCase();
                duTheme = duTheme.replaceAll(" ", "");   
                if(this.mainFolder == 'girl' && this.charName == 'amy') {
                    duTheme = ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now;
                    duTheme = duTheme.toLowerCase().replaceAll(" ", "");
                } 

                for(var idxF=0; idxF<_handPart[idxPose]['front' + this.mainFolder].length;idxF++){
                    this.spriter.detachImage(_handPart[idxPose]['front' + this.mainFolder][idxF] + '.png');

                    var newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + "/" + _handPart[idxPose]['front' + this.mainFolder][idxF] + '.png');
                    this.spriter.attachImage(_handPart[idxPose]['front' + this.mainFolder][idxF] + '.png', newPart, 0, 0, true);
                }

                for(var idxB=0; idxB<_handPart[idxPose]['back' + this.mainFolder].length;idxB++){
                    this.spriter.detachImage(_handPart[idxPose]['back' + this.mainFolder][idxB] + '.png');

                    var newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + "/" + _handPart[idxPose]['back' + this.mainFolder][idxB] + '.png');
                    this.spriter.attachImage(_handPart[idxPose]['back' + this.mainFolder][idxB] + '.png', newPart, 0, 0, true);
                }
            }
        },

        addHandheld:function(idxPose, handheld, folderName, isAnimRear) {
            // console.log('index pose after : ' + idxPose + " " + handheld + " " + this.mainFolder);

            var imgObject = new ig.Image(_BASEPATH.object + handheld + '.png');

            var duTheme = this.charName.toLowerCase();
            duTheme = duTheme.replaceAll(" ", "");   
            if(this.mainFolder == 'girl' && this.charName == 'amy') {
                duTheme = ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now;
                duTheme = duTheme.toLowerCase().replaceAll(" ", "");
            } 

            var imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-hold' + ((isAnimRear) ? '-rear':'') + '.png');
            var angle = 0;
            var offsetPos = {x:0, y:0};

            switch(_DATAGAME.pose[idxPose]) {
                case 'ANIM_CAMERA_FILMING' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-front2.png');
                    angle = (this.mainFolder == 'girl') ? -50 : -40;
                    offsetPos = (this.mainFolder == 'girl') ? {x:10, y:-30} : {x:10, y:-30};
                    break;
                case 'ANIM_RIFLE_HOLD_PRONE_IDLE' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? 31 : 35;
                    offsetPos = (this.mainFolder == 'girl') ? {x:-10, y:-10} : {x:-10, y:10};
                    break;
                case 'ANIM_RIFLE_HOLD_CROUCH_IDLE' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? 9 : 10;
                    offsetPos = (this.mainFolder == 'girl') ? {x:-20, y:10} : {x:-10, y:10};
                    break;
                case 'ANIM_RIFLE_HOLD_ONE_HANDED' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? 17 : 20;
                    offsetPos = (this.mainFolder == 'girl') ? {x:-10, y:0} : {x:0, y:10};
                    break;
                case 'ANIM_RIFLE_HOLD_SIDEWAYS_IDLE' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? 12 : 10;
                    offsetPos = (this.mainFolder == 'girl') ? {x:-10, y:0} : {x:-10, y:10};
                    break;
                case 'ANIM_RIFLE_HOLD_NORMAL_IDLE' :
                case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_5_SHOTS_CONSTANT' :
                case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_5_SHOTS_RANDOM' :
                case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_NORMAL_SINGLE_CONSTANT' :
                case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_BIG' :
                case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_NOODLE_HANDS' :
                case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_SMALL' :
                case 'ANIM_RIFLE_HOLD_NORMAL_WALK_STEALTH_POINT_DOWNWARDS' :
                case 'ANIM_RIFLE_HOLD_NORMAL_WALK_STEALTH_POINT_HORIZONTAL' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? -5 : 10;
                    offsetPos = (this.mainFolder == 'girl') ? {x:-10, y:10} : {x:-10, y:10};
                    break;
                case 'ANIM_RIFLE_HOLD_INACCURATE_MID_IDLE' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? 45 : 48;
                    offsetPos = (this.mainFolder == 'girl') ? {x:10, y:-30} : {x:-10, y:10};
                    break;
                case 'ANIM_RIFLE_HOLD_INACCURATE_UP_IDLE' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = (this.mainFolder == 'girl') ? 50 : 50;
                    offsetPos = (this.mainFolder == 'girl') ? {x:10, y:-30} : {x:-10, y:10};
                    break;
                case 'ANIM_DEFEND_HOLD_OBJECT' :
                    imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_hand-close-front.png');
                    angle = 22;
                    break;
                case 'ANIM_STAB_ON_KNEES' :
                    angle = -68;
                    break;
            }

            var plusY = 0;
            if(this.mainFolder == 'boy') plusY = 7*_DATAGAME.ratioRes;

            for(var idxF=0; idxF<_handPart[idxPose]['front' + this.mainFolder].length;idxF++){
                // var imgHand = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder] + '/' + _handPart[idxPose].front[idxF] + '.png');
                this.spriter.attachImage(_handPart[idxPose]['front' + this.mainFolder][idxF] + '.png', imgObject, _DATAGAME.objectHandheld[handheld].x, _DATAGAME.objectHandheld[handheld].y + plusY, true, imgHand, angle, plusY, offsetPos);
            }
        },

        changePose:function(poseName, handheld, shadow, animSpeed, tint, _isWalkInOrOut) {
            // console.log(this.charName + ' ' + poseName);
            this.spriter.entityName = 'du';

            this.spriter.tint = tint;

            this.isWalkInAndOut = (_isWalkInOrOut == null) ? false : _isWalkInOrOut;

            var _isUseAnimSpeed = true;
            if(animSpeed == null || animSpeed <= 0) _isUseAnimSpeed = false;

            this.animSpeed = (animSpeed == null || animSpeed <= 0) ? 100 : animSpeed;

            this.spriter.setAnimationSpeedPercent(this.animSpeed); 

            var oldPose = this.poseNow;
            this.lastPoseBeforeIdle = oldPose;

            if(poseName != 'ANIM_IDLE' && poseName != 'ANIM_IDLE_REAR') {
                this.boolContinueIdle = false;
            }

            if(this.boolContinueIdle == false) {
                if(this.poseNow != poseName) {
                    this.poseNow = poseName;
                    if((this.poseNow == 'ANIM_IDLE' && this.spriter.pause) || 
                        (this.poseNow == 'ANIM_IDLE_REAR' && this.spriter.pause)) {
                        this.boolPauseTalking = false;
                        this.spriter.pause = false;
                        this.boolFinishTalking = true;
                        this.boolContinueIdle = true;
                        this.checkMouthDefault(this.lastPoseBeforeIdle);
                    } else {
                        this.boolPauseTalking = false;
                        this.boolStart = false;
                        this.loopCount = 0;
                        this.boolLoop = false;
                        this.spriter.pause = false;

                        // if(this.poseNow == 'ANIM_WALK' || this.poseNow == 'ANIM_WALK_REAR' || this.poseNow == 'ANIM_RUN' || this.poseNow == 'ANIM_RUN_REAR') { 
                        if(this.isWalkInAndOut) { 
                            // console.log('aaaa ' + _isUseAnimSpeed + ' ' + this.speedAnimWalk);
                            if(_isUseAnimSpeed) this.speedAnimWalk = this.animSpeed;
                            this.spriter.setAnimationSpeedPercent(this.speedAnimWalk); 
                        }
                        this.spriter.setAnimationByName(this.poseNow);
                    }             
                } 
            

                if(this.charName =='amy') {
                    this.changeDU(ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now);
                } else {
                    this.changeDU(this.charName);
                }

                if(this.boolContinueIdle) {
                    if(handheld != null && handheld != "") { 
                        var isAnimRearC = (_DATAGAME.listRearAnim.indexOf(oldPose) >= 0) ? true:false;

                        this.addHandheld(_DATAGAME.pose.indexOf(oldPose), handheld, (this.charName =='amy') ? ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now : this.charName, isAnimRearC);
                    }
                } else {
                    this.removeHandheld(_DATAGAME.pose.indexOf(oldPose));

                    if(handheld != null && handheld != "") {
                        var isAnimRear = (_DATAGAME.listRearAnim.indexOf(this.poseNow) >= 0) ? true:false;

                        this.addHandheld(_DATAGAME.pose.indexOf(this.poseNow), handheld, (this.charName =='amy') ? ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now : this.charName, isAnimRear);
                    }
                }            

                if(ig.game.windowName == 'photoshoot') {
                    this._parent.playPose = true;
                }

                this.checkShadow(shadow);
                this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
            }
        },

        checkMouthDefault:function(_poseToCheck) {
            if(_DATAGAME.frownEmo.indexOf(_poseToCheck) >= 0) {
                this.isMouthDefault = false;
            } else {
                this.isMouthDefault = true;
            }
        },

        checkShadow:function(shadow) {
            if(shadow == null) {
                this.isShadow = true;

                if(this.poseNow == 'ANIM_SWIM_REAR' || this.poseNow == 'ANIM_SWIM_LOW_REAR' || 
                    this.poseNow == 'ANIM_CLIMB_REAR' || this.poseNow == 'ANIM_LAY_IDLE' || 
                    this.poseNow == 'ANIM_LAY_SLEEP' || this.poseNow == 'ANIM_SIT_VEHICLE' ||
                    this.poseNow == 'ANIM_SIT_TYPING_GENTLE' || this.poseNow == 'ANIM_SIT_TYPING_GENTLE_REAR' ||
                    this.poseNow == 'ANIM_SIT_TYPING_FURIOUS' || this.poseNow == 'ANIM_SIT_TYPING_FURIOUS_REAR' ||
                    this.poseNow == 'ANIM_SIT_TYPING_IDLE' || this.poseNow == 'ANIM_SIT_TYPING_IDLE_REAR' ||
                    this.poseNow == 'ANIM_SIT_TYPING_REST' || this.poseNow == 'ANIM_SIT_TYPING_REST_REAR' ||
                    this.poseNow == 'ANIM_PIANO_FINGER_REAR' || this.poseNow == 'ANIM_PIANO_ENTHUSIASTIC_REAR' || 
                    this.poseNow == 'ANIM_PIANO_ENTHUSIASTIC2_REAR' || this.poseNow == 'ANIM_PIANO_GENTLE_REAR' || 
                    this.poseNow == 'ANIM_PIANO_FINGER' || this.poseNow == 'ANIM_PIANO_ENTHUSIASTIC' || 
                    this.poseNow == 'ANIM_PIANO_ENTHUSIASTIC2' || this.poseNow == 'ANIM_PIANO_GENTLE'
                ){ // || this.poseNow == 'ANIM_MEDITATE_FLOATING' || this.poseNow == 'ANIM_CRAWL_REAR'
                    this.isShadow = false;
                }
            } else if(shadow == true || shadow == false) {
                this.isShadow = shadow;
            } 
        },

        checkAnimation:function() {
            // console.log(this.spriter.keyIndex);
             if(this.spriter.keyIndex === 0){
                if(!this.boolStart){
                    this.boolStart = true;
                    if(this.isTalking) {
                        this.checkTalking();
                    }
                } else {
                    if(this.spriter.animation.loopType === SpriterAnimationLooping.LOOPING){
                        if(!this.boolLoop){
                            this.boolLoop = true;
                            if(this.loopCount > 0){
                                //IDLE BLINK
                                if(this.spriter.animation.name == 'idle-blink') {
                                    this.spriter.entityName = 'du';
                                    this.poseNow = 'ANIM_IDLE';
                                    this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                    this.spriter.setAnimationByName('ANIM_IDLE');
                                    this.boolContinueIdle = false;
                                    this.checkMouthDefault(this.poseNow);

                                    this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                }
                                //IDLE
                                else if(this.spriter.animation.name == 'ANIM_IDLE') {
                                    this.spriter.entityName = 'du';
                                    // if(this.charName == 'amy') {
                                        // if(this.emotionNow != _DATAGAME.listEmotion.indexOf("EMO_HAPPY")) {
                                        //     this.poseNow = 'idle-blink';
                                        //     this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                        //     this.spriter.setAnimationByName('idle-blink');
                                        // } else {
                                            // this.poseNow = 'ANIM_IDLE';
                                            // this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                            // this.spriter.setAnimationByName('ANIM_IDLE');

                                            // this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                        // }
                                    // } else {
                                        this.poseNow = 'ANIM_IDLE';
                                        this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                        this.spriter.setAnimationByName('ANIM_IDLE');
                                        this.boolContinueIdle = false;
                                        this.checkMouthDefault(this.poseNow);

                                        this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                    // }
                                }
                                else if(this.spriter.animation.name == 'ANIM_IDLE_REAR') {
                                    this.spriter.entityName = 'du';
                                    this.poseNow = 'ANIM_IDLE_REAR';
                                    this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                    this.spriter.setAnimationByName('ANIM_IDLE_REAR');
                                    this.boolContinueIdle = false;
                                    this.checkMouthDefault(this.poseNow);

                                    this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                }
                                //WALKING
                                else if(this.spriter.animation.name == 'ANIM_WALK') {
                                    this.spriter.entityName = 'du';
                                    this.poseNow = 'ANIM_WALK';
                                    this.spriter.setAnimationSpeedPercent(this.speedAnimWalk);
                                    this.spriter.setAnimationByName('ANIM_WALK');
                                }
                                else if(this.spriter.animation.name == 'ANIM_WALK_REAR') {
                                    this.spriter.entityName = 'du';
                                    this.poseNow = 'ANIM_WALK_REAR';
                                    this.spriter.setAnimationSpeedPercent(this.speedAnimWalk);
                                    this.spriter.setAnimationByName('ANIM_WALK_REAR');
                                }
                                //RUN
                                else if(this.spriter.animation.name == 'ANIM_RUN') {
                                    this.spriter.entityName = 'du';
                                    this.poseNow = 'ANIM_RUN';
                                    this.spriter.setAnimationSpeedPercent(this.speedAnimWalk);
                                    this.spriter.setAnimationByName('ANIM_RUN');
                                }
                                else if(this.spriter.animation.name == 'ANIM_RUN_REAR') {
                                    this.spriter.entityName = 'du';
                                    this.poseNow = 'ANIM_RUN_REAR';
                                    this.spriter.setAnimationSpeedPercent(this.speedAnimWalk);
                                    this.spriter.setAnimationByName('ANIM_RUN_REAR');
                                }
                                else {
                                    var _idxPose = _DATAGAME.pose.indexOf(this.spriter.animation.name);

                                    if(_DATAGAME.listRearAnim.indexOf(this.spriter.animation.name) < 0) {
                                        if(this.timePausePose[_idxPose] == 0) {
                                            this.spriter.entityName = 'du';
                                            this.poseNow = this.spriter.animation.name;
                                            this.spriter.setAnimationSpeedPercent((this.isWalkInAndOut) ? this.speedAnimWalk : this.animSpeed);
                                            this.spriter.setAnimationByName(this.spriter.animation.name);

                                            this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                        } else {
                                            this.spriter.entityName = 'du';
                                            this.poseNow = 'ANIM_IDLE';
                                            this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                            this.spriter.setAnimationByName('ANIM_IDLE');
                                            this.checkFinishPose();
                                            this.boolContinueIdle = false;
                                            this.checkMouthDefault(this.poseNow);

                                            this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                        }
                                    } else {
                                        if(this.timePausePose[_idxPose] == 0) {
                                            this.spriter.entityName = 'du';
                                            this.poseNow = this.spriter.animation.name;
                                            this.spriter.setAnimationSpeedPercent((this.isWalkInAndOut) ? this.speedAnimWalk : this.animSpeed);
                                            this.spriter.setAnimationByName(this.spriter.animation.name);

                                            this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                        } else {
                                            this.spriter.entityName = 'du';
                                            this.poseNow = 'ANIM_IDLE_REAR';
                                            this.spriter.setAnimationSpeedPercent(this.animSpeed);
                                            this.spriter.setAnimationByName('ANIM_IDLE_REAR');
                                            this.checkFinishPose();
                                            this.boolContinueIdle = false;
                                            this.checkMouthDefault(this.poseNow);

                                            this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
                                        }
                                    }
                                }
                            }

                            this.loopCount++;
                        }
                    }
                }   
            } else {
                if(this.spriter.animation.loopType === SpriterAnimationLooping.LOOPING){
                    this.boolLoop = false;
                }

                this.checkTalking();
                
            }
        },

        checkTalking:function() {
            var timeToTalk = 10;

            var _idxPose = _DATAGAME.pose.indexOf(this.spriter.animation.name);
            if(this.boolContinueIdle == true) _idxPose = _DATAGAME.pose.indexOf(this.lastPoseBeforeIdle);

            // if(_DATAGAME.listRearAnim.indexOf(this.spriter.animation.name) < 0) {
                if(this.timePausePose[_idxPose] == 0) {
                    if(this.spriter.time >= timeToTalk && !this.boolStartTalking && this.isTalking) {
                        this.counterTalking = 0;
                        this.timerTalking.set(this.durTimerTalking);
                        this.timerTalking.reset();
                        this.statMouth = 'open';
                        this.boolStartTalking = true;
                        this.boolLoopTalking = true;
                    }
                } else {
                    this.insideCheckTalking(_idxPose);
                }
            // }
        },

        insideCheckTalking:function(idxPose) {
            // console.log('aaa' + this.charName + this.poseNow);
            var timeToTalk = 10;

            if(this.spriter.time >= timeToTalk && !this.boolStartTalking && this.isTalking) { //500
                this.counterTalking = 0;
                this.timerTalking.set(this.durTimerTalking);
                this.timerTalking.reset();
                this.statMouth = 'open';
                this.boolStartTalking = true;
                this.boolLoopTalking = true;
            }

            if(this.spriter.time >= this.timePausePose[idxPose] && !this.boolPauseTalking) { // && this.isTalking
                if(this.poseNow == 'ANIM_IDLE' || this.poseNow == 'ANIM_IDLE_REAR') {
                    if(this.spriter.time >= this.timePausePose[idxPose] + timeToTalk && !this.boolStartTalking && this.isTalking) {
                        this.counterTalking = 0;
                        this.timerTalking.set(this.durTimerTalking);
                        this.timerTalking.reset();
                        this.statMouth = 'open';
                        this.boolStartTalking = true;
                        this.boolLoopTalking = true;
                    } 
                } else {
                    this.boolPauseTalking = true;
                    this.spriter.time = this.timePausePose[idxPose];
                    this.spriter.pause = true;
                }


            }
        },

        checkFinishPose:function() {
            
        },

        ready: function() {
            
        },

        changeEmotion:function(emotionType, isWalk) {  //console.log(this.durTimerTalking);
            this.emotionNow = emotionType;

            var duTheme = this.charName.toLowerCase();

            duTheme = duTheme.replaceAll(" ", "");     

            if(this.mainFolder == 'girl' && this.charName == 'amy') {
                duTheme = ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now;
                duTheme = duTheme.toLowerCase().replaceAll(" ", "");
            } 

            // console.log('emotion : ' + this.poseNow);

            // var eyePart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_eyes.png');

            var eyeSize = { x:120, y:81 };
            if(this.mainFolder == 'boy') eyeSize = { x:111, y:30 };

            var _emoName = 'emo_default';
            var dataAnim = _emoEye[_emoName.toUpperCase()];
            var animSheetEye = new ig.AnimationSheet(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + _emoName + '.png', eyeSize.x, eyeSize.y);
            var animEye = new ig.Animation(animSheetEye, dataAnim.frameTime, JSON.parse(dataAnim.sequence), dataAnim.stop); 
            animEye.tint = this.spriter.tint; animEye.alphaTint = 1;

            var browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow.png');
            var headPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_head.png');
            var hairPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['hair'] + '/0_head.png');
            var yBrow = 0;

            var isChangeEye = false;

            dataAnim = _emoEye[_DATAGAME.listEmotion[this.emotionNow]]; 

            this.talkingMouthType = _DATAGAME['TALKING_' + dataAnim.talkingType.toUpperCase()];

            if(this.isWalk==true) {
                this.changeMouthEmotion(isWalk);
            } else {
                this.changeMouthEmotion();
            }

            if(dataAnim.pngFile.toUpperCase() == "EMO_NEUTRAL") {

            } else {
                isChangeEye = true;
                _emoName = _emoEye[_DATAGAME.listEmotion[this.emotionNow]].pngFile;
                animSheetEye = new ig.AnimationSheet(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + _emoName + '.png', eyeSize.x, eyeSize.y);
                animEye = new ig.Animation(animSheetEye, dataAnim.frameTime, JSON.parse(dataAnim.sequence), dataAnim.stop);
            }

            if(this.isHaveEmotion) {
                switch(this.emotionNow) {
                    case _DATAGAME.listEmotion.indexOf("EMO_SHOCK") :
                    case _DATAGAME.listEmotion.indexOf("EMO_SURPRISED") :
                        yBrow = -3;
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_BLUSH") :
                        headPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_head-blush.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_IRRITABLE") :
                    case _DATAGAME.listEmotion.indexOf("EMO_PAIN") :
                    case _DATAGAME.listEmotion.indexOf("EMO_PAIN_EXTREME") :
                        isChangeEye = true;
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-angry.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_SOUR") :
                    case _DATAGAME.listEmotion.indexOf("EMO_SOUR_EXTREME") :
                        isChangeEye = true;
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-frown.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_HAPPY") :
                    case _DATAGAME.listEmotion.indexOf("EMO_LAUGH") :
                    case _DATAGAME.listEmotion.indexOf("EMO_EYE_CLOSED") :
                    case _DATAGAME.listEmotion.indexOf("EMO_EXORCISED") :
                        isChangeEye = true;
                        // eyePart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_eyes-happy.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_ANGRY") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_DISGUST") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_RAGE") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_RAGE_EXTREME") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_INSANE") : 
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-angry.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_SKEPTICAL") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_ANNOYING") : 
                        yBrow = -3;
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-skeptical.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_WINK") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_FLIRT") : 
                    case _DATAGAME.listEmotion.indexOf("EMO_FLIRT_CHEESY") : 
                        yBrow = -2;
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-wink.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_GRUDGE") : 
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-angry.png');
                        headPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_head-scary.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_SAD") :
                    case _DATAGAME.listEmotion.indexOf("EMO_SCARED") :
                    case _DATAGAME.listEmotion.indexOf("EMO_BITTERSWEET") :
                    case _DATAGAME.listEmotion.indexOf("EMO_AWKWARD") :
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-frown.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_HORRIFIED") :
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-frown.png');
                        headPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_head-scary.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_SNEAKY") : 
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-angry.png');
                        break;
                    case _DATAGAME.listEmotion.indexOf("EMO_SCARY") :
                    case _DATAGAME.listEmotion.indexOf("EMO_DISGUST_EXTREME") :
                        browPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_brow-casual-angry.png');
                        headPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['skin'] + '/0_head-scary.png');
                        break;
                }
            }

            // if(this.emotionNow != _DATAGAME.listEmotion.indexOf("EMO_HAPPY") || !this.isHaveEmotion) {
                if(this._parent.totalChar >= 2 || 
                (
                    this.poseNow == 'ANIM_RUN' || this.poseNow == 'ANIM_STUMBLE' || this.poseNow == 'ANIM_WALK'
                    || this.poseNow == 'ANIM_PIANO_FINGER' || this.poseNow == 'ANIM_PIANO_ENTHUSIASTIC' 
                    || this.poseNow == 'ANIM_PIANO_ENTHUSIASTIC2' || this.poseNow == 'ANIM_PIANO_GENTLE'
                    // || this.poseNow ==  || this.poseNow ==  || this.poseNow == 
                    // || this.poseNow ==  || this.poseNow ==  || this.poseNow == 
                )
                ) { // && isChangeEye == false
                    // eyePart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_eyes-casual-left.png');
                    if(isChangeEye == false) {
                        animSheetEye = new ig.AnimationSheet(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + dataAnim.pngFile + '.png', eyeSize.x, eyeSize.y);
                    }
                    
                    animEye = new ig.Animation(animSheetEye, dataAnim.frameTime, (dataAnim.sequence2 == null) ? JSON.parse(dataAnim.sequence) : JSON.parse(dataAnim.sequence2), dataAnim.stop);
                    // animEye = new ig.Animation(animSheetEye, 0.2, [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], false);
                    // animEye.tint = this.spriter.tint; animEye.alphaTint = 1;
                }
            // }
            animEye.tint = this.spriter.tint; animEye.alphaTint = 1;
            
            this.spriter.attachAnimation('0_eyes.png', animEye, 0, 0, true);
            // this.spriter.attachImage('0_eyes.png', eyePart, 0, 0, true);
            this.spriter.attachImage('0_brow.png', browPart, 0, yBrow, true);
            this.spriter.attachImage('0_head.png', headPart, 0, 0, true, hairPart);
        },

        changeEyeHappy:function() {
            if(
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_HAPPY") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_LAUGH") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_EYE_CLOSED") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_IRRITABLE") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_SOUR") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_SOUR_EXTREME") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_PAIN") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_PAIN_EXTREME") || 
                this.emotionNow == _DATAGAME.listEmotion.indexOf("EMO_EXORCISED")
            ) {
                var duTheme = this.charName.toLowerCase();

                duTheme = duTheme.replaceAll(" ", "");      

                if(this.mainFolder == 'girl' && this.charName == 'amy') {
                    duTheme = ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now;
                    duTheme = duTheme.toLowerCase().replaceAll(" ", "");
                } 

                var eyePart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_eyes.png');

                if(this._parent.totalChar >= 2) {
                    eyePart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_eyes-casual-left.png');
                }

                this.spriter.attachImage('0_eyes.png', eyePart, 0, 0, true);
            }            
        },

        checkLastMouth:function(duTheme) {
            var newPart = null;
            switch(this.emotionNow) {
                case _DATAGAME.listEmotion.indexOf("EMO_SHOCK") :
                case _DATAGAME.listEmotion.indexOf("EMO_DISGUST") :
                case _DATAGAME.listEmotion.indexOf("EMO_SCARED") :
                case _DATAGAME.listEmotion.indexOf("EMO_HORRIFIED") :
                case _DATAGAME.listEmotion.indexOf("EMO_EXORCISED") :
                case _DATAGAME.listEmotion.indexOf("EMO_RAGE_EXTREME") :
                case _DATAGAME.listEmotion.indexOf("EMO_SOUR_EXTREME") :
                case _DATAGAME.listEmotion.indexOf("EMO_PAIN_EXTREME") :
                    newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-shock.png');
                    break;
                case _DATAGAME.listEmotion.indexOf("EMO_HAPPY") :
                case _DATAGAME.listEmotion.indexOf("EMO_SNEAKY") :
                case _DATAGAME.listEmotion.indexOf("EMO_SCARY") :
                case _DATAGAME.listEmotion.indexOf("EMO_FLIRT") :
                case _DATAGAME.listEmotion.indexOf("EMO_AWKWARD") :
                case _DATAGAME.listEmotion.indexOf("EMO_INSANE") :
                    newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-happy.png');
                    break;
                case _DATAGAME.listEmotion.indexOf("EMO_LAUGH") :
                case _DATAGAME.listEmotion.indexOf("EMO_FLIRT_CHEESY") :
                    newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-laugh.png');
                    break;
                case _DATAGAME.listEmotion.indexOf("EMO_ANGRY") :
                case _DATAGAME.listEmotion.indexOf("EMO_SAD") :
                case _DATAGAME.listEmotion.indexOf("EMO_GRUDGE") :
                case _DATAGAME.listEmotion.indexOf("EMO_DISAPPOINTED") :
                case _DATAGAME.listEmotion.indexOf("EMO_SKEPTICAL") :
                case _DATAGAME.listEmotion.indexOf("EMO_SURPRISED") :
                case _DATAGAME.listEmotion.indexOf("EMO_IRRITABLE") :
                case _DATAGAME.listEmotion.indexOf("EMO_RAGE") :
                case _DATAGAME.listEmotion.indexOf("EMO_SOUR") :
                case _DATAGAME.listEmotion.indexOf("EMO_PAIN") :
                case _DATAGAME.listEmotion.indexOf("EMO_DISGUST_EXTREME") :
                    newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-frown.png');
                    break;
                case _DATAGAME.listEmotion.indexOf("EMO_ANNOYING") :
                    newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-wide.png');
                    break;    
            }
            return newPart;
        },

        changeMouthEmotion:function(isWalk) {
            var imgChange = (this.isMouthDefault) ? '0_mouth' : '0_mouth-frown';
            var namePart1 = '0_mouth';

            var duTheme = this.charName.toLowerCase();
            duTheme = duTheme.replaceAll(" ", "");

            if(this.isFrown) {
                namePart1 = '0_mouth-frown';
            }
            
            var newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + namePart1 + '.png');

            // if(!this.isFrown) {
            if(this.isHaveEmotion) {
               if(this.checkLastMouth(duTheme) != null) newPart = this.checkLastMouth(duTheme);
            }

            if(this.isWalk == true) {
                if(this.checkLastMouth(duTheme) != null) newPart = this.checkLastMouth(duTheme);
                // switch(this.emotionNow) {
                //     case _DATAGAME.listEmotion.indexOf("EMO_SHOCK") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_DISGUST") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SCARED") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_HORRIFIED") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_EXORCISED") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_RAGE_EXTREME") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SOUR_EXTREME") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_PAIN_EXTREME") :
                //        newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-shock.png');
                //         break;
                //     case _DATAGAME.listEmotion.indexOf("EMO_HAPPY") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SNEAKY") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SCARY") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_FLIRT") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_AWKWARD") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_INSANE") :
                //         newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-happy.png');
                //         break;
                //     case _DATAGAME.listEmotion.indexOf("EMO_LAUGH") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_FLIRT_CHEESY") :
                //         newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-laugh.png');
                //         break;
                //     case _DATAGAME.listEmotion.indexOf("EMO_ANGRY") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SAD") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_GRUDGE") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_DISAPPOINTED") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SKEPTICAL") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SURPRISED") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_IRRITABLE") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_RAGE") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_SOUR") :
                //     case _DATAGAME.listEmotion.indexOf("EMO_PAIN") :
                //         newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-frown.png');
                //         break;
                //     case _DATAGAME.listEmotion.indexOf("EMO_ANNOYING") :
                //         newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/0_mouth-wide.png');
                //         break;   
                // }
                
                imgChange = '0_mouth';
                this.spriter.attachImage(imgChange + '.png', newPart, 0, 0, true);
            } else {
                this.spriter.attachImage(imgChange + '.png', newPart, 0, 0, true);
            }
            
        },

        talkingAnimation:function() {
            var duTheme = this.charName;
            duTheme = duTheme.replaceAll(" ", ""); 
            
            var imgChange = (this.isMouthDefault) ? '0_mouth' : '0_mouth-frown';

            var namePart1 = '0_mouth';
            var namePart2 = '0_mouth-open1';
            var namePart3 = '0_mouth-open2';
            var namePart4 = '0_mouth-shock';

            if(this.isFrown) {
                namePart1 = '0_mouth-frown';
                namePart2 = '0_mouth-frown-open1';
                namePart3 = '0_mouth-frown-open2';
                namePart4 = '0_mouth-frown-shock';
            }

            if(this.talkingMouthType == _DATAGAME.TALKING_BIG) {
                namePart2 = '0_mouth-pursed';
                namePart3 = '0_mouth-wide';
            }

            var newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + namePart1 + '.png');

            if(this.statMouth == 'open') {
                this.numMouth++; 
                if(this.numMouth >= 4) { this.statMouth = 'close'; }
            } else {
                this.numMouth--;
                if(this.numMouth <= 1) { this.statMouth = 'open'; }
            }

            if(this.numMouth == 2) {
                newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + namePart2 + '.png');
            } else if(this.numMouth == 3) {
                newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + namePart3 + '.png');
            } else if(this.numMouth == 4) {
                newPart = new ig.Image(_BASEPATH.spriter + this.mainFolder + '/' + _DATAGAME.spriterData[duTheme][this.mainFolder]['face'] + '/' + namePart4 + '.png');
            }

            this.spriter.attachImage(imgChange + '.png', newPart, 0, 0, true);
        },

        update:function(){
            this.parent();

            // if(this.animationName != this.spriter.animation.name){
            //     this.resetStamps();
            // }

            this.checkAnimation();

            if(this.boolStartTalking && this.boolLoopTalking && this.isTalking && !ig.game.isPauseSetting) {
                // this.counterTalking += (ig.system.tick * 1000);
                
                if(this.timerTalking.delta() > 0){
                    this.timerTalking.set(this.durTimerTalking);
                    this.timerTalking.reset();
                    this.talkingAnimation();
                }

                // if(this.counterTalking >= 3000) {
                if(this._parent.isBubble && !this._parent.loadSentence) {
                    this.isTalking = false;
                    this.boolStartTalking = false;
                    this.boolLoopTalking = false;

                    //for resume animation
                    // this.boolPauseTalking = false;
                    // this.spriter.pause = false;
                    // this.boolFinishTalking = true;

                    // this.numMouth = 2;
                    this.statMouth = 'close';
                    this.changeEyeHappy();
                    this.changeMouthEmotion();
                    // this.talkingAnimation();
                }
            }
        },

        calculateShadow: function(idxAnim) {
            //based on 146 default on ratioRes 1

            var _animName = this.spriter.animation.name;

            this.radShadow = _DATAGAME.shadowWidth[idxAnim];
            this.hScaleShadow = 36 / this.radShadow;
            this.offsetShadowY = -66 * this.radShadow / 146;
            this.offsetShadowX = 0;

            if(_animName.substring(_animName.length - 4, _animName.length).toLowerCase() == 'rear') {
                var splitNameRear = _animName.split("_");
                
                var yNoClimb = (this.mainFolder == 'girl') ? -50 : 30;
                this.offsetShadowY = yNoClimb * this.radShadow / 146;

                if(_animName == 'ANIM_RUN_REAR') { 
                    this.offsetShadowX = 130;
                    this.offsetShadowY = 30 * this.radShadow / 146;
                }
                else if(_animName == 'ANIM_CRAWL_REAR') { 
                    this.offsetShadowX = (this.mainFolder == 'girl') ? 50 : 100;
                    this.offsetShadowY = -100 * this.radShadow / 146;
                }
                else if(splitNameRear.indexOf('SWIM') >= 0) {
                    this.offsetShadowX = 110;
                    this.offsetShadowY = -1100 * this.radShadow / 146;

                    if(splitNameRear.indexOf('LOW') >= 0) { 
                        this.offsetShadowY = 300 * this.radShadow / 146;
                    }
                }
                else if(splitNameRear.indexOf('CLIMB') < 0) { 
                    this.offsetShadowX = (this.mainFolder == 'girl') ? 130 : 100;

                    switch(_animName) {
                        case 'ANIM_PIANO_FINGER_REAR' :
                        case 'ANIM_PIANO_ENTHUSIASTIC_REAR' :
                        case 'ANIM_PIANO_ENTHUSIASTIC2_REAR' :
                        case 'ANIM_PIANO_GENTLE_REAR' :
                        case 'ANIM_SIT_TYPING_GENTLE_REAR' :
                        case 'ANIM_SIT_TYPING_FURIOUS_REAR' :
                        case 'ANIM_SIT_TYPING_IDLE_REAR' :
                        case 'ANIM_SIT_TYPING_REST_REAR' :
                            this.offsetShadowX = ((this.mainFolder == 'girl') ? 20 : 30) * this.radShadow / 146;
                            this.offsetShadowY = ((this.mainFolder == 'girl') ? 10 : 0) * this.radShadow / 146;
                            break;
                        case 'ANIM_IDLE_HANDS_DOWN_LEGS_WIDE_REAR' :
                            this.offsetShadowX = ((this.mainFolder == 'girl') ? 120 : 120) * this.radShadow / 146;
                            break;
                        case 'ANIM_KISS_BEND1_REAR' : 
                            this.offsetShadowX = ((this.mainFolder == 'girl') ? 20 : 0) * this.radShadow / 146;
                            break;
                        case 'ANIM_KISS_BEND2_REAR' : 
                            this.offsetShadowX = ((this.mainFolder == 'girl') ? 50 : 0) * this.radShadow / 146;
                            break;
                    }
                } 
            }
            else {
                switch(_animName) {
                    case 'ANIM_DANCEUP' :
                    case 'ANIM_DANCEHIP' :
                        this.offsetShadowX = -30;
                        break;
                    case 'ANIM_RUN' :
                        this.offsetShadowY =  -100 * this.radShadow / 146;
                        break;
                    case 'ANIM_FALL' :
                    case  'ANIM_FAINTED' :
                        this.offsetShadowX = -450;
                        this.offsetShadowY =  -30 * this.radShadow / 146;
                        break;
                    case 'ANIM_FLIRT' :
                        this.offsetShadowX = 20;
                        break;
                    case 'ANIM_JUMP' : 
                        this.offsetShadowY = 0 * this.radShadow / 146;
                        break;
                    case 'ANIM_LAY_IDLE' : 
                    case 'ANIM_LAY_SLEEP' : 
                        this.offsetShadowX = -370;
                        this.offsetShadowY = -1700 * this.radShadow / 146;
                        break;
                    case 'ANIM_LAY_IDLE_LOW' : 
                        this.offsetShadowX = -370;
                        this.offsetShadowY = -100 * this.radShadow / 146;
                        break;
                    case 'ANIM_LAY_STRUGGLE_WEAK' : 
                    case 'ANIM_LAY_STRUGGLE_HARD' : 
                        this.offsetShadowX = -280;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? -100 : -50) * this.radShadow / 146;
                        this.hScaleShadow = 36 / this.radShadow * 5/4;
                        break;
                    case 'ANIM_PUNCH' : 
                        this.offsetShadowX = 30;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? -600 : -550) * this.radShadow / 146;
                        break;
                    case 'ANIM_SIT' : 
                        this.offsetShadowX = -30;
                        break;
                    case 'ANIM_SQUAT' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : -50) * this.radShadow / 146;
                        break;
                    case 'ANIM_MEDITATE_IDLE' : 
                    case 'ANIM_MEDITATE_FLOATING' : 
                        if(this.mainFolder == 'girl') {
                            this.offsetShadowX = -30 * this.radShadow / 146;
                        } else {
                            this.radShadow = _DATAGAME.shadowWidth[idxAnim] * 1.2;
                            this.hScaleShadow = 36 / this.radShadow;
                            this.offsetShadowY = -66 * this.radShadow / 146;
                            this.offsetShadowX = 0;

                            this.offsetShadowX = -10 * this.radShadow / 146;
                        }
                        break;
                    case 'ANIM_KICK_PUSH' : 
                        this.offsetShadowY = -100 * this.radShadow / 146;
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : -30) * this.radShadow / 146;
                        break;
                    case 'ANIM_STRANGLED' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -30 : -30) * this.radShadow / 146;
                        break;
                    case 'ANIM_STRANGLER' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 20 : 20) * this.radShadow / 146;
                        this.offsetShadowY = -100 * this.radShadow / 146;
                        break;
                    case 'ANIM_SIDE_KICK' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : -30) * this.radShadow / 146;
                        break;
                    case 'ANIM_PUNCH_LUNGE' : 
                    case 'ANIM_PUNCH_LUNGE_SINGLE' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -60 : -60) * this.radShadow / 146;
                        this.offsetShadowY = -20 * this.radShadow / 146;
                        break;
                    case 'ANIM_EXPLAIN_DEFENSE' : 
                        this.offsetShadowX = -35 * this.radShadow / 146;
                        break;
                    case 'ANIM_SWAY_DRUNK_LIGHT' : 
                    case 'ANIM_SWAY_DRUNK_MODERATE' : 
                    case 'ANIM_SWAY_DRUNK_HEAVY' : 
                        this.radShadow = (this.mainFolder == 'girl') ? _DATAGAME.shadowWidth[idxAnim] * 1.2 : _DATAGAME.shadowWidth[idxAnim] * 1.35;
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : -10) * this.radShadow / 146;
                        break;
                    case 'ANIM_DEFEND_HOLD_OBJECT' : 
                        this.radShadow = (this.mainFolder == 'girl') ? _DATAGAME.shadowWidth[idxAnim] * 1.1 : _DATAGAME.shadowWidth[idxAnim] * 1.1;
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : -5) * this.radShadow / 146;
                        break;
                    case 'ANIM_STRIKE_OVERHEAD_TO_GROUND' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : -5) * this.radShadow / 146;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? -60 : -20) * this.radShadow / 146;
                        break;
                    case 'ANIM_STRIKE_OVERHEAD_TO_MIDDLE' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -30 : -5) * this.radShadow / 146;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? -60 : -20) * this.radShadow / 146;
                        break;
                    case 'ANIM_PIANO_FINGER' :
                    case 'ANIM_PIANO_ENTHUSIASTIC' :
                    case 'ANIM_PIANO_ENTHUSIASTIC2' :
                    case 'ANIM_PIANO_GENTLE' :
                    case 'ANIM_SIT_TYPING_GENTLE' :
                    case 'ANIM_SIT_TYPING_FURIOUS' :
                    case 'ANIM_SIT_TYPING_IDLE' :
                    case 'ANIM_SIT_TYPING_REST' :
                        if(this.mainFolder == 'boy') this.radShadow = _DATAGAME.shadowWidth[idxAnim] * 1.3;
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -70 : -70) * this.radShadow / 146;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? -30 : -40) * this.radShadow / 146;
                        break;
                    case 'ANIM_EMBRACE_GIRL' :
                    case 'ANIM_EMBRACE_BOY' :
                    case 'ANIM_EMBRACE_IDLE_GIRL' :
                    case 'ANIM_EMBRACE_IDLE_BOY' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -80 : -80) * this.radShadow / 146;
                        break;
                    case 'ANIM_POINT_FOWARD_ENERGETIC' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -50 : -60) * this.radShadow / 146;
                        break;
                    case 'ANIM_SHAKEITTOTHEMAX_KNEESBEND' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -60 : -40) * this.radShadow / 146;
                        break;
                    case 'ANIM_ARMS_WIDE_OPEN_RECEIVING_LOOP' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -40 : -30) * this.radShadow / 146;
                        break;
                    case 'ANIM_STRIKE_OVERHEAD_HEAVY' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 10 : 20) * this.radShadow / 146;
                        break;
                    case 'ANIM_SIT_VEHICLE' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -70 : -70) * this.radShadow / 146;
                        break;
                    case 'ANIM_POINT_FOWARD_DOUBLE_FINGER_ENERGETIC' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -40 : -60) * this.radShadow / 146;
                        break;
                    case 'ANIM_SLASH_LUNGE' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -50 : -40) * this.radShadow / 146;
                        break;
                    case 'ANIM_SLASH_SWING' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 30 : 20) * this.radShadow / 146;
                        break;
                    case 'ANIM_FALL_FLOATING' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -10 : 10) * this.radShadow / 146;
                        break;
                    case 'ANIM_FLY_BACKWARDS_FLOATING' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -90 : -90) * this.radShadow / 146;
                        break;
                    case 'ANIM_JOG_HAND_CLOSE' :
                    case 'ANIM_JOG_HAND_OPEN' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 10 : 10) * this.radShadow / 146;
                        break;
                    case 'ANIM_RUN_WIDE_HAND_CLOSE' :
                    case 'ANIM_RUN_WIDE_HAND_OPEN' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 20 : 20) * this.radShadow / 146;
                        break;
                    case 'ANIM_IDLE_HANDS_DOWN_LEGS_WIDE' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -10 : -10) * this.radShadow / 146;
                        break;
                    case 'ANIM_FALL_KICKED_BACKWARDS' : 
                    case 'ANIM_FALL_KICKED_BACKWARDS_UNCONSCIOUS' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 120 : 140) * this.radShadow / 146;
                        this.offsetShadowY = 20 * this.radShadow / 146;
                        break;
                    case 'ANIM_FALL_KICKED_BACKWARDS_OVER_OBJECT' : 
                    case 'ANIM_FALL_KICKED_BACKWARDS_OVER_OBJECT_UNCONSCIOUS' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 255 : 235) * this.radShadow / 146;
                        this.offsetShadowY = 20 * this.radShadow / 146;
                        break;
                    case 'ANIM_RIFLE_HOLD_INACCURATE_UP_IDLE' : 
                    case 'ANIM_RIFLE_HOLD_INACCURATE_MID_IDLE' : 
                    case 'ANIM_RIFLE_HOLD_SIDEWAYS_IDLE' : 
                    case 'ANIM_RIFLE_HOLD_ONE_HANDED' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -20 : 0) * this.radShadow / 146;
                        break;
                    case 'ANIM_RIFLE_HOLD_NORMAL_IDLE' : 
                    case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_5_SHOTS_CONSTANT' :
                    case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_5_SHOTS_RANDOM' :
                    case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_NORMAL_SINGLE_CONSTANT' :
                    case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_BIG' :
                    case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_NOODLE_HANDS' :
                    case 'ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_SMALL' :
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -10 : 0) * this.radShadow / 146;
                        break;
                    case 'ANIM_RIFLE_HOLD_CROUCH_IDLE' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 10 : 10) * this.radShadow / 146;
                        break;
                    case 'ANIM_RIFLE_HOLD_PRONE_IDLE' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 60 : 60) * this.radShadow / 146;
                        break;
                    case 'ANIM_FALL_FRONT' : 
                    case 'ANIM_FALL_FRONT_UNCONSCIOUS' : 
                    case 'ANIM_FALL_FRONT_SWAY' : 
                    case 'ANIM_FALL_FRONT_SWAY_UNCONSCIOUS' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? -115 : -120) * this.radShadow / 146;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? 0 : 20) * this.radShadow / 146;
                        break;
                    case 'ANIM_HAND_ON_GROUND_IDLE' : 
                    case 'ANIM_HAND_ON_GROUND_LOOK_FORWARD_IDLE' : 
                    case 'ANIM_HAND_ON_GROUND_LOOK_FORWARD' : 
                    case 'ANIM_LONGJUMP_LAND1' : 
                    case 'ANIM_LONGJUMP_LAND1_LOOK_FORWARD' : 
                    case 'ANIM_LONGJUMP_LAND1_LOOK_FORWARD2' : 
                        this.offsetShadowX = ((this.mainFolder == 'girl') ? 25 : 10) * this.radShadow / 146;
                        this.offsetShadowY = ((this.mainFolder == 'girl') ? -100 : -100) * this.radShadow / 146;
                        break;
                }
            }
        },
        
        draw:function(){
            this.parent();

            var c = ig.system.context; //console.log(this.defScale);
            if(this.isShadow && this.spriter != null && this.spriter.root.alpha > 0) {
                // c.save();
                // c.scale(this.defScale.y, this.defScale.y);

                c.save();
                c.globalAlpha = 0.2 * this.spriter.root.alpha;

                // c.translate(this._parent['sptChar' + this.noChar].spriter.pos.x, this._parent['sptChar' + this.noChar].spriter.pos.y);
                c.translate(this.spriter.pos.x, this.spriter.pos.y);
                c.scale(1 * this.defScale.y, this.hScaleShadow * this.defScale.y); 
                c.fillStyle = 'black';
                c.beginPath();
                // c.arc(0, -100*this._parent.zoomBG, 220*this._parent.zoomBG, 0, 2 * Math.PI);
                c.arc(this.offsetShadowX * this.flipState * _DATAGAME.ratioRes, this.offsetShadowY*_DATAGAME.ratioRes*this._parent.zoomBG, this.radShadow*_DATAGAME.ratioRes*this._parent.zoomBG, 0, 2 * Math.PI);
                c.fill();
                c.restore();

                // c.restore();
            }
        }
    });
});