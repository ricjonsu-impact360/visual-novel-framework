# VNScript Syntax Reference

**Version:** 1.0 (Parser v1.0.65)
**Last Updated:** 2025-11-08
**Status:** DRAFT

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Syntax Basics](#syntax-basics)
4. [Command Categories](#command-categories)
5. [Scene Setup Commands](#scene-setup-commands)
6. [Character Commands](#character-commands)
7. [Animation & Effects](#animation--effects)
8. [Object & Particle System](#object--particle-system)
9. [Branching & Logic](#branching--logic)
10. [Variable Management](#variable-management)
11. [UI Elements](#ui-elements)
12. [Advanced Settings](#advanced-settings)
13. [Text Formatting](#text-formatting)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Quick Reference](#quick-reference)

---

## Introduction

VNScript is a human-readable scripting language for creating visual novel content. Scripts written in `.vnscript` format are compiled to JavaScript (`.en.js`) for execution by the game engine.

### System Overview

```
Author writes:          Parser converts:       Engine executes:
chapter1.en.vnscript → chapter1.en.js      → Visual Novel Game
(Human-readable)       (JavaScript)          (Runtime)
```

### Key Features

- **Simple syntax** - Command-based structure, easy to learn
- **Powerful features** - Characters, branching, effects, animations
- **Asset management** - Automatic asset manifest generation
- **Validation** - Real-time error checking (with linter)
- **Multilingual** - Built-in localization support

---

## Getting Started

### Your First Script

Create a file named `chapter1.en.vnscript`:

```vnscript
// This is a comment
BACKGROUND. office center
CHARACTERS. @Barney position center anim ANIM_IDLE emo EMO_NEUTRAL

@Barney Hello! Welcome to my office.
@Barney This is a simple visual novel scene.

CHOICE.
@Barney Would you like to see more?
{
    @Barney Great! Let's continue.
}
@Barney Maybe another time then.
{
    @Barney No problem, take your time.
}

END. black
```

### Compiling Your Script

```bash
# Navigate to script-converter directory
cd visual-novel-script-editor/script-converter

# Run the parser
node script-editor.js processScript ../media/text/scripts/ ../../media/text/translate/ ../../media/text/
```

This generates:
- `chapter1.en.js` - Compiled script
- `customload.js` - Asset manifest

---

## Syntax Basics

### Comments

```vnscript
// Single line comment
@Barney This is dialogue  // Inline comments work too

/*
  Multi-line
  comment
*/
```

### Command Structure

Commands follow this pattern:

```
COMMAND_NAME. [parameters] [properties]
```

**Examples:**
```vnscript
BACKGROUND. office_bg center
CHARACTERS. @Amy position left anim ANIM_TALK
@Amy Hello world!
```

### Property Syntax

Properties use space-separated key-value pairs:

```vnscript
@CharName property1 value1 property2 value2 dialogue text here
```

### Object Syntax

Complex data uses JavaScript object notation:

```vnscript
OBJECT. ball sprite from { x:100, y:200 } to { x:300, y:400 } time 1
```

### Multiple Items (Semicolon Separator)

Use `;` to define multiple items in one command:

```vnscript
CHARACTERS. @Amy position left ; @Barney position right
```

### Case Sensitivity

- **Commands:** Case-insensitive (but conventionally UPPERCASE)
- **Properties:** Case-insensitive (parser normalizes)
- **Values:** Case-sensitive for most values
- **Character names:** Case-sensitive (must match asset names)
- **Asset names:** Case-sensitive (must match filenames)

### Property Name Variants

Many properties accept multiple spellings (both are valid):

| Variant 1 | Variant 2 | Usage |
|-----------|-----------|-------|
| `text_delay` | `textDelay` | Delay before showing text |
| `anim_delay` | `animDelay` | Animation start delay |
| `bubble_offset_y` | `bubbleOffsetY` | Bubble vertical offset |
| `text_font_size` | `textFontSize` | Custom font size |

**Note:** This reference uses `snake_case` variants, but both work.

---

## Command Categories

VNScript commands are organized into 8 categories:

1. **Scene Setup** - Backgrounds, music, sound effects
2. **Character** - Character positioning, dialogue, movement
3. **Animation & Effects** - Visual effects, transitions, camera
4. **Object & Particle** - Props, objects, particle effects
5. **Branching & Logic** - Choices, conditions, jumps
6. **Variable Management** - Flags, counters, currency
7. **UI Elements** - Progress bars, notifications, dress-up
8. **Advanced Settings** - Configuration, metadata

---

## Scene Setup Commands

### BACKGROUND.

Sets the scene background image.

**Syntax:**
```vnscript
BACKGROUND. <background_name> [position] [properties]
```

**Parameters:**
- `background_name` - Asset name (without extension)
- `position` - Optional: `left`, `center`, `right` (default: `center`)

**Additional Properties:**
- `type` - Special type: `scroll`
- `direction` - Scroll direction: `up`, `down`, `left`, `right`
- `speed` - Scroll speed (number)

**Examples:**

Basic background:
```vnscript
BACKGROUND. office center
```

Positioned background:
```vnscript
BACKGROUND. park_wide left
```

Scrolling background:
```vnscript
BACKGROUND. elevator_interior center type scroll direction up speed 0.5
```

Color background (no asset):
```vnscript
BACKGROUND. #FF0000 center
```

**Notes:**
- Background persists until changed
- Asset automatically added to `customload.js`
- Supports: JPG, PNG formats
- Recommended size: 1920x1080 or wider

---

### CHARACTERS.

Defines which characters appear in the scene.

**Syntax:**
```vnscript
CHARACTERS. @CharName [properties] [; @CharName2 [properties]]
```

**Parameters:**
- `@CharName` - Character identifier (prefixed with `@`)

**Properties:**
- `position` - Screen position: `left`, `center`, `right`
- `posX` - Custom X position (pixels, overrides position)
- `posY` - Custom Y position (pixels)
- `anim` - Animation name (e.g., `ANIM_IDLE`, `ANIM_TALK`)
- `emo` - Emotion name (e.g., `EMO_NEUTRAL`, `EMO_HAPPY`)
- `faceTo` - Facing direction: `left`, `right`
- `handheld` - Object held by character (asset name)
- `shadow` - Enable shadow: `true`, `false`
- `tint` - Color tint (hex): `#FF0000`
- `scale` - Size multiplier: `1.0`, `1.5`, etc.
- `outfit` - Outfit identifier
- `anim_delay` / `animDelay` - Animation start delay (seconds)
- `animSpeed` - Animation playback speed multiplier

**Examples:**

Single character:
```vnscript
CHARACTERS. @Barney position center anim ANIM_IDLE emo EMO_NEUTRAL
```

Multiple characters:
```vnscript
CHARACTERS. @Amy position left faceTo right ; @Barney position right faceTo left
```

Custom positioning:
```vnscript
CHARACTERS. @Barney posX 500 posY 100 anim ANIM_SIT
```

With props:
```vnscript
CHARACTERS. @Amy position center handheld coffee_cup shadow true
```

With tint:
```vnscript
CHARACTERS. @Barney position center tint #FF8888 scale 1.2
```

**Notes:**
- Characters persist across scenes until removed
- Character name must match sprite folder name
- Default `anim`: `ANIM_IDLE`
- Default `emo`: `EMO_NEUTRAL`
- Default `position`: `left`
- Use empty `CHARACTERS.` to remove all characters

---

### OVERLAY.

Applies a visual overlay to the scene.

**Syntax:**
```vnscript
OVERLAY. <overlay_type>
```

**Parameters:**
- `overlay_type` - Overlay effect: `flashback`, `dream`, `none`

**Examples:**

Enable flashback overlay:
```vnscript
OVERLAY. flashback
```

Remove overlay:
```vnscript
OVERLAY. none
```

**Notes:**
- Overlay persists until removed or changed
- Typically darkens/tints the scene
- Used for dream sequences, memories, etc.

---

### BGM.

Controls background music.

**Syntax:**
```vnscript
BGM. <music_name>
```

**Parameters:**
- `music_name` - Music asset name (without extension)

**Examples:**

Play music:
```vnscript
BGM. calm_morning
```

Stop music:
```vnscript
BGM. default
```

**Notes:**
- Music loops automatically
- Persists across scenes
- Supports: MP3, OGG formats
- Use `default` or empty string to stop
- Fade in/out controlled in compiled format (not in vnscript)
- Asset automatically added to `customload.js`

---

### SFX.

Plays sound effects.

**Syntax:**
```vnscript
SFX. <sound_name> [loop] [delay <seconds>]
SFX. loop <sound_name> [delay <seconds>]
SFX. stop [sound_name]
```

**Parameters:**
- `sound_name` - Sound asset name (without extension)
- `loop` - Make sound loop continuously
- `stop` - Stop playing sound
- `delay` - Delay before playing (seconds)

**Examples:**

Play once:
```vnscript
SFX. door_open
```

Play with delay:
```vnscript
SFX. footsteps delay 0.5
```

Loop sound:
```vnscript
SFX. loop rain delay 1
```

Stop all sounds:
```vnscript
SFX. stop
```

Stop specific sound:
```vnscript
SFX. stop rain
```

**Notes:**
- Sounds play once by default
- Loop sounds continue until stopped
- Multiple sounds can play simultaneously
- Asset automatically added to `customload.js`
- Supports: MP3, OGG formats

---

## Character Commands

### @CharName (Dialogue)

Displays character dialogue.

**Syntax:**
```vnscript
@CharName [properties] dialogue text here
```

**Special Character:**
- `@none` - Narrator dialogue (no character name shown)

**Properties:**
- `text_delay` / `textDelay` - Delay before text appears (seconds)
- `bubble` - Bubble type: `normal`, `think`, `none`
- `bubble_offset_y` / `bubbleOffsetY` - Vertical offset (pixels)
- `text_font_size` / `textFontSize` - Font size override
- `nameTag` - Override displayed name
- `sfxText` - Sound effect for text appearance
- `tweenIn` - Enable tween-in animation: `true`, `false`
- `tweenOut` - Enable tween-out animation: `true`, `false`
- `voice_over` / `voiceover` - Mark scene for voice acting
- `anim` - Change animation for this line
- `emo` - Change emotion for this line
- `faceTo` - Change facing direction
- `tint` - Apply/change tint
- `handheld` - Change handheld object
- `position` - Move to position
- `anim_delay` / `animDelay` - Animation delay
- `animSpeed` - Animation speed
- `outfit` - Change outfit
- `shadow` - Toggle shadow

**Examples:**

Basic dialogue:
```vnscript
@Barney Hello! How are you today?
```

Narrator:
```vnscript
@none The sun was setting over the city.
```

With delay:
```vnscript
@Barney text_delay 2 I have something important to say.
```

Thought bubble:
```vnscript
@Amy bubble think I wonder what he's thinking...
```

Custom name tag:
```vnscript
@none nameTag Mysterious_Voice Who's there?
```

Change emotion inline:
```vnscript
@Barney emo EMO_ANGRY This is unacceptable!
```

Multiple properties:
```vnscript
@Amy anim ANIM_GIGGLE emo EMO_HAPPY bubble_offset_y 50 That's hilarious!
```

**Notes:**
- Character must be defined with `CHARACTERS.` first
- Empty text is valid: `@Barney` (shows character with no dialogue)
- Properties before text apply to this scene only
- Inline property changes persist for subsequent dialogues

---

### SETCHAR.

Changes character properties without dialogue.

**Syntax:**
```vnscript
SETCHAR. @CharName [properties]
```

**Properties:**
Same as `@CharName` dialogue properties (anim, emo, faceTo, etc.)

**Examples:**

Change animation:
```vnscript
SETCHAR. @Barney anim ANIM_SIT faceTo left
```

Change emotion:
```vnscript
SETCHAR. @Amy emo EMO_SURPRISED
```

Multiple changes:
```vnscript
SETCHAR. @Barney anim ANIM_ANGRY emo EMO_ANGRY tint #FF0000
```

**Notes:**
- Use when you need to change character state without dialogue
- Changes persist for subsequent scenes
- More efficient than re-declaring with `CHARACTERS.`

---

### WALK_IN.

Animates character walking into the scene.

**Syntax:**
```vnscript
WALK_IN. @CharName [from <direction>] [to <position>] [properties]
```

**Parameters:**
- `from` - Entry direction: `left`, `right`
- `to` - Final position: `left`, `center`, `right`

**Properties:**
- `anim` / `anim_after` / `animAfter` - Animation after walk completes
- `anim_during` / `animDuring` - Animation during walk (default: `ANIM_WALK`)
- `type` - Custom walk animation type
- `emo` / `emo_after` / `emoAfter` - Emotion after walk
- `emo_during` / `emoDuring` - Emotion during walk
- `faceTo` / `faceTo_after` / `faceToAfter` - Face direction after walk
- `faceTo_during` / `faceToDuring` - Face direction during walk
- `time` - Walk duration (seconds)
- `speed` - Walk speed multiplier
- `handheld` - Object held during walk
- `shadow` - Enable shadow
- `tint` - Color tint
- `outfit` - Outfit to wear
- `rear` - Use rear-facing sprite variant

**Examples:**

Simple walk in:
```vnscript
WALK_IN. @Barney from left to center
```

With custom animation:
```vnscript
WALK_IN. @Amy from right to center anim ANIM_IDLE emo EMO_HAPPY
```

Multiple characters:
```vnscript
WALK_IN. @Amy from left to left ; @Barney from right to right
```

Custom timing:
```vnscript
WALK_IN. @Barney from left to center time 2 speed 1.5
```

**Notes:**
- Character is added to scene after walk completes
- Default walk animation: `ANIM_WALK`
- Use `anim` to set animation after walk
- Use `anim_during` to override walk animation

---

### WALK_OUT.

Animates character walking out of the scene.

**Syntax:**
```vnscript
WALK_OUT. @CharName [from <position>] [properties]
```

**Parameters:**
- `from` - Exit direction: `left`, `right`, `center`

**Properties:**
Same as `WALK_IN.` properties

**Examples:**

Simple walk out:
```vnscript
WALK_OUT. @Barney from center
```

With speed:
```vnscript
WALK_OUT. @Amy from left speed 2
```

Multiple characters:
```vnscript
WALK_OUT. @Amy from left ; @Barney from right
```

**Notes:**
- Character is removed from scene after walk completes
- Use empty scene after to clear character data

---

### FADE_IN.

Fades character into the scene.

**Syntax:**
```vnscript
FADE_IN. @CharName [properties]
```

**Properties:**
Same as `WALK_IN.` but no directional movement

**Examples:**

```vnscript
FADE_IN. @Barney position center
```

---

### FADE_OUT.

Fades character out of the scene.

**Syntax:**
```vnscript
FADE_OUT. @CharName [properties]
```

**Examples:**

```vnscript
FADE_OUT. @Barney
```

---

### RUN_IN. / STUMBLE_IN.

Fast character entry animations.

**Syntax:**
```vnscript
RUN_IN. @CharName [properties]
STUMBLE_IN. @CharName [properties]
```

**Properties:**
Same as `WALK_IN.`

**Examples:**

```vnscript
RUN_IN. @Amy from right to center
STUMBLE_IN. @Barney from left to center
```

**Notes:**
- `RUN_IN.` uses "run" animation variant
- `STUMBLE_IN.` uses "stumble" animation variant
- Faster than `WALK_IN.`

---

### RUN_OUT. / STUMBLE_OUT.

Fast character exit animations.

**Syntax:**
```vnscript
RUN_OUT. @CharName [properties]
STUMBLE_OUT. @CharName [properties]
```

**Examples:**

```vnscript
RUN_OUT. @Amy from center
```

---

## Animation & Effects

### ANIMEFFECT.

Applies visual effects to the scene.

**Syntax:**
```vnscript
ANIMEFFECT. <effect_type> [properties]
```

**Effect Types:**

| Type | Description |
|------|-------------|
| `trans0` | Fade to color (screen transition out) |
| `trans1` | Fade from color (screen transition in) |
| `flashback` | Flashback overlay start |
| `flashback_end` / `flashbackEnd` | Flashback overlay end |
| `zoom_in` / `zoomIn` | Zoom camera to character |
| `zoom_out` / `zoomOut` | Reset camera zoom |
| `zoom_pan` / `zoomPan` | Camera zoom and pan |
| `pan` | Camera pan |
| `freeze_frame` / `freezeFrame` | Freeze frame with character portrait |
| `heartbeat` | Heartbeat screen effect |
| `pulse` | Pulse screen effect |
| `hover` | Hover screen effect |
| `love_gender` / `loveGender` | Gender selection UI |
| `love_gender_end` / `loveGenderEnd` | End gender selection |
| `input_name` / `inputName` | Player name input |
| `dress_up` / `dressUp` | Dress-up UI |
| `text_chat` / `textChat` | Text chat UI |

---

#### trans0 / trans1

Screen transitions (fade out/in).

**Syntax:**
```vnscript
ANIMEFFECT. trans0 [color #hexcode] [animStart instant]
ANIMEFFECT. trans1 color #hexcode
```

**Properties:**
- `color` - Transition color (default: `#000000`)
- `animStart` - Start mode: `instant` (no delay)

**Examples:**

Fade to black:
```vnscript
ANIMEFFECT. trans0
```

Instant fade to black:
```vnscript
ANIMEFFECT. trans0 animStart instant
```

Fade to white:
```vnscript
ANIMEFFECT. trans0 color #FFFFFF
```

Fade from white:
```vnscript
ANIMEFFECT. trans1 color #FFFFFF
```

**Notes:**
- `trans0` fades OUT (to color)
- `trans1` fades IN (from color)
- Often used in pairs for scene transitions
- Clears all objects, particles, and persistent effects

---

#### zoom_in / zoomIn

Zoom camera to specific character.

**Syntax:**
```vnscript
ANIMEFFECT. zoom_in @CharName
```

**Examples:**

```vnscript
ANIMEFFECT. zoom_in @Barney
```

**Notes:**
- Focuses camera on character's face
- Zoom persists until `zoom_out` or `zoom_pan`

---

#### zoom_out / zoomOut

Reset camera zoom to normal.

**Syntax:**
```vnscript
ANIMEFFECT. zoom_out [textDelay <seconds>]
```

**Examples:**

```vnscript
ANIMEFFECT. zoom_out
```

With delay:
```vnscript
ANIMEFFECT. zoom_out textDelay 0.5
```

---

#### zoom_pan / zoomPan

Advanced camera control.

**Syntax:**
```vnscript
ANIMEFFECT. zoom_pan [scale <number>] [posX <x>] [posY <y>] [moveX <offset>] [moveY <offset>] [time <seconds>] [easing <function>] [textDelay <seconds>]
```

**Properties:**
- `scale` - Zoom level (1.0 = normal, 2.0 = 2x zoom)
- `posX` - Camera focus X position (pixels)
- `posY` - Camera focus Y position (pixels)
- `moveX` - Additional X offset (pixels)
- `moveY` - Additional Y offset (pixels)
- `time` - Animation duration (seconds, 0 = instant)
- `easing` - Easing function (e.g., `Quadratic.EaseIn`)
- `textDelay` - Delay before next scene (seconds)

**Examples:**

Zoom to 1.5x:
```vnscript
ANIMEFFECT. zoom_pan scale 1.5 time 1
```

Zoom and focus:
```vnscript
ANIMEFFECT. zoom_pan scale 2 posX 500 posY 900 time 0.5 easing Quadratic.EaseIn
```

Pan camera right:
```vnscript
ANIMEFFECT. zoom_pan moveX 400 time 1
```

Complex camera move:
```vnscript
ANIMEFFECT. zoom_pan scale 1.5 posX 500 posY 900 moveX 120 moveY 0 time 0.5 easing Quadratic.EaseIn textDelay 0.5
```

Reset to normal (instant):
```vnscript
ANIMEFFECT. zoom_pan scale 1 moveX 0 moveY 0 time 0
```

**Notes:**
- Camera settings persist across scenes
- Use `time 0` for instant changes
- Combine with `textDelay` to pause before dialogue

---

#### pan

Simple camera pan.

**Syntax:**
```vnscript
ANIMEFFECT. pan panEnd <direction> [time <seconds>]
```

**Properties:**
- `panEnd` - Direction: `left`, `center`, `right`
- `time` - Duration (seconds)

**Examples:**

```vnscript
ANIMEFFECT. pan panEnd left
ANIMEFFECT. pan panEnd center time 1
```

---

#### freeze_frame / freezeFrame

Display character portrait with freeze frame effect.

**Syntax:**
```vnscript
ANIMEFFECT. freeze_frame type <frame_type> @CharName [bg <background>] [anim <anim>] [emo <emotion>] [faceTo <direction>] [handheld <object>] [timeAlive <seconds>] [sfxStart <sound>] [sfxText <sound>] character description text
```

**Properties:**
- `type` - Frame style: `1`, `2`, `3`, etc.
- `@CharName` - Character to feature
- `bg` - Background color/image
- `anim` - Character animation
- `emo` - Character emotion
- `faceTo` - Facing direction
- `handheld` - Held object
- `timeAlive` - Display duration (seconds)
- `sfxStart` - Sound when frame appears
- `sfxText` - Sound for text display

**Examples:**

```vnscript
ANIMEFFECT. freeze_frame type 3 @Barney bg #000000 anim ANIM_IDLE emo EMO_NEUTRAL faceTo left Barney, Love Interest
```

**Notes:**
- Often used for character introductions
- Freezes gameplay momentarily
- Can include character description text

---

#### heartbeat / pulse / hover

Screen shake/pulse effects.

**Syntax:**
```vnscript
ANIMEFFECT. heartbeat [time <seconds>]
ANIMEFFECT. heartbeat remove
```

**Properties:**
- `time` - Duration in seconds (`-1` = infinite)
- `remove` - Stop the effect

**Examples:**

Temporary heartbeat:
```vnscript
ANIMEFFECT. heartbeat time 3
```

Continuous pulse:
```vnscript
ANIMEFFECT. pulse time -1
```

Remove effect:
```vnscript
ANIMEFFECT. heartbeat remove
```

**Notes:**
- `heartbeat` - Rhythmic zoom pulse
- `pulse` - Continuous pulsing
- `hover` - Gentle floating motion
- Use `time -1` for persistent effects
- Remove before transitions

---

#### flashback / flashback_end

Flashback sequence markers.

**Syntax:**
```vnscript
ANIMEFFECT. flashback [color #hexcode]
ANIMEFFECT. flashback_end
```

**Examples:**

Start flashback:
```vnscript
ANIMEFFECT. flashback #FFFFFF
```

End flashback:
```vnscript
ANIMEFFECT. flashback_end
```

**Notes:**
- Applies visual filter to indicate flashback
- Usually combined with `OVERLAY. flashback`
- Remember to end flashback sequences

---

#### love_gender / loveGender

Gender selection for player.

**Syntax:**
```vnscript
ANIMEFFECT. love_gender
[dialogue options appear here]
ANIMEFFECT. love_gender_end
```

**Examples:**

```vnscript
@Amy I prefer to date
ANIMEFFECT. love_gender
@none Men
@none Women
ANIMEFFECT. love_gender_end
```

**Notes:**
- Special UI for gender/romance preference selection
- Auto-creates choice options from subsequent `@none` lines
- End with `love_gender_end` / `loveGenderEnd`

---

#### input_name / inputName

Player name input UI.

**Syntax:**
```vnscript
ANIMEFFECT. input_name
```

**Examples:**

```vnscript
@none What is your name?
ANIMEFFECT. input_name
@none Nice to meet you, {player_name}!
```

**Notes:**
- Shows text input dialog
- Stores result in `{player_name}` variable
- Can be used in dialogue with `{player_name}` placeholder

---

#### dress_up / dressUp

Dress-up character customization UI.

**Syntax:**
```vnscript
ANIMEFFECT. dress_up
```

**Notes:**
- Integrated with `DRESSUP.` command (see UI Elements)
- Shows outfit selection interface

---

#### text_chat / textChat

Text message conversation UI.

**Syntax:**
```vnscript
ANIMEFFECT. text_chat <chat_id>
```

**Examples:**

```vnscript
ANIMEFFECT. text_chat CHAPTER1_ID1
```

**Notes:**
- Displays phone/messaging interface
- Chat content defined separately

---

## Object & Particle System

### OBJECT.

Places and animates objects/props in scenes.

**Syntax:**
```vnscript
OBJECT. <objectID> <source> [from {position}] [to {position}] [properties]
```

**Parameters:**
- `objectID` - Unique identifier for this object instance
- `source` - Asset filename (without extension)

**Position Object:**
```javascript
{ x:<pixels>, y:<pixels> [, angle:<degrees>] [, scaleX:<number>] [, scaleY:<number>] }
```

**Properties:**
- `from` - Starting position (required)
- `to` - Ending position (for animation)
- `time` - Animation duration (seconds, required if `to` is set)
- `easing` - Easing function (e.g., `Bounce.EaseOut`, `Linear.None`)
- `zIndex` - Layer depth (higher = in front)
- `pivotX` - Pivot point X (0-1, default 0.5)
- `pivotY` - Pivot point Y (0-1, default 0.5)
- `flipX` - Flip horizontally: `true` / `false`
- `flipY` - Flip vertically: `true` / `false`
- `tint` - Color tint (hex)
- `remove` - Remove after animation: `true` / `false`
- `persist` - Keep across scenes: `true` / `false`
- `delay` - Start delay (seconds)
- `loop` - Loop animation: `true` / `false` / `reverse`
- `chain` - Chain to another object animation
- `textDelay` - Delay before next dialogue

**Examples:**

Static object:
```vnscript
OBJECT. desk desk_front from { x:550, y:1700 } zIndex 1
```

Animated object:
```vnscript
OBJECT. ball basketball from { x:0, y:0 } to { x:0, y:400 } time 1 easing Bounce.EaseOut
```

Persistent object:
```vnscript
OBJECT. desk desk_rear from { x:450, y:1720 } pivotX 0.5 pivotY 1 zIndex -1 persist true
```

Rotating object:
```vnscript
OBJECT. key key_sprite from { x:960, y:540, angle:0 } to { x:960, y:540, angle:360 } time 2 easing Linear.None
```

Scaled object:
```vnscript
OBJECT. logo company_logo from { x:100, y:100, scaleX:0.5, scaleY:0.5 } to { x:100, y:100, scaleX:1, scaleY:1 } time 1
```

Flipped object:
```vnscript
OBJECT. cat cat_sprite from { x:100, y:500 } flipX true
```

Remove after animation:
```vnscript
OBJECT. coin coin_sprite from { x:500, y:0 } to { x:500, y:800 } time 1 remove true
```

Looping animation:
```vnscript
OBJECT. bird bird_sprite from { x:0, y:300 } to { x:1920, y:300 } time 10 loop true
```

Complex movement:
```vnscript
OBJECT. envelope letter from { x:200, y:1500 } to { x:800, y:1500 } time 2 easing Quadratic.EaseOut zIndex 5 delay 0.5
```

**Notes:**
- Objects removed on scene transition unless `persist true`
- Use `zIndex` to control layering (-10 to 100+)
- `persist false` explicitly removes persistent object
- Asset automatically added to `customload.js`
- Objects can be referenced by `objectID` for updates

**Update Existing Object:**
```vnscript
// First declaration
OBJECT. ball basketball from { x:100, y:200 } persist true

// Later, update position (inherits previous position as new "from")
OBJECT. ball basketball to { x:300, y:400 } time 1
```

---

### PARTICLE.

Creates particle effects (rain, snow, etc.).

**Syntax:**
```vnscript
PARTICLE. type <particle_type> [color <hex>] [quantity <number>] [zIndex <number>] [persist <true/false>]
```

**Particle Types:**
- `rain` - Falling rain
- `snow` - Falling snow
- `meteor` - Meteor shower
- `matrix` - Matrix-style falling code
- `fireworks` - Fireworks display

**Properties:**
- `type` - Particle effect type (required)
- `color` - Particle color (hex) or array for fireworks
- `quantity` - Number of particles
- `zIndex` - Layer depth
- `persist` - Keep across scenes: `true` / `false`

**Examples:**

Rain effect:
```vnscript
PARTICLE. type rain color #4444FF quantity 100
```

Snow effect:
```vnscript
PARTICLE. type snow color #FFFFFF quantity 50 zIndex 100
```

Fireworks (multiple colors):
```vnscript
PARTICLE. type fireworks color ["#FF0000", "#00FF00", "#0000FF"] quantity 20
```

Persistent particle effect:
```vnscript
PARTICLE. type matrix color #00FF00 persist true
```

Remove particles:
```vnscript
PARTICLE. persist false
```

**Notes:**
- Particles layer according to `zIndex`
- Remove with `persist false`
- Performance impact with high `quantity`

---

### BACKGROUND_PARTICLE.

Alternative syntax for `PARTICLE.`

**Syntax:**
```vnscript
BACKGROUND_PARTICLE. [same properties as PARTICLE.]
```

---

### SINGLE_PARTICLE.

Creates individual positioned particle emitters.

**Syntax:**
```vnscript
SINGLE_PARTICLE. <particleID> <type> posX <x> posY <y> [properties]
```

**Parameters:**
- `particleID` - Unique identifier
- `type` - Particle type (smoke, fire, etc.)
- `posX` - X position (required)
- `posY` - Y position (required)

**Properties:**
- `persist` - Keep across scenes: `true` / `false`
- Additional type-specific properties

**Examples:**

```vnscript
SINGLE_PARTICLE. smoke1 smoke posX 500 posY 300 persist true
```

**Notes:**
- More control than `PARTICLE.`
- Positioned emitters
- Can have multiple active simultaneously

---

## Branching & Logic

### CHOICE.

Presents player with choices.

**Syntax:**
```vnscript
CHOICE.
@CharName Option 1 text
{
    // Dialogue and commands when option 1 is chosen
}
@CharName Option 2 text
{
    // Dialogue and commands when option 2 is chosen
}
```

**Option Block Syntax:**
```vnscript
@CharName Option text
{ [COST. currency amount] [REWARD. currency amount] [SET_INTEGER. var operator value] [SET_BOOLEAN. var value]
    // Dialogue for this choice
    [JUMPTO. branch_name]
}
```

**Examples:**

Simple choice:
```vnscript
CHOICE.
@Amy Will you help me?
{
    @Amy Thank you so much!
}
@Amy Maybe another time?
{
    @Amy No problem, I understand.
}
```

Choice with cost/reward:
```vnscript
CHOICE.
@Merchant Buy the sword? (100 coins)
{ COST. coins 100
    @Merchant Here you go!
}
@Merchant No thanks.
{
    @Merchant Come back anytime.
}
```

Choice with variables:
```vnscript
CHOICE.
@Amy I choose option A
{ SET_BOOLEAN. chose_a true
    @Amy Great choice!
}
@Amy I choose option B
{ SET_BOOLEAN. chose_b true
    @Amy Interesting choice!
}
```

Choice with jump:
```vnscript
CHOICE.
@Amy Go to the park
{
    @Amy Let's go!
    JUMPTO. park_scene
}
@Amy Go home
{
    @Amy I'm tired.
    JUMPTO. home_scene
}
```

**Notes:**
- All choices must end with `}`
- Choices auto-create `linkSceneID` after closing `}`
- Can have 2+ options
- Use `rv true` in choice block for special tracking (legacy feature)

---

### JUMPTO.

Jumps to a named branch.

**Syntax:**
```vnscript
JUMPTO. <branch_name>
```

**Examples:**

```vnscript
@Amy This leads to another path.
JUMPTO. alternate_path
```

**Notes:**
- Branch must be defined with `CONTINUE.`
- Jump happens immediately
- Use for non-linear storytelling

---

### CONTINUE.

Defines a branch target for `JUMPTO.`

**Syntax:**
```vnscript
CONTINUE. <branch_name>
```

**Examples:**

```vnscript
CONTINUE. alternate_path
@Amy You jumped to the alternate path!
```

**Complete Example:**
```vnscript
@Amy Choose your path
CHOICE.
@Amy Path A
{
    JUMPTO. path_a
}
@Amy Path B
{
    JUMPTO. path_b
}

CONTINUE. path_a
@Amy You chose path A
JUMPTO. merge_point

CONTINUE. path_b
@Amy You chose path B
JUMPTO. merge_point

CONTINUE. merge_point
@Amy The paths merge here
```

**Notes:**
- Branch names are case-sensitive
- Parser validates branch references
- Good for complex branching narratives

---

### SWITCH.

Multi-way conditional branching based on variable value.

**Syntax:**
```vnscript
SWITCH. <operator> <variable_name>
CASE. <value1>
CASE. <value2>
[default case without CASE.]
```

**Operators:**
- `==` - Equals
- `!=` - Not equals
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal
- `<=` - Less than or equal

**Examples:**

```vnscript
SWITCH. == player_class
CASE. warrior
@Amy You're a warrior!

CASE. mage
@Amy You're a mage!

@Amy You're something else!
```

**Notes:**
- Each `CASE.` defines a condition
- Last option (no `CASE.`) is default
- Only one branch executes
- Continues after all cases complete

---

### CHECK_BOOLEAN.

Conditional branching based on boolean variables.

**Syntax:**
```vnscript
CHECK_BOOLEAN. <var1> <true/false> [var2 <true/false>] ...
```

**Examples:**

Single variable check:
```vnscript
CHECK_BOOLEAN. has_key true
@Amy You have the key!
```

Multiple variables (AND logic):
```vnscript
CHECK_BOOLEAN. has_key true visited_castle true
@Amy You have the key AND visited the castle!
```

**Notes:**
- All conditions must be true (AND logic)
- If check fails, branch is skipped
- Use `ELSE.` for alternative path

---

### CHECK_INTEGER.

Conditional branching based on integer comparisons.

**Syntax:**
```vnscript
CHECK_INTEGER. <var1> <operator> <value1> [var2 <operator> <value2>] ...
```

**Examples:**

```vnscript
CHECK_INTEGER. player_level >= 10
@Amy You're level 10 or higher!
```

Multiple checks:
```vnscript
CHECK_INTEGER. coins >= 100 reputation >= 50
@Amy You have enough coins AND reputation!
```

---

### CHECK_VIRTUAL_CURRENCY.

Conditional branching based on currency amounts.

**Syntax:**
```vnscript
CHECK_VIRTUAL_CURRENCY. <currency> <operator> <amount>
```

**Examples:**

```vnscript
CHECK_VIRTUAL_CURRENCY. coins >= 100
@Merchant You can afford this!
```

---

### ELSE.

Default case for CHECK_* commands.

**Syntax:**
```vnscript
CHECK_BOOLEAN. flag true
@Amy Flag is true!

ELSE.
@Amy Flag is false!
```

---

## Variable Management

### SET_BOOLEAN.

Sets boolean flag variables.

**Syntax:**
```vnscript
SET_BOOLEAN. <var_name> <true/false> [var2 <true/false>] ...
```

**Examples:**

Single variable:
```vnscript
SET_BOOLEAN. quest_complete true
```

Multiple variables:
```vnscript
SET_BOOLEAN. door_unlocked true treasure_found true
```

**Notes:**
- Variables auto-added to `customload.js`
- Can set multiple in one command
- Use in choices or conditionally

---

### SET_INTEGER.

Sets or modifies integer variables.

**Syntax:**
```vnscript
SET_INTEGER. <var_name> <operator> <value> [; <var2> <operator> <value>] ...
```

**Operators:**
- `=` - Set to value
- `+=` - Add to value
- `-=` - Subtract from value

**Value can be:**
- Fixed number: `10`
- Random range: `min 5 max 10`

**Examples:**

Set value:
```vnscript
SET_INTEGER. player_score = 100
```

Increment:
```vnscript
SET_INTEGER. kills += 1
```

Decrement:
```vnscript
SET_INTEGER. health -= 10
```

Random value:
```vnscript
SET_INTEGER. random_number = min 1 max 100
```

Multiple variables:
```vnscript
SET_INTEGER. coins += 50 ; experience += 25
```

**Notes:**
- Variables auto-added to `customload.js`
- Use `;` to separate multiple operations

---

### REWARD.

Gives currency reward to player.

**Syntax:**
```vnscript
REWARD. <currency_name> <amount>
```

**Examples:**

```vnscript
REWARD. coins 100
REWARD. experience 50
```

**Notes:**
- Can be used in choices or scenes
- Currency must be defined in game settings
- Common currencies: `coins`, `gems`, `experience`, `virtualCurrency1/2/3`

---

### COST.

Deducts currency from player (usually in choices).

**Syntax:**
```vnscript
COST. <currency_name> <amount>
```

**Examples:**

In choice:
```vnscript
CHOICE.
@Merchant Buy sword?
{ COST. coins 100
    @Merchant Here's your sword!
}
```

**Notes:**
- Usually used inside `{...}` choice blocks
- Choice disabled if player doesn't have enough currency
- Use `CHECK_VIRTUAL_CURRENCY` to check before showing choice

---

## UI Elements

### PROGRESS_BAR.

Updates or displays progress bars (HP, MP, etc.).

**Syntax:**
```vnscript
PROGRESS_BAR. <progressID> [show <true/false>] [value <number>] [max <number>] [operator <=/>=/->] [text <description>]
```

**Properties:**
- `progressID` - Bar identifier (must match settings.js)
- `show` - Display the bar: `true` / `false`
- `value` - Set value
- `max` - Set maximum
- `operator` - Modify value: `=`, `+=`, `-=`
- `text` - Description text

**Examples:**

Show HP bar:
```vnscript
PROGRESS_BAR. HP show true value 80 max 100
```

Decrease HP:
```vnscript
PROGRESS_BAR. HP operator -= value 20
```

Hide bar:
```vnscript
PROGRESS_BAR. HP show false
```

With text:
```vnscript
PROGRESS_BAR. XP operator += value 50 text Gained 50 XP!
```

**Notes:**
- Progress bars must be defined in `settings.js`
- Common IDs: `HP`, `MP`, `Stamina`, `XP`
- Changes persist until modified

---

### WINDOWBOXING.

Creates letterbox/borders around screen.

**Syntax:**
```vnscript
WINDOWBOXING. <position> color <hex> thickness <pixels> [zIndex <number>] [; <position2> ...]
```

**Positions:**
- `top` - Top border
- `bottom` - Bottom border
- `left` - Left border
- `right` - Right border

**Examples:**

Letterbox (top + bottom):
```vnscript
WINDOWBOXING. top color #000000 thickness 100 ; bottom color #000000 thickness 100
```

Single border:
```vnscript
WINDOWBOXING. bottom color #222222 thickness 150 zIndex 50
```

**Notes:**
- Used for cinematic letterbox effect
- Persists until removed or changed

---

### TOASTBOX.

Displays notification toast messages.

**Syntax:**
```vnscript
TOASTBOX. [time <seconds>] [sfx <sound>] message text here
```

**Properties:**
- `time` - Display duration (seconds)
- `sfx` - Sound effect when toast appears

**Examples:**

Simple toast:
```vnscript
TOASTBOX. Achievement Unlocked!
```

With duration:
```vnscript
TOASTBOX. time 3 You found a secret!
```

With sound:
```vnscript
TOASTBOX. time 2 sfx notification New message received
```

**Notes:**
- Toast appears over gameplay
- Auto-dismisses after `time` expires
- Good for achievements, hints, notifications

---

### DRESSUP.

Adds outfit option to dress-up menu.

**Syntax:**
```vnscript
DRESSUP. <outfit_name> [COST. currency amount] [REWARD. currency amount]
```

**Examples:**

Free outfit:
```vnscript
DRESSUP. Casual
```

Paid outfit:
```vnscript
DRESSUP. Formal COST. coins 500
```

With reward:
```vnscript
DRESSUP. Special REWARD. style_points 10
```

**Complete dress-up scene:**
```vnscript
@none Which outfit should I wear?
DRESSUP. Casual
DRESSUP. Formal COST. coins 100
DRESSUP. Party COST. coins 200

@none Great choice!
```

**Notes:**
- Builds dress-up UI automatically
- Outfits added to `customload.js`
- Character changes to selected outfit
- Currently optimized for "Amy" character

---

## Advanced Settings

### SETTINGS.

Configures global or character-specific settings.

**Syntax:**
```vnscript
SETTINGS. none nameTag <name>
SETTINGS. @CharName [properties]
SETTINGS. <effect_type> [properties]
```

**Use Cases:**

#### 1. Set narrator name tag:
```vnscript
SETTINGS. none nameTag Narrator
```

Remove narrator name:
```vnscript
SETTINGS. none nameTag null
```

#### 2. Set character default properties:
```vnscript
SETTINGS. @Barney bubble_offset_y 50 text_font_size 32
```

#### 3. Set animation effect defaults:
```vnscript
SETTINGS. zoom_in scale 1.5 time 1
```

**Examples:**

```vnscript
// Narrator gets custom name
SETTINGS. none nameTag Mysterious_Voice
@none Who are you?

// Character gets larger text
SETTINGS. @Barney text_font_size 36 bubble_offset_y 60
@Barney I have something important to say!
```

**Notes:**
- Settings persist for entire script
- Character settings apply to all their dialogues
- Override per-scene with inline properties

---

### END.

Marks the end of a chapter.

**Syntax:**
```vnscript
END. [color]
```

**Parameters:**
- `color` - End screen color: `black`, `white`, `yellow`, hex code

**Examples:**

```vnscript
END. black
```

```vnscript
END. yellow
```

```vnscript
END. #FF0000
```

**Notes:**
- Should be last command in chapter
- Shows "End of Chapter" screen
- Color affects end screen appearance

---

## Text Formatting

### Inline Text Formatting

VNScript supports rich text formatting within dialogue.

**Syntax:**
```vnscript
@CharName Normal text | "property":"value" | formatted text | RESET | normal again
```

**Properties:**
- `color` - Text color (hex): `"#FF0000"`
- `format` - Text style: `"bold"`, `"italic"`, `"bold italic"`
- `animEffect` - Animation: `"shake"`, `"wave"`
- `speed` - Animation speed (number)

**Examples:**

Colored text:
```vnscript
@Barney This is | "color":"#FF0000" | red text | RESET | and normal again.
```

Bold italic:
```vnscript
@Amy This is | "format":"bold italic" | important | RESET | text.
```

Animated text:
```vnscript
@Barney | "color":"#FF3333", "format":"bold italic", "animEffect":"shake", "speed":2 | STOP! | RESET |
```

Multiple segments:
```vnscript
@Amy I like | "color":"#FF0000" | red | RESET | and | "color":"#0000FF" | blue | RESET |.
```

**Notes:**
- Use `| RESET |` to return to normal formatting
- Properties use JSON object syntax
- Multiple properties separated by commas
- `animEffect` may have limited support depending on engine version

---

### Variable Substitution

Use curly braces for variable substitution in text.

**Syntax:**
```vnscript
@CharName Text with {variable_name} placeholder
```

**Examples:**

```vnscript
@Amy Hello {player_name}, you have {coin_count} coins!
```

**Common Variables:**
- `{player_name}` - Player's name (from input_name)
- `{character_name}` - Any character name
- Custom variables from `SET_INTEGER` / `SET_BOOLEAN`

**Notes:**
- Variables must exist before use
- Undefined variables show as empty or error
- Case-sensitive

---

## Best Practices

### 1. Commenting

Use comments liberally:

```vnscript
// Section: Introduction
BACKGROUND. office center
CHARACTERS. @Barney position center

// First meeting with player
@Barney Hello! Welcome aboard.

/*
  TODO: Add more emotional variety
  TODO: Consider adding choice here
*/
```

### 2. Consistent Formatting

```vnscript
// Good - clear structure
BACKGROUND. office center
CHARACTERS. @Barney position center anim ANIM_IDLE emo EMO_NEUTRAL
@Barney Hello!

// Avoid - inconsistent spacing
BACKGROUND.office center
CHARACTERS.@Barney position center anim ANIM_IDLE emo EMO_NEUTRAL
@Barney    Hello!
```

### 3. Use GTL Comments for Testing

```vnscript
//GTL1 Test battle scene
@Barney The battle begins!

//GTL2 Test victory path
@Barney We won!
```

Generates test links for quick navigation to specific scenes.

### 4. Asset Naming

- Use descriptive names: `office_interior` not `bg1`
- Be consistent: `hd_` prefix for HD assets
- Match folder structure: `media/graphics/backgrounds/office_interior.jpg`

### 5. Character State Management

```vnscript
// Define character once
CHARACTERS. @Barney position center anim ANIM_IDLE emo EMO_NEUTRAL

// Use SETCHAR for changes
SETCHAR. @Barney emo EMO_HAPPY
@Barney I'm happy now!

// Avoid re-declaring entire character
// CHARACTERS. @Barney position center anim ANIM_IDLE emo EMO_HAPPY  // Less efficient
```

### 6. Branching Organization

```vnscript
// Clear branch structure
CHOICE.
@Amy Option A
{
    JUMPTO. branch_a
}
@Amy Option B
{
    JUMPTO. branch_b
}

// Define branches clearly
CONTINUE. branch_a
@Amy Branch A content
JUMPTO. merge

CONTINUE. branch_b
@Amy Branch B content
JUMPTO. merge

CONTINUE. merge
@Amy Merged content continues
```

### 7. Persistent Objects

```vnscript
// Set up persistent furniture once
OBJECT. desk desk_front from { x:550, y:1700 } zIndex 1 persist true
OBJECT. chair chair_front from { x:800, y:1680 } zIndex -1 persist true

// Furniture persists across scenes
@Barney Dialogue here

// Explicitly remove when changing locations
ANIMEFFECT. trans0
OBJECT. desk desk_front persist false
OBJECT. chair chair_front persist false
```

### 8. Camera Movement

```vnscript
// Zoom in for dramatic moment
ANIMEFFECT. zoom_pan scale 1.5 posX 500 posY 900 time 0.5 easing Quadratic.EaseIn
@Barney This is important!

// Reset camera
ANIMEFFECT. zoom_out
@Barney Back to normal.
```

---

## Troubleshooting

### Common Errors

#### 1. "Asset not found"

**Problem:**
```vnscript
BACKGROUND. office_bg center
// Error: Asset office_bg.jpg not found
```

**Solution:**
- Check asset exists in `media/graphics/backgrounds/`
- Verify filename matches exactly (case-sensitive)
- Check file extension (JPG vs PNG)

---

#### 2. Character not appearing

**Problem:**
```vnscript
@Barney Hello!
// Character doesn't show
```

**Solution:**
```vnscript
// Must define character first
CHARACTERS. @Barney position center
@Barney Hello!
```

---

#### 3. Choice not showing

**Problem:**
```vnscript
CHOICE.
@Amy Option 1
// Missing opening brace
    @Amy Response
}
```

**Solution:**
```vnscript
CHOICE.
@Amy Option 1
{
    @Amy Response
}
```

---

#### 4. Object position wrong

**Problem:**
```vnscript
OBJECT. ball ball from { x:100 y:200 }
// Syntax error
```

**Solution:**
```vnscript
// Use commas in object syntax
OBJECT. ball ball from { x:100, y:200 }
```

---

#### 5. Variables not working

**Problem:**
```vnscript
CHECK_BOOLEAN. flag true
// Always fails
```

**Solution:**
```vnscript
// Set variable first
SET_BOOLEAN. flag true

// Then check it
CHECK_BOOLEAN. flag true
```

---

### Parser Warnings

```bash
# Line number errors
chapter1.en.vnscript:45 - Missing required parameter

# Asset warnings
Asset not found: bg_office.jpg

# Branch warnings
Branch "unknown_branch" not found
```

---

## Quick Reference

### Essential Commands

```vnscript
// Scene Setup
BACKGROUND. <name> [position]
CHARACTERS. @Name [properties]
BGM. <music>
SFX. <sound>

// Dialogue
@CharName text here
@none narrator text

// Character Movement
WALK_IN. @Name from <dir> to <pos>
WALK_OUT. @Name from <pos>
SETCHAR. @Name [properties]

// Effects
ANIMEFFECT. trans0 [color #hex]
ANIMEFFECT. trans1 color #hex
ANIMEFFECT. zoom_in @Name
ANIMEFFECT. zoom_out

// Objects
OBJECT. id source from {x,y} [to {x,y}] [time N]

// Choices
CHOICE.
@Name option 1
{
    dialogue
}
@Name option 2
{
    dialogue
}

// Branching
JUMPTO. branch_name
CONTINUE. branch_name

// Variables
SET_BOOLEAN. var true
SET_INTEGER. var = value
REWARD. currency amount

// End
END. black
```

---

### Property Reference

**Character Properties:**
- `position`: left, center, right
- `anim`: ANIM_IDLE, ANIM_TALK, ANIM_WALK
- `emo`: EMO_NEUTRAL, EMO_HAPPY, EMO_ANGRY
- `faceTo`: left, right
- `handheld`: asset_name
- `shadow`: true, false
- `tint`: #hexcode
- `scale`: number

**Dialogue Properties:**
- `text_delay`: seconds
- `bubble`: normal, think, none
- `bubble_offset_y`: pixels
- `text_font_size`: pixels
- `nameTag`: display_name

---

## Conclusion

This reference covers all VNScript commands and syntax. For:

- **Compiled format details**: See `CHAPTER_FILE_SCHEMA.md`
- **Example scripts**: See `media/text/scripts/`
- **Engine documentation**: See visual-novel-engine README files
- **Issue reporting**: Create issue in repository

---

**Version:** 1.0 (Draft)
**Parser Version:** 1.0.65
**Last Updated:** 2025-11-08
**Status:** Work in Progress - Under Review

**Contributors:**
- Claude AI Assistant (Documentation Author)
- [Project Team - To be added]

**License:** [To be determined]
