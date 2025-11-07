ig.module('game.entities.controller.menu-controller')
.requires(
	'impact.entity',
    // 'plugins.spriter.spriter-display',
    // 'plugins.spriter.scml',
    // 'game.entities.topoverlay.topoverlay',
    'game.entities.object.demo-text',
    'game.entities.object.ui-currency',
    'game.entities.object.ui-chapter',
    'game.entities.object.ui-chapter-non-linear',
    'game.entities.buttons.button-chapter-non-linear',
    'game.entities.object.ui-shop',
    'game.entities.object.ui-setting',
    'game.entities.object.ui-exit',
    'game.entities.buttons.button-more-games',
    'game.entities.buttons.button-play',
    'game.entities.buttons.button-shopmm',
    'game.entities.buttons.button-exit',
    'game.entities.buttons.button-setting'
)
.defines(function() {

    EntityMenuController = ig.Entity.extend({
        zIndex: 0,
        loadBG: true,

        buttons:{},
        scaleTitle:0.9,
        entityGame:{},

        isShowChapter:false,

        uiChapterVisibility:false,
        
        // scmlSprite: new SpriterScml(_RESOURCESINFO.spriter.boy),

        init:function(x,y,settings){
            this.parent(x,y,settings);

            ig.game.animDelayed = true;

            if(_DATAGAME.chapters.totalChapter > 7) _DATAGAME.chapters.totalChapter = 7;

            ig.game.consoleLog('shop : ' + _DATAGAME.enableShop + ', language : ' + _DATAGAME.enableLanguage);
            if(ig.game.openAllChapter) { 
                if(_DATAGAME.linearChapterWithThumbnail == true) {
                    ig.game.sessionData.unlockChapter = _STRINGS.chapter_list.length;
                } else {
                    ig.game.sessionData.unlockChapter = _STRINGS.Chapter.title.length - 1;
                }
            }

            if(ig.game.lastBGM != 'bgmdefault' && ig.game.lastBGM != (_RESOURCESINFO.bgm).replaceAll("-", "")) {
                ig.game.lastBGM = 'bgmdefault';
                ig.soundHandler.bgmPlayer.onStopBGM();
                ig.soundHandler.bgmPlayer.play("bgmdefault");
            }

            ig.game.windowName = 'menu';
            ig.game.currentWindow = this;
            ig.game.lastBGM = 'bgmdefault';

            for(var vc=1;vc<=_DATAGAME.totalVirtualCurrency;vc++) {
                this['virtualCurrency' + vc] = ig.game.sessionData['virtualCurrency' + vc];
            }

            // this.virtualCurrency1 = ig.game.sessionData.virtualCurrency1;
            // this.virtualCurrency2 = ig.game.sessionData.virtualCurrency2;
            // this.virtualCurrency3 = ig.game.sessionData.virtualCurrency3;

            this.buttons.btnSetting = ig.game.spawnEntity(EntityButtonSetting, 0, 0, {_parent: this, zIndex:_DATAGAME.zIndexData.buttonOnMenu});


            if(_DATAGAME.chapters.multipleChapter || (_DATAGAME.chapters.multipleChapter == false && _DATAGAME.chapters.showMainMenu == true)) {
                if(_DATAGAME.enableCurrency) {
                    this.uiCurrency = ig.game.spawnEntity(EntityUICurrency, 0, 0, {_parent: this});
                    // this.uiCurrency.showUI(true);
                    this.uiCurrency.isShop = false;
                    this.uiCurrency.repos();
                }
                
                if(!_DATAGAME.simplifiedUI) {
                    this.bg = new ig.Image(_BASEPATH.backgroundMenu + _RESOURCESINFO.image.bgMenu);
                    this.title = new ig.Image(_RESOURCESINFO.image.title);

                    this.tweenTitleBig = this.tween({
                        scaleTitle:1
                    }, 0.8, { 
                        easing: ig.Tween.Easing.Linear.EaseNone, 
                        loop:2,
                        onComplete: function () {
                            // this.tweenTitleSmall.start();
                        }.bind(this)
                    });

                    this.tweenTitleSmall = this.tween({
                        scaleTitle:0.9
                    }, 0.8, { 
                        easing: ig.Tween.Easing.Linear.EaseNone, 
                        onComplete: function () {
                            this.tweenTitleBig.start();
                        }.bind(this)
                    });

                    this.tweenTitleBig.start();

                    //Buttons
                    this.buttons.btnPlay = ig.game.spawnEntity(EntityButtonPlay, 0, 0, {_parent: this});
                    if(_DATAGAME.enableShop) {
                        this.buttons.btnShop = ig.game.spawnEntity(EntityButtonShopMM, 0, 0, {_parent: this, 
                            onClicked:function() {
                                this._parent.uiCurrency.showUI(true, false);
                            }
                        });
                    }

                    if(_DATAGAME.enableExit) {
                        this.buttons.btnExit = ig.game.spawnEntity(EntityButtonExit, 0, 0, {_parent: this});
                    }

                    if(_SETTINGS.MoreGames.Enabled) {
                        this.buttons.btnMoreGames = ig.game.spawnEntity(EntityButtonMoreGames, 0, 0, {_parent: this, zIndex:_DATAGAME.zIndexData.buttonOnMenu});
                    }

                    if(ig.game.languageOn && ig.game.getEntitiesByType(EntitySLShowBtn).length < 1){
                        //Set the button position, size, and zIndex as you need
                        this.slButton = ig.game.spawnEntity(EntitySLShowBtn, (ig.game.isFullScreen) ? (25 + 115*_DATAGAME.ratioRes) : 25, 25, {
                         zIndex: _DATAGAME.zIndexData.buttonOnMenu,
                         size: {x: 253*_DATAGAME.ratioRes, y: 75*_DATAGAME.ratioRes}
                        });
                    }
                }

                if(ig.game.isFullScreen) { 
                    ig.Fullscreen.enableFullscreenButton = true;

                    this.buttons.btnFullScreen = ig.game.spawnEntity(ig.FullscreenButton, 0, 0, {
                        zIndex:_DATAGAME.zIndexData.buttonOnMenu,
                        anchor: 1 // 1: top-left, 2: top-right, 3: bottom-right, 4: bottom-left
                    });
                    
                    this.buttons.btnFullScreen.show();
                }

                // if(_DATAGAME.loadBackgroundMusic) this.buttons.btnSound = ig.game.spawnEntity(EntityButtonSound, 0, 0, {_parent: this});
                
                if(_DATAGAME.chapters.multipleChapter) {
                    if(_DATAGAME.isLinearChapter && !_DATAGAME.linearChapterWithThumbnail) {
                        this.uiChapter = ig.game.spawnEntity(EntityUIChapter, 0, 0, {_parent:this});
                    } else {
                        this.uiChapter = ig.game.spawnEntity(EntityUIChapterNonLinear, 0, 0, {_parent:this});
                    }
                    this.uiChapter.hide();
                    this.uiChapter.repos();
                }
                

                if(_DATAGAME.enableShop) {
                    this.uiShop = ig.game.spawnEntity(EntityUIShop, 0, 0, {_parent:this});
                    this.uiShop.hide();
                    this.uiShop.repos();
                }

                if(_DATAGAME.enableExit) {
                    this.uiExit = ig.game.spawnEntity(EntityUIExit, 0, 0, {_parent:this});
                    this.uiExit.hide();
                    this.uiExit.repos();
                }

                if(!_DATAGAME.simplifiedUI) {
                    if(ig.game.windowBefore == 'game' && ig.game.isChapterEnd) {
                        if(this.uiChapter != null) this.isShowChapter = true;
                        // this.uiChapter.show();
                    }
                    ig.game.isChapterEnd = false;
                } else {
                    if(this.uiChapter != null) this.isShowChapter = true;
                    // this.uiChapter.show();
                }
            } else {
            // if(!_DATAGAME.chapters.multipleChapter) {
                if(ig.game.directLoadChapter < 1) {
                    ig.game.numChapter = 1;
                    if(ig.game.statusLoad[1] == null) { ig.game.statusLoad[1] = 0; }

                    if(ig.game.statusLoad[1] == 0) {
                        ig.game.loadAssets();
                        ig.game.showLoadingScreen(function() {
                            ig.game.fadeOutWindowSplash();
                        }.bind(this));
                    }
                    this.enabledButton(false);
                }
            }

            if(_DATAGAME.showButtonLoadOnMenu) {
                this.btnLoad = ig.game.spawnEntity(EntityButtonLoad, 0, 0, { _parent: this, zIndex:_DATAGAME.zIndexData.buttonOnMenu});

                this.uiSaveLoad = ig.game.spawnEntity(EntityUISaveLoad, 0, 0, {_parent:this, zIndex:_DATAGAME.zIndexData.UILoadOnMenu});
                this.uiSaveLoad.hide();
                this.uiSaveLoad.repos();
            }

            this.uiSetting = ig.game.spawnEntity(EntityUISetting, 0, 0, {_parent:this});
            this.uiSetting.hide();
            this.uiSetting.repos();

            if(_DATAGAME.enableDemo) ig.game.spawnEntity(EntityDemoText, 0, 0, {_parent:this});

            if(ig.game.directLoadChapter >= 1) {
                ig.game.numChapter = ig.game.directLoadChapter;
                if(ig.game.statusLoad[ig.game.numChapter] == null) { ig.game.statusLoad[ig.game.numChapter] = 0; }

                if(ig.game.statusLoad[ig.game.numChapter] == 0) {
                    ig.game.loadAssets();
                    ig.game.showLoadingScreen(function() {
                        ig.game.fadeOutWindowSplash();
                    }.bind(this));
                }
                this.enabledButton(false);
                ig.game.directLoadChapter = 0;
            }
            
            this.repos();

            this.checkMiniButton(); 

            if(this.isShowChapter) this.uiChapter.show();

            ig.game.sortEntitiesDeferred();      

            // var cobaBtn = ig.game.spawnEntity(EntityButtonChapterNonLinear, 0, 0, { _parent:this, noButton:1, noChapter:1, isClickable:false, 
            // repos:function() {
            //     this.pos.x = 25;this.pos.y = 25;
            // } });  
            // cobaBtn.visible = true;
            // // cobaBtn.sinkingEffects();
            // this.visible = true;

            // var rewardbtn = ig.game.spawnEntity(EntityDailyrewardButton);

            // ig.game.consoleLog(ig.game.sortArrayByProp(_STRINGS.chapter_list, 'timestamp'));
            // ig.game.consoleLog(_STRINGS.chapter_list);

            // ig.game.spawnEntity( EntityVignette, 0, 0, {
            //   color: 'rgba(0,0,0,0.8)',
            //   alpha:0.7,
            //   radius: 1000,
            //   softness: 0.6, //0.6
            //   centerWorld: false
            // });
            // ig.game.sortEntitiesDeferred();

            //TRY VIGNETTE
            // this.overlayCanvas = document.createElement('canvas');
            // this.overlayCanvas.width = ig.system.width;
            // this.overlayCanvas.height = ig.system.height;
            // this.overlayCtx = this.overlayCanvas.getContext('2d', { alpha: true });

            //TRY
            // this.circleX = 0; this.circleY = 0;
            // var path = this.makeArcPath(50, 300, 400, 300, 400, 0.2);
            // this.tweenCurve = this.tweenBezier(path, 2, {
            //     target: { xVar: "circleX", yVar: "circleY" },
            //     // easing: ig.Tween.Easing.Quadratic.EaseInOut,
            //     easing: ig.Tween.Easing.Linear.EaseNone,
            //     onComplete: function() {
            //         console.log("Bezier tween finished!");
            //     }
            // });
            // this.tweenCurve.start();

        },

        // makeArcPath:function(x1, y1, x2, y2, height, bias = 0.5) { //bias where the highest point sits (0 = near start, 0.5 = middle, 1 = near end)
        //     // point along the straight line where the "apex" should roughly be
        //     var controlX = x1 + (x2 - x1) * bias;
        //     var controlY = y1 + (y2 - y1) * bias - height;

        //     return [
        //         { x: x1, y: y1 },        // start
        //         { x: controlX, y: controlY }, // control (shifted by bias)
        //         { x: x2, y: y2 }         // end
        //     ];
        // },

        checkMiniButton:function() {
            ig.game.showMiniButton = false;
            ig.game.listMiniButton = [];

            for(var buttonName in _DATAGAME.miniButton) {
                if(_DATAGAME.miniButton[buttonName] == true) {
                    ig.game.listMiniButton.push(buttonName);
                    ig.game.showMiniButton = true;
                }
            }

            // ig.game.consoleLog(ig.game.showMiniButton);
            // ig.game.consoleLog(ig.game.listMiniButton);
        },

        changeLanguage:function() {
            //THIS FUNCTION IS CALLED WHEN USER CHANGE LANGUAGE
            //PUT CODE HERE IF YOU NEED TO CHANGE SOMETHING AFTER NEW LANGUAGE CHOSEN

            // this.wishlistPlugin.reDraw();
            // this.packPlugin.reDraw();
            // this.followUsPlugin.reDraw();
        },

        enabledButton:function(boolEnable, clickChapter) { 
            if(clickChapter== null) clickChapter = false;
            this.buttons.btnSetting.isClickable = boolEnable;

            if(this.btnLoad) {
                this.btnLoad.isClickable = boolEnable;
            }

            if(this.slButton){
                this.slButton.isClickable = boolEnable;
            }

            if(this.buttons.btnMoreGames){
                this.buttons.btnMoreGames.isClickable = boolEnable;
                if(!boolEnable) this.buttons.btnMoreGames.hide();
                else this.buttons.btnMoreGames.show();
            }

            if(this.buttons.btnFullScreen) {
                ig.Fullscreen.enableFullscreenButton = boolEnable;

                if(_DATAGAME.isLinearChapter == false && clickChapter == true) { 
                    if(!boolEnable) this.buttons.btnFullScreen.hide();
                    else this.buttons.btnFullScreen.show();
                } else if(clickChapter == true) { 
                    if(!boolEnable) this.buttons.btnFullScreen.hide();
                    else this.buttons.btnFullScreen.show();
                }
            }

            if(!_DATAGAME.simplifiedUI && (_DATAGAME.chapters.multipleChapter || (_DATAGAME.chapters.multipleChapter == false && _DATAGAME.chapters.showMainMenu == true))) {
                if(this.buttons.btnPlay) { this.buttons.btnPlay.isClickable = boolEnable; }
                if(_DATAGAME.enableShop) {
                    this.buttons.btnShop.isClickable = boolEnable;
                }

                if(_DATAGAME.enableExit) {
                    this.buttons.btnExit.isClickable = boolEnable;
                }
            }
        },

        ready: function() {
            // console.log(_LEVEL_DETAILS_);

            // Load player data
            // ig.game.score = ig.game.loadData("score") || 0;
        },
        update:function(){
            this.parent();

            ig.game._menu = this;
        },
        draw:function(){
            this.parent();

            var c = ig.system.context;
            if(!_DATAGAME.simplifiedUI && (_DATAGAME.chapters.multipleChapter || (_DATAGAME.chapters.multipleChapter == false && _DATAGAME.chapters.showMainMenu == true))) {
                if(this.bg.width > 0 && this.loadBG) {
                    this.loadBG = false;
                    this.repos();
                }

                c.save();
                c.setTransform(1, 0, 0, 1, 0, 0);

                //ori wo texture packer
                // sourceX, sourceY, sourceW, sourceH, x, y, targetW, targetH
                // this.bgX, this.bgY, this.bgW, this.bgH, 0, 0, ig.system.width, ig.system.height
                
                //after texture packer
                //x, y, sourceX, sourceY, sourceW, sourceH, targetW, targetH
                this.bg.draw(0, 0, this.bgX, this.bgY, this.bgW, this.bgH, ig.system.width, ig.system.height);
                c.restore();

                c.save();
                c.translate(ig.game.midX, ig.game.midY-200*_DATAGAME.ratioRes);
                c.scale(this.scaleTitle, this.scaleTitle);

                var ratioTitle = 1;
                if(ig.system.width < this.title.width) {
                    ratioTitle = ig.sizeHandler.minW / this.title.width;
                }

                this.title.draw(-this.title.width*ratioTitle/2, -this.title.height*ratioTitle/2, 0, 0, this.title.width, this.title.height, this.title.width * ratioTitle, this.title.height * ratioTitle);
                // this.title.drawTint("red", 0.7, -this.title.width*ratioTitle/2, -this.title.height*ratioTitle/2, 0, 0, this.title.width, this.title.height, this.title.width * ratioTitle, this.title.height * ratioTitle);
                c.restore();
            }
            else {
                c.save();
                c.fillStyle = _DATAGAME.mainMenuBgColor;
                c.fillRect(0,0,ig.system.width,ig.system.height);
                c.restore();
            }

            // c.save();
            // c.translate(0+this.circleX, 960+this.circleY);
            // c.fillStyle = 'red';
            // c.beginPath();
            // c.arc(0, 0, 30, 0, Math.PI * 2);
            // c.fill();
            // c.restore();
            //TRY BAR
            // c.save();
            // c.translate(400, 400);
            // c.fillStyle = 'white';
            // c.roundRect(0, 0, 400, 100, 15);
            // c.lineWidth = 60;
            // c.strokeStyle = 'black';
            // c.stroke();
            // c.fill();
            // c.restore();
        },

        repos: function () {
            if(!_DATAGAME.simplifiedUI && (_DATAGAME.chapters.multipleChapter || (_DATAGAME.chapters.multipleChapter == false && _DATAGAME.chapters.showMainMenu == true))) {
                var r1 = this.bg.width / this.bg.height, //ratio image
                    r2 = ig.system.width / ig.system.height; //ratio window
                if (r1 > r2) {
                    this.bgH = this.bg.height;
                    this.bgW = this.bgH * r2;
                    this.bgX = (this.bg.width - this.bgW) / 2;
                    this.bgY = 0;
                } else {
                    this.bgW = this.bg.width;
                    this.bgH = this.bgW / r2;
                    this.bgX = 0;
                    this.bgY = (this.bg.height - this.bgH) / 2;

                    // this.bgY = this.bg.height - this.bgH; //align bawah
                }
            }

            // this.spriter.pos = {
            //     x: -ig.game.screen.x + ig.sizeHandler.minW / 2, 
            //     y: -ig.game.screen.y + ig.sizeHandler.minH / 2 + 400
            // };
        }
    });
});