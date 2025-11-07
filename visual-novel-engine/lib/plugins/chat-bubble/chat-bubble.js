ig.module(
    'plugins.chat-bubble.chat-bubble'
).requires(
    'impact.entity',
    'plugins.chat-bubble.chat-bubble-factory'
).defines(function () {
    "use strict";

    ig.ChatBubble.Entity = ig.Entity
        .extend({
            parentPos: { x: 0, y: 0 },
            chatStyle: 'bubble',
            chatBubbleDrawConfigs: {},
            chatBubbleAppearTime: 0.3,
            chatBubbleAliveTime: 3, //below 0 = not disappearing
            chatBubbleDisappearTime: 0.2,

            chatBubbleParent: null,
            chatBubblePercent: { x: 0, y: 0 },
            chatBubbleOffset: { x: 0, y: 0 },
            chatBubbleAlpha: 0.8,

            STATES: {
                DELAY: -1,
                TWEEN_IN: 0,
                TWEEN_OUT: 1,
                ALIVE: 2,
                KILL: 3
            },
            _currentState: 0, // this.STATES.TWEEN_IN 


            _tweenProgress: 0,
            _tweenFactor: 0,
            _currentTickTime: 0,
            init: function (x, y, settings) {
                this.parent(x, y, settings);

                if (!this.chatBubbleDrawConfigs) this.chatBubbleDrawConfigs = {};

                var canvasData = ig.ChatBubble.FactoryManager.generateCanvas(this.chatBubbleDrawConfigs);
                this._chatBubbleCanvasConfigs = canvasData.configs;
                this._chatBubbleCanvas = canvasData.canvas;
                // this._chatBubbleCanvas = this.chatBubbleParent.savedCanvasPhone.ele;
                // console.log(this._chatBubbleCanvasConfigs.textConfigs);

                this._currentState = this.STATES.TWEEN_IN;

                this.size = {
                    x: this._chatBubbleCanvas.width,
                    y: this._chatBubbleCanvas.height
                };

                this.repos();
            },

            closeChatBubble: function () {
                this.kill();
                this._currentState = this.STATES.KILL;
                this._tweenProgress = 0;
                this._currentTickTime = 0;
            },

            updateTick: function (time, maxTime, callback) {
                if (time < maxTime) {
                    time += ig.system.tick;
                    if (time >= maxTime) {
                        time = maxTime;
                        if (typeof callback === "function") callback();
                    }
                }

                return time;
            },

            update: function () {
                this.parent();

                this.updateState();
                
            },

            repos:function() {
                // if(_DATAGAME.dialogStyle.toLowerCase() == 'rectangle') {
                if(this.chatStyle == 'rectangle') {
                    this.size = {
                        x: this._chatBubbleCanvas.width,
                        y: this._chatBubbleCanvas.height
                    };
                }
                this.updatePos();
            }, 

            checkSFXText:function() {
                if(ig.game.sfxTextName != null && ig.game.sfxTextName != "") {
                    ig.game.dataSFXText = ig.soundHandler.sfxPlayer.playSFX(ig.game.sfxTextName, true);
                    ig.soundHandler.sfxPlayer.volume(ig.game.sessionData.sound/ig.game.maxVolume);
                }
            },

            updateState: function () {
                switch (this._currentState) {
                    case this.STATES.DELAY: {
                        
                    } break;
                    case this.STATES.TWEEN_IN: {
                        if(this.chatBubbleAppearTime == 0) {
                            this._currentState = this.STATES.ALIVE;

                            if(ig.game.windowName == 'game' && (!this.boolNotif || this.boolNotif == null || this.boolNotif === undefined)) {
                                ig.game.currentWindow.loadSentence = true;
                                ig.game.currentWindow.isBubble = true;
                                this.checkSFXText();
                            }

                            this._tweenProgress = 1;
                            this._currentTickTime = 0;
                            this._tweenFactor = this.updateTweenProgress(this._tweenProgress);

                            if(this.chatStyle == 'rectangle') {
                                ig.game.currentWindow.calculatePosBubble();
                                this.repos();
                            }
                        } else {
                            this._currentTickTime = this.updateTick(this._currentTickTime, this.chatBubbleAppearTime, function () {
                                this._currentState = this.STATES.ALIVE;

                                if(ig.game.windowName == 'game' && (!this.boolNotif || this.boolNotif == null || this.boolNotif === undefined)) {
                                    ig.game.currentWindow.loadSentence = true;
                                    ig.game.currentWindow.isBubble = true;
                                    this.checkSFXText();
                                }
                            }.bind(this));

                            if (this._currentState == this.STATES.TWEEN_IN) {
                                this._tweenProgress = this._currentTickTime / this.chatBubbleAppearTime;
                                if(this._tweenProgress >= 0 && this._tweenProgress <= 0.3) {
                                    if(this.chatStyle == 'rectangle') {
                                        ig.game.currentWindow.calculatePosBubble();
                                        this.repos();
                                    }
                                }
                            } else {
                                this._tweenProgress = 1;
                                this._currentTickTime = 0;
                            }

                            this._tweenFactor = this.updateTweenProgress(this._tweenProgress);
                        }
                    } break;
                    case this.STATES.ALIVE: {
                        if(this.chatBubbleAliveTime > 0) {
                            this._currentTickTime = this.updateTick(this._currentTickTime, this.chatBubbleAliveTime, function () {
                                this._currentState = this.STATES.TWEEN_OUT;
                                if (this.boolNotif) {
                                    if(this.chatBubbleParent.isShowBubble) {
                                        this.chatBubbleParent.isShowBubble = false;
                                        this.chatBubbleParent.showUI(false);
                                    }
                                }
                            }.bind(this));

                            if (this._currentState != this.STATES.ALIVE) {
                                this._currentTickTime = 0;
                            }
                        }
                    } break;
                    case this.STATES.TWEEN_OUT: {
                        if(this.chatBubbleDisappearTime == 0) {
                            this.kill();

                            if (this.boolNotif) {
                                
                            } else {
                                ig.game.currentWindow.checkChatBubble();
                            }

                            this._tweenProgress = 0;
                            this._currentTickTime = 0;
                            this._tweenFactor = this.updateTweenProgress(this._tweenProgress);
                        } else {
                            this._currentTickTime = this.updateTick(this._currentTickTime, this.chatBubbleDisappearTime, function () {
                                this.kill();

                                if (this.boolNotif) {
                                    
                                } else {
                                    ig.game.currentWindow.checkChatBubble();
                                }

                                // if(ig.game.windowName == 'game') {
                                //     if(ig.game.currentWindow.stateGame == ig.game.currentWindow.STATES.INTRO) {
                                //         ig.game.currentWindow.checkChatBubbleIntro();
                                //     }
                                // }
                                // else if(ig.game.windowName == 'date') {
                                //     // if(ig.game.currentWindow.stateGame == ig.game.currentWindow.STATES.INTRO) {
                                //         ig.game.currentWindow.checkChatBubbleIntro();
                                //     // }
                                // }
                            }.bind(this));

                            if (this._currentState == this.STATES.TWEEN_OUT) {
                                this._tweenProgress = 1 - (this._currentTickTime / this.chatBubbleDisappearTime);
                            } else {
                                this._tweenProgress = 0;
                                this._currentTickTime = 0;
                            }

                            this._tweenFactor = this.updateTweenProgress(this._tweenProgress);
                        }
                    } break;
                }
            },

            updatePos: function () { 
                this.pos = {
                    x: this.parentPos.x + this.chatBubbleParent.size.x * this.chatBubblePercent.x + this.chatBubbleOffset.x,
                    y: this.parentPos.y + this.chatBubbleParent.size.y * this.chatBubblePercent.y + this.chatBubbleOffset.y
                };

                this.pos.x -= this.size.x * this._chatBubbleCanvasConfigs.bubbleConfigs.tail.direction.x;
                this.pos.y -= this.size.y * this._chatBubbleCanvasConfigs.bubbleConfigs.tail.direction.y;
            },

            updateTweenProgress: function (k) {
                var s = 1.70158;
                return (k = k - 1) * k * ((s + 1) * k + s) + 1;
            },

            draw: function (ctx) {
                var centerPos = {
                    x: this.pos.x + this.size.x * 0.5,
                    y: this.pos.y + this.size.y * 0.5
                };
                var scale = {
                    x: 1 * this._tweenFactor,
                    y: 1 * this._tweenFactor
                };

                var ctx = ig.system.context;
                ctx.save();

                // if(this.chatBubbleDrawConfigs.bubbleConfigs.chatType == 'text') {
                //     ctx.rect(
                //         -ig.game.screen.x + ig.sizeHandler.minW/2 - this.chatBubbleParent.halfSize.x + this.chatBubbleParent.posDefChat.x, 
                //         -ig.game.screen.y + ig.sizeHandler.minH/2 - this.chatBubbleParent.halfSize.y + this.chatBubbleParent.posDefChat.y, 
                //         this.chatBubbleParent.sizeChat.x, 
                //         this.chatBubbleParent.sizeChat.y
                //     );
                //     ctx.clip();
                // }                

                // alpha
                ctx.globalAlpha = this.chatBubbleAlpha * this._tweenFactor;

                if(!ig.game.showBubbleTextInGame) ctx.globalAlpha = 0;
                
                // translate          
                ctx.translate(
                    this._chatBubbleCanvas.width * 0.5 * (-1 + 2 * this._chatBubbleCanvasConfigs.bubbleConfigs.tail.direction.x) * (1 - scale.x) - ig.game.screen.x,
                    this._chatBubbleCanvas.height * 0.5 * (-1 + 2 * this._chatBubbleCanvasConfigs.bubbleConfigs.tail.direction.y) * (1 - scale.y) - ig.game.screen.y);
                // scale
                ctx.translate(centerPos.x, centerPos.y);
                ctx.scale(scale.x, scale.y);
                ctx.translate(-centerPos.x, -centerPos.y);
                
                ctx.drawImage(this._chatBubbleCanvas,
                    centerPos.x - this._chatBubbleCanvas.width * 0.5,
                    centerPos.y - this._chatBubbleCanvas.height * 0.5);
                ctx.restore();

                var canvasData = ig.ChatBubble.FactoryManager.generateCanvas(this.chatBubbleDrawConfigs);
                this._chatBubbleCanvasConfigs = canvasData.configs;
                this._chatBubbleCanvas = canvasData.canvas;
            }
        });
});