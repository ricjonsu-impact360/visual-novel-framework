ig.module('plugins.splash-loader')
.requires(
    'impact.loader',
    'impact.animation'
)
.defines(function() {    
    ig.SplashLoader = ig.Loader.extend({
        tapToStartDivId: "tap-to-start", 

        counterLoading:0,
        modLoading:10,
        numLoading:0,
        
        boolReloadBG:true,  
        bar:{},
        stageSize:{x:0,y:0},
        // bg: new ig.Image(_RESOURCESINFO.image.bg),
        title: new ig.Image(_RESOURCESINFO.image.brand),
        init:function(gameClass,resources){            
            
            this.parent(gameClass,resources);

            resources.push(new ig.Image(_RESOURCESINFO.image.vc1));
            resources.push(new ig.Image(_RESOURCESINFO.image.vc2));
            resources.push(new ig.Image(_RESOURCESINFO.image.vc3));

            if(!_DATAGAME.simplifiedUI) {
                resources.push(new ig.Image(_RESOURCESINFO.image.bgChapter1));
                resources.push(new ig.Image(_RESOURCESINFO.image.bgChapter2));
                resources.push(new ig.Image(_RESOURCESINFO.image.bgChapter3));
            }

            //ADD TITLE
            if(!_DATAGAME.simplifiedUI || _DATAGAME.enableTitleLoader) {
                resources.push(new ig.Image(_RESOURCESINFO.image.title));
            }

            if(_DATAGAME.enableTitleLoader) {
                this.title = new ig.Image(_RESOURCESINFO.image.title);
            }

            //ADD BG
            // if(!_DATAGAME.simplifiedUI && _DATAGAME.bgMenuResources.length > 0) {
            //     for(var bg=0;bg<_DATAGAME.bgMenuResources.length;bg++) {
            //         resources.push(new ig.Image(_BASEPATH.background + _DATAGAME.bgMenuResources[bg] + '.png'));
            //     }
            // }
            resources.push(new ig.Image(_BASEPATH.backgroundMenu + _RESOURCESINFO.image.bgMenu));

            if(!_DATAGAME.isLinearChapter || (_DATAGAME.isLinearChapter && _DATAGAME.linearChapterWithThumbnail)) {
                try {
                    $.ajax(_BASEPATH.text+"translate/chapter_list.en.js", 
                        {
                            success:this.handleSuccessChapterList.bind(this, resources),
                            error:this.handleErrorChapterList.bind(this)
                        }
                    );
                } catch(e){}
            }
            
            // ig.loader = this;
            this.repos();
        
            // ADS
            ig.apiHandler.run("MJSPreroll");
        },

        handleSuccessChapterList:function(resources, data) {
            console.log('success');

            var _data = JSON.parse(data.substring(28, data.length-1));
            
            if(data != null) {
                for(var thumb=0;thumb<_data.length;thumb++) {
                    resources.push(new ig.Image(_BASEPATH.thumbnail + _data[thumb].thumbnail));
                }
            }
        },

        handleErrorChapterList:function(data) {
            console.log('error');
        },

        end:function(){
            this._endParent = this.parent;
            this._drawStatus = 1;
            
            if (_SETTINGS['TapToStartAudioUnlock']['Enabled']) {
                this.tapToStartDiv(function() {
                    /* play game */
                    this._endParent();
                    if (typeof (ig.game) === 'undefined' || ig.game == null) {
                        ig.system.setGame( this.gameClass );
                    }
                }.bind(this));
            }
            else {
                /* play game */
                this._endParent();
                
                if (typeof (ig.game) === 'undefined' || ig.game == null) {
                    ig.system.setGame( this.gameClass );
                }
            }

            // CLEAR CUSTOM ANIMATION TIMER
            // window.clearInterval(ig.loadingScreen.animationTimer);

            this.draw();
        },
        
        tapToStartDiv:function( onClickCallbackFunction ){
            this.desktopCoverDIV = document.getElementById(this.tapToStartDivId);
            
            // singleton pattern
            if ( this.desktopCoverDIV ) {
                return;
            }
            
            /* create DIV */
            this.desktopCoverDIV = document.createElement("div");
            this.desktopCoverDIV.id = this.tapToStartDivId;
            this.desktopCoverDIV.setAttribute("class", "play");
            this.desktopCoverDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
            this.desktopCoverDIV.innerHTML = "<div style='color:white;background-color: rgba(255, 255, 255, 0.3); border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: montserrat;'>" + _STRINGS["Splash"]["TapToStart"] + "</div></div>";
            
            
            /* inject DIV */
            var parentDIV = document.getElementById("play").parentNode || document.getElementById("ajaxbar");
            parentDIV.appendChild(this.desktopCoverDIV);
            
            /* reize DIV */
            try {
                if ( typeof (ig.sizeHandler) !== "undefined" ) {
                    if ( typeof (ig.sizeHandler.coreDivsToResize) !== "undefined" ) {
                        ig.sizeHandler.coreDivsToResize.push( ("#"+this.tapToStartDivId) );
                        if ( typeof (ig.sizeHandler.reorient) === "function" ) {
                            ig.sizeHandler.reorient();
                        }
                    }
                }
                else if ( typeof (coreDivsToResize) !== "undefined" ) {
                    coreDivsToResize.push(this.tapToStartDivId);
                    if ( typeof (sizeHandler) === "function" ) {
                        sizeHandler();
                    }
                }
            } catch (error) {
                console.log(error);
            }
            
            
            /* click DIV */
            this.desktopCoverDIV.addEventListener("click", function(){
                ig.soundHandler.unlockWebAudio();
            
                /* hide DIV */
                this.setAttribute("style", "visibility: hidden;");
            
                /* end function */
                if ( typeof (onClickCallbackFunction) === "function" ) {
                    onClickCallbackFunction();
                }
            });
        },

        repos: function () {
            // var r1 = this.bg.width / this.bg.height, //ratio image
            //     r2 = ig.system.width / ig.system.height; //ratio window
            // if (r1 > r2) {
            //     this.bgH = this.bg.height;
            //     this.bgW = this.bgH * r2;
            //     this.bgX = (this.bg.width - this.bgW) / 2;
            //     this.bgY = 0;
            // } else {
            //     this.bgW = this.bg.width;
            //     this.bgH = this.bgW / r2;
            //     this.bgX = 0;
            //     this.bgY = (this.bg.height - this.bgH) / 2;

            //     // this.bgY = this.bg.height - this.bgH; //align bawah
            // }

            // DIMENSIONS OF LOADING BAR
            this.bar.w = ig.system.width*0.25;
            this.bar.h = 30*_DATAGAME.ratioRes;
            this.bar.x = (ig.system.width -this.bar.w)/2;

            this.bar.y = ig.system.height * 0.67;

            this.stageSize.x=ig.system.width;
            this.stageSize.y=ig.system.height;
        },

        drawCheck: 0,
        bgLoad:0,
        draw: function() {
            if(ig.system.width!=this.stageSize.x||ig.system.height!=this.stageSize.y){
                this.repos();
            }
            this._drawStatus += (this.status - this._drawStatus)/5;
            
            //Check the game screen. see if the font are loaded first. Removing the two lines below is safe :)
            if(this.drawCheck === 1) console.log('Font should be loaded before loader draw loop');
            if(this.drawCheck < 2) this.drawCheck ++;

            ig.system.context.fillStyle=_DATAGAME.uiColor[_DATAGAME.uiTheme].basebg;
            ig.system.context.fillRect(0,0,ig.system.width,ig.system.height);
        
                     
            // if(this.bgLoad<=5){
            //     this.cvsBG=document.createElement("canvas");
            //     this.cvsBG.width=ig.system.width;
            //     this.cvsBG.height=ig.system.height;
            //     this.ctxBG=this.cvsBG.getContext("2d");

            //     var a=0;
            //     while(a<ig.system.width){
            //         this.bg.drawImageCtx(this.ctxBG,0,0,276,1920,a,0,276,ig.system.height);
            //         a+=276;
            //     }
            //     this.bgLoad++;
            // }                
            // else ig.system.context.drawImage(this.cvsBG,0,0);
            
            // if(this.bg.width > 0 && this.boolReloadBG) {
            //     this.repos(); this.boolReloadBG = false; 
            // }

            // if(this.bg.width > 0 ) {
            //     this.bg.draw(0, 0, this.bgX, this.bgY, this.bgW, this.bgH, ig.system.width, ig.system.height);
            // }

            if (this.title.width > 0) {
                var ratioW = (_DATAGAME.enableTitleLoader) ? this.title.width : _DATAGAME.brandWidth;
                var ratioTitle = ratioW / this.title.width;
                var ratioH = this.title.height * ratioTitle;

                var scaleRatioTitle = 1;
                if(_DATAGAME.enableTitleLoader) {
                    if(ig.system.width < this.title.width) {
                        scaleRatioTitle = ig.sizeHandler.minW / this.title.width;
                    }
                    ratioW = this.title.width;
                    ratioH = this.title.height
                }

                this.title.draw(
                    (ig.system.width-ratioW*scaleRatioTitle)*0.5, ig.system.height*0.35 - ratioH*scaleRatioTitle*0.5, 
                    0, 0,
                    this.title.width, this.title.height,
                    ratioW*scaleRatioTitle, ratioH*scaleRatioTitle
                );       
            }  

            // if (this.title.width > 0) {
            //     this.title.draw((ig.system.width-this.title.width)*0.5, ig.system.height*0.35 - this.title.height*0.5);         
            // }    
            
            // if(this.title)this.title.drawImage(0,0);
            
            var s=ig.system.scale;
            // DRAW LOADING BAR
             ig.system.context.lineWidth = this.bar.h*1.5;
            ig.system.context.lineCap = 'round';
            ig.system.context.strokeStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].barStroke;
            ig.system.context.beginPath();
            ig.system.context.moveTo(this.bar.x, this.bar.y);
            ig.system.context.lineTo(this.bar.x + this.bar.w, this.bar.y);
            ig.system.context.stroke();
            ig.system.context.closePath();

            ig.system.context.lineWidth = this.bar.h;
            ig.system.context.strokeStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].bar;
            ig.system.context.beginPath();
            ig.system.context.moveTo(this.bar.x, this.bar.y);
            ig.system.context.lineTo(this.bar.x + this.bar.w*this._drawStatus, this.bar.y);
            ig.system.context.stroke();
            ig.system.context.closePath();

            ig.system.context.fillStyle = '#000';
            ig.system.context.font = (16*_DATAGAME.ratioRes) + "px montserrat";

            // DRAW LOADING TEXT
            ig.system.context.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].barStroke; //'#FFFFFF'
            ig.system.context.font = (25*_DATAGAME.ratioRes) + "px metroblack";

            var text = 'Loading engine . . .';
            var xpos,ypos;
            xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;
            ypos = this.bar.y*s - 40*_DATAGAME.ratioRes;

            var pointLoad = "";
            if(this.numLoading == 0) { pointLoad = ""; }
            else if(this.numLoading == 1) { pointLoad = "."; }
            else if(this.numLoading == 2) { pointLoad = ". ."; }
            else if(this.numLoading == 3) { pointLoad = ". . ."; }
            
            ig.system.context.fillText('Loading engine ' + pointLoad, xpos, ypos );

            this.counterLoading++;
            if(this.counterLoading % this.modLoading == 0) {
                this.numLoading++;
            }
            if(this.numLoading>= 4) this.numLoading =0;

            this.drawVersion();
        },

        drawVersion: function() {
            if (typeof(_SETTINGS.Versioning) !== "undefined" && _SETTINGS.Versioning !== null) {
                if (_SETTINGS.Versioning.DrawVersion) {
                    var ctx = ig.system.context;
                    fontSize = _SETTINGS.Versioning.FontSize,
                    fontFamily = _SETTINGS.Versioning.FontFamily,
                    fillStyle = _SETTINGS.Versioning.FillStyle

                    ctx.save();
                    ctx.textBaseline="bottom";
                    ctx.textAlign="left";
                    ctx.font = fontSize + " " + fontFamily || "10px Arial";
                    ctx.fillStyle = fillStyle || '#ffffff';
                    ctx.fillText("v" + _SETTINGS.Versioning.Version + "+build." + _SETTINGS.Versioning.Build, 10, ig.system.height - 10);
                    ctx.restore();
                }
            }
        }
    });
});
