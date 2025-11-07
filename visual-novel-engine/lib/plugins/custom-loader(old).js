// /**
// * Entity patch to ignore the res position update in entity
// */

// ig.module(
//     "plugins.custom-loader"
// ).requires(
//     'impact.game'
// ).defines(function () {
//     //inject
//     ig.Game.inject({
//     	statusLoad:[0],
//         counterLoading:0,
//         modLoading:10,
//     	numLoading:0,
//         totalItems:0,
//     	totalLoaded:0,
//     	isDrawLoadingScreen:false,
//     	bar:{},
//         title: new ig.Image(_RESOURCESINFO.image.brand),

//     	loadAssets: function() {
//             this.numLoading = 0;
// 			var arrayImages = [];
// 			var arraySounds = [];
//             var arrayBGM = [];

//             var idxChapter = (_CUSTOMLOAD.Chapter.map(function(e) { return e.chapterID; }).indexOf('Chapter' + ig.game.numChapter));

//             if(!_DATAGAME.simplifiedUI || _DATAGAME.enableTitleLoader) {
//                 arrayImages.push(new ig.Image(_RESOURCESINFO.image.title));
//             }

//             if(_DATAGAME.enableTitleLoader) {
//                 this.title = new ig.Image(_RESOURCESINFO.image.title);
//             }

//             //ADD VARIABLE
//             if(_CUSTOMLOAD.Chapter[idxChapter].variable != null && _CUSTOMLOAD.Chapter[idxChapter].variable.length>0) {
//                 for(var varBool=0;varBool<_CUSTOMLOAD.Chapter[idxChapter].variable.length;varBool++) {
//                     if(ig.game.sessionData[_CUSTOMLOAD.Chapter[idxChapter].variable[varBool]] == null) {
//                         ig.game.sessionData.varScript.push(_CUSTOMLOAD.Chapter[idxChapter].variable[varBool]);
//                         ig.game.save(_CUSTOMLOAD.Chapter[idxChapter].variable[varBool], false);
//                     }
//                 }
//             }

//             //ADD VOICE OVER
//             if(_DATAGAME.enableVoiceOver && _CUSTOMLOAD.Chapter[idxChapter].voiceover != null && _CUSTOMLOAD.Chapter[idxChapter].voiceover.length>0) {
//                 for(var vo=0;vo<_CUSTOMLOAD.Chapter[idxChapter].voiceover.length;vo++) {
//                     var sceneID = _CUSTOMLOAD.Chapter[idxChapter].voiceover[vo];
//                     var charTalk = _STRINGS["Chapter" + ig.game.numChapter][sceneID].charTalk;
//                     var voName = 'chapter' + ig.game.numChapter + '_' + sceneID;
                    
//                     if(_DATAGAME.dynamic_name.indexOf(charTalk)>=0) {
//                         ig.soundHandler.soundInfo.sfx[voName + '_boy'] = { path:_BASEPATH.voiceover + voName + '_boy' };
//                         ig.soundHandler.soundInfo.sfx[voName + '_girl'] = { path:_BASEPATH.voiceover + voName + '_girl' };

//                         ig.soundHandler.sfxPlayer.addAudioData(ig.soundHandler.soundInfo.sfx[voName + '_boy'], voName + '_boy');
//                         ig.soundHandler.sfxPlayer.addAudioData(ig.soundHandler.soundInfo.sfx[voName + '_girl'], voName + '_girl');

//                         arraySounds.push(ig.soundHandler.sfxPlayer.loadSound(voName + '_boy'));
//                         arraySounds.push(ig.soundHandler.sfxPlayer.loadSound(voName + '_girl'));
//                     }
//                     else {
//                         ig.soundHandler.soundInfo.sfx[voName] = { path:_BASEPATH.voiceover + voName };
//                         ig.soundHandler.sfxPlayer.addAudioData(ig.soundHandler.soundInfo.sfx[voName], voName);
//                         arraySounds.push(ig.soundHandler.sfxPlayer.loadSound(voName));
//                     }
//                 }
//             }
//             // ig.soundHandler.soundInfo.sfx['chapter1_1'] = { path:_BASEPATH.sfx + "chapter1_1" };
//             // ig.soundHandler.sfxPlayer.addVoiceOver(ig.soundHandler.soundInfo.sfx['chapter1_1'], 'chapter1_1');

