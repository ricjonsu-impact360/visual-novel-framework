ig.module('game.entities.topoverlay.window_boxing')
.requires(
	'impact.entity'
)

.defines(function(){
	EntityWindowBoxing = ig.Entity.extend({
		zIndex:_DATAGAME.zIndexData.windowBoxingTop, //windowBoxingBelow
		position:"top",
		thickness:200,
		color: _DATAGAME.windowBoxing.top.color,

		BOX_TOP : "top",
		BOX_BOTTOM : "bottom", 
		BOX_LEFT : "left",
		BOX_RIGHT : "right",

		init:function( x, y, settings ){
			this.parent( x, y, settings );

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

			c.fillStyle = this.color;

			if(this.position == this.BOX_TOP) {
				c.fillRect(0, 0, ig.system.width, this.thickness*_DATAGAME.ratioRes);
			}
			else if(this.position == this.BOX_BOTTOM) {
				c.fillRect(0, ig.system.height - (this.thickness*_DATAGAME.ratioRes), ig.system.width, this.thickness*_DATAGAME.ratioRes);
			}
			else if(this.position == this.BOX_LEFT) {
				c.fillRect(0, 0, this.thickness*_DATAGAME.ratioRes, ig.system.height);
			}
			else if(this.position == this.BOX_RIGHT) {
				c.fillRect(ig.system.width - (this.thickness*_DATAGAME.ratioRes), 0, this.thickness*_DATAGAME.ratioRes, ig.system.height);
			}
			
			c.restore();
		}
	});
});
