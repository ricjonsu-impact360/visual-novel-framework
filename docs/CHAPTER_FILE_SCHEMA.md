# Visual Novel Engine - Chapter File Schema Documentation

**Version:** 1.0
**Last Updated:** 2025-11-07
**Parser Version:** 1.0.65

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Scene Object Schema](#scene-object-schema)
4. [Nested Object Schemas](#nested-object-schemas)
5. [Complete Field Reference](#complete-field-reference)
6. [Examples](#examples)
7. [Asset Management](#asset-management)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### System Architecture

The visual novel engine uses a **dual-format system** for chapter scripts:

1. **Source Format**: `.vnscript` files - Human-readable script format
2. **Compiled Format**: `.en.js` files - JavaScript objects consumed by the game engine

```
┌─────────────────┐
│  .vnscript      │  Human-readable source
│  (author writes)│
└────────┬────────┘
         │
         │ script-editor.js (parser)
         ▼
┌─────────────────┐
│  .en.js         │  Compiled JavaScript
│  (engine reads) │
└────────┬────────┘
         │
         │ custom-loader.js (loader)
         ▼
┌─────────────────┐
│  game-controller│  Game runtime
│  (executes)     │
└─────────────────┘
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Parser** | `script-converter/script-editor.js` | Converts `.vnscript` to `.en.js` |
| **Loader** | `lib/plugins/custom-loader.js` | Loads chapter files and assets |
| **Controller** | `lib/game/entities/controller/game-controller.js` | Executes scenes |
| **Source Scripts** | `media/text/scripts/*.vnscript` | Human-readable scripts |
| **Compiled Scripts** | `media/text/translate/*.en.js` | Compiled JavaScript |
| **Asset Manifest** | `media/text/customload.js` | Chapter asset definitions |

---

## File Structure

### Basic Structure

Every compiled chapter file follows this structure:

```javascript
// File: media/text/translate/chapter1.en.js

_LANG["en"]["Chapter1"] = [
  {
    sceneID: 0,
    charTalk: "none",
    text: "Once upon a time...",
    // ... additional properties
  },
  {
    sceneID: 1,
    charTalk: "Hero",
    text: "Hello world!",
    // ... additional properties
  },
  // ... more scenes
];
```

### Global Structure

- `_LANG` - Global translation object
- `["en"]` - Language code (supports multiple languages)
- `["Chapter1"]` - Chapter identifier
- `[...]` - Array of scene objects

---

## Scene Object Schema

### Required Fields

Every scene object **must** contain these three fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sceneID` | `number` | Sequential scene index (starts at 0) | `0`, `1`, `2`, ... |
| `charTalk` | `string` | Name of speaking character or `"none"` for narration | `"Barney"`, `"none"` |
| `text` | `string` | Dialogue or narration text (can be empty) | `"Hello world!"`, `""` |

**Minimum valid scene:**
```javascript
{
  sceneID: 0,
  charTalk: "none",
  text: ""
}
```

### Optional Standard Fields

These fields are commonly used but not required:

#### Visual Elements

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `char` | `Array<Character>` | Array of character objects | `[]` |
| `bg` | `Background` | Background configuration | Inherits from previous |
| `object` | `Array<Object>` | Props/objects in scene | `[]` |
| `overlay` | `string` | Overlay type (`"flashback"`, `"dream"`) | None |
| `overlayType` | `string` | Overlay configuration | None |

#### Audio

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `bgm` | `BGM` | Background music | Continues current |
| `sfx` | `SFX` | Sound effect | None |

#### Effects

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `animEffect` | `AnimEffect` | Visual effects (zoom, transitions, etc.) | `{}` |
| `tweenIn` | `boolean` | Enable tween-in animation | `false` |
| `tweenOut` | `boolean` | Enable tween-out animation | `false` |

#### Text Display

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `nameTag` | `string` | Override displayed speaker name | Uses `charTalk` |
| `textFontSize` | `number` | Custom font size | Default size |
| `text_delay` | `number` | Delay before showing text (seconds) | `0` |
| `textDelay` | `number` | Alias for `text_delay` | `0` |

#### Dialogue Bubble

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `bubble` | `string` | Bubble type: `"normal"`, `"think"`, `"none"` | `"normal"` |
| `bubbleOffsetY` | `number` | Vertical offset in pixels | `0` |

#### Branching & Logic

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `option` | `Array<Option>` | Choice options for branching | None |
| `linkSceneID` | `number` | Target scene ID for jumps | None |
| `check` | `Check` | Conditional requirements | None |
| `variable` | `Variable` | Variable operations | None |

#### Monetization

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `cost` | `Cost` | Currency cost for choices | None |
| `reward` | `Reward` | Currency reward | None |
| `progressBar` | `ProgressBar` | Progress bar update | None |

---

## Nested Object Schemas

### Character Object

Used in the `char[]` array to define character appearance and state.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | `string` | ✅ **Yes** | Character name (must match asset name) | `"Barney"`, `"Amy"` |
| `position` | `string` | No | Predefined position | `"left"`, `"center"`, `"right"` |
| `posX` | `number` | No | Custom X position (overrides `position`) | `500`, `1200` |
| `posY` | `number` | No | Custom Y position | `100`, `300` |
| `anim` | `string` | No | Animation name | `"ANIM_IDLE"`, `"ANIM_TALK"` |
| `emotion` | `string` | No | Emotion/expression name | `"EMO_NEUTRAL"`, `"EMO_HAPPY"` |
| `faceTo` | `string` | No | Facing direction | `"left"`, `"right"` |
| `handheld` | `string` | No | Object held by character | `"coffee_cup"`, `"phone"` |
| `shadow` | `boolean` | No | Enable character shadow | `true`, `false` |
| `tint` | `string` | No | Color tint (hex) | `"#FF0000"`, `"#00FF00"` |
| `scale` | `number` | No | Character scale multiplier | `1.0`, `0.8`, `1.5` |
| `animSpeed` | `number` | No | Animation playback speed | `1.0`, `0.5`, `2.0` |
| `anim_delay` | `number` | No | Animation start delay (seconds) | `0.5`, `1.0` |
| `outfit` | `string` | No | Outfit identifier | `"casual"`, `"formal"` |

#### Example

```javascript
{
  sceneID: 5,
  charTalk: "Barney",
  text: "I'm feeling great today!",
  char: [
    {
      name: "Barney",
      position: "center",
      anim: "ANIM_IDLE",
      emotion: "EMO_HAPPY",
      faceTo: "right",
      scale: 1.0,
      shadow: true
    }
  ]
}
```

#### Multiple Characters

```javascript
{
  sceneID: 10,
  charTalk: "Amy",
  text: "What do you think, Barney?",
  char: [
    {
      name: "Amy",
      position: "left",
      emotion: "EMO_CURIOUS",
      faceTo: "right"
    },
    {
      name: "Barney",
      position: "right",
      emotion: "EMO_THINKING",
      faceTo: "left"
    }
  ]
}
```

### Background Object

Used in the `bg` field to define background images and behavior.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | `string` | ✅ **Yes** | Background asset name | `"hd_home_office1"`, `"park_day"` |
| `pos` | `string` | No | Background position | `"center"`, `"left"`, `"right"` |
| `type` | `string` | No | Special background type | `"scroll"` |
| `direction` | `string` | No | Scroll direction (requires `type: "scroll"`) | `"up"`, `"down"`, `"left"`, `"right"` |
| `speed` | `number` | No | Scroll speed (requires `type: "scroll"`) | `0.5`, `1.0`, `2.0` |

#### Examples

**Static Background:**
```javascript
{
  sceneID: 1,
  charTalk: "none",
  text: "The office was quiet.",
  bg: {
    name: "hd_home_office1",
    pos: "center"
  }
}
```

**Scrolling Background:**
```javascript
{
  sceneID: 15,
  charTalk: "none",
  text: "The elevator ascended slowly.",
  bg: {
    name: "elevator_interior",
    pos: "center",
    type: "scroll",
    direction: "up",
    speed: 0.5
  }
}
```

### BGM Object

Used in the `bgm` field to control background music.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | `string` | ✅ **Yes** | BGM asset filename (without extension) | `"calm_morning"`, `"tense_moment"` |
| `fadeIn` | `number` | No | Fade-in duration (seconds) | `1.0`, `2.5` |
| `fadeOut` | `number` | No | Fade-out duration (seconds) | `1.0`, `2.0` |

#### Examples

**Start Music:**
```javascript
{
  sceneID: 1,
  charTalk: "none",
  text: "A new day begins.",
  bgm: {
    name: "calm_morning",
    fadeIn: 2.0
  }
}
```

**Stop Music:**
```javascript
{
  sceneID: 50,
  charTalk: "none",
  text: "Silence fell over the room.",
  bgm: {
    name: "default",  // or "" for silence
    fadeOut: 1.5
  }
}
```

### Object Schema

Used in the `object[]` array to place props and interactive items in scenes.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | `number` | ✅ **Yes** | Unique object index | `0`, `1`, `2` |
| `objectID` | `string` | ✅ **Yes** | Object identifier (for referencing) | `"desk"`, `"coffee_mug"` |
| `source` | `string` | ✅ **Yes** | Asset filename | `"desk_rear.png"`, `"mug.png"` |
| `from` | `Position` | ✅ **Yes** | Start position `{ x, y, angle? }` | `{ x: 500, y: 300 }` |
| `to` | `Position` | No | End position for animations | `{ x: 600, y: 300 }` |
| `pivotX` | `number` | No | Pivot point X (0-1, default 0.5) | `0.5`, `0`, `1` |
| `pivotY` | `number` | No | Pivot point Y (0-1, default 0.5) | `0.5`, `0`, `1` |
| `zIndex` | `number` | No | Layer depth (higher = front) | `1`, `10`, `100` |
| `time` | `number` | No | Animation duration (seconds) | `0.5`, `1.0`, `2.0` |
| `easing` | `string` | No | Easing function | `"Quadratic.EaseOut"`, `"Linear.None"` |
| `flipX` | `boolean` | No | Flip horizontally | `true`, `false` |
| `flipY` | `boolean` | No | Flip vertically | `true`, `false` |
| `persist` | `boolean` | No | Keep object across scenes | `true`, `false` |

#### Examples

**Static Object:**
```javascript
{
  sceneID: 3,
  charTalk: "none",
  text: "A desk sat in the corner.",
  object: [
    {
      id: 0,
      objectID: "desk",
      source: "desk_rear.png",
      from: { x: 450, y: 1720 },
      zIndex: 1
    }
  ]
}
```

**Animated Object:**
```javascript
{
  sceneID: 20,
  charTalk: "none",
  text: "The phone slid across the table.",
  object: [
    {
      id: 1,
      objectID: "phone",
      source: "smartphone.png",
      from: { x: 300, y: 500 },
      to: { x: 700, y: 500 },
      time: 1.5,
      easing: "Quadratic.EaseOut",
      zIndex: 5
    }
  ]
}
```

**Rotating Object:**
```javascript
{
  sceneID: 25,
  charTalk: "none",
  text: "The key spun in midair.",
  object: [
    {
      id: 2,
      objectID: "key",
      source: "key.png",
      from: { x: 960, y: 540, angle: 0 },
      to: { x: 960, y: 540, angle: 360 },
      time: 2.0,
      easing: "Linear.None",
      pivotX: 0.5,
      pivotY: 0.5,
      zIndex: 10
    }
  ]
}
```

### AnimEffect Object

Used in the `animEffect` field for visual effects.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `type` | `string` | ✅ **Yes** | Effect type (see types below) | `"zoom_pan"`, `"trans0"`, `"heartbeat"` |

#### Effect Types

##### 1. Screen Transitions (`"trans0"`, `"trans1"`)

**Additional Fields:**
- `color` (string): Hex color code
- `animStart` (string): `"instant"` for immediate transition

**Example:**
```javascript
{
  sceneID: 30,
  charTalk: "none",
  text: "",
  animEffect: {
    type: "trans0",
    color: "#000000",
    animStart: "instant"
  }
}
```

##### 2. Camera Effects (`"zoom_pan"`)

**Additional Fields:**
- `scale` (number): Zoom level (1.0 = normal)
- `posX` (number): Camera X position
- `posY` (number): Camera Y position
- `moveX` (number): X movement offset
- `moveY` (number): Y movement offset
- `time` (number): Duration (seconds)
- `easing` (string): Easing function

**Example:**
```javascript
{
  sceneID: 35,
  charTalk: "none",
  text: "The camera zoomed in dramatically.",
  animEffect: {
    type: "zoom_pan",
    scale: 1.5,
    posX: 960,
    posY: 540,
    time: 1.0,
    easing: "Quadratic.EaseInOut"
  }
}
```

##### 3. Screen Effects (`"heartbeat"`, `"pulse"`, `"hover"`)

**Additional Fields:**
- `remove` (boolean): Remove the effect
- `time` (number): Duration in seconds (-1 for infinite)

**Example (Add Effect):**
```javascript
{
  sceneID: 40,
  charTalk: "Hero",
  text: "My heart was racing!",
  animEffect: {
    type: "heartbeat",
    time: 3.0
  }
}
```

**Example (Remove Effect):**
```javascript
{
  sceneID: 42,
  charTalk: "Hero",
  text: "I calmed down.",
  animEffect: {
    type: "heartbeat",
    remove: true
  }
}
```

### Option Object

Used in the `option[]` array for branching choices.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `sceneID` | `number` | ✅ **Yes** | Target scene ID for this choice | `50`, `100` |
| `text` | `string` | ✅ **Yes** | Option display text | `"Go left"`, `"Stay here"` |
| `cost` | `Cost` | No | Currency cost to select | `{ coins: 100 }` |
| `reward` | `Reward` | No | Currency reward for selection | `{ points: 50 }` |
| `check` | `Check` | No | Conditional requirements | See Check schema |

#### Examples

**Simple Choice:**
```javascript
{
  sceneID: 45,
  charTalk: "none",
  text: "Which path will you take?",
  option: [
    {
      sceneID: 50,
      text: "Go left"
    },
    {
      sceneID: 60,
      text: "Go right"
    }
  ]
}
```

**Choice with Cost:**
```javascript
{
  sceneID: 70,
  charTalk: "Merchant",
  text: "Would you like to buy this item?",
  option: [
    {
      sceneID: 75,
      text: "Buy it (100 coins)",
      cost: { coins: 100 }
    },
    {
      sceneID: 80,
      text: "No thanks"
    }
  ]
}
```

**Choice with Requirements:**
```javascript
{
  sceneID: 90,
  charTalk: "Guard",
  text: "You need special permission to enter.",
  option: [
    {
      sceneID: 95,
      text: "Show credentials",
      check: {
        type: "boolean",
        variable: "has_credentials",
        value: true
      }
    },
    {
      sceneID: 100,
      text: "Turn back"
    }
  ]
}
```

### SFX Object

Used in the `sfx` field for sound effects.

#### Schema

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | `string` | ✅ **Yes** | Sound effect filename (without extension) | `"door_open"`, `"footsteps"` |
| `loop` | `boolean` | No | Loop the sound | `true`, `false` |
| `delay` | `number` | No | Delay before playing (seconds) | `0.5`, `1.0` |
| `volume` | `number` | No | Volume level (0-1) | `0.5`, `1.0` |

#### Examples

```javascript
{
  sceneID: 15,
  charTalk: "none",
  text: "The door creaked open.",
  sfx: {
    name: "door_creak",
    volume: 0.8
  }
}
```

```javascript
{
  sceneID: 20,
  charTalk: "none",
  text: "The phone kept ringing.",
  sfx: {
    name: "phone_ring",
    loop: true,
    delay: 0.5
  }
}
```

### Cost/Reward Object

Used for currency transactions in choices or scenes.

#### Schema

Simple object with currency names as keys and amounts as values:

```javascript
{
  "currency_name": amount
}
```

#### Examples

```javascript
{
  cost: { coins: 50 }
}
```

```javascript
{
  reward: {
    coins: 100,
    experience: 25
  }
}
```

### Check Object

Used for conditional logic (variable checks, currency checks).

#### Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `type` | `string` | Check type: `"boolean"`, `"integer"`, `"currency"` | `"boolean"` |
| `variable` | `string` | Variable name to check | `"flag_met_barney"` |
| `operator` | `string` | Comparison operator: `"=="`, `"!="`, `">="`, `"<="`, `">"`, `"<"` | `">="` |
| `value` | `any` | Value to compare against | `true`, `5`, `100` |

#### Examples

**Boolean Check:**
```javascript
{
  check: {
    type: "boolean",
    variable: "has_key",
    operator: "==",
    value: true
  }
}
```

**Integer Check:**
```javascript
{
  check: {
    type: "integer",
    variable: "relationship_points",
    operator: ">=",
    value: 50
  }
}
```

**Currency Check:**
```javascript
{
  check: {
    type: "currency",
    variable: "coins",
    operator: ">=",
    value: 100
  }
}
```

### Variable Object

Used to set or modify variables.

#### Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `type` | `string` | Variable type: `"boolean"`, `"integer"` | `"boolean"` |
| `name` | `string` | Variable name | `"flag_completed_quest"` |
| `operator` | `string` | Operation: `"="`, `"+="`, `"-="` | `"="` |
| `value` | `any` | Value to set/add/subtract | `true`, `5`, `-10` |

#### Examples

**Set Boolean:**
```javascript
{
  sceneID: 100,
  charTalk: "none",
  text: "Quest completed!",
  variable: {
    type: "boolean",
    name: "quest_1_complete",
    operator: "=",
    value: true
  }
}
```

**Increment Integer:**
```javascript
{
  sceneID: 105,
  charTalk: "none",
  text: "Relationship improved!",
  variable: {
    type: "integer",
    name: "amy_affection",
    operator: "+=",
    value: 10
  }
}
```

### ProgressBar Object

Used to update progress bars (HP, MP, etc.).

#### Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | `string` | Progress bar name (defined in settings.js) | `"HP"`, `"MP"`, `"Stamina"` |
| `operator` | `string` | Operation: `"="`, `"+="`, `"-="` | `"+="` |
| `value` | `number` | Amount to set/add/subtract | `10`, `-5` |

#### Examples

```javascript
{
  sceneID: 110,
  charTalk: "none",
  text: "You took damage!",
  progressBar: {
    name: "HP",
    operator: "-=",
    value: 20
  }
}
```

```javascript
{
  sceneID: 115,
  charTalk: "none",
  text: "You feel refreshed!",
  progressBar: {
    name: "HP",
    operator: "+=",
    value: 50
  }
}
```

---

## Complete Field Reference

### Scene Object - All Fields

```typescript
interface Scene {
  // ===== REQUIRED =====
  sceneID: number;              // Scene index
  charTalk: string;             // Speaker name or "none"
  text: string;                 // Dialogue text

  // ===== VISUAL ELEMENTS =====
  char?: Character[];           // Characters in scene
  bg?: Background;              // Background
  object?: SceneObject[];       // Props/objects
  overlay?: string;             // Overlay type
  overlayType?: string;         // Overlay config

  // ===== AUDIO =====
  bgm?: BGM;                    // Background music
  sfx?: SFX;                    // Sound effect

  // ===== EFFECTS =====
  animEffect?: AnimEffect;      // Visual effects
  tweenIn?: boolean;            // Tween-in animation
  tweenOut?: boolean;           // Tween-out animation

  // ===== TEXT DISPLAY =====
  nameTag?: string;             // Override speaker name
  textFontSize?: number;        // Custom font size
  text_delay?: number;          // Text delay (seconds)
  textDelay?: number;           // Alias for text_delay
  bubble?: string;              // Bubble type
  bubbleOffsetY?: number;       // Bubble Y offset

  // ===== BRANCHING & LOGIC =====
  option?: Option[];            // Choice options
  linkSceneID?: number;         // Jump target
  check?: Check;                // Conditional check
  variable?: Variable;          // Variable operation

  // ===== MONETIZATION =====
  cost?: Cost;                  // Currency cost
  reward?: Reward;              // Currency reward
  progressBar?: ProgressBar;    // Progress bar update
}

interface Character {
  name: string;                 // REQUIRED
  position?: string;            // "left" | "center" | "right"
  posX?: number;                // Custom X position
  posY?: number;                // Custom Y position
  anim?: string;                // Animation name
  emotion?: string;             // Emotion name
  faceTo?: string;              // "left" | "right"
  handheld?: string;            // Handheld object
  shadow?: boolean;             // Enable shadow
  tint?: string;                // Color tint (hex)
  scale?: number;               // Scale multiplier
  animSpeed?: number;           // Animation speed
  anim_delay?: number;          // Animation delay
  outfit?: string;              // Outfit identifier
}

interface Background {
  name: string;                 // REQUIRED
  pos?: string;                 // Position
  type?: string;                // "scroll"
  direction?: string;           // Scroll direction
  speed?: number;               // Scroll speed
}

interface BGM {
  name: string;                 // REQUIRED
  fadeIn?: number;              // Fade-in duration
  fadeOut?: number;             // Fade-out duration
}

interface SceneObject {
  id: number;                   // REQUIRED
  objectID: string;             // REQUIRED
  source: string;               // REQUIRED
  from: Position;               // REQUIRED
  to?: Position;                // End position
  pivotX?: number;              // Pivot X (0-1)
  pivotY?: number;              // Pivot Y (0-1)
  zIndex?: number;              // Layer depth
  time?: number;                // Animation duration
  easing?: string;              // Easing function
  flipX?: boolean;              // Flip horizontal
  flipY?: boolean;              // Flip vertical
  persist?: boolean;            // Persist across scenes
}

interface Position {
  x: number;
  y: number;
  angle?: number;
}

interface AnimEffect {
  type: string;                 // REQUIRED
  // Type-specific fields (see AnimEffect section)
}

interface Option {
  sceneID: number;              // REQUIRED
  text: string;                 // REQUIRED
  cost?: Cost;                  // Currency cost
  reward?: Reward;              // Currency reward
  check?: Check;                // Requirements
}

interface SFX {
  name: string;                 // REQUIRED
  loop?: boolean;               // Loop sound
  delay?: number;               // Play delay
  volume?: number;              // Volume (0-1)
}

interface Cost {
  [currencyName: string]: number;
}

interface Reward {
  [currencyName: string]: number;
}

interface Check {
  type: string;                 // "boolean" | "integer" | "currency"
  variable: string;             // Variable name
  operator: string;             // Comparison operator
  value: any;                   // Comparison value
}

interface Variable {
  type: string;                 // "boolean" | "integer"
  name: string;                 // Variable name
  operator: string;             // "=" | "+=" | "-="
  value: any;                   // Value
}

interface ProgressBar {
  name: string;                 // Progress bar name
  operator: string;             // "=" | "+=" | "-="
  value: number;                // Amount
}
```

---

## Examples

### Example 1: Simple Dialogue Scene

```javascript
{
  sceneID: 0,
  charTalk: "Barney",
  text: "Good morning! How are you today?",
  char: [
    {
      name: "Barney",
      position: "center",
      emotion: "EMO_HAPPY",
      anim: "ANIM_IDLE"
    }
  ],
  bg: {
    name: "hd_home_office1",
    pos: "center"
  },
  bgm: {
    name: "calm_morning",
    fadeIn: 2.0
  }
}
```

### Example 2: Multi-Character Conversation

```javascript
{
  sceneID: 5,
  charTalk: "Amy",
  text: "Did you hear about the project deadline?",
  char: [
    {
      name: "Amy",
      position: "left",
      emotion: "EMO_WORRIED",
      faceTo: "right"
    },
    {
      name: "Barney",
      position: "right",
      emotion: "EMO_SURPRISED",
      faceTo: "left"
    }
  ]
}
```

### Example 3: Branching Choice

```javascript
{
  sceneID: 10,
  charTalk: "Amy",
  text: "Will you help me with the presentation?",
  char: [
    {
      name: "Amy",
      position: "center",
      emotion: "EMO_HOPEFUL"
    }
  ],
  option: [
    {
      sceneID: 15,
      text: "Of course! I'd be happy to help.",
      reward: { affection: 5 }
    },
    {
      sceneID: 20,
      text: "Sorry, I'm too busy right now.",
      reward: { affection: -2 }
    }
  ]
}
```

### Example 4: Scene with Object Animation

```javascript
{
  sceneID: 25,
  charTalk: "none",
  text: "A mysterious envelope slid under the door.",
  bg: {
    name: "apartment_door",
    pos: "center"
  },
  object: [
    {
      id: 0,
      objectID: "envelope",
      source: "red_envelope.png",
      from: { x: 200, y: 1500 },
      to: { x: 800, y: 1500 },
      time: 2.0,
      easing: "Quadratic.EaseOut",
      zIndex: 5
    }
  ],
  sfx: {
    name: "paper_slide",
    volume: 0.7
  }
}
```

### Example 5: Dramatic Camera Zoom

```javascript
{
  sceneID: 30,
  charTalk: "Barney",
  text: "Wait... what did you just say?!",
  char: [
    {
      name: "Barney",
      position: "center",
      emotion: "EMO_SHOCKED"
    }
  ],
  animEffect: {
    type: "zoom_pan",
    scale: 1.8,
    posX: 960,
    posY: 400,
    time: 0.8,
    easing: "Quadratic.EaseIn"
  },
  sfx: {
    name: "dramatic_stinger"
  }
}
```

### Example 6: Conditional Scene with Variable Check

```javascript
{
  sceneID: 35,
  charTalk: "Guard",
  text: "You need a security pass to enter.",
  char: [
    {
      name: "Guard",
      position: "center",
      emotion: "EMO_STERN"
    }
  ],
  option: [
    {
      sceneID: 40,
      text: "Show security pass",
      check: {
        type: "boolean",
        variable: "has_security_pass",
        operator: "==",
        value: true
      }
    },
    {
      sceneID: 45,
      text: "Try to sneak past (100 coins)",
      cost: { coins: 100 }
    },
    {
      sceneID: 50,
      text: "Leave"
    }
  ]
}
```

### Example 7: Progress Bar Update

```javascript
{
  sceneID: 55,
  charTalk: "none",
  text: "You feel exhausted from the long journey.",
  progressBar: {
    name: "Stamina",
    operator: "-=",
    value: 30
  },
  animEffect: {
    type: "pulse",
    time: 2.0
  }
}
```

### Example 8: Outfit Change (Dress-Up)

```javascript
{
  sceneID: 60,
  charTalk: "Amy",
  text: "Let me change into something more comfortable.",
  char: [
    {
      name: "Amy",
      position: "center",
      outfit: "casual_clothes",
      emotion: "EMO_CONTENT"
    }
  ]
}
```

### Example 9: Screen Transition

```javascript
{
  sceneID: 65,
  charTalk: "none",
  text: "",
  animEffect: {
    type: "trans0",
    color: "#000000",
    animStart: "instant"
  },
  text_delay: 1.0
}
```

### Example 10: Complex Scene with Multiple Elements

```javascript
{
  sceneID: 70,
  charTalk: "Barney",
  text: "This is it... the moment of truth.",
  char: [
    {
      name: "Barney",
      position: "left",
      emotion: "EMO_DETERMINED",
      faceTo: "right",
      scale: 1.1
    },
    {
      name: "Amy",
      position: "right",
      emotion: "EMO_WORRIED",
      faceTo: "left"
    }
  ],
  bg: {
    name: "rooftop_sunset",
    pos: "center"
  },
  bgm: {
    name: "emotional_moment",
    fadeIn: 3.0
  },
  object: [
    {
      id: 0,
      objectID: "letter",
      source: "envelope_open.png",
      from: { x: 500, y: 800 },
      zIndex: 3
    }
  ],
  animEffect: {
    type: "zoom_pan",
    scale: 1.2,
    posX: 700,
    posY: 500,
    time: 2.0,
    easing: "Quadratic.EaseInOut"
  },
  bubble: "normal",
  textFontSize: 32,
  text_delay: 0.5
}
```

---

## Asset Management

### CustomLoad Manifest

Every chapter requires an entry in `media/text/customload.js` to define which assets to preload.

#### Structure

```javascript
_CUSTOMLOAD = {
  Chapter: [
    {
      chapterID: "Chapter1",
      bg: ["hd_home_office1", "park_day", "apartment_night"],
      character: ["Barney", "Amy"],
      object: ["desk_rear", "coffee_mug", "smartphone"],
      sfx: ["door_open", "footsteps", "phone_ring"],
      bgm: ["calm_morning", "tense_moment"],
      duTheme: ["Amy"],
      outfit: ["casual", "formal"],
      voiceover: [1, 5, 10, 15]  // Scene IDs with voice acting
    },
    // ... more chapters
  ]
};
```

#### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `chapterID` | `string` | Chapter identifier (e.g., `"Chapter1"`) |
| `bg` | `string[]` | Background asset names (without extension) |
| `character` | `string[]` | Character names (must match sprite folders) |
| `object` | `string[]` | Object/prop asset names |
| `sfx` | `string[]` | Sound effect filenames (without extension) |
| `bgm` | `string[]` | Background music filenames (without extension) |
| `duTheme` | `string[]` | Dress-up character themes |
| `outfit` | `string[]` | Outfit identifiers |
| `voiceover` | `number[]` | Scene IDs that have voiceover audio |

### Asset Path Configuration

Asset paths are defined in `settings.js`:

```javascript
_GAMESETTING = {
  _BASEPATH: {
    text: "media/text/",
    voiceover: "media/audio/voiceover/",
    thumbnail: "media/graphics/thumbnail/",
    avatar: "media/graphics/avatar/"
  }
};
```

### Asset Loading Flow

```
1. Game starts chapter
2. custom-loader.js reads customload.js
3. Loader fetches translation file (chapter1.en.js)
4. Loader preloads all assets listed in manifest
   - Backgrounds: media/graphics/backgrounds/
   - Characters: media/graphics/sprites/
   - Objects: media/graphics/objects/
   - Audio: media/audio/
5. Game controller begins executing scenes
```

---

## Best Practices

### 1. Scene Numbering

**Always use sequential scene IDs starting from 0:**

```javascript
// GOOD
{ sceneID: 0, ... },
{ sceneID: 1, ... },
{ sceneID: 2, ... }

// BAD
{ sceneID: 0, ... },
{ sceneID: 5, ... },
{ sceneID: 10, ... }
```

**Why:** The game controller reads scenes sequentially. Gaps can cause unexpected behavior.

### 2. Character Names

**Use consistent capitalization:**

```javascript
// GOOD
{ name: "Barney" }  // Always capitalize

// BAD
{ name: "barney" }  // Don't mix cases
```

**Why:** Character names must match asset folder names exactly.

### 3. Asset References

**Omit file extensions in asset names:**

```javascript
// GOOD
bg: { name: "hd_home_office1" }
bgm: { name: "calm_morning" }

// BAD
bg: { name: "hd_home_office1.jpg" }
bgm: { name: "calm_morning.mp3" }
```

**Why:** The engine automatically adds appropriate extensions.

### 4. Empty Scenes for Transitions

**Use empty dialogue scenes for visual-only transitions:**

```javascript
{
  sceneID: 50,
  charTalk: "none",
  text: "",  // Empty text
  animEffect: {
    type: "trans0",
    color: "#000000"
  }
}
```

### 5. Background Inheritance

**Don't repeat background objects unnecessarily:**

```javascript
// GOOD - Only specify bg when it changes
{ sceneID: 0, bg: { name: "office" }, ... },
{ sceneID: 1, ... },  // Inherits office background
{ sceneID: 2, ... },  // Still office
{ sceneID: 3, bg: { name: "park" }, ... }  // Changed to park

// BAD - Repeating unnecessarily
{ sceneID: 0, bg: { name: "office" }, ... },
{ sceneID: 1, bg: { name: "office" }, ... },
{ sceneID: 2, bg: { name: "office" }, ... }
```

### 6. Character State Management

**Update only changed character properties:**

```javascript
// Scene 1: Initial character state
{
  sceneID: 1,
  charTalk: "Barney",
  text: "I'm happy!",
  char: [
    {
      name: "Barney",
      position: "center",
      emotion: "EMO_HAPPY",
      anim: "ANIM_IDLE"
    }
  ]
}

// Scene 2: Only change emotion
{
  sceneID: 2,
  charTalk: "Barney",
  text: "Wait, what?",
  char: [
    {
      name: "Barney",
      emotion: "EMO_SURPRISED"  // Only changed property
    }
  ]
}
```

### 7. Choice Option Ordering

**Order options logically (positive to negative):**

```javascript
option: [
  { sceneID: 10, text: "Help them" },        // Positive
  { sceneID: 20, text: "Stay neutral" },     // Neutral
  { sceneID: 30, text: "Refuse to help" }    // Negative
]
```

### 8. Using nameTag for Variations

**Use `nameTag` for character name variations:**

```javascript
{
  sceneID: 15,
  charTalk: "UnknownPerson",  // Internal name
  nameTag: "???",             // Display name
  text: "Hello there..."
}
```

### 9. Text Delays for Pacing

**Add delays for dramatic effect:**

```javascript
{
  sceneID: 20,
  charTalk: "none",
  text: "And then...",
  text_delay: 2.0  // 2 second pause before showing text
}
```

### 10. Z-Index Organization

**Use consistent z-index ranges:**

```
- 1-10:   Background objects
- 11-50:  Middle ground
- 51-99:  Foreground objects
- 100+:   UI elements
```

---

## Common Patterns

### Pattern 1: Character Entrance

```javascript
// Option A: Walk in
{
  sceneID: 10,
  charTalk: "none",
  text: "Amy entered the room.",
  char: [
    {
      name: "Amy",
      position: "center",
      emotion: "EMO_NEUTRAL"
    }
  ]
}

// Option B: With animation (if supported)
// Use WALK_IN command in .vnscript source
```

### Pattern 2: Character Exit

```javascript
// Remove character by not including in char array
{
  sceneID: 20,
  charTalk: "none",
  text: "Barney left the room.",
  char: []  // Empty array = no characters
}
```

### Pattern 3: Two-Character Conversation

```javascript
{
  sceneID: 30,
  charTalk: "Amy",
  text: "What do you think?",
  char: [
    {
      name: "Amy",
      position: "left",
      emotion: "EMO_CURIOUS",
      faceTo: "right"
    },
    {
      name: "Barney",
      position: "right",
      emotion: "EMO_THINKING",
      faceTo: "left"
    }
  ]
}
```

### Pattern 4: Thought Bubble

```javascript
{
  sceneID: 40,
  charTalk: "Barney",
  text: "I wonder if she's telling the truth...",
  bubble: "think",
  char: [
    {
      name: "Barney",
      position: "center",
      emotion: "EMO_THINKING"
    }
  ]
}
```

### Pattern 5: Narrator Text

```javascript
{
  sceneID: 50,
  charTalk: "none",
  text: "Several hours later...",
  bubble: "none"
}
```

### Pattern 6: Background Change with Transition

```javascript
// Scene 1: Fade out
{
  sceneID: 60,
  charTalk: "none",
  text: "",
  animEffect: {
    type: "trans0",
    color: "#000000"
  }
}

// Scene 2: Change background
{
  sceneID: 61,
  charTalk: "none",
  text: "",
  bg: {
    name: "new_location"
  }
}

// Scene 3: Fade in
{
  sceneID: 62,
  charTalk: "none",
  text: "",
  animEffect: {
    type: "trans1",
    color: "#000000"
  }
}

// Scene 4: Continue with new background
{
  sceneID: 63,
  charTalk: "none",
  text: "You arrived at a new location."
}
```

### Pattern 7: Music Fade Out/In

```javascript
// Fade out current music
{
  sceneID: 70,
  charTalk: "none",
  text: "The music faded away...",
  bgm: {
    name: "default",
    fadeOut: 2.0
  }
}

// Fade in new music
{
  sceneID: 75,
  charTalk: "none",
  text: "A new melody began.",
  bgm: {
    name: "new_track",
    fadeIn: 3.0
  }
}
```

### Pattern 8: Multi-Stage Choice

```javascript
// First choice
{
  sceneID: 80,
  charTalk: "Amy",
  text: "Where should we go?",
  option: [
    { sceneID: 85, text: "The park" },
    { sceneID: 90, text: "The cafe" }
  ]
}

// Park path
{
  sceneID: 85,
  charTalk: "none",
  text: "You went to the park.",
  bg: { name: "park_day" }
}
// ... park scenes ...
{
  sceneID: 88,
  charTalk: "none",
  text: "",
  linkSceneID: 95  // Jump to merge point
}

// Cafe path
{
  sceneID: 90,
  charTalk: "none",
  text: "You went to the cafe.",
  bg: { name: "cafe_interior" }
}
// ... cafe scenes ...
{
  sceneID: 93,
  charTalk: "none",
  text: "",
  linkSceneID: 95  // Jump to merge point
}

// Merge point
{
  sceneID: 95,
  charTalk: "Amy",
  text: "That was nice!",
  // ... story continues...
}
```

### Pattern 9: Conditional Dialogue

```javascript
{
  sceneID: 100,
  charTalk: "Barney",
  text: "Welcome back!",
  check: {
    type: "boolean",
    variable: "first_visit",
    operator: "==",
    value: false
  }
}

{
  sceneID: 101,
  charTalk: "Barney",
  text: "Welcome! First time here?",
  check: {
    type: "boolean",
    variable: "first_visit",
    operator: "==",
    value: true
  }
}
```

### Pattern 10: Animated Prop Introduction

```javascript
{
  sceneID: 110,
  charTalk: "none",
  text: "A letter appeared on the desk.",
  object: [
    {
      id: 0,
      objectID: "letter",
      source: "letter_closed.png",
      from: { x: 960, y: -200 },  // Start above screen
      to: { x: 960, y: 800 },     // Fall onto desk
      time: 1.0,
      easing: "Bounce.EaseOut",
      zIndex: 10
    }
  ],
  sfx: {
    name: "paper_drop",
    delay: 1.0
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Character Not Appearing

**Symptom:** Character specified in `char[]` but doesn't show up.

**Possible Causes:**
1. Character name doesn't match asset folder name
2. Character not listed in `customload.js`
3. Character assets not in correct directory

**Solution:**
```javascript
// Check exact spelling and capitalization
char: [{ name: "Barney" }]  // Must match media/graphics/sprites/barney/

// Verify in customload.js
{
  chapterID: "Chapter1",
  character: ["Barney"]  // Must be listed here
}
```

#### Issue 2: Background Not Loading

**Symptom:** Background is black or doesn't change.

**Possible Causes:**
1. Asset name incorrect or includes extension
2. Background not in asset manifest
3. File doesn't exist or wrong format

**Solution:**
```javascript
// Don't include file extension
bg: { name: "hd_home_office1" }  // Not "hd_home_office1.jpg"

// Check file exists at:
// media/graphics/backgrounds/hd_home_office1.jpg (or .png)

// Add to customload.js
{
  chapterID: "Chapter1",
  bg: ["hd_home_office1"]
}
```

#### Issue 3: BGM Not Playing

**Symptom:** No music or music doesn't change.

**Possible Causes:**
1. Audio file missing or wrong format
2. BGM not in asset manifest
3. Browser audio blocked (user interaction required)

**Solution:**
```javascript
// Verify asset exists at:
// media/audio/calm_morning.mp3 (or .ogg)

// Add to customload.js
{
  chapterID: "Chapter1",
  bgm: ["calm_morning"]
}

// Use fadeIn for smooth start
bgm: {
  name: "calm_morning",
  fadeIn: 1.0
}
```

#### Issue 4: Choices Not Appearing

**Symptom:** Scene with `option[]` shows dialogue but no choice buttons.

**Possible Causes:**
1. `option` array is empty
2. All options have failing `check` conditions
3. Syntax error in option objects

**Solution:**
```javascript
// Ensure at least one option is always available
option: [
  {
    sceneID: 50,
    text: "Option 1",
    check: { /* condition */ }
  },
  {
    sceneID: 60,
    text: "Option 2"  // No check = always available
  }
]
```

#### Issue 5: Scene Jumps Not Working

**Symptom:** `linkSceneID` doesn't jump to target scene.

**Possible Causes:**
1. Target sceneID doesn't exist
2. Typo in field name
3. Sequential scenes running instead

**Solution:**
```javascript
// Correct usage
{
  sceneID: 30,
  charTalk: "none",
  text: "",
  linkSceneID: 100  // Jump to scene 100
}

// Scene 100 must exist
{
  sceneID: 100,
  charTalk: "none",
  text: "Jumped to scene 100."
}
```

#### Issue 6: Variables Not Updating

**Symptom:** Variable operations don't seem to work.

**Possible Causes:**
1. Incorrect variable syntax
2. Type mismatch
3. Variable not initialized

**Solution:**
```javascript
// Set boolean correctly
variable: {
  type: "boolean",
  name: "has_key",
  operator: "=",
  value: true  // Boolean, not "true"
}

// Increment integer correctly
variable: {
  type: "integer",
  name: "score",
  operator: "+=",
  value: 10  // Number, not "10"
}
```

#### Issue 7: Animation Not Playing

**Symptom:** `animEffect` specified but nothing happens.

**Possible Causes:**
1. Incorrect effect type
2. Missing required fields for effect type
3. Time set to 0

**Solution:**
```javascript
// Ensure all required fields present
animEffect: {
  type: "zoom_pan",
  scale: 1.5,
  posX: 960,
  posY: 540,
  time: 1.0,  // Duration must be > 0
  easing: "Quadratic.EaseInOut"
}
```

#### Issue 8: Objects Not Appearing

**Symptom:** Objects in `object[]` don't show up.

**Possible Causes:**
1. Object position off-screen
2. zIndex too low (behind background)
3. Asset not loaded

**Solution:**
```javascript
object: [
  {
    id: 0,
    objectID: "desk",
    source: "desk_rear.png",
    from: {
      x: 960,   // Center of 1920x1080 screen
      y: 800    // Visible Y position
    },
    zIndex: 5  // Higher than background (usually 1-3)
  }
]

// Add to customload.js
{
  chapterID: "Chapter1",
  object: ["desk_rear"]
}
```

#### Issue 9: Text Delay Not Working

**Symptom:** `text_delay` has no effect.

**Possible Causes:**
1. Field name typo
2. Value set to 0
3. Scene auto-advancing

**Solution:**
```javascript
// Use correct field name
{
  sceneID: 50,
  charTalk: "none",
  text: "This appears after 2 seconds.",
  text_delay: 2.0  // or textDelay: 2.0
}
```

#### Issue 10: Progress Bar Not Updating

**Symptom:** `progressBar` operation doesn't affect bar.

**Possible Causes:**
1. Progress bar name doesn't match settings.js
2. Syntax error in progressBar object
3. Progress bar not configured

**Solution:**
```javascript
// Check settings.js for valid progress bar names
_GAMESETTING = {
  progressBarOptions: [
    { name: "HP", max: 100, color: "#FF0000" },
    { name: "MP", max: 100, color: "#0000FF" }
  ]
};

// Use exact name from settings
{
  sceneID: 60,
  charTalk: "none",
  text: "HP decreased!",
  progressBar: {
    name: "HP",  // Must match settings.js
    operator: "-=",
    value: 20
  }
}
```

### Debugging Tips

#### 1. Check Browser Console

Open browser console (F12) to see error messages:
```
- "Asset not found" errors
- JavaScript syntax errors
- Loading failures
```

#### 2. Validate JSON Syntax

Ensure proper JavaScript object syntax:
```javascript
// GOOD
{
  sceneID: 0,
  charTalk: "Barney",
  text: "Hello"
}

// BAD - Missing comma
{
  sceneID: 0
  charTalk: "Barney"
}

// BAD - Extra comma
{
  sceneID: 0,
  charTalk: "Barney",
}
```

#### 3. Test Incrementally

Build scenes incrementally:
1. Start with basic scene (sceneID, charTalk, text)
2. Add background
3. Add characters
4. Add effects
5. Test after each addition

#### 4. Use Helper Tools

The engine includes helper tools for testing:
- **Character Helper** (`Ctrl+Shift+D`): Test emotions/animations
- **Zoom/Pan Helper** (`Ctrl+Shift+Z`): Test camera effects

See `emo-anim/README.md` and `zoom-pan/README.md` for details.

#### 5. Check Asset Paths

Verify all assets exist at expected paths:
```bash
# Check background exists
ls media/graphics/backgrounds/hd_home_office1.*

# Check character sprites
ls media/graphics/sprites/barney/

# Check audio
ls media/audio/calm_morning.*
```

#### 6. Validate customload.js

Ensure all referenced assets are in the manifest:
```javascript
// If your scene uses:
bg: { name: "office" }
char: [{ name: "Barney" }]
bgm: { name: "theme" }

// Then customload.js must have:
{
  chapterID: "Chapter1",
  bg: ["office"],
  character: ["Barney"],
  bgm: ["theme"]
}
```

---

## Appendix

### A. Easing Functions

Common easing functions for animations:

| Easing | Description |
|--------|-------------|
| `"Linear.None"` | Constant speed |
| `"Quadratic.EaseIn"` | Slow start, accelerate |
| `"Quadratic.EaseOut"` | Fast start, decelerate |
| `"Quadratic.EaseInOut"` | Slow start and end |
| `"Cubic.EaseIn"` | Slower start |
| `"Cubic.EaseOut"` | Slower end |
| `"Cubic.EaseInOut"` | Slower start and end |
| `"Quartic.EaseIn"` | Very slow start |
| `"Quartic.EaseOut"` | Very slow end |
| `"Bounce.EaseOut"` | Bouncy end |
| `"Elastic.EaseOut"` | Elastic/springy end |
| `"Back.EaseOut"` | Overshoot and return |

### B. Standard Screen Coordinates

For 1920x1080 resolution (standard HD):

| Position | X | Y |
|----------|---|---|
| Top-Left | 0 | 0 |
| Top-Center | 960 | 0 |
| Top-Right | 1920 | 0 |
| Middle-Left | 0 | 540 |
| Center | 960 | 540 |
| Middle-Right | 1920 | 540 |
| Bottom-Left | 0 | 1080 |
| Bottom-Center | 960 | 1080 |
| Bottom-Right | 1920 | 1080 |

### C. File Naming Conventions

**Backgrounds:**
- Format: `name.jpg` or `name.png`
- Location: `media/graphics/backgrounds/`
- Prefix: `hd_` for high-definition assets

**Character Sprites:**
- Format: Folder structure with animation files
- Location: `media/graphics/sprites/character_name/`
- Names: Lowercase character names

**Objects:**
- Format: `object_name.png`
- Location: `media/graphics/objects/`
- Descriptive names: `desk_rear.png`, `coffee_mug.png`

**Audio:**
- BGM: `media/audio/*.mp3` or `.ogg`
- SFX: `media/audio/*.mp3` or `.ogg`
- Voiceover: `media/audio/voiceover/chapter#_scene#.mp3`

### D. Translation File Naming

Pattern: `chapter#.{lang}.js`

Examples:
- `chapter1.en.js` - English
- `chapter1.es.js` - Spanish
- `chapter1.fr.js` - French
- `chapter1.ja.js` - Japanese

### E. Related Documentation

- **CLAUDE.md** - Project overview and architecture
- **emo-anim/README.md** - Character helper tool
- **zoom-pan/README.md** - Zoom/pan helper tool
- **script-converter/README.md** - Script parser usage

### F. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-07 | Initial documentation |

---

## Contact & Support

For issues with chapter files:
1. Check browser console for errors
2. Verify asset paths in `customload.js`
3. Test with minimal scene structure
4. Use helper tools for visual debugging

---

**End of Documentation**
