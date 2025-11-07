ig.module('game.entities.topoverlay.topoverlay')
.requires(
	'impact.entity',
	'game.entities.topoverlay.vignette',
	'game.entities.topoverlay.window_boxing',
	'game.entities.topoverlay.camera1',
	'game.entities.topoverlay.camera2'
)

.defines(function(){
	// EntityTopOverlay = ig.Entity.extend({
	// 	zIndex:_DATAGAME.zIndexData.camera,
	    
	// 	init:function( x, y, settings ){
	// 		this.parent( x, y, settings );

	// 	},

	// 	update:function() {
	// 		this.parent();

	// 	},

	// 	draw:function(){
	// 		this.parent();

	// 	}
	// });
});
