var _GAMESETTING={
	// _BASEPATH:{text:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/visual-novel-game/media/text/"},	
	_BASEPATH:{
		text:"../v2-visual-novel-game/media/text/",
		voiceover:"../v2-visual-novel-game/media/voiceover/",
		thumbnail:"../v2-visual-novel-game/media/graphics/sprites/chapter/",
		avatar:"../v2-visual-novel-game/media/graphics/sprites/message/",
	},	
	_LOCALSTORAGE_KEY:"mjs-v2-vn-engine",
	_RESOURCESINFO:{
		"image":{
			"splash1":"../v2-visual-novel-game/branding/splash1.png",
			"logo":"../v2-visual-novel-game/branding/logo.png",
			// "bgMenu": 'hallway_dark.jpg', //'wardrobe.png' //mainmenu background
			"title":"../v2-visual-novel-game/media/graphics/sprites/title.png" //must have on every game
		}
	},
	_DATAGAME:{
		"RVOption" : true,
		"CurrencyOption" : true,
		"mainMenuBgColor:":"#000",
		// "loadBackgroundMusic" : false,	
		// "enableTitleLoader":true,	

		"enableShop":true,
		"enableCurrency":true,

		//VIRTUAL CURRENCY USED IN GAME, MAX 8
		"virtualCurrencyUsed" : [ 1, 2, 3 ],

		"linearChapterWithThumbnail" :true,
		"lockPreviousChapter" :true,
		"showButtonLoadOnMenu":false,

		"progressBar" : {
			"progressHP" : {
				"current" : "HP",
				"max" : "totalHP",
				"text" : "HP"
			},
			"progressMP" : {
				"current"  : "MP",
				"max" : "totalMP",
				"text" : "MP",
				// "progressColor" : '#5DE2E7',
				// "strokeColor" : 'blue'
				// "showMaxValue" : false
			}
		},

		// "isLinearChapter":false,

		// "dialogStyle" : 'default',
		// "dialogStyle" : 'rectangle',
		// "uiTheme" : "pink",
		// "uiTheme" : "sleekblackred",
		// "uiTheme" : "sleekblackyellow",
		// "uiTheme" : "vintage",
		// "uiTheme" : "vintagesquare",
		// "uiTheme" : "pinkdating",
		// "uiTheme" : "aquamarinedating",
		// "uiTheme" : "purpledating",
		// "uiTheme" : "orangedating",
		// "uiTheme" : "starlightdarkblue",
		// "uiTheme" : "sleekbluered",
		// "uiTheme" : "cyberpunkcyanfuschia",
		// "uiTheme" : "pixel8bitred",

		//UI Setting
		// "uiColor" : {
		// 	"purple" :{ //uiTheme
				// "bguicurrency" : "#000000",
				// "textcurrency" : "red",
				// "opacitycurrency" : 0.5,
				// "bubble" : {
				// 	'fontWeight':'',
				// 	'font':'metroblack',
				// 	'fontThin':'metromed',
				// 	'fontSize':40,

				// 	'iosfontWeight':'',
				// 	'iosfont':'arialmtbold',
				// 	'iosfontThin':'arialmt',
				// 	'iosfontSize':40,

				// 	'langfontWeight':'',
				// 	'langfont':'arialmtbold',
				// 	'langfontThin':'arialmt',
				// 	'langfontSize':40
				// }
		// 	}
		// },

		//DEFAULT OPTION BUTTON
		"optionButton" : {
			"corner" : -1, //-1 = follow the original UI
		},

		"toastBox" : {
			'timeAlive':1,
			'boxColor':'white',
			'outlineColor':'',
			'opacity':1,
			'position':'bottom', //top | center | bottom
			'fontColor':'black',
			'fontSize':24,
			'corner':10
		},

		//MINI BUTTON
		"miniButton" : {
			"textColor":'white',
			"outlineColor":'black',
			"fontSize":25,
			"padding":{x:25, y:25},
			"textOffset":{x:0, y:5},
			
			"skip" : true,
			"auto" : true,
			"save" : true,
			"load" : true,
			"log" : true
		},

		//DEFAULT SPEAKER NAME COLOR
		"speakerName" : {
			"strokeColor":"none",
			"bgColor":"#52514e",
			"bgOpacity":1,
			"textColor":"white",
			"fontSize":30,
			"align":"center" //left center right
		},

		//DEFAULT DIALOG BOX
		"dialogBox" : {
			'height':200,
			'padding':{ x:25, y: 30 },
			'offsetY':0,
			
			"default" : {
				'textColor':'black',
				'boxColor':'white',
				'boxOpacity':1,
				'outlineColor':'black',
			},

			"none" : {
				'outlineColor':'red',
			},

			"amy" : {
				'outlineColor':'pink',
			},

			"jack" : {
				'outlineColor':'green',
			},

			"carl" : {
				'outlineColor':'purple',
			},

			"max" : {
				'outlineColor':'blue',
			},
		},

		"repeatOption":false, //true = option will be repeated in dialog

		"enableVoiceOver" : true,
		"enableURLParam" : true, //false = game goes live, true = only for testing
		"enableConsoleLog" : true, //false = game goes live, true = only for testing

		"chapters":{
			multipleChapter:true, //true: show chapter list screen. false: directly play chapter 1
			showMainMenu:true,
			totalChapter:3 //total chapter shown in chapter list page (min 2, max 7)
		},

		// "chapters": {
  //           showMainMenu: true,
  //           multipleChapter: false, //true: show chapter list screen. false: directly play chapter 1
  //           totalChapter: 1 //total chapter shown in chapter list page (min 2, max 7)
  //       },

		"firstMCOutfit" : { 'chapter1':'' },

		//CODE GENERATED
		//bottom-pajama-blue //, "outlineName":"black", "textName":"white"
		"spriterData" : { "amy": { "bgName": "#e3689c", "girl": { "skin": "skin-fair", "face": "face-upturn-purple-eye", "hair": "hair-none", "top": "top-pajama-blue", "bottom": "bottom-crop-pants-gray", "shoes": "shoes-flat-sandal-white" } }, "jack": { "bgName": "#53965c", "girl": { "skin": "skin-tan", "face": "face-sultry-blue-eye", "hair": "hair-long-wavy-blonde", "top": "top-jacket-varsity-navy", "bottom": "bottom-short-jersey-red", "shoes": "shoes-sneaker-hicut-red", "glasses": "glasses-none", "earrings": "earrings-dangle-gold" }, "boy": { "skin": "skin-olive", "face": "face-upturn-green-eye", "hair": "hair-slickedback-brown", "top": "top-varsity-jacket-red", "bottom": "bottom-ripped-grey", "shoes": "shoes-sneaker-white-black-stripes", "glasses": "glasses-none" } }, "carl": { "bgName": "#96538b", "girl": { "skin": "skin-fair", "face": "face-hooded-brown-eye", "hair": "hair-bob-bangs-brown", "top": "top-sweater-orange", "bottom": "bottom-crop-pants-gray", "shoes": "shoes-sneaker-hicut-white", "glasses": "glasses-red", "earrings": "earrings-none" }, "boy": { "skin": "skin-olive", "face": "face-downturn-blue-eye", "hair": "hair-side-fringe-brown", "top": "top-sweater-red", "bottom": "bottom-cropped-navy", "shoes": "shoes-loafer-navy", "glasses": "glasses-black-frame" } }, "max": { "bgName": "#4ea5cc", "boy": { "skin": "skin-olive", "face": "face-hooded-blue-eye", "hair": "hair-curly-brown", "top": "top-sweater-blue", "bottom": "bottom-cropped-navy", "shoes": "shoes-loafer-navy", "glasses": "glasses-none" } }, "isabella": { "bgName": "#bc6a18", "girl": { "skin": "skin-fair", "face": "face-upturn-purple-eye", "hair": "hair-ponytail-wavy-blonde", "top": "top-corset-fuschia", "bottom": "bottom-sequin-skirt-pink", "shoes": "shoes-heels-fur-pink", "glasses": "glasses-none" } }, "mom": { "bgName": "#b4a7d6", "girl": { "skin": "skin-fair-square-jaw", "face": "face-downturn-purple-eye", "hair": "hair-bob-brown", "top": "top-jacket-plum", "bottom": "bottom-aline-skirt-white", "shoes": "shoes-heel-wedge-white", "glasses": "glasses-white" } }, "kfcman": { "bgName": "#7f6000", "boy": { "skin": "skin-yellow-trump", "face": "face-hooded-slit-gray-eye", "hair": "hair-blonde-trump", "top": "top-suit-royal-blue", "bottom": "bottom-wide-formal-royal-blue", "shoes": "shoes-loafer-dark-navy", "glasses": "glasses-none" } }, "buzzcutblackman": { "bgName": "#3d85c6", "boy": { "skin": "skin-brown", "face": "face-almond-brown-eye", "hair": "hair-buzz-cut-black", "top": "top-padding-orange", "bottom": "bottom-pants-black", "shoes": "shoes-sneaker-white", "glasses": "glasses-none" } }, "casual": { "bgName": "#e3689c", "girl": { "skin": "skin-fair", "face": "face-upturn-purple-eye", "hair": "hair-braid-brown", "top": "top-hoodie-grey", "bottom": "bottom-shorts-pink", "shoes": "shoes-sneaker-white-pink-stripes", "glasses": "glasses-none" } }, "wedding": { "bgName": "#e3689c", "girl": { "skin": "skin-fair", "face": "face-upturn-purple-eye", "hair": "hair-crownbraid-brown", "top": "top-halter-violet", "bottom": "bottom-pencil-skirt-white", "shoes": "shoes-heels-closed-white", "glasses": "glasses-none" } }, "sexy": { "bgName": "#e3689c", "girl": { "skin": "skin-fair", "face": "face-upturn-purple-eye", "hair": "hair-ponytail-brown", "top": "top-vneck-leopard", "bottom": "bottom-leather-shorts-blue", "shoes": "shoes-heels-mesh-blue", "glasses": "glasses-none" } }, "jenna": { "bgName": "#3d85c6", "boy": { "skin": "skin-brown", "face": "face-almond-brown-eye", "hair": "hair-buzz-cut-black", "top": "top-padding-orange", "bottom": "bottom-pants-black", "shoes": "shoes-sneaker-white", "glasses": "glasses-none" } }, "chad": { "bgName": "#7f6000", "boy": { "skin": "skin-yellow-trump", "face": "face-hooded-slit-gray-eye", "hair": "hair-blonde-trump", "top": "top-suit-royal-blue", "bottom": "bottom-wide-formal-royal-blue", "shoes": "shoes-loafer-dark-navy", "glasses": "glasses-none" } }, "jess": { "bgName": "#bc6a18", "girl": { "skin": "skin-fair", "face": "face-siren-brown-eye", "hair": "hair-long-wavy-blonde", "top": "top-jacket-varsity-navy", "bottom": "bottom-shorts-pink", "shoes": "shoes-boot-heel-white", "glasses": "glasses-none" } } },
		
		"neutral_boy" : [ "Max", "KFC Man", "Buzz Cut Black Man", "Jenna", "Chad"], 
		"neutral_girl" : [ "Isabella", "Mom", "Jess" ], 
		"dynamic_name" : [ "Carl", "Jack" ]

		//END GENERATED
	}
};