//             //ADD OBJECT
//             if(_CUSTOMLOAD.Chapter[idxChapter].object != null && _CUSTOMLOAD.Chapter[idxChapter].object.length>0) {
//                 for(var obj=0;obj<_CUSTOMLOAD.Chapter[idxChapter].object.length;obj++) {
//                      arrayImages.push(new ig.Image(_BASEPATH.object + _CUSTOMLOAD.Chapter[idxChapter].object[obj] + '.png'));
//                 }
//             }

// 			//ADD BG
//             if(_CUSTOMLOAD.Chapter[idxChapter].bg != null && _CUSTOMLOAD.Chapter[idxChapter].bg.length>0) {
//                 for(var bg=0;bg<_CUSTOMLOAD.Chapter[idxChapter].bg.length;bg++) {
//                     var fileBGName = _BASEPATH.background + _CUSTOMLOAD.Chapter[idxChapter].bg[bg];
//                     var bgName = _CUSTOMLOAD.Chapter[idxChapter].bg[bg];
//                     try {
//                         $.ajax(fileBGName + '.png', 
//                             {
//                                 success:this.handleSuccess.bind(this, bgName, arrayImages),
//                                 error:this.handleError.bind(this, bgName, arrayImages)
//                             }
//                         );
//                     } catch(e){}
//                 }
//                 // ig.game.consoleLog(_DATAGAME.BGFileType);
//             }

//             //ADD SFX
//             if(_CUSTOMLOAD.Chapter[idxChapter].sfx != null && _CUSTOMLOAD.Chapter[idxChapter].sfx.length>0) {
//                 for(var sfx=0;sfx<_CUSTOMLOAD.Chapter[idxChapter].sfx.length;sfx++) {
//                     // arraySounds.push(ig.soundHandler.sfxPlayer.loadSound(_CUSTOMLOAD.Chapter[idxChapter].sfx[sfx]));
//                     var _sfxName = _CUSTOMLOAD.Chapter[idxChapter].sfx[sfx];
//                     ig.soundHandler.soundInfo.sfx[_sfxName] = { path:_BASEPATH.sfx + _sfxName };
//                     ig.soundHandler.sfxPlayer.addAudioData(ig.soundHandler.soundInfo.sfx[_sfxName], _sfxName);
//                     arraySounds.push(ig.soundHandler.sfxPlayer.loadSound(_sfxName));
//                 }
//             }

//             //ADD BGM
//             if(_CUSTOMLOAD.Chapter[idxChapter].bgm != null && _CUSTOMLOAD.Chapter[idxChapter].bgm.length>0) {
//                 for(var bgm=0;bgm<_CUSTOMLOAD.Chapter[idxChapter].bgm.length;bgm++) {
//                     var bgmName = _CUSTOMLOAD.Chapter[idxChapter].bgm[bgm].replaceAll("-", "");
//                     var filebgmName = _CUSTOMLOAD.Chapter[idxChapter].bgm[bgm];
//                     // arrayBGM.push(ig.soundHandler.bgmPlayer.loadSound(bgmName));
//                     ig.soundHandler.soundInfo.bgm[bgmName] = { path:_BASEPATH.bgm + filebgmName, loop: true };
//                     ig.soundHandler.bgmPlayer.addAudioData(ig.soundHandler.soundInfo.bgm[bgmName], bgmName);
//                     arrayBGM.push(ig.soundHandler.bgmPlayer.loadSound(bgmName));
//                 }
//             }

//             var arrayBoy = [];
//             var arrayGirl = [];
//             // var arrayHaveRearGirl = [];
//             // var arrayHaveRearBoy = [];

