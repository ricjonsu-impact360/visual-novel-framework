2.0.0

********
PATCH 44
********
- No max speed for WALK_IN and WALK_OUT

Update :
- game-controller.js
- char.js


********
PATCH 43
********
- New animEffect
	• heartbeat
	• pulse
	• hover

Update :
- datagame.js
- game-controller.js


********
PATCH 42
********
- Add new animations
	• ANIM_POINT_FOWARD_DOUBLE_FINGER_CASUAL
	• ANIM_POINT_FOWARD_DOUBLE_FINGER_ENERGETIC
	• ANIM_HIPHOP_ELBOW_OPEN
	• ANIM_SLASH_LUNGE
	• ANIM_SLASH_SWING
	• ANIM_FALL_FLOATING
	• ANIM_FLY_BACKWARDS_FLOATING
	• ANIM_SPRINT_HAND_CLOSE
	• ANIM_SPRINT_HAND_OPEN
	• ANIM_JOG_HAND_CLOSE
	• ANIM_JOG_HAND_OPEN
	• ANIM_RUN_WIDE_HAND_CLOSE
	• ANIM_RUN_WIDE_HAND_OPEN
	• ANIM_IDLE_HANDS_DOWN_LEGS_WIDE
	• ANIM_IDLE_HANDS_DOWN_LEGS_WIDE_REAR
	• ANIM_SIT_TYPING_GENTLE
	• ANIM_SIT_TYPING_FURIOUS
	• ANIM_SIT_TYPING_IDLE
	• ANIM_SIT_TYPING_REST
	• ANIM_SIT_TYPING_GENTLE_REAR
	• ANIM_SIT_TYPING_FURIOUS_REAR
	• ANIM_SIT_TYPING_IDLE_REAR
	• ANIM_SIT_TYPING_REST_REAR
- Add new background
	• hd_stadium
	• haunted_hotel
	• medieval_alley_daytime_town
	• haunted_hotel_reception

Update :
- char.js
- datagame.js


********
PATCH 41
********
- Add loop properties for object tween : revert | reverse

Update :
- game-controller.js
- overlay.js

********
PATCH 40
********
- Add tweenIn and tweenOut param for dialog animation
- Add delay param for ANIMEFFECT zoom_pan

Update :
- game-controller.js

********
PATCH 39
********
- Add new animations
	• ANIM_HOLD_MICROPHONE_EXTEND
	• ANIM_HOLD_MICROPHONE_RETRACT
	• ANIM_EMBRACE_BOY
	• ANIM_EMBRACE_GIRL
	• ANIM_EMBRACE_IDLE_BOY
	• ANIM_EMBRACE_IDLE_GIRL
	• ANIM_SHIVER_MILD
	• ANIM_SHIVER_MEDIUM
	• ANIM_SHIVER_EXTREME
	• ANIM_WALK_SHIVER_MILD
	• ANIM_WALK_SHIVER_MEDIUM
	• ANIM_WALK_SHIVER_EXTREME
Update :
- char.js
- datagame.js

********
PATCH 38
********
- Add handheld object : ceramic_mug
- Add progressBar

Update :
- game-controller.js
- main.js
- progressbar.js
- datagame.js

********
PATCH 37
********
- Add sfxText for dialog ( will be played while the text animated )
- Fix zoom_in and zoom_out animation
- Add new emotion : EMO_EYE_CLOSED
- Add new animations :
	• ANIM_COMPLAIN
	• ANIM_FIST_DOWN
	• ANIM_POUND_FIST
	• ANIM_SHAKEITTOTHEMAX_BASS
	• ANIM_SHAKEITTOTHEMAX_HIPS
	• ANIM_SHAKEITTOTHEMAX_RELAX
	• ANIM_STRIKE_OVERHEAD_TO_GROUND
	• ANIM_STRIKE_OVERHEAD_TO_MIDDLE
	• ANIM_PIANO_FINGER_REAR
	• ANIM_PIANO_ENTHUSIASTIC_REAR
	• ANIM_PIANO_ENTHUSIASTIC2_REAR
	• ANIM_PIANO_GENTLE_REAR
	• ANIM_PIANO_FINGER
	• ANIM_PIANO_ENTHUSIASTIC
	• ANIM_PIANO_ENTHUSIASTIC2
	• ANIM_PIANO_GENTLE


