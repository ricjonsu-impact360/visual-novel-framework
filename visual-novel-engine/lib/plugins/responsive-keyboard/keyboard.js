ig.module(
        'plugins.responsive-keyboard.keyboard'
    )
    .requires(
        'impact.entity',
        'plugins.responsive-keyboard.keyboard-tile'
    )
    .defines(function() {

        ig.EntityKeyboard = ig.Entity.extend({
            // EDITABLE VALUE
            fontStyle: "bold 34px arial,sans-serif", 
            fontColor: 'rgba(0,0,0,1)',
            backgroundColorRegular: '',
            backgroundColorSpecial: '',
            keyboardBackground: '',
            tileRounded: 10,
            space: 5,
            padding: {x: 10, y: 10},
            iconSize: 38,
            // END OF EDITABLE VALUE

            // custom icon
            shiftIcon: new ig.Image(_RESOURCESINFO.image.shift),
            enterIcon: new ig.Image(_RESOURCESINFO.image.enter),
            backspaceIcon: new ig.Image(_RESOURCESINFO.image.backspace),

            tileSpace: {x: 5, y: 5},

            tiles: [],
            charTiles: [],
            symbolTiles: [],
            emojiTiles: [],
            specialTiles: [],
            bckSpace: null,
            space: null,

            anchor: 'bottom',

            defaultZIndex: 0,

            oldScreenSize: {x: 0, y: 0},
            isPortrait: false,
            isSymbolActive: false,
            isEmojiActive: false,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.defaultZIndex = this.zIndex;
                this.ctx = ig.system.context;

                this.tileSpace.x = this.space;
                this.tileSpace.y = this.space;

                var chars = [['Q','W','E','R','T','Y','U','I','O','P'],
                                ['A','S','D','F','G','H','J','K','L'],
                                ['Z','X','C','V','B','N','M']];
                var symbols = [['1','2','3','4','5','6','7','8','9','0'],
                                ['@','#','$','_','&','-','+','(',')'],
                                ['/','*','"','\'',':','!','?']];
                var emojis = [['😃','😄','😅','😆','😊','😎','😗','😘','🤗','😍'],
                                ['😛','🥳','😥','😭','😩','🤢','🤮','😷','🥵'],
                                ['🥶','😱','😒','😠','😡','😪','😴']];

                // CHARACTER TILES
                var tmpTiles = [];
                for(var i = 0; i < chars.length; i++){
                    tmpTiles = [];
                    for(var j = 0; j < chars[i].length; j++){
                        var tmpTile = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                            id: chars[i][j],
                            manager: this,
                            type: 1,
                            backgroundColor: this.backgroundColorRegular,
                            char: chars[i][j],
                            fontStyle: this.fontStyle,
                            fontColor: this.fontColor,
                            tileRounded: this.tileRounded
                        });

                        tmpTiles.push(tmpTile);
                    }

                    this.charTiles.push(tmpTiles);
                }
                // default tiles is char tiles
                this.tiles = this.charTiles;

                // SYMBOL TILES
                tmpTiles = [];
                for(var i = 0; i < symbols.length; i++){
                    tmpTiles = [];
                    for(var j = 0; j < symbols[i].length; j++){
                        var tmpTile = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                            id: symbols[i][j],
                            manager: this,
                            type: 1,
                            backgroundColor: this.backgroundColorRegular,
                            char: symbols[i][j],
                            fontStyle: this.fontStyle,
                            fontColor: this.fontColor,
                            tileRounded: this.tileRounded
                        });
                        tmpTile.hide();

                        tmpTiles.push(tmpTile);
                    }

                    this.symbolTiles.push(tmpTiles);
                }

                // EMOJI TILES
                tmpTiles = [];
                for(var i = 0; i < emojis.length; i++){
                    tmpTiles = [];
                    for(var j = 0; j < emojis[i].length; j++){
                        var tmpTile = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                            id: emojis[i][j],
                            manager: this,
                            type: 1,
                            backgroundColor: this.backgroundColorRegular,
                            char: emojis[i][j],
                            fontStyle: this.fontStyle,
                            fontColor: this.fontColor,
                            tileRounded: this.tileRounded
                        });
                        tmpTile.hide();

                        tmpTiles.push(tmpTile);
                    }

                    this.emojiTiles.push(tmpTiles);
                }

                // this.numpad = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                //             manager: this,
                //             type: 2,
                //             backgroundColor: this.backgroundColorSpecial,
                //             char: '?123',
                //             id: 'numpad',
                //             fontStyle: this.fontStyle,
                //             fontColor: this.fontColor,
                //             tileRounded: this.tileRounded
                //         });
                // this.specialTiles.push(this.numpad);

                // this.comma = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                //             manager: this,
                //             type: 1,
                //             backgroundColor: this.backgroundColorRegular,
                //             char: ',',
                //             id: ',',
                //             fontStyle: this.fontStyle,
                //             fontColor: this.fontColor,
                //             tileRounded: this.tileRounded
                //         });
                // this.specialTiles.push(this.comma);

                // this.period = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                //             manager: this,
                //             type: 1,
                //             backgroundColor: this.backgroundColorRegular,
                //             char: '.',
                //             id: '.',
                //             fontStyle: this.fontStyle,
                //             fontColor: this.fontColor,
                //             tileRounded: this.tileRounded
                //         });
                // this.specialTiles.push(this.period);

                this.bckSpace = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                            manager: this,
                            type: 2,
                            backgroundColor: this.backgroundColorSpecial,
                            icon: this.backspaceIcon,
                            iconSize: this.iconSize,
                            id: 'BACKSPACE',
                            fontStyle: this.fontStyle,
                            fontColor: this.fontColor,
                            tileRounded: this.tileRounded
                        });
                this.specialTiles.push(this.bckSpace);

                this.space = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                            manager: this,
                            type: 1,
                            backgroundColor: this.backgroundColorRegular,
                            char: '',
                            id: ' ',
                            fontStyle: this.fontStyle,
                            fontColor: this.fontColor,
                            tileRounded: this.tileRounded
                        });
                this.specialTiles.push(this.space);

                // symbol
                // this.emoji = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                //             manager: this,
                //             type: 1,
                //             backgroundColor: this.backgroundColorRegular,
                //             char: '?😃',
                //             id: 'EMOJI',
                //             fontStyle: this.fontStyle,
                //             fontColor: this.fontColor,
                //             tileRounded: this.tileRounded
                //         });
                // this.specialTiles.push(this.emoji);

                this.shift = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                            manager: this,
                            type: 2,
                            backgroundColor: this.backgroundColorSpecial,
                            id: 'SHIFT',
                            icon: this.shiftIcon,
                            iconSize: this.iconSize,
                            fontStyle: this.fontStyle,
                            fontColor: this.fontColor,
                            tileRounded: this.tileRounded
                        });
                this.specialTiles.push(this.shift);

                // this.carriageReturn = ig.game.spawnEntity(ig.EntityKeyboardTile, 0, 0, {
                //             manager: this,
                //             type: 2,
                //             backgroundColor: this.backgroundColorSpecial,
                //             icon: this.enterIcon,
                //             iconSize: this.iconSize,
                //             id: 'RETURN',
                //             fontStyle: this.fontStyle,
                //             fontColor: this.fontColor,
                //             tileRounded: this.tileRounded
                //         });
                // this.specialTiles.push(this.carriageReturn);
            },

            draw: function(){
                this.parent();

                if(this.zIndex < 0)return;

                this.ctx.save();
                this.ctx.fillStyle = this.keyboardBackground;
                this.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
                this.ctx.restore();
            },

            update: function(){
                this.parent();

                this.size.x = 0;
                this.size.y = 0;

                if(this.zIndex < 0)return;

                // check orientation changes
                if(this.oldScreenSize.x != ig.system.width || this.oldScreenSize.y != ig.system.height){
                    this.oldScreenSize.x = ig.system.width;
                    this.oldScreenSize.y = ig.system.height;

                    if(ig.system.height > ig.system.width){
                        this.isPortrait = true;
                    }
                }

                // check if we need to resize the width
                var newTileWidth = (ig.system.width - (2 * this.padding.x) - (9 * this.tileSpace.x))/10;
                
                // check do we need to resize the height?
                // allow only if it is portrait and max height is 30% of screen height
                var newTileHeight = 0;
                if(this.isPortrait){
                    var maxKeyboardHeight = 0.3 * ig.system.height;
                    newTileHeight = newTileWidth / this.tiles[0][0].oriSize.x * this.tiles[0][0].oriSize.y;

                    var totalTileHeight = (2 * this.padding.y) + (3 * this.tileSpace.y) + (4 * newTileHeight);
                    if(totalTileHeight > maxKeyboardHeight){
                        newTileHeight = (maxKeyboardHeight - (2 * this.padding.y) - (3 * this.tileSpace.y))/4;
                    }

                    // also make sure it doesn't smaller than the original height
                    if(newTileHeight < this.tiles[0][0].oriSize.y){
                        newTileHeight = this.tiles[0][0].oriSize.y;
                    }
                }else{
                    newTileHeight = this.tiles[0][0].oriSize.y;
                }
                
                // resize tile
                // var newNumpadWidth = this.numpad.oriSize.x / this.tiles[0][0].oriSize.x * newTileWidth;
                // this.numpad.size.x = newNumpadWidth;
                // this.numpad.size.y = newTileHeight;

                var newBckSpaceWidth = this.bckSpace.oriSize.x / this.tiles[0][0].oriSize.x * newTileWidth;
                this.bckSpace.size.x = newBckSpaceWidth;
                this.bckSpace.size.y = newTileHeight;
                
                //SPACE EMOJI
                var newSpaceWidth = (7*newTileWidth) + (6*this.tileSpace.x);
                this.space.size.x = newSpaceWidth;
                this.space.size.y = newTileHeight;

                // var newCommaWidth = newPeriodWidth = newTileWidth;
                // this.comma.size.x = newCommaWidth;
                // this.comma.size.y = newTileHeight;

                // this.period.size.x = newPeriodWidth;
                // this.period.size.y = newTileHeight;

                // this.emoji.size.x = newCommaWidth;
                // this.emoji.size.y = newTileHeight;

                this.shift.size.x = newBckSpaceWidth;
                this.shift.size.y = newTileHeight;

                // this.carriageReturn.size.x = newBckSpaceWidth;
                // this.carriageReturn.size.y = newTileHeight;

                this.size.x = ig.system.width;

                this.size.y = (2 * this.padding.y) + (4 * newTileHeight) + (3 * this.tileSpace.y);

                this.pos = {
                    x: ig.system.width/2 - this.size.x/2,
                    y: ig.system.height - this.size.y
                }

                var tmpPos;
                var tmpPosY;
                var width;
                for (var i = 0; i < this.tiles.length; i++) {
                    width = (this.tiles[i].length * newTileWidth) + ((this.tiles[i].length - 1) * this.tileSpace.x);
                    tmpPos = {
                        x: ig.system.width/2 - width/2,
                        y: ig.system.height
                    }

                    tmpPosY = this.pos.y + this.padding.y + (i * (newTileHeight + this.tileSpace.y));

                    for (var j = 0; j < this.tiles[i].length; j++) {
                        this.tiles[i][j].pos.x = tmpPos.x + (j * (newTileWidth + this.tileSpace.x));
                        this.tiles[i][j].pos.y = tmpPosY;
                        this.tiles[i][j].size.x = newTileWidth;
                        this.tiles[i][j].size.y = newTileHeight;
                    }
                }

                // width = this.comma.size.x + this.space.size.x + this.period.size.x + (2 * this.tileSpace.x);
                tmpPos = {
                    x: ig.system.width / 2 - width / 2,
                    y: ig.system.height
                }
                // tmpPos.x += (this.comma.size.x + this.tileSpace.x)/2;

                tmpPosY = this.pos.y + this.padding.y + (3 * (this.space.size.y + this.tileSpace.y));

                // this.comma.pos.x = tmpPos.x;
                // this.comma.pos.y = tmpPosY;

                this.space.pos.x = tmpPos.x + this.tileSpace.x;
                this.space.pos.y = tmpPosY;

                // this.period.pos.x = this.space.pos.x + this.space.size.x + this.tileSpace.x;
                // this.period.pos.y = tmpPosY;

                // this.emoji.pos.x = this.comma.pos.x - this.tileSpace.x - this.emoji.size.x;
                // this.emoji.pos.y = tmpPosY;

                // this.carriageReturn.pos.x = this.space.pos.x + this.space.size.x + this.tileSpace.x;
                // this.carriageReturn.pos.y = tmpPosY;

                this.shift.pos.x = tmpPos.x - this.tileSpace.x - this.shift.size.x;
                this.shift.pos.y = tmpPosY - this.tileSpace.y - this.shift.size.y;

                this.bckSpace.pos.x = this.space.pos.x + this.space.size.x + this.tileSpace.x;
                this.bckSpace.pos.y = tmpPosY - this.tileSpace.y - this.shift.size.y;

                // this.numpad.pos.x = this.emoji.pos.x  - this.tileSpace.x - this.numpad.size.x;
                // this.numpad.pos.y = tmpPosY;
            },

            onButtonReleased: function(id){
                if(id.toLowerCase() == 'numpad'){
                    this.isSymbolActive = !this.isSymbolActive;
                    this.isEmojiActive = false;

                    // hide tiles
                    for(var i = 0; i < this.tiles.length; i++){
                        for(var j = 0; j < this.tiles[i].length; j++){
                            this.tiles[i][j].hide();
                        }
                    }

                    if(this.isSymbolActive){
                        for(var i = 0; i < this.symbolTiles.length; i++){
                            for(var j = 0; j < this.symbolTiles[i].length; j++){
                                this.symbolTiles[i][j].show();
                            }
                        }

                        this.tiles = this.symbolTiles;
                    }else{
                        for(var i = 0; i < this.charTiles.length; i++){
                            for(var j = 0; j < this.charTiles[i].length; j++){
                                this.charTiles[i][j].show();
                            }
                        }

                        this.tiles = this.charTiles;
                    }
                }else if(id.toLowerCase() == 'emoji'){
                    this.isEmojiActive = !this.isEmojiActive;
                    this.isSymbolActive = false;

                    // hide tiles
                    for(var i = 0; i < this.tiles.length; i++){
                        for(var j = 0; j < this.tiles[i].length; j++){
                            this.tiles[i][j].hide();
                        }
                    }

                    if(this.isEmojiActive){
                        for(var i = 0; i < this.emojiTiles.length; i++){
                            for(var j = 0; j < this.emojiTiles[i].length; j++){
                                this.emojiTiles[i][j].show();
                            }
                        }

                        this.tiles = this.emojiTiles;
                    }else{
                        for(var i = 0; i < this.charTiles.length; i++){
                            for(var j = 0; j < this.charTiles[i].length; j++){
                                this.charTiles[i][j].show();
                            }
                        }

                        this.tiles = this.charTiles;
                    }
                }else if(id.toLowerCase() == 'shift'){
                    if(this.isSymbolActive || this.isEmojiActive)return;

                    for(var i = 0; i < this.charTiles.length; i++){
                        for(var j = 0; j < this.charTiles[i].length; j++){
                            this.charTiles[i][j].toggleShift();
                        }
                    }
                }else{
                    if(this.onKeyboardPressed)this.onKeyboardPressed(id);
                }
            },

            show: function(){
                this.zIndex = this.defaultZIndex;
                ig.game.sortEntitiesDeferred();

                for(var i = 0; i < this.tiles.length; i++){
                    for(var j = 0; j < this.tiles[i].length; j++){
                        this.tiles[i][j].show();
                    }
                }

                for(var i = 0; i < this.specialTiles.length; i++){
                    this.specialTiles[i].show();
                }
            },

            hide: function(){
                this.zIndex = -1;
                ig.game.sortEntitiesDeferred();

                for(var i = 0; i < this.tiles.length; i++){
                    for(var j = 0; j < this.tiles[i].length; j++){
                        this.tiles[i][j].hide();
                    }
                }

                for(var i = 0; i < this.specialTiles.length; i++){
                    this.specialTiles[i].hide();
                }
            }
        });
    });