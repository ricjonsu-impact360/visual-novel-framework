var _BASEPATH={
	// media:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/1.0.0/media/",
	// image:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/graphics/",
	// background:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/graphics/backgrounds/",
	// spriter:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/graphics/characters/",
	// fonts:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/fonts/",
	// sfx:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/audio/sfx/",
	// audio:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/audio/",
	// bgm:"https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/common/audio/bgm/"

	mediaGame:"media/",
	text:"media/text/",
	thumbnail:"media/graphics/sprites/chapter/",
	avatar:"media/graphics/sprites/message/",
	voiceover:"media/voiceover/",
	media:"../"+_SETTINGS.Versioning.Version+"/media/",
	image:"../v2-visual-novel-assets/graphics/",
	ui:"../v2-visual-novel-assets/graphics/ui/theme/",
	background:"../v2-visual-novel-assets/graphics/backgrounds/",
	backgroundMenu:"../v2-visual-novel-assets/graphics/backgrounds/",
	object:"../v2-visual-novel-assets/graphics/object/",
	spriter:"../v2-visual-novel-assets/graphics/characters/",
	fonts:"../v2-visual-novel-assets/fonts/",
	sfx:"../v2-visual-novel-assets/audio/sfx/",
	audio:"../v2-visual-novel-assets/audio/",
	bgm:"../v2-visual-novel-assets/audio/bgm/"
};