Update :
- game-controller.js
- chat-bubble.js
- datagame.js


********
PATCH 36
********
- Add windowBoxing
- Add freeze frame properties : timeAlive, sfxStart, sfxText
- Check integer and boolean support comparing value between another variable

Update :
- main.js
- game-controller.js
- window_boxing.js
- datagame.js

********
PATCH 35
********
- Add new animations
	• ANIM_SIP_CUP
	• ANIM_SLAP_GIVE
	• ANIM_SLAP_RECEIVE
- Add basic pagination on chapter UI

Update :
- datagame.js
- ui-chapter.js
- ui-chapter-non-linear.js

********
PATCH 34
********
- Add new animation 
	• ANIM_CHUG_MAX
	• ANIM_SWAY_DRUNK_MODERATE
	• ANIM_SWAY_DRUNK_HEAVY
	• ANIM_EXPLAIN_DEFENSE
	• ANIM_EXPLAIN_MIDDLE
	• ANIM_EXPLAIN_UP
	• ANIM_CHEER2
	• ANIM_DEFEND_HOLD_OBJECT
- Add new theme : vintagesquare
- Add new handheld object : beer_wood_mug

Update :
- datagame.js
- char.js
- spriter-display.js
- spriter-object.js
- handpart.js


********
PATCH 33
********
- Add toastBox
- Add new boy skin part : 0_hand-close-front-rear.png ( clone of 0_hand-close-front.png without shadow )

Update :
- game-controller.js
- datagame.js
- notification.js
- main.js


********
PATCH 32
********
- Add new emotion 
	• EMO_SCARED
	• EMO_HORRIFIED
	• EMO_GRUDGE
	• EMO_BITTERSWEET
- Add new UI Theme : cyberpunkcyanfuschia
- New outfit
	• bottom-miniskirt-plaid-purple
	• face-doe-purple-eye
	• hair-bang-medium-straight-purple
	• hat-headphone-purple
	• shoes-boot-black
	• skin-fair-cold
	• top-hoodie-jacket-purple

Update :
- datagame.js
- char.js


********
PATCH 31
********
- Add switch ( min and max ) conditional formatting
- Update theme button properties
- Fix button text ( related to language )

********
PATCH 30
********
- Add minibutton
	• show
	• hide
	• auto
	• skip
	• save
	• load
	• log
  Can be customized in setting.js
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

Update :
- game-controller.js
- button-save.js
- button-log.js
- button-auto.js
- button-skip.js
- button-load.js
- button-save.js
- button-show.js
- button-save-preview.js
- ui-log.js
- ui-saveload.js
- ui-warningsave.js

********
PATCH 29
********
- Add customization related to dialog box and speaker name in datagame.js
  This can be customized in setting.js
	• "dialogStyle" : "default" / "rectangle"
	• "speakerName" : {
		"strokeColor":"none",
		"bgColor":"#52514e",
		"bgOpacity":1,
		"textColor":"white",
		"fontSize":30,
		"align":"center" //left center right
	  },
	• "dialogBox" : {
		'textColor':'black',
		'boxColor':'white',
		'boxOpacity':1,
		'outlineColor':'black',
		'height':200,
		'offsetY':0
	   },

Update :
- game-controller.js
- datagame.js
- bubble.js
- text.js
- chat-bubble.js

********
PATCH 28
********
- Add new customization outfit
	• anklet
	• bracelet
	• necklace
- Add 0_leg-right-cross & 0_leg-left-cross for meditation leg
- Add new outfit
	• bottom-peasant-brown
	• shoes-leather-boots-plain-black
	• top-peasant-long-sleeve-cream-vest-brown
	• anklet-none
	• bracelet-none
	• necklace-none
	• anklet-black
	• bracelet-black
	• necklace-black

Asset update :
- boy.scml
- girl.scml
- All skin folders

Update :
- datagame.js
- boy.js
- girl.js

********
PATCH 27
********
- Add more swords and heart organ
- Add background particles
	• dust_mote
	• fire_ember
- Add single particles
	• light_sunshine
	• blood_drip
	• explosion

Update :
- datagame.js
- dust_mote.js
- fire_ember.js
- overlay_particle.js
- single_particle.js
- light_sunshine.js
- blood_drip.js
- explosion.js

********
PATCH 26
********
- Add conditional formatting for virtual currency and boolean