var _LOADSCRIPTS=[	
	_GAMESETTING._BASEPATH.text+"customload.js",
	_GAMESETTING._BASEPATH.text+"strings.en.js",
	_GAMESETTING._BASEPATH.text+"translate/chapter_list.en.js",
	_GAMESETTING._BASEPATH.text+"translate/dynamic_character.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter1.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter2.en.js",
	_GAMESETTING._BASEPATH.text+"translate/chapter3.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter1_email1.en.js",
	
    _GAMESETTING._BASEPATH.text+"translate/chapter1_letter1.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter1_id1.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter1_id2.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter2_id1.en.js",

	_GAMESETTING._BASEPATH.text+"translate/chapter2_id2.en.js",
];

var arrLanguage = [  ]; //'jp', 'cn', 'tw', 'ru', 'kr' 
var totalChapter = 3;
var objChapterID = { 'chat1':2, 'chat2':2, 'email1':1, 'letter1':1 };

for(var j=0;j<arrLanguage.length;j++){
    // console.log(arrLanguage[j]);
    _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/dynamic_character."+arrLanguage[j]+".js");
    for(var i=1;i<=totalChapter;i++){
        _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+"."+arrLanguage[j]+".js");

        if(objChapterID['chat' + i] != null) {
            for(var k=1;k<=objChapterID['chapter' + i];k++){
                _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_id" + k +"."+arrLanguage[j]+".js");
            }
        }

        if(objChapterID['email' + i] != null) {
            for(var l=1;l<=objChapterID['email' + i];l++){
                _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_email" + l +"."+arrLanguage[j]+".js");
            }
        }

        if(objChapterID['letter' + i] != null) {
            for(var m=1;m<=objChapterID['letter' + i];m++){
                _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_letter" + m +"."+arrLanguage[j]+".js");
            }
        }
    }
}