//             if(_CUSTOMLOAD.Chapter[idxChapter].outfit != null && _CUSTOMLOAD.Chapter[idxChapter].outfit.length>0) {
//                 for(var outf=0;outf<_CUSTOMLOAD.Chapter[idxChapter].outfit.length;outf++) {
//                     var outfitName = _CUSTOMLOAD.Chapter[idxChapter].outfit[outf];
//                     var _folderName = outfitName.toLowerCase();
//                     _folderName = _folderName.replaceAll(" ", "");

//                     if(_DATAGAME.spriterData[_folderName].girl != null) {
//                         arrayGirl.push(_folderName);
//                     }
                    
//                     if(_DATAGAME.spriterData[_folderName].boy != null) {
//                         arrayBoy.push(_folderName);
//                     }
//                 }
//             }

//             if(_CUSTOMLOAD.Chapter[idxChapter].character != null && _CUSTOMLOAD.Chapter[idxChapter].character.length>0) {
//                 for(var char=0;char<_CUSTOMLOAD.Chapter[idxChapter].character.length;char++) {
//                     var charName = _CUSTOMLOAD.Chapter[idxChapter].character[char];
//                     var folderName = charName.toLowerCase();
//                     folderName = folderName.replaceAll(" ", "");

//                     if(_DATAGAME.dynamic_name.indexOf(charName) >=0) {
//                         arrayGirl.push(charName);
//                         arrayBoy.push(charName);
//                     } 
//                     else if(_DATAGAME.neutral_girl.indexOf(charName) >=0) {
//                      	arrayGirl.push(charName);
//                     }
//                     else if(_DATAGAME.neutral_boy.indexOf(charName) >=0) {
//                      	arrayBoy.push(charName);
//                     }
//                 }
//             }

//             if(arrayGirl.length > 0) { this.loadBlank(arrayGirl, arrayImages); }

//             //ADD IMAGE GIRL SPRITER
//             if(_CUSTOMLOAD.Chapter[idxChapter].duTheme != null && _CUSTOMLOAD.Chapter[idxChapter].duTheme.length>0) {
//                 this.loadGirlSpriter(_CUSTOMLOAD.Chapter[idxChapter].duTheme, arrayImages);
//             }

//             if(arrayGirl.length > 0) { this.loadGirlSpriter(arrayGirl, arrayImages); }

//             //ADD IMAGE BOY SPRITER
//             if(arrayBoy.length > 0) { this.loadBoySpriter(arrayBoy, arrayImages); }

//             this.resetLoadScreen(arrayImages, arraySounds, arrayBGM);

// 		},

//         handleSuccess:function(bgName, arrayImages) {
//             arrayImages.push(new ig.Image(_BASEPATH.background + bgName + '.png'));
//             _DATAGAME.BGFileType[bgName] = 'png';
//             // ig.game.consoleLog('success : ' + bgName);
//         },

//         handleError:function(bgName, arrayImages) {
//            arrayImages.push(new ig.Image(_BASEPATH.background + bgName + '.jpg'));
//             _DATAGAME.BGFileType[bgName] = 'jpg';
//             // ig.game.consoleLog('error : ' + bgName);
//         },

//         loadBlank:function(arrName, resources) {
//         //     for(var bone=0;bone<_DATAGAME.girlPart[8].length;bone++) {
//         //         resources.push(new ig.Image(_BASEPATH.spriter + 'girl/blank/' + _DATAGAME.girlPart[8][bone] + '.png'));
//         //     }
//         },

// 		loadBoySpriter:function(arrName, resources) {
//             for(var date=0;date<arrName.length;date++) {
//                 var folderName = arrName[date].toLowerCase();
//                 folderName = folderName.replaceAll(" ", "");