Update :
- game-controller.js
- main.js

********
PATCH 25
********
- Change all UI workflow based on uiTheme data
	• Button font and color can be customized
	• Bubble font can be customized
- Add virtual currency up to 8
	• icon can be changed in setting.js variable array "virtualCurrencyUsed"
	• name can be changed in string.en.js
- Add background character

Update :
- All UI and VC related class 

********
PATCH 24
********
- Add new animation
	• ANIM_SQUAT
	• ANIM_MEDITATE_IDLE
	• ANIM_MEDITATE_FLOATING
- Change animation name ANIM_PUNCH to ANIM_PUNCH_ON_KNEES
- Fix option currency bug	
- Add variable repeatOption, default is false (true = option will be repeated in dialog)

Update :
- datagame.js
- char.js
- game-controller.js
- boy.scml
- girl.scml


********
PATCH 23
********
- Add eye animation

Update :
- datagame.js
- char.js
- emo_eye.js
- spriter-display.js
- spriter-object.js

********
PATCH 22
********
- Add overlay camera
- Add new animation
	• ANIM_SIT
	• ANIM_PUNCH
	• ANIM_STRUGGLE_WEAK
	• ANIM_STRUGGLE_HARD	

Update :
- game-controller.js
- camera1.js
- camera2.js
- topoverlay.js

********
PATCH 21
********
- Add bubble properties
	• bubbleOffsetY (integer)
	• bubbleType (default / think / none)
	• textFontSize (integer)

Update :
- game-controller.js
- text.js
- bubble.js

********
PATCH 20
********
- Add character shadow ( can be customized on script editor )

Update :
- game-controller.js
- datagame.js
- char.js


********
PATCH 19
********
- Add Scroll BG
- Add zombie and skeleton skin
- Add police outfit
- Add WALK_IN and WALK_OUT type ( walk/run/stumble )
- Add new animation
- Add dumbbell and cocktail handheld
- Fix zoom pivot
- Add new BG
- Fix letter and email with images

Update :
- background.js
- game-controller.js
- datagame.js
- char.js

********
PATCH 18
********
- Fix wordwrap and text for language with no spacing e.g chinese & japanese

Update :
- main.js
- multilang.js
- game-controller.js
- email.js
- letter.js
- datagame.js

********
PATCH 17
********
- Fix dialogs show up before tween finished
- Fix load background

Update :
- game-controller.js
- overlay.js
- custom-loader.js
- datagame.js

********
PATCH 16
********
- Particle Background (snow, rain, meteor, fireworks, matrix, bubble)
- Add hat and beard for character custom
- Add emotion when walk in and walk out
- Flip loop background

File update :
- particle.js
- rain.js
- snow.js
- meteor.js
- fireworks.js
- matrix.js
- game-controller.js
- datagame.js
- boy.js
- girl.js
- custom-loader.js
- char.js
- background.js

********
PATCH 15
********
- Add sfx delay
- Add enableURLParam variable for testing on setting.js
- Add enableConsoleLog variable for testing on setting.js

File update :
- main.js
- game-controller.js
- setting.js
- datagame.js

********
PATCH 14
********
- Change sfx assets omnious to ominous
- Separate BGM and SFX button
- Change structure changePose to match animation name in spriter

File update :
- button-sound.js
- ui-setting.js
- button-home.js
- game-controller.js
- char.js
- datagame.js

Assets update :
- boy.scml
- girl.scml
- ominous.mp3
- ominous.ogg


********
PATCH 13
********
- Fix freeze_frame bug while adding character spriter
- Fix outfit change when walk_in
- Fix check width wordwrap when there's text format
- Fix BGM not looping
- Add URL param directLoadChapter for direct load from splash loader
- Fix replay UI position and z-index

File update :
- char.js
- game-controller.js
- main.js
- custom-loader.js
- main.js
- menu-controller.js
- ui-replay.js
- game-controller.js
- ui-setting.js
- button-yes.js
- button-no.js

********
PATCH 12
********
- Add checking if glasses and earring exist
- Fix button-prev and button-next position in ui-chapter
- Fix char position blink after animEffect trans0

File update :
- custom-loader.js
- button-prev.js
- button-next.js
- game-controller.js

********
PATCH 11
********
- Add betty and ravi from undercover

********
PATCH 10
********
- Change keyboard resolution

File update :
- game-controller.js

