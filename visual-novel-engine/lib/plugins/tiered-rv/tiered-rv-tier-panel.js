ig.module('plugins.tiered-rv.tiered-rv-tier-panel')
.requires(
	'plugins.tiered-rv.tiered-rv-game-object'
)
.defines(function () {

	ig.TieredRvTierPanel = ig.TieredRvGameObject.extend({
		
		main: null,
		
		bg: null,
		icon: null,
		
		index: 0,
		
		posOffset: {x: 0, y: 0},
		posOffset_icon: {x: 0, y: 0},
		
		btn: null,
		btn_posOffset: null,
		btn_size: null,
		btn_img: null,
		
		init: function (x, y, settings) {
			this.parent (x, y, settings);

			this.size.x = ig.tieredRV.item.width;
			this.size.y = ig.tieredRV.item.height;
			
			this.btn = ig.game.spawnEntity (ig.TieredRvBtnWatchAd, 0, 0, {
				main: this, 
				
				img: this.btn_img,
				size: this.btn_size,
				
				zIndex: this.zIndex + 1,
				
				anchorObj: this,
				posOffset: this.btn_posOffset
			});
		},
		
		update: function (){
			this.parent ();
			
			this.pos = {
				x: this.main.pos.x + this.posOffset.x,
				y: this.main.pos.y + this.posOffset.y
			};
		},
		
		draw: function (){
			if (!this.main.isShow) return;
			
			this.parent ();
			
			var ctx = ig.system.context;
			ctx.save ();
			ctx.globalAlpha = this.objAlpha;
			
			ctx.save();
			ctx.translate(this.pos.x, this.pos.y);

			ctx.lineWidth = ig.tieredRV.item.stroke;
            ctx.strokeStyle = ig.tieredRV.item.strokeColor;
            ctx.strokeRect(0, 0, ig.tieredRV.item.width, ig.tieredRV.item.height);

			ctx.fillStyle = ig.tieredRV.item.color;
			ctx.fillRect(0, 0, ig.tieredRV.item.width, ig.tieredRV.item.height);
			ctx.restore();
			// this.bg.drawImage (
			// 	this.pos.x, this.pos.y,
			// 	this.size.x, this.size.y
			// );
			this.icon.drawImage (
				this.pos.x + this.posOffset_icon.x, this.pos.y + this.posOffset_icon.y
			);
			
			var _plugin = ig.tieredRV;
			
			ctx.font = _plugin.tierPanel.titleFont;
			ctx.fillStyle = _plugin.tierPanel.titleFillStyle;
			ctx.textAlign = 'left';
			ctx.fillText (
				_plugin.tierPanel.str_tierTitles [this.index],
				this.pos.x + _plugin.tierPanel.title_posOffset.x,
				this.pos.y + _plugin.tierPanel.title_posOffset.y
			);
			
			ctx.font = _plugin.tierPanel.descFont;
			ctx.fillStyle = _plugin.tierPanel.descFillStyle;
			ctx.textAlign = 'left';
			_plugin.draw_text_wrapped (
				ctx,
				_plugin.tierPanel.str_tierDesc [this.index],
				this.pos.x + _plugin.tierPanel.desc_posOffset.x,
				this.pos.y + _plugin.tierPanel.desc_posOffset.y,
				_plugin.tierPanel.desc_wrapSize.x,
				_plugin.tierPanel.desc_wrapSize.ySpacing
			);
			
			ctx.globalAlpha = 1;
			ctx.restore ();
		}
	}); 
	
	ig.TieredRvBtnWatchAd = ig.TieredRvGameObject.extend({
		main: null,
		
		isBTN: true,
		
		posOffset: null,
		status: '',
		
		draw: function (){
			if (!this.main.main.isShow) return;
			
			this.parent ();
			
			var ctx = ig.system.context;
			ctx.save ();
			ctx.globalAlpha = this.objAlpha;
			
			var _plugin = ig.tieredRV;
				ctx.font = _plugin.tierPanel_btn.txtFontSize * this.scale.x + 'px ' + _plugin.tierPanel_btn.txtFontType;

			if (this.status == 'clickable') {
				
				ctx.fillStyle = _plugin.tierPanel_btn.txtFillStyle;
				ctx.textAlign = 'center';
				ctx.fillText (
					_plugin.tierPanel_btn.str_watchAd,
					this.pos.x + _plugin.tierPanel_btn.txt_posOffset.x,
					this.pos.y + _plugin.tierPanel_btn.txt_posOffset.y
				);
			} else if (this.status == 'running') {
				var _time = new Date().getTime(),
					_targ = _plugin.tiersData_cur [this.main.index].timeTarg - _time;
				
				// ctx.font = _plugin.tierPanel_btn.txtFont;
				ctx.fillStyle = _plugin.tierPanel_btn.txtTimeFillStyle;
				ctx.textAlign = 'center';
				ctx.fillText (
					_plugin.convert_time_text (_targ),
					this.pos.x + _plugin.tierPanel_btn.txt_posOffset.x+9,
					this.pos.y + _plugin.tierPanel_btn.txt_posOffset.y
				);
			}
			
			ctx.globalAlpha = 1;
			ctx.restore ();
		},
		
		interact: function (){
			if (!this.main.main.isShow || this.status != 'clickable') return;
			ig.tieredRV.rv_btn_pressed (this.main.index, this.main.main);
		}
	});
});