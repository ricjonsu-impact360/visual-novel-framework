/**
 * New Pointer Plugin by Nam
 */
ig.module('plugins.pointer')
    .requires(
        'impact.game',
        'impact.entity'
    ).defines(function () {

        /************************* NEW POINTER HANDLING (NO NEED TO USE THE POINTER ENTITY) ************************/
        ig.Game.inject({
            update: function () {
                this.parent();
                if (ig.input.pressed('click')) {
                    var targetObject = null;
                    for (var i = this.entities.length - 1; i > -1; i--) {
                        var e = this.entities[i];
                        if (e.isClickable && e.underPointer()) {
                            if (!targetObject || targetObject.zIndex < e.zIndex) {
                                targetObject = e;
                            }
                        }
                    }
                    targetObject && typeof targetObject.clicked === 'function' && targetObject.clicked();
                }
                if (ig.input.released('click')) {
                    var targetObject = null;
                    for (var i = this.entities.length - 1; i > -1; i--) {
                        var e = this.entities[i];
                        if (e.isClickable && e.underPointer()) {
                            if (!targetObject || targetObject.zIndex < e.zIndex) {
                                targetObject = e;
                            }
                        }
                    }
                    targetObject && typeof (targetObject.released) === 'function' && targetObject.released();
                }
            }
        });

        ig.Entity.inject({
            isClickable: false,

            /* DEFAULT IS FOR THE IN GAME ENTITIES */
            underPointer: function () {
                var p = ig.game.io.getClickPos();
                var p2 = {
                    x: p.x + ig.game.screen.x,
                    y: p.y + ig.game.screen.y
                }
                return this.containPoint(p2);
            },
            
            /* FOR THE UI ENTITIES (EG. BUTTONS), ADD THE FOLLOWING METHOD TO THE ENTITY, TO OVERRIDE THE DEFAULT ONE */
            // underPointer: function () {
            //     var p = ig.game.io.getClickPos();
            //     return this.containPoint(p);
            // },

            containPoint: function (p) {
                var x0 = this.pos.x,
                    x1 = x0 + this.size.x,
                    y0 = this.pos.y,
                    y1 = y0 + this.size.y;
                return (p.x > x0 && p.x < x1 && p.y > y0 && p.y < y1);
            }
        });
    });