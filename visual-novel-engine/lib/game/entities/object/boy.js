ig.module('game.entities.object.boy')
.requires(
	'impact.entity',
    'game.entities.object.char',
    'plugins.spriter.spriter-display',
    'plugins.spriter.scml'
)
.defines(function() {
    SpriterBoy = SpriterChar.extend({
        charName:'jack',
        mainFolder:'boy',
        // timePausePose: [ 0 , 1200, 900, 1100, 900, 0, 900, 0, 0, 0, 0 ],
        spriter: null,
        scmlSprite: new SpriterScml(_RESOURCESINFO.spriter.boy),
        
        init:function(x,y,settings){
            this.parent(x,y,settings);

            this.spriter = ig.game.spawnEntity(SpriterDisplay, ig.game.midX, ig.game.midY, { scml: this.scmlSprite, zIndex:_DATAGAME.zIndexData.spriter });

            this.timerTalking = new ig.Timer(0.5);

            this.changePoseDefault('idle');

            this.calculateShadow(_DATAGAME.pose.indexOf(this.poseNow));
        },

        changeDU:function(duName) {
            duName = duName.toLowerCase().replaceAll(" ", "");  

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

                // ig.game.consoleLog(part + _DATAGAME.spriterData[duName].boy.hat);

                // if(part == 7 && _DATAGAME.spriterData[duName].boy.glasses == null) {}
                // else if(part == 8 && _DATAGAME.spriterData[duName].boy.earrings == null) {}
                // else if(part == 9 && _DATAGAME.spriterData[duName].boy.hat == null) {}
                // else if(part == 10 && _DATAGAME.spriterData[duName].boy.beard == null) {}
                // else if(part == 11 && _DATAGAME.spriterData[duName].boy.anklet == null) {}
                // else if(part == 12 && _DATAGAME.spriterData[duName].boy.bracelet == null) {}
                // else if(part == 13 && _DATAGAME.spriterData[duName].boy.necklace == null) {}
                if(part >= 7 && _DATAGAME.spriterData[duName].boy[_partName] == null) {}
                else {
                    for(var bone=0;bone<_DATAGAME.boyPart[part].length;bone++) {
                        var _tempNamePart = _DATAGAME.boyPart[part][bone];

                        if(part == 5 && _DATAGAME.boyPart[part][bone] == '0_leg-left-cross') {
                            _tempNamePart = '0_leg-left';
                        } else if(part == 5 && _DATAGAME.boyPart[part][bone] == '0_leg-right-cross') {
                            _tempNamePart = '0_leg-right';
                        }

                        var newPart = new ig.Image(_BASEPATH.spriter + 'boy/' + _DATAGAME.spriterData[duName].boy[_partName] + '/' + _tempNamePart + '.png');

                        if(part== 3 || part== 4 || part == 5 || part == 6) {
                            var newPartSkin = new ig.Image(_BASEPATH.spriter + 'boy/' + _DATAGAME.spriterData[duName].boy['skin'] + '/' + _DATAGAME.boyPart[part][bone] + '.png');
                            this.spriter.attachImage(_DATAGAME.boyPart[part][bone] + '.png', newPartSkin, 0, 0, true, newPart);
                        } else {
                            this.spriter.attachImage(_DATAGAME.boyPart[part][bone] + '.png', newPart, 0, 0, true, newPart);
                        }

                        // if(_partName == 'skin') {
                        //     ig.game.consoleLog(_DATAGAME.boyPart[part][bone] + ' : ' + newPart.width + ' ' + newPart.height);
                        // }
                    }
                }
            }
        },
        
        draw:function(){
            this.parent();
        }
    });
});