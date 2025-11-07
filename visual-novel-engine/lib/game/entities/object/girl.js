ig.module('game.entities.object.girl')
.requires(
    'impact.entity',
    'game.entities.object.char',
    'plugins.spriter.spriter-display',
    'plugins.spriter.scml'
)
.defines(function() {
    SpriterGirl = SpriterChar.extend({
        charName:'amy',
        mainFolder:'girl',
        // timePausePose: [ 0 , 1200, 900, 1100, 900, 0, 900, 0, 0, 0, 0 ],
        spriter: null,
        scmlSprite: new SpriterScml(_RESOURCESINFO.spriter.girl),
        
        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.spriter = ig.game.spawnEntity(SpriterDisplay, ig.game.midX, ig.game.midY, { scml: this.scmlSprite, zIndex:_DATAGAME.zIndexData.spriter });

            this.changePoseDefault('idle');

            this.timerTalking = new ig.Timer(0.5); 

            this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
        },

        changeDU:function(duName) {
            duName = duName.toLowerCase().replaceAll(" ", "");  
            // console.log("changedu : " + duName);
            var isLongSkirt = (_DATAGAME.spriterData[duName].girl.bottom.substr(0, 17) == "bottom-long-skirt") ? true : false;
            var shoesType = "normal";

            if(_DATAGAME.spriterData[duName].girl.shoes.substr(0, 10) == 'shoes-heel') shoesType = 'heel';
            else if(_DATAGAME.spriterData[duName].girl.shoes.substr(0, 13) == 'shoes-sneaker') shoesType = 'sneaker';
            else if(_DATAGAME.spriterData[duName].girl.shoes.substr(0, 10) == 'shoes-boot') shoesType = 'boot';

            for(var part=1;part<=13;part++){
                var _partName = 'skin';
                if(part == 2) _partName = 'face';
                else if(part == 3) _partName = 'hair';
                else if(part == 4) _partName = 'top';
                else if(part == 5) _partName = 'bottom';
                else if(part == 6) _partName = 'shoes';
                else if(part == 7) _partName = 'glasses';
                else if(part == 8) _partName = 'earrings';
                else if(part == 9) _partName = 'hat';
                else if(part == 10) _partName = 'beard';
                else if(part == 11) _partName = 'anklet';
                else if(part == 12) _partName = 'bracelet';
                else if(part == 13) _partName = 'necklace';

                // if(part == 7 && _DATAGAME.spriterData[duName].girl.glasses == null) {}
                // else if(part == 8 && _DATAGAME.spriterData[duName].girl.earrings == null) {}
                // else if(part == 9 && _DATAGAME.spriterData[duName].girl.hat == null) {}
                // else if(part == 10 && _DATAGAME.spriterData[duName].girl.beard == null) {}
                // else if(part == 11 && _DATAGAME.spriterData[duName].girl.anklet == null) {}
                // else if(part == 12 && _DATAGAME.spriterData[duName].girl.bracelet == null) {}
                // else if(part == 13 && _DATAGAME.spriterData[duName].girl.necklace == null) {}
                if(part >= 7 && _DATAGAME.spriterData[duName].girl[_partName] == null) {}
                else {
                    for(var bone=0;bone<_DATAGAME.girlPart[part].length;bone++) {
                        var _tempPartName = _DATAGAME.girlPart[part][bone];

                        if(part == 5 && _DATAGAME.girlPart[part][bone] == '0_leg-left-cross') {
                            _tempPartName = '0_leg-left';
                        } else if(part == 5 && _DATAGAME.girlPart[part][bone] == '0_leg-right-cross') {
                            _tempPartName = '0_leg-right';
                        }

                        var newPart = new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[duName].girl[_partName] + '/' + _tempPartName + '.png');
                        
                        if (_partName == 'shoes') {
                            if (!isLongSkirt) {
                                if (shoesType == 'sneaker' || shoesType == 'boot') {
                                    var newPartSneaker = new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[duName].girl.skin + '/' + _DATAGAME.girlPart[part][bone] + '.png');

                                    if(_DATAGAME.girlPart[part][bone] == '0_sock' || _DATAGAME.girlPart[part][bone] == '0_sock-rear') {
                                        this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPartSneaker, 0, 0, true, newPart);
                                    }
                                    else {
                                        this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPart, 0, 0, true);
                                    }
                                }
                                else if (shoesType == 'heel') {
                                    var heelName = '-heel.png';

                                    if(_DATAGAME.girlPart[part][bone] == '0_sock' || _DATAGAME.girlPart[part][bone] == '0_sock-rear') heelName = '.png';

                                    var newPartFeet = new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[duName].girl.skin + '/' + _DATAGAME.girlPart[part][bone] + heelName);
                                    this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPartFeet, 0, 0, true, newPart);
                                } else {
                                    var newPartFeet = new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[duName].girl.skin + '/' + _DATAGAME.girlPart[part][bone] + '.png');
                                    this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPartFeet, 0, 0, true, newPart);
                                    // this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPart, 0, 0, false);
                                }
                            }
                        } else {
                            if(part == 3 || part== 4 || part == 5 || part == 6) {
                                var newPartSkin = new ig.Image(_BASEPATH.spriter + 'girl/' + _DATAGAME.spriterData[duName].girl['skin'] + '/' + _DATAGAME.girlPart[part][bone] + '.png');
                                this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPartSkin, 0, 0, true, newPart);
                            } else {
                                this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPart, 0, 0, true, newPart);
                            }
                            // this.spriter.attachImage(_DATAGAME.girlPart[part][bone] + '.png', newPart, 0, 0, false);
                        }

                        // if(_partName == 'skin') {
                        //     ig.game.consoleLog(_DATAGAME.girlPart[part][bone] + ' : ' + newPart.width + ' ' + newPart.height);
                        // }
                    }
                }

                if(isLongSkirt) {
                    for(var boneb=0;boneb<_DATAGAME.girlPart[0].length;boneb++) {
                        var newPart = new ig.Image(_BASEPATH.spriter + 'girl/blank/' + _DATAGAME.girlPart[0][boneb] + '.png');
                        this.spriter.attachImage(_DATAGAME.girlPart[0][boneb] + '.png', newPart, 0, 0, true, newPart);
                        // this.spriter.attachImage(_DATAGAME.girlPart[0][boneb] + '.png', newPart, 0, 0, true);
                    }
                } 
            }
        },

        draw:function(){
            this.parent();

        }
    });
});