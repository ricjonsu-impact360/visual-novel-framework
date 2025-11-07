# Visual Novel Script Editor - Complete Documentation

**Version:** 1.0.65
**Last Updated:** 2025-11-07
**Parser Size:** 2,348 lines
**Location:** `visual-novel-script-editor/`

---

## Table of Contents

1. [Introduction](#introduction)
2. [VNScript DSL Overview](#vnscript-dsl-overview)
3. [Parser Architecture](#parser-architecture)
4. [Command Reference](#command-reference)
5. [Scene Setup Commands](#scene-setup-commands)
6. [Character Commands](#character-commands)
7. [Dialogue Commands](#dialogue-commands)
8. [Object and Effect Commands](#object-and-effect-commands)
9. [Audio Commands](#audio-commands)
10. [Branching and Logic Commands](#branching-and-logic-commands)
11. [Special Commands](#special-commands)
12. [Sublime Text Plugin](#sublime-text-plugin)
13. [Translation System](#translation-system)
14. [Best Practices](#best-practices)

---

## Introduction

The Visual Novel Script Editor provides tools for creating visual novel scripts using a human-readable DSL (Domain-Specific Language) called **VNScript**. Scripts written in `.vnscript` format are automatically compiled into JavaScript objects (`.en.js` files) that the game engine can execute.

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Parser** | `script-converter/script-editor.js` | Converts `.vnscript` to `.en.js` |
| **Web UI** | `script-converter/script-editor.html` | Browser-based script editor |
| **Export Tool** | `script-converter/script-export.js` | File export and management |
| **Sublime Plugin** | `code-completion-plugin/script-completion.py` | Code completion in Sublime Text |
| **Syntax File** | `code-completion-plugin/script.sublime-syntax` | Syntax highlighting |
| **Translator** | `script-converter/chatgpt-translate.js` | AI-powered translation |
| **Preview Tool** | `script-converter/character-preview.js` | Character testing |

### Workflow

```
1. Write .vnscript file
   ↓
2. Run parser (script-editor.js)
   ↓
3. Generate .en.js file
   ↓
4. Update customload.js
   ↓
5. Test in engine
```

---

## VNScript DSL Overview

### What is VNScript?

VNScript is a custom domain-specific language designed specifically for writing visual novel scripts. It provides a simple, human-readable syntax that non-programmers can use to create complex interactive stories.

### Basic Syntax Rules

```
COMMAND. parameters
@CHARACTER_NAME properties dialogue text
```

**Key Rules:**
1. Commands are UPPERCASE followed by a period (`.`)
2. Character dialogue uses `@CHARACTER_NAME` prefix
3. Properties are space-separated key-value pairs
4. Multiple characters on one line use semicolon (`;`) separator
5. Comments use `//` (JavaScript style)
6. Blank lines are ignored

### Example Script

```vnscript
// Scene 1: Office Morning
BACKGROUND. office center

CHARACTERS. @AMY position center anim ANIM_IDLE

@AMY emo EMO_HAPPY Good morning!

@JACK anim ANIM_WAVE emo EMO_HAPPY Morning Amy! Ready for the meeting?

CHOICE. Yes, let's go! { JUMPTO. meeting_scene } ; Not yet... { JUMPTO. delay_scene }
```

**Compiles to:**

```javascript
_LANG["en"]["Chapter1"] = [
  {
    sceneID: 0,
    charTalk: "none",
    text: "",
    bg: {name: "office", pos: "center"}
  },
  {
    sceneID: 1,
    charTalk: "none",
    text: "",
    char: [{name: "Amy", position: "center", anim: "ANIM_IDLE"}]
  },
  {
    sceneID: 2,
    charTalk: "Amy",
    text: "Good morning!",
    char: [{name: "Amy", position: "center", anim: "ANIM_IDLE", emotion: "EMO_HAPPY"}]
  },
  {
    sceneID: 3,
    charTalk: "Jack",
    text: "Morning Amy! Ready for the meeting?",
    char: [
      {name: "Amy", position: "center", anim: "ANIM_IDLE", emotion: "EMO_HAPPY"},
      {name: "Jack", position: "right", anim: "ANIM_WAVE", emotion: "EMO_HAPPY"}
    ]
  },
  {
    sceneID: 4,
    charTalk: "none",
    text: "",
    option: [
      {sceneID: 100, text: "Yes, let's go!"},
      {sceneID: 200, text: "Not yet..."}
    ]
  }
];
```

---

## Parser Architecture

### Parser Structure

**File:** `script-converter/script-editor.js` (2,348 lines)

The parser is a **state machine** that processes `.vnscript` files line by line, building scene objects incrementally.

### Core Components

```javascript
// Main conversion API
var convertFiles = {
    processScript: function(inputPath, outputPath) { },
    parseVNScript: function(scriptText) { },
    compileToJS: function(sceneArray, chapterName, language) { }
};
```

### State Variables

The parser maintains state across scenes:

| Variable | Type | Purpose |
|----------|------|---------|
| `currentBG` | Object | Current background (persists) |
| `currentBGM` | Object | Current music (persists) |
| `currentCharacters` | Array | Character states (position, anim, emotion) |
| `currentOverlay` | Object | Overlay state |
| `currentObjects` | Array | Scene objects |
| `sceneCounter` | Number | Auto-incrementing scene ID |
| `labelMap` | Object | JUMPTO/CONTINUE label references |
| `assetList` | Object | Tracks used assets |

### Parsing Flow

```
1. Read .vnscript file
   ↓
2. Split into lines
   ↓
3. For each line:
   │
   ├─ Is it a command? (UPPERCASE.)
   │  ├─ Parse command name
   │  ├─ Extract parameters
   │  ├─ Update parser state
   │  └─ Build scene object
   │
   ├─ Is it dialogue? (@CHARACTER)
   │  ├─ Extract character name
   │  ├─ Parse inline properties
   │  ├─ Extract dialogue text
   │  ├─ Merge with current state
   │  └─ Create scene object
   │
   └─ Is it blank/comment?
      └─ Skip
   ↓
4. Resolve label references
   ↓
5. Generate JavaScript output
   ↓
6. Write .en.js file
```

### Scene Object Building

The parser uses **intelligent state merging**:

```javascript
// Example: Character persists across scenes
Scene 1: CHARACTERS. @AMY position center
         → char: [{name:"Amy", position:"center"}]

Scene 2: @AMY emo EMO_HAPPY Hello!
         → char: [{name:"Amy", position:"center", emotion:"EMO_HAPPY"}]
         (position carried forward from Scene 1)

Scene 3: @AMY anim ANIM_WAVE How are you?
         → char: [{name:"Amy", position:"center", emotion:"EMO_HAPPY", anim:"ANIM_WAVE"}]
         (position and emotion carried forward)
```

---

## Command Reference

### Command Categories

| Category | Commands |
|----------|----------|
| **Scene Setup** | BACKGROUND, OVERLAY, ANIMEFFECT, SETTINGS |
| **Characters** | CHARACTERS, SETCHAR, WALK_IN, WALK_OUT, RUN_IN, RUN_OUT, FADE_IN, FADE_OUT |
| **Dialogue** | @CHARACTER_NAME, @NONE, @None |
| **Objects** | OBJECT, SINGLE_PARTICLE, PARTICLE |
| **Audio** | BGM, SFX |
| **Branching** | CHOICE, SWITCH/CASE, JUMPTO, CONTINUE, LINK |
| **Logic** | CHECK_BOOLEAN, CHECK_INTEGER, SET_BOOLEAN, SET_INTEGER |
| **Monetization** | REWARD, COST, PROGRESS_BAR, DRESSUP |
| **Special** | GTL (Generated Test Link) |

**Total Commands:** 40+

---

## Scene Setup Commands

### BACKGROUND

Sets the scene background image.

**Syntax:**
```
BACKGROUND. <background_name> <position>
```

**Parameters:**
- `background_name` - Image filename (without extension)
- `position` - `left` | `center` | `right`

**Examples:**
```vnscript
BACKGROUND. office center
BACKGROUND. cafe_exterior left
BACKGROUND. park right
```

**Output:**
```javascript
{
  bg: {
    name: "office",
    pos: "center"
  }
}
```

---

### OVERLAY

Adds an overlay layer on top of the background.

**Syntax:**
```
OVERLAY. <overlay_name> <alpha>
```

**Parameters:**
- `overlay_name` - Overlay image name
- `alpha` - Opacity (0-1)

**Examples:**
```vnscript
OVERLAY. rain 0.7
OVERLAY. night_filter 0.5
OVERLAY. none 0
```

**Output:**
```javascript
{
  overlay: {
    name: "rain",
    alpha: 0.7
  }
}
```

---

### ANIMEFFECT

Applies visual effects or transitions.

**Syntax:**
```
ANIMEFFECT. <effect_type> <parameters>
```

**Effect Types:**

#### 1. Transitions (trans0, trans1, trans2)

```vnscript
ANIMEFFECT. trans1 #ffffff
ANIMEFFECT. trans1 #000000
ANIMEFFECT. trans2 #ff0000
```

**Parameters:**
- `trans0` - Cut (instant)
- `trans1` - Fade
- `trans2` - Wipe
- Color in hex format

**Properties:**
```vnscript
ANIMEFFECT. trans1 #000000 animStart instant
ANIMEFFECT. trans1 #ffffff duration 2
```

#### 2. Camera Effects (zoom_pan)

```vnscript
ANIMEFFECT. zoom_pan scale 1.5 time 2
ANIMEFFECT. zoom_pan moveX -600 time 0.25 easing Cubic.EaseIn
ANIMEFFECT. zoom_pan posX 960 posY 540 scale 1.2 time 1.5
```

**Parameters:**
- `scale` - Zoom factor (1.0 = normal)
- `moveX/moveY` - Relative movement
- `posX/posY` - Absolute position
- `time` - Duration in seconds
- `easing` - Easing function

#### 3. Screen Shake

```vnscript
ANIMEFFECT. shake intensity 10 duration 0.5
```

#### 4. Flashback Effect

```vnscript
ANIMEFFECT. flashback brightness 0.8
```

**Output:**
```javascript
{
  animEffect: {
    type: "zoom_pan",
    scale: 1.5,
    time: 2,
    easing: "Cubic.EaseIn"
  }
}
```

---

### SETTINGS

Sets meta properties for the scene.

**Syntax:**
```
SETTINGS. <character> <properties>
```

**Examples:**
```vnscript
SETTINGS. none nameTag John_Doe
SETTINGS. AMY textFontSize 36
SETTINGS. JACK bubble think
```

**Properties:**
- `nameTag` - Override displayed name
- `textFontSize` - Font size for dialogue
- `bubble` - Bubble type: `normal` | `think` | `none`
- `textDelay` - Delay before showing text

**Output:**
```javascript
{
  nameTag: "John_Doe",
  textFontSize: 36,
  bubble: "think"
}
```

---

## Character Commands

### CHARACTERS

Initializes or adds characters to the scene.

**Syntax:**
```
CHARACTERS. @CHARACTER1 properties ; @CHARACTER2 properties
```

**Properties:**

| Property | Values | Description |
|----------|--------|-------------|
| `position` | `left` \| `center` \| `right` | Character position |
| `anim` | `ANIM_*` | Animation name |
| `emo` or `emotion` | `EMO_*` | Emotion/expression |
| `faceTo` | `left` \| `right` | Direction facing |
| `shadow` | `true` \| `false` | Drop shadow |
| `zIndex` | number | Draw order |
| `outfit` | name | Outfit/theme |
| `handheld` | name | Held object |

**Examples:**
```vnscript
CHARACTERS. @AMY position center anim ANIM_IDLE

CHARACTERS. @AMY position left ; @JACK position right faceTo left

CHARACTERS. @BARNEY position center anim ANIM_SIT_TYPING_GENTLE_REAR faceTo left

CHARACTERS. @AMY position center emo EMO_HAPPY outfit casual handheld phone
```

**Output:**
```javascript
{
  char: [
    {
      name: "Amy",
      position: "center",
      anim: "ANIM_IDLE",
      emotion: "EMO_HAPPY",
      outfit: "casual",
      handheld: "phone"
    }
  ]
}
```

---

### SETCHAR

Updates properties of existing characters.

**Syntax:**
```
SETCHAR. @CHARACTER properties
```

**Examples:**
```vnscript
SETCHAR. @AMY anim ANIM_TALK
SETCHAR. @AMY emo EMO_HAPPY position right
SETCHAR. @JACK handheld sword faceTo left
```

**Note:** Updates character state for future scenes.

---

### WALK_IN

Character enters the scene with walking animation.

**Syntax:**
```
WALK_IN. @CHARACTER to <position> from <direction> [properties]
```

**Parameters:**
- `to` - Target position: `left` | `center` | `right`
- `from` - Entry direction: `left` | `right`
- `speed` - Movement speed (default: 5)
- `animAfter` - Animation after arrival
- `faceTo` - Direction to face

**Examples:**
```vnscript
WALK_IN. @AMY to center from left

WALK_IN. @JACK to right from left speed 6

WALK_IN. @BARNEY to left from left faceTo right animAfter ANIM_IDLE_REAR speed 4
```

**Output:**
```javascript
{
  char: [{
    name: "Amy",
    position: "center",
    walkIn: {
      from: "left",
      speed: 5
    }
  }]
}
```

---

### WALK_OUT

Character exits the scene.

**Syntax:**
```
WALK_OUT. @CHARACTER to <direction> [speed <speed>]
```

**Examples:**
```vnscript
WALK_OUT. @AMY to right

WALK_OUT. @JACK to left speed 8

WALK_OUT. @BARNEY to right speed 5
```

---

### RUN_IN / RUN_OUT

Similar to WALK_IN/WALK_OUT but with running animation.

**Examples:**
```vnscript
RUN_IN. @AMY to center from right speed 10

RUN_OUT. @JACK to left speed 12
```

---

### FADE_IN / FADE_OUT

Character fades in/out.

**Examples:**
```vnscript
FADE_IN. @AMY position center duration 2

FADE_OUT. @JACK duration 1.5
```

---

## Dialogue Commands

### @CHARACTER_NAME

Character dialogue.

**Syntax:**
```
@CHARACTER_NAME [properties] dialogue text here
```

**Properties (inline):**

| Property | Example | Description |
|----------|---------|-------------|
| `anim` | `anim ANIM_TALK` | Animation |
| `emo` / `emotion` | `emo EMO_HAPPY` | Emotion |
| `faceTo` | `faceTo left` | Direction |
| `handheld` | `handheld phone` | Held item |
| `bubble` | `bubble think` | Bubble type |
| `bubbleOffsetY` | `bubbleOffsetY 50` | Bubble Y offset |
| `textDelay` | `textDelay 1` | Delay before text |
| `textFontSize` | `textFontSize 32` | Font size |

**Examples:**
```vnscript
@AMY Hello there!

@AMY anim ANIM_WAVE emo EMO_HAPPY Hey! How are you?

@JACK bubble think handheld sword faceTo left Hmm, what should I do...

@BARNEY emo EMO_SAD bubbleOffsetY 50 I'm feeling down today.

@AMY anim ANIM_TALK textDelay 0.5 Let me tell you something...
```

**Output:**
```javascript
{
  sceneID: 5,
  charTalk: "Amy",
  text: "Hello there!",
  char: [{
    name: "Amy",
    // inherited properties
  }]
}
```

---

### @NONE / @None

Narrator or system text (no speaker).

**Syntax:**
```
@NONE text here
@None text here
```

**Examples:**
```vnscript
@NONE Once upon a time...

@NONE (He walks away slowly)

@None textDelay 1

@NONE The next day...
```

**Output:**
```javascript
{
  sceneID: 10,
  charTalk: "none",
  text: "Once upon a time...",
  isNarration: true
}
```

---

## Object and Effect Commands

### OBJECT

Spawns objects/props in the scene.

**Syntax:**
```
OBJECT. <id> <source> from { x:X,y:Y } [to { x:X,y:Y }] [properties]
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `from` | `{x:X,y:Y}` | Starting position |
| `to` | `{x:X,y:Y,angle:A}` | Target position (animated) |
| `time` | number | Animation duration |
| `easing` | string | Easing function |
| `zIndex` | number | Draw order (-1=behind, 1=front) |
| `pivotX` | number | Pivot X (0-1) |
| `pivotY` | number | Pivot Y (0-1) |
| `persist` | boolean | Keep in future scenes |
| `textDelay` | number | Delay before scene advances |

**Examples:**

**Static Object:**
```vnscript
OBJECT. desk desk_rear from { x:450,y:1720 } pivotX 0.5 pivotY 1 zIndex -1 persist true
```

**Animated Object:**
```vnscript
OBJECT. rock rock_small1 from { x:-300,y:1300 } to { x:-600,y:1500,angle:720 } time 0.25 zIndex -1 easing Quadratic.EaseOut persist true
```

**Tween Animation:**
```vnscript
OBJECT. phone phone_icon from { x:100,y:100 } to { x:500,y:500 } time 2 easing Cubic.EaseInOut
```

**Output:**
```javascript
{
  object: [
    {
      id: 0,
      objectID: "desk",
      source: "desk_rear",
      from: {x: 450, y: 1720},
      pivotX: 0.5,
      pivotY: 1,
      zIndex: -1,
      persist: true
    }
  ]
}
```

---

### SINGLE_PARTICLE

Spawns a single particle effect.

**Syntax:**
```
SINGLE_PARTICLE. <particle_name> <properties>
```

**Examples:**
```vnscript
SINGLE_PARTICLE. sparkle x 500 y 300 scale 2

SINGLE_PARTICLE. heart x 960 y 540 rotation 45
```

---

### PARTICLE

Spawns a particle system.

**Syntax:**
```
PARTICLE. <particle_name> <properties>
```

**Examples:**
```vnscript
PARTICLE. rain count 100 lifetime 5

PARTICLE. snow count 50 speed 2 lifetime 10
```

**Properties:**
- `count` - Number of particles
- `lifetime` - Duration in seconds
- `speed` - Movement speed
- `scale` - Size multiplier

---

## Audio Commands

### BGM

Background music control.

**Syntax:**
```
BGM. <music_name> [properties]
```

**Special Values:**
- `default` - Stop current BGM
- `none` - Stop current BGM

**Properties:**
- `fadeIn` - Fade in duration (seconds)
- `fadeOut` - Fade out duration (seconds)
- `loop` - Loop music (default: true)
- `volume` - Volume (0-1)

**Examples:**

**Play BGM:**
```vnscript
BGM. calm_morning

BGM. tense_music fadeIn 2

BGM. cafe_ambience loop true volume 0.7
```

**Stop BGM:**
```vnscript
BGM. default fadeOut 1

BGM. none
```

**Output:**
```javascript
{
  bgm: {
    name: "calm_morning",
    fadeIn: 2,
    loop: true
  }
}
```

---

### SFX

Sound effect.

**Syntax:**
```
SFX. <sound_name> [properties]
```

**Properties:**
- `delay` - Delay before playing (seconds)
- `loop` - Loop sound (default: false)
- `volume` - Volume (0-1)

**Examples:**
```vnscript
SFX. phone_ring

SFX. door_open delay 0.5

SFX. footsteps loop true

SFX. explosion volume 0.8
```

**Output:**
```javascript
{
  sfx: {
    name: "phone_ring",
    delay: 0.5,
    loop: false
  }
}
```

---

## Branching and Logic Commands

### CHOICE

Presents player with choices.

**Syntax:**
```
CHOICE. Option 1 text { JUMPTO. label } ; Option 2 text { JUMPTO. label }
```

**With Rewards/Costs:**
```
CHOICE. Option text { REWARD. affection 5 } { JUMPTO. label }
CHOICE. Option text { COST. coins 100 } { JUMPTO. label }
```

**Examples:**

**Simple Choice:**
```vnscript
CHOICE. Yes { JUMPTO. yes_path } ; No { JUMPTO. no_path }
```

**Choice with Rewards:**
```vnscript
CHOICE. Help her { REWARD. affection 10 } { JUMPTO. help_scene } ; Ignore { REWARD. affection -5 } { JUMPTO. ignore_scene }
```

**Choice with Cost:**
```vnscript
CHOICE. Buy item (100 coins) { COST. coins 100 } { JUMPTO. buy_scene } ; Don't buy { JUMPTO. continue_scene }
```

**Output:**
```javascript
{
  sceneID: 50,
  charTalk: "none",
  text: "",
  option: [
    {
      sceneID: 100,
      text: "Yes",
      reward: {affection: 10}
    },
    {
      sceneID: 200,
      text: "No",
      reward: {affection: -5}
    }
  ]
}
```

---

### JUMPTO

Creates a jump label (destination).

**Syntax:**
```
JUMPTO. label_name
```

**Example:**
```vnscript
CHOICE. Go left { JUMPTO. left_path } ; Go right { JUMPTO. right_path }

JUMPTO. left_path
@NONE You went left...
// ... left path scenes

JUMPTO. right_path
@NONE You went right...
// ... right path scenes
```

**Note:** Labels are converted to scene IDs during compilation.

---

### CONTINUE

Continues from a label.

**Syntax:**
```
CONTINUE. label_name
```

**Example:**
```vnscript
// At start of chapter 2
CONTINUE. chapter1_ending

// Now chapter 2 continues from where chapter 1 ended
```

**Use Case:** Multi-chapter continuity

---

### LINK

Links to another scene by ID.

**Syntax:**
```
LINK. <sceneID>
```

**Example:**
```vnscript
// Jump to scene 100
LINK. 100
```

**Output:**
```javascript
{
  linkSceneID: 100
}
```

---

### SWITCH/CASE

Conditional branching based on variables.

**Syntax:**
```
SWITCH. <variable_name>
CASE. <value> { JUMPTO. label }
CASE. <value> { JUMPTO. label }
DEFAULT. { JUMPTO. label }
```

**Example:**
```vnscript
SWITCH. player_choice
CASE. 1 { JUMPTO. path_a }
CASE. 2 { JUMPTO. path_b }
DEFAULT. { JUMPTO. path_default }
```

---

### CHECK_BOOLEAN

Check boolean variable.

**Syntax:**
```
CHECK_BOOLEAN. <variable> <value> { JUMPTO. label }
```

**Example:**
```vnscript
CHECK_BOOLEAN. has_key true { JUMPTO. unlock_door }
CHECK_BOOLEAN. is_night false { JUMPTO. daytime_scene }
```

**Output:**
```javascript
{
  check: {
    type: "boolean",
    variable: "has_key",
    value: true,
    sceneID: 100
  }
}
```

---

### CHECK_INTEGER

Check integer variable.

**Syntax:**
```
CHECK_INTEGER. <variable> <operator> <value> { JUMPTO. label }
```

**Operators:**
- `==` - Equal
- `!=` - Not equal
- `>` - Greater than
- `<` - Less than
- `>=` - Greater or equal
- `<=` - Less or equal

**Examples:**
```vnscript
CHECK_INTEGER. affection >= 50 { JUMPTO. good_ending }
CHECK_INTEGER. coins > 100 { JUMPTO. can_buy }
CHECK_INTEGER. health <= 0 { JUMPTO. game_over }
```

---

### SET_BOOLEAN

Set boolean variable.

**Syntax:**
```
SET_BOOLEAN. <variable> <value>
```

**Example:**
```vnscript
SET_BOOLEAN. has_key true
SET_BOOLEAN. is_day false
```

**Output:**
```javascript
{
  variable: {
    type: "boolean",
    name: "has_key",
    value: true
  }
}
```

---

### SET_INTEGER

Set integer variable.

**Syntax:**
```
SET_INTEGER. <variable> <operator> <value>
```

**Operators:**
- `=` - Set
- `+=` - Add
- `-=` - Subtract
- `*=` - Multiply
- `/=` - Divide

**Examples:**
```vnscript
SET_INTEGER. affection += 10
SET_INTEGER. coins -= 50
SET_INTEGER. health = 100
SET_INTEGER. score *= 2
```

**Output:**
```javascript
{
  variable: {
    type: "integer",
    name: "affection",
    operation: "+=",
    value: 10
  }
}
```

---

## Special Commands

### REWARD

Grant rewards to player.

**Syntax:**
```
REWARD. <currency> <amount>
```

**Examples:**
```vnscript
REWARD. coins 100
REWARD. gems 5
REWARD. affection 10
REWARD. experience 50
```

**Output:**
```javascript
{
  reward: {
    coins: 100
  }
}
```

---

### COST

Deduct cost from player.

**Syntax:**
```
COST. <currency> <amount>
```

**Examples:**
```vnscript
COST. coins 50
COST. gems 2
COST. energy 10
```

**Output:**
```javascript
{
  cost: {
    coins: 50
  }
}
```

---

### PROGRESS_BAR

Display/update progress bar.

**Syntax:**
```
PROGRESS_BAR. <bar_id> <value>
```

**Examples:**
```vnscript
PROGRESS_BAR. health 75
PROGRESS_BAR. stamina 50
PROGRESS_BAR. relationship 80
```

**Output:**
```javascript
{
  progressBar: {
    id: "health",
    value: 75
  }
}
```

---

### DRESSUP

Change character outfit/appearance.

**Syntax:**
```
DRESSUP. @CHARACTER <outfit_name>
```

**Examples:**
```vnscript
DRESSUP. @AMY casual_outfit
DRESSUP. @JACK formal_suit
DRESSUP. @BARNEY winter_clothes
```

**Output:**
```javascript
{
  dressup: {
    character: "Amy",
    outfit: "casual_outfit"
  }
}
```

---

### GTL (Generated Test Link)

Create a direct link to test a specific scene.

**Syntax:**
```
GTL. <description>
```

**Example:**
```vnscript
GTL. Test the café scene
```

**Purpose:** Development/testing tool to jump directly to scenes.

---

## Sublime Text Plugin

### Installation

**Location:** `code-completion-plugin/`

**Files:**
- `script-completion.py` - Completion logic
- `script.sublime-syntax` - Syntax highlighting
- `Monokai.sublime-color-scheme` - Color scheme

**Install:**

1. Copy files to Sublime Text packages folder:
   ```bash
   # Windows
   %APPDATA%\Sublime Text 3\Packages\VNScript\

   # macOS
   ~/Library/Application Support/Sublime Text 3/Packages/VNScript/

   # Linux
   ~/.config/sublime-text-3/Packages/VNScript/
   ```

2. Restart Sublime Text

3. Open `.vnscript` file - syntax highlighting auto-applies

### Features

**1. Auto-completion**

Type partial command and press `Tab`:

```
BG<Tab> → BACKGROUND.
CHAR<Tab> → CHARACTERS.
@<Tab> → @CHARACTER_NAME
```

**2. Snippet Completion**

Pre-defined snippets for common patterns:

| Trigger | Expansion |
|---------|-----------|
| `scene` | Complete scene template |
| `char` | Character definition |
| `choice` | Choice with two options |
| `dialog` | Character dialogue |

**3. Syntax Highlighting**

- **Commands** - Bold/colored
- **@Character** - Highlighted name
- **Strings** - Quoted text
- **Numbers** - Numeric values
- **Comments** - Grayed out

**4. Animation/Music Auto-complete**

The plugin includes completions for:
- **60+ Animations** (ANIM_IDLE, ANIM_WALK, etc.)
- **20+ Emotions** (EMO_HAPPY, EMO_SAD, etc.)
- **50+ Sound Effects**
- **20+ Background Music**
- **30+ Backgrounds**
- **Handheld Objects**

### Usage

```vnscript
// Type: ANIM
// Autocomplete shows:
ANIM_IDLE
ANIM_WALK
ANIM_TALK
ANIM_WAVE
// ... and 60+ more

// Type: EMO
// Autocomplete shows:
EMO_HAPPY
EMO_SAD
EMO_ANGRY
EMO_NEUTRAL
// ... and 20+ more
```

---

## Translation System

### AI-Powered Translation

**File:** `script-converter/chatgpt-translate.js`

Uses LM Studio SDK for local AI translation.

**Supported Languages:**
- English (en)
- Spanish (es)
- Chinese (zh/cn)
- Japanese (jp)
- Korean (kr)
- German (de)
- Russian (ru)
- Dutch (nl)

### Translation Workflow

```
1. Load chapter1.en.js (English source)
   ↓
2. Extract dialogue text
   ↓
3. Replace character names with placeholders
   ↓
4. Send to AI translation API
   ↓
5. Receive translated text
   ↓
6. Restore character names
   ↓
7. Generate chapter1.es.js, chapter1.jp.js, etc.
   ↓
8. Export to translate/ folder
```

### Usage

```bash
# Translate chapter to all languages
node chatgpt-translate.js chapter1

# Translate specific language
node chatgpt-translate.js chapter1 es

# Translate all chapters
node chatgpt-translate.js all
```

### Translation Configuration

**File:** `chatgpt-translate.js`

```javascript
const translations = {
  targetLanguages: ['es', 'zh', 'jp', 'kr', 'de', 'ru', 'nl'],
  preserveNames: true,          // Keep character names unchanged
  preserveCommands: true,        // Keep vnscript commands unchanged
  apiEndpoint: 'http://localhost:1234/v1/chat/completions'
};
```

### Output Format

```javascript
// chapter1.en.js
_LANG["en"]["Chapter1"] = [
  {sceneID: 0, charTalk: "Amy", text: "Hello!"}
];

// chapter1.es.js (Spanish)
_LANG["es"]["Chapter1"] = [
  {sceneID: 0, charTalk: "Amy", text: "¡Hola!"}
];

// chapter1.jp.js (Japanese)
_LANG["jp"]["Chapter1"] = [
  {sceneID: 0, charTalk: "Amy", text: "こんにちは！"}
];
```

---

## Best Practices

### 1. File Organization

```
media/text/
├── scripts/
│   ├── chapter1.en.vnscript     # Source files
│   ├── chapter2.en.vnscript
│   └── chapter3.en.vnscript
└── translate/
    ├── chapter1.en.js           # Compiled files
    ├── chapter1.es.js
    ├── chapter2.en.js
    └── chapter2.es.js
```

### 2. Naming Conventions

**Characters:**
- Use PascalCase: `@Amy`, `@JackDoe`
- Underscores for spaces: `@Souper_Visor`
- Consistent with `settings.js` spriterData keys

**Assets:**
- Use snake_case: `office_interior`, `cafe_exterior`
- Descriptive names: `hd_home_office1`, not `bg001`

**Labels:**
- Use snake_case: `good_ending`, `bad_path`, `chapter2_start`
- Descriptive: `help_old_lady` not `scene_a`

### 3. Scene Structure

**Start with setup:**
```vnscript
BACKGROUND. location position
CHARACTERS. @CHARACTER1 position X ; @CHARACTER2 position Y
BGM. music_name
```

**Then dialogue:**
```vnscript
@CHARACTER1 Hello!
@CHARACTER2 Hi there!
```

**End with transition:**
```vnscript
ANIMEFFECT. trans1 #000000
// Next scene
```

### 4. Character State Management

**Initialize clearly:**
```vnscript
CHARACTERS. @AMY position center anim ANIM_IDLE emo EMO_NEUTRAL
```

**Update explicitly:**
```vnscript
SETCHAR. @AMY emo EMO_HAPPY
@AMY I'm so happy!
```

**Clean exits:**
```vnscript
WALK_OUT. @AMY to right speed 5
```

### 5. Asset Tracking

**Document used assets:**
```vnscript
// Required Assets:
// - Backgrounds: office, cafe, park
// - Characters: Amy, Jack
// - Objects: desk, chair, laptop
// - SFX: phone_ring, door_open
// - BGM: calm_morning
```

**Update customload.js:**
```javascript
{
  chapterID: "Chapter1",
  bg: ["office", "cafe", "park"],
  character: ["Amy", "Jack"],
  object: ["desk", "chair", "laptop"],
  sfx: ["phone_ring", "door_open"],
  bgm: ["calm_morning"]
}
```

### 6. Branching Logic

**Use descriptive labels:**
```vnscript
CHOICE. Help her { JUMPTO. help_scene } ; Ignore her { JUMPTO. ignore_scene }

JUMPTO. help_scene
@AMY Thank you so much!
REWARD. affection 10
JUMPTO. continue_story

JUMPTO. ignore_scene
@AMY Oh...
REWARD. affection -5
JUMPTO. continue_story

JUMPTO. continue_story
@NONE The story continues...
```

### 7. Testing Workflow

1. Write scene in `.vnscript`
2. Compile to `.js`
3. Update `customload.js`
4. Test in `dev.html`
5. Fix errors
6. Iterate

**Use GTL for quick testing:**
```vnscript
GTL. Test café scene
BACKGROUND. cafe center
@AMY anim ANIM_IDLE Hello!
```

### 8. Comments and Documentation

```vnscript
// ============================================
// CHAPTER 1: The Beginning
// ============================================

// Scene 1: Office Morning
// Amy arrives at work

BACKGROUND. office center

CHARACTERS. @AMY position center anim ANIM_IDLE

@AMY emo EMO_HAPPY Good morning!

// TODO: Add Jack's response
// TODO: Add phone ringing SFX
```

### 9. Performance Tips

- **Minimize object persistence** - Only use `persist true` when necessary
- **Reuse backgrounds** - Don't change background every scene
- **Limit particles** - Too many can slow down
- **Preload assets** - Add to `customload.js` upfront

### 10. Version Control

```bash
# Commit source files
git add media/text/scripts/*.vnscript

# Commit compiled files
git add media/text/translate/*.js

# Commit asset manifest
git add media/text/customload.js

git commit -m "Add chapter 3 scenes"
```

---

## Quick Reference

### Common Commands Cheat Sheet

```vnscript
// Setup
BACKGROUND. name position
CHARACTERS. @NAME position X anim Y emo Z
BGM. music_name
SFX. sound_name

// Dialogue
@NAME dialogue text
@NONE narration text

// Update character
SETCHAR. @NAME anim X emo Y
@NAME anim X emo Y dialogue text

// Movement
WALK_IN. @NAME to position from direction
WALK_OUT. @NAME to direction speed N

// Objects
OBJECT. id source from {x:X,y:Y} zIndex Z persist true

// Effects
ANIMEFFECT. trans1 #000000
ANIMEFFECT. zoom_pan scale 1.5 time 2

// Choices
CHOICE. Option1 { JUMPTO. label1 } ; Option2 { JUMPTO. label2 }

// Labels
JUMPTO. label_name

// Variables
SET_INTEGER. variable += value
CHECK_INTEGER. variable >= value { JUMPTO. label }

// Rewards
REWARD. coins 100
COST. gems 5
```

### Property Reference

**Character Properties:**
```
position: left | center | right
anim: ANIM_*
emo/emotion: EMO_*
faceTo: left | right
shadow: true | false
zIndex: number
outfit: name
handheld: name
```

**Animation Effects:**
```
type: trans0 | trans1 | trans2 | zoom_pan | shake | flashback
color: #RRGGBB
scale: number
moveX/moveY: number
posX/posY: number
time: number
easing: EasingFunction
```

**Object Properties:**
```
from: {x:X, y:Y}
to: {x:X, y:Y, angle:A}
time: number
easing: EasingFunction
zIndex: number
pivotX/pivotY: 0-1
persist: true | false
```

---

**End of Script Editor Documentation**
