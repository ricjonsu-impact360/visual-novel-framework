# Visual Novel Framework - Architecture Overview

**Version:** 2.0.0
**Last Updated:** 2025-11-07
**Author:** Framework Documentation Team

---

## Table of Contents

1. [Introduction](#introduction)
2. [Framework Components](#framework-components)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Development Workflow](#development-workflow)
7. [Integration Points](#integration-points)
8. [Directory Structure](#directory-structure)

---

## Introduction

The Visual Novel Framework is a comprehensive system for creating browser-based visual novel games. It consists of three primary components working together to enable rapid visual novel development with minimal technical knowledge required from content creators.

### Core Philosophy

- **Separation of Concerns**: Content creation (scripts) is separate from technical implementation (engine)
- **Human-Readable Scripts**: Writers work in a simple DSL (Domain-Specific Language)
- **Asset Pipeline**: Automatic compilation and optimization of scripts and assets
- **Plugin Architecture**: Extensible system for adding custom features
- **Multi-language Support**: Built-in localization from the ground up

### Framework Components

```
┌─────────────────────────────────────────────────────────────────┐
│                   VISUAL NOVEL FRAMEWORK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │   PROJECT        │  │  SCRIPT EDITOR   │  │   ENGINE     │ │
│  │ (first-world-    │  │   (Converter)    │  │  (Runtime)   │ │
│  │  problems)       │  │                  │  │              │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────┤ │
│  │ • Scripts        │  │ • Parser         │  │ • Impact.js  │ │
│  │ • Assets         │  │ • Compiler       │  │ • Plugins    │ │
│  │ • Configuration  │  │ • Sublime Plugin │  │ • Renderer   │ │
│  │ • Localization   │  │ • Translator     │  │ • Controllers│ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│         │                       │                      │        │
│         └───────────────────────┴──────────────────────┘        │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │  PLAYER BROWSER  │
                     │  (HTML5 Canvas)  │
                     └──────────────────┘
```

---

## Framework Components

### 1. Visual Novel Engine (visual-novel-engine/)

**Size:** ~20MB
**Purpose:** The core runtime engine that renders and executes visual novels in a browser.

**Key Responsibilities:**
- Scene rendering (backgrounds, characters, objects)
- Dialogue system with chat bubbles
- Character animation (skeletal animation via Spriter)
- Audio management (BGM, SFX, voiceover)
- Input handling (mouse, touch, keyboard)
- Save/load game state
- Multi-language support
- Responsive scaling for different devices

**Technology:**
- Built on Impact.js game framework
- 114+ plugin files across 16 categories
- Custom asset loader
- Encrypted localStorage for saves

**Main Files:**
- `engine.js` (1.49MB) - Compiled engine
- `engine.css` - UI styling
- `lib/game/main.js` - Game controller
- `lib/plugins/` - Plugin system (114 files)
- `lib/impact/` - Impact.js framework core

---

### 2. Visual Novel Script Editor (visual-novel-script-editor/)

**Size:** ~297KB
**Purpose:** Tools for creating, editing, and converting visual novel scripts.

**Key Responsibilities:**
- Parse `.vnscript` human-readable format
- Compile to `.en.js` JavaScript objects
- Code completion in Sublime Text
- Syntax highlighting
- Character preview/testing
- AI-powered translation
- Asset manifest generation

**Technology:**
- Node.js JavaScript parser (2,348 lines)
- Python Sublime Text plugin
- LM Studio SDK for AI translation
- Web-based editor interface

**Main Files:**
- `script-converter/script-editor.js` - Main parser
- `script-converter/script-editor.html` - Web UI
- `script-converter/script-export.js` - Export functionality
- `code-completion-plugin/script-completion.py` - Sublime plugin
- `script-converter/chatgpt-translate.js` - AI translation

**Supported Commands:** 40+ vnscript commands

---

### 3. Visual Novel Project (first-world-problems/)

**Size:** ~25MB (example project)
**Purpose:** Complete game project demonstrating framework capabilities.

**Key Responsibilities:**
- Asset organization (graphics, audio, scripts)
- Game configuration (settings.js)
- Asset manifest (customload.js)
- Localization strings (9 languages)
- Build and deployment scripts

**Contents:**
- 2+ chapters with branching narratives
- 7+ characters with dynamic outfits
- 10+ background locations
- 100+ sound effects
- 20+ background music tracks
- Multi-language support

**Main Files:**
- `lib/settings.js` - Project configuration
- `media/text/customload.js` - Asset manifest
- `media/text/scripts/*.vnscript` - Source scripts
- `media/text/translate/*.en.js` - Compiled scripts
- `media/text/strings.*.js` - UI localization

---

## Component Architecture

### Visual Novel Engine - Internal Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ENGINE ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     IMPACT.JS FRAMEWORK                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Module System (ig.module/requires/defines)            │  │
│  │ • Class System (ig.Class.extend with inheritance)       │  │
│  │ • Game Loop (requestAnimationFrame wrapper)             │  │
│  │ • Entity System (sprites, objects, controllers)         │  │
│  │ • Input System (keyboard, mouse, gamepad)               │  │
│  │ • Timer System (frame-independent timing)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   PLUGINS    │ │    GAME      │ │   LEVELS     │
│   (114 files)│ │  ENTITIES    │ │  (Scenes)    │
└──────────────┘ └──────────────┘ └──────────────┘
         │               │               │
         └───────────────┴───────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    AUDIO     │ │  RENDERING   │ │   STORAGE    │
│  (Howler.js) │ │   (Canvas)   │ │ (localStorage)│
└──────────────┘ └──────────────┘ └──────────────┘
```

#### Plugin Categories (16 categories, 114 files)

| Category | Files | Purpose |
|----------|-------|---------|
| **audio/** | 4 | Sound management (Howler.js wrapper) |
| **chat-bubble/** | 12 | Dialogue UI system |
| **data/** | 6 | Vector, color, geometry utilities |
| **font/** | 3 | Font loading and rendering |
| **freezeframe/** | 2 | GIF recording for marketing |
| **handlers/** | 8 | DOM, size, API, visibility handling |
| **io/** | 4 | Storage manager, API manager |
| **packer/** | 3 | Asset optimization |
| **particles/** | 2 | Visual effects |
| **patches/** | 14 | Framework fixes and enhancements |
| **responsive-keyboard/** | 2 | Mobile input |
| **spriter/** | 18 | Skeletal character animation |
| **tiered-rv/** | 4 | Reward video system |
| **Root plugins** | 32 | Director, loader, tweens, multilang, etc. |

---

### Script Editor - Parser Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPT EDITOR ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  .vnscript      │  Human-readable script
│  (Source)       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PARSER (script-editor.js)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Line-by-line parsing                                │  │
│  │  2. Command detection (40+ commands)                    │  │
│  │  3. Property extraction                                 │  │
│  │  4. Scene object building                               │  │
│  │  5. State management (BG, BGM, characters persist)      │  │
│  │  6. Branching resolution (JUMPTO/CONTINUE)              │  │
│  │  7. Asset tracking                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  .en.js         │  Compiled JavaScript scene array
│  (Output)       │
└─────────────────┘
```

#### Parser State Variables (20+ variables)

- **currentBG** - Current background persists across scenes
- **currentBGM** - Current music persists until changed
- **currentCharacters** - Character states (position, emotion, animation)
- **currentOverlay** - Overlay state
- **currentObjects** - Scene objects
- **sceneCounter** - Auto-incrementing scene ID
- **labelMap** - JUMPTO/CONTINUE label references
- **assetList** - Tracks used assets for customload.js

---

### Project Structure - Configuration System

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROJECT CONFIGURATION                        │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│  settings.js   │     │ customload.js  │     │  strings.js    │
│                │     │                │     │                │
│ • Paths        │────▶│ • Asset lists  │     │ • UI strings   │
│ • UI config    │     │ • Per chapter  │     │ • Multi-lang   │
│ • Characters   │     │ • BG, SFX, BGM │     │ • Localization │
│ • Themes       │     │ • Characters   │     │                │
└────────────────┘     └────────────────┘     └────────────────┘
         │                      │                      │
         └──────────────────────┴──────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   ENGINE RUNTIME      │
                    │  (Reads all configs)  │
                    └───────────────────────┘
```

---

## Data Flow

### Complete Data Flow: From Script to Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT PHASE                         │
└─────────────────────────────────────────────────────────────────┘

1. SCRIPT WRITING
   ┌─────────────────┐
   │ Writer creates  │
   │ chapter1.en     │
   │   .vnscript     │
   └────────┬────────┘
            │
            │ Example:
            │ BACKGROUND. office center
            │ CHARACTERS. @AMY position center
            │ @AMY "Hello!"
            │
            ▼
2. SCRIPT CONVERSION
   ┌─────────────────────────────────────┐
   │ script-editor.js parses:            │
   │ • Detects BACKGROUND command        │
   │ • Detects CHARACTERS command        │
   │ • Detects dialogue (@AMY)           │
   │ • Builds scene object               │
   │ • Merges with previous state        │
   └────────┬────────────────────────────┘
            │
            ▼
3. COMPILED OUTPUT
   ┌─────────────────────────────────────┐
   │ chapter1.en.js:                     │
   │ _LANG["en"]["Chapter1"] = [         │
   │   {                                 │
   │     sceneID: 0,                     │
   │     charTalk: "Amy",                │
   │     text: "Hello!",                 │
   │     bg: {name:"office",pos:"center"}│
   │     char: [{name:"Amy",...}]        │
   │   }                                 │
   │ ]                                   │
   └────────┬────────────────────────────┘
            │
            ▼
4. ASSET MANIFEST UPDATE
   ┌─────────────────────────────────────┐
   │ customload.js updated:              │
   │ {                                   │
   │   chapterID: "Chapter1",            │
   │   bg: ["office"],                   │
   │   character: ["Amy"]                │
   │ }                                   │
   └────────┬────────────────────────────┘
            │
            ▼

┌─────────────────────────────────────────────────────────────────┐
│                         RUNTIME PHASE                            │
└─────────────────────────────────────────────────────────────────┘

5. GAME INITIALIZATION
   ┌─────────────────────────────────────┐
   │ index.html loads:                   │
   │ 1. jQuery                           │
   │ 2. settings.js                      │
   │ 3. engine.js                        │
   │ 4. customload.js                    │
   │ 5. strings.js                       │
   └────────┬────────────────────────────┘
            │
            ▼
6. ASSET PRELOADING
   ┌─────────────────────────────────────┐
   │ custom-loader.js:                   │
   │ • Reads customload.js               │
   │ • Preloads backgrounds              │
   │ • Preloads character sprites        │
   │ • Preloads audio files              │
   │ • Shows loading screen              │
   └────────┬────────────────────────────┘
            │
            ▼
7. CHAPTER LOADING
   ┌─────────────────────────────────────┐
   │ director.js:                        │
   │ • Loads chapter1.en.js              │
   │ • Parses scene array                │
   │ • Sets up game controller           │
   └────────┬────────────────────────────┘
            │
            ▼
8. SCENE EXECUTION
   ┌─────────────────────────────────────┐
   │ game-controller.js:                 │
   │ • Read scene object (sceneID: 0)    │
   │ • Render background "office"        │
   │ • Spawn character "Amy" at center   │
   │ • Display dialogue "Hello!"         │
   │ • Show chat bubble                  │
   │ • Play animations                   │
   │ • Wait for player input             │
   └────────┬────────────────────────────┘
            │
            ▼
9. PLAYER INPUT
   ┌─────────────────────────────────────┐
   │ Player clicks to continue           │
   │ • Increment scene counter           │
   │ • Load next scene object            │
   │ • Repeat step 8                     │
   └─────────────────────────────────────┘
            │
            ▼
10. BRANCHING (if present)
   ┌─────────────────────────────────────┐
   │ If scene has options:               │
   │ • Display choice buttons            │
   │ • Player selects option             │
   │ • Jump to option's sceneID          │
   │ • Apply rewards/costs               │
   │ • Continue execution                │
   └─────────────────────────────────────┘
```

### Asset Loading Flow

```
customload.js Asset Manifest
         │
         ├──────────┬──────────┬──────────┬──────────┐
         ▼          ▼          ▼          ▼          ▼
    Backgrounds  Characters  Objects    SFX       BGM
         │          │          │          │          │
         │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼
    ┌────────────────────────────────────────────────┐
    │         custom-loader.js                       │
    │  • Check file availability                     │
    │  • Load images (new ig.Image())                │
    │  • Register audio (soundHandler)               │
    │  • Track loading progress                      │
    │  • Display loading screen                      │
    └────────────────┬───────────────────────────────┘
                     │
                     ▼
         All assets loaded and cached
                     │
                     ▼
             Game controller ready
                     │
                     ▼
           Start scene execution
```

---

## Technology Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Game Framework** | Impact.js | 2D game engine with entity system |
| **Language** | JavaScript (ES5) | Cross-browser compatibility |
| **Rendering** | HTML5 Canvas | Hardware-accelerated 2D graphics |
| **DOM** | jQuery 3.2.1 | DOM manipulation (legacy) |
| **Audio** | Howler.js | Cross-browser audio with Web Audio API |
| **Animation** | TweenMax/GSAP | Smooth property interpolation |
| **Physics** | Box2D | Physics simulation (optional) |
| **Characters** | Spriter | Skeletal animation system |
| **Storage** | localStorage | Save game data |
| **Encryption** | AES (SecureLS) | Encrypted save data |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Node.js** | Script converter runtime |
| **Python 3** | Build scripts, Sublime plugin |
| **Sublime Text 3** | Script editor with completion |
| **Google Closure Compiler** | JavaScript minification |
| **javascript-obfuscator** | Code obfuscation |
| **LM Studio SDK** | AI-powered translation |

### Deployment Stack

| Service | Purpose |
|---------|---------|
| **AWS S3** | Static asset hosting |
| **AWS CloudFront** | CDN for global distribution |
| **GZip** | Compression for network transfer |

---

## Development Workflow

### Typical Development Cycle

```
1. PLANNING
   ↓
   • Story outline
   • Character designs
   • Asset list
   • Chapter structure

2. ASSET CREATION
   ↓
   • Draw backgrounds
   • Create character sprites
   • Record/source audio
   • Organize in media/ folders

3. CONFIGURATION
   ↓
   • Update settings.js (characters, themes)
   • Create customload.js entries
   • Set up strings.js localization

4. SCRIPT WRITING
   ↓
   • Write .vnscript files
   • Use Sublime Text with plugin
   • Test in character preview tool

5. COMPILATION
   ↓
   • Run script-editor.js
   • Convert .vnscript → .en.js
   • Verify output

6. TESTING
   ↓
   • Load in dev.html
   • Test all scenes
   • Verify assets load
   • Test branching paths

7. TRANSLATION (Optional)
   ↓
   • Use chatgpt-translate.js
   • Generate .es.js, .jp.js, etc.
   • Test language switching

8. BUILD
   ↓
   • Compile JavaScript (Closure Compiler)
   • Obfuscate code
   • Compress assets
   • Update version numbers

9. DEPLOYMENT
   ↓
   • Upload to S3
   • Invalidate CDN cache
   • Test production build

10. MAINTENANCE
    ↓
    • Monitor player feedback
    • Fix bugs
    • Add new chapters
    • Update assets
```

### Quick Start Guide

**Create a new chapter in 10 steps:**

```bash
# 1. Create vnscript file
touch media/text/scripts/chapter3.en.vnscript

# 2. Write your story
nano media/text/scripts/chapter3.en.vnscript

# 3. Compile script
node script-converter/script-editor.js \
  media/text/scripts/chapter3.en.vnscript \
  media/text/translate/chapter3.en.js

# 4. Update asset manifest
nano media/text/customload.js
# Add chapter3 entry with asset lists

# 5. Update settings.js
nano lib/settings.js
# Increment totalChapter

# 6. Test in browser
open dev.html

# 7. (Optional) Translate
node script-converter/chatgpt-translate.js chapter3

# 8. Build for production
./build_script.sh

# 9. Deploy
python boto-s3-upload.py

# 10. Invalidate cache
python cloudfront_invalidate_cache.py
```

---

## Integration Points

### How Components Communicate

#### 1. Configuration → Engine

**File:** `lib/settings.js`
```javascript
var _GAMESETTING = {
  _BASEPATH: {
    text: "media/text/",
    background: "media/graphics/backgrounds/"
  }
};
```

**Engine reads:**
```javascript
// In custom-loader.js
var bgPath = _BASEPATH.background + bgName + ".jpg";
```

#### 2. Asset Manifest → Loader

**File:** `media/text/customload.js`
```javascript
_CUSTOMLOAD = {
  Chapter: [
    {},
    {
      chapterID: "Chapter1",
      bg: ["office", "cafe"],
      character: ["Amy", "Jack"]
    }
  ]
};
```

**Loader processes:**
```javascript
// In custom-loader.js
var chapter = _CUSTOMLOAD.Chapter[chapterNumber];
for(var i=0; i<chapter.bg.length; i++) {
  loadBackground(chapter.bg[i]);
}
```

#### 3. Script → Controller

**File:** `media/text/translate/chapter1.en.js`
```javascript
_LANG["en"]["Chapter1"] = [
  {
    sceneID: 0,
    charTalk: "Amy",
    text: "Hello!",
    char: [{name: "Amy", position: "center"}]
  }
];
```

**Controller executes:**
```javascript
// In game-controller.js
var scene = _LANG[currentLang][currentChapter][sceneIndex];
displayDialogue(scene.text);
spawnCharacters(scene.char);
```

#### 4. Strings → UI

**File:** `media/text/strings.en.js`
```javascript
_LANG['en'] = {
  "Button": {
    "play": "Play",
    "shop": "Shop"
  }
};
```

**UI displays:**
```javascript
// Button text
buttonText = _LANG[currentLang]["Button"]["play"];
```

---

## Directory Structure

### Complete Framework Structure

```
visual-novel-framework/
│
├── visual-novel-engine/           # ENGINE (20MB)
│   ├── lib/
│   │   ├── game/                  # Game logic
│   │   │   ├── main.js           # Main game controller
│   │   │   ├── entities/         # 87 entity classes
│   │   │   │   ├── buttons/      # UI buttons (24 types)
│   │   │   │   ├── controller/   # Game controllers (3)
│   │   │   │   ├── game-setting/ # Settings UI
│   │   │   │   └── object/       # Scene objects (characters, etc.)
│   │   │   └── levels/           # Game levels/scenes (3)
│   │   ├── impact/               # Impact.js framework (14 files)
│   │   │   ├── game.js           # Base game class
│   │   │   ├── system.js         # System management
│   │   │   ├── entity.js         # Entity base class
│   │   │   ├── animation.js      # Animation system
│   │   │   └── ...
│   │   └── plugins/              # Plugin system (114 files)
│   │       ├── audio/            # Sound management
│   │       ├── chat-bubble/      # Dialogue UI
│   │       ├── custom-loader.js  # Asset loading
│   │       ├── director.js       # Scene management
│   │       ├── spriter/          # Character animation
│   │       └── ...
│   ├── engine.js                 # Compiled engine (1.49MB)
│   ├── engine.css                # Engine styles
│   └── media/                    # Sample assets
│
├── visual-novel-script-editor/   # SCRIPT EDITOR (297KB)
│   ├── script-converter/         # Conversion tools
│   │   ├── script-editor.js      # Main parser (2348 lines)
│   │   ├── script-editor.html    # Web UI
│   │   ├── script-export.js      # Export functionality
│   │   ├── chatgpt-translate.js  # AI translation
│   │   └── characters-data.js    # Character definitions
│   ├── code-completion-plugin/   # Sublime Text plugin
│   │   ├── script-completion.py  # Completion logic
│   │   └── script.sublime-syntax # Syntax highlighting
│   └── media/                    # Sample assets
│
├── first-world-problems/         # PROJECT EXAMPLE (25MB)
│   ├── lib/
│   │   └── settings.js           # Project configuration
│   ├── media/
│   │   ├── text/
│   │   │   ├── customload.js     # Asset manifest
│   │   │   ├── strings.*.js      # UI strings (9 languages)
│   │   │   ├── scripts/          # Source .vnscript files
│   │   │   └── translate/        # Compiled .en.js files
│   │   ├── graphics/
│   │   │   ├── backgrounds/      # Background images
│   │   │   ├── sprites/          # Character sprites
│   │   │   └── object/           # Props and objects
│   │   └── audio/
│   │       ├── bgm/              # Background music
│   │       ├── sfx/              # Sound effects
│   │       └── voiceover/        # Voice acting
│   ├── glue/                     # Loading utilities
│   ├── script-converter/         # Local copy of converter
│   ├── index.html                # Production entry
│   └── dev.html                  # Development entry
│
└── docs/                         # DOCUMENTATION
    ├── ARCHITECTURE_OVERVIEW.md  # This file
    ├── ENGINE_DOCUMENTATION.md   # Engine deep dive
    ├── SCRIPT_EDITOR_DOCUMENTATION.md  # Script editor guide
    ├── PROJECT_SETUP_GUIDE.md    # Project creation guide
    └── CHAPTER_FILE_SCHEMA.md    # Chapter schema reference
```

### File Size Distribution

| Component | Size | Percentage |
|-----------|------|------------|
| Engine | ~20MB | 44% |
| Project (example) | ~25MB | 55% |
| Script Editor | ~297KB | <1% |
| **Total** | **~45MB** | **100%** |

### Asset Distribution (first-world-problems)

| Asset Type | Size | Files |
|------------|------|-------|
| Graphics | ~17MB | 1000+ |
| Audio | ~1.5MB | 100+ |
| Text/Scripts | ~472KB | 16 |
| Configuration | ~50KB | 5 |
| **Total** | **~19MB** | **1100+** |

---

## Summary

### Key Takeaways

1. **Three Components**: Engine (runtime), Script Editor (tools), Project (game)
2. **Dual Format**: Human-readable `.vnscript` compiles to `.en.js` JavaScript
3. **Plugin Architecture**: 114 plugin files extend engine capabilities
4. **Asset Pipeline**: Automatic preloading based on customload.js manifest
5. **Multi-language**: Built-in support for 9+ languages
6. **Browser-Based**: Runs in any modern browser with HTML5 Canvas

### Component Sizes

- **Engine**: 20MB (reusable across all projects)
- **Script Editor**: 297KB (development tool)
- **Project**: 25MB (assets + scripts, varies by game)

### Technologies

- **Core**: Impact.js, JavaScript, HTML5 Canvas
- **Audio**: Howler.js
- **Animation**: Spriter, TweenMax
- **Storage**: localStorage with AES encryption

### Next Steps

- Read **ENGINE_DOCUMENTATION.md** for engine internals
- Read **SCRIPT_EDITOR_DOCUMENTATION.md** for script writing
- Read **PROJECT_SETUP_GUIDE.md** for creating your own game
- See **CHAPTER_FILE_SCHEMA.md** for scene object reference

---

**End of Architecture Overview**
