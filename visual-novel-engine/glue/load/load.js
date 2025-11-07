/*
# MarketJS Game Loading System
# -----------------------------------------------------------------------
# Copyright (c) 2012 MarketJS Limited. Certain portions may come from 3rd parties and
# carry their own licensing terms and are referenced where applicable. 
# -----------------------------------------------------------------------
*/

function loadScriptsSynchronously(arr) {
    if (!arr || !arr.length) return;
    var i;
    var loadFunctions = [];
    for (i = arr.length - 1; i >= 0; --i) {
        if (i == arr.length - 1) {
            loadFunctions[i] = (function (idx) { return function () { jQuery.getScript(arr[idx], function () { }); }; })(i);
        } else {
            loadFunctions[i] = (function (idx) { return function () { jQuery.getScript(arr[idx], loadFunctions[idx + 1]); }; })(i);
        }
    }
    loadFunctions[0]();
}

// if not on server, run compiled version
// loadScriptsSynchronously([

_LOADSCRIPTS.push(
	'media/text/strings.js',

	//DATAGAME
	'settings/dev.js',
	'lib/game/entities/object/handpart.js',
	'lib/game/entities/object/emo_eye.js',
	'lib/game/entities/game-setting/datagame.js',
	'lib/game/entities/game-setting/resources-info.js',

	//CUSTOM LOAD
	// 'lib/game/entities/customload.js',

	// _STRINGS
	// _GAMESETTING._BASEPATH.text+'translate/strings.en.js',
	// _GAMESETTING._BASEPATH.text+'translate/strings.cn.js',
	// 'media/text/translate/dynamic_character.en.js',
	// 'media/text/translate/chapter1.en.js',
	// 'media/text/translate/chapter1_id1.en.js',
	// 'media/text/translate/chapter1_id2.en.js',

	// SETTINGS
	

	// ADS		
	'settings/ad/mobile/header/themes/light/ad.js',
	'settings/ad/mobile/preroll/themes/light/ad.js',
	'settings/ad/mobile/footer/themes/light/ad.js',
	'settings/ad/mobile/end/themes/light/ad.js',
				
	// IE >=9 
	'glue/ie/ie.js',

	//Howler
	'glue/howler/howler.js',

	//Font
	'glue/font/promise.polyfill.js',
	'glue/font/fontfaceobserver.standalone.js',

	// Game
	'lib/impact/impact.js',
	'lib/game/main.js'  
);

// arrScripts.push(_LOADSCRIPTS);

loadScriptsSynchronously(_LOADSCRIPTS);
