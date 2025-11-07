ig.module('game.entities.object.transition')
.requires(
	'impact.entity',
	'impact.entity-pool'
)

.defines(function(){
	EntityTransition = ig.Entity.extend({
		tweenTransition:null,
		name : "Transition",
		isClosed : false,
		isRunning : false,
		tweenTime : 0.6,
		fill:'black',
		zIndex:_DATAGAME.zIndexData.transition,
		transAlpha:0,

		init:function( x, y, settings ){
			this.parent( x, y, settings );
		},

		reset: function( x, y, settings ) {
	        this.parent( x, y, settings );
	        this.transAlpha = 0;
	    },

		update:function(){
			this.parent();

		},

		draw:function(){
			this.parent();

			var c = ig.system.context;
			c.save();
			c.fillStyle = this.fill;
			c.globalAlpha = this.transAlpha; 
			c.fillRect(0, 0, ig.system.width, ig.system.height);
			c.restore();
		},

		afterClose:function() {
			this.isClosed = true;
			ig.game.windowBefore = ig.game.windowName;

			if(ig.game.windowBefore == 'menu' && ig.game.isFullScreen && ig.game.currentWindow.buttons.btnFullScreen) {
				ig.game.currentWindow.buttons.btnFullScreen.kill();
			}

			// console.log(ig.game.statusLoad);
			// console.log(ig.game.numChapter + " " + ig.game.statusLoad[ig.game.numChapter]);

			// if(ig.game.windowBefore == 'menu' && ig.game.boolChooseChapter && ig.game.statusLoad[ig.game.numChapter] == 0) {
			if(ig.game.boolChooseChapter && ig.game.statusLoad[ig.game.numChapter] == 0) {
				ig.game.loadAssets();
                ig.game.showLoadingScreen(this.afterCloseChapter.bind(this));
            } else {
            	this.afterCloseChapter();
            }			
		},

		afterCloseChapter:function() {
			ig.game.director.jumpTo(this.stateIdx);
			ig.game.fadeOutWindow();
		},

		afterOpen:function() {
			this.isRunning = false;
			this.isClosed = false;

			if(ig.game.windowName == 'game') {
				ig.game.currentWindow.startWindow();
			} else if(ig.game.windowName == 'menu') {
				if(ig.game.isFullScreen) {
					ig.Fullscreen.enableFullscreenButton = true;
				}
			}
		},

		animationClose:function() {
			this.tweenClose = this.tween({
                transAlpha:1
            }, this.tweenTime, { 
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
					this.afterClose();
                }.bind(this)
            });
            this.tweenClose.start();
		},

		animationOpen:function() {
			this.tweenOpen = this.tween({
                transAlpha:0
            }, this.tweenTime, { 
            	delay:0.1,
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
                    this.afterOpen();
                }.bind(this)
            });
            this.tweenOpen.start();
		},

		close:function(loadIdx){
			this.isRunning = true;
			this.stateIdx = loadIdx;

			this.animationClose();
		},

		open:function(){
			this.transAlpha = 1;
			this.isRunning = true;
			
			this.animationOpen();
		},
	});

	EntityTransition1 = EntityTransition.extend({
		fill:'black',

		init:function( x, y, settings ){
			this.parent( x, y, settings );
		},

		reset: function( x, y, settings ) {
	        this.parent( x, y, settings );
	        this.transAlpha = 0;
	    },

		update:function(){
			this.parent();

		},

		draw:function(){
			this.parent();

			var c = ig.system.context;
			c.save();
			c.fillStyle = this.fill;
			c.globalAlpha = this.transAlpha; 
			c.fillRect(0, 0, ig.system.width, ig.system.height);
			c.restore();
		},

		animationClose:function() {
			this.tweenClose = this.tween({
                transAlpha:1
            }, this.tweenTime, { 
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
					this.afterClose();
                }.bind(this)
            });
            this.tweenClose.start();
		},

		animationOpen:function() {
			this.tweenOpen = this.tween({
                transAlpha:0
            }, this.tweenTime, { 
            	delay:0.1,
                easing: ig.Tween.Easing.Linear.EaseNone, 
                onComplete: function () {
                    this.afterOpen();
                }.bind(this)
            });
            this.tweenOpen.start();
		},
	});


	ig.EntityPool.enableFor( EntityTransition );
});
