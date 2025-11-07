ig.module('plugins.spriter.spriter-object')
    .requires(
        'plugins.spriter.spriter-bone'
    )
    .defines(function () {
        SpriterObject = SpriterBone.extend({
            spriter: null,
            sprite: null,
            image: null,
            degToRad: Math.PI / 180,
            init: function (spriter) {
                this.parent();

                this.spriter = spriter;
            },


            setOn: function (on) {
                this.parent(on);
                //set sprite to on here
            },


            setKey: function (animation, timelineId, keyId) {
                this.parent(animation, timelineId, keyId);

                // set sprite
                var spriteKey = this.key;
                var folder = this.spriter.getFolderById(spriteKey.folder);
                var file = folder.getFileById(spriteKey.file);
                var path = this.spriter.path + folder.name + "/" + file.name + ".png";

                if (this.image == null || this.image.path != path) {
                    this.image = new ig.Image(path);
                }

                // console.log(path);
                // this.sprite.frameName = file.name + ".png";
                // this.sprite.smoothed = true;
                //this.sprite.anchor.setTo(file.anchorX, file.anchorY);
            },


            update: function (parentInfo) {
                this.parent(parentInfo);
                this.updateSprite();
                if (this.attachedAnimations && this.attachedAnimations[this.imageKey]){

                    this.attachedAnimations[this.imageKey].animation.update();
                }
            },


            updateSprite: function () { 
                //update sprite here, for pixi too
                var t = this.transformed;
                var img = this.image;

                if (this.on && img) {

                    var s = ig.system;
                    var ctx = s.context;
                    var w = img.width;
                    var h = img.height;
                    ctx.save();
                    if (t.alpha < 1) ctx.globalAlpha = t.alpha;
                    // ctx.translate(s.getDrawPos(t.x), s.getDrawPos(t.y));
                    ctx.translate(t.x, t.y);
                    ctx.rotate(t.angle * this.degToRad);
                    ctx.scale(t.scaleX, t.scaleY);
                    // ctx.drawImage(img.data, 0, 0, w, h, -w * t.pivotX, -h * t.pivotY, w, h);

                    if (img.path != this.imageKeyPath) this.imageKey = null;

                    if (!this.imageKey) {
                        this.imageKey = img.path.split("/").pop();
                        this.imageKeyPath = img.path;
                    }

                    if (this.attachedAnimations && this.attachedAnimations[this.imageKey]) {
                        var attachment = this.attachedAnimations[this.imageKey]
                        var oriX = -w * t.pivotX;
                        var oriY = -h * t.pivotY;
                        if (!attachment.hideOriginal)
                            if(this.tint == null) img.draw(oriX, oriY, 0, 0, w, h);
                            else img.drawTint(this.tint, 1, oriX, oriY, 0, 0, w, h);

                        attachment.animation.draw(oriX + attachment.x, oriY + attachment.y);                                                
                    }
                    else if (this.attachedImages && this.attachedImages[this.imageKey]) {
                        var attachment = this.attachedImages[this.imageKey]
                        var oriX = -w * t.pivotX;
                        var oriY = -h * t.pivotY;
                        if (!attachment.hideOriginal) {
                            // img.draw(oriX, oriY, 0, 0, w, h);
                            if(this.tint == null) img.draw(oriX, oriY, 0, 0, w, h);
                            else img.drawTint(this.tint, 1, oriX, oriY, 0, 0, w, h);
                        }

                        // ctx.rotate(t.angle * this.degToRad + (this.attachedImages[this.imageKey].angle * this.degToRad));
                        if(this.attachedImages[this.imageKey].angle != null && this.attachedImages[this.imageKey].angle != 0){
                            ctx.save();
                            var plusY = (this.attachedImages[this.imageKey].plusY != null) ? this.attachedImages[this.imageKey].plusY : 0;

                            var offsetPos = (this.attachedImages[this.imageKey].offsetPos != null) ? this.attachedImages[this.imageKey].offsetPos : {x:0, y:0};
                            // console.log(offsetPos);

                            ctx.translate(29*_DATAGAME.ratioRes, (49*_DATAGAME.ratioRes)+plusY);
                            // ctx.translate(33*_DATAGAME.ratioRes, (57*_DATAGAME.ratioRes)+plusY);
                            ctx.rotate(this.attachedImages[this.imageKey].angle * this.degToRad);

                            if(this.tint == null) {
                                attachment.image.draw(oriX + attachment.x-(29*_DATAGAME.ratioRes)+(offsetPos.x*_DATAGAME.ratioRes), oriY + attachment.y-((49*_DATAGAME.ratioRes)+plusY+(offsetPos.y*_DATAGAME.ratioRes)));
                            } else {
                                attachment.image.drawTint(this.tint, 1, oriX + attachment.x-(29*_DATAGAME.ratioRes)+(offsetPos.x*_DATAGAME.ratioRes), oriY + attachment.y-((49*_DATAGAME.ratioRes)+plusY+(offsetPos.y*_DATAGAME.ratioRes)));
                            }
                            ctx.restore();
                        } else {
                            if(this.tint == null) {
                                attachment.image.draw(oriX + attachment.x, oriY + attachment.y);
                            } else {
                                attachment.image.drawTint(this.tint, 1, oriX + attachment.x, oriY + attachment.y);
                            }
                        }

                        if(attachment.imageOriginal) {
                            // attachment.imageOriginal.draw(oriX, oriY, 0, 0, w, h);
                            if(this.tint == null) attachment.imageOriginal.draw(oriX, oriY, 0, 0, w, h);
                            else attachment.imageOriginal.drawTint(this.tint, 1, oriX, oriY, 0, 0, w, h);
                        }
                    } 
                    else {
                        if(this.tint == null) img.draw(-w * t.pivotX, -h * t.pivotY, 0, 0, w, h);
                        else img.drawTint(this.tint, 1, -w * t.pivotX, -h * t.pivotY, 0, 0, w, h);
                        // img.draw(-w * t.pivotX, -h * t.pivotY, 0, 0, w, h);
                    }

                    ctx.restore();
                    if (t.alpha < 1) ctx.globalAlpha = 1;

                    // if (this.attachedImages && this.attachedImages[this.imageKey]) {
                    //     var attachment = this.attachedImages[this.imageKey]
                    //     var oriX = -w * t.pivotX;
                    //     var oriY = -h * t.pivotY;
                    //     if (!attachment.hideOriginal)
                    //         img.draw(oriX, oriY, 0, 0, w, h);

                    //     attachment.image.draw(oriX + attachment.x, oriY + attachment.y);

                    //     if(attachment.imageOriginal) {
                    //         attachment.imageOriginal.draw(oriX, oriY, 0, 0, w, h);
                    //     }
                    // } else {
                    //     img.draw(-w * t.pivotX, -h * t.pivotY, 0, 0, w, h);
                    // }

                    // ctx.restore();
                    // if (t.alpha < 1) ctx.globalAlpha = 1;
                }

            }
        });
    });
