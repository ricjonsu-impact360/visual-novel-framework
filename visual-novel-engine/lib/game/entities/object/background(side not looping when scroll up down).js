// ig.module('game.entities.object.background')
// .requires(
// 	'impact.entity',
// 	'plugins.data.vector'
// )
// .defines(function() {
// 	EntityBackground = ig.Entity.extend({
// 	    image: null,
// 	    isLoop: true,
// 	    isMenu: false,
// 	    placeName:'',
// 	    offsetXBG:0,
// 	    offsetYBG:0,
// 	    moveStatus : {
// 	    	LEFT : 1, 
// 	    	RIGHT : 2,
// 	    	SCALE : 3, 
// 	    	NONE : 0
// 	    },
// 	    statMove : 0,
// 	    scale:1,
// 	    pntX:0.5, 
// 	    pntY:0.5,
// 	    posScaleX:0, 
// 	    posScaleY:0, 
// 	    zIndex:0,
// 	    size: {x:2880, y:1920},

// 	    bigSize: {x:2880, y:1920},

// 	    isImage:false,
// 	    isVertical:false,
// 	    isScroll:false,
// 	    scrollDirection:'left',

// 	    speed:10,
// 	    posScroll: {x:0, y:0},
	    
// 	    init: function (x, y, settings) {
// 	    	this.parent(x,y,settings);

// 	  //   	$.ajax({
// 			// 	url:path, 
// 			// 	dataType: 'json',
// 			// 	async: false,
// 			// 	success:this.showFiles.bind(this)
// 			// });

// 	    	this.isImage = (this.placeName.substring(0, 1) == '#') ? false:true;

// 	    	if(this.isImage) {
// 				if(_DATAGAME.smallBG.indexOf(this.placeName) >= 0) this.size = { x:1920, y:1920 };

// 	    		this.cvsBG = document.createElement("canvas");
// 		        this.ctxBG = this.cvsBG.getContext("2d");
// 		        this.image = new ig.Image(_BASEPATH.background + this.placeName + '.' + _DATAGAME.BGFileType[this.placeName], this.size.x, this.size.y);
// 		        this.repos();
// 	    	}
// 	    },

// 	    calculatePosBG:function() {
// 	    	// var ratioX = (Math.abs(-ig.game.screen.x + this._parent.posXBG - this.offsetXBG) + ig.system.width * this.pntX) / this.cvsBG.width;
// 	        var ratioX = (Math.abs(-ig.game.screen.x + this._parent.posXBG + this.posScroll.x - this.offsetXBG) + (-ig.game.screen.x + ig.sizeHandler.minW * this.pntX)) / this.cvsBG.width;
// 	        // var widthY = Math.abs(-ig.game.screen.y + this._parent.posYBG) + (ig.system.height * this.pntY);
// 	        // if(ig.sizeHandler.isPortrait) {
// 	        	var widthY = this.cvsBG.height * this.pntY;
// 	        // }
// 	        // var ratioY = widthY / this.cvsBG.height;
// 	        var ratioY = (Math.abs(-ig.game.screen.y + this._parent.posYBG + this.posScroll.y - this.offsetYBG) + (-ig.game.screen.y + ig.sizeHandler.minH * this.pntY)) / this.cvsBG.height;
// 	        if(!this.isVertical) ratioY = widthY / this.cvsBG.height;

// 	        // if(ratioX == 0) { ratioX = this.pntX; } //0.5
// 	        // if(ratioY == 0) { ratioY = this.pntY; } //0.5

// 	        this.posScaleX = (this.cvsBG.width * (this._parent.zoomBG - 1)) * ratioX;
// 	       	this.posScaleY = (this.cvsBG.height * (this._parent.zoomBG - 1)) * ratioY;
// 	        // scaleY = 0;

// 	        this.pos.x = (-ig.game.screen.x + this._parent.posXBG + this.posScroll.x - this.offsetXBG - this.posScaleX);
// 	        this.pos.y = (-ig.game.screen.y + this._parent.posYBG - this.offsetYBG - this.posScaleY + this.posScroll.y); 
// 	    },

// 	    draw: function () {
// 	    	var c  = ig.system.context;

// 	    	if(this.isClear==true){
//                 c.clearRect(0,0,ig.system.width,ig.system.height);
//                 return;
//             }

// 	    	if(this.isImage) {
// 	    		c.save();

// 	    		if(this.isLoop) {
// 	    			if(!this.isVertical) {
// 			        	c.fillStyle = _DATAGAME.colorBG['top' + this.placeName];
// 				        c.fillRect(0, 0, ig.system.width, ig.system.height/2 + (this._parent.posYBG));
// 				        // c.fillRect(0, 0, ig.system.width, ig.system.height/2 + this._parent.posYBG);
				    