//ONLY FOR RUNNING ENGINE INDEX.HTML
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
    console.log("loadScriptsSynchronously");
    loadFunctions[0]();
}

loadScriptsSynchronously(_LOADSCRIPTS);
//_________________________________________________USING OTHER GAME______________________________________________________

// var _GAMESETTING={
// 	// _BASEPATH:{text:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/visual-novel-game/media/text/"},	
// 	_BASEPATH:{
// 		text:"../cringe-rizz-lines/media/text/",
// 		voiceover:"../cringe-rizz-lines/media/voiceover/",
// 		thumbnail:"../cringe-rizz-lines/media/graphics/sprites/chapter/",
// 	},	
// 	_LOCALSTORAGE_KEY:"mjs-v2-vn-engine",
// 	_RESOURCESINFO:{
// 		"image":{
// 			// "splash1":"../v2-visual-novel-game/branding/splash1.png",
// 			// "logo":"../v2-visual-novel-game/branding/logo.png",
// 			// "bgMenu": 'hallway_dark.jpg', //'wardrobe.png' //mainmenu background
// 			"title":"../cringe-rizz-lines/media/graphics/sprites/title.png" //must have on every game
// 		}
// 	},
// 	_DATAGAME:{
// 		"defaultName":"Camilia", //IF THERE IS NO INPUT NAME
// 		"enableFullScreen" : true, //Button Fullscreen Visibility
// 		"enableShop" : false, //UI Shop & Currency Visibility
// 		"enableLanguage" : false, //Button Language Visibility
//     "enableExit" : false, 

// 		"enableCurrency" : false, 
//     "enableDemo" : false, //Demo Text Visibility
// 		"enableTitleLoader" : false, //true:title on loading, false:brand on loading

// 		"enableURLParam" : true, //false = game goes live, true = only for testing
// 		"enableConsoleLog" : true, //false = game goes live, true = only for testing

// 		"firstMCOutfit" : ["","", "", ""],
//     "isLinearChapter" : false,

//     // "dialogStyle":"rectangle",
		
// 		"simplifiedUI" : false,
// 		"uiTheme" : "sleekblackyellow",
// 		"chapters":{
// 			multipleChapter:true,
// 			totalChapter:5
// 		},

//     "speakerName" : {
//         "strokeColor":"none", 
//         "bgColor":"black",
//         // "bgOpacity":1,
//         "textColor":"white"
//         // "fontSize":30,
//         // "align":"left"
//     },

// 		"bgMenuResources" : [ 'wardrobe' ], //LIST BG YOU NEED TO PRELOAD HERE ( IF NONE, CAN LEAVE IT BLANK ) fill in with mainmenu background 

// 		"mainMenuBgColor": "#FFCCCC",
// 		"RVOption" : true,	

// 		//generated from story sheet
// 		//CODE_GENERATED 

