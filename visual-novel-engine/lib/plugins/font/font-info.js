ig.module('plugins.font.font-info')
.requires('impact.impact')
.defines(function(){
    ig.FontInfo = ig.Class.extend({
        //Include font infos here
        fonts: [
            {name: 'script1', source: _BASEPATH.fonts+'inkfree'},
            {name: 'script2', source: _BASEPATH.fonts+'hugmetight'},
            {name: 'script3', source: _BASEPATH.fonts+'rage'},
            {name: 'script4', source: _BASEPATH.fonts+'segoepr'},
            
            {name: 'minecraft', source: _BASEPATH.fonts+'minecraft'},
            {name: 'retrogaming', source: _BASEPATH.fonts+'retrogaming'},
            {name: 'sans', source: _BASEPATH.fonts+'OpenSansCondensed-Regular'},
            {name: 'sansbold', source: _BASEPATH.fonts+'OpenSansCondensed-Bold'},
            {name: 'arialmt', source: _BASEPATH.fonts+'arialmt'},
            {name: 'arialmtbold', source: _BASEPATH.fonts+'arialmtbold'},
            {name: 'montserrat', source: _BASEPATH.fonts+'montserrat'},
            {name: 'metroblack', source: _BASEPATH.fonts+'metropolisblack'},
            {name: 'metromed', source: _BASEPATH.fonts+'metropolismedium'},
            {name: 'queensparkbold', source: _BASEPATH.fonts+'queensparkbold'},
            {name: 'queenspark', source: _BASEPATH.fonts+'queenspark'},
            {name: 'noirbold', source: _BASEPATH.fonts+'noir-pro-bold'},
            {name: 'noirsemi', source: _BASEPATH.fonts+'noir-pro-semibold'},
            {name: 'calibri', source: _BASEPATH.fonts+'calibri'}
        ],

        init: function(){
            this.registerCssFont();
        },

        /**Register font using css */
        registerCssFont: function(){
            if(this.fonts.length > 0){
                var newStyle = document.createElement('style');
                newStyle.type = "text/css"; 
                var textNode = '';
                for (var i = 0; i < this.fonts.length; i++) {
                    var font = this.fonts[i];
                    textNode += "@font-face {font-family: '" + font.name + "';src: url('" + font.source + ".eot');src: url('" + font.source + ".eot?#iefix') format('embedded-opentype'),url('" + font.source + ".woff2') format('woff2'),url('" + font.source + ".woff') format('woff'),url('" + font.source + ".ttf') format('truetype'),url('" + font.source + ".svg#svgFontName') format('svg')}";
                }
                
                newStyle.appendChild(document.createTextNode(textNode));
                document.head.appendChild(newStyle);
            }
        },

        isValid: function(){
            for (var i = 0; i < this.fonts.length; i++) {
                var font = this.fonts[i];                
                if(!this._isValidName(font.source))
                    return false;
            }
            return true;
        },
        
        _isValidName: function(name){
            // var regexp = /^[a-z0-9-\/_.]+$/;
            // var check = name;
            // if (check.search(regexp) == -1)
            //     return false;
            // else
                return true;
        },
    });
});