// 				        c.fillStyle = _DATAGAME.colorBG['floor' + this.placeName];
// 				        c.fillRect(0, ig.game.midY + this._parent.posYBG, ig.system.width, ig.system.height/2 + (this._parent.posYBG * -1));
// 				        // c.fillRect(0, ig.game.midY + this._parent.posYBG, ig.system.width, ig.system.height/2);
// 				    }
// 			    }

// 			    if(this.isScroll) {
// 			    	if (ig.game.isPauseSetting) { }
//             		else if (ig.Timer.timeScale == 0) { }
//             		else {
// 				    	if(this.scrollDirection == 'up' || this.scrollDirection == 'down') this.posScroll.y += this.speed;
// 				        else this.posScroll.x += this.speed;
// 				    }
// 			    }

// 		        this.calculatePosBG();

// 		        if(Math.abs(this.posScroll.x) >= this.size.x*2) {
// 		        	if(this.posScroll.x < 0) {
// 		        		this.posScroll.x += this.size.x*2;
// 		        	} else {
// 			        	this.posScroll.x -= this.size.x*2;
// 			        }
// 		        }

// 		        if(Math.abs(this.posScroll.y) >= this.size.y) {
// 		        	if(this.posScroll.y < 0) {
// 		        		this.posScroll.y += this.size.y;
// 		        	} else {
// 			        	this.posScroll.y -= this.size.y;
// 			        }
// 		        }
		        
// 		        c.translate(this.pos.x, this.pos.y); 
		        
		      	 
// 			    c.drawImage(this.cvsBG, 0, 0, this.cvsBG.width * this._parent.zoomBG, this.cvsBG.height * this._parent.zoomBG);
			    
// 		        // c.translate(-ig.game.screen.x + this._parent.posXBG - this.offsetXBG - scaleX, -ig.game.screen.y + this._parent.posYBG - scaleY); 
// 		        // c.drawImage(this.cvsBG, 0, 0);

// 		        c.restore();
		       
// 	    	} else {
// 	    		c.save();
// 	    		c.fillStyle = this.placeName;
// 	    		// c.fillStyle = 'white';
// 	    		c.fillRect(0, 0, ig.system.width, ig.system.height);
// 	    		c.restore();
// 	    	}
	        
// 	    },

// 	    repos: function () {

// 	        // var r1 = this.image.width / this.image.height,
// 	        //     r2 = ig.system.width / ig.system.height;
// 	        // if (r1 > r2) {
// 	        //     this.bgH = this.image.height;
// 	        //     this.bgW = this.bgH * r2;
// 	        //     this.bgX = (this.image.width - this.bgW) / 2;
// 	        //     this.bgY = 0;
// 	        // } else {
// 	        //     this.bgW = this.image.width;
// 	        //     this.bgH = this.bgW / r2;
// 	        //     this.bgX = 0;
// 	        //     this.bgY = (this.image.height - this.bgH) / 2;
// 	        // }

// 	        if(this.isLoop) {
// 	        	if(this.isImage && this.ctxBG){
// 		        	// var minusX = 0;
// 		        	// if(this.size.x == this.bigSize.x) { minusX = -(600*_DATAGAME.ratioRes); }
// 		        	var minusX = -this.size.x/2 + ig.sizeHandler.minW/2;

// 		        	var posLeft = this.size.x*2;
// 		        	var posRight = -this.size.x*2;

// 		        	// var posLeft = this._parent.posXBG;
// 		        	// var posRight = this._parent.posXBG;

// 		        	// if(this.statMove == this.moveStatus.LEFT) {
// 		        	// 	posRight = this._parent.lastposXBG;
// 		        	// } else if(this.statMove == this.moveStatus.RIGHT) {
// 		        	// 	posLeft = this._parent.lastposXBG;
// 		        	// }

// 		        	var c=0;
// 		            while(c > ig.game.screen.x - posLeft) {
// 		            	c-=this.size.x; 
// 		            }
// 		            this.offsetXBG = -c;

// 		            var plusSizeX = this.size.x;

// 		            var d=0;
// 		            while(d<ig.system.width - posRight + plusSizeX){
// 		                d+=this.size.x; 
// 		            }

