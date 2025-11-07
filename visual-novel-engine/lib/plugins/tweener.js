/**
 * Object need modification
 * add 
 * this.parent(); 
 * at the begining of loadLevel of ig.Game (impact.game.js)
 * 
 * ---
 * How to use. Initialization case
 * ---
 * 
 *     var objAnimated = {pos:{x: 0, y: 0}}; //You can also animate entity
 *     this.tweener = new Tweener(
 *             objAnimated, // Object to be animated
 *             {pos: {y: 100}}, //Final property
 *             {
 *                 duration: 0.5, // speed
 *                 easing: ig.Tweener.Easing.Quartic.EaseOut, //Easing type. You can use ig.Tween.Easing...
 *                 loop: ig.Tweener.Loop.Reverse, //Loop type. you can use ig.Tween.Loop...
 *                 loopCount: 10, //Loop Count
 *                 //Callbacks
 *                 onStart: function(obj, value){
 *                     console.log('onStart: ', obj);
 *                     this.tweener.pause();
 *                 }.bind(this),
 *                 onUpdate: function(obj, value){
 *                     console.log('onUpdate: ', obj);
 *                 }.bind(this),
 *                 onPause: function(obj, value){
 *                     console.log('onPause: ', obj);
 *                         this.tweener.resume();
 *                 }.bind(this),
 *                 onResume: function(obj, value){
 *                     console.log('onResume: ', obj);
 *                 }.bind(this),
 *                 onComplete: function(obj, value){
 *                     console.log('onComplete: ', obj);
 *                 }.bind(this)
 *             }
 *         )
 *         .start();
 *     
 *     
 *     //---------Or you can use this initialization
 *     var objAnimated = {pos:{x: 0, y: 0}}; //You can also animate entity
 *     this.tweener = new Tweener(objAnimated) // Object to be animated
 *                 .to({pos: {y: 100}}, 0.5) //Final property + speed
 *                 .easing(ig.Tweener.Easing.Quartic.EaseOut)//Easing type. You can use ig.Tween.Easing...
 *                 .yoyo(true)//Loop type = ig.Tweener.Loop.Reverse.
 *                 .repeat(10)//Loop Count
 *                 //Callbacks
 *                 .onStart(function(obj, value){
 *                     console.log('onStart: ', obj);
 *                     this.tweener.pause();
 *                 }.bind(this))
 *                 .onUpdate(function(obj, value){
 *                     console.log('onUpdate: ', obj);
 *                 }.bind(this))
 *                 .onPause(function(obj, value){
 *                     console.log('onPause: ', obj);
 *                         this.tweener.resume();
 *                 }.bind(this))
 *                 .onResume(function(obj, value){
 *                     console.log('onResume: ', obj);
 *                 }.bind(this))
 *                 .onComplete(function(obj, value){
 *                     console.log('onComplete: ', obj);
 *                 }.bind(this))
 *                 .start(); 
 * 
 */
