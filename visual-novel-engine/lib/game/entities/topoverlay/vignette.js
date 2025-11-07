ig.module('game.entities.topoverlay.vignette')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityVignette = ig.Entity.extend({
		// zIndex:_DATAGAME.zIndexData.windowBoxingTop, //windowBoxingBelow

		// color: 'black',    // outer color
		// alpha: 0.8,    // outer color
		// radius: 100,                 // fraction of larger screen dim (0..1)
		// softness: 0.5,               // 0..1 where 1 is very soft
		// center: null,                // {x,y} in pixels; default -> screen center
		// centerWorld: false,          // whether `center` is world coords

		zIndex: 99999, // must draw on top

  hole: { x: 1000, y: 500, w: 200, h: 150 },
		

		init:function( x, y, settings ){
			this.parent( x, y, settings );

			this.overlayCanvas = document.createElement('canvas');
            this.overlayCanvas.width = ig.system.width;
            this.overlayCanvas.height = ig.system.height;
            this.overlayCtx = this.overlayCanvas.getContext('2d', { alpha: true });
		},

		update:function() {
			this.parent();

		},

		repos:function() {

			// this.zIndex = (_DATAGAME.windowBoxing[position]) ? _DATAGAME.zIndexData.windowBoxingTop : _DATAGAME.zIndexData.windowBoxingBelow
			ig.game.sortEntitiesDeferred();
		},

		draw:function(){
			this.parent();

			var c = ig.system.context;
            c.save();
            this.overlayCanvas.width = ig.system.width;
            this.overlayCanvas.height = ig.system.height;
            var ctxO = this.overlayCtx;
            ctxO.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

            // Step 1: white overlay
            ctxO.globalAlpha = 1;
            ctxO.fillStyle = 'blue';
            ctxO.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

            // Step 2: transparent blurred hole
            ctxO.globalCompositeOperation = 'destination-out';
            ctxO.filter = 'blur(40px)';
            ctxO.fillStyle = 'black'; // color doesn’t matter
            ctxO.fillRect(ig.system.width/2-250, ig.system.height/2-250, 500, 500);

            // reset
            ctxO.filter = 'none';
            ctxO.globalCompositeOperation = 'source-over';

            c.drawImage(this.overlayCanvas, 0, 0);
            c.restore();

		}
	});
});