//                 for(var part=1;part<=13;part++){
//                     var _partName = 'skin';
//                     if(part == 2) _partName = 'face';
//                     else if(part == 3) _partName = 'hair';
//                     else if(part == 4) _partName = 'top';
//                     else if(part == 5) _partName = 'bottom';
//                     else if(part == 6) _partName = 'shoes';
//                     else if(part == 7) _partName = 'glasses';
//                     else if(part == 8) _partName = 'earrings';
//                     else if(part == 9) _partName = 'hat';
//                     else if(part == 10) _partName = 'beard';
//                     else if(part == 11) _partName = 'anklet';
//                     else if(part == 12) _partName = 'bracelet';
//                     else if(part == 13) _partName = 'necklace';

//                     // if(part == 7 && _DATAGAME.spriterData[folderName].boy.glasses == null) {}
//                     // else if(part == 8 && _DATAGAME.spriterData[folderName].boy.earrings == null) {}
//                     // else if(part == 9 && _DATAGAME.spriterData[folderName].boy.hat == null) {}
//                     // else if(part == 10 && _DATAGAME.spriterData[folderName].boy.beard == null) {}
//                     if(part >= 7 && _DATAGAME.spriterData[folderName].boy[_partName] == null) {}
//                     else {
//                         for(var bone=0;bone<_DATAGAME.boyPart[part].length;bone++) {
//                             if((part == 5 && _DATAGAME.boyPart[part][bone] == '0_leg-left-cross') || (part == 5 && _DATAGAME.boyPart[part][bone] == '0_leg-right-cross')) {
                            
//                             } else {    
//                                 resources.push(new ig.Image(_BASEPATH.spriter + 'boy/' + _DATAGAME.spriterData[folderName].boy[_partName] + '/' + _DATAGAME.boyPart[part][bone] + '.png'));
//                             }
//                         }
//                     }
//                 }
//             }
//         },

//         loadGirlSpriter:function(arrName, resources) {
//             for(var theme=0;theme<arrName.length;theme++) {
//                 var folderName = arrName[theme].toLowerCase();
//                 folderName = folderName.replaceAll(" ", "");

//                 for(var part=1;part<=13;part++){
//                     var _partName = 'skin';
//                     if(part == 2) _partName = 'face';
//                     else if(part == 3) _partName = 'hair';
//                     else if(part == 4) _partName = 'top';
//                     else if(part == 5) _partName = 'bottom';
//                     else if(part == 6) _partName = 'shoes';
//                     else if(part == 7) _partName = 'glasses';
//                     else if(part == 8) _partName = 'earrings';
//                     else if(part == 9) _partName = 'hat';
//                     else if(part == 10) _partName = 'beard';
//                     else if(part == 11) _partName = 'anklet';
//                     else if(part == 12) _partName = 'bracelet';
//                     else if(part == 13) _partName = 'necklace';

//                     // if(part == 7 && _DATAGAME.spriterData[folderName].girl.glasses == null) {}
//                     // else if(part == 8 && _DATAGAME.spriterData[folderName].girl.earrings == null) {}
//                     // else if(part == 9 && _DATAGAME.spriterData[folderName].girl.hat == null) {}
//                     if(part >= 7 && _DATAGAME.spriterData[folderName].girl[_partName] == null) {}
//                     else {
//                         for(var bone=0;bone<_DATAGAME.girlPart[part].length;bone++) {
//                             if((part == 5 && _DATAGAME.girlPart[part][bone] == '0_leg-left-cross') || (part == 5 && _DATAGAME.girlPart[part][bone] == '0_leg-right-cross')) {

//                             } else {    
//                                 resources.push(new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[folderName].girl[_partName] + '/' + _DATAGAME.girlPart[part][bone] + '.png'));
//                             }
//                         }
//                     }
//                 }
//             }
//         },

//         // loadBoySpriterRear:function(arrName, resources) {
//         //     for(var date=0;date<arrName.length;date++) {
//         //         var folderName = arrName[date].toLowerCase();
//         //         folderName = folderName.replaceAll(" ", "");