//  "spriterData": {
//   "amy": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-bob-bangs-brown",
//     "top": "top-bellsleeve-yellow",
//     "bottom": "bottom-aline-skirt-white",
//     "shoes": "shoes-boot-heel-white"
//    },
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-buzz-cut-black",
//     "top": "top-none",
//     "bottom": "bottom-cropped-jeans-blue",
//     "shoes": "shoes-boots-black"
//    }
//   },
//   "smith": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-downturn-olive-green-eye",
//     "hair": "hair-two-block-brunette-anime",
//     "top": "top-hoodie-grey",
//     "bottom": "bottom-ripped-grey",
//     "shoes": "shoes-leather-brown",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "paxton": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-monolid-brown-eye",
//     "hair": "hair-buzz-cut-black",
//     "top": "top-tank-grey",
//     "bottom": "bottom-farmer-apron-pants-brown-anime",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-short-brown",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "necklace": "necklace-none",
//     "anklet": "anklet-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "emily": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-bob-bangs-brown",
//     "top": "top-bellsleeve-yellow",
//     "bottom": "bottom-aline-skirt-white",
//     "shoes": "shoes-boot-heel-white"
//    }
//   },
//   "cloneone": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-none",
//     "top": "top-suit-black",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-black",
//     "necklace": "necklace-black"
//    }
//   },
//   "clonetwo": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-none",
//     "top": "top-suit-royal-blue",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-black",
//     "necklace": "necklace-black"
//    }
//   },
//   "vien": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-bob-bangs-brown",
//     "top": "top-bellsleeve-yellow",
//     "bottom": "bottom-aline-skirt-white",
//     "shoes": "shoes-boot-heel-white",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "jack": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-comma-dark-brown",
//     "top": "top-hoodie-grey",
//     "bottom": "bottom-formal-black",
//     "shoes": "shoes-leather-black-plain",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "cinthia": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-upturn-purple-eye",
//     "hair": "hair-bob-brown",
//     "top": "top-police-shortsleeve-bulletproof-vest-blue",
//     "bottom": "bottom-police-pants-blue",
//     "shoes": "shoes-leather-black",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "michael": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-round-grey-eye",
//     "hair": "hair-slickedback-brown",
//     "top": "top-police-shortsleeve-bulletproof-vest-blue",
//     "bottom": "bottom-police-pants-black",
//     "shoes": "shoes-leather-black",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-police-blue",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "troy": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-downturn-olive-green-eye",
//     "hair": "hair-none",
//     "top": "top-hoodie-grey",
//     "bottom": "bottom-formal-yankee-blue",
//     "shoes": "shoes-sneaker-converse-navy",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-balaclava",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "harleenqueen": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-bob-burgundy",
//     "top": "top-scrub-light-gray",
//     "bottom": "bottom-crop-pants-light-gray",
//     "shoes": "shoes-sneaker-powder-blue",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "rickyrohl": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-hooded-blue-eye-gray-brow",
//     "hair": "hair-slickedback-brown",
//     "top": "top-suit-royal-blue",
//     "bottom": "bottom-wide-formal-royal-blue",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "nursegrace": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-upturn-purple-eye",
//     "hair": "hair-ponytail-brown",
//     "top": "top-scrub-light-gray",
//     "bottom": "bottom-crop-pants-light-gray",
//     "shoes": "shoes-sneaker-sky-blue",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "mssherbert": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-long-straight-red",
//     "top": "top-blazer-black-turtle-neck-magenta",
//     "bottom": "bottom-sequin-skirt-pink",
//     "shoes": "shoes-heels-strap-brown",
//     "beard": "beard-none",
//     "earrings": "earrings-drop-diamond",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "mrparker": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-blonde-trump",
//     "top": "top-hoodie-grey",
//     "bottom": "bottom-wide-pants-green",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "tonyspark": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-hooded-blue-eye-gray-brow",
//     "hair": "hair-none",
//     "top": "top-none",
//     "bottom": "bottom-none",
//     "shoes": "shoes-none",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "ploysombat": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-siren-hazel-brown-eye",
//     "hair": "hair-ponytail-brown",
//     "top": "top-scrub-light-gray",
//     "bottom": "bottom-skirt-black",
//     "shoes": "shoes-sneaker-white-pink-stripes",
//     "beard": "beard-none",
//     "earrings": "earrings-stud-pearl",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "anurakthepnakorn": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-monolid-dark-brown-eye",
//     "hair": "hair-buzz-cut-light-brown",
//     "top": "top-sweater-blue",
//     "bottom": "bottom-cropped-navy",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "aminche": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-monolid-brown-eye",
//     "hair": "hair-comma-dark-brown",
//     "top": "top-suit-yankee-blue-purple-tie",
//     "bottom": "bottom-cropped-jeans-blue",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "rahmanche": {
//    "boy": {
//     "skin": "skin-yellow-trump",
//     "face": "face-hooded-slit-gray-eye",
//     "hair": "hair-slickedback-moss-green",
//     "top": "top-sweater-green",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-leather-brown",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "kietamarin": {
//    "boy": {
//     "skin": "skin-olive-freckles",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-side-fringe-brown",
//     "top": "top-plaid-red",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-highcut-red",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "jakereyes": {
//    "boy": {
//     "skin": "skin-fair-yellow",
//     "face": "face-hooded-blue-eye",
//     "hair": "hair-undercut-brown",
//     "top": "top-sweater-red",
//     "bottom": "bottom-wide-pants-green",
//     "shoes": "shoes-sneaker-white",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-cap-blue"
//    }
//   },
//   "annadiaz": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-siren-hazel-brown-eye",
//     "hair": "hair-long-wavy-brown",
//     "top": "top-halter-red",
//     "bottom": "bottom-crop-pants-gray",
//     "shoes": "shoes-heel-wedge-white",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-silver",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "patientgeorge": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-round-grey-eye",
//     "hair": "hair-undercut-brown",
//     "top": "top-plaid-red",
//     "bottom": "bottom-jeans-light-blue",
//     "shoes": "shoes-none",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "nurseema": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-siren-brown-eye",
//     "hair": "hair-bun-wavy-black-bandana-blue",
//     "top": "top-scrub-light-gray",
//     "bottom": "bottom-crop-pants-light-gray",
//     "shoes": "shoes-sneaker-sky-blue",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "doctorkimberly": {
//    "girl": {
//     "skin": "skin-fair-square-jaw",
//     "face": "face-doe-green-eye",
//     "hair": "hair-wavy-med-ponytail-dark-brown",
//     "top": "top-scrub-light-gray",
//     "bottom": "bottom-crop-pants-yankee-blue",
//     "shoes": "shoes-sneaker-sky-blue",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-red",
//     "hat": "hat-none"
//    }
//   },
//   "chiefscot": {
//    "boy": {
//     "skin": "skin-brown",
//     "face": "face-hooded-blue-eye-gray-brow",
//     "hair": "hair-bald-gray-beard",
//     "top": "top-police-shortsleeve-bulletproof-vest-blue",
//     "bottom": "bottom-police-pants-black",
//     "shoes": "shoes-leather-black",
//     "hat": "hat-police-blue",
//     "glasses": "glasses-black-frame",
//     "beard": "beard-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "carlajackson": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-bob-bangs-brown",
//     "top": "top-bellsleeve-yellow",
//     "bottom": "bottom-aline-skirt-white",
//     "shoes": "shoes-boot-heel-white",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "beard": "beard-none"
//    }
//   },
//   "tonyfitzgerald": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-comma-dark-brown",
//     "top": "top-plaid-red",
//     "bottom": "bottom-cropped-jeans-blue",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "earrings": "earrings-none"
//    }
//   },
//   "davidpacino": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-downturn-gray-eye",
//     "hair": "hair-none",
//     "top": "top-tank-grey",
//     "bottom": "bottom-police-pants-black",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "cameronbean": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-long-wavy-blonde",
//     "top": "top-halter-red",
//     "bottom": "bottom-wide-pants-blue",
//     "shoes": "shoes-sneaker-slip-checkered-red",
//     "beard": "beard-none",
//     "earrings": "earrings-stud-pearl",
//     "glasses": "glasses-red",
//     "hat": "hat-none"
//    }
//   },
//   "davidhurt": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-none",
//     "top": "top-tank-grey",
//     "bottom": "bottom-police-pants-black",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-bloody-face-red"
//    }
//   },
//   "adamandreas": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-hooded-blue-eye-gray-brow",
//     "hair": "hair-buzz-cut-black",
//     "top": "top-hoodie-lime-green",
//     "bottom": "bottom-wide-pants-army",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-beanie-blue"
//    }
//   },
//   "sadiemoore": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-doe-green-eye",
//     "hair": "hair-bob-burgundy",
//     "top": "top-hoodie-pink",
//     "bottom": "bottom-crop-pants-yankee-blue",
//     "shoes": "shoes-sneaker-hicut-violet",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "ethandoffer": {
//    "boy": {
//     "skin": "skin-brown",
//     "face": "face-round-grey-eye",
//     "hair": "hair-slickedback-moss-green",
//     "top": "top-checkered-shirt-gray",
//     "bottom": "bottom-wide-pants-army",
//     "shoes": "shoes-sneaker-converse-navy",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "loreleimartinez": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-sultry-olive-green-eye",
//     "hair": "hair-bun-moss-green",
//     "top": "top-jacket-varsity-navy",
//     "bottom": "bottom-crop-pants-black",
//     "shoes": "shoes-sneaker-powder-blue",
//     "beard": "beard-none",
//     "earrings": "earrings-stud-pearl",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "officercruz": {
//    "girl": {
//     "skin": "skin-fair-square-jaw",
//     "face": "face-siren-brown-eye",
//     "hair": "hair-crownbraid-brown",
//     "top": "top-police-shortsleeve-bulletproof-vest-blue",
//     "bottom": "bottom-police-pants-blue",
//     "shoes": "shoes-leather-black",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-silver",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "shirleycooper": {
//    "girl": {
//     "skin": "skin-fair-square-jaw",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-bob-brown",
//     "top": "top-jacket-plum",
//     "bottom": "bottom-quilt-pencil-skirt-blue",
//     "shoes": "shoes-sneaker-hicut-red",
//     "beard": "beard-none",
//     "earrings": "earrings-stud-pearl",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "danvito": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-round-grey-eye",
//     "hair": "hair-slickedback-moss-green",
//     "top": "top-padding-orange",
//     "bottom": "bottom-wide-formal-royal-blue",
//     "shoes": "shoes-sneaker-brown",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "guydevil": {
//    "boy": {
//     "skin": "skin-red",
//     "face": "face-upturn-green-eye",
//     "hair": "hair-none",
//     "top": "top-none",
//     "bottom": "bottom-none",
//     "shoes": "shoes-none",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "keiradaily": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-sultry-blue-eye",
//     "hair": "hair-long-wavy-blonde",
//     "top": "top-vneck-leopard",
//     "bottom": "bottom-aline-skirt-white",
//     "shoes": "shoes-none",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "geniewilder": {
//    "boy": {
//     "skin": "skin-blue",
//     "face": "face-hooded-blue-eye",
//     "hair": "hair-none",
//     "top": "top-vest-blue",
//     "bottom": "bottom-wide-pants-blue",
//     "shoes": "shoes-none",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "auntiegonist": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-long-ponytail-black",
//     "top": "top-sweater-orange",
//     "bottom": "bottom-crop-pants-black",
//     "shoes": "shoes-sneaker-orange",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "breadpitt": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-upturn-green-eye",
//     "hair": "hair-slickedback-moss-green",
//     "top": "top-knight-armor-silver",
//     "bottom": "bottom-wide-knight-armor-silver",
//     "shoes": "shoes-knight-silver",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "athenareal": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-sultry-blue-eye",
//     "hair": "hair-braid-brown",
//     "top": "top-knight-armor-silver",
//     "bottom": "bottom-wide-knight-armor-silver",
//     "shoes": "shoes-knight-silver",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "abraxasdabra": {
//    "boy": {
//     "skin": "skin-skeleton",
//     "face": "face-skeleton-blue-eye",
//     "hair": "hair-buzz-cut-black",
//     "top": "top-none",
//     "bottom": "bottom-none",
//     "shoes": "shoes-none",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-viking-helmet",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "anneotherworld": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-sultry-blue-eye",
//     "hair": "hair-long-wavy-blonde",
//     "top": "top-vneck-leopard",
//     "bottom": "bottom-pencil-skirt-white",
//     "shoes": "shoes-heels-closed-white",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "myramains": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-siren-magenta-eye",
//     "hair": "hair-long-straight-red",
//     "top": "top-vest-blue",
//     "bottom": "bottom-wide-pants-yankee-blue",
//     "shoes": "shoes-flat-sandal-white",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-silver",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "willemdafriend": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-downturn-gray-eye",
//     "hair": "hair-slickedback-moss-green",
//     "top": "top-plaid-red",
//     "bottom": "bottom-wide-formal-royal-blue",
//     "shoes": "shoes-sneaker-white-black-stripes",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "ivydonovan": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-sultry-olive-green-eye",
//     "hair": "hair-shaggy-blond-blue",
//     "top": "top-jacket-varsity-navy",
//     "bottom": "bottom-shorts-grey",
//     "shoes": "shoes-sneaker-hicut-white",
//     "anklet": "anklet-black",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-drop-diamond",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "elicamden": {
//    "boy": {
//     "skin": "skin-fair-yellow",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-med-brownbeanie-blue",
//     "top": "top-vest-blue",
//     "bottom": "bottom-formal-black",
//     "shoes": "shoes-leather-black-plain",
//     "anklet": "anklet-black",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "tessamonroe": {
//    "girl": {
//     "skin": "skin-fair-square-jaw",
//     "face": "face-sultry-olive-green-eye",
//     "hair": "hair-braid-brown",
//     "top": "top-blazer-pink",
//     "bottom": "bottom-aline-skirt-white",
//     "shoes": "shoes-leather-black",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-dangle-gold",
//     "glasses": "glasses-red",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "theogranger": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-none",
//     "top": "top-suit-yankee-blue",
//     "bottom": "bottom-formal-black",
//     "shoes": "shoes-boots-black",
//     "anklet": "anklet-none",
//     "beard": "beard-short-brown",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "animewaifu": {
//    "girl": {
//     "skin": "skin-fair-anime",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-full-bang-long-white-anime",
//     "top": "top-long-sleeve-baby-blue-anime",
//     "bottom": "bottom-skirt-navy-anime",
//     "shoes": "shoes-loafer-black-anime",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "rowanblake": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-siren-hazel-brown-eye",
//     "hair": "hair-ponytail-wavy-blonde",
//     "top": "top-police-shortsleeve-bulletproof-vest-blue",
//     "bottom": "bottom-police-pants-blue",
//     "shoes": "shoes-leather-boots-plain-black",
//     "anklet": "anklet-black",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-stud-pearl-white",
//     "glasses": "glasses-none",
//     "hat": "hat-cap-blue",
//     "necklace": "necklace-black"
//    }
//   },
//   "milesdorian": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-upturn-green-eye",
//     "hair": "hair-buzz-cut-light-brown",
//     "top": "top-tank-grey",
//     "bottom": "bottom-wide-pants-army",
//     "shoes": "shoes-leather-black",
//     "anklet": "anklet-none",
//     "beard": "beard-short-brown",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-military-helmet",
//     "necklace": "necklace-none"
//    }
//   },
//   "ninawhitaker": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-hooded-brown-eye",
//     "hair": "hair-ponytail-brown",
//     "top": "top-jacket-plum",
//     "bottom": "bottom-quilt-pencil-skirt-blue",
//     "shoes": "shoes-boot-heel-white",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-hoop-silver",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "silashartley": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-none",
//     "top": "top-suit-yankee-blue",
//     "bottom": "bottom-cropped-navy",
//     "shoes": "shoes-sneaker-brown",
//     "anklet": "anklet-black",
//     "beard": "beard-short-brown",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "jadeellison": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-downturn-purple-eye",
//     "hair": "hair-ponytail-wavy-blonde",
//     "top": "top-jacket-varsity-navy",
//     "bottom": "bottom-crop-pants-gray",
//     "shoes": "shoes-none",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-drop-pearl",
//     "glasses": "glasses-red",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "neighborken": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-hooded-eye-light-brown-anime",
//     "hair": "hair-med-brownbeanie-blue",
//     "top": "top-padding-orange",
//     "bottom": "bottom-wide-pants-green",
//     "shoes": "shoes-leather-black-plain",
//     "anklet": "anklet-none",
//     "beard": "beard-short-brown",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-aviator",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "camillefoster": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-siren-brown-eye-simple-lash",
//     "hair": "hair-long-wavy-brown",
//     "top": "top-hoodie-pink",
//     "bottom": "bottom-bermuda-shorts-jacket",
//     "shoes": "shoes-leather-black",
//     "anklet": "anklet-black",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-stud-pearl-white",
//     "glasses": "glasses-white",
//     "hat": "hat-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "owencallahan": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-monolid-dark-brown-eye",
//     "hair": "hair-bald-gray-beard",
//     "top": "top-plaid-red",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-knight-silver",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-party-green",
//     "necklace": "necklace-none"
//    }
//   },
//   "rachelmoore": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-sultry-olive-green-eye",
//     "hair": "hair-none",
//     "top": "top-hoodie-pink",
//     "bottom": "bottom-crop-pants-light-gray",
//     "shoes": "shoes-heels-strap-red",
//     "beard": "beard-none",
//     "earrings": "earrings-drop-diamond",
//     "glasses": "glasses-white",
//     "hat": "hat-none"
//    }
//   },
//   "bobrose": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-hooded-blue-eye",
//     "hair": "hair-undercut-brown",
//     "top": "top-varsity-jacket-red",
//     "bottom": "bottom-formal-yankee-blue",
//     "shoes": "shoes-loafer-dark-navy",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "ryansanders": {
//    "boy": {
//     "skin": "skin-brown",
//     "face": "face-monolid-dark-brown-eye",
//     "hair": "hair-buzz-cut-black",
//     "top": "top-suit-yankee-blue-red-tie",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-sneaker-white",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "vinceroberts": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-hooded-blue-eye",
//     "hair": "hair-med-brownbeanie-blue",
//     "top": "top-checkered-shirt-gray",
//     "bottom": "bottom-wide-formal-royal-blue",
//     "shoes": "shoes-sneaker-white",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "autumnhayes": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-hooded-brown-eye",
//     "hair": "hair-bob-brown",
//     "top": "top-blazer-plaid-green",
//     "bottom": "bottom-miniskirt-beige",
//     "shoes": "shoes-sneaker-slip-checkered-red",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-white",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "gavinwilder": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-monolid-brown-eye",
//     "hair": "hair-buzz-cut-light-brown",
//     "top": "top-sweater-blue",
//     "bottom": "bottom-cropped-jeans-blue",
//     "shoes": "shoes-leather-boots-plain-black",
//     "anklet": "anklet-black",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-knight-helmet-closed-silver",
//     "necklace": "necklace-black"
//    }
//   },
//   "zombieboy": {
//    "boy": {
//     "skin": "skin-zombie-open-head",
//     "face": "face-hooded-blue-eye",
//     "hair": "hair-bald-gray-beard",
//     "top": "top-tank-grey",
//     "bottom": "bottom-ripped-grey",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   },
//   "herodan": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-round-grey-eye",
//     "hair": "hair-pompadour-brown",
//     "top": "top-tank-grey",
//     "bottom": "bottom-wide-pants-army",
//     "shoes": "shoes-leather-black-plain",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-military-helmet"
//    }
//   },
//   "aaronwest": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-monolid-dark-brown-eye",
//     "hair": "hair-curtain-green-anime",
//     "top": "top-knight-armor-silver",
//     "bottom": "bottom-wide-knight-armor-silver",
//     "shoes": "shoes-knight-silver",
//     "anklet": "anklet-black",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-viking-helmet",
//     "necklace": "necklace-black"
//    }
//   },
//   "paigesullivan": {
//    "girl": {
//     "skin": "skin-fair-anime2",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-long-wavy-brown",
//     "top": "top-peasant-long-sleeve-cream-vest-brown",
//     "bottom": "bottom-peasant-long-skirt-brown",
//     "shoes": "shoes-flat-leather-brown",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "calebmercer": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-none",
//     "top": "top-none",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-none",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "lexcaldwell": {
//    "girl": {
//     "skin": "skin-fair-square-jaw",
//     "face": "face-red-eye-gray-brow-anime",
//     "hair": "hair-long-ponytail-black",
//     "top": "top-halter-red",
//     "bottom": "bottom-flare-pants-dark-sand-anime",
//     "shoes": "shoes-leather-black",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-choker-rose-pink-anime"
//    }
//   },
//   "levicross": {
//    "boy": {
//     "skin": "skin-fair-old",
//     "face": "face-round-grey-eye",
//     "hair": "hair-side-fringe-brown",
//     "top": "top-vest-red",
//     "bottom": "bottom-short-waistband-white",
//     "shoes": "shoes-sneaker-white",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-black",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "elisecarter": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-siren-brown-eye-simple-lash",
//     "hair": "hair-long-straight-red",
//     "top": "top-peasant-long-sleeve-cream-vest-brown",
//     "bottom": "bottom-peasant-brown",
//     "shoes": "shoes-leather-boots-plain-black",
//     "anklet": "anklet-none",
//     "beard": "beard-none",
//     "bracelet": "bracelet-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "necklace": "necklace-black"
//    }
//   },
//   "beckyhall": {
//    "girl": {
//     "skin": "skin-fair-square-jaw",
//     "face": "face-siren-brown-eye-simple-lash",
//     "hair": "hair-bun-wavy-black-bandana-blue",
//     "top": "top-halter-red",
//     "bottom": "bottom-crop-pants-gray",
//     "shoes": "shoes-heels-fur-pink",
//     "beard": "beard-none",
//     "earrings": "earrings-drop-diamond",
//     "glasses": "glasses-red",
//     "hat": "hat-none"
//    }
//   },
//   "drreeds": {
//    "boy": {
//     "skin": "skin-fair-yellow",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-slickedback-blonde",
//     "top": "top-suit-black",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-sneaker-white",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "drpeterson": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-hooded-brown-eye",
//     "hair": "hair-long-wavy-brown",
//     "top": "top-sweater-orange",
//     "bottom": "bottom-sequin-skirt-pink",
//     "shoes": "shoes-boot-heel-white",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-silver",
//     "glasses": "glasses-red",
//     "hat": "hat-none"
//    }
//   },
//   "karencarter": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-doe-brown-eye",
//     "hair": "hair-braid-brown",
//     "top": "top-sweater-crop-cyan",
//     "bottom": "bottom-lace-skirt-beige",
//     "shoes": "shoes-heels-strap-brown",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-silver",
//     "glasses": "glasses-white",
//     "hat": "hat-beanie-blue"
//    }
//   },
//   "allenyoung": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-downturn-olive-green-eye",
//     "hair": "hair-pompadour-brown",
//     "top": "top-hoodie-green",
//     "bottom": "bottom-pants-black",
//     "shoes": "shoes-sneaker-converse-navy",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "mswong": {
//    "girl": {
//     "skin": "skin-zombie-open-skull",
//     "face": "face-zombie-green-eye",
//     "hair": "hair-bob-brown",
//     "top": "top-halter-red",
//     "bottom": "bottom-flap-skirt-white",
//     "shoes": "shoes-sneaker-powder-blue",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "mrwright": {
//    "boy": {
//     "skin": "skin-fair-yellow",
//     "face": "face-monolid-brown-eye",
//     "hair": "hair-slickedback-brown",
//     "top": "top-plaid-red",
//     "bottom": "bottom-wide-pants-army",
//     "shoes": "shoes-leather-black",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "mrwright_zombie": {
//    "boy": {
//     "skin": "skin-zombie-open-head",
//     "face": "face-zombie-green-eye",
//     "hair": "hair-slickedback-brown",
//     "top": "top-plaid-red",
//     "bottom": "bottom-wide-pants-army",
//     "shoes": "shoes-leather-black",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "rhondalee": {
//    "girl": {
//     "skin": "skin-fair",
//     "face": "face-downturn-purple-eye",
//     "hair": "hair-bun-brown-bandana-blue",
//     "top": "top-jacket-plum",
//     "bottom": "bottom-pajama-blue",
//     "shoes": "shoes-boot-heel-white",
//     "beard": "beard-none",
//     "earrings": "earrings-hoop-gold",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "brandonpower": {
//    "boy": {
//     "skin": "skin-olive-freckles",
//     "face": "face-downturn-blue-eye",
//     "hair": "hair-bald-gray-beard",
//     "top": "top-suit-yankee-blue-purple-tie",
//     "bottom": "bottom-wide-formal-royal-blue",
//     "shoes": "shoes-highcut-red",
//     "beard": "beard-none",
//     "earrings": "earrings-none",
//     "glasses": "glasses-black-frame",
//     "hat": "hat-none"
//    }
//   },
//   "nikkihill": {
//    "girl": {
//     "skin": "skin-tan",
//     "face": "face-downturn-purple-eye",
//     "hair": "hair-wavy-med-ponytail-dark-brown",
//     "top": "top-blazer-plaid-green",
//     "bottom": "bottom-pleated-skirt-navy-blue",
//     "shoes": "shoes-boot-heel-white",
//     "beard": "beard-none",
//     "earrings": "earrings-stud-pearl",
//     "glasses": "glasses-white",
//     "hat": "hat-none"
//    }
//   },
//   "billycrow": {
//    "boy": {
//     "skin": "skin-fair",
//     "face": "face-almond-brown-eye",
//     "hair": "hair-slickedback-moss-green",
//     "top": "top-sweater-blue",
//     "bottom": "bottom-ripped-grey",
//     "shoes": "shoes-highcut-red",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "adamsanders": {
//    "boy": {
//     "skin": "skin-olive",
//     "face": "face-downturn-gray-eye",
//     "hair": "hair-pompadour-brown",
//     "top": "top-hoodie-lime-green",
//     "bottom": "bottom-wide-formal-royal-blue",
//     "shoes": "shoes-boots-black",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-none"
//    }
//   },
//   "runasoulstone": {
//    "girl": {
//     "skin": "skin-green",
//     "face": "face-upturn-purple-eye",
//     "hair": "hair-bun-moss-green",
//     "top": "top-corset-vintage-brown-anime",
//     "bottom": "bottom-wide-knight-armor-silver",
//     "shoes": "shoes-knight-silver",
//     "beard": "beard-none",
//     "earrings": "earrings-stud-pearl-white",
//     "glasses": "glasses-none",
//     "hat": "hat-none",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-diamond-gem-green-anime"
//    }
//   },
//   "randomguy": {
//    "boy": {
//     "skin": "skin-olive-freckles",
//     "face": "face-downturn-gray-eye",
//     "hair": "hair-undercut-brown",
//     "top": "top-knight-armor-silver",
//     "bottom": "bottom-wide-knight-armor-silver",
//     "shoes": "shoes-knight-silver",
//     "beard": "beard-short-brown",
//     "earrings": "earrings-none",
//     "glasses": "glasses-none",
//     "hat": "hat-viking-helmet",
//     "anklet": "anklet-none",
//     "bracelet": "bracelet-none",
//     "necklace": "necklace-none"
//    }
//   }
//  },
//  "neutral_boy": [
//   "Ricky Rohl",
//   "Mr Parker",
//   "Tony Spark",
//   "Anurak Thepnakorn",
//   "Amin Che",
//   "Rahman Che",
//   "Kiet Amarin",
//   "Jake Reyes",
//   "Patient George",
//   "Smith",
//   "Paxton",
//   "Chief Scot",
//   "Tony Fitzgerald",
//   "David Pacino",
//   "David Hurt",
//   "Adam Andreas",
//   "Ethan Doffer",
//   "Dan Vito",
//   "Guy Devil",
//   "Genie Wilder",
//   "Bread Pitt",
//   "Abraxas Dabra",
//   "Willem Dafriend",
//   "Eli Camden",
//   "Theo Granger",
//   "Miles Dorian",
//   "Silas Hartley",
//   "Cloneone",
//   "Clonetwo",
//   "Neighbor Ken",
//   "Owen Callahan",
//   "Bob Rose",
//   "Ryan Sanders",
//   "Vince Roberts",
//   "Gavin Wilder",
//   "Zombie Boy",
//   "Jack",
//   "Hero Dan",
//   "Aaron West",
//   "Caleb Mercer",
//   "Michael",
//   "Troy",
//   "Levi Cross",
//   "Dr Reeds",
//   "Allen Young",
//   "Mr Wright",
//   "Mr Wright_zombie",
//   "Brandon Power",
//   "Billy Crow",
//   "Adam Sanders",
//   "Random Guy"
//  ],
//  "neutral_girl": [
//   "Harleen Queen",
//   "Nurse Grace",
//   "Ms Sherbert",
//   "Ploy Sombat",
//   "Anna Diaz",
//   "Nurse Ema",
//   "Doctor Kimberly",
//   "Carla Jackson",
//   "Cameron Bean",
//   "Sadie Moore",
//   "Lorelei Martinez",
//   "Officer Cruz",
//   "Shirley Cooper",
//   "Keira Daily",
//   "Auntie Gonist",
//   "Athena Real",
//   "Anne Otherworld",
//   "Myra Mains",
//   "Ivy Donovan",
//   "Emily",
//   "Tessa Monroe",
//   "Anime Waifu",
//   "Rowan Blake",
//   "Nina Whitaker",
//   "Jade Ellison",
//   "Camille Foster",
//   "Rachel Moore",
//   "Autumn Hayes",
//   "Vien",
//   "Paige Sullivan",
//   "Lex Caldwell",
//   "Cinthia",
//   "Elise Carter",
//   "Becky Hall",
//   "Dr Peterson",
//   "Karen Carter",
//   "Ms Wong",
//   "Rhonda Lee",
//   "Nikki Hill",
//   "Runa Soulstone"
//  ],
//  "dynamic_name": []

