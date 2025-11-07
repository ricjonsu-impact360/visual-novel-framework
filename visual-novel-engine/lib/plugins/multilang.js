//v1.1.0
//What's new:
//The SelectLanguage object is not necerelly to be languageSelector

ig.module('plugins.multilang')
.requires(
    'game.entities.buttons.button',
    'impact.impact',
    'impact.entity',
    'plugins.tween'
)
.defines(function(){
    var slTextYPosAdd = 8;
    SelectLanguage = ig.Class.extend({
        zIndex: 99999,
        settings: {
            animationSpeed: 0.25,
            //[Recommended to be set on initiation]
            fontFamily: 'metroblack',//Font family applied for the whole dialog
            //[Recommended to be set on initiation]Custom call back when a language is selected,
            onSelected: false,
            //[Recommended to be set on initiation]Setting for show button which appear on the game as the dialog opener
            showButton: {
                font: {size: 23*_DATAGAME.ratioRes, color: 'white'},//Font properties
                radius: 5*_DATAGAME.ratioRes,//Corner round radius of the button
                bg: 'brown',//Background color of the box.
                stroke: {color: 'white', size: 2*_DATAGAME.ratioRes}//Stroke properties
            },
            //Setting for language selection dialog
            dialog: {
                overlayBaseOpacity: 0.5,//How dark the overlay
                width: 500*_DATAGAME.ratioRes,//Width of the dialog
                //Settings for caption / dialog title
                caption: {
                    font: {size: 20*_DATAGAME.ratioRes, color: 'black'},//Font properties of the caption
                    boxHeight: 70*_DATAGAME.ratioRes,//Height of the caption area
                    margin:{top: 0, bottom: 0},//Margin of the caption
                },
                //Settings for the language list in the dialog
                item: {
                    boxHeight: 50*_DATAGAME.ratioRes,//Height of the box
                    paddingLeft: 20*_DATAGAME.ratioRes,//Left padding of the box
                    font: {size: 18*_DATAGAME.ratioRes, color: 'black', colorSelected: 'white'},//Font properties
                    selectedBG: '#3069C2',//Background color of the box. Set to false to transparent
                },
                //Settings for the ok button in the dialog
                okButton: {
                    font: {size: 20*_DATAGAME.ratioRes, color: 'black'},//Font properties
                    stroke: {color: 'grey', size: 2*_DATAGAME.ratioRes},//Stroke properties
                    bg: false,//Background color of the box. Set to false to transparent
                    btnRadius: 5*_DATAGAME.ratioRes,//Corner round radius of the button
                    boxHeight: 50*_DATAGAME.ratioRes,//Height of the box
                    boxWidth: 200*_DATAGAME.ratioRes,//Width of the box
                    margin: {top: 20*_DATAGAME.ratioRes, bottom: 10*_DATAGAME.ratioRes}//Margin of the box. bottom=againts the dialog bottom. top=againts the last item of the language list
                },
            }
        },
        init: function(settings){
            ig.merge(this.settings, settings);
            this.itemLength = Object.keys(_LANG).length;
            this.calculateFontHeight();
            this.calculateDialogHeight();
            var browserLang = navigator.language;
            var queryLang = getQueryVariable('language');
            this.selected = (_LANG[queryLang]) ? queryLang : (_LANG[browserLang]) ? browserLang : 'en';
            this.fnAssignLanguage();

            ig.game.prevLang = this.selected;
            
            var pointers = ig.game.getEntitiesByType(EntityPointer);
            for (var i = 0; i < pointers.length; i++) {
                var pointer = pointers[i];
                pointer.size.x = 1;
                pointer.size.y = 1;
            }
            window['tlSelector'] = this;
        },
        calculateFontHeight: function(){
            var settings = this.settings,
                showButton = settings.showButton,
                dialog = settings.dialog;
                
            showButton.font.halfHeight = getTextHeight(settings.fontFamily, showButton.font.size).height * 0.5;
            dialog.caption.font.halfHeight = getTextHeight(settings.fontFamily, dialog.caption.font.size).height * 0.5;
            dialog.item.font.halfHeight = getTextHeight(settings.fontFamily, dialog.item.font.size).height * 0.5;
            dialog.okButton.font.halfHeight = getTextHeight(settings.fontFamily, dialog.okButton.font.size).height * 0.5;
        },
        calculateDialogHeight: function(){
            var settingDialog = this.settings.dialog;
            settingDialog.height = settingDialog.caption.boxHeight + settingDialog.caption.margin.top + settingDialog.caption.margin.bottom;
            settingDialog.height += this.itemLength * settingDialog.item.boxHeight;
            settingDialog.height += settingDialog.okButton.boxHeight + settingDialog.okButton.margin.top + settingDialog.okButton.margin.bottom;
        },
        fnAssignLanguage: function(){
            _STRINGS = fnSLClone(_LANG[this.selected]);

            if(typeof(this.settings.onSelected) === 'function')
                this.settings.onSelected(this.selected);
        },
        showDialog: function(){
            if(!this.dialog)
                this.dialog = ig.game.spawnEntity(EntitySLDialog, 0, 0, {SL: this});
        },
        hideDialog: function(){
            if(this.dialog){
                this.dialog.fnHide();
                delete(this.dialog);
            }
        },
    });

    //------------Dialog-------------
    EntitySLDialog = ig.Entity.extend({
        animateValue: 0,
        animating: false,
        gravityFactor: 0,
        size: {x: 0, y: 0},
        relZIndex: {
            overlay: 0,
            self: 1,
            okButton: 2,
            item: 3
        },
        init: function(x, y, settings){
            this.SL = settings.SL;
            //Count
            this.showPos = {x: ig.system.width * 0.5, y: ig.system.height * 0.5};
            this.hidePos = ig.copy(this.showPos);
            this.hidePos.y = -this.SL.settings.dialog.height * 0.5;
            this.pos = ig.copy(this.hidePos)
            this.uiPos = this.calculateUIRelPos();
            this.prepareUI();
            this.zIndex = this.SL.zIndex + this.relZIndex.self;
            ig.game.sortEntitiesDeferred();
            this.fnShow();
        },

        calculateUIRelPos: function(){
            var dialogSettings = this.SL.settings.dialog;
            var itemHalf = dialogSettings.item.boxHeight * 0.5;
            var top = dialogSettings.height * -0.5

            //Caption
            top += dialogSettings.caption.margin.top + dialogSettings.caption.boxHeight;
            var capPosY = top - (dialogSettings.caption.boxHeight * 0.5);
            var itemInitTop = top += dialogSettings.caption.margin.bottom;
            
            //Item
            var itemsPosY = [];
            for(var i = 0; i < this.SL.itemLength; i++){
                top += dialogSettings.item.boxHeight;
                var itemPos = top - (itemHalf * 0.5);
                itemsPosY.push(itemPos);
            };

            //Ok Button
            top += dialogSettings.okButton.margin.top + dialogSettings.okButton.boxHeight;
            var okButtonY = top - (dialogSettings.okButton.boxHeight * 0.5);

            return {
                capY: capPosY,
                itemsY: itemsPosY,
                okButtonY: okButtonY
            }
        },

        prepareUI: function(){
            var dialogSettings = this.SL.settings.dialog;
            //Create Overlay--------
            this.overlay = ig.game.spawnEntity(EntitySLDialogOverlay, 0, 0, {
                relPos: this.uiPos.capY,
                baseOpacity: this.SL.settings.dialog.overlayBaseOpacity
            });
            this.overlay.zIndex = this.SL.zIndex + this.relZIndex.overlay;
            // console.log(_LANG);

            //Create Items--------
            this.items = []
            var i = 0;
            for (var langCode in _LANG) {
                if (_LANG.hasOwnProperty(langCode)) {
                    var item = ig.game.spawnEntity(EntitySLDialogItem, 0, 0, {
                        langCode: langCode,
                        size: {x: dialogSettings.width, y: dialogSettings.item.boxHeight},
                        relPos: this.uiPos.itemsY[i],
                        zIndex: this.SL.zIndex + this.relZIndex.item,
                        SL: this.SL
                    });
                    this.items.push(item);
                }
                i++;
            }
            
            //Create Ok Button--------
            this.okButton = ig.game.spawnEntity(EntitySLOkButton, 0,0, {
                size: {x: dialogSettings.okButton.boxWidth, y: dialogSettings.okButton.boxHeight},
                relPos: this.uiPos.okButtonY,
                SL: this.SL,
                zIndex: this.SL.zIndex + this.relZIndex.okButton
            })
        },

        drawBg: function(){
            /**@type{CanvasRenderingContext2D} */
            var ctx = ig.system.context;
            var dialogSettings = this.SL.settings.dialog;
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'whitesmoke';
            fnSLRoundRect(
                ctx,
                this.pos.x - (dialogSettings.width * 0.5), this.pos.y - (dialogSettings.height * 0.5),
                dialogSettings.width, dialogSettings.height,
                10, true, true
            );
            ctx.restore();
        },

        drawCaption: function(){
            /**@type{CanvasRenderingContext2D} */
            var ctx = ig.system.context;
            var text = _STRINGS.lang.select;
            var captionSettings = this.SL.settings.dialog.caption
            ctx.save();

            var fontFamily = this.SL.settings.fontFamily,
                fontSize = Math.round(ig.game.fontNameSize*0.4*_DATAGAME.ratioRes * ig.game.fontRatio),
                halfHeight = captionSettings.font.halfHeight;

            fnSLWrite(
                ctx, 
                text, 
                ig.game.fontName, 
                fontSize, 
                captionSettings.font.color,
                'center',
                this.pos.x,
                this.pos.y + this.uiPos.capY + halfHeight
            )
            ctx.restore();
            
        },

        draw: function(){
            this.parent();
            this.drawBg();
            this.drawCaption();
        },

        fnShow: function(){
            this.animating = true;
            this.tween(
                {
                    pos:{y: this.showPos.y},
                    overlay: {opacity: 1}
                },
                this.SL.settings.animationSpeed,
                {
                    easing: ig.Tween.Easing.Exponential.EaseOut,
                    onComplete: function(){
                        for (var i = 0; i < this.items.length; i++) {
                            var item = this.items[i];
                            item.enableClick = true;
                        }
                        this.okButton.enableClick = true;
                        this.animating = false;
                    }.bind(this),
                }
            ).start();
        },

        fnHide: function(callback){
            this.SL.closeCallback = callback;
            this.animating = true;
            this.SL.requestDialogDestroy = true;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item.enableClick = false;
            }
            this.okButton.enableClick = false;
            this.tween(
                {
                    pos:{y: this.hidePos.y},
                    overlay: {opacity: 0}
                },
                this.SL.settings.animationSpeed,
                {
                    easing: ig.Tween.Easing.Exponential.EaseIn,
                    onComplete: function(){
                        ig.game.prevLang = this.selected;

                        this.animating = false;
                        this.SL.fnAssignLanguage();
                        this.SL.settings.fontFamily = ig.game.fontName;
                        ig.game.currentWindow.changeLanguage();
                        this.kill();
                    }.bind(this),
                }
            ).start();
        },

        updatePos: function(){
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                fnSLSetCenter(item, {x: this.pos.x, y: this.pos.y + item.relPos});
            }
            fnSLSetCenter(this.okButton, {x: this.pos.x, y: this.pos.y + this.okButton.relPos})
        },

        update: function(){
            this.parent();
            if(this.animating){
                this.updatePos();
            }
        },

        kill: function(){
            this.overlay.kill();
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item.kill();
            }
            this.okButton.kill();
            this.parent();
        },
    });

    EntitySLDialogOverlay = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        gravityFactor: 0,
        opacity: 0,
        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.size = {
                x: ig.system.width, 
                y: ig.system.height
            }
        },
        drawBg: function(){
            /**@type{CanvasRenderingContext2D} */
            var ctx = ig.system.context;
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,'+ (this.baseOpacity * this.opacity) +')';
            // ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
            ctx.fillRect(0, 0, ig.system.width, ig.system.height);
            ctx.restore();
        },
        draw: function(){
            this.parent();
            this.drawBg();
        },
    });

    EntitySLDialogItem = EntityButton.extend({
        // type: ig.Entity.TYPE.B,
        gravityFactor: 0,
        enableClick: false,
        init: function(x, y, settings){
            this.parent(x, y, settings);

        },
        clicked: function(){
            if(this.enableClick){
                console.log('Item '+this.langCode+' Clicked!');
            }
        },
        released: function(){
            if(this.enableClick){
                console.log('Item '+this.langCode+' Released!');
                this.SL.selected = this.langCode;
            }
        },
        draw: function(){
            this.parent();
            this.drawBG();
            this.drawText();
        },
        drawBG: function(){
            var bg = false;
            if(this.SL.selected === this.langCode){
                bg = this.SL.settings.dialog.item.selectedBG || false;
            }
            if(bg){
                /**@type{CanvasRenderingContext2D} */
                var ctx = ig.system.context;
                ctx.save();
                ctx.fillStyle = bg;
                ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
                ctx.restore();
            }
        },
        drawText: function(){
            var text = _LANG[this.langCode].lang.label;
            var itemSettings = this.SL.settings.dialog.item;
            var center = fnSLGetCenter(this);
            var color = itemSettings.font.color;
            if(this.SL.selected === this.langCode){
                color = itemSettings.font.colorSelected || color;
            }
            /**@type{CanvasRenderingContext2D} */
            var ctx = ig.system.context;
            ctx.save();

            var fontFamily = this.SL.settings.fontFamily,
                fontSize = Math.round(ig.game.fontNameSize*0.4*_DATAGAME.ratioRes * ig.game.fontRatio),
                halfHeight = itemSettings.font.halfHeight;

            fnSLWrite(
                ctx, 
                text,
                fontFamily, 
                fontSize, 
                color, 
                'left', 
                this.pos.x + itemSettings.paddingLeft,
                center.y + halfHeight
            );
            ctx.save();
        },
    });

    EntitySLOkButton = EntityButton.extend({
        // type: ig.Entity.TYPE.B,
        gravityFactor: 0,
        enableClick: false,
        init: function(x, y, settings){
            this.parent(x, y, settings);
        },
        clicked: function(){
            if(this.enableClick){
                console.log('Ok Clicked!');
            }
        },
        released: function(){
            if(this.enableClick){
                console.log('Ok Released!');
                this.SL.hideDialog();
                ig.game.currentWindow.enabledButton(true);
                ig.game.checkFont();
                if(!_DATAGAME.isLinearChapter) ig.game.sortChapterList();
            }
        },
        draw: function(){
            this.parent();
            this.drawButton();
            this.drawCaption();
        },
        drawButton: function(){
            var bg = this.SL.settings.dialog.okButton.bg || false;
            if(this.SL.settings.dialog.okButton.stroke){
                var strokeColor = this.SL.settings.dialog.okButton.stroke.color || false;
                var strokeWidth = this.SL.settings.dialog.okButton.stroke.size || false
            }
            if(bg || strokeColor){
                /**@type{CanvasRenderingContext2D} */
                var ctx = ig.system.context;
                ctx.save();
                if(bg) ctx.fillStyle = bg;
                if(strokeColor) ctx.strokeStyle = strokeColor;
                if(strokeWidth) ctx.lineWidth = strokeWidth;
                fnSLRoundRect(
                    ctx,
                    this.pos.x, this.pos.y,
                    this.size.x, this.size.y,
                    this.SL.settings.dialog.okButton.btnRadius || 5,
                    bg ? true : false, 
                    strokeColor ? true : false
                )
                ctx.restore();
            }
        },
        drawCaption: function(){
            var center = fnSLGetCenter(this);
            /**@type{CanvasRenderingContext2D} */
            var ctx = ig.system.context;
            ctx.save();

            var fontFamily = this.SL.settings.fontFamily,
                fontSize = Math.round(ig.game.fontNameSize*0.4*_DATAGAME.ratioRes * ig.game.fontRatio),
                halfHeight = this.SL.settings.dialog.okButton.font.halfHeight;

            fnSLWrite(
                ctx, 
                _STRINGS.lang.ok, 
                fontFamily,
                fontSize,
                this.SL.settings.dialog.okButton.font.color,
                'center', center.x, center.y + halfHeight
            )
            ctx.restore();
        },
    });

    EntitySLShowBtn = EntityButton.extend({
        // type: ig.Entity.TYPE.B,
        gravityFactor: 0,
        enableClick:true,
        alpha:1,
        image:new ig.Image(_RESOURCESINFO.image.globe),
        imageButton: new ig.Image(_RESOURCESINFO.image.btnBlank2, 253*_DATAGAME.ratioRes, 75*_DATAGAME.ratioRes),
        size: {
            x: 253*_DATAGAME.ratioRes,
            y: 75*_DATAGAME.ratioRes,
        },

        clicked: function(){
            // console.log('a');
            if(this.enableClick  && this.isClickable){
                // console.log('Clicked');
                window['tlSelector'].showDialog();
                ig.game.currentWindow.enabledButton(false);
            }
        },
        released: function(){
            if(this.enableClick){
                console.log('Released');
            }
        },
        draw: function(){
            this.parent();
            var context = ig.system.context
            context.save()
            context.globalAlpha = this.alpha;
            // this.drawBg();
            this.imageButton.draw(this.pos.x, this.pos.y);
            this.drawImage()
            this.drawCaption();
            context.restore()
        },
        drawBg: function(){
            var bg = window['tlSelector'].settings.showButton.bg || false;
            var stroke = window['tlSelector'].settings.showButton.stroke || false;
            if(bg || stroke){
                /**@type{CanvasRenderingContext2D} */
                var ctx = ig.system.context;
                ctx.save();
                if(bg)  ctx.fillStyle = bg;
                if(stroke){
                    ctx.strokeStyle = stroke.color;
                    ctx.lineWidth = stroke.size;
                } 
                fnSLRoundRect(
                    ctx,
                    this.pos.x, this.pos.y, this.size.x, this.size.y,
                    window['tlSelector'].settings.showButton.radius || 5,
                    bg ? true : false, stroke ? true : false
                );
                ctx.restore();
            }
        },
        drawImage:function(){
            var imgH = this.size.y;
            var sourceX = 0;
            var sourceY = 0;
            var x = this.pos.x;
            var y = this.pos.y;
            var context = ig.system.context;
            context.save()
            this.image.draw(x + 24*_DATAGAME.ratioRes, y + 21*_DATAGAME.ratioRes);
            context.restore()
        },
        drawCaption: function(){
            var center = fnSLGetCenter(this);
            /**@type{CanvasRenderingContext2D} */
            var ctx = ig.system.context;
            ctx.save();
            var fontFamily = window['tlSelector'].settings.fontFamily,
                fontSize = Math.round(ig.game.fontNameSize*0.41*_DATAGAME.ratioRes * ig.game.fontRatio);
                halfHeight = window['tlSelector'].settings.showButton.font.halfHeight;

            fnSLWrite(
                ctx, _STRINGS.lang.select, ig.game.fontName, fontSize,
                // window['tlSelector'].settings.showButton.font.color,
                ig.game.buttonTextColor,
                'center', center.x + 19*_DATAGAME.ratioRes, center.y + halfHeight + ig.game.checkArialOffset(fontSize) + (_DATAGAME.uiColor[_DATAGAME.uiTheme].button.textOffsetY*_DATAGAME.ratioRes*_DATAGAME.multiplierOffsetTextButtonBlankSmall)
                // {stroke:'white', lineWidth:3}
            );
            ctx.restore();
        },
    });

    //------------helper-------------
    function fnSLGetCenter(entity){
        return {
            x: entity.pos.x + entity.size.x * 0.5,
            y: entity.pos.y + entity.size.y * 0.5,
        };
    };

    function fnSLSetCenter(entity, centerPos){
        entity.pos = {
            x: centerPos.x - entity.size.x * 0.5,
            y: centerPos.y - entity.size.y * 0.5
        };
    };

    function fnSLWrite(ctx, text, family, size, color, align, x, y){
        ctx.font = size + "pt " + family;
        ctx.textAlign = align;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    };

    function fnSLRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    };

    function fnSLClone(obj){
        return JSON.parse(JSON.stringify(obj));
    };

    function getTextHeight(font, fontSize) {

        var text = $('<span>Hg</span>').css({ fontFamily: font, fontSize: fontSize });
        var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
      
        var div = $('<div></div>');
        div.append(text, block);
      
        var body = $('body');
        body.append(div);
      
        try {
      
          var result = {};
      
          block.css({ verticalAlign: 'baseline' });
          result.ascent = block.offset().top - text.offset().top;
      
          block.css({ verticalAlign: 'bottom' });
          result.height = block.offset().top - text.offset().top;
      
          result.descent = result.height - result.ascent;
      
        } finally {
          div.remove();
        }
      
        return result;
      };
});