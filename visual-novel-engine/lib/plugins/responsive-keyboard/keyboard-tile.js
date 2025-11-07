ig.module(
        'plugins.responsive-keyboard.keyboard-tile'
    )
    .requires(
        'impact.entity',
        'game.entities.buttons.button'
    )
    .defines(function() {

        ig.EntityKeyboardTile = EntityButton.extend({
            collides:ig.Entity.COLLIDES.NEVER,
            type:ig.Entity.TYPE.A,

            id: '',
            char: '',
            ctx: null,
            icon: null,
            iconSize: 38*_DATAGAME.ratioRes,

            pressed: false,
            scale: 1,
            targetScale:1,

            oriSize: {x: 0,  y: 0},
            fontStyle: 28*_DATAGAME.ratioRes + "px arial,sans-serif",
            fontColor: 'rgba(0,0,0,1)',
            backgroundColor: 'rgba(1,1,1,1)',
            isUppercase: true,

            refSizeVertical: {x: 46, y: 53},
            refSizeHorizontal: {x: 138, y: 60},
            refSizeVertical2: {x: 68, y: 53},
            refSizeHorizontal2: {x: 204, y: 60},
            type: 1, // type 2 is using refSizeVertical2, refSizeHorizontal2
            tileRounded: 10,

            isFirstShow: true,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                if(ig.system.width > ig.system.height){
                    if(this.type == 1){
                        this.size.x = this.refSizeHorizontal.x;
                        this.size.y = this.refSizeHorizontal.y;
                        
                        this.oriSize.x = this.refSizeHorizontal.x;
                        this.oriSize.y = this.refSizeHorizontal.y;
                    }else{
                        this.size.x = this.refSizeHorizontal2.x;
                        this.size.y = this.refSizeHorizontal2.y;
                        
                        this.oriSize.x = this.refSizeHorizontal2.x;
                        this.oriSize.y = this.refSizeHorizontal2.y;
                    }
                }else{
                    if(this.type == 1){
                        this.size.x = this.refSizeVertical.x;
                        this.size.y = this.refSizeVertical.y;
                        
                        this.oriSize.x = this.refSizeVertical.x;
                        this.oriSize.y = this.refSizeVertical.y;
                    }else{
                        this.size.x = this.refSizeVertical2.x;
                        this.size.y = this.refSizeVertical2.y;
                        
                        this.oriSize.x = this.refSizeVertical2.x;
                        this.oriSize.y = this.refSizeVertical2.y;
                    }
                }

                this.ctx = ig.system.context;

                this.zIndex = this.manager.zIndex + 1;
                ig.game.sortEntitiesDeferred();

            },

            draw: function(){
                this.parent();

                if(this.zIndex < 0)return;
                if(this.isFirstShow){
                    this.isFirstShow = false;
                    return;
                }

                this.ctx.save();
                this.ctx.scale(this.scale, this.scale);

                // draw background
                this.ctx.fillStyle = this.backgroundColor;
                this.roundRect(
                    this.ctx, 
                    (this.pos.x + (this.size.x * 0.5 * (1-this.scale)))/this.scale,
                    (this.pos.y + (this.size.y * 0.5 * (1-this.scale)))/this.scale,
                    this.size.x, 
                    this.size.y,
                    this.tileRounded,
                    true,
                    false);

                if(this.icon != null){
                    var iconSize = this.iconSize;

                    if(ig && ig.packer && this.icon.drawImage){
                        this.icon.drawImage(
                            0,0,
                            this.icon.width, this.icon.height,
                            (this.pos.x + this.size.x/2 - iconSize/2 + (iconSize * 0.5 * (1-this.scale)))/this.scale, 
                            (this.pos.y + this.size.y/2 - iconSize/2 + (iconSize * 0.5 * (1-this.scale)))/this.scale, 
                            iconSize, iconSize
                        );  
                    }else{
                        this.ctx.drawImage(
                            this.icon.data,
                            0,0,
                            this.icon.width, this.icon.height,
                            (this.pos.x + this.size.x/2 - iconSize/2 + (iconSize * 0.5 * (1-this.scale)))/this.scale, 
                            (this.pos.y + this.size.y/2 - iconSize/2 + (iconSize * 0.5 * (1-this.scale)))/this.scale, 
                            iconSize, iconSize
                        );
                    }
                }else{
                    // draw text
                    this.ctx.fillStyle = this.fontColor;
                    this.ctx.font = this.fontStyle; 
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';

                    if(this.isUppercase){
                        this.ctx.fillText(this.char.toUpperCase(), (this.pos.x + this.size.x/2)/this.scale, (this.pos.y + this.size.y/2 + 2)/this.scale);
                    }else{
                        this.ctx.fillText(this.char.toLowerCase(), (this.pos.x + this.size.x/2)/this.scale, (this.pos.y + this.size.y/2 + 2)/this.scale);
                    }
                }

                this.ctx.restore();

            },

            update: function(){
                this.parent();

                // if(this.zIndex < 0)return;

                this.checkRelease();
                this.scale += (this.targetScale - this.scale) / 5;

                if(ig.system.width > ig.system.height){
                    if(this.type == 1){
                        this.oriSize.x = this.refSizeHorizontal.x;
                        this.oriSize.y = this.refSizeHorizontal.y;
                    }else{
                        this.oriSize.x = this.refSizeHorizontal2.x;
                        this.oriSize.y = this.refSizeHorizontal2.y;
                    }
                }else{
                    if(this.type == 1){
                        this.oriSize.x = this.refSizeVertical.x;
                        this.oriSize.y = this.refSizeVertical.y;
                    }else{
                        this.oriSize.x = this.refSizeVertical2.x;
                        this.oriSize.y = this.refSizeVertical2.y;
                    }
                }
            },

            clicked: function() {
                this.targetScale = 0.85;

                if(this.pressed)return;
                
                this.pressed = true;

                if(typeof this.manager.onButtonReleased === "function"){
                    if(this.isUppercase){
                        this.manager.onButtonReleased(this.id.toUpperCase());
                    }else{
                        this.manager.onButtonReleased(this.id.toLowerCase());
                    }
                }
            },

            released: function() {
                if (!this.pressed) return;
                this.pressed = false;
                this.targetScale = 1;
            },

            checkRelease: function() {
                if (ig.input.released("click")) {
                    this.targetScale = 1;
                }
            },

            show: function(){
                this.isFirstShow = true;

                this.zIndex = this.manager.zIndex + 1;
                ig.game.sortEntitiesDeferred();
            },

            hide: function(){
                this.zIndex = -1;
                ig.game.sortEntitiesDeferred();
            },

            toggleShift: function(){
                this.isUppercase = !this.isUppercase;
            },

            /**
             * Draws a rounded rectangle using the current state of the canvas.
             * If you omit the last three params, it will draw a rectangle
             * outline with a 5 pixel border radius
             * @param {CanvasRenderingContext2D} ctx
             * @param {Number} x The top left x coordinate
             * @param {Number} y The top left y coordinate
             * @param {Number} width The width of the rectangle
             * @param {Number} height The height of the rectangle
             * @param {Number} [radius = 5] The corner radius; It can also be an object 
             *                 to specify different radii for corners
             * @param {Number} [radius.tl = 0] Top left
             * @param {Number} [radius.tr = 0] Top right
             * @param {Number} [radius.br = 0] Bottom right
             * @param {Number} [radius.bl = 0] Bottom left
             * @param {Boolean} [fill = false] Whether to fill the rectangle.
             * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
             */
            roundRect: function(
                ctx,
                x,
                y,
                width,
                height,
                radius,
                fill,
                stroke
            ) {
                radius = {
                    tl: radius,
                    tr: radius,
                    br: radius,
                    bl: radius
                };
                
                ctx.beginPath();
                ctx.moveTo(x + radius.tl, y);
                ctx.lineTo(x + width - radius.tr, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                ctx.lineTo(x + width, y + height - radius.br);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                ctx.lineTo(x + radius.bl, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                ctx.lineTo(x, y + radius.tl);
                ctx.quadraticCurveTo(x, y, x + radius.tl, y);
                ctx.closePath();
                if (fill) {
                    ctx.fill();
                }
                if (stroke) {
                    ctx.stroke();
                }
            }
        });
    });