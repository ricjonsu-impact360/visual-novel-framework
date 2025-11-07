ig.module('plugins.freezeframe.freezeframe-settings')
    .requires()
    .defines(function () {

        ig.initFreezeFrameSettings = function () {

            // //Upgrade Mode 
            // ig.FreezeFrame.isUpgradeMode = true;
            // ig.FreezeFrame.upgradeRequirements = [5, 10, 15, 25, 50];

            //Animation Settings
            ig.FreezeFrame.animation = {
                type1: {
                    bgColor:'#FDECFC',
                    bgTextColor:'#831066',
                    stripe1Color:'#EA79EC',
                    stripe2Color:'#D628A9',
                    stripe3Color:'#D53AC2',
                    stripe4Color:'#F5B2E6',
                },

                type2: {

                },

                type3: {

                },

                type4: {

                },

                type5: {

                },
            };

            ig.FreezeFrame.images = {
                bg:new ig.Image(_BASEPATH.background + "home.png"), 
                bghome:new ig.Image(_BASEPATH.background + "home.png"), 
                textBg:new ig.Image(_BASEPATH.image + "sprites/bgtext.png")
            };

            //Sounds id
            ig.FreezeFrame.sounds = {
                
            };
        }
    });