//         //         for(var boneb=0;boneb<_DATAGAME.boyPartRear.length;boneb++) {
//         //             resources.push(new ig.Image(_BASEPATH.spriter + 'boy/' + _DATAGAME.spriterData[folderName].boy + '/' + _DATAGAME.boyPartRear[boneb] + '.png'));
//         //         }
//         //     }
//         // },

//         // loadGirlSpriterRear:function(arrName, resources) {
//         //     for(var date=0;date<arrName.length;date++) {
//         //         var folderName = arrName[date].toLowerCase();
//         //         folderName = folderName.replaceAll(" ", "");

//         //         for(var boneb=0;boneb<_DATAGAME.girlPartRear.length;boneb++) {
//         //             resources.push(new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[folderName].girl + '/' + _DATAGAME.girlPartRear[boneb] + '.png'));
//         //         }
//         //     }
//         // },

// 		resizeLayerLoading:function(){
// 			/* reize DIV */
// 			try {
// 				if(typeof(ig.sizeHandler) !== "undefined") {
// 					if(typeof(ig.sizeHandler.coreDivsToResize) !== "undefined") {
// 						ig.sizeHandler.coreDivsToResize.push(("#loadingScreen"));
// 						// ig.sizeHandler.coreDivsToResize.push(("#" + this.loadingID));
// 						if(typeof(ig.sizeHandler.reorient) === "function") {
// 							ig.sizeHandler.reorient();
// 						}
// 					}
// 				} else if(typeof(coreDivsToResize) !== "undefined") {
// 					coreDivsToResize.push('loadingScreen');
// 					// coreDivsToResize.push(this.loadingID);
// 					if(typeof(sizeHandler) === "function") {
// 						sizeHandler();
// 					}
// 				}
// 			} catch(error) {
// 				console.log(error);
// 			}
// 		},

// 		resetLoadScreen:function(arrImages, arrAudio, arrBGM){
// 			this.statusLoad[ig.game.numChapter]=0;
// 	    	this.totalItems=0;
// 	    	this.totalLoaded=0;
// 	    	this.resourcesAudio=arrAudio;
//             this.resourcesBGM=arrBGM;
// 	    	this.resourcesImages=arrImages;

// 	    	this.totalItems=this.resourcesImages.length+this.resourcesAudio.length+this.resourcesImages.length;
// 		},

// 		drawLoadingScreen:function(){
//             ig.system.context.save();
//             ig.system.context.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].basebg;
//             ig.system.context.fillRect(0,0,ig.system.width,ig.system.height);
//             ig.system.context.restore();

//             if (this.title.width > 0) {
//                 var ratioW = (_DATAGAME.enableTitleLoader) ? this.title.width : _DATAGAME.brandWidth;
//                 var ratioTitle = ratioW / this.title.width;
//                 var ratioH = this.title.height * ratioTitle;
//                 this.title.draw(
//                     (ig.system.width-ratioW)*0.5, ig.system.height*0.35 - ratioH*0.5, 
//                     0, 0,
//                     this.title.width, this.title.height,
//                     ratioW, ratioH
//                 );       
//             }  
            
// 			this._drawStatus = this.totalLoaded/this.totalItems;

//    			this.bar.w = ig.system.width*0.25;
//             this.bar.h = 30*_DATAGAME.ratioRes;
//             this.bar.x = (ig.system.width -this.bar.w)/2;

//             this.bar.y = ig.system.height * 0.67;

//    			var s=ig.system.scale;
//             // DRAW LOADING BAR
//             // ig.system.context.lineWidth = this.bar.h*1.7;
//             // ig.system.context.lineCap = 'round';
//             // ig.system.context.strokeStyle = '#FFFFFF';
//             // ig.system.context.beginPath();
//             // ig.system.context.moveTo(this.bar.x, this.bar.y);
//             // ig.system.context.lineTo(this.bar.x + this.bar.w, this.bar.y);
//             // ig.system.context.stroke();
//             // ig.system.context.closePath();

