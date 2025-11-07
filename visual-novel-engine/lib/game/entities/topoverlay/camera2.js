ig.module('game.entities.topoverlay.camera2')
.requires(
	'impact.entity'
)

.defines(function(){
	Entitycamera2 = ig.Entity.extend({
		zIndex:_DATAGAME.zIndexData.camera,
		corner:25*_DATAGAME.ratioRes,
		radDot:15*_DATAGAME.ratioRes,
		borderLineLength:130*_DATAGAME.ratioRes,
		strokeWidth:5*_DATAGAME.ratioRes,
		padding:{x:50*_DATAGAME.ratioRes, y:50*_DATAGAME.ratioRes},
		
		paddingInside:{x:150*_DATAGAME.ratioRes, y:150*_DATAGAME.ratioRes},
		cornerInside:15*_DATAGAME.ratioRes,
		borderLineLengthInside:50*_DATAGAME.ratioRes,

		totalTime:0,
		counterRedDot:0,
	    
		init:function( x, y, settings ){
			this.parent( x, y, settings );

		},

		update:function() {
			this.parent();

		},

		draw:function(){
			this.parent();

			var c = ig.system.context;

			c.save();
			c.strokeStyle = 'white';
			c.lineWidth = this.strokeWidth;
			c.lineCap = 'round';

			//TOP LEFT CORNER
			c.beginPath();
			c.moveTo(this.padding.x, this.padding.y + this.borderLineLength);
			c.lineTo(this.padding.x, this.padding.y + this.corner);
			c.quadraticCurveTo(this.padding.x, this.padding.y, this.padding.x + this.corner, this.padding.y);
			c.lineTo(this.padding.x + this.borderLineLength, this.padding.y);
			c.stroke();
            c.closePath();

            //BOTTOM LEFT CORNER
			c.beginPath();
			c.moveTo(this.padding.x, ig.system.height - this.padding.y - this.borderLineLength);
			c.lineTo(this.padding.x, ig.system.height - this.padding.y - this.corner);
			c.quadraticCurveTo(this.padding.x, ig.system.height - this.padding.y, this.padding.x + this.corner, ig.system.height - this.padding.y);
			c.lineTo(this.padding.x + this.borderLineLength, ig.system.height - this.padding.y);
			c.stroke();
            c.closePath();

            //TOP RIGHT CORNER
			c.beginPath();
			c.moveTo(ig.system.width - this.padding.x, this.padding.y + this.borderLineLength);
			c.lineTo(ig.system.width - this.padding.x, this.padding.y + this.corner);
			c.quadraticCurveTo(ig.system.width - this.padding.x, this.padding.y, ig.system.width - this.padding.x - this.corner, this.padding.y);
			c.lineTo(ig.system.width - this.padding.x - this.borderLineLength, this.padding.y);
			c.stroke();
            c.closePath();

            //BOTTOM RIGHT CORNER
			c.beginPath();
			c.moveTo(ig.system.width - this.padding.x, ig.system.height - this.padding.y - this.borderLineLength);
			c.lineTo(ig.system.width - this.padding.x, ig.system.height - this.padding.y - this.corner);
			c.quadraticCurveTo(ig.system.width - this.padding.x, ig.system.height - this.padding.y, ig.system.width - this.padding.x - this.corner, ig.system.height - this.padding.y);
			c.lineTo(ig.system.width - this.padding.x - this.borderLineLength, ig.system.height - this.padding.y);
			c.stroke();
            c.closePath();

            var paddingDot = (30 + this.radDot) * _DATAGAME.ratioRes;

            //RED DOT
            this.counterRedDot++;
            if(this.counterRedDot <= 30) {
	            c.fillStyle = 'red';
	            c.beginPath();
				c.arc(this.padding.x + paddingDot, this.padding.y + paddingDot, this.radDot, 0, 2 * Math.PI);
				c.fill();
				c.closePath();
			} else if(this.counterRedDot >= 50) {
				this.counterRedDot = 0;
			}

			c.font = (50*_DATAGAME.ratioRes) + "px arialmtbold";
            c.fillStyle = 'white';
            c.textBaseline = 'middle';
            c.fillText('REC', this.padding.x + paddingDot + this.radDot + 10 *_DATAGAME.ratioRes, this.padding.y + paddingDot +  this.strokeWidth/2);

			c.restore();

			c.save();
			c.globalAlpha = 0.6;
			c.strokeStyle = 'white';
			c.lineWidth = this.strokeWidth;
			c.lineCap = 'round';

			//INSIDE RECT
            var leftTopPos = { x:ig.system.width / 2 - this.paddingInside.x, y:ig.system.height / 2 - this.paddingInside.y };
            var rightTopPos = { x:ig.system.width / 2 + this.paddingInside.x, y:ig.system.height / 2 - this.paddingInside.y };
            var leftBottomPos = { x:ig.system.width / 2 - this.paddingInside.x, y:ig.system.height / 2 + this.paddingInside.y };
            var rightBottomPos = { x:ig.system.width / 2 + this.paddingInside.x, y:ig.system.height / 2 + this.paddingInside.y };

            //TOP LEFT CORNER
			c.beginPath();
			c.moveTo(leftTopPos.x, leftTopPos.y + this.borderLineLengthInside);
			c.lineTo(leftTopPos.x, leftTopPos.y + this.cornerInside);
			c.quadraticCurveTo(leftTopPos.x, leftTopPos.y, leftTopPos.x + this.cornerInside, leftTopPos.y);
			c.lineTo(leftTopPos.x + this.borderLineLengthInside, leftTopPos.y);
			c.stroke();
            c.closePath();

            //BOTTOM LEFT CORNER
			c.beginPath();
			c.moveTo(leftBottomPos.x, leftBottomPos.y - this.borderLineLengthInside);
			c.lineTo(leftBottomPos.x, leftBottomPos.y - this.cornerInside);
			c.quadraticCurveTo(leftBottomPos.x, leftBottomPos.y, leftBottomPos.x + this.cornerInside, leftBottomPos.y);
			c.lineTo(leftBottomPos.x + this.borderLineLengthInside, leftBottomPos.y);
			c.stroke();
            c.closePath();

            //TOP RIGHT CORNER
			c.beginPath();
			c.moveTo(rightTopPos.x, rightTopPos.y + this.borderLineLengthInside);
			c.lineTo(rightTopPos.x, rightTopPos.y + this.cornerInside);
			c.quadraticCurveTo(rightTopPos.x, rightTopPos.y, rightTopPos.x - this.cornerInside, rightTopPos.y);
			c.lineTo(rightTopPos.x - this.borderLineLengthInside, rightTopPos.y);
			c.stroke();
            c.closePath();

            //BOTTOM RIGHT CORNER
			c.beginPath();
			c.moveTo(rightBottomPos.x, rightBottomPos.y - this.borderLineLengthInside);
			c.lineTo(rightBottomPos.x, rightBottomPos.y - this.cornerInside);
			c.quadraticCurveTo(rightBottomPos.x, rightBottomPos.y, rightBottomPos.x - this.cornerInside, rightBottomPos.y);
			c.lineTo(rightBottomPos.x - this.borderLineLengthInside, rightBottomPos.y);
			c.stroke();
            c.closePath();
			c.restore();
		}
	});
});