//  //END_GENERATED
// 	}
// };

// var _LOADSCRIPTS=[	
// 	_GAMESETTING._BASEPATH.text+"customload.js",
// 	_GAMESETTING._BASEPATH.text+"strings.en.js",
// 	_GAMESETTING._BASEPATH.text+"translate/chapter_list.en.js",
// 	_GAMESETTING._BASEPATH.text+"translate/dynamic_character.en.js",

// 	_GAMESETTING._BASEPATH.text+"translate/chapter15.en.js"
// ];

// var arrLanguage = [  ]; //'jp', 'cn', 'tw', 'ru', 'kr' 
// var totalChapter = 1;
// var objChapterID = {};
// // var objChapterID = { 'chat1':2, 'chat2':2, 'email1':1, 'letter1':1 };

// for(var j=0;j<arrLanguage.length;j++){
//     // console.log(arrLanguage[j]);
//     _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/dynamic_character."+arrLanguage[j]+".js");
//     for(var i=1;i<=totalChapter;i++){
//         _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+"."+arrLanguage[j]+".js");

//         if(objChapterID['chat' + i] != null) {
//             for(var k=1;k<=objChapterID['chapter' + i];k++){
//                 _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_id" + k +"."+arrLanguage[j]+".js");
//             }
//         }

//         if(objChapterID['email' + i] != null) {
//             for(var l=1;l<=objChapterID['email' + i];l++){
//                 _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_email" + l +"."+arrLanguage[j]+".js");
//             }
//         }

//         if(objChapterID['letter' + i] != null) {
//             for(var m=1;m<=objChapterID['letter' + i];m++){
//                 _LOADSCRIPTS.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_letter" + m +"."+arrLanguage[j]+".js");
//             }
//         }
//     }
// }

// //ONLY FOR RUNNING ENGINE INDEX.HTML
// function loadScriptsSynchronously(arr) {
//     if (!arr || !arr.length) return;
//     var i;
//     var loadFunctions = [];
//     for (i = arr.length - 1; i >= 0; --i) {
//         if (i == arr.length - 1) {
//             loadFunctions[i] = (function (idx) { return function () { jQuery.getScript(arr[idx], function () { }); }; })(i);
//         } else {
//             loadFunctions[i] = (function (idx) { return function () { jQuery.getScript(arr[idx], loadFunctions[idx + 1]); }; })(i);
//         }        
//     }
//     console.log("loadScriptsSynchronously");
//     loadFunctions[0]();
// }

// loadScriptsSynchronously(_LOADSCRIPTS);