//             ig.system.context.lineWidth = this.bar.h*1.5;
//             ig.system.context.lineCap = 'round';
//             ig.system.context.strokeStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].barStroke;//'#000000'
//             ig.system.context.beginPath();
//             ig.system.context.moveTo(this.bar.x, this.bar.y);
//             ig.system.context.lineTo(this.bar.x + this.bar.w, this.bar.y);
//             ig.system.context.stroke();
//             ig.system.context.closePath();

//             ig.system.context.lineWidth = this.bar.h;
//             ig.system.context.strokeStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].bar;//'#FFFFFF'
//             ig.system.context.beginPath();
//             ig.system.context.moveTo(this.bar.x, this.bar.y);
//             ig.system.context.lineTo(this.bar.x + this.bar.w*this._drawStatus, this.bar.y);
//             ig.system.context.stroke();
//             ig.system.context.closePath();

//             // DRAW LOADING TEXT
//             ig.system.context.fillStyle = _DATAGAME.uiColor[_DATAGAME.uiTheme].barStroke; //'#FFFFFF'
//             ig.system.context.font = ig.game.fontNameWeight + ' ' + Math.round(ig.game.fontNameSize*0.45*_DATAGAME.ratioRes*ig.game.fontRatio) + "px " + ig.game.fontName;

//             var text = _STRINGS.Splash["LoadingCustom"];
//             var xpos,ypos;
//             xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;
//             ypos = this.bar.y*s - 40*_DATAGAME.ratioRes;

//             var pointLoad = "";
//             if(this.numLoading == 0) { pointLoad = ""; }
//             else if(this.numLoading == 1) { pointLoad = "."; }
//             else if(this.numLoading == 2) { pointLoad = ". ."; }
//             else if(this.numLoading == 3) { pointLoad = ". . ."; }
            
//             ig.system.context.fillText(_STRINGS.Splash["LoadingCustomText"] + pointLoad, xpos, ypos );

//             this.counterLoading++;
//             if(this.counterLoading % this.modLoading == 0) {
//                 this.numLoading++;
//             }
//             if(this.numLoading>= 4) this.numLoading =0;
// 		},

// 		showLoadingScreen:function(callBack){
// 			this.callBackLoad=callBack;

// 			this.isDrawLoadingScreen=true;
// 		},

// 		hideLoadingScreen:function(){
// 			if(this.callBackLoad)this.callBackLoad();
			
// 			this.isDrawLoadingScreen=false;
// 		},

// 		draw:function(){
// 			this.parent();
// 			if(this.isDrawLoadingScreen)this.drawLoadingScreen();
// 		},
// 		update:function(){
// 			this.parent();
			
// 			if(this.totalLoaded<this.totalItems)//checking item's load status
// 			{
// 				for(var i=0;i<this.resourcesImages.length;i++)
// 				{
// 					if(this.resourcesImages[i].loaded){
// 						this.resourcesImages.splice(i,1);
// 						this.totalLoaded++;
// 					}
// 				}

// 				for(var j=0;j<this.resourcesAudio.length;j++)
// 				{
// 					if(ig.soundHandler.sfxPlayer.soundList[this.resourcesAudio[j]].state()=="loaded"){
// 						this.resourcesAudio.splice(j,1);
// 						this.totalLoaded++;
// 					}
// 				}

//                 for(var k=0;k<this.resourcesBGM.length;k++)
//                 {
//                     if(ig.soundHandler.bgmPlayer.soundList[this.resourcesBGM[k]].state()=="loaded"){
//                         this.resourcesBGM.splice(k,1);
//                         this.totalLoaded++;
//                     }
//                 }
				
// 			}
// 			if(this.isDrawLoadingScreen&&this.resourcesAudio.length==0&&this.resourcesBGM.length==0&&this.resourcesImages.length==0){
//                 ig.game.consoleLog('load chapter' + ig.game.numChapter);
// 				this.statusLoad[ig.game.numChapter]=1;
// 				this.hideLoadingScreen();
// 			}
// 		}
//     });
// });