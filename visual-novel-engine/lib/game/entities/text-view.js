ig.module(
        'game.entities.text-view'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityTextView = ig.Entity.extend({
        	text: '',
        	fontStyle: '40px metromed',
        	lines: [],
            size: {
                x:900,
                y:100
            },
            visible:true,
            zIndex:3001,
            alphaBlink:0,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                // this.zIndex = 3;
                ig.game.sortEntitiesDeferred();

                this.repos();

                this.tweenBlink1 = this.tween({
					alphaBlink: 1
				}, 0.2, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete: function() {
						this.tweenBlink2.start();
					}.bind(this)
				});

				this.tweenBlink2 = this.tween({
					alphaBlink: 0
				}, 0.2, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete: function() {
						this.tweenBlink1.start();
					}.bind(this)
				});

				this.tweenBlink1.start();

				// this.blinking = new ig.TweenDef(this)
                // .to({
	            //     alphaBlink:1
	            // }, 100)
                // .easing(ig.Tween.Easing.Linear.EaseNone)
                // .repeat(3)
                // .yoyo(true)
                // .onComplete(function(){
                // 	this.alphaBlink = 0;
                // 	this.blinking.start();
                // }.bind(this));

                // this.blinkingRepeat = new ig.TweenDef(this)
                // .to({
	            //     alphaBlink:1
	            // }, 100)
                // .easing(ig.Tween.Easing.Linear.EaseNone)
                // .repeat(3)
                // .yoyo(true)
                // .onComplete(function(){
                // 	this.blinking.start();
                // }.bind(this));

                // this.blinking.start();

                // test
                // this.addText("Lorem ipsum dolor sit\namet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis")
            },

            repos:function() {
                this.pos = {
                    x:ig.system.width/2 - this.size.x/2,
                    y:ig.system.height/2 - this.size.y/2
                }
            },

            draw: function(){
            	this.parent();

                if(!this.visible) return;

            	var ctx = ig.system.context;
            	ctx.save();
            	ctx.fillStyle = "#ffffff";
            	ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

            	// draw text
            	ctx.font = this.fontStyle;
            	ctx.fillStyle = "#000000";
            	ctx.textBaseline = 'top';

            	var startY = this.pos.y + 15*_DATAGAME.ratioRes;

            	ctx.globalAlpha = this.alphaBlink;
            	if(this.lines.length == 0) {
            		ctx.fillText('|', this.pos.x + this.size.x/2, startY);
            	} else {
					ctx.fillText('|', this.pos.x + this.size.x/2 + ctx.measureText(this.lines[0]).width/2 + 2*_DATAGAME.ratioRes, startY);
            	}

            	ctx.globalAlpha = 1;
            	for(var i = 0; i < this.lines.length; i++){
            		ctx.fillText(this.lines[i], this.pos.x + this.size.x/2 - ctx.measureText(this.lines[i]).width/2, startY);
            		startY += (40*_DATAGAME.ratioRes);
            	}

                if(this.text.length <= 0) {
                    ctx.font = this.fontStyle;
                    ctx.fillStyle = '#c7c7c7';
                    ctx.textAlign = 'left';
                    ctx.fillText('e.g. Amy', this.pos.x + this.size.x/2 - ctx.measureText(this.lines[i]).width/2, this.pos.y + 15*_DATAGAME.ratioRes);
                }

            	ctx.restore();
            },

            addText: function(t){
                if(this.text.length >= 10) {
                    this.text = this.text.substring(0, 9);
                }

            	this.text += t;

            	var ctx = ig.system.context;
            	ctx.font = this.fontStyle;

            	// var w = 900-10;
                var w = this.size.x-10;

            	this.lines = this.getLines(ctx, this.text, w);
            	// console.log(this.lines);
            },

            removeText: function(){
            	if(this.text.length == 0)return;
            	if(this.text.length == 1){
            		this.text = '';
            	}
            	if(this.text.length >= 2){
            		// check is the last string is carriage return or not
            		var char = this.text.substring(this.text.length - 2);
            		if(char == '\r' || char == '\n'){
            			this.text = this.text.slice(0,-2);
            		}else{
            			this.text = this.text.slice(0,-1);
            		}
            	}

            	// update text
            	this.addText('');
            },

	        getLines: function(ctx, text, maxWidth) {
	            var words = text.split(/[ ]/);
	            var lines = [];
	            var currentLine = '';

	            for (var i = 0; i < words.length; i++) {
	                var word = words[i];

	                var enterText = word.split(/[\r|\n]/);
	                
	                if(enterText.length > 1){
	                	// 1st word
	                	var width = ctx.measureText(currentLine + " " + enterText[0]).width;
		                if (width < maxWidth) {
		                	if(currentLine == ''){
		                		currentLine += enterText[0];
		                	}else{
		                		currentLine += " " + enterText[0];
		                	}
		                } else {
		                    lines.push(currentLine);
		                    currentLine = enterText[0];
		                }

		                // rest of words
	                	for(var j = 1; j < enterText.length; j++){
	                		lines.push(currentLine);
		                	currentLine = enterText[j];
	                	}
	                }else{
	                	var width = ctx.measureText(currentLine + " " + word).width;
		                if (width < maxWidth) {
		                    if(currentLine == ''){
		                		currentLine += word;
		                	}else{
		                		currentLine += " " + word;
		                	}
		                } else {
		                    lines.push(currentLine);
		                    currentLine = word;
		                }
	                }
	            }
	            lines.push(currentLine);
	            return lines;
	        }
        });
    });