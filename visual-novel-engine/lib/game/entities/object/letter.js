ig.module('game.entities.object.letter')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityLetter = ig.Entity.extend({
        zIndex:_DATAGAME.zIndexData.letter,
        bgLetter:new ig.Image(_RESOURCESINFO.image.bgLetter),
        imageLetter:null,

        showImage:false,
        
        letterData:null,

        boolDrawText:false,

        canClickLetter:false,

        size:{x:662*_DATAGAME.ratioRes, y:885*_DATAGAME.ratioRes},
        padding:{x:30*_DATAGAME.ratioRes, y:30*_DATAGAME.ratioRes},

        imagePos:{x:0, y:0},

        textGreetingWidth:0,
        textBodyWidth:0,
        textClosureWidth:0,

        imageSize:null,

        fontSize:30*_DATAGAME.ratioRes,

        fontName:'script1',

        startLoadSentence:false,
        loadSentence:false,
        counterWord:0,
        modWord:2,

        currentWord:0,
        statText:0,

        TEXT_GREETING:0,
        TEXT_BODY:1,
        TEXT_CLOSURE:2,

        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.halfSize = {
                x:this.size.x/2,
                y:this.size.y/2
            };

            this.loadDataLetter();

            this.repos();
            // this.createPhoneCanvas();

            this.timerAutoDialog = new ig.Timer(ig.game.delayDialog);
            this.timerAutoDialog.pause();

            ig.game.sortEntitiesDeferred();
        },

        loadDataLetter:function() {
            this.letterData = _STRINGS[this.idxStory];
            console.log(this.idxStory + " " + this.letterData);     

            if(this.letterData.image != null) {
                var imageName = this.letterData.image.id;

                if(this.letterData.image.imageLoveInterest == true) {
                    imageName = (ig.game.sessionData.loveInterest == 'girl') ? (this.letterData.image.id + "2") : (this.letterData.image.id + "1")
                }
                this.imageLetter = new ig.Image(_BASEPATH.mediaGame + 'graphics/sprites/message/' + imageName + '.png');

                this.imagePos = {
                    x: this.bgLetter.width - this.imageLetter.width - this.padding.x,
                    y: this.padding.y
                };
            }

            if(this.letterData.font != 'default') {
                if(this.letterData.font > 0) {
                    this.fontName = 'script' + this.letterData.font;
                } else {
                    this.fontName = this.letterData.font;
                }
            }

            if(this.fontName == 'script3') this.fontSize *= 1.1;
            else if(this.fontName == 'script4') this.fontSize *= 0.95;

            if(this.letterData.bgImage != null) this.bgLetter = new ig.Image(_BASEPATH.image+'sprites/' + this.letterData.bgImage + '.png');

            if (this.letterData.speed == 1) this.modWord = 6;
            if (this.letterData.speed == 2) this.modWord = 4;
            if (this.letterData.speed == 3) this.modWord = 2;

            this.modWord *= ig.game.speedModDialog;

            if(this.imageLetter == null) {
                this.setTextPosition(false);
                this.startText();
            }
        },

        startText:function() {
            this.showImage = true;
            this.statText = this.TEXT_GREETING;
            this.currentWord = 0;
            this.counterWord = 0;
            this.loadSentence = (this.letterData.animation == false) ? false : true;
            this.startLoadSentence = true;
        },

        repos:function() {
            this.pos = {
                x:ig.game.midX - this.halfSize.x, 
                y:ig.game.midY - this.halfSize.y
            };
        },

        trackWord:function() {
            var arrTextNow = this.arrTextGreetingWord;
            if(this.statText == this.TEXT_BODY) arrTextNow = this.arrTextBodyWord;
            else if(this.statText == this.TEXT_CLOSURE) arrTextNow = this.arrTextClosureWord;

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
                    this.timerAutoDialog.set(ig.game.delayDialog);
                    this.timerAutoDialog.reset();
                    this.timerAutoDialog.unpause();
                }
            }
        },  

        setTextPosition:function(boolImage) {
            this.boolDrawText = true; 
            this.canClickLetter = true;

            this.textGreetingWidth = this.size.x - (this.padding.x*2);
            this.textBodyWidth = this.size.x - (this.padding.x*2);
            this.textClosureWidth = this.size.x - (this.padding.x*2);

            if(boolImage) {
                this.textGreetingWidth = this.size.x - (this.padding.x*2) - this.imageSize.x - this.padding.x;
                this.arrTextGreetingFull = ig.game.wordWrapLetter(this.letterData.data[0].text, this.textGreetingWidth, this.fontSize, this.fontName);   
            }
            else {
                this.arrTextGreetingFull = ig.game.wordWrapLetter(this.letterData.data[0].text, this.textGreetingWidth, this.fontSize, this.fontName);   
            }
              
            this.arrTextBodyFull = ig.game.wordWrapLetter(this.letterData.data[1].text, this.textBodyWidth, this.fontSize, this.fontName);   

            this.arrTextClosureFull = ig.game.wordWrapLetter(this.letterData.data[2].text, this.textClosureWidth, this.fontSize, this.fontName);  

            // this.arrTextGreetingWord = this.letterData.data[0].text.split(" ");    
            // this.arrTextBodyWord = this.letterData.data[1].text.split(" ");    
            // this.arrTextClosureWord = this.letterData.data[2].text.split(" ");

            if(ig.game.noSpacing) {
                var _wordsGreeting = this.letterData.data[0].text.split("");    
                var _wordsBody = this.letterData.data[1].text.split("");    
                var _wordsClosure = this.letterData.data[2].text.split("");

                this.arrTextGreetingWord = [];    
                this.arrTextBodyWord = [];    
                this.arrTextClosureWord = [];
                
                ig.game.arrayWordWrapRegex(_wordsGreeting, this.arrTextGreetingWord);
                ig.game.arrayWordWrapRegex(_wordsBody, this.arrTextBodyWord);
                ig.game.arrayWordWrapRegex(_wordsClosure, this.arrTextClosureWord);
            } else {
                // this.arrText = this.fullSentence.split(" ");
                this.arrTextGreetingWord = this.letterData.data[0].text.split(" ");    
                this.arrTextBodyWord = this.letterData.data[1].text.split(" ");    
                this.arrTextClosureWord = this.letterData.data[2].text.split(" ");
            }

            this.textGreeting = "";    
            this.textBody = "";    
            this.textClosure = "";    

            this.arrTextGreeting = [];    
            this.arrTextBody = [];    
            this.arrTextClosure = [];

            

            if(boolImage) {
                this.yTextBody = this.padding.y + this.imageSize.y + 20;
                this.yTextClosure = this.yTextBody + (this.arrTextBodyFull.length * this.fontSize * 1.1) + this.fontSize;

                var textGreetingH = (this.arrTextGreetingFull.length * this.fontSize * 1.1);

                if(textGreetingH >= this.imageSize.y) {
                    this.yTextBody = this.padding.y + textGreetingH + this.fontSize;
                    this.yTextClosure = this.yTextBody + (this.arrTextBodyFull.length * this.fontSize * 1.1) + this.fontSize;

                    // this.imagePos.y = this.padding.y + (textGreetingH / 2) - (this.imageSize.y / 2); //center
                    // this.imagePos.y = this.padding.y + textGreetingH - this.imageSize.y; //bottom
                }
            }
            else {
                this.yTextBody = this.padding.y + (this.arrTextGreetingFull.length * this.fontSize * 1.1) + this.fontSize;
                this.yTextClosure = this.yTextBody + (this.arrTextBodyFull.length * this.fontSize * 1.1) + this.fontSize;
            }

            //WITHOUT ANIMATION
            if(!this.letterData.animation){
                this.arrTextGreeting = this.arrTextGreetingFull.concat([]);
                this.arrTextBody = this.arrTextBodyFull.concat([]);
                this.arrTextClosure = this.arrTextClosureFull.concat([]);

                this.startLoadSentence = true;
                this.loadSentence = false;
                this.showImage = true;
            }
        },

        getImageHeight:function() {
            if(this.imageLetter != null && this.imageSize == null && this.imageLetter.width != 0) {
                this.imageSize =  {
                    x: this.imageLetter.width,
                    y: this.imageLetter.height
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

            if(this.loadSentence) {
                this.counterWord++;
                if(this.counterWord % this.modWord == 0) {
                    this.trackWord();
                }
            }

            if(!this.startLoadSentence) return;

            if(this._parent.canClickStage && this.canClickLetter && !ig.game.currentWindow.isClickButton && !ig.game.isClickClose) {
                if(!this.loadSentence) {
                    if(ig.game.dialogAutoStatus != ig.game.STAT_DIALOG_NORMAL) {//ig.game.autoDialog
                        if(this.timerAutoDialog != null && this.timerAutoDialog.delta() > 0){
                            this.timerAutoDialog.set(ig.game.delayDialog);
                            this.timerAutoDialog.reset();
                            this.timerAutoDialog.pause();
                            this.canClickLetter = false;
                            ig.game.currentWindow.checkChatBubble();
                        }
                    } else {
                        if((ig.input.released('click') || ig.game.currentWindow.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL) {!ig.game.autoDialog
                            this.canClickLetter = false;
                            ig.game.currentWindow.checkChatBubble();
                        }
                    }
                } 
                else {
                    if((ig.input.released('click') || ig.game.currentWindow.checkFowardDialog() == true) && ig.game.dialogAutoStatus == ig.game.STAT_DIALOG_NORMAL) {!ig.game.autoDialog
                        this.loadSentence = false;
                        this.showImage = true;
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
            this.bgLetter.draw(0, 0);

            if(this.imageLetter != null && this.showImage) {
                if(this.letterData.image.position == 'top-left') {
                    this.imageLetter.draw(this.padding.x, this.imagePos.y);
                } else {
                    this.imageLetter.draw(this.bgLetter.width - this.imageLetter.width - this.padding.x, this.imagePos.y);
                }
            }

            c.fillStyle = 'black';
            c.textBaseline = 'top';

            var formatFont = '';
            if(this.fontName == 'script1') formatFont = 'bold ';

            c.font = formatFont + this.fontSize + 'px ' + this.fontName;


            if(this.boolDrawText) {
                if(this.imageLetter != null && this.letterData.image.position == 'top-left') {
                    ig.game.drawText(this.arrTextGreeting, this.fontSize, c, this.padding.x*2 + this.imageSize.x, this.padding.y);
                } else {
                    ig.game.drawText(this.arrTextGreeting, this.fontSize, c, this.padding.x, this.padding.y);
                }

                ig.game.drawText(this.arrTextBody, this.fontSize, c, this.padding.x, this.yTextBody);
             
                ig.game.drawText(this.arrTextClosure, this.fontSize, c, this.padding.x, this.yTextClosure);
            }

            c.restore();
        }
    });
});