var _DATAGAME = {
	"zIndexData" : {
		"demoText" : 10000,
		"miniButton" : 10001,

		"UISetting" : 9000,
		"buttonUISetting" : 10001,

		"UISaveLoad" : 9000,
		"buttonUISaveLoad" : 9001,
		"buttonSavePreview" : 9001,
		"UIWarningSave" : 9002,
		"buttonUIWarningSave" : 9003,

		"UILog" : 9000,
		"buttonUILog" : 10001,

		"UIReplay" : 3000,
		"buttonUIReplay" : 3001,

		"buttonOnMenu" : 1000,

		"UIShop" : 1600,

		"UIExit" : 9000,
		"UICurrency" : 2000,
		"chatBubbleUICurrency" : 2000,

		"buttonNext" : 3001,
		"buttonPrev" : 3001,
		"UIChapterNonLinear" : 3000,
		"buttonChapterNonLinear" : 3001,
		"UIChapter" : 3000,
		"buttonChapter" : 3001,

		"UILoadOnMenu" : 3000,
		
		"buttonVC" : 3001,
		"buttonCloseBig" : 10001,
		"buttonClose" : 10001,
		"buttonHome" : 10001,
		"buttonMenu" : 10001,
		"buttonMoreGames" : 10001,
		"buttonNoReset" : 10001,
		"buttonReset" : 10001,
		"buttonYes" : 9001,
		"buttonNo" : 9001,
		
		"UIEnterName" : 3000,
		"buttonOK" : 3001,

		"virtualKeyboard" : 700,
		"buttonOption" : 1000,
		"chatBubbleOption" : 2000,
		"dialogChatBubble" : 1500,
		
		"email" : 500,
		"phone" : 500,
		"letter" : 500,
		"flashback" : 800, //600

		"character" : 499,
		"spriter" : 500,
		"singleParticleBack":400,
		"singleParticleFront":550,
		"particleBack":400,
		"particleFront":550,
		"overlayObjectBack":400,
		"overlayObjectFront":550,
		"camera":750,
		"notification":8500,
		"progressBar":8490,
		"freezeFrame":8000,
		"freezeFrameSpriter":8001,
		"freezeFrame3Spriter":10000,
		"freezeFrame3Black":10002,
		"windowBoxingTop":790,
		"windowBoxingBelow":490,

		"RVWindow":10000,
		"transition":20000,
	},

	"originalSize" : { x:720, y:1280},
	"ratioRes" : 1.5,
	"isCheat" : false,

	"animEffect_heartbeat" : 1,
	"animEffect_pulse" : 2,
	"animEffect_hover" : 3,

	"noSpaceLang" : ['jp', 'cn', 'zh'],
	"defaultFontLang" : ['jp', 'cn', 'ru', 'zh', 'kr'],
	"ratioLangFont" : { 'ru':0.8, 'de':0.9, 'es':0.9, 'jp':0.9 }, //, 'cn':0.9, 'nl':0.9, 'zh':0.9

	"multiplierOffsetTextButtonBlankSmall" : 0.6,

	"totalVirtualCurrency" : 8,

	"walkSpeed" : [ 100, 100, 150, 200, 250, 300 ], 

	// "have_rear_boy": ["buzzcutblackman","carl","isaac","jack","javier","oldman","carlceo","jackceo","asianguy1"],
	// "have_rear_girl": ["amy","isaac","javier","celine","jess"],

	"girlPart" : [ 
		//0 longskirt only
		[ 
			'0_bottom', '0_bottom-rear', '0_leg-left', '0_leg-left-rear', '0_leg-left-wide', 
			'0_leg-left-wide-rear', '0_leg-right', '0_leg-right-rear', '0_leg-right-wide', '0_leg-right-wide-rear',
			'0_shoe-right', '0_shoe-right-rear', '0_sock', '0_sock-rear', '0_thigh-left', 
			'0_thigh-left-rear', '0_thigh-right', '0_thigh-right-rear'
		],
		//1 skin
		[
			'0_arm-back-low', '0_arm-back-low-rear', '0_arm-back-up', '0_arm-back-up-rear', '0_arm-front-low', 
			'0_arm-front-low-rear', '0_arm-front-up', '0_arm-front-up-rear', '0_bottom', '0_bottom-rear', 
			'0_brow', '0_brow-casual-angry', '0_brow-casual-frown', '0_earring', '0_eyes', 
			'0_eyes-casual-left', '0_eyes-close', '0_eyes-happy', '0_eyes-left-rage', '0_eyes-rage', 
			'0_face-rear', '0_glasses', '0_glasses-rear', '0_hand-back', '0_hand-back3',
			'0_hand-back3-rear', '0_hand-back-rear', '0_hand-close', '0_hand-close-front', '0_hand-close-front-rear', 
			'0_hand-close-rear', '0_hand-front', '0_hand-front2', '0_hand-front2-rear', '0_hand-front-rear', 
			'0_hand-hold', '0_hand-hold-rear', '0_hand-phone', '0_hand-waist', '0_hand-wave', 
			'0_hat', '0_hat-rear', '0_head', '0_headback', '0_head-blush', 
			'0_head-rear', '0_leg-left', '0_leg-left-rear', '0_leg-left-wide', '0_leg-left-wide-rear', 
			'0_leg-right', '0_leg-right-rear', '0_leg-right-wide', '0_leg-right-wide-rear', '0_mouth', 
			'0_mouth-casual1', '0_mouth-frown', '0_mouth-frown-open1', '0_mouth-frown-open2', '0_mouth-frown-shock', 
			'0_mouth-happy', '0_mouth-happy-casual1', '0_mouth-laugh', '0_mouth-open1', '0_mouth-open2', 
			'0_mouth-rage', '0_mouth-shock', '0_shoe-right', '0_shoe-right-heel', '0_shoe-right-rear', 
			'0_shoe-right-rear-heel', '0_sock', '0_sock-rear', '0_thigh-left', '0_thigh-left-rear', 
			'0_thigh-right', '0_thigh-right-rear', '0_top', '0_top-rear', '0_waist', 
			'0_waist-rear', 'blush', 'hand-back2', 'skirt', 'skirt-rear', 
			'0_eyes-up', '0_beard', '0_beard-rear', '0_leg-left-cross', '0_leg-right-cross',
			'0_anklet-left', '0_anklet-left-rear', '0_anklet-right', '0_anklet-right-rear', '0_bracelet-left',
			'0_bracelet-left-rear', '0_bracelet-right', '0_bracelet-right-rear', '0_necklace', '0_necklace-rear', 
			'0_head-scary', '0_apron-rear', '0_hand-point', '0_hand-point-front'
		],
		//2 face
		[
			'0_brow', '0_brow-casual-angry', '0_brow-casual-frown', '0_eyes', '0_eyes-casual-left', 
			'0_eyes-close', '0_eyes-happy', '0_eyes-left-rage', '0_eyes-rage', '0_mouth', 
			'0_mouth-casual1', '0_mouth-frown', '0_mouth-frown-open1', '0_mouth-frown-open2', '0_mouth-frown-shock', 
			'0_mouth-happy', '0_mouth-happy-casual1', '0_mouth-laugh', '0_mouth-open1', '0_mouth-open2', 
			'0_mouth-rage', '0_mouth-shock' , '0_eyes-up', 'emo_default', 'emo_happy', 
			'emo_neutral', 'emo_eye_roll', '0_brow-casual-skeptical', '0_eyes-wink', '0_eyes-wink-front',
			'emo_exorcised', 'emo_wink', 'emo_eye_closed', '0_brow-wink', 'emo_rage',
			'0_mouth-pursed', '0_mouth-wide'
		],
		//3 hair
		[ '0_head', '0_headback', '0_head-rear' ],
		//4 top
		[
			'0_arm-back-low', '0_arm-back-low-rear', '0_arm-back-up', '0_arm-back-up-rear', '0_arm-front-low', 
			'0_arm-front-low-rear', '0_arm-front-up', '0_arm-front-up-rear', '0_top', '0_top-rear',
			'0_waist', '0_waist-rear'
		],
		//5 bottom
		[
			'0_bottom', '0_bottom-rear', '0_leg-left', '0_leg-left-rear', '0_leg-left-wide', 
			'0_leg-left-wide-rear', '0_leg-right', '0_leg-right-rear', '0_leg-right-wide', '0_leg-right-wide-rear', 
			'0_thigh-left', '0_thigh-left-rear', '0_thigh-right', '0_thigh-right-rear', 'skirt', 
			'skirt-rear', '0_leg-left-cross', '0_leg-right-cross', '0_apron-rear'
		],
		//6 shoes
		['0_shoe-right', '0_shoe-right-rear', '0_sock', '0_sock-rear'],
		//7 glasses
		['0_glasses', '0_glasses-rear'],
		//8 earrings
		['0_earring'],
		//9 hat
		['0_hat', '0_hat-rear'],
		//10 beard
		['0_beard', '0_beard-rear'],
		//11 anklet
		[ '0_anklet-left', '0_anklet-left-rear', '0_anklet-right', '0_anklet-right-rear' ],
		//12 bracelet
		[ '0_bracelet-left', '0_bracelet-left-rear', '0_bracelet-right', '0_bracelet-right-rear' ],
		//13 necklace
		[ '0_necklace', '0_necklace-rear' ]
	],

	"boyPart" : [ [''],
		//1 skin
		[
			'0_arm-back-low', '0_arm-back-low-rear', '0_arm-back-up', '0_arm-back-up-rear', '0_arm-front-low', 
			'0_arm-front-low-rear', '0_arm-front-up', '0_arm-front-up-rear', '0_beard', '0_beard-rear',
			'0_bottom', '0_bottom-rear', '0_brow', '0_brow-casual-angry', '0_brow-casual-frown', 
			'0_earring', '0_eyes', '0_eyes-casual-left', '0_eyes-close', '0_eyes-happy', 
			'0_eyes-left-rage', '0_eyes-rage', '0_eyes-wink', '0_face-rear', '0_hand-back', 
			'0_hand-back2', '0_hand-back3', '0_hand-back-open', '0_hand-back-rear', '0_hand-close', 
			'0_hand-close-front', '0_hand-front', '0_hand-front2', '0_hand-front2-rear', '0_hand-front-rear', 
			'0_hand-hold', '0_hand-hold-rear', '0_hand-phone', '0_hand-waist', '0_hand-wave', 
			'0_hat', '0_hat-rear', '0_head', '0_headback', '0_head-blush', 
			'0_head-rear', '0_leg-left', '0_leg-left-rear', '0_leg-left-wide', '0_leg-left-wide-rear', 
			'0_leg-right', '0_leg-right-rear', '0_leg-right-wide', '0_leg-right-wide-rear', '0_mouth', 
			'0_mouth-casual1', '0_mouth-frown', '0_mouth-frown-open1', '0_mouth-frown-open2', '0_mouth-frown-shock', 
			'0_mouth-happy', '0_mouth-happy-casual1', '0_mouth-laugh', '0_mouth-open1', '0_mouth-open2',
			'0_mouth-rage', '0_mouth-shock', '0_shoe-rear', '0_shoe-right', '0_sock', 
			'0_sock-rear', '0_thigh-left', '0_thigh-left-rear', '0_thigh-right', '0_thigh-right-rear', 
			'0_top', '0_top-rear', '0_waist', '0_waist-rear','blush', 
			'glasses', 'glasses-rear', '0_eyes-up', '0_leg-left-cross', '0_leg-right-cross',
			'0_anklet-left', '0_anklet-left-rear', '0_anklet-right', '0_anklet-right-rear', '0_bracelet-left',
			'0_bracelet-left-rear', '0_bracelet-right', '0_bracelet-right-rear', '0_necklace', '0_necklace-rear',
			'0_hand-close-rear', '0_head-scary', '0_apron-rear', '0_hand-close-front-rear', '0_hand-point',
			'0_hand-point-front'
		],
		//2 face
		[
			'0_brow', '0_brow-casual-angry', '0_brow-casual-frown', '0_eyes', '0_eyes-casual-left', 
			'0_eyes-close', '0_eyes-happy', '0_eyes-left-rage', '0_eyes-rage', '0_eyes-wink', 
			'0_mouth', '0_mouth-casual1', '0_mouth-frown', '0_mouth-frown-open1', '0_mouth-frown-open2', 
			'0_mouth-frown-shock', '0_mouth-happy', '0_mouth-happy-casual1', '0_mouth-laugh', '0_mouth-open1', 
			'0_mouth-open2', '0_mouth-rage', '0_mouth-shock', '0_eyes-up', 'emo_default', 
			'emo_happy', 'emo_neutral', 'emo_eye_roll', '0_brow-casual-skeptical', '0_eyes-wink-front',
			'emo_exorcised', 'emo_eye_closed', 'emo_wink', '0_brow-wink', 'emo_rage',
			'0_mouth-pursed', '0_mouth-wide'
		],
		//3 hair
		[ '0_head', '0_headback', '0_head-rear' ],
		//4 top
		 [ 
		 	'0_arm-back-low', '0_arm-back-low-rear', '0_arm-back-up', '0_arm-back-up-rear', '0_arm-front-low', 
		 	'0_arm-front-low-rear', '0_arm-front-up', '0_arm-front-up-rear', '0_top', '0_top-rear',
			'0_waist', '0_waist-rear' 
		 ],
		//5 bottom
		[
			'0_bottom', '0_bottom-rear', '0_leg-left', '0_leg-left-rear', '0_leg-left-wide',
			'0_leg-left-wide-rear', '0_leg-right', '0_leg-right-rear', '0_leg-right-wide', '0_leg-right-wide-rear',
			'0_thigh-left', '0_thigh-left-rear', '0_thigh-right', '0_thigh-right-rear', '0_leg-left-cross', 
			'0_leg-right-cross', '0_apron-rear'
		],
		//6 shoes
		['0_shoe-rear', '0_shoe-right', '0_sock', '0_sock-rear'],
		//7 glasses
		['glasses', 'glasses-rear'],
		//8 earrings
		['0_earring'],
		//9 hat
		['0_hat', '0_hat-rear'],
		//10 beard
		['0_beard', '0_beard-rear'],
		//11 anklet
		[ '0_anklet-left', '0_anklet-left-rear', '0_anklet-right', '0_anklet-right-rear' ],
		//12 bracelet
		[ '0_bracelet-left', '0_bracelet-left-rear', '0_bracelet-right', '0_bracelet-right-rear' ],
		//13 necklace
		[ '0_necklace', '0_necklace-rear' ]
	],

	"pan" : { center:0, left:-700, right:700 },
	"zoom" : { 
		center:{ scale:2, x:0.5, y:0.3 }, 
		left:{ scale:2, x:0.2, y:0.3 }, 
		right:{ scale:2, x:0.8, y:0.3 }
	},

	// "poseRunAndWalk" : ['ANIM_WALK', 'ANIM_WALK_REAR', 'ANIM_RUN', 'ANIM_RUN_REAR', 'ANIM_STUMBLE', 'ANIM_STUMBLE_REAR', 'ANIM_CRAWL_REAR'],

	//GENERATED FROM SHEET 

	//Animation List Sheet
	"noEmotion" : ["ANIM_LAUGH","ANIM_FLIRT","ANIM_CONFUSED","ANIM_DISAPPOINTED","ANIM_AWKWARD","ANIM_CRYING","ANIM_HUG","ANIM_KISS","ANIM_MAKEOUT","ANIM_IDLE_REAR","ANIM_WALK_REAR","ANIM_HIP_REAR","ANIM_TALK_REAR","ANIM_TALKSHEEPISH_REAR","ANIM_HUG_REAR","ANIM_KISS_REAR","ANIM_MAKEOUT_REAR","ANIM_RAGE","ANIM_FAINTED","ANIM_LAY_IDLE","ANIM_CLIMB_REAR","ANIM_SWIM_REAR","ANIM_SWIM_LOW_REAR","ANIM_RUN_REAR","ANIM_STUMBLE_REAR","ANIM_MOUTH_THINK","ANIM_MOUTH_STARTLED","ANIM_MOUTH_SNEAKY","ANIM_CRAWL_REAR","ANIM_STRANGLED","ANIM_STRANGLER","ANIM_PIANO_FINGER_REAR","ANIM_PIANO_ENTHUSIASTIC_REAR","ANIM_PIANO_ENTHUSIASTIC2_REAR","ANIM_PIANO_GENTLE_REAR"],

	"frownEmo" : ["ANIM_CONFUSED","ANIM_DISAPPOINTED","ANIM_CRYING"],

	"pose" : ["ANIM_IDLE","ANIM_HIP_BOTH_HANDS","ANIM_MOUTH","ANIM_CROSS","ANIM_FIST_PULL","ANIM_WALK","ANIM_BOW","ANIM_GROOVE","ANIM_DANCEUP","ANIM_DANCEHIP","ANIM_CHEER","ANIM_LAUGH","ANIM_FLIRT","ANIM_CONFUSED","ANIM_DISAPPOINTED","ANIM_AWKWARD","ANIM_CRYING","ANIM_TALKSHEEPHISH","ANIM_TALKPHONE","ANIM_BLINKING","ANIM_ANGRY","ANIM_HUG","ANIM_KISS","ANIM_MAKEOUT","ANIM_IDLE_REAR","ANIM_WALK_REAR","ANIM_HIP_REAR","ANIM_TALK_REAR","ANIM_TALKSHEEPISH_REAR","ANIM_HUG_REAR","ANIM_KISS_REAR","ANIM_MAKEOUT_REAR","ANIM_SHOCK","ANIM_RAGE","ANIM_WAVEHI","ANIM_APPLAUD","ANIM_JUMP","ANIM_FAINTED","ANIM_FALL","ANIM_WOUNDED","ANIM_THINK","ANIM_SHRUG","ANIM_LAY_IDLE","ANIM_LAY_SLEEP","ANIM_CLIMB_REAR","ANIM_SWIM_REAR","ANIM_SWIM_LOW_REAR","ANIM_RUN_REAR","ANIM_STUMBLE_REAR","ANIM_LAND","ANIM_LAY_IDLE_LOW","ANIM_MOUTH_THINK","ANIM_MOUTH_STARTLED","ANIM_MOUTH_SNEAKY","ANIM_RUN","ANIM_STUMBLE","ANIM_PUNCH_ON_KNEES","ANIM_SIT","ANIM_LAY_STRUGGLE_HARD","ANIM_LAY_STRUGGLE_WEAK","ANIM_SQUAT","ANIM_MEDITATE_IDLE","ANIM_MEDITATE_FLOATING","ANIM_CRAWL_REAR","ANIM_STRANGLED","ANIM_STRANGLER","ANIM_KICK_PUSH","ANIM_SIDE_KICK","ANIM_PUNCH_LUNGE","ANIM_TRANCE_FLOAT","ANIM_TRANCE_FLOAT_IDLE","ANIM_CHUG_MAX","ANIM_EXPLAIN_DEFENSE","ANIM_EXPLAIN_MIDDLE","ANIM_SWAY_DRUNK_MODERATE","ANIM_SWAY_DRUNK_HEAVY","ANIM_DEFEND_HOLD_OBJECT","ANIM_EXPLAIN_UP","ANIM_CHEER2","ANIM_SWAY_DRUNK_LIGHT","ANIM_GIGGLE","ANIM_STAB_ON_KNEES","ANIM_SIP_CUP","ANIM_SLAP_GIVE","ANIM_SLAP_RECEIVE","ANIM_COMPLAIN","ANIM_FIST_DOWN","ANIM_POUND_FIST","ANIM_SHAKEITTOTHEMAX_BASS","ANIM_SHAKEITTOTHEMAX_HIPS","ANIM_SHAKEITTOTHEMAX_RELAX","ANIM_STRIKE_OVERHEAD_TO_GROUND","ANIM_STRIKE_OVERHEAD_TO_MIDDLE","ANIM_PIANO_FINGER_REAR","ANIM_PIANO_ENTHUSIASTIC_REAR","ANIM_PIANO_ENTHUSIASTIC2_REAR","ANIM_PIANO_GENTLE_REAR","ANIM_PIANO_FINGER","ANIM_PIANO_ENTHUSIASTIC","ANIM_PIANO_ENTHUSIASTIC2","ANIM_PIANO_GENTLE","ANIM_HOLD_MICROPHONE_EXTEND","ANIM_HOLD_MICROPHONE_RETRACT","ANIM_EMBRACE_BOY","ANIM_EMBRACE_GIRL","ANIM_EMBRACE_IDLE_BOY","ANIM_EMBRACE_IDLE_GIRL","ANIM_SHIVER_MILD","ANIM_SHIVER_MEDIUM","ANIM_SHIVER_EXTREME","ANIM_WALK_SHIVER_MILD","ANIM_WALK_SHIVER_MEDIUM","ANIM_WALK_SHIVER_EXTREME","ANIM_POINT_FOWARD_CASUAL","ANIM_POINT_FOWARD_ENERGETIC","ANIM_POINT_DOWNWARD_DIAGONAL","ANIM_POINT_UPWARD_DIAGONAL","ANIM_SHAKEITTOTHEMAX_HAND","ANIM_SHAKEITTOTHEMAX_KNEESBEND","ANIM_SHAKEITTOTHEMAX_DJ_SCRATCH","ANIM_HOOKSTEP_FLICK_KICK","ANIM_HOOKSTEP_FLICK_HEELS","ANIM_SLASH_OVERHEAD","ANIM_STRIKE_OVERHEAD_HEAVY","ANIM_HIP","ANIM_ARMS_WIDE_OPEN_LOOK_UPWARD","ANIM_ARMS_WIDE_OPEN_LOOK_UPWARD_LOOP","ANIM_ARMS_WIDE_OPEN_RECEIVING_LOOP","ANIM_SIT_VEHICLE","ANIM_POINT_FOWARD_DOUBLE_FINGER_CASUAL","ANIM_POINT_FOWARD_DOUBLE_FINGER_ENERGETIC","ANIM_HIPHOP_ELBOW_OPEN","ANIM_SLASH_LUNGE","ANIM_SLASH_SWING","ANIM_FALL_FLOATING","ANIM_FLY_BACKWARDS_FLOATING","ANIM_SPRINT_HAND_CLOSE","ANIM_SPRINT_HAND_OPEN","ANIM_JOG_HAND_CLOSE","ANIM_JOG_HAND_OPEN","ANIM_RUN_WIDE_HAND_CLOSE","ANIM_RUN_WIDE_HAND_OPEN","ANIM_IDLE_HANDS_DOWN_LEGS_WIDE","ANIM_IDLE_HANDS_DOWN_LEGS_WIDE_REAR","ANIM_SIT_TYPING_GENTLE","ANIM_SIT_TYPING_FURIOUS","ANIM_SIT_TYPING_IDLE","ANIM_SIT_TYPING_REST","ANIM_SIT_TYPING_GENTLE_REAR","ANIM_SIT_TYPING_FURIOUS_REAR","ANIM_SIT_TYPING_IDLE_REAR","ANIM_SIT_TYPING_REST_REAR","ANIM_WALK_RELAXED","ANIM_RIFLE_HOLD_INACCURATE_UP_IDLE","ANIM_RIFLE_HOLD_INACCURATE_MID_IDLE","ANIM_RIFLE_HOLD_NORMAL_IDLE","ANIM_RIFLE_HOLD_SIDEWAYS_IDLE","ANIM_RIFLE_HOLD_CROUCH_IDLE","ANIM_RIFLE_HOLD_PRONE_IDLE","ANIM_RIFLE_HOLD_ONE_HANDED","ANIM_KISS_BEND1_REAR","ANIM_KISS_BEND2_REAR","ANIM_BRUSH_HAIR","ANIM_KISS_BEND1","ANIM_KISS_BEND2","ANIM_FALL_KICKED_BACKWARDS_UNCONSCIOUS","ANIM_FALL_KICKED_BACKWARDS","ANIM_FALL_KICKED_BACKWARDS_OVER_OBJECT_UNCONSCIOUS","ANIM_FALL_KICKED_BACKWARDS_OVER_OBJECT","ANIM_PUNCH_LUNGE_SINGLE","ANIM_CAMERA_FILMING","ANIM_CHEER_DOUBLE_HANDS","ANIM_CLAPPING_SHIFT_WEIGHT","ANIM_FALL_FRONT","ANIM_FALL_FRONT_UNCONSCIOUS","ANIM_FALL_FRONT_SWAY","ANIM_FALL_FRONT_SWAY_UNCONSCIOUS","ANIM_HAND_ON_GROUND_IDLE","ANIM_HAND_ON_GROUND_LOOK_FORWARD_IDLE","ANIM_HAND_ON_GROUND_LOOK_FORWARD","ANIM_LONGJUMP_MIDDLE1","ANIM_LONGJUMP_TAKEOFF1","ANIM_LONGJUMP_LAND1","ANIM_LONGJUMP_LAND1_LOOK_FORWARD","ANIM_LONGJUMP_LAND1_LOOK_FORWARD2","ANIM_RIFLE_HOLD_NORMAL_RECOIL_5_SHOTS_CONSTANT","ANIM_RIFLE_HOLD_NORMAL_RECOIL_5_SHOTS_RANDOM","ANIM_RIFLE_HOLD_NORMAL_RECOIL_NORMAL_SINGLE_CONSTANT","ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_BIG","ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_NOODLE_HANDS","ANIM_RIFLE_HOLD_NORMAL_RECOIL_SINGLE_SMALL","ANIM_RIFLE_HOLD_NORMAL_WALK_STEALTH_POINT_DOWNWARDS","ANIM_RIFLE_HOLD_NORMAL_WALK_STEALTH_POINT_HORIZONTAL"],

	"listRearAnim" : ["ANIM_IDLE_REAR","ANIM_WALK_REAR","ANIM_HIP_REAR","ANIM_TALK_REAR","ANIM_TALKSHEEPISH_REAR","ANIM_HUG_REAR","ANIM_KISS_REAR","ANIM_MAKEOUT_REAR","ANIM_CLIMB_REAR","ANIM_SWIM_REAR","ANIM_SWIM_LOW_REAR","ANIM_RUN_REAR","ANIM_STUMBLE_REAR","ANIM_CRAWL_REAR","ANIM_PIANO_FINGER_REAR","ANIM_PIANO_ENTHUSIASTIC_REAR","ANIM_PIANO_ENTHUSIASTIC2_REAR","ANIM_PIANO_GENTLE_REAR","ANIM_IDLE_HANDS_DOWN_LEGS_WIDE_REAR","ANIM_SIT_TYPING_GENTLE_REAR","ANIM_SIT_TYPING_FURIOUS_REAR","ANIM_SIT_TYPING_IDLE_REAR","ANIM_SIT_TYPING_REST_REAR","ANIM_KISS_BEND1_REAR","ANIM_KISS_BEND2_REAR"],

	"shadowWidth" : [146,146,146,146,146,200,146,146,200,200,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,200,146,146,146,146,146,146,146,146,146,146,146,600,600,146,146,146,500,500,146,600,600,200,146,146,500,146,146,146,200,146,400,200,450,450,200,200,200,500,146,146,146,146,250,146,146,146,146,146,146,146,146,146,146,146,146,400,146,146,146,146,146,146,146,146,146,230,230,200,200,200,200,200,200,200,200,146,146,146,146,146,146,146,146,146,200,200,200,146,146,146,146,146,146,146,146,146,146,200,146,146,146,176,300,146,146,300,400,200,500,330,300,300,200,200,320,320,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,350,600,200,200,200,146,200,200,500,500,500,500,250,146,146,146,600,600,600,600,400,400,400,350,350,400,400,400,200,200,200,200,200,200,230,230],

	"listEmotion" : ["EMO_NEUTRAL","EMO_HAPPY","EMO_SHOCK","EMO_BLUSH","EMO_ANGRY","EMO_SAD","EMO_SNEAKY","EMO_EYE_ROLL","EMO_SCARY","EMO_DISGUST","EMO_SCARED","EMO_HORRIFIED","EMO_GRUDGE","EMO_BITTERSWEET","EMO_LAUGH","EMO_EYE_CLOSED","EMO_DISAPPOINTED","EMO_EXORCISED","EMO_SKEPTICAL","EMO_SURPRISED","EMO_WINK","EMO_FLIRT","EMO_FLIRT_CHEESY","EMO_AWKWARD","EMO_IRRITABLE","EMO_RAGE","EMO_INSANE","EMO_RAGE_EXTREME", "EMO_SOUR", "EMO_PAIN", "EMO_SOUR_EXTREME", "EMO_PAIN_EXTREME","EMO_ANNOYING", "EMO_DISGUST_EXTREME"],

	"TALKING_NORMAL" : 1,
	"TALKING_BIG" : 2,

	//HandheldList Sheet
	"objectHandheld" : {"bat":{"x":-345,"y":6},"sword":{"x":-394,"y":-25},"ball":{"x":-34,"y":34},"dumbbell":{"x":-65,"y":-12},"cocktail":{"x":-128,"y":-13},"tablet":{"x":-34,"y":17},"black_card":{"x":40,"y":66},"sword1":{"x":-301,"y":-36},"sword2":{"x":-243,"y":-43},"sword3":{"x":-281,"y":-11},"sword4":{"x":-185,"y":-18},"sword5":{"x":-283,"y":-8},"sword6":{"x":-256,"y":-5},"sword7":{"x":-325,"y":-4},"sword8":{"x":-285,"y":-44},"sword9":{"x":-284,"y":-25},"sword10":{"x":-301,"y":-26},"sword11":{"x":-291,"y":-27},"sword12":{"x":-332,"y":-5},"sword13":{"x":-190,"y":-13},"sword14":{"x":-285,"y":-28},"sword15":{"x":-257,"y":-16},"sword16":{"x":-301,"y":-9},"sword17":{"x":-294,"y":0},"sword18":{"x":-293,"y":-31},"sword19":{"x":-317,"y":-56},"sword20":{"x":-315,"y":-17},"sword21":{"x":-254,"y":-16},"sword22":{"x":-306,"y":-20},"sword23":{"x":-334,"y":-50},"sword24":{"x":-192,"y":-31},"sword25":{"x":-299,"y":-15},"sword26":{"x":-315,"y":-58},"sword27":{"x":-337,"y":-43},"sword28":{"x":-483,"y":-82},"sword29":{"x":-380,"y":-46},"sword30":{"x":-396,"y":-56},"sword31":{"x":-725,"y":-103},"sword32":{"x":-738,"y":-95},"sword33":{"x":-752,"y":-83},"sword34":{"x":-723,"y":-103},"sword35":{"x":-724,"y":-100},"heart_organ":{"x":-92,"y":19},"sword36":{"x":-717,"y":-101},"sword37":{"x":-742,"y":-80},"sword38":{"x":-713,"y":-88},"sword39":{"x":-732,"y":-88},"sword40":{"x":-738,"y":-100},"beer_wood_mug":{"x":-18,"y":33},"dagger1":{"x":-168,"y":6},"ceramic_mug":{"x":-18,"y":33},"microphone":{"x":-103,"y":-5},"hoe":{"x":-694,"y":15},"axe1":{"x":-471,"y":-81},"spear1":{"x":-742,"y":-79},"sword41":{"x":-748,"y":-92},"dagger2":{"x":-243,"y":-39},"rifle1":{"x":-157,"y":-162},"rifle_sniper_camouflage1":{"x":-157,"y":-162},"rifle_ak47_1":{"x":-157,"y":-162},"rifle_bren1":{"x":-157,"y":-162},"rifle_sniper_brown1":{"x":-157,"y":-162},"phone1":{"x":-32,"y":37}},

	//BackgroundList Sheet
	"smallBG" : ["cafe","cafe2","home","office"],
	"highResBG" : ["hd_library_pastel","hd_hallway_dark","hd_boardroom4","hd_golf_field","hd_president_office","hd_mountain","hd_tariff_board","hd_cafe_pastel","hd_medieval_alley_night","hd_medieval_dungeon","hd_medieval_monastery","hd_medieval_tavern","hd_game_expo1","hd_conference","hd_medieval_alley_night_town","hd_red_table","hd_red_table1","hd_medieval_throne_room","hd_turnip_field","hd_medieval_tavern_quest","hd_castle_entrance","hd_mystical_puddle","hd_dirt_path","hd_cobblestone_path","hd_medieval_vault","hd_hooded_statue","hd_barn","hd_medieval_tavern2","hd_castle_entrance_night","hd_medieval_tavern_quest2","hd_stadium","hd_club2","hd_school2","hd_bedroom2","hd_home_front2","hd_red_chained_lock1","hd_red_corridor1","hd_red_doctor_office1","hd_red_doctor_office2","hd_red_drawer1","hd_red_hospital_waiting_room1","hd_red_hospital_waiting_room2","hd_red_injection_with_syringe1","hd_red_injection1","hd_red_injection2","hd_red_lay_in_bed1","hd_red_mysterious_silhouette1","hd_red_palm1","hd_red_palm2","hd_red_palm3","hd_red_palm4","hd_red_palm5","hd_red_palm6","hd_red_pick_up_bottle1","hd_red_room_with_tv1","hd_red_syringe_closeup1","hd_red_tools_closeup1","hd_club_dance_floor1","hd_turnip_field2","hd_medieval_dungeon3","hd_medieval_dungeon2","hd_red_two_hands1","hd_bedroom_pastel1","hd_karaoke_pastel1","hd_park_pastel1","hd_white_blanket1"],

	//BG top and floor color
	"colorBG" : {"topabstract":"#4568DC","floorabstract":"#B06AB3","topbeach":"#2EC1FC","floorbeach":"#F7DEB8","topbedroom":"#EBC0BA","floorbedroom":"#79462F","topcafe":"#735C4E","floorcafe":"#E0F2F1","topcafe2":"#FFFFFF","floorcafe2":"#E0F2F1","topceo_office":"#A2B8CB","floorceo_office":"#D1ACA3","topclub":"#001258","floorclub":"#001258","topclub2":"#0B0043","floorclub2":"#003ADE","tophome":"#220049","floorhome":"#220049","tophome_front":"#88D2E7","floorhome_front":"#707070","topluxe_room":"#DEDDD7","floorluxe_room":"#8F7E58","topoffice":"#49495B","flooroffice":"#D1ACA3","topschool":"#DCDAD8","floorschool":"#89512F","topwardrobe":"#CD2CAD","floorwardrobe":"#F199EF","topwedding_hall":"#2CC0FC","floorwedding_hall":"#F7F4E7","topdesert":"#2CC0FC","floordesert":"#FCB262","topwedding_altar":"#2CC0FC","floorwedding_altar":"#F7F4E7","topwedding_reception":"#2CC0FC","floorwedding_reception":"#F7F4E7","topjail":"#7695A6","floorjail":"#6A6F76","topboardroom":"#939598","floorboardroom":"#EBEEF5","tophospital_room":"#DFDEDE","floorhospital_room":"#D1ACA3","tophospital_waiting_room":"#E2E2E2","floorhospital_waiting_room":"#E2E2E2","topsky":"#5cbbff","floorsky":"#d3fdfd","topbuilding_front":"#273e3c","floorbuilding_front":"#a4aec0","topoffice_pantry":"#c3d3ed","flooroffice_pantry":"#c0d1ec","topoffice2":"#DEBEC1","flooroffice2":"#D2B5AD","topbuilding_front2":"#ccd5de","floorbuilding_front2":"#9ca3a9","topboardroom2":"#9C9396","floorboardroom2":"#828387","topceo_office2":"#9C9397","floorceo_office2":"#453a36","topskyscrapper1":"#c0d7e3","floorskyscrapper1":"#1e2635","topdesert_sunset":"#ff7f74","floordesert_sunset":"#ec742c","tophigh_apartment":"#756a68","floorhigh_apartment":"#e5bba5","tophigh_tower_sunset":"#391b1d","floorhigh_tower_sunset":"#956059","topportal_altar":"#a9b9c6","floorportal_altar":"#ed9e77","toprooftop_red":"#620108","floorrooftop_red":"#93060f","toproom_red":"#ad0a1b","floorroom_red":"#620404","topstreet_burning":"#4e365a","floorstreet_burning":"#3a254c","topstreet_sunset":"#c8c4c5","floorstreet_sunset":"#282e3a","topdesert_with_abandoned_ship":"#60dcf6","floordesert_with_abandoned_ship":"#f99853","topdesert_with_containers":"#fb927d","floordesert_with_containers":"#e08b62","topdesert_with_pyramid":"#10b2e0","floordesert_with_pyramid":"#dc9360","topboom":"#E75905","floorboom":"#E75905","topouter_space":"#0A0629","floorouter_space":"#0A0820","topexplosion":"#AF601D","floorexplosion":"#210303","toprock":"#474843","floorrock":"#474843","topgradient_yellow_tosca":"#000000","floorgradient_yellow_tosca":"#000000","topceo_office_cozy":"#E5C8CA","floorceo_office_cozy":"#D6B5AC","topboardroom_yellow":"#FDDEC2","floorboardroom_yellow":"#F9C9A5","topceo_office3":"#a79e97","floorceo_office3":"#70635a","topboardroom3":"#311e17","floorboardroom3":"#c69575","tophd_library_pastel":"#fef6df","floorhd_library_pastel":"#d9eafe","tophd_hallway_dark":"#05061B","floorhd_hallway_dark":"#0E0717","tophallway_dark":"#0A0B1D","floorhallway_dark":"#0F0D1A","topboardroom4":"#9B8985","floorboardroom4":"#010A13","topgolf_field":"#A5DEF9","floorgolf_field":"#588318","toppresident_office":"#C1C0BE","floorpresident_office":"#60301A","tophd_boardroom4":"#6B6764","floorhd_boardroom4":"#4B392D","tophd_golf_field":"#5BB1FA","floorhd_golf_field":"#1C3B02","tophd_president_office":"#C1C0BE","floorhd_president_office":"#40231B","topforest_dark":"#017B64","floorforest_dark":"#011329","topforest_mythical":"#26866B","floorforest_mythical":"#071A29","topforest_sunny":"#D1FBE5","floorforest_sunny":"#066044","tophyperspace":"#014380","floorhyperspace":"#033D7C","topmountain":"#5CC3EE","floormountain":"#4E5239","tophd_mountain":"#318ED1","floorhd_mountain":"#323A2D","toptariff_board":"#FFFFFF","floortariff_board":"#FDFDFB","tophd_tariff_board":"#E9E0D7","floorhd_tariff_board":"#C3AF96","tophd_cafe_pastel":"#FDE9E0","floorhd_cafe_pastel":"#A9D1DB","tophd_medieval_alley_night":"#0D0409","floorhd_medieval_alley_night":"#010207","tophd_medieval_dungeon":"#040309","floorhd_medieval_dungeon":"#030305","tophd_medieval_monastery":"#140202","floorhd_medieval_monastery":"#140202","tophd_medieval_tavern":"#100202","floorhd_medieval_tavern":"#100104","topmedieval_alley_night":"#020410","floormedieval_alley_night":"#151318","topmedieval_dungeon":"#0B0E1D","floormedieval_dungeon":"#0E1420","topmedieval_monastery":"#2B0D0B","floormedieval_monastery":"#38150F","topmedieval_tavern":"#260E0E","floormedieval_tavern":"#3E1D18","topbedroom_pc_purple":"#742FBD","floorbedroom_pc_purple":"#100E26","topgame_expo1":"#030106","floorgame_expo1":"#090116","topgame_expo2":"#030107","floorgame_expo2":"#090117","tophd_game_expo1":"#060219","floorhd_game_expo1":"#04020F","topice_cream_top_view":"#F4E9E5","floorice_cream_top_view":"#F4E9E5","tophd_conference":"#B6B6B6","floorhd_conference":"#1E2337","topmedieval_alley_night_town":"#03155F","floormedieval_alley_night_town":"#251B26","tophd_medieval_alley_night_town":"#041764","floorhd_medieval_alley_night_town":"#000519","topcave":"#030000","floorcave":"#030000","topdesert_red":"#0D090A","floordesert_red":"#440807","topfoot_worm":"#0C0000","floorfoot_worm":"#050102","tophd_red_table":"#000000","floorhd_red_table":"#160002","tophd_red_table1":"#040000","floorhd_red_table1":"#0A0000","toprundown_bedroom":"#140808","floorrundown_bedroom":"#220809","toprundown_inn":"#540405","floorrundown_inn":"#200305","tophd_medieval_throne_room":"#022946","floorhd_medieval_throne_room":"#142D43","tophd_turnip_field":"#22647A","floorhd_turnip_field":"#031931","tophd_medieval_tavern_quest":"#100001","floorhd_medieval_tavern_quest":"#100001","tophd_castle_entrance":"#015D73","floorhd_castle_entrance":"#123A5A","topcastle_entrance":"#015D73","floorcastle_entrance":"#123A5A","topmedieval_tavern_quest":"#100001","floormedieval_tavern_quest":"#100001","topdesert_with_pyramid_spring":"#41C0ED","floordesert_with_pyramid_spring":"#207035","topdesert_with_pyramid_winter":"#4778A0","floordesert_with_pyramid_winter":"#94AEC9","topmystical_puddle":"#5E9D9F","floormystical_puddle":"#3F6374","tophd_mystical_puddle":"#5E9D9F","floorhd_mystical_puddle":"#3F6375","tophd_dirt_path":"#046383","floorhd_dirt_path":"#03273F","tophd_cobblestone_path":"#105B7A","floorhd_cobblestone_path":"#062537","topdirt_path":"#046383","floordirt_path":"#03273F","topcobblestone_path":"#105B7A","floorcobblestone_path":"#062537","topfields_winter1":"#47799E","floorfields_winter1":"#98B2C9","topmedieval_vault":"#091E2F","floormedieval_vault":"#05080F","tophd_medieval_vault":"#091E2F","floorhd_medieval_vault":"#05080F","tophooded_statue":"#6BB2C4","floorhooded_statue":"#4F4136","tophd_hooded_statue":"#6BB2C4","floorhd_hooded_statue":"#4F4136","topbarn":"#1B0909","floorbarn":"#97613B","tophd_barn":"#1B0909","floorhd_barn":"#97613B","topoffice3":"#C7C1C3","flooroffice3":"#909AA4","topoffice_corridor":"#EACECB","flooroffice_corridor":"#CFAEA5","topoffice_pantry2":"#C7BFBD","flooroffice_pantry2":"#A2ACB5","tophospital_room2":"#7AB1B6","floorhospital_room2":"#AFE1E2","topcastle_entrance_night":"#0B122E","floorcastle_entrance_night":"#172B46","topmedieval_tavern2":"#01040D","floormedieval_tavern2":"#483539","topmedieval_tavern_quest2":"#01040D","floormedieval_tavern_quest2":"#483539","tophd_medieval_tavern2":"#01040D","floorhd_medieval_tavern2":"#483539","tophd_castle_entrance_night":"#0B122E","floorhd_castle_entrance_night":"#172B46","tophd_medieval_tavern_quest2":"#01040D","floorhd_medieval_tavern_quest2":"#483539","topabstract2":"#F7F6E1","floorabstract2":"#F2EDDA","tophd_stadium":"#140339","floorhd_stadium":"#070453","tophaunted_hotel":"#01070B","floorhaunted_hotel":"#011616","topmedieval_alley_daytime_town":"#5ABBEF","floormedieval_alley_daytime_town":"#664C5D","tophaunted_hotel_reception":"#071824","floorhaunted_hotel_reception":"#041C2B","tophd_club2":"#211F35","floorhd_club2":"#141C2F","tophd_school2":"#D6D7D9","floorhd_school2":"#CACBCF","topschool2":"#D6D7D9","floorschool2":"#CACBCF","tophd_bedroom2":"#FBB7C6","floorhd_bedroom2":"#F8B2CA","topbedroom2":"#F4AFC2","floorbedroom2":"#F6B5CD","tophd_home_front2":"#78CCF1","floorhd_home_front2":"#787C7F","tophd_red_chained_lock1":"#BB4543","floorhd_red_chained_lock1":"#9F282A","tophd_red_corridor1":"#350200","floorhd_red_corridor1":"#660105","tophd_red_doctor_office1":"#0B0A12","floorhd_red_doctor_office1":"#70000C","tophd_red_doctor_office2":"#290310","floorhd_red_doctor_office2":"#C50616","tophd_red_drawer1":"#DDC3C2","floorhd_red_drawer1":"#380000","tophd_red_hospital_waiting_room1":"#090401","floorhd_red_hospital_waiting_room1":"#6B0206","tophd_red_hospital_waiting_room2":"#470507","floorhd_red_hospital_waiting_room2":"#630003","tophd_red_injection_with_syringe1":"#300202","floorhd_red_injection_with_syringe1":"#070301","tophd_red_injection1":"#300202","floorhd_red_injection1":"#010101","tophd_red_injection2":"#010005","floorhd_red_injection2":"#4B0005","tophd_red_lay_in_bed1":"#3D0603","floorhd_red_lay_in_bed1":"#460001","tophd_red_mysterious_silhouette1":"#230304","floorhd_red_mysterious_silhouette1":"#730504","tophd_red_palm1":"#020202","floorhd_red_palm1":"#020202","tophd_red_palm2":"#0F0003","floorhd_red_palm2":"#240000","tophd_red_palm3":"#010101","floorhd_red_palm3":"#010101","tophd_red_palm4":"#260202","floorhd_red_palm4":"#300202","tophd_red_palm5":"#160203","floorhd_red_palm5":"#1F0101","tophd_red_palm6":"#07060B","floorhd_red_palm6":"#4D0302","tophd_red_pick_up_bottle1":"#50050A","floorhd_red_pick_up_bottle1":"#5B1718","tophd_red_room_with_tv1":"#010300","floorhd_red_room_with_tv1":"#200001","tophd_red_syringe_closeup1":"#370003","floorhd_red_syringe_closeup1":"#3C0201","tophd_red_tools_closeup1":"#250304","floorhd_red_tools_closeup1":"#200100","tophd_club_dance_floor1":"#14042B","floorhd_club_dance_floor1":"#512D75","topclub_dance_floor1":"#14042B","floorclub_dance_floor1":"#512D75","topmedieval_dungeon3":"#020204","floormedieval_dungeon3":"#352E36","tophd_turnip_field2":"#8AC9FC","floorhd_turnip_field2":"#C5997C","tophd_medieval_dungeon3":"#0D0C11","floorhd_medieval_dungeon3":"#322A35","tophd_medieval_dungeon2":"#000201","floorhd_medieval_dungeon2":"#000000","topmedieval_dungeon2":"#0B0F18","floormedieval_dungeon2":"#010101","topturnip_field2":"#89C8FB","floorturnip_field2":"#C69B7B","topantique_shop1":"#0b0505","floorantique_shop1":"#0d0502","topblue_glow1":"#000000","floorblue_glow1":"#000000","topblue_grunge1":"#000000","floorblue_grunge1":"#000000","topcurse_entities1":"#0e0402","floorcurse_entities1":"#0e0402","topred_grunge1":"#000000","floorred_grunge1":"#000000","tophd_red_two_hands1":"#5F0101","floorhd_red_two_hands1":"#320200","topaisle_empty1":"#000000","flooraisle_empty1":"#C2020F","topaisle1":"#76090F","flooraisle1":"#D6070D","topaisle2":"#751A23","flooraisle2":"#6D0003","topaisle2_light_flickers1":"#6D0712","flooraisle2_light_flickers1":"#640201","topaisle2_monster_lookback1":"#761B24","flooraisle2_monster_lookback1":"#730208","topaisle2_shuush1":"#751A21","flooraisle2_shuush1":"#720004","topaisle3":"#3D060C","flooraisle3":"#570C13","topaisle3_monster_lookback1":"#350103","flooraisle3_monster_lookback1":"#540109","topaisle4":"#531F23","flooraisle4":"#69202B","topaisle5":"#400C10","flooraisle5":"#8F2026","topaisle5_monster_lookback1":"#450408","flooraisle5_monster_lookback1":"#810A10","topaisle6":"#000000","flooraisle6":"#650006","topcashier_red_closeup_scary1":"#010101","floorcashier_red_closeup_scary1":"#030102","topcashier_red_closeup_smiling1":"#010101","floorcashier_red_closeup_smiling1":"#030102","topcashier_red_closeup_smiling5":"#010101","floorcashier_red_closeup_smiling5":"#030305","topcashier_red_closeup_smilling2":"#020001","floorcashier_red_closeup_smilling2":"#040001","topcashier_red_closeup_smilling3":"#4E0113","floorcashier_red_closeup_smilling3":"#3B020B","topcashier_red_closeup_smilling4":"#3A0411","floorcashier_red_closeup_smilling4":"#4F0101","topcashier_red_closeup1":"#3C252F","floorcashier_red_closeup1":"#0A090F","topcashier_red_empty1":"#4F0101","floorcashier_red_empty1":"#460002","topcashier_red_head_tilt1":"#510100","floorcashier_red_head_tilt1":"#480001","topcashier_red_smiling1":"#410102","floorcashier_red_smiling1":"#390102","topcashier_red_tilt_smile1":"#500202","floorcashier_red_tilt_smile1":"#460203","topcashier_red1":"#480003","floorcashier_red1":"#3E0100","topgrocery_exit_door1":"#000000","floorgrocery_exit_door1":"#000000","topnext_please_ending1":"#010101","floornext_please_ending1":"#010101","topnext_please_ending2":"#4D1520","floornext_please_ending2":"#DA2D2F","topnext_please_ending3":"#690102","floornext_please_ending3":"#4D010B","topnext_please_ending4":"#680813","floornext_please_ending4":"#573C45","topnext_please_ending5":"#481D30","floornext_please_ending5":"#010101","topnext_please_ending7":"#360002","floornext_please_ending7":"#480006","topnext_please_ending8":"#000105","floornext_please_ending8":"#020202","topsub_aisle1":"#600409","floorsub_aisle1":"#A40200","topsub_aisle2":"#6A0105","floorsub_aisle2":"#CB0101","topsub_aisle3":"#510100","floorsub_aisle3":"#B50100","topwalkaway_red1":"#010101","floorwalkaway_red1":"#820815","tophd_bedroom_pastel1":"#F4F0ED","floorhd_bedroom_pastel1":"#C1946B","tophd_karaoke_pastel1":"#FF8DE2","floorhd_karaoke_pastel1":"#D078B4","tophd_park_pastel1":"#A1F8F2","floorhd_park_pastel1":"#66AB74","tophd_white_blanket1":"#E2DEDB","floorhd_white_blanket1":"#DFDBDC"},

	//END OF GENERATED FROM SHEET

	//BG File Type
	"BGFileType" : {},

	//UI THEMED COLOR
	"uiColor" : {
		"pixel8bitred" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "#E4D9CC",			
			"btnchapterNLinfo" : "#E4D9CC",
			"btnchapterNLtag" : "#E4D9CC",
			"chapterNLTitle" : "#E4D9CC",

			//CHAPTER
			"btnchapterbg" : "#E4D9CC",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#e50913",
			"btnchapterinfo" : "#000000",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#E4D9CC",

			//UI SHOP
			"shoptitle" : "#E4D9CC",
			"btnshopbg" : "#E4D9CC",
			"btnshoptitle" : "#e50913",
			"btnshopinfo" : "#000000",
			"btnshopup" : "#000000",
			"btnshopshadow" : "#e50913",
			"btnshoptint" : "black",
			"btnvctext" : "#E4D9CC",

			//BUTTON OPTION
			"optionhover" : "#B00000",
			"optionhovershadow" : "#F1EAE2",
			"optionup" : "#6B0402",
			"optionupshadow" : "#E6D9CA",
			"optionclick" : "#510200",
			"optionclickshadow" : "#DAC6AF",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "#E4D9CC",
			"optiontextgrey" : "grey",
			"optioncorner" : 0,

			//UI LOG
			"bguilog" : "#510200",
			"strokeuilog" : "#281e1d",
			"textuilog" : "#E4D9CC",

			//UI SAVE
			"textsaveui" : "#E4D9CC",

			//UI CURRENCY
			"bguicurrency" : "#000000",
			"strokeuicurrency" : "#de353d",
			"textcurrency" : "#E4D9CC",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#E4D9CC",

			//UI Exit
			"exitText" : "#E4D9CC",

			//UI Replay
			"replayText" : "#E4D9CC",

			//UI Enter Name
			"enterTitle" : "#E4D9CC",

			//BG for splash loader
			"basebg" : '#000000',

			//BAR for splash loader
			"barStroke" : '#E4D9CC', 
			"bar" : '#e50913', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'retrogaming',
				'fontThin':'retrogaming',
				'fontSize':50,

				'iosfontWeight':'',
				'iosfont':'retrogaming',
				'iosfontThin':'retrogaming',
				'iosfontSize':50,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#E4D9CC'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'retrogaming',
				'fontThin':'retrogaming',
				'fontSize':32, //27

				'iosfontWeight':'',
				'iosfont':'retrogaming',
				'iosfontThin':'retrogaming',
				'iosfontSize':32, //27

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36,
			}
		}, 
		"vintagesquare" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "#3e3323",
			"btnchapterNLtitle" : "#faedc1",			
			"btnchapterNLinfo" : "#675740",
			"btnchapterNLtag" : "#faedc1",
			"chapterNLTitle" : "#faedc1",

			//CHAPTER
			"btnchapterbg" : "#A63827",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "white",
			"btnchapterinfo" : "white",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#675740",

			//UI SHOP
			"shoptitle" : "#675740",
			"btnshopbg" : "#e5d4b9",
			"btnshoptitle" : "#675740",
			"btnshopinfo" : "#675740",
			"btnshopup" : "#675740",
			"btnshopshadow" : "#4a3b25",
			"btnshoptint" : "black",
			"btnvctext" : "#faedc1",

			//BUTTON OPTION
			"optionhover" : "#B74A2F",
			"optionhovershadow" : "#803D1C",
			"optionup" : "#893823",
			"optionupshadow" : "#5A2B14",
			"optionclick" : "#6C2C1C",
			"optionclickshadow" : "#3C1C0D",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "#faedc1",
			"optiontextgrey" : "grey",
			"optioncorner" : 0,

			//UI LOG
			"bguilog" : "#EBD9C2",
			"strokeuilog" : "#F9FFFB",
			"textuilog" : "#675740",

			//UI SAVE
			"textsaveui" : "#675740",

			//UI CURRENCY
			"bguicurrency" : "#675740",
			"strokeuicurrency" : "#4a3b25",
			"textcurrency" : "#faedc1",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#675740",

			//UI Exit
			"exitText" : "#675740",

			//UI Replay
			"replayText" : "#675740",

			//UI Enter Name
			"enterTitle" : "#675740",

			//BG for splash loader
			"basebg" : '#ebdbc5',

			//BAR for splash loader
			"barStroke" : '#4a3b25', 
			"bar" : '#9c8d59', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,

				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':60,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':60,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#faedc1'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':38,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':38,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36,
			}
		}, 
		"cyberpunkcyanfuschia" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "white",
			"btnchapterNLtag" : "black",
			"chapterNLTitle" : "white",

			//CHAPTER
			"btnchapterbg" : "#b661ff",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "white",
			"btnchapterinfo" : "black",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "white",

			//UI SHOP
			"shoptitle" : "white",
			"btnshopbg" : "white",
			"btnshoptitle" : "black",
			"btnshopinfo" : "black",
			"btnshopup" : "#d06eff",
			"btnshopshadow" : "#602c6c",
			"btnshoptint" : "black",
			"btnvctext" : "white",

			//BUTTON OPTION
			"optionhover" : "#9347E7",
			"optionhovershadow" : "#6D00E6",
			"optionup" : "#7A21E1",
			"optionupshadow" : "#4F00A3",
			"optionclick" : "#671ABD",
			"optionclickshadow" : "#34006F",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 0,

			//UI LOG
			"bguilog" : "#685cac",
			"strokeuilog" : "black",
			"textuilog" : "white",

			//UI SAVE
			"textsaveui" : "white",

			//UI CURRENCY
			"bguicurrency" : "black",
			"strokeuicurrency" : "black",
			"textcurrency" : "white",
			"opacitycurrency" : 0.8,

			//UI Setting
			"settingTitle" : "white",

			//UI Exit
			"exitText" : "white",

			//UI Replay
			"replayText" : "white",

			//UI Enter Name
			"enterTitle" : "white",

			//BG for splash loader
			"basebg" : '#6b48d0',

			//BAR for splash loader
			"barStroke" : 'white', 
			"bar" : '#c100ff', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,

				'fontWeight':'',
				'font':'queensparkbold',
				'fontThin':'queenspark',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'queensparkbold',
				'iosfontThin':'queenspark',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'black'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'queensparkbold',
				'fontThin':'queenspark',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'queensparkbold',
				'iosfontThin':'queenspark',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"sleekbluered" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "black",
			"btnchapterNLtag" : "white",
			"chapterNLTitle" : "white",

			//CHAPTER
			"btnchapterbg" : "#216AF5",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "white",
			"btnchapterinfo" : "white",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "black",

			//UI SHOP
			"shoptitle" : "black",
			"btnshopbg" : "#216AF5",
			"btnshoptitle" : "white",
			"btnshopinfo" : "white",
			"btnshopup" : "white",
			"btnshopshadow" : "#F4243C",
			"btnshoptint" : "black",
			"btnvctext" : "black",

			//BUTTON OPTION
			"optionhover" : "#568EF8",
			"optionhovershadow" : "#F7576B",
			"optionup" : "#216AF5",
			"optionupshadow" : "#F4243C",
			"optionclick" : "#0A4BC5",
			"optionclickshadow" : "#B80A20",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "white",
			"strokeuilog" : "black",
			"textuilog" : "black",

			//UI SAVE
			"textsaveui" : "black",

			//UI CURRENCY
			"bguicurrency" : "black",
			"strokeuicurrency" : "black",
			"textcurrency" : "white",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "black",

			//UI Exit
			"exitText" : "black",

			//UI Replay
			"replayText" : "black",

			//UI Enter Name
			"enterTitle" : "black",

			//BG for splash loader
			"basebg" : '#216AF5',

			//BAR for splash loader
			"barStroke" : 'white', 
			"bar" : '#F4243C', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,

				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':60,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':60,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'white'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':38,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':38,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36,
			}
		}, 
		"starlightdarkblue" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "white",
			"btnchapterNLtag" : "white",
			"chapterNLTitle" : "white",

			//CHAPTER
			"btnchapterbg" : "white",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#492E6F",
			"btnchapterinfo" : "#492E6F",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "white",

			//UI SHOP
			"shoptitle" : "white",
			"btnshopbg" : "white",
			"btnshoptitle" : "#492E6F",
			"btnshopinfo" : "#492E6F",
			"btnshopup" : "#31368A",
			"btnshopshadow" : "#1F1A4C",
			"btnshoptint" : "black",
			"btnvctext" : "white",

			//BUTTON OPTION
			"optionhover" : "#4A52BA",
			"optionhovershadow" : "#2E2B8B",
			"optionup" : "#31368A",
			"optionupshadow" : "#1F1A4C",
			"optionclick" : "#241E5B",
			"optionclickshadow" : "#160E1C",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#262B53",
			"strokeuilog" : "white",
			"textuilog" : "white",

			//UI SAVE
			"textsaveui" : "white",

			//UI CURRENCY
			"bguicurrency" : "#262B53",
			"strokeuicurrency" : "white",
			"textcurrency" : "white",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "white",

			//UI Exit
			"exitText" : "white",

			//UI Replay
			"replayText" : "white",

			//UI Enter Name
			"enterTitle" : "white",

			//BG for splash loader
			"basebg" : '#262B53',

			//BAR for splash loader
			"barStroke" : 'white', 
			"bar" : '#435296', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,

				'fontWeight':'',
				'font':'queensparkbold',
				'fontThin':'queenspark',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'queensparkbold',
				'iosfontThin':'queenspark',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'white'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'queensparkbold',
				'fontThin':'queenspark',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'queensparkbold',
				'iosfontThin':'queenspark',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"purpledating" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "#6469C4",
			"btnchapterNLtitle" : "#F3E3F5",			
			"btnchapterNLinfo" : "#A8ABDE",
			"btnchapterNLtag" : "#F3E3F5",
			"chapterNLTitle" : "#A8ABDE",

			//CHAPTER
			"btnchapterbg" : "#A8ABDE",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#F3E3F5",
			"btnchapterinfo" : "#F3E3F5",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#A8ABDE",

			//UI SHOP
			"shoptitle" : "#A8ABDE",
			"btnshopbg" : "#A8ABDE",
			"btnshoptitle" : "#F3E3F5",
			"btnshopinfo" : "#F3E3F5",
			"btnshopup" : "#F3E3F5",
			"btnshopshadow" : "#BDBFE6",
			"btnshoptint" : "black",
			"btnvctext" : "#A8ABDE",

			//BUTTON OPTION
			"optionhover" : "#8A98FF",
			"optionhovershadow" : "#5252EF",
			"optionup" : "#B84BE0",
			"optionupshadow" : "#A42DB5",
			"optionclick" : "#9349E2",
			"optionclickshadow" : "#6D2DD3",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#E7DAF0",
			"strokeuilog" : "#9699CF",
			"textuilog" : "#9699CF",

			//UI SAVE
			"textsaveui" : "#9699CF",

			//UI CURRENCY
			"bguicurrency" : "#F3E3F5",
			"strokeuicurrency" : "#A8ABDE",
			"textcurrency" : "#A8ABDE",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#A8ABDE",

			//UI Exit
			"exitText" : "#A8ABDE",

			//UI Replay
			"replayText" : "#A8ABDE",

			//UI Enter Name
			"enterTitle" : "#A8ABDE",

			//BG for splash loader
			"basebg" : '#F3E3F5',

			//BAR for splash loader
			"barStroke" : '#A8ABDE', 
			"bar" : '#FCDCE2', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#A8ABDE'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"orangedating" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "#E66144",
			"btnchapterNLtitle" : "#FBE7AF",			
			"btnchapterNLinfo" : "#ED927D",
			"btnchapterNLtag" : "#FBE7AF",
			"chapterNLTitle" : "#ED927D",

			//CHAPTER
			"btnchapterbg" : "#ED927D",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#FBE7AF",
			"btnchapterinfo" : "#FBE7AF",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#ED927D",

			//UI SHOP
			"shoptitle" : "#ED927D",
			"btnshopbg" : "#ED927D",
			"btnshoptitle" : "#FBE7AF",
			"btnshopinfo" : "#FBE7AF",
			"btnshopup" : "#FBE7AF",
			"btnshopshadow" : "#FDB69E",
			"btnshoptint" : "black",
			"btnvctext" : "#ED927D",

			//BUTTON OPTION
			"optionhover" : "#F7B95E",
			"optionhovershadow" : "#E2803D",
			"optionup" : "#F27D3D",
			"optionupshadow" : "#D86100",
			"optionclick" : "#DD5345",
			"optionclickshadow" : "#C63628",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#FFD4B3",
			"strokeuilog" : "#ED927D",
			"textuilog" : "#ED927D",

			//UI SAVE
			"textsaveui" : "#ED927D",

			//UI CURRENCY
			"bguicurrency" : "#FBE7AF",
			"strokeuicurrency" : "#ED927D",
			"textcurrency" : "#ED927D",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#ED927D",

			//UI Exit
			"exitText" : "#ED927D",

			//UI Replay
			"replayText" : "#ED927D",

			//UI Enter Name
			"enterTitle" : "#ED927D",

			//BG for splash loader
			"basebg" : '#FFD4B3',

			//BAR for splash loader
			"barStroke" : '#ED927D', 
			"bar" : '#FBE7AF', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#ED927D'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"aquamarinedating" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "#4264A4",
			"btnchapterNLtitle" : "#D3E9DE",			
			"btnchapterNLinfo" : "#809ACC",
			"btnchapterNLtag" : "#D3E9DE",
			"chapterNLTitle" : "#809ACC",

			//CHAPTER
			"btnchapterbg" : "#809ACC",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#D3E9DE",
			"btnchapterinfo" : "#D3E9DE",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#809ACC",

			//UI SHOP
			"shoptitle" : "#809ACC",
			"btnshopbg" : "#809ACC",
			"btnshoptitle" : "#D3E9DE",
			"btnshopinfo" : "#D3E9DE",
			"btnshopup" : "#D3E9DE",
			"btnshopshadow" : "#93B7D0",
			"btnshoptint" : "black",
			"btnvctext" : "#809ACC",

			//BUTTON OPTION
			"optionhover" : "#45DADD",
			"optionhovershadow" : "#02A3A3",
			"optionup" : "#60cc9e",
			"optionupshadow" : "#21A368",
			"optionclick" : "#189E94",
			"optionclickshadow" : "#07706B",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#B7DFD2",
			"strokeuilog" : "#809ACC",
			"textuilog" : "#809ACC",

			//UI SAVE
			"textsaveui" : "#809ACC",

			//UI CURRENCY
			"bguicurrency" : "#D3E9DE",
			"strokeuicurrency" : "#809ACC",
			"textcurrency" : "#809ACC",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#809ACC",

			//UI Exit
			"exitText" : "#809ACC",

			//UI Replay
			"replayText" : "#809ACC",

			//UI Enter Name
			"enterTitle" : "#809ACC",

			//BG for splash loader
			"basebg" : '#B3CCDD',

			//BAR for splash loader
			"barStroke" : '#809ACC', 
			"bar" : '#D3E9DE', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#809ACC'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"pinkdating" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "#f497bf",
			"btnchapterNLtitle" : "#fefde8",			
			"btnchapterNLinfo" : "#f497bf",
			"btnchapterNLtag" : "#fefde8",
			"chapterNLTitle" : "#f497bf",

			//CHAPTER
			"btnchapterbg" : "#f497bf",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#fefde8",
			"btnchapterinfo" : "#fefde8",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#f497bf",

			//UI SHOP
			"shoptitle" : "#f497bf",
			"btnshopbg" : "#f497bf",
			"btnshoptitle" : "#fefde8",
			"btnshopinfo" : "#fefde8",
			"btnshopup" : "#FCE2ED",
			"btnshopshadow" : "#FAC0D9",
			"btnshoptint" : "black",
			"btnvctext" : "#f497bf",

			//BUTTON OPTION
			"optionhover" : "#FF9C9C",
			"optionhovershadow" : "#F46C83",
			"optionup" : "#EF65A2",
			"optionupshadow" : "#DE4485",
			"optionclick" : "#E85673",
			"optionclickshadow" : "#C92B4C",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#FDECF3",
			"strokeuilog" : "#F497BF",
			"textuilog" : "#F497BF",

			//UI SAVE
			"textsaveui" : "#F497BF",

			//UI CURRENCY
			"bguicurrency" : "#fdecf3",
			"strokeuicurrency" : "#f497bf",
			"textcurrency" : "#f497bf",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#f497bf",

			//UI Exit
			"exitText" : "#f497bf",

			//UI Replay
			"replayText" : "#f497bf",

			//UI Enter Name
			"enterTitle" : "#f497bf",

			//BG for splash loader
			"basebg" : '#fdecf3',

			//BAR for splash loader
			"barStroke" : '#f497bf', 
			"bar" : '#fefde8', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#f497bf'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"vintage" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "#3e3323",
			"btnchapterNLtitle" : "#faedc1",			
			"btnchapterNLinfo" : "#675740",
			"btnchapterNLtag" : "#faedc1",
			"chapterNLTitle" : "#faedc1",

			//CHAPTER
			"btnchapterbg" : "#e5d4b9",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#675740",
			"btnchapterinfo" : "#675740",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#675740",

			//UI SHOP
			"shoptitle" : "#675740",
			"btnshopbg" : "#e5d4b9",
			"btnshoptitle" : "#675740",
			"btnshopinfo" : "#675740",
			"btnshopup" : "#675740",
			"btnshopshadow" : "#4a3b25",
			"btnshoptint" : "black",
			"btnvctext" : "#faedc1",

			//BUTTON OPTION
			"optionhover" : "#857152",
			"optionhovershadow" : "#6A5535",
			"optionup" : "#675740",
			"optionupshadow" : "#4a3b25",
			"optionclick" : "#4E4230",
			"optionclickshadow" : "#302618",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "#faedc1",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#EBD9C2",
			"strokeuilog" : "#F9FFFB",
			"textuilog" : "#675740",

			//UI SAVE
			"textsaveui" : "#675740",

			//UI CURRENCY
			"bguicurrency" : "#675740",
			"strokeuicurrency" : "#4a3b25",
			"textcurrency" : "#faedc1",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "#675740",

			//UI Exit
			"exitText" : "#675740",

			//UI Replay
			"replayText" : "#675740",

			//UI Enter Name
			"enterTitle" : "#675740",

			//BG for splash loader
			"basebg" : '#ebdbc5',

			//BAR for splash loader
			"barStroke" : '#4a3b25', 
			"bar" : '#9c8d59', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'queensparkbold',
				'fontThin':'queenspark',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'queensparkbold',
				'iosfontThin':'queenspark',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#faedc1'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'queensparkbold',
				'fontThin':'queenspark',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'queensparkbold',
				'iosfontThin':'queenspark',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}, 
		"sleekblackyellow" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "black",
			"btnchapterNLtag" : "white",
			"chapterNLTitle" : "#fcd753",

			//CHAPTER
			"btnchapterbg" : "black",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#fcd753",
			"btnchapterinfo" : "white",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "white",

			//UI SHOP
			"shoptitle" : "white",
			"btnshopbg" : "black",
			"btnshoptitle" : "#fcd753",
			"btnshopinfo" : "white",
			"btnshopup" : "white",
			"btnshopshadow" : "#fcd753",
			"btnshoptint" : "black",
			"btnvctext" : "black",

			//BUTTON OPTION
			"optionhover" : "#3b3838",
			"optionhovershadow" : "#fde079",
			"optionup" : "#262424",
			"optionupshadow" : "#fcd753",
			"optionclick" : "#000000",
			"optionclickshadow" : "#edbb08",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 0,

			//UI LOG
			"bguilog" : "#000000",
			"strokeuilog" : "#fcd753",
			"textuilog" : "white",

			//UI SAVE
			"textsaveui" : "black",

			//UI CURRENCY
			"bguicurrency" : "#000000",
			"strokeuicurrency" : "#fcd753",
			"textcurrency" : "white",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "white",

			//UI Exit
			"exitText" : "white",

			//UI Replay
			"replayText" : "white",

			//UI Enter Name
			"enterTitle" : "white",

			//BG for splash loader
			"basebg" : '#edbb08',

			//BAR for splash loader
			"barStroke" : '#000000', 
			"bar" : '#FFFFFF', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':60,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':60,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'#fcd753'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':38,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':38,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36,
			}
		}, 
		"sleekblackred" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "white",
			"btnchapterNLtag" : "white",
			"chapterNLTitle" : "#e50913",

			//CHAPTER
			"btnchapterbg" : "white",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#e50913",
			"btnchapterinfo" : "#000000",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "#e50913",

			//UI SHOP
			"shoptitle" : "white",
			"btnshopbg" : "white",
			"btnshoptitle" : "#e50913",
			"btnshopinfo" : "#000000",
			"btnshopup" : "#000000",
			"btnshopshadow" : "#e50913",
			"btnshoptint" : "black",
			"btnvctext" : "white",

			//BUTTON OPTION
			"optionhover" : "#3b3838",
			"optionhovershadow" : "#eb4d55",
			"optionup" : "#262424",
			"optionupshadow" : "#de353d",
			"optionclick" : "#000000",
			"optionclickshadow" : "#e50913",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#000000",
			"strokeuilog" : "#E50913",
			"textuilog" : "white",

			//UI SAVE
			"textsaveui" : "white",

			//UI CURRENCY
			"bguicurrency" : "#000000",
			"strokeuicurrency" : "#de353d",
			"textcurrency" : "white",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "white",

			//UI Exit
			"exitText" : "white",

			//UI Replay
			"replayText" : "white",

			//UI Enter Name
			"enterTitle" : "white",

			//BG for splash loader
			"basebg" : '#000000',

			//BAR for splash loader
			"barStroke" : '#FFFFFF', 
			"bar" : '#e50913', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':60,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':60,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'white'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'sansbold',
				'fontThin':'sans',
				'fontSize':38,

				'iosfontWeight':'',
				'iosfont':'sansbold',
				'iosfontThin':'sans',
				'iosfontSize':38,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36,
			}
		}, 
		"pink" : { //hue 60 lightness 20
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "white",
			"btnchapterNLtag" : "white",
			"chapterNLTitle" : "white",
			
			//BUTTON CHAPTER
			"btnchapterbg" : "white",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#8c5877",
			"btnchapterinfo" : "#8c5877",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "white",

			//UI SHOP
			"shoptitle" : "white",
			"btnshopbg" : "white",
			"btnshoptitle" : "#8c5877",
			"btnshopinfo" : "#8c5877",
			"btnshopup" : "#8f6666",
			"btnshopshadow" : "#785b5b",
			"btnshoptint" : "black",
			"btnvctext" : "white",

			//BUTTON OPTION
			"optionhover" : "#b57e7e",
			"optionhovershadow" : "#966d6d",
			"optionup" : "#8f6666",
			"optionupshadow" : "#785b5b",
			"optionclick" : "#6f4e4e",
			"optionclickshadow" : "#544141",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#9F4A7D",
			"strokeuilog" : "#602D4B",
			"textuilog" : "white",

			//UI SAVE
			"textsaveui" : "white",

			//UI CURRENCY
			"bguicurrency" : "#923e6b",
			"strokeuicurrency" : "#5f2447",
			"textcurrency" : "white",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "white",

			//UI Exit
			"exitText" : "white",

			//UI Replay
			"replayText" : "white",

			//UI Enter Name
			"enterTitle" : "white",

			//BG for splash loader
			"basebg" : '#fca0df',

			//BAR for splash loader
			"barStroke" : '#7f5154', 
			"bar" : '#F3DA8A', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'white'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		},
		"purple" : {
			//CHAPTER NON LINEAR
			"btnchapterNLtitlebg" : "black",
			"btnchapterNLtitle" : "white",			
			"btnchapterNLinfo" : "white",
			"btnchapterNLtag" : "white",
			"chapterNLTitle" : "white",

			//CHAPTER
			"btnchapterbg" : "white",
			"btnchapterbggray" : "#999999",
			"btnchaptertitle" : "#492E6F",
			"btnchapterinfo" : "#492E6F",
			"btnchapterinfogray" : "#666666",
			"chapterTitle" : "white",
			"btnchaptercorner":15,

			//UI SHOP
			"shoptitle" : "white",
			"btnshopbg" : "white",
			"btnshoptitle" : "#492E6F",
			"btnshopinfo" : "#492E6F",
			"btnshopup" : "#734073",
			"btnshopshadow" : "#563256",
			"btnshoptint" : "black",
			"btnvctext" : "white",
			"btnshopcorner":15,

			//BUTTON OPTION
			"optionhover" : "#A25EA2",
			"optionhovershadow" : "#7C497C",
			"optionup" : "#734073",
			"optionupshadow" : "#563256",
			"optionclick" : "#4B224B",
			"optionclickshadow" : "#291229",
			"optiongrey" : "#545454",
			"optiongreyshadow" : "#414141",
			"optiontext" : "white",
			"optiontextgrey" : "grey",
			"optioncorner" : 15,

			//UI LOG
			"bguilog" : "#300C63",
			"strokeuilog" : "#712DB5",
			"textuilog" : "white",

			//UI SAVE
			"textsaveui" : "white",

			//UI CURRENCY
			"bguicurrency" : "#3F0E77",
			"strokeuicurrency" : "#270952",
			"textcurrency" : "white",
			"opacitycurrency" : 1,

			//UI Setting
			"settingTitle" : "white",

			//UI Exit
			"exitText" : "white",

			//UI Replay
			"replayText" : "white",

			//UI Enter Name
			"enterTitle" : "white",

			//BG for splash loader
			"basebg" : '#DBCEFF',

			//BAR for splash loader
			"barStroke" : '#5B265F', 
			"bar" : '#F3DA8A', 

			//ALL BUTTON
			"button" : {
				'textOffsetY':0,
				 
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':55,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':55,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':55,

				'textColor':'white'
			},

			//BUBBLE DIALOG
			"bubble" : {
				'fontWeight':'',
				'font':'metroblack',
				'fontThin':'metromed',
				'fontSize':36,

				'iosfontWeight':'',
				'iosfont':'arialmtbold',
				'iosfontThin':'arialmt',
				'iosfontSize':36,

				'langfontWeight':'',
				'langfont':'arialmtbold',
				'langfontThin':'arialmt',
				'langfontSize':36
			}
		}
	},