*******
PATCH 9
*******
- Add 0_waist and 0_waist-rear to top outfit customization

*******
PATCH 8
*******
- Change resolution to 1080x1920

*******
PATCH 7
*******
- Fix sender name in text chat
- Add all Boyfriend for Hire Girl Characters 

File update :
- phone.js

*******
PATCH 6
*******
- Remove SFX list and BGM list that's not preloaded on sound-info.js
- Add Boyfriend for Hire Girl Characters (WIP)

File update :
- datagame.js
- setting.js
- custom-loader.js
- sound-info.js
- howler-player.js

*******
PATCH 5
*******
- Separate earring on girl outfit
- Add Boyfriend for Hire, Marriage Contract, Instadiva Boy Characters

File update :
- datagame.js
- setting.js
- girl.js
- boy.js

*******
PATCH 4
*******
- Move main character default outfit to datagame "firstMCOutfit"

File update :
- game-controller.js
- button-chapter.js
- datagame.js
- setting.js
- string.en.js


********
PATCH 3
********
- Add voiceover function
- Fix email

File update :
- datagame.js
- custom-loader.js
- game-controller.js
- email.js

********
PATCH 2
********
- Character outfit in freeze frame according to the latest outfit
- Add trans0 in animEffect for instant change of scene without fade transition

File update :
- freezeframe.js
- game-controller.js
- main.js 


********
PATCH 1
********
- Add custom oufit to character in transition
- Change spriter data format ( now character can be customized - skin, hair, face, top, bottom, shoes )
- Add animEffect letter and email
- Fix resuming the game

File update :
- game-controller.js
- datagame.js
- letter.js (new)
- email.js (new)
- main.js
- phone.js
- ui-setting.js
- custom-load.js

__________________________________________

1.0.5

********
PATCH 15
********
- Fix stop char at previous scene animation at the start of each chapter

File update :
- game-controller.js

********
PATCH 14
********
- When there's tween sfx will be played at the start of the animation. If there's no tween, sfx will be played at the end of the dialog.
- Fix empty dialog check after finish tween
- Add color customization for end scene

File update :
- game-controller.js

********
PATCH 13
********
- Add truck_honk sfx

Assets update :
- truck_honk.mp3
- truck_honk.ogg

File update :
- sound-info.js


********
PATCH 12
********
- Add exit button on menu

File update :
- datagame.js
- button-exit.js
- menu-controller.js
- ui-exit.js
- string.en.js ( on each game )

********
PATCH 11
********
- Fix bug stop loop sfx

File update :
- game-controller.js

********
PATCH 10
********
- Change image phone path using _BASEPATH

File update :
- phone.js

*******
PATCH 9
*******
- Fix text position with textEffect

File update :
- plugins/chat-bubble/factory/text.js

*******
PATCH 8
*******
- Add sfx crowd_happy

Assets update :
- crowd_happy.mp3
- crowd_happy.ogg

File update :
- sound-info.js

*******
PATCH 7
*******
- Fix bug talking

File update :
- game-controller.js

*******
PATCH 6
*******
- Add custom outfit for main character in transition

File update :
- game-controller.js

*******
PATCH 5
*******
- Add sfx confetti_pop

Assets update :
- confetti_pop.mp3
- confetti_pop.ogg

File update :
- sound-info.js

*******
PATCH 4
*******
- Add char animation delay and dialog delay

File update :
- game-controller.js

*******
PATCH 3
*******
- Add 12 new bgm
- Customize default name
- Add asianguy1
- Add new bg hospital_room

Assets update :
- bgm-cafe
- bgm-comedy
- bgm-danger
- bgm-knight
- bgm-resolution
- bgm-reveal1
- bgm-reveal2
- bgm-sad
- bgm-suspense
- bgm-violin
- bgm-wedding1
- bgm-wedding2
- asianguy1 folder assets
- hospital_room.png

File update :
- sound-info.js
- datagame.js
- main.js
- game-controller.js

*******
PATCH 2
*******
- Button fullscreen customization

File update :
- datagame.js
- main.js
- transition.js

*******
PATCH 1
*******
- Support multiple BGM
- Add lay-idle and lay-sleep animation
- Add hospital_room BG

Assets update :
- rename bgm1 to bgm-insta
- girl.scml
- boy.scml
- bed.png
- hospital_room.png