// 		            if(this.isVertical) {
// 			            this.offsetYBG = 1920*2;
// 			            d = this.size.x;
// 			            posRight = this.size.x;
// 			            plusSizeX = 0;
// 			            if(ig.sizeHandler.isPortrait || ig.system.width < this.size.x) {
// 			            	posRight = ig.system.width - 1;
// 			            }
// 			        } else {
// 			        	this.offsetYBG = 0;
// 			        }

// 		            this.cvsBG.width=ig.system.width + this.offsetXBG + d; 
// 		            this.cvsBG.height=ig.system.height + this.offsetYBG*2;

// 		            if(ig.sizeHandler.isPortrait && !this.isVertical) {
// 			        	this.cvsBG.height=this.size.y;
// 			        }

// 		            this.ctxBG.clearRect(0,0,ig.system.width + this.offsetXBG + d,ig.system.height);
		            
// 		            var a=0;
// 		            var modA=1;
// 		            while(a<ig.system.width - posRight + plusSizeX){
// 		            	this.ctxBG.save();
// 		            	if(modA%2==1){
// 		            		this.ctxBG.scale(1, 1);
// 			                this.image.drawCtx(this.ctxBG, a + this.offsetXBG + minusX, 0);

// 			                if(this.isVertical){
// 				            	this.image.drawCtx(this.ctxBG, a + this.offsetXBG + minusX, this.size.y);
// 				            	this.image.drawCtx(this.ctxBG, a + this.offsetXBG + minusX, this.size.y*2);
// 				            	this.image.drawCtx(this.ctxBG, a + this.offsetXBG + minusX, this.size.y*3);
// 				            	this.image.drawCtx(this.ctxBG, a + this.offsetXBG + minusX, this.size.y*4);
// 				            }
// 			            } else {
// 			            	if(!this.isVertical) {
// 				            	this.ctxBG.translate(a + this.offsetXBG + minusX+this.size.x, 0);
// 				            	this.ctxBG.scale(-1, 1);
// 				            	this.image.drawCtx(this.ctxBG, 0, 0);
// 			            	}

// 			            	if(this.isVertical){
// 				            	this.image.drawCtx(this.ctxBG, 0, this.size.y);
// 				            	this.image.drawCtx(this.ctxBG, 0, this.size.y*2);
// 				            	this.image.drawCtx(this.ctxBG, 0, this.size.y*3);
// 				            	this.image.drawCtx(this.ctxBG, 0, this.size.y*4);
// 				            }
// 			            	// this.ctxBG.scale(-1, 1);
// 			            	// this.ctxBG.translate(this.size.x, 0);
// 			            	// console.log( a + this.offsetXBG + minusX);
// 			             //    this.image.drawCtx(this.ctxBG, a + this.offsetXBG + minusX, 0);
// 			            }
// 			            this.ctxBG.restore();
// 			            a+=this.size.x;
// 			            modA++;
// 		            }

// 		            if(!this.isVertical) {
// 			            var b=0;
// 			            var modB=1;
// 			            while(b > ig.game.screen.x - posLeft) {
// 			            	b-=this.size.x;
// 			            	this.ctxBG.save();
// 			            	if(modB%2==1){
// 			            		this.ctxBG.translate(b + this.offsetXBG + minusX+this.size.x, 0);
// 				            	this.ctxBG.scale(-1, 1);
// 				            	this.image.drawCtx(this.ctxBG, 0, 0);

// 				            	if(this.isVertical){
// 					            	this.image.drawCtx(this.ctxBG, 0, this.size.y);
// 					            	this.image.drawCtx(this.ctxBG, 0, this.size.y*2);
// 					            	this.image.drawCtx(this.ctxBG, 0, this.size.y*3);
// 					            	this.image.drawCtx(this.ctxBG, 0, this.size.y*4);
// 					            }
// 			            	} else {
// 			            		this.ctxBG.scale(1, 1);
// 								this.image.drawCtx(this.ctxBG, b + this.offsetXBG + minusX, 0);

// 								if(this.isVertical){
// 					            	this.image.drawCtx(this.ctxBG, b + this.offsetXBG + minusX, this.size.y);
// 					            	this.image.drawCtx(this.ctxBG, b + this.offsetXBG + minusX, this.size.y*2);
// 					            	this.image.drawCtx(this.ctxBG, b + this.offsetXBG + minusX, this.size.y*3);
// 					            	this.image.drawCtx(this.ctxBG, b + this.offsetXBG + minusX, this.size.y*4);
// 					            }
// 			            	}
// 							this.ctxBG.restore();
// 							modB++;
// 			            }
// 			        }
// 		        }
// 	        }
// 	        else {
// 		        if(this.isImage && this.ctxBG){
// 		        	var minusX = -this.size.x/2 + ig.sizeHandler.minW/2;

