ig.module('game.entities.topoverlay.camera1')
.requires(
	'impact.entity'
)

.defines(function(){
	Entitycamera1 = ig.Entity.extend({
		zIndex:_DATAGAME.zIndexData.camera,
		radDot:15*_DATAGAME.ratioRes,
		borderLineLength:150*_DATAGAME.ratioRes,
		strokeWidth:5*_DATAGAME.ratioRes,
		padding:{x:50*_DATAGAME.ratioRes, y:50*_DATAGAME.ratioRes},

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
			c.lineCap = 'square';

			//TOP LEFT CORNER
			c.beginPath();
			c.moveTo(this.padding.x, this.padding.y + this.borderLineLength);
			c.lineTo(this.padding.x, this.padding.y);
			c.lineTo(this.padding.x + this.borderLineLength, this.padding.y);
			c.stroke();
            c.closePath();

            //BOTTOM LEFT CORNER
			c.beginPath();
			c.moveTo(this.padding.x, ig.system.height - this.padding.y - this.borderLineLength);
			c.lineTo(this.padding.x, ig.system.height - this.padding.y);
			c.lineTo(this.padding.x + this.borderLineLength, ig.system.height - this.padding.y);
			c.stroke();
            c.closePath();

            //TOP RIGHT CORNER
			c.beginPath();
			c.moveTo(ig.system.width - this.padding.x, this.padding.y + this.borderLineLength);
			c.lineTo(ig.system.width - this.padding.x, this.padding.y);
			c.lineTo(ig.system.width - this.padding.x - this.borderLineLength, this.padding.y);
			c.stroke();
            c.closePath();

            //BOTTOM RIGHT CORNER
			c.beginPath();
			c.moveTo(ig.system.width - this.padding.x, ig.system.height - this.padding.y - this.borderLineLength);
			c.lineTo(ig.system.width - this.padding.x, ig.system.height - this.padding.y);
			c.lineTo(ig.system.width - this.padding.x - this.borderLineLength, ig.system.height - this.padding.y);
			c.stroke();
            c.closePath();

            var paddingDot = (20 + this.radDot) * _DATAGAME.ratioRes;

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

            c.textBaseline = 'bottom';
            c.font = (30*_DATAGAME.ratioRes) + "px arialmtbold";
			this.totalTime++;
			c.fillText(ig.game.frameConvertToHourMinSec(this.totalTime), this.padding.x + (20 + this.strokeWidth/2)* _DATAGAME.ratioRes, ig.system.height - this.padding.y - 20* _DATAGAME.ratioRes);
			c.restore();

			//CAMERA
			c.save();
			var wRect = 100* _DATAGAME.ratioRes;
			var hRect = 50* _DATAGAME.ratioRes;
			var radCircle = 15* _DATAGAME.ratioRes;
			var paddingRect = 10*_DATAGAME.ratioRes;
			var paddingRectAll = 25*_DATAGAME.ratioRes;

			c.translate(ig.system.width - this.padding.x - wRect - paddingRectAll, ig.system.height - this.padding.y - hRect - paddingRectAll);
			c.strokeStyle = 'white';
			c.lineWidth = 4 * _DATAGAME.ratioRes;

			c.strokeRect(0, 0, wRect, hRect);

            c.beginPath();
			c.arc(paddingRect + radCircle, hRect/2, radCircle, 0, 2 * Math.PI);
			c.stroke();
			c.closePath();

			c.beginPath();
			c.arc(wRect - paddingRect - radCircle, hRect/2, radCircle, 0, 2 * Math.PI);
			c.stroke();
			c.closePath();

			c.beginPath();
			c.moveTo(paddingRect + radCircle, hRect/2-radCircle);
			c.lineTo(wRect - paddingRect - radCircle, hRect/2-radCircle);
			c.stroke();
			c.closePath();

			c.restore();

			//BATTERY
			c.save();
			var wRect = 100* _DATAGAME.ratioRes;
			var hRect = 50* _DATAGAME.ratioRes;
			var paddingRectB = 10*_DATAGAME.ratioRes;
			var cornerB = 10*_DATAGAME.ratioRes;
			var paddingRectAll = 25*_DATAGAME.ratioRes;

			c.translate(ig.system.width - this.padding.x - wRect - cornerB - paddingRectAll, this.padding.y + paddingRectAll);
			c.strokeStyle = 'white';
			c.fillStyle = 'white';
			c.lineWidth = 4 * _DATAGAME.ratioRes;

			c.strokeRect(cornerB, 0, wRect, hRect);
			c.fillRect(cornerB + paddingRectB, paddingRectB, wRect - paddingRectB*2, hRect - paddingRectB*2);
			c.fillRect(0, hRect / 2 - (hRect / 2 / 2), cornerB, hRect / 2);

			c.restore();
		}
	});
});