ig
.module('plugins.tweener')
.requires(
    // 'impact.entity'
    'impact.game'
    // 'plugins.addon.state-addon'
)
.defines(function(){
    ig.Game.inject({
        update: function() {
            this.parent();
            for (var i = 0; i < ig.Tweener.tweens.length; i++) {
                var tween = ig.Tweener.tweens[i];
                if(tween._running){
                    tween.update();
                }
            }
        },
    });
    
    // EntityTweenerHandler = ig.Entity.extend({
    //     init: function(x, y, settings){
    //         this.parent(x, y, settings);
    //         ig.Tweener.clearTweens();
    //     },
    //     update: function(){
    //         this.parent();
    //         for (var i = 0; i < ig.Tweener.tweens.length; i++) {
    //             var tween = ig.Tweener.tweens[i];
    //             if(tween._running){
    //                 tween.update();
    //             }
    //         }
    //     },
    //     kill: function(){
    //         ig.Tweener.clearTweens();
    //         this.parent();
    //     }
    // });
    ig.Tweener = {
        tweens:[],
        
        addTween: function(tweener){
            // if(ig.game){
            //     var tweenHanlder = ig.game.getEntitiesByType(EntityTweenerHandler);
            //     if(tweenHanlder.length < 1){
            //         ig.game.spawnEntity(EntityTweenerHandler,0,0);
            //     }
            // }
            this.tweens.push(tweener);
        },
        
        clearTweens: function(){
            this.tweens = [];
        },
        removeTween: function(tweener){
            var index = this.tweens.indexOf(tweener);
            this.tweens.splice(index, 1);
        },
        pause: function(){
            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].pause();
            }
        },
        resume: function(){
            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].resume();
            }
        },
        Easing:{
            Linear:{
                EaseNone: function ( k ) {
                    return k;
                }
            },
            Quadratic:{
                EaseIn: function( k ){
                    return k * k;
                },
                EaseOut: function( k ){
                    return - k * ( k - 2 );
                },
                EaseInOut: function( k ){
                    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
                    return - 0.5 * ( --k * ( k - 2 ) - 1 );
                },
            },
            Cubic:{
                EaseIn: function( k ){
                    return k * k * k;
                },
                EaseOut: function( k ){
                    return --k * k * k + 1;
                },
                EaseInOut: function( k ){
                    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
                    return 0.5 * ( ( k -= 2 ) * k * k + 2 );                    
                },
            },
            Quartic:{
                EaseIn: function( k ){
                    return k * k * k * k;
                },
                EaseOut: function( k ){
                    return - ( --k * k * k * k - 1 );
                },
                EaseInOut: function( k ){
                    if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
                    return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );                    
                },
            },
            Quintic:{
                EaseIn: function( k ){
                    return k * k * k * k * k;
                },
                EaseOut: function( k ){
                    return ( k = k - 1 ) * k * k * k * k + 1;
                },
                EaseInOut: function( k ){
                    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
                    return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );                    
                },
            },
            Sinusoidal:{
                EaseIn: function( k ){
                    return - Math.cos( k * Math.PI / 2 ) + 1;
                },
                EaseOut: function( k ){
                    return Math.sin( k * Math.PI / 2 );
                },
                EaseInOut: function( k ){
                    return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );
                },
            },
            Exponential:{
                EaseIn: function( k ){
                    return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );
                },
                EaseOut: function( k ){
                    return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;
                },
                EaseInOut: function( k ){
                    if ( k == 0 ) return 0;
                    if ( k == 1 ) return 1;
                    if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
                    return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );                    
                },
            },
            Circular:{
                EaseIn: function( k ){
                    return - ( Math.sqrt( 1 - k * k ) - 1);
                },
                EaseOut: function( k ){
                    return Math.sqrt( 1 - (--k * k) );
                },
                EaseInOut: function( k ){
                    if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
                    return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);                    
                },
            },
            Elastic:{
                EaseIn: function( k ){
                    var s, a = 0.1, p = 0.4;
                    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
                    if ( !a || a < 1 ) { a = 1; s = p / 4; }
                    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
                    return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                },
                EaseOut: function( k ){
                    var s, a = 0.1, p = 0.4;
                    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
                    if ( !a || a < 1 ) { a = 1; s = p / 4; }
                    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
                    return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
                },
                EaseInOut: function( k ){
                    var s, a = 0.1, p = 0.4;
                    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
                    if ( !a || a < 1 ) { a = 1; s = p / 4; }
                    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
                    if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                    return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;                    
                },
            },
            Back:{
                EaseIn: function( k ){
                    var s = 1.70158;
                    return k * k * ( ( s + 1 ) * k - s );
                },
                EaseOut: function( k ){
                    var s = 1.70158;
                    return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;
                },
                EaseInOut: function( k ){
                    var s = 1.70158 * 1.525;
                    if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
                    return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );                    
                },
            },
            Bounce:{
                EaseIn: function( k ){
                    return 1 - ig.Tweener.Easing.Bounce.EaseOut( 1 - k );
                },
                EaseOut: function( k ){
                    if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
                        return 7.5625 * k * k;
                    } else if ( k < ( 2 / 2.75 ) ) {
                        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                    } else if ( k < ( 2.5 / 2.75 ) ) {
                        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                    } else {
                        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                    }
                },
                EaseInOut: function( k ){
                    if ( k < 0.5 ) return ig.Tweener.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
                    return ig.Tweener.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;                    
                },
            },
        },
        Loop:{Revert: 1, Reverse:2}
    };
    Tweener = ig.Class.extend({
        _running: false,
        _obj: {},
        _objStart: {},
        _objEnd: {},
        _objDelta: {},
        _props: {},
        _started: false,
        _paused: false,
        _loopIndex: false,
        _elapsed: false,
        _timer: false,
        _value: 0,
        _startCallbackCalled: false,
        _settings:{
            duration: false,
            easing: ig.Tweener.Easing.Linear.EaseNone,
            delay: false,
            onStart: false,
            onComplete: false,
            onUpdate: false,
            onPause: false,
            onResume: false,
            loop: ig.Tweener.Loop.Revert,
            loopCount: 0,
            chains: [],
        },
        
        init: function(obj, objEnd, settings){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._obj = obj;
            if(objEnd)
                ig.merge(_this._props, objEnd);
            if(settings)
                ig.merge(_this._settings, settings);
        },
        start: function(){
            /** @type{Mod.Tweener} */
            var _this = this;
            ig.Tweener.addTween(_this);
            _this._loopIndex = _this._settings.loopCount;
            _this._running = true;
            _this._started = true;
            _this._elapsed = 0;
            _this._timer = new ig.Timer();
            _this._value = 0;
            for ( var property in _this._props ) {
                _this._initEnd(property, _this._props, _this._objEnd);
            }
            for ( var property2 in _this._objEnd ) {
                _this._initStart(property2, _this._objEnd, _this._obj, _this._objStart);
                _this._initDelta(property2, _this._objDelta, _this._obj, _this._objEnd);
            }
            if(_this._settings.onStart)
                _this._startCallbackCalled = true;
            return _this;
        },
        _isEmptyArray: function(check){
            return !(typeof check !== undefined && check.length > 0);
        },
        _initEnd: function(prop, from, to) {
            /** @type{Mod.Tweener} */
            var _this = this;
            if ( typeof(from[prop]) !== "object" ) {
                to[prop] = from[prop];
            } else {
                for ( subprop in from[prop] ) {
                    if ( !to[prop] ) to[prop] = {};
                    _this._initEnd( subprop, from[prop], to[prop] );
                }
            }
        },
        _initStart: function(prop, end, from, to) {
            /** @type{Mod.Tweener} */
            var _this = this;
            if ( typeof(from[prop]) !== "object" ) {
                if ( typeof(end[prop]) !== "undefined" ) to[prop] = from[prop];
            } else {
                for ( var subprop in from[prop] ) {
                    if ( !to[prop] ) to[prop] = {};
                    if ( typeof(end[prop]) !== "undefined" ) _this._initStart( subprop, end[prop], from[prop], to[prop] );
                }
            }
        },
        _initDelta: function(prop, delta, start, end) {
            /** @type{Mod.Tweener} */
            var _this = this;
            if ( typeof(end[prop]) !== "object" ) {
                delta[prop] = end[prop] - start[prop];
            } else {
                for ( var subprop in end[prop] ) {
                    if ( !delta[prop] ) delta[prop] = {};
                    _this._initDelta(subprop, delta[prop], start[prop], end[prop]);
                }
            }
        },
        _propSet: function(prop, from, to) {
            /** @type{Mod.Tweener} */
            var _this = this;
            if ( typeof(from[prop]) !== "object" ) {
                to[prop] = from[prop];
            } else {
                for (var subprop in from[prop] ) {
                    if ( !to[prop] ) to[prop] = {};
                    _this._propSet( subprop, from[prop], to[prop] );
                }
            }
        },
        
        _propUpdate: function(prop, obj, start, delta, value){
            /** @type{Mod.Tweener} */
            var _this = this;
            if ( typeof(start[prop]) !== "object" ) {
                if ( typeof start[prop] != "undefined" ) {
                    obj[prop] = start[prop] + delta[prop] * value;
                } else {
                    obj[prop] = obj[prop];
                }
            } else {
                for ( var subprop in start[prop] ) {
                    _this._propUpdate(subprop, obj[prop], start[prop], delta[prop], value);
                }
            }
        },
        update: function(){
            /** @type{Mod.Tweener} */
            var _this = this;
            
            if(!_this._running) return false;
            if(_this._settings.delay){
                if(_this._timer && _this._timer.delta() < _this._settings.delay) return;
                _this._settings.delay = 0;
                _this._timer.reset();
            }
            
            if(_this._startCallbackCalled){
                 _this._settings.onStart(_this._obj, _this._value);
                 _this._startCallbackCalled = false;
            }
            var elapsed = (_this._timer.delta() + _this._elapsed) / _this._settings.duration;
            elapsed = elapsed > 1 ? 1 : elapsed;
            var value = _this._settings.easing(elapsed);
            _this._value = value;
            
            for (var property in _this._objDelta ) {
                this._propUpdate(property, _this._obj, _this._objStart, _this._objDelta, value);
            }
            if(_this._settings.onUpdate) _this._settings.onUpdate(_this._obj, _this._value);
            if(elapsed >= 1){
                //Handling loop, chain
                if(_this._loopIndex === 0 || !_this._settings.loop){
                    _this._started = false;
                    _this._running = false;
                    _this.value = 0;
                    if(_this._settings.onComplete) _this._settings.onComplete(_this._obj, _this._value);
                    if(!_this._isEmptyArray(_this._settings.chains))
                        for (var i = 0; i < _this._settings.chains.length; i++) {
                            _this._settings.chains[i].start();
                        }
                    ig.Tweener.removeTween(_this);
                } else if(_this._settings.loop === ig.Tweener.Loop.Revert){
                    for(var property2 in _this._objStart){
                        _this._propSet(property2, _this._objStart, _this._obj);
                    }
                    _this._elapsed = 0;
                    _this._timer.reset();
                    if(_this._loopIndex != -1) _this._loopIndex--;
                } else if (_this._settings.loop === ig.Tweener.Loop.Reverse) {
                    var _start = {}, _end = {}, _delta = {};
                    ig.merge(_start, _this._objEnd);
                    ig.merge(_end, _this._objStart);
                    ig.merge(_this._objStart, _start);
                    ig.merge(_this._objEnd, _end);
                    for(var property3 in _this._objEnd){
                        _this._initDelta(property3, _this._objDelta, _this._obj, _this._objEnd);
                    }
                    _this._elapsed = 0;
                    _this._timer.reset();
                    if(_this._loopIndex != -1) _this._loopIndex --;
                }
            }
        },
        
        pause: function(){
            /** @type{Mod.Tweener} */
            var _this = this;
            if(_this._running){
                _this._running = false;
                if(_this._timer && _this._timer.delta)
                    _this._elapsed += _this._timer.delta();
                if(_this._settings.onPause) _this._settings.onPause(_this._obj, _this._value);
            }
            return _this;
        },
        resume: function(){
            /** @type{Mod.Tweener} */
            var _this = this;
            if(_this._started && !_this._running){
                _this._running = true;
                if(_this._timer && _this._timer.delta)
                    _this._timer.reset();
                if(_this._settings.onResume) _this._settings.onResume(_this._obj, _this._value);
            }
            return _this;
        },
        //Pass parameter complete = true. if you want to make it to final and run its chains
        stop: function(doComplete){
            /** @type{Mod.Tweener} */
            var _this = this;
            
            if(doComplete){
                _this._loopIndex = 0;
                _this._elapsed += _this._settings.duration;
                _this._running = true;
                _this.update();
            }else{
                _this._started = false;
                _this._running = false;
                _this.value = 0;
                ig.Tweener.removeTween(_this);
            }
            return _this;
        },
        //---Direct function
        
        to: function(final, duration){
            /** @type{Mod.Tweener} */
            var _this = this;
            ig.merge(_this._props, final);
            if(duration !== null || duration !== undefined)
                _this._settings.duration = duration;
            return _this;
        },
        delay: function(delay){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.delay = delay;
            return _this;
        },
        speed: function(speed){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.duration = speed;
            return _this;
        },
        easing: function(easing){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.easing = easing;
            return _this;
        },
        yoyo: function(yes){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.loop = (yes) ? ig.Tweener.Loop.Reverse : ig.Tweener.Loop.Revert;
            return _this;
        },
        repeat: function(times){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.loopCount = times ? times : 0;
            return _this;
        },
        onStart: function(callback){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.onStart = callback;
            return _this;
        }, 
        onUpdate: function(callback){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.onUpdate = callback;
            return _this;
        },  
        onPause: function(callback){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.onPause = callback;
            return _this;
        },   
        onResume: function(callback){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.onResume = callback;
            return _this;
        }, 
        onComplete: function(callback){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.onComplete = callback;
            return _this;
        },        
        
        addChain: function(chain){
            /** @type{Mod.Tweener} */
            var _this = this;
            var found = _this._settings.chains.filter(function(tweener){
                return chain === tweener;
            });
            if(found.length < 1)
                _this._settings.chains.push(chain);
            return this;
        },
        removeChain: function(chain){
            /** @type{Mod.Tweener} */
            var _this = this;
            var found = _this._settings.chains.indexOf(chain);
            if(found >= 0)
                _this._settings.chains.splice(found,1);
            return this;
        },
        setChain: function(chains){
            /** @type{Mod.Tweener} */
            var _this = this;
            for (var i = 0; i < chains.length; i++) {
                var chain = chains[i];
                _this.addChain(chain);
            }
            return this;
        },
        clearChain: function(){
            /** @type{Mod.Tweener} */
            var _this = this;
            _this._settings.chains = [];
            return this;
        },
    });
});