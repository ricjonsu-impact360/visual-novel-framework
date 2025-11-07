ig.module('game.entities.object.email')
.requires(
    'impact.entity'
)
.defines(function() {
    EntityEmail = ig.Entity.extend({
        zIndex:_DATAGAME.zIndexData.email,
        bgEmail:new ig.Image(_RESOURCESINFO.image.bgEmail),
        imageEmail:null,
        
        emailData:null,

        showImage:false,

        boolDrawText:false,

        canClickEmail:false,

        size:{x:662*_DATAGAME.ratioRes, y:885*_DATAGAME.ratioRes},
        padding:{x:30*_DATAGAME.ratioRes, y:30*_DATAGAME.ratioRes},

        imagePos:{x:0, y:0},

        textGreetingWidth:0,
        textBodyWidth:0,
        textClosureWidth:0,

        imageSize:null,

        fontSize:28*_DATAGAME.ratioRes,

        fontName:'arial',

        startLoadSentence:false,
        loadSentence:false,
        counterWord:0,
        modWord:2,

        currentWord:0,
        statText:0,

        TEXT_TO:0,
        TEXT_FROM:1,
        TEXT_SUBJECT:2,
        TEXT_GREETING:3,
        TEXT_BODY:4,
        TEXT_CLOSURE:5,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.loadDataEmail();

            this.repos();
            // this.createPhoneCanvas();

            this.timerAutoDialog = new ig.Timer(ig.game.delayDialog);
            this.timerAutoDialog.pause();

            ig.game.sortEntitiesDeferred();
        },

        loadDataEmail:function() {
            this.emailData = _STRINGS[this.idxStory];
            console.log(this.idxStory + " " + this.emailData);     

            if(this.emailData.image != null) {
                var imageName = this.emailData.image.id;

                if(this.emailData.image.imageLoveInterest == true) {
                    imageName = (ig.game.sessionData.loveInterest == 'girl') ? (this.emailData.image.id + "2") : (this.emailData.image.id + "1")
                }
                this.imageEmail = new ig.Image(_BASEPATH.mediaGame + 'graphics/sprites/message/' + imageName + '.png');

                this.imagePos = {
                    x: this.padding.x,
                    y: this.padding.y
                };
            }

            this.fontName = 'arialmt';

            if(this.emailData.bgImage != null) this.bgEmail = new ig.Image(_BASEPATH.image+'sprites/' + this.emailData.bgImage + '.png');

            if (this.emailData.speed == 1) this.modWord = 6;
            if (this.emailData.speed == 2) this.modWord = 4;
            if (this.emailData.speed == 3) this.modWord = 2;

            this.modWord *= ig.game.speedModDialog;

            if(this.imageEmail == null) {
                this.setTextPosition(false);
                this.startText();
            }
        },

        startText:function() {
            this.statText = this.TEXT_TO;
            this.currentWord = 0;
            this.counterWord = 0;

            this.loadSentence = (this.emailData.animation == false) ? false : true;
            this.startLoadSentence = true;
        },

        repos:function() {
            this.pos = {
                x:ig.game.midX - this.halfSize.x, 
                y:ig.game.midY - this.halfSize.y
            };
        },

        trackWord:function() {
            // if(this.statText == this.TEXT_TO) {
            //     this.arrTextTo = this.arrTextToFull.concat([]);
            //     this.statText = this.TEXT_FROM;
            // }
            // else if(this.statText == this.TEXT_FROM) {
            //     this.arrTextFrom = this.arrTextFromFull.concat([]);
            //     this.statText = this.TEXT_SUBJECT;
            // }
            // else if(this.statText == this.TEXT_SUBJECT) {
            //     this.arrTextSubject = this.arrTextSubjectFull.concat([]);
            //     this.statText = this.TEXT_GREETING;
            // }
            // else {
                var arrTextNow = this.arrTextGreetingWord;
                if(this.statText == this.TEXT_BODY) arrTextNow = this.arrTextBodyWord;
                else if(this.statText == this.TEXT_CLOSURE) arrTextNow = this.arrTextClosureWord;
                else if(this.statText == this.TEXT_TO) arrTextNow = this.arrTextToWord;
                else if(this.statText == this.TEXT_FROM) arrTextNow = this.arrTextFromWord;
                else if(this.statText == this.TEXT_SUBJECT) arrTextNow = this.arrTextSubjectWord;

                if(this.currentWord < arrTextNow.length){
                    var word = arrTextNow[this.currentWord];

                    if(this.statText == this.TEXT_GREETING) { 
                        this.textGreeting += word;
                        this.textGreeting += " ";
                        this.arrTextGreeting = ig.game.wordWrapLetter(this.textGreeting, this.textGreetingWidth, this.fontSize, this.fontName); 
                    } else if(this.statText == this.TEXT_BODY) {
                        this.textBody += word;
                        this.textBody += " ";
                        this.arrTextBody = ig.game.wordWrapLetter(this.textBody, this.textBodyWidth, this.fontSize, this.fontName); 
                    } else if(this.statText == this.TEXT_CLOSURE) {
                        this.textClosure += word;
                        this.textClosure += " ";
                        this.arrTextClosure = ig.game.wordWrapLetter(this.textClosure, this.textClosureWidth, this.fontSize, this.fontName); 
                    } else if(this.statText == this.TEXT_TO) {
                        this.textTo += word;
                        this.textTo += " ";
                        this.arrTextTo = ig.game.wordWrapLetter(this.textTo, this.textClosureWidth, this.fontSize, this.fontName); 
                    } else if(this.statText == this.TEXT_FROM) {
                        this.textFrom += word;
                        this.textFrom += " ";
                        this.arrTextFrom = ig.game.wordWrapLetter(this.textFrom, this.textClosureWidth, this.fontSize, this.fontName); 
                    } else if(this.statText == this.TEXT_SUBJECT) {
                        this.textSubject += word;
                        this.textSubject += " ";
                        this.arrTextSubject = ig.game.wordWrapLetter(this.textSubject, this.textClosureWidth, this.fontSize, this.fontName); 
                    }
                    this.currentWord++;
                } else{
                    this.loadSentence = false;
                    this.currentWord = 0;
                    if(this.statText == this.TEXT_GREETING) {
                        this.statText = this.TEXT_BODY;
                        this.loadSentence = true;
                    } else if(this.statText == this.TEXT_BODY) {
                        this.statText = this.TEXT_CLOSURE;
                        this.loadSentence = true;
                    } else if(this.statText == this.TEXT_CLOSURE) {
                        this.showImage = true;
                        this.timerAutoDialog.set(ig.game.delayDialog);
                        this.timerAutoDialog.reset();
                        this.timerAutoDialog.unpause();
                    } else if(this.statText == this.TEXT_TO) {
                        this.statText = this.TEXT_FROM;
                        this.loadSentence = true;
                    } else if(this.statText == this.TEXT_FROM) {
                        this.statText = this.TEXT_SUBJECT;
                        this.loadSentence = true;
                    } else if(this.statText == this.TEXT_SUBJECT) {
                        this.statText = this.TEXT_GREETING;
                        this.loadSentence = true;
                    }
                }
            // }
        },  

        setTextPosition:function(boolImage) {
            this.boolDrawText = true; 
            this.canClickEmail = true;

            this.textSubjectWidth = this.size.x - (this.padding.x*2);
            this.textGreetingWidth = this.size.x - (this.padding.x*2);
            this.textBodyWidth = this.size.x - (this.padding.x*2);
            this.textClosureWidth = this.size.x - (this.padding.x*2);

            if(boolImage) {
                this.textGreetingWidth = this.size.x - (this.padding.x*2) - this.imageSize.x - this.padding.x;
                this.arrTextGreetingFull = ig.game.wordWrapLetter(this.emailData.data[0].text, this.textGreetingWidth, this.fontSize, this.fontName);   
            }
            else {
                this.arrTextGreetingFull = ig.game.wordWrapLetter(this.emailData.data[0].text, this.textGreetingWidth, this.fontSize, this.fontName);   
            }
              
            this.arrTextBodyFull = ig.game.wordWrapLetter(this.emailData.data[1].text, this.textBodyWidth, this.fontSize, this.fontName);   

            this.arrTextClosureFull = ig.game.wordWrapLetter(this.emailData.data[2].text, this.textClosureWidth, this.fontSize, this.fontName);  

            var allTextSubject = _STRINGS.Email.subject + " : " + this.emailData.subtitle;
            var allTextTo = _STRINGS.Email.to + " : " + this.emailData.to;
            var allTextFrom = _STRINGS.Email.from + " : " + this.emailData.from;

            this.arrTextSubjectFull = ig.game.wordWrapLetter(allTextSubject, this.textSubjectWidth, this.fontSize, this.fontName);  
            this.arrTextToFull = ig.game.wordWrapLetter(allTextTo, this.textSubjectWidth, this.fontSize, this.fontName);  
            this.arrTextFromFull = ig.game.wordWrapLetter(allTextFrom, this.textSubjectWidth, this.fontSize, this.fontName);  

            if(ig.game.noSpacing) {
                var _wordsSubject = allTextSubject.split(" ");  
                var _wordsTo = allTextTo.split(" ");  
                var _wordsFrom = allTextFrom.split(" ");  

                var _wordsGreeting = this.emailData.data[0].text.split("");    
                var _wordsBody = this.emailData.data[1].text.split("");    
                var _wordsClosure = this.emailData.data[2].text.split("");

                this.arrTextSubjectWord = [];  
                this.arrTextToWord = [];  
                this.arrTextFromWord = [];  

                this.arrTextGreetingWord = [];    
                this.arrTextBodyWord = [];    
                this.arrTextClosureWord = [];

                ig.game.arrayWordWrapRegex(_wordsSubject, this.arrTextSubjectWord);
                ig.game.arrayWordWrapRegex(_wordsTo, this.arrTextToWord);
                ig.game.arrayWordWrapRegex(_wordsFrom, this.arrTextFromWord);
                
                ig.game.arrayWordWrapRegex(_wordsGreeting, this.arrTextGreetingWord);
                ig.game.arrayWordWrapRegex(_wordsBody, this.arrTextBodyWord);
                ig.game.arrayWordWrapRegex(_wordsClosure, this.arrTextClosureWord);
            } else {   
                this.arrTextSubjectWord = allTextSubject.split(" ");  
                this.arrTextToWord = allTextTo.split(" ");  
                this.arrTextFromWord = allTextFrom.split(" ");  

                this.arrTextGreetingWord = this.emailData.data[0].text.split(" ");    
                this.arrTextBodyWord = this.emailData.data[1].text.split(" ");    
                this.arrTextClosureWord = this.emailData.data[2].text.split(" ");
            }

            this.textSubject = "";    
            this.textFrom = "";    
            this.textTo = ""; 

            this.textGreeting = "";    
            this.textBody = "";    
            this.textClosure = "";    

            this.arrTextGreeting = [];    
            this.arrTextBody = [];    
            this.arrTextClosure = [];
            this.arrTextTo = [];
            this.arrTextFrom = [];
            this.arrTextSubject = [];

            this.yTextTo = this.padding.y;
            this.yTextFrom = this.padding.y + this.fontSize*1.1;
            this.yTextSubject = this.padding.y + this.fontSize*1.1*2;

            this.yTextGreeting = this.yTextSubject + (this.arrTextSubjectFull.length * this.fontSize * 1.1) + this.fontSize
            this.yTextBody = this.yTextGreeting + (this.arrTextGreetingFull.length * this.fontSize * 1.1) + this.fontSize;
            this.yTextClosure = this.yTextBody + (this.arrTextBodyFull.length * this.fontSize * 1.1) + this.fontSize;

            if(boolImage) {
                this.imagePos.y = this.yTextClosure + (this.arrTextClosureFull.length * this.fontSize * 1.1) + this.fontSize;
            }

            //WITHOUT ANIMATION
            if(!this.emailData.animation){
                this.arrTextTo = this.arrTextToFull.concat([]);
                this.arrTextFrom = this.arrTextFromFull.concat([]);
                this.arrTextSubject = this.arrTextSubjectFull.concat([]);
                this.arrTextGreeting = this.arrTextGreetingFull.concat([]);
                this.arrTextBody = this.arrTextBodyFull.concat([]);
                this.arrTextClosure = this.arrTextClosureFull.concat([]);

                this.startLoadSentence = true;
                this.loadSentence = false;
                this.showImage = true;
            }
        },

        getImageHeight:function() {
            if(this.imageEmail != null && this.imageSize == null && this.imageEmail.width != 0) {
                this.imageSize =  {
                    x: this.imageEmail.width,
                    y: this.imageEmail.height
                };

                this.setTextPosition(true);
                this.startText();
            }
        },

        update:function(){
            this.parent();

            this.getImageHeight();

            if (ig.game.isPauseSetting) return;
            if (ig.Timer.timeScale == 0) return;

            if(this.loadSentence && this.emailData.animation == true) {
                this.counterWord++;
                if(this.counterWord % this.modWord == 0) {
                    this.trackWord();
                }
            }

            if(!this.startLoadSentence) return;

            // if(this._parent.canClickStage && this.canClickEmail && ig.input.released('click') && !ig.game.isClickClose) {
            if(this._parent.canClickStage && this.canClickEmail && !ig.game.currentWindow.isClickButton && !ig.game.isClickClose) {
                if(!this.loadSentence) {
                    if(ig.game.dialogAutoStatus != ig.game.STAT_DIALOG_NORMAL) {//ig.game.autoDialog
                        if(this.timerAutoDialog != null && this.timerAutoDialog.delta() > 0){
                            this.timerAutoDialog.set(ig.game.delayDialog);
                            this.timerAutoDialog.reset();
                            this.timerAutoDialog.pause();
                            this.canClickEmail = false;
                            ig.game.currentWindow.checkChatBubble();
                        }
                    } else {
                        if((ig.input.released('click') || ig.game.currentWindow.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL) {//!ig.game.autoDialog
                            this.canClickEmail = false;
                            ig.game.currentWindow.checkChatBubble();
                        }
                    }
                    // this.canClickEmail = false;
                    // ig.game.currentWindow.checkChatBubble();
                } 
                else {
                    if((ig.input.released('click') || ig.game.currentWindow.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL) {//!ig.game.autoDialog
                        this.loadSentence = false;
                        this.showImage = true;
                        this.arrTextTo = this.arrTextToFull.concat([]);
                        this.arrTextFrom = this.arrTextFromFull.concat([]);
                        this.arrTextSubject = this.arrTextSubjectFull.concat([]);
                        this.arrTextGreeting = this.arrTextGreetingFull.concat([]);
                        this.arrTextBody = this.arrTextBodyFull.concat([]);
                        this.arrTextClosure = this.arrTextClosureFull.concat([]);
                    }
                }
            }
        },

        draw:function(){
            this.parent();

            var c = ig.system.context;

            c.save();
            c.translate(this.pos.x, this.pos.y);
            this.bgEmail.draw(0, 0);

            if(this.imageEmail != null && this.showImage) {
                this.imageEmail.draw(this.padding.x, this.imagePos.y);
            }

            c.fillStyle = 'black';
            c.textBaseline = 'top';

            c.font = this.fontSize + 'px ' + this.fontName;

            // c.fillText(_STRINGS.Email.to + " : " + this.emailData.to, this.padding.x, this.yTextTo);
            // c.fillText(_STRINGS.Email.from + " : " + this.emailData.from, this.padding.x, this.yTextFrom);

            // if(this.arrTextSubjectFull) {
            //     ig.game.drawText(this.arrTextSubjectFull, this.fontSize, c, this.padding.x, this.yTextSubject);
            // }

            if(this.boolDrawText) {
                ig.game.drawText(this.arrTextTo, this.fontSize, c, this.padding.x, this.yTextTo);

                ig.game.drawText(this.arrTextFrom, this.fontSize, c, this.padding.x, this.yTextFrom);

                ig.game.drawText(this.arrTextSubject, this.fontSize, c, this.padding.x, this.yTextSubject);

                ig.game.drawText(this.arrTextGreeting, this.fontSize, c, this.padding.x, this.yTextGreeting);

                ig.game.drawText(this.arrTextBody, this.fontSize, c, this.padding.x, this.yTextBody);
             
                ig.game.drawText(this.arrTextClosure, this.fontSize, c, this.padding.x, this.yTextClosure);
            }

            c.restore();
        }
    });
});