/**
 * Responsive Plugin by Nam
 */
ig.module('plugins.responsive')
    .requires(
        'plugins.handlers.size-handler',
        'impact.image'
    ).defines(function () {

        ig.SizeHandler.inject({
            minW: 1080, //1600
            minH: 1920, //1600

            scaleX: 1,
            scaleY: 1,
            fillScale: 1,

            firstResize: true,

            sizeCalcs: function () {
                var w = window.innerWidth,
                    h = window.innerHeight,
                    newW, newH;

                this.r0 = this.minW / this.minH;
                var r = w / h;
                /* Calculate new game size */
                if (r < this.r0) {
                    newW = this.minW;
                    newH = Math.round(newW / r);
                } else {
                    newH = this.minH;
                    newW = Math.round(newH * r);
                }

                if (ig.system) {
                    this.dx = (ig.system.width - newW) / 2;
                    this.dy = (ig.system.height - newH) / 2;
                    ig.system.resize(newW, newH, this.scale);
                }

                this.windowSize = new Vector2(w, h);
                this.scaleRatioMultiplier = new Vector2(w / newW, h / newH);
                this.desktop.actualResolution = new Vector2(w, h);
                this.mobile.actualResolution = new Vector2(w, h);
                this.desktop.actualSize = new Vector2(w, h);
                this.mobile.actualSize = new Vector2(w, h);

                if (ig.game) {
                    ig.game.midX = ig.system.width / 2;
                    ig.game.midY = ig.system.height / 2;

                    /* First resize, after the game is loaded */
                    if (this.firstResize) {
                        this.firstResize = false;
                        this.dx = (this.minW - newW) / 2;
                        this.dy = (this.minH - newH) / 2;
                    }

                    /* MOVE THE SCREEN (CAMERA) */
                    ig.game.screen.x += this.dx;
                    ig.game.screen.y += this.dy;

                    ig.game.update();

                    /* Reposition entities */
                    this.repositionEntities();

                    /* Update drawing */
                    ig.game.draw();

                } else if (ig.loader) {
                    ig.loader.draw(); // update splash-loader screen
                }
            },

            /* Reposition entities */
            repositionEntities: function () {
                ig.game.entities.forEach(function (e) {
                    e && typeof e.repos === 'function' && e.repos();
                });
            },

            /* OVERRIDE METHOD, TO GET RID OF THE ORIENTATION IMAGE */
            reorient: function () {
                this.resize();
                ig.ua.mobile && this.resizeAds();
            }
        });

        ig.Image.inject({
            drawScale: function (x, y, w, h) {
                if (!this.loaded) {
                    return;
                }

                // ig.system.context.drawImage(this.data, 0, 0, this.width, this.height, x, y, w, h);
                this.drawImage(0, 0, this.width, this.height, x, y, w, h);
                // ig.image.drawImage(0, 0, this.width, this.height, x, y, w, h);

                ig.Image.drawCount++;
            }
        });
    });