//_______________________________________________________________________________
//CODE BELOW CAN BE CUSTOMIZED BY PUTTING IT IN EACH GAME FOLDER IN setting.js	
	
	"defaultName":"You", //IF THERE IS NO INPUT NAME

	//true: without mainmenu screen, it will directly show chapter list if multipleChapter is true. 
	//false: show mainmenu screen with game title
	"simplifiedUI" : false,

	"enableURLParam" : true, //false = game goes live, true = only for testing
	"enableConsoleLog" : true, //false = game goes live, true = only for testing

	"enableFullScreen" : true, //Button Fullscreen Visibility
	"enableShop" : true, //UI Shop Visibility
	"enableCurrency" : true, //UI Currency Visibility
	"enableExit" : true, //UI Exit & Exit Button Visibility
	"enableLanguage" : true, //Button Language Visibility
	"enableVoiceOver" : true, //Voice Over on dialog
	"enableDemo" : false, //Demo Text Visibility
	"enableTitleLoader" : true, //true:title on loading, false:brand on loading
	"showButtonMenuSetting" : true, 
	"lockPreviousChapter" :false,
	"linearChapterWithThumbnail" :false,
	"showButtonLoadOnMenu":false,
	"showGameArea":true,

	"demoText" : {
		"color":'black',
		"stroke":'none',
		"lineWidth":10
	},

	"RVOption" : true,
	"CurrencyOption" : true,

	"dialogStyle" : "default", //default = rounded bubble with tail, rectangle = bubble in bottom

	//PROGRESS BAR SETTING FOR EACH ID
	"progressBar" : {
		"progressHP" : {
			"current" : "HP",
			"max" : "totalHP",
			"text" : "HP"
		},
		"progressMP" : {
			"current"  : "MP",
			"max" : "totalMP",
			"text" : "MP"
		}
	},

	//DEFAULT PROGRESS BAR SETTING
	"defaultProgressBar" : {
		"position" : "top", //top / bottom / center
		"simplifyNumber" : false, //(eg: 100,000 becomes 100k)
		//CAN BE CUSTOMIZED IN progressBar in each ID
		"showText" : true,
		"showMaxValue" : true,
		"width" : 450,
		"height" : 35,
		"progressColor" : '#5df542',
		"strokeColor" : 'green',
		"strokeThickness" : 15,
		"corner" : 15,
		"textColor" : 'white',
		"strokeTextColor" : 'black',
		"strokeTextThickness" : 7,
		"textSize" : 25
	},

	//DEFAULT OPTION BUTTON
	"optionButton" : {
		"corner" : -1, //-1 = follow the original UI
	},

	//DEFAULT WINDOW BOXING
	"windowBoxing" : {
		"top" : {
			"color":"black",
			"thickness":200,
			"zIndex":1 
		},
		"bottom" : {
			"color":"black",
			"thickness":200,
			"zIndex":1 
		},
		"left" : {
			"color":"black",
			"thickness":200,
			"zIndex":1 
		},
		"right" : {
			"color":"black",
			"thickness":200,
			"zIndex":1 
		},
	},

	//DEFAULT CHAPTER PAGE SETTING
	"chapterPage" : {
		"visible" : false,
		"color" : '', //SET NULL to follow UI Theme
		"fontSize" : 0 //SET NULL to follow UI Theme
	},

	//DEFAULT SPEAKER NAME COLOR
	"speakerName" : {
		"strokeColor":"none",
		"bgColor":"#52514e",
		"bgOpacity":1,
		"textColor":"white",
		"fontSize":30,
		"align":"left" //left center right
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
		}
	},

	//DEFAULT TOASTBOX
	"toastBox" : {
		'timeAlive':1,
		'boxColor':'white',
		'outlineColor':'',
		'opacity':1,
		'position':'top', //top | center | bottom
		'fontColor':'black',
		'fontSize':34,
		'corner':10
	},

	"virtualCurrencyUsed" : [ 1, 2, 3 ], //List of Virtual Currency used in game

	"miniButton" : {
		"textColor":'white',
		"outlineColor":'black',
		"fontSize":25,
		"padding":{x:25, y:25}, //distance between button
		"textOffset":{x:0, y:5},
		
		//visibility for each button
		"skip" : true,
		"auto" : true,
		"save" : true,
		"load" : true,
		"log" : true
	},

	"chapters":{
		multipleChapter:true, //true: show chapter list screen. false: directly play chapter 1
		showMainMenu:true,
		totalChapter:3 //total chapter shown in chapter list page (min 2, max 7)
	},

	"enableCurrentProgress" : true, //true : each chapter will continue from last scene ( suitable for long visual novel ), false : chapter will always start from the top ( suitable for short story like cringe-rizz-lines )

	"repeatOption":false, //true = option will be repeated in dialog

	"mainMenuBgColor": "#B49AFE", //mainmenu screen bg color

	"brandWidth" : 600, //logo width on custom loading screen

	"loadBackgroundMusic" : true, //true/false using bgm or not

	"uiTheme" : "purple", // ui colors. see the option in uiColor

	"isLinearChapter" : true,

	// "bgMenuResources" : [ 'wardrobe' ], //LIST BG YOU NEED TO PRELOAD HERE ( IF NONE, CAN LEAVE IT BLANK ) fill in with mainmenu background 

	"firstMCOutfit" : { 'chapter1':'' }, //outfit at the start of each chapter

	"dynamic_name": [ ], //generated from story sheet

	"neutral_girl" : [ ], //generated from story sheet
	"neutral_boy" : [ ], //generated from story sheet
	// "duTheme" : [ 'amy', 'casual', 'sexy' ], //generated from story sheet

	//generated from story sheet
	"spriterData" : { },

};

function mergeObject( original, extended ) {
	for( var key in extended ) {
		var ext = extended[key];
		if(
			typeof(ext) != 'object' ||
			ext instanceof HTMLElement ||			
			ext === null
		) {
			original[key] = ext;
		}
		else {
			if( !original[key] || typeof(original[key]) != 'object' ) {
				original[key] = (ext instanceof Array) ? [] : {};
			}
			mergeObject( original[key], ext );
		}
	}
	return original;
}
mergeObject(_BASEPATH,_GAMESETTING._BASEPATH);
mergeObject(_DATAGAME,_GAMESETTING._DATAGAME);
