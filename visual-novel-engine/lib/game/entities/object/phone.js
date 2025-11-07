ig.module('game.entities.object.phone')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityPhone = ig.Entity.extend({
        zIndex:_DATAGAME.zIndexData.phone,
        imgPhone:new ig.Image(_RESOURCESINFO.image.phone),
        imgAvatar1:{},
        imgAvatar2:{},

        dataAvatar1:"",
        dataAvatar2:"",

        chattingName:'',
        titleName:'',

        idxStory:0,

        bubbleConfigs : {
            round:25*_DATAGAME.ratioRes,
            width:410*_DATAGAME.ratioRes, 
            fontSize:30*_DATAGAME.ratioRes, 
            height:90*_DATAGAME.ratioRes, //76
            padding: {
                x: 30*_DATAGAME.ratioRes,
                y: 15*_DATAGAME.ratioRes
            },
            fontName:'metromed',
            fontTextName:'metroblack'
        }, 

        paddingText:15*_DATAGAME.ratioRes,
        phoneData:null,

        canClickPhone:false,
        boolCheckHeight:false,

        arrText:[],
        counterText:0,
        idPlayer:0,

        isImagePath:false,

        // isShowBubble:false,
        // durShowBubble:1,
        // isShop:true,

        size:{x:720*_DATAGAME.ratioRes, y:1280*_DATAGAME.ratioRes},
        sizeChat:{x:582*_DATAGAME.ratioRes, y:845*_DATAGAME.ratioRes},
        posChat:{x:0, y:0},
        posDefChat:{x:68*_DATAGAME.ratioRes, y:216*_DATAGAME.ratioRes},

        init:function(x,y,settings){
            this.parent(x,y,settings);

            // if(ig.game.autoDialog) {
                this.timerAutoChat = new ig.Timer(ig.game.delayTextChat);
                this.timerAutoChat.pause();
            // }

            this.bubbleConfigs.fontName = 'arialmt';
            this.bubbleConfigs.fontTextName = 'arialmtbold';

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.loadDataPhone();

            this.repos();
            // this.createPhoneCanvas();

            ig.game.sortEntitiesDeferred();
        },

        handleSuccess:function(imgAvatarPath, idx) {
            this['imgUsingPath' + idx] = new ig.Image(imgAvatarPath);
            this.isImagePath = true;
        },

        handleError:function() {
            this.isImagePath = false;
        },

        loadDataPhone:function() {
            this.phoneData = _STRINGS[this.idxStory];
            ig.game.consoleLog(this.idxStory + " " + this.phoneData);

            this.chattingName = this.phoneData.from;

            var _idxFrom = this.phoneData.people[this.phoneData.people.map(function(e) { return e.name; }).indexOf(this.phoneData.from)].id;
            this.titleName = (_idxFrom == 2) ? this.phoneData.people[0].name : this.phoneData.people[1].name;

            for(var name_love_interest in _STRINGS.dynamic_character) {
                if(name_love_interest.toLowerCase() == this.titleName.toLowerCase()) {
                    this.titleName = _STRINGS.dynamic_character[this.titleName][ig.game.sessionData.loveInterest];
                }

                // if(name_love_interest.toLowerCase() == this.chattingName.toLowerCase()) {
                //     this.chattingName = _STRINGS.dynamic_character[this.chattingName][ig.game.sessionData.loveInterest];
                // }
            }

            for(var i=0; i<this.phoneData.people.length;i++){
                var avatarName = this.phoneData.people[i].name.toLowerCase();
                avatarName = avatarName.replaceAll(" ", "");

                var boolFindName = false;

                if(this.phoneData.people[i].path != null && this.phoneData.people[i].path != '') {
                    var imgAvatarPath = _BASEPATH.avatar + this.phoneData.people[i].path + '.png';
                    try {
                        $.ajax(imgAvatarPath, 
                            {
                                success:this.handleSuccess.bind(this, imgAvatarPath, this.phoneData.people[i].id),
                                error:this.handleError.bind(this)
                            }
                        );
                    } catch(e){}
                }

                if(avatarName == 'amy') {
                    this['dataAvatar' + this.phoneData.people[i].id] = _DATAGAME.spriterData[ig.game.sessionData.dressUpTheme[ig.game.currentWindow.numChapter].now.toLowerCase()];

                    if(this['dataAvatar' + this.phoneData.people[i].id] != null) {

                        //SKIN
                        this['imgAvatar' + this.phoneData.people[i].id]['skin'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + this['dataAvatar' + this.phoneData.people[i].id].girl.skin + '.png');

                        //FACE
                        this['imgAvatar' + this.phoneData.people[i].id]['face'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + this['dataAvatar' + this.phoneData.people[i].id].girl.face + '.png');

                        //GLASSES
                        var _mcglassesName = (this['dataAvatar' + this.phoneData.people[i].id].girl.glasses == null) ? 'glasses-none' : this['dataAvatar' + this.phoneData.people[i].id].girl.glasses;
                        this['imgAvatar' + this.phoneData.people[i].id]['glasses'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + _mcglassesName + '.png');

                        //HAIR
                        this['imgAvatar' + this.phoneData.people[i].id]['hair'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + this['dataAvatar' + this.phoneData.people[i].id].girl.hair + '.png');
                        this['imgAvatar' + this.phoneData.people[i].id]['hairBack'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + this['dataAvatar' + this.phoneData.people[i].id].girl.hair + '-back' + '.png');

                        //EARRINGS
                        var _mcearringsName = (this['dataAvatar' + this.phoneData.people[i].id].girl.earrings == null) ? 'earrings-none' : this['dataAvatar' + this.phoneData.people[i].id].girl.earrings;
                        this['imgAvatar' + this.phoneData.people[i].id]['earrings'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + _mcearringsName + '.png');
                        this['imgAvatar' + this.phoneData.people[i].id]['earringsBack'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + _mcearringsName + '-back' + '.png');

                        //HAT
                        var _mchatName = (this['dataAvatar' + this.phoneData.people[i].id].girl.hat == null) ? 'hat-none' : this['dataAvatar' + this.phoneData.people[i].id].girl.hat;
                        this['imgAvatar' + this.phoneData.people[i].id]['hat'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + _mchatName + '.png');

                        //BEARD
                        var _mcbeardName = (this['dataAvatar' + this.phoneData.people[i].id].girl.beard == null) ? 'beard-none' : this['dataAvatar' + this.phoneData.people[i].id].girl.beard;
                        this['imgAvatar' + this.phoneData.people[i].id]['beard'] = new ig.Image(_BASEPATH.spriter + 'message/girl/' + _mcbeardName + '.png');
                    }
                } else {
                    ig.game.currentWindow.checkCurrentCharDU(avatarName);

                    var genderAvatar = 'boy';
                    for(var name_interest in _DATAGAME.dynamic_name) {
                        if(_DATAGAME.dynamic_name[name_interest].toLowerCase() == this.phoneData.people[i].name.toLowerCase()) {
                            genderAvatar = ig.game.sessionData.loveInterest;
                            // this.chattingName = _STRINGS.dynamic_character[this.phoneData.people[i].name][ig.game.sessionData.loveInterest];
                            boolFindName = true;
                        }
                    }

                    if(!boolFindName) {
                        for(var name_avatar in _DATAGAME.neutral_girl) {
                            if(_DATAGAME.neutral_girl[name_avatar].toLowerCase() == this.phoneData.people[i].name.toLowerCase()) {
                                genderAvatar = 'girl';
                                boolFindName = true;
                            }
                        }
                        // this.chattingName = this.phoneData.people[i].name;
                    }

                    this['dataAvatar' + this.phoneData.people[i].id] = _DATAGAME.spriterData[ig.game.sessionData.dressUpChar[ig.game.currentWindow.numChapter][avatarName]];

                    if(this['dataAvatar' + this.phoneData.people[i].id] != null) {
                        //SKIN
                        this['imgAvatar' + this.phoneData.people[i].id]['skin'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].skin + '.png');

                        //FACE
                        this['imgAvatar' + this.phoneData.people[i].id]['face'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].face + '.png');

                        //HAIR
                        this['imgAvatar' + this.phoneData.people[i].id]['hair'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].hair + '.png');
                        this['imgAvatar' + this.phoneData.people[i].id]['hairBack'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].hair + '-back' + '.png');

                        //GLASSES
                        var _glassesName = (this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].glasses == null) ? 'glasses-none' : this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].glasses;
                        this['imgAvatar' + this.phoneData.people[i].id]['glasses'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + _glassesName + '.png');

                        //EARRINGS
                        var _earringsName = (this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].earrings == null) ? 'earrings-none' : this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].earrings;
                        this['imgAvatar' + this.phoneData.people[i].id]['earrings'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + _earringsName + '.png');
                        this['imgAvatar' + this.phoneData.people[i].id]['earringsBack'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + _earringsName + '-back' + '.png');

                        //HAT
                        var _hatName = (this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].hat == null) ? 'hat-none' : this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].hat;
                        this['imgAvatar' + this.phoneData.people[i].id]['hat'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + _hatName + '.png');

                        //BEARD
                        var _beardName = (this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].beard == null) ? 'beard-none' : this['dataAvatar' + this.phoneData.people[i].id][genderAvatar].beard;
                        this['imgAvatar' + this.phoneData.people[i].id]['beard'] = new ig.Image(_BASEPATH.spriter + 'message/' + genderAvatar + '/' + _beardName + '.png');
                    }
                }                 
            }
        },

        startText:function() {
            this.idPlayer = this.phoneData.people[this.phoneData.people.map(function(e) { return e.name; }).indexOf(this.phoneData.from)].id;
            
            this.spawnChatBubble();
        },
        drawBubble:function(ctx, configs) {
            var round = this.bubbleConfigs.round;
            var x = 0;
            var y = 0;
            var w = this.bubbleConfigs.width;
            var h = configs.bubbleH;
            var xMax = x + w;
            var yMax = y + h;
            var startTail = 25*_DATAGAME.ratioRes;
            var middleTail = (25+13)*_DATAGAME.ratioRes;
            var endTail = 51*_DATAGAME.ratioRes;

            var tailWidth = 15*_DATAGAME.ratioRes;
            var tailLength = 30*_DATAGAME.ratioRes;


            var direction = configs.tail;
            var noTail = configs.noTail;

            var posX = this.posDefChat.x + 26*_DATAGAME.ratioRes;
            if(direction == 'left') {
                posX = this.posDefChat.x + (100 + 20)*_DATAGAME.ratioRes + this.bubbleConfigs.round;
            }

            var posY = this.posDefChat.y + configs.posBubble.y;

            
            ctx.save();
            if(configs.textType != 'divider') { 
                ctx.translate(-ig.game.screen.x + posX, -ig.game.screen.y + posY + this.posChat.y);

                if(configs.image != null) {
                    var posXImage = this.bubbleConfigs.width - configs.image.width;
                    if(configs.tail == 'left') {
                        posXImage = 0;
                    }

                    configs.image.draw(
                        posXImage, 
                        this.paddingText + configs.bubbleH
                    );
                }

                if(configs.avatar) {
                    var posXAvatar = this.bubbleConfigs.width + tailWidth + 12*_DATAGAME.ratioRes;
                    if(configs.tail == 'left') {
                        posXAvatar = -tailWidth - (100 + 10)*_DATAGAME.ratioRes;
                    }

                    // this['imgAvatar' + configs.avatarId].draw(
                    //     posXAvatar, 
                    //     -5
                    // );

                    var radAvatar = 47*_DATAGAME.ratioRes;
                    var paddingAvatar = 4*_DATAGAME.ratioRes;

                    ctx.beginPath();
                    if(this['dataAvatar' + configs.avatarId] != null) {
                        ctx.arc(posXAvatar + radAvatar + paddingAvatar, -5*_DATAGAME.ratioRes + radAvatar + paddingAvatar, radAvatar, 0, 2 * Math.PI);
                        ctx.fillStyle = this['dataAvatar' + configs.avatarId].bgName;
                        ctx.fill();
                        ctx.lineWidth = 3*_DATAGAME.ratioRes;
                        ctx.strokeStyle = "black";
                        ctx.stroke();
                    }

                    if(this.isImagePath && this['imgUsingPath' + configs.avatarId] != null) {
                        this['imgUsingPath' + configs.avatarId].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                    } else {
                        if(this['dataAvatar' + configs.avatarId]) {
                            this['imgAvatar' + configs.avatarId]['hairBack'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['earringsBack'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['skin'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['earrings'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['hair'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['face'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['glasses'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['beard'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                            this['imgAvatar' + configs.avatarId]['hat'].draw(posXAvatar, -5*_DATAGAME.ratioRes);
                        }
                    }
                }

                ctx.beginPath();
                ctx.moveTo(x, y+round);

                if (direction == "right") {
                    ctx.lineTo(x, yMax - round);
                    ctx.quadraticCurveTo(x, yMax, x + round, yMax);
                    ctx.lineTo(xMax - round, yMax);
                    ctx.quadraticCurveTo(xMax, yMax, xMax, yMax - round);

                    if(!noTail){
                        ctx.lineTo(xMax, endTail);
                        ctx.lineTo(xMax + tailWidth, middleTail);
                        ctx.lineTo(xMax, startTail); 
                        ctx.lineTo(xMax, y + round);
                    } else ctx.lineTo(xMax, y + round);

                    ctx.quadraticCurveTo(xMax, y, xMax-round, y);
                    ctx.lineTo(x+round, y);
                    ctx.quadraticCurveTo(x, y, x, y+round);
                } 

                if (direction == "left") {
                    if(!noTail){
                        ctx.lineTo(x, startTail);
                        ctx.lineTo(x - tailWidth, middleTail);
                        ctx.lineTo(x, endTail); 
                        ctx.lineTo(x, yMax - round);
                    } else ctx.lineTo(x, yMax - round);

                    ctx.quadraticCurveTo(x, yMax, x + round, yMax);
                    ctx.lineTo(xMax - round, yMax);
                    ctx.quadraticCurveTo(xMax, yMax, xMax, yMax -round);
                    ctx.lineTo(xMax, y + round);
                    ctx.quadraticCurveTo(xMax, y, xMax-round, y);
                    ctx.lineTo(x+round, y);
                    ctx.quadraticCurveTo(x, y, x, y+round);
                } 

                ctx.closePath();

                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fill();

                ctx.lineWidth = 4*_DATAGAME.ratioRes;
                ctx.strokeStyle = 'black';
                ctx.stroke();

                ctx.restore();
            } 

            ctx.restore();

            ctx.save();
            ctx.textBaseline = 'top';
            if(configs.textType == 'divider') {
                ctx.translate(-ig.game.screen.x + this.posDefChat.x, -ig.game.screen.y + posY + this.posChat.y);
                ctx.fillStyle = "white";
                // ctx.font = "bold " + (this.bubbleConfigs.fontSize*ig.game.fontRatio) + "px " + this.bubbleConfigs.fontName;
                ctx.font = (this.bubbleConfigs.fontSize*ig.game.fontRatio) + "px " + this.bubbleConfigs.fontName;
                ctx.textAlign = 'center';
            } else {
                ctx.translate(-ig.game.screen.x + posX, -ig.game.screen.y + posY + this.posChat.y);
            }

            for (var i = 0; i < configs.textData.textLines.length; i++) {
                if(configs.textData.textLines.length == 1 && configs.textType != 'divider') {
                    ctx.textBaseline = 'middle';
                    ctx.fillText(configs.textData.textLines[i],
                        15*_DATAGAME.ratioRes,
                        this.bubbleConfigs.height / 2
                    );
                } else {
                    if(configs.textType == 'divider') {
                        ctx.fillText(configs.textData.textLines[i],
                            this.sizeChat.x / 2,
                            20*_DATAGAME.ratioRes + i * configs.textData.fontHeight
                        );
                    } else {
                        ctx.fillText(configs.textData.textLines[i],
                            15*_DATAGAME.ratioRes,
                            15*_DATAGAME.ratioRes + i * configs.textData.fontHeight
                        );
                    }
                }
            }
            ctx.restore();
        },

        spawnChatBubble:function() {
            // if(ig.game.autoDialog) {
                this.timerAutoChat.set(ig.game.delayTextChat);
                this.timerAutoChat.reset();
                this.timerAutoChat.unpause();
            // }

            this.arrText.push({text:null, posBubble:{x:0, y:0}, textType:'text', noTail:false, tail:'none', height:0, bubbleH:0, avatar:false, image:null});
            this.counterText = this.arrText.length - 1;

            var boolDivider = false;

            if(this.phoneData.data[this.counterText].id == 0) {
                this.arrText[this.counterText].textType = 'divider';
                boolDivider = true;
            } else if(this.phoneData.data[this.counterText].id == this.idPlayer) {
                ig.soundHandler.sfxPlayer.play('send');
                this.arrText[this.counterText].tail = 'right';
                if(this.counterText == 0 || 
                    (this.counterText > 0 && this.phoneData.data[this.counterText - 1].id != this.idPlayer)) 
                {
                    this.arrText[this.counterText].avatar = true;
                    this.arrText[this.counterText].avatarId = this.phoneData.data[this.counterText].id;
                } else {
                    this.arrText[this.counterText].noTail = true;
                }
            } else {
                ig.soundHandler.sfxPlayer.play('notif');
                this.arrText[this.counterText].tail = 'left';
                if(this.counterText == 0 || 
                    (this.counterText > 0 && this.phoneData.data[this.counterText - 1].id != this.phoneData.data[this.counterText].id)) 
                {
                    this.arrText[this.counterText].avatar = true;
                    this.arrText[this.counterText].avatarId = this.phoneData.data[this.counterText].id;
                } else {
                    this.arrText[this.counterText].noTail = true;
                }
            }

            var textBubble = this.phoneData.data[this.counterText].text;

            textBubble = textBubble.replaceAll("{NAME}", ig.game.sessionData.playerName);

            for(var name_interest in _STRINGS.dynamic_character) {
                textBubble = textBubble.replaceAll("{" + name_interest + "}", _STRINGS.dynamic_character[name_interest][ig.game.sessionData.loveInterest]);
            }

            textBubble = ig.game.wordWrapForChatBubble(textBubble, this.bubbleConfigs.width - 30*_DATAGAME.ratioRes, this.bubbleConfigs.fontSize, this.bubbleConfigs.fontName, true);

            this.arrText[this.counterText].text = textBubble;

            var ctx = ig.system.context;
            ctx.font = this.bubbleConfigs.fontSize + "px" + " " + this.bubbleConfigs.fontName;
            this.arrText[this.counterText].size = this.measure(this.arrText[this.counterText], ctx, boolDivider);

            if(!boolDivider) {
                this.arrText[this.counterText].size.y += 30*_DATAGAME.ratioRes;
                if(this.arrText[this.counterText].size.y <= this.bubbleConfigs.height) this.arrText[this.counterText].size.y = this.bubbleConfigs.height;
            } else {
                this.arrText[this.counterText].size.y += 40*_DATAGAME.ratioRes;
            }

            this.arrText[this.counterText].bubbleH = this.arrText[this.counterText].size.y;
            this.arrText[this.counterText].height = this.arrText[this.counterText].size.y;

            if(this.counterText != 0) {
                this.arrText[this.counterText].posBubble.y = this.arrText[this.arrText.length-2].posBubble.y + this.arrText[this.arrText.length-2].height + this.paddingText;
            } else {
                this.arrText[this.counterText].posBubble.y = 20*_DATAGAME.ratioRes;
            }

            if(this.phoneData.data[this.counterText].image != "") {
                var numImage = "";
                if(this.phoneData.data[this.counterText].imageLoveInterest) {
                    numImage = (ig.game.sessionData.loveInterest == 'girl') ? 2 : 1;
                } 

                this.arrText[this.counterText].image = new ig.Image(_BASEPATH.mediaGame + 'graphics/sprites/message/' + this.phoneData.data[this.counterText].image + numImage + '.png');
                this.boolCheckHeight = true;
            } else {
                this.checkHeight();
            }
        },

        measureLine: function (ctx, textLines) {
            var metrics = ctx.measureText(textLines[0]);
            for (var i = 1; i < textLines.length; i++) {
                var newMetrics = ctx.measureText(textLines[i]);
                if (newMetrics.width >= metrics.width) {
                    metrics = newMetrics;
                }
            }

            return metrics;
        },

        measure: function (configs, ctx, boolDivider) {
            var text = configs.text.toString();
            var textLines = text.split("<br>");

            var textFull = configs.text.toString();
            var textLinesFull = textFull.split("<br>");

            ctx.save();
            if(boolDivider) {
                ctx.font = "bold " + this.bubbleConfigs.fontSize + "px" + " " + this.bubbleConfigs.fontName;
            } else {
                ctx.font = this.bubbleConfigs.fontSize + "px" + " " + this.bubbleConfigs.fontName;
            }
            var metrics = this.measureLine(ctx, textLinesFull);
            ctx.restore();

            configs.textData = {
                textLines: textLines,
                textLinesFull: textLinesFull,
                textWidth: metrics.width,
                fontHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
            };

            if (isNaN(configs.textData.fontHeight) || configs.textData.fontHeight == null) {
                configs.textData.fontHeight = this.bubbleConfigs.fontSize;
            }

            return {
                x: configs.textData.textWidth,
                y: configs.textData.fontHeight * configs.textData.textLinesFull.length
                // y: configs.textData.fontHeight * configs.textData.textLines.length
            };
        },

        checkHeight:function() {
             if(this.counterText != 0) {
                this.arrText[this.counterText].posBubble.y = this.arrText[this.arrText.length-2].posBubble.y + this.arrText[this.arrText.length-2].height + this.paddingText;
            }

            if(this.arrText[this.counterText].posBubble.y + this.posChat.y + this.arrText[this.counterText].height > this.sizeChat.y - 10*_DATAGAME.ratioRes) {
                this.posChat.y -= Math.abs(this.arrText[this.counterText].posBubble.y + this.posChat.y + this.arrText[this.counterText].height - (this.sizeChat.y- 10*_DATAGAME.ratioRes));
            } 

            this.repos();

            if(this.phoneData.data[this.counterText].id == 0) {
                this.spawnChatBubble();
            } else {
                this.canClickPhone = true;
            }
        },

        repos:function() {
            this.pos = {
                x:ig.game.midX - this.halfSize.x, 
                y:ig.game.midY - this.halfSize.y
            };
        },

        update:function(){
            this.parent();

            if(this.boolCheckHeight) {
                if(this.arrText[this.counterText].image != null && this.arrText[this.counterText].image.height > 0) {
                    this.arrText[this.counterText].height += this.arrText[this.counterText].image.height + this.paddingText;
                    this.boolCheckHeight = false;
                    this.checkHeight();
                }
            }

            if(ig.game.dialogAutoStatus != ig.game.STAT_DIALOG_NORMAL) {//ig.game.autoDialog
                if(this.timerAutoChat != null && this.timerAutoChat.delta() > 0){
                    this.timerAutoChat.set(ig.game.delayTextChat);
                    this.timerAutoChat.reset();
                    this.timerAutoChat.pause();
                    if(this.arrText.length >= this.phoneData.data.length) {
                        this.canClickPhone = false;
                        ig.game.currentWindow.checkChatBubble();
                    } else {
                        this.spawnChatBubble();
                    }
                }
            } 
            else {
                if(this._parent.canClickStage && this.canClickPhone && (ig.input.released('click') || ig.game.currentWindow.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL && !ig.game.isClickClose && !ig.game.currentWindow.isClickButton) {//!ig.game.autoDialog
                    if(this.arrText.length >= this.phoneData.data.length) {
                        // console.log('finish');
                        this.canClickPhone = false;
                        ig.game.currentWindow.checkChatBubble();
                        // ig.game.currentWindow.entityGame.phone.kill();
                        // ig.game.currentWindow.entityGame.phone = null;
                    } else {
                        this.spawnChatBubble();
                    }
                }
            }
        },

        draw:function(){
            this.parent();

        	var c = ig.system.context;

            c.save();
            c.translate(this.pos.x, this.pos.y);
            this.imgPhone.draw(0, 0);

            c.textAlign = 'center';
            c.textBaseline = "middle";
            c.fillStyle = "white";
            c.font = Math.round(50*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + this.bubbleConfigs.fontTextName;
            c.fillText(this.titleName, this.halfSize.x, this.posDefChat.y - 60*_DATAGAME.ratioRes);
            c.restore();

            c.save();
            c.beginPath();
            c.moveTo(
                -ig.game.screen.x + ig.sizeHandler.minW/2 - this.halfSize.x + this.posDefChat.x, 
                -ig.game.screen.y + ig.sizeHandler.minH/2 - this.halfSize.y + this.posDefChat.y
            );
            c.lineTo(
                -ig.game.screen.x + ig.sizeHandler.minW/2 - this.halfSize.x + this.posDefChat.x + this.sizeChat.x, 
                -ig.game.screen.y + ig.sizeHandler.minH/2 - this.halfSize.y + this.posDefChat.y
            );
            c.lineTo(
                -ig.game.screen.x + ig.sizeHandler.minW/2 - this.halfSize.x + this.posDefChat.x + this.sizeChat.x, 
                -ig.game.screen.y + ig.sizeHandler.minH/2 - this.halfSize.y + this.posDefChat.y + this.sizeChat.y
            );
            c.lineTo(
                -ig.game.screen.x + ig.sizeHandler.minW/2 - this.halfSize.x + this.posDefChat.x, 
                -ig.game.screen.y + ig.sizeHandler.minH/2 - this.halfSize.y + this.posDefChat.y + this.sizeChat.y
            );
            c.closePath();
            c.clip();
            
            for(var i = 0; i < this.arrText.length;i++){
                if(this.arrText[i].posBubble.y + this.posChat.y + this.arrText[i].height > 0) {
                    this.drawBubble(c, this.arrText[i]);
                } 
            }
            
            c.restore();
        }
    });
});