File update :
- dev.js
- custom-loader.js
- splash-loader.js
- main.js
- menu-controller.js
- game-controller.js
- resources-info.js
- sound-info.js
- datagame.js
- char.js

_______________________________________________________________

1.0.4

*******
PATCH 1
*******
- Add new animation 
	ANIM_APPLAUD
	ANIM_JUMP
	ANIM_FAINTED
	ANIM_FALL
	ANIM_WOUNDED
	ANIM_THINK
	ANIM_SHRUG
- Add new background
	desert
	wedding_altar
	wedding_reception
	boardroom
	jail
- Fix char and object calculation on single color background

Assets :
- Add new backgrounds

File update : 
- girl.scml
- boy.scml
- datagame.js
- char.js
- game-controller.js
- background.js
- handpart.js

*******
PATCH 2
*******
- Add flexible bg chapter for normal UI

Assets :
- Add bg-chapter1, bg-chapter2, bg-chapter3 for purple and pink theme

File update :
- resource-info.js
- ui-chapter.js
- datagame.js

*******
PATCH 3
*******
- Add setting to show shop and language in datagame.js for custimization
- Fix UI shop close button

File update :
- datagame.js
- main.js
- ui-shop.js
- setting.js

*******
PATCH 4
*******
- Add new sfx
- Change BG call for menu

File update :
- resource-info.js
- menu-controller.js
- sound-info.js

*******
PATCH 5
*******
- Fix BG call for freeze frame
- Add openAllChapter to be customized on query
- Preload title for normal UI

File update :
- game-controller.js
- main.js
- splash-loader.js

*******
PATCH 6
*******
- Add Demo text customization on datagame
- Add Title/Brand customization on datagame

File update :
- datagame.js
- splash-loader.js
- custom-loader.js
- demo-text.js ( new )
- string.en.js

*******
PATCH 7
*******
- Fix bug spriter data call

File update :
- girl.js
- boy.js
- char.js

*******
PATCH 8
*******
- Fix bug hand change skin

File update :
- char.js

*******
PATCH 9
*******
- Fix position bubble dialog think

File update :
- game-controller.js

********
PATCH 10
********
- Check moregames enabled

File update :
- menu-controller.js

********
PATCH 11
********
- Fix bug when press button yes reset data

File update :
- ui-setting.js

********
PATCH 12
********
- Add new sfx
	gasp_male
	gasp_female

Assets :
- gasp_male.mp3
- gasp_male.ogg
- gasp_female.mp3
- gasp_female.ogg

File update :
- sound-info.js

_______________________________________________________________

1.0.3

*******
PATCH 1
*******
- Add handheld object at front hand character
- Bug fix overlay object when zooming
- Change wave-hi animation and added images for wave-hi animation

Assets :
- All skin folder in "visual-novel-assets" updated with additional new images 
   0_hand-wave
   0_hand-hold
   0_hand-hold-rear

File update :
- handpart.js ( new file )
- load.js
- push.sh
- char.js
- game-controller.js
- overlay.js

*******
PATCH 2
*******
- Add Setting UI
- Dialog on top on dress up choice

Assets :
- Add btn-setting.png on ui purple and pink

File update : 
- ui-setting.js ( new file )
- button-no-reset.js ( new file )
- button-reset.js ( new file )
- button-home.js
- button-option.js
- button-sound.js
- button-yes.js
- game-controller.js
- menu-controller.js
- resources-info.js

*******
PATCH 3 
*******
- Fix bug walk_out and in on first load
- Add check DU option with space
- Pause animation and tween when paused

File update : 
- game-controller.js
- button-option.js
- button-setting.js
- tween.js
- freezeframe.js
- button.js
- main.js
- char.js
- ui-setting.js
- spriter-display.js
- sound-handler.js

*******
PATCH 4
*******
- Add animeffect "zoom_pan"

File update : 
- game-controller.js
- background.js
- overlay.js

_______________________________________________________________


1.0.2

*******
PATCH 1
*******
- Add overlay object tween

File update :
- overlay.js ( new file )
- datagame.js
- custom-loader.js
- char.js
- girl.js
- boy.js
- game-controller.js
_______________________________________________________________

1.0.1

*******
PATCH 1
*******
- Add wave-hi animation

Assets :
- Add all skin from marriage contract with billionaire ceo

File update :
- girl.scml
- boy.scml

