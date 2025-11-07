import sublime
import sublime_plugin
import os

class CustomCompletionListener(sublime_plugin.EventListener):
    def on_query_completions(self, view, prefix, locations):
        # Get the file name
        file_name = view.file_name()

        # Get the scope (language mode) of the current file
        scope = view.scope_name(0)

        # Check if the file name ends with `.en.js` and is a JavaScript file
        if file_name and file_name.endswith('.en.js') and 'source.js' in scope:
            completions = [
                # EMO LIST
                ("EMO_NEUTRAL\tEMO","EMO_NEUTRAL"),
                ("EMO_HAPPY\tEMO","EMO_HAPPY"),
                ("EMO_SHOCK\tEMO","EMO_SHOCK"),
                ("EMO_BLUSH\tEMO","EMO_BLUSH"),
                ("EMO_ANGRY\tEMO","EMO_ANGRY"),
                ("EMO_SAD\tEMO","EMO_SAD"),

                #handheld
                ("handheld_bat\tHANDHELD","bat"),
                ("handheld_sword\tHANDHELD","sword"),
                ("handheld_ball\tHANDHELD","ball"),

                # BGM
                ("bgm-boyfriend\tBGM","bgm-boyfriend"),
                ("bgm-ceo\tBGM","bgm-ceo"),
                ("bgm-dance\tBGM","bgm-dance"),
                ("bgm-insta\tBGM","bgm-insta"),
                ("bgm-photo\tBGM","bgm-photo"),
                ("bgm-cafe\tBGM","bgm-cafe"),
                ("bgm-comedy\tBGM","bgm-comedy"),
                ("bgm-danger\tBGM","bgm-danger"),
                ("bgm-knight\tBGM","bgm-knight"),
                ("bgm-resolution\tBGM","bgm-resolution"),
                ("bgm-reveal1\tBGM","bgm-reveal1"),
                ("bgm-reveal2\tBGM","bgm-reveal2"),
                ("bgm-sad\tBGM","bgm-sad"),
                ("bgm-suspense\tBGM","bgm-suspense"),
                ("bgm-violin\tBGM","bgm-violin"),
                ("bgm-wedding1\tBGM","bgm-wedding1"),
                ("bgm-wedding2\tBGM","bgm-wedding2"),

                #SFX
                ("sfx_record_scratch\tSFX","record_scratch"),
                ("sfx_trumpet_fail\tSFX","trumpet_fail"),
                ("sfx_ba_dum_tss\tSFX","ba_dum_tss"),
                ("sfx_omnious\tSFX","omnious"),
                ("sfx_chipmunk_laugh\tSFX","chipmunk_laugh"),
                ("sfx_cat_meow\tSFX","cat_meow"),
                ("sfx_phone_ring\tSFX","phone_ring"),
                ("sfx_calling\tSFX","calling"),
                ("sfx_dj_scratch4\tSFX","dj_scratch4"),
                ("sfx_disappointment\tSFX","disappointment"),
                ("sfx_fast_flashback2\tSFX","fast_flashback2"),
                ("sfx_gasp_male\tSFX","gasp_male"),
                ("sfx_gasp_female\tSFX","gasp_female"),
                ("sfx_confetti_pop\tSFX","confetti_pop"),
                ("sfx_crowd_happy\tSFX","crowd_happy"),

                #background list
                ("background_abstract\tBACKGROUND","abstract"),
                ("background_beach\tBACKGROUND","beach"),
                ("background_bedroom\tBACKGROUND","bedroom"),
                ("background_cafe\tBACKGROUND","cafe"),
                ("background_cafe2\tBACKGROUND","cafe2"),
                ("background_ceo_office\tBACKGROUND","ceo_office"),
                ("background_club\tBACKGROUND","club"),
                ("background_club2\tBACKGROUND","club2"),
                ("background_home\tBACKGROUND","home"),
                ("background_home_front\tBACKGROUND","home_front"),
                ("background_luxe_room\tBACKGROUND","luxe_room"),
                ("background_office\tBACKGROUND","office"),
                ("background_school\tBACKGROUND","school"),
                ("background_wardrobe\tBACKGROUND","wardrobe"),
                ("background_wedding_hall\tBACKGROUND","wedding_hall"),
                ("background_desert\tBACKGROUND","desert"),
                ("background_wedding_altar\tBACKGROUND","wedding_altar"),
                ("background_wedding_reception\tBACKGROUND","wedding_reception"),
                ("background_jail\tBACKGROUND","jail"),
                ("background_boardroom\tBACKGROUND","boardroom"),
                ("background_hospital_room\tBACKGROUND","hospital_room"),

                #ANIM LIST
                ("ANIM_IDLE\tANIM","ANIM_IDLE"),
                ("ANIM_HIP\tANIM","ANIM_HIP"),
                ("ANIM_MOUTH\tANIM","ANIM_MOUTH"),
                ("ANIM_CROSS\tANIM","ANIM_CROSS"),
                ("ANIM_GIGGLE\tANIM","ANIM_GIGGLE"),
                ("ANIM_BOW\tANIM","ANIM_BOW"),
                ("ANIM_GROOVE\tANIM","ANIM_GROOVE"),
                ("ANIM_DANCEUP\tANIM","ANIM_DANCEUP"),
                ("ANIM_DANCEHIP\tANIM","ANIM_DANCEHIP"),
                ("ANIM_CHEER\tANIM","ANIM_CHEER"),
                ("ANIM_LAUGH\tANIM","ANIM_LAUGH"),
                ("ANIM_FLIRT\tANIM","ANIM_FLIRT"),
                ("ANIM_CONFUSED\tANIM","ANIM_CONFUSED"),
                ("ANIM_DISAPPOINTED\tANIM","ANIM_DISAPPOINTED"),
                ("ANIM_AWKWARD\tANIM","ANIM_AWKWARD"),
                ("ANIM_CRYING\tANIM","ANIM_CRYING"),
                ("ANIM_TALKSHEEPHISH\tANIM","ANIM_TALKSHEEPHISH"),
                ("ANIM_TALKPHONE\tANIM","ANIM_TALKPHONE"),
                ("ANIM_BLINKING\tANIM","ANIM_BLINKING"),
                ("ANIM_ANGRY\tANIM","ANIM_ANGRY"),
                ("ANIM_HUG\tANIM","ANIM_HUG"),
                ("ANIM_KISS\tANIM","ANIM_KISS"),
                ("ANIM_MAKEOUT\tANIM","ANIM_MAKEOUT"),
                ("ANIM_IDLE_REAR\tANIM","ANIM_IDLE_REAR"),
                ("ANIM_WALK_REAR\tANIM","ANIM_WALK_REAR"),
                ("ANIM_HIP_REAR\tANIM","ANIM_HIP_REAR"),
                ("ANIM_TALK_REAR\tANIM","ANIM_TALK_REAR"),
                ("ANIM_TALKSHEEPISH_REAR\tANIM","ANIM_TALKSHEEPISH_REAR"),
                ("ANIM_HUG_REAR\tANIM","ANIM_HUG_REAR"),
                ("ANIM_KISS_REAR\tANIM","ANIM_KISS_REAR"),
                ("ANIM_MAKEOUT_REAR\tANIM","ANIM_MAKEOUT_REAR"),
                ("ANIM_SHOCK\tANIM","ANIM_SHOCK"),
                ("ANIM_RAGE\tANIM","ANIM_RAGE"),
                ("ANIM_WAVEHI\tANIM","ANIM_WAVEHI"),
                ("ANIM_APPLAUD\tANIM","ANIM_APPLAUD"),
                ("ANIM_JUMP\tANIM","ANIM_JUMP"),
                ("ANIM_FAINTED\tANIM","ANIM_FAINTED"),
                ("ANIM_FALL\tANIM","ANIM_FALL"),
                ("ANIM_WOUNDED\tANIM","ANIM_WOUNDED"),
                ("ANIM_THINK\tANIM","ANIM_THINK"),
                ("ANIM_SHRUG\tANIM","ANIM_SHRUG"),
                ("ANIM_LAY_IDLE\tANIM","ANIM_LAY_IDLE"),
                ("ANIM_LAY_SLEEP\tANIM","ANIM_LAY_SLEEP"),

            ]
            return completions
        return []
