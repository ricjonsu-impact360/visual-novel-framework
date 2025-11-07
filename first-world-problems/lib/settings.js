var _ENGINE_VERSION = "2.0.0";

var _GAMESETTING = {
	_BASEPATH: {
		text: "media/text/",
        background:"media/graphics/backgrounds/",
        backgroundMenu:"media/graphics/backgrounds/",
        object:"media/graphics/object/",
        sfx:"media/audio/sfx/",
        bgm:"media/audio/bgm/",

	},	
	_LOCALSTORAGE_KEY: "vn-game-testing",
	_RESOURCESINFO: {
		"bgm": 'bgm-photo',
		"image": {
			vc3: 'media/graphics/sprites/vc3.png',
			title: "media/graphics/sprites/title.png",
			bgMenu: 'wardrobe.png' //mainmenu background
		}
	},
	_DATAGAME: {
		"defaultName": "Camilia", //IF THERE IS NO INPUT NAME
		"enableFullScreen": true, //Button Fullscreen Visibility
		"enableShop": false, //UI Shop & Currency Visibility
		"enableLanguage": false, //Button Language Visibility

		"enableDemo": false, //Demo Text Visibility
		"enableTitleLoader": false, //true:title on loading, false:brand on loading

		"enableURLParam": true, //false = game goes live, true = only for testing
		"enableConsoleLog": true, //false = game goes live, true = only for testing

		"enableShop": false, 
		"enableCurrency": false, 

		"repeatOption": false, //true = option will be repeated in dialog

		"firstMCOutfit": { 'chapter1': '' },
		
		"simplifiedUI": false,
		
		"isLinearChapter": true,
		// "dialogStyle" : 'rectangle',
		"uiTheme": "pink",

		"toastBox": {
			'timeAlive': 1,
			'boxColor': 'white',
			'outlineColor': '',
			'opacity': 1,
			'position': 'top', //top | center | bottom
			'fontColor': 'black',
			'fontSize': 24,
			'corner': 10
		},

		//UI Setting
		"uiColor" : {
			"pink" :{
				"bubble" : {
					"fontSize":36,
					"iosfontSize": 36,
                    "langfontSize": 36
				}
			}
		},

		//DEFAULT SPEAKER NAME COLOR
		"speakerName": {
			"strokeColor": "none",
			"bgColor": "#52514e",
			"textColor": "white"
		},
		
		"chapters": {
			multipleChapter: true, //true: show chapter list screen. false: directly play chapter 1
			totalChapter: 3 //total chapter shown in chapter list page (min 2, max 7)
		},

		"bgMenuResources": [ 'wardrobe' ], //LIST BG YOU NEED TO PRELOAD HERE ( IF NONE, CAN LEAVE IT BLANK ) fill in with mainmenu background 

		"mainMenuBgColor": "#FFCCCC",
		// "RVOption" : false,	
		"CurrencyOption": false,	

		//generated from story sheet
		//CODE_GENERATED 

 "spriterData": {
  "barney": {
   "bgName": "#ffffff",
   "textName": "#000000",
   "outlineName": "#000000",
   "boy": {
    "skin": "skin-fair-old",
    "face": "face-monolid-dark-brown-eye",
    "hair": "hair-none",
    "top": "top-leather-jacket-black",
    "bottom": "bottom-slacks-navy-anime",
    "shoes": "shoes-highcut-red",
    "anklet": "anklet-none",
    "beard": "beard-short-brown",
    "bracelet": "bracelet-none",
    "earrings": "earrings-none",
    "glasses": "glasses-none",
    "hat": "hat-none",
    "necklace": "necklace-none"
   }
  },
  "amy": {
   "bgName": "#ffffff",
   "textName": "#000000",
   "outlineName": "#000000",
   "girl": {
    "skin": "skin-purple",
    "face": "face-sultry-blue-eye",
    "hair": "hair-bun-moss-green",
    "top": "top-hoodie-pink",
    "bottom": "bottom-none",
    "shoes": "shoes-heels-strap-red",
    "anklet": "anklet-black",
    "beard": "beard-none",
    "bracelet": "bracelet-black",
    "earrings": "earrings-stud-pearl",
    "glasses": "glasses-aviator",
    "hat": "hat-cap-blue",
    "necklace": "necklace-choker-rose-pink-anime"
   },
   "boy": {
    "skin": "skin-fair",
    "face": "face-almond-brown-eye",
    "hair": "hair-buzz-cut-black",
    "top": "top-none",
    "bottom": "bottom-cropped-jeans-blue",
    "shoes": "shoes-boots-black"
   }
  },
  "soupervisor": {
   "bgName": "#ffffff",
   "textName": "#000000",
   "outlineName": "#000000",
   "boy": {
    "skin": "skin-fair",
    "face": "face-hooded-slit-gray-eye",
    "hair": "hair-blonde-trump",
    "top": "top-padding-orange",
    "bottom": "bottom-cropped-jeans-blue",
    "shoes": "shoes-boots-black",
    "anklet": "anklet-none",
    "beard": "beard-short-brown",
    "bracelet": "bracelet-none",
    "earrings": "earrings-none",
    "glasses": "glasses-none",
    "hat": "hat-none",
    "necklace": "necklace-none"
   }
  },
  "scammer1": {
   "bgName": "#ffffff",
   "textName": "#000000",
   "outlineName": "#000000",
   "boy": {
    "skin": "skin-fair-old",
    "face": "face-round-grey-eye",
    "hair": "hair-bald-gray-beard",
    "top": "top-sweater-red",
    "bottom": "bottom-cropped-jeans-blue",
    "shoes": "shoes-ninja-dark-grey",
    "anklet": "anklet-black",
    "beard": "beard-short-brown",
    "bracelet": "bracelet-black",
    "earrings": "earrings-hoop-gold",
    "glasses": "glasses-none",
    "hat": "hat-none",
    "necklace": "necklace-none"
   }
  },
  "scammer2": {
   "bgName": "#ffffff",
   "textName": "#000000",
   "outlineName": "#000000",
   "boy": {
    "skin": "skin-olive",
    "face": "face-almond-blue-eye-anime",
    "hair": "hair-buzz-cut-black",
    "top": "top-checkered-shirt-gray",
    "bottom": "bottom-short-grey",
    "shoes": "shoes-persian-slipper-yellow",
    "anklet": "anklet-black",
    "beard": "beard-short-brown",
    "bracelet": "bracelet-none",
    "earrings": "earrings-none",
    "glasses": "glasses-aviator",
    "hat": "hat-party-blue",
    "necklace": "necklace-none"
   }
  },
  "scammerceo": {
   "bgName": "#ffffff",
   "textName": "#000000",
   "outlineName": "#000000",
   "boy": {
    "skin": "skin-olive-abs",
    "face": "face-monolid-brown-eye",
    "hair": "hair-wolf-cut-orange-anime",
    "top": "top-vest-blue",
    "bottom": "bottom-wide-pants-army",
    "shoes": "shoes-leather-boots-plain-black",
    "anklet": "anklet-none",
    "beard": "beard-short-brown",
    "bracelet": "bracelet-black",
    "earrings": "earrings-none",
    "glasses": "glasses-black-thin-frame",
    "hat": "hat-none",
    "necklace": "necklace-none"
   }
  }
 },
 "neutral_boy": [
  "Barney",
  "Souper Visor",
  "Scammer 1",
  "Scammer 2",
  "Scammer Ceo"
 ],
 "neutral_girl": [],
 "dynamic_name": []

 //END_GENERATED
	}
};

var _VERSION = {
    'Version': '1.0.0',
    'Build': '455',

    'DisplayLog': false,
    'DrawVersion': false,

    'FontSize': '16px',
    'FontFamily': 'Arial',
    'FillStyle': '#FFFFFF'    
};
console.log('Game Release: v' + _VERSION.Version + '+build.' + _VERSION.Build);