// 		        	var posLeft = this._parent.posXBG;
// 		        	var posRight = this._parent.posXBG;

// 		        	if(this.statMove == this.moveStatus.LEFT) {
// 		        		posRight = this._parent.lastposXBG;
// 		        	} else if(this.statMove == this.moveStatus.RIGHT) {
// 		        		posLeft = this._parent.lastposXBG;
// 		        	}

// 		        	var c=0;
// 		            while(c > ig.game.screen.x - posLeft) {
// 		            	c-=this.size.x; 
// 		            }
// 		            this.offsetXBG = -c;

// 		            var plusSizeX = this.size.x;

// 		            var d=0;
// 		            while(d<ig.system.width - posRight + plusSizeX){
// 		                d+=this.size.x; 
// 		            }

// 		            this.cvsBG.width=ig.system.width + this.offsetXBG + d;
// 		            this.cvsBG.height=ig.system.height;

// 		            if(ig.sizeHandler.isPortrait) {
// 			        	this.cvsBG.height=this.size.y;
// 			        }

// 		            this.ctxBG.clearRect(0,0,ig.system.width + this.offsetXBG + d,ig.system.height);

// 		            // this.image.drawCtx(this.ctxBG, this.offsetXBG + minusX, 0);
// 		            this.image.drawCtx(this.ctxBG, this.offsetXBG + minusX, (ig.sizeHandler.minH - this.size.y) / 2 * -1);
// 		        }
// 		    }
// 	    }
//   	});

// 	EntityOverlayBackground = ig.Entity.extend({
// 	    image: null,
// 	    placeName:'',
// 	    zIndex:0,
// 	    size: {x:2880, y:1920},

// 	    bigSize: {x:2880, y:1920},

// 	    isImage:false,

// 	    // imgNoise:new ig.Image(_RESOURCESINFO.image.noise),
	    
// 	    init: function (x, y, settings) {
// 	    	this.parent(x,y,settings);

// 	    	this.isImage = (this.placeName.substring(0, 1) == '#') ? false:true;

// 	    	if(this.isImage) {
// 				if(_DATAGAME.smallBG.indexOf(this.placeName) >= 0) this.size = { x:1920, y:1920 };
// 		        this.image = new ig.Image(_BASEPATH.background + this.placeName + '.' + _DATAGAME.BGFileType[this.placeName], this.size.x, this.size.y);
// 		        this.cvsBG = document.createElement("canvas");
// 		        this.ctxBG = this.cvsBG.getContext("2d");
// 		        this.repos();
// 	    	}
// 	    },

// 	    draw: function () {
// 	    	var c  = ig.system.context;

// 	    	if(this.isImage) {
// 	    		c.save();
// 	    		// c.filter = 'blur(2px)';
// 	    		this.image.draw(0, 0, this.bgX, this.bgY, this.bgW, this.bgH, ig.system.width, ig.system.height);
// 	    		this.image.draw(0, 0, this.bgX, this.bgY, this.bgW, this.bgH, ig.system.width, ig.system.height);

// 	    		c.globalAlpha = 0.5;
// 	    		this.image.draw(-4, 0, this.bgX, this.bgY, this.bgW, this.bgH, ig.system.width, ig.system.height);
// 	    		this.image.draw(4, 0, this.bgX, this.bgY, this.bgW, this.bgH, ig.system.width, ig.system.height);

// 	    		// c.globalAlpha = 1;
// 	    		// this.imgNoise.draw(0, 0, 0, 0, this.imgNoise.width, this.imgNoise.height, ig.system.width, ig.system.height)
// 	    		// c.globalAlpha = 0.5;
// 	    		c.fillStyle = 'black';
// 	    		c.fillRect(0, 0, ig.system.width, ig.system.height);
// 		        c.restore();
// 	    	}
// 	    },

// 	    repos: function () {
// 	    	if(this.isImage) {
// 		        var r1 = this.image.width / this.image.height,
// 		            r2 = ig.system.width / ig.system.height;
// 		        if (r1 > r2) {
// 		            this.bgH = this.image.height;
// 		            this.bgW = this.bgH * r2;
// 		            this.bgX = (this.image.width - this.bgW) / 2;
// 		            this.bgY = 0;
// 		        } else {
// 		            this.bgW = this.image.width;
// 		            this.bgH = this.bgW / r2;
// 		            this.bgX = 0;
// 		            this.bgY = (this.image.height - this.bgH) / 2;
// 		        }
// 		    }
// 	    }
//   	});
// });