# Visual Novel Project Setup Guide

**Version:** 2.0.0
**Last Updated:** 2025-11-07
**Difficulty:** Beginner to Intermediate

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Project Structure Setup](#project-structure-setup)
5. [Configuration Files](#configuration-files)
6. [Asset Organization](#asset-organization)
7. [Creating Your First Chapter](#creating-your-first-chapter)
8. [Testing and Development](#testing-and-development)
9. [Adding Localization](#adding-localization)
10. [Build and Deployment](#build-and-deployment)
11. [Troubleshooting](#troubleshooting)
12. [Examples](#examples)

---

## Introduction

This guide walks you through creating a new visual novel project from scratch using the Visual Novel Framework. By the end, you'll have a working game with characters, dialogue, backgrounds, and interactive choices.

### What You'll Build

- Multi-chapter visual novel
- Animated characters with different outfits
- Background scenes and music
- Player choices and branching paths
- Save/load functionality
- Multi-language support (optional)

### Time Required

- **Minimum viable project:** 2-3 hours
- **Full-featured project:** 1-2 days

---

## Prerequisites

### Required Software

| Software | Version | Purpose | Download |
|----------|---------|---------|----------|
| **Node.js** | 14+ | Script compilation | [nodejs.org](https://nodejs.org) |
| **Text Editor** | Any | Script writing | Sublime Text, VS Code, Notepad++ |
| **Web Browser** | Modern | Testing | Chrome, Firefox, Safari |
| **Python** | 3.6+ | Build scripts (optional) | [python.org](https://python.org) |

### Optional Software

| Software | Purpose |
|----------|---------|
| **Git** | Version control |
| **Sublime Text 3** | Script editor with completion plugin |
| **GIMP/Photoshop** | Image editing |
| **Audacity** | Audio editing |

### Skills Required

- **Basic**: Text editing, file management
- **Helpful**: HTML/JavaScript basics, command line usage

---

## Quick Start

### Option 1: Copy Example Project

```bash
# 1. Copy the example project
cp -r first-world-problems my-visual-novel
cd my-visual-novel

# 2. Clean out example assets (optional)
rm -rf media/text/scripts/*.vnscript
rm -rf media/text/translate/*.js

# 3. Update settings
nano lib/settings.js  # Change game title, paths, etc.

# 4. Create your first script
nano media/text/scripts/chapter1.en.vnscript

# 5. Test in browser
open dev.html
```

### Option 2: Start from Scratch

```bash
# 1. Create project directory
mkdir my-visual-novel
cd my-visual-novel

# 2. Create folder structure
mkdir -p lib
mkdir -p media/{text/{scripts,translate},graphics/{backgrounds,sprites,object},audio/{bgm,sfx,voiceover}}
mkdir -p glue/load
mkdir -p script-converter

# 3. Copy engine files
cp -r ../visual-novel-engine/engine.js .
cp -r ../visual-novel-engine/engine.css .
cp -r ../visual-novel-engine/lib .

# 4. Copy script converter
cp -r ../visual-novel-script-editor/script-converter/* ./script-converter/

# 5. Create configuration files (see next sections)
```

---

## Project Structure Setup

### Required Directory Structure

```
my-visual-novel/
│
├── index.html                    # Production entry point
├── dev.html                      # Development entry point
├── engine.js                     # Engine (copy from visual-novel-engine/)
├── engine.css                    # Engine styles
│
├── lib/
│   └── settings.js               # Project configuration
│
├── media/
│   ├── text/
│   │   ├── customload.js         # Asset manifest
│   │   ├── strings.js            # Default UI strings
│   │   ├── strings.en.js         # English strings
│   │   ├── scripts/              # Your vnscript files
│   │   │   ├── chapter1.en.vnscript
│   │   │   └── chapter2.en.vnscript
│   │   └── translate/            # Compiled JS files
│   │       ├── chapter1.en.js
│   │       └── chapter2.en.js
│   │
│   ├── graphics/
│   │   ├── backgrounds/          # Background images
│   │   ├── sprites/              # Character sprites
│   │   │   ├── amy/
│   │   │   └── jack/
│   │   └── object/               # Props and objects
│   │
│   └── audio/
│       ├── bgm/                  # Background music
│       ├── sfx/                  # Sound effects
│       └── voiceover/            # Voice acting (optional)
│
├── glue/
│   ├── jquery/                   # jQuery library
│   │   └── jquery-3.2.1.min.js
│   └── load/
│       └── load.js               # Asset loader
│
└── script-converter/             # Script compilation tools
    ├── script-editor.js
    └── script-editor.html
```

### Creating the Directory Structure

**Bash Script:**

```bash
#!/bin/bash
# setup-project.sh

PROJECT_NAME="my-visual-novel"

echo "Creating project: $PROJECT_NAME"

# Create directories
mkdir -p "$PROJECT_NAME"/{lib,glue/{jquery,load},script-converter}
mkdir -p "$PROJECT_NAME"/media/text/{scripts,translate}
mkdir -p "$PROJECT_NAME"/media/graphics/{backgrounds,sprites,object}
mkdir -p "$PROJECT_NAME"/media/audio/{bgm,sfx,voiceover}

echo "Project structure created!"
```

**Run:**
```bash
chmod +x setup-project.sh
./setup-project.sh
```

---

## Configuration Files

### 1. index.html

**Location:** `index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Visual Novel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="media/graphics/misc/favicon.ico" />

    <!-- Engine CSS -->
    <link rel="stylesheet" href="engine.css">

    <!-- jQuery -->
    <script src="glue/jquery/jquery-3.2.1.min.js"></script>

    <!-- Project Configuration -->
    <script src="lib/settings.js"></script>

    <!-- Asset Loader -->
    <script src="glue/load/load.js"></script>
</head>
<body onload="setTimeout(function(){window.scrollTo(0,1)},1);">
    <div id="ajaxbar">
        <div id="game">
            <!-- Game Canvas -->
            <canvas id="canvas"></canvas>
        </div>

        <!-- Orientation Lock -->
        <div id="orientate">
            <img src="media/graphics/misc/landscape.jpg" />
        </div>
    </div>
</body>
</html>
```

### 2. dev.html

**Location:** `dev.html`

Same as `index.html` but with:
- Development console enabled
- Non-minified scripts
- URL parameter support

```html
<!-- Add before </head> -->
<script>
    // Enable development mode
    var DEV_MODE = true;
    var ENABLE_CONSOLE = true;
    var ENABLE_URL_PARAMS = true;
</script>
```

### 3. lib/settings.js

**Location:** `lib/settings.js`

**Minimal Configuration:**

```javascript
var _ENGINE_VERSION = "2.0.0";

var _GAMESETTING = {
    // ===== PATHS =====
    _BASEPATH: {
        text: "media/text/",
        background: "media/graphics/backgrounds/",
        backgroundMenu: "media/graphics/backgrounds/",
        object: "media/graphics/object/",
        sfx: "media/audio/sfx/",
        bgm: "media/audio/bgm/",
        voiceover: "media/audio/voiceover/",
        spriter: "media/graphics/sprites/"
    },

    // ===== STORAGE =====
    _LOCALSTORAGE_KEY: "my-vn-game-v1",

    // ===== RESOURCES =====
    _RESOURCESINFO: {
        "bgm": 'default',
        "image": {
            "title": "media/graphics/sprites/title.png",
            "bgMenu": 'main_menu_bg.jpg'
        }
    },

    // ===== GAME DATA =====
    _DATAGAME: {
        // Basic settings
        "defaultName": "Player",
        "enableFullScreen": true,
        "enableShop": false,
        "enableLanguage": false,
        "enableDemo": false,
        "enableTitleLoader": true,
        "enableURLParam": true,
        "enableConsoleLog": true,

        // Game behavior
        "repeatOption": false,
        "simplifiedUI": false,
        "isLinearChapter": true,

        // UI Theme
        "uiTheme": "blue",

        // Theme Colors
        "uiColor": {
            "blue": {
                "bubble": {
                    "fontSize": 36,
                    "bgColor": "#E6F2FF",
                    "textColor": "#000000"
                }
            }
        },

        // Speaker Name Styling
        "speakerName": {
            "strokeColor": "none",
            "bgColor": "#003366",
            "textColor": "#FFFFFF"
        },

        // Chapter Settings
        "chapters": {
            "multipleChapter": true,
            "totalChapter": 2
        },

        // Main Menu
        "bgMenuResources": ['main_menu_bg'],
        "mainMenuBgColor": "#CCDDFF",

        // Character Data
        "spriterData": {
            "amy": {
                "bgName": "#FFFFFF",
                "textName": "#000000",
                "outlineName": "#000000",
                "girl": {
                    "skin": "skin-fair",
                    "face": "face-almond-blue-eye",
                    "hair": "hair-long-brown",
                    "top": "top-tshirt-blue",
                    "bottom": "bottom-jeans-blue",
                    "shoes": "shoes-sneakers-white",
                    "glasses": "glasses-none",
                    "earrings": "earrings-none",
                    "hat": "hat-none",
                    "beard": "beard-none",
                    "anklet": "anklet-none",
                    "bracelet": "bracelet-none",
                    "necklace": "necklace-none"
                }
            },
            "jack": {
                "bgName": "#FFFFFF",
                "textName": "#000000",
                "outlineName": "#000000",
                "boy": {
                    "skin": "skin-tan",
                    "face": "face-almond-brown-eye",
                    "hair": "hair-short-black",
                    "top": "top-shirt-white",
                    "bottom": "bottom-pants-black",
                    "shoes": "shoes-dress-black",
                    "glasses": "glasses-none",
                    "earrings": "earrings-none",
                    "hat": "hat-none",
                    "beard": "beard-none",
                    "anklet": "anklet-none",
                    "bracelet": "bracelet-none",
                    "necklace": "necklace-none"
                }
            }
        },

        // Character Groups
        "neutral_boy": ["Jack"],
        "neutral_girl": ["Amy"],
        "dynamic_name": []
    }
};

// ===== VERSION INFO =====
var _VERSION = {
    'Version': '1.0.0',
    'Build': '1',
    'DisplayLog': false,
    'DrawVersion': false
};
```

### 4. media/text/customload.js

**Location:** `media/text/customload.js`

```javascript
var _CUSTOMLOAD = {
    Chapter: [
        {},  // Chapter 0 - always empty

        // Chapter 1
        {
            "chapterID": "Chapter1",
            "bg": ["office", "cafe"],
            "character": ["Amy", "Jack"],
            "object": ["desk", "chair"],
            "sfx": ["phone_ring"],
            "bgm": ["calm_music"],
            "duTheme": [],
            "outfit": [],
            "voiceover": []
        },

        // Chapter 2
        {
            "chapterID": "Chapter2",
            "bg": ["park", "restaurant"],
            "character": ["Amy"],
            "object": [],
            "sfx": ["birds_chirping"],
            "bgm": ["happy_music"],
            "duTheme": [],
            "outfit": [],
            "voiceover": []
        }
    ]
};
```

### 5. media/text/strings.js

**Location:** `media/text/strings.js`

```javascript
var _STRINGS = {
    "Color": {
        "text": '#000000',
        "shadow": '#CCCCCC',
        "shadowchoose": '#666666'
    },

    "Button": {
        "more": "more",
        "games": "games",
        "play": "Play",
        "shop": "Shop",
        "ok": "OK",
        "cancel": "Cancel",
        "back": "Back"
    },

    "Settings": {
        "settings": "Settings",
        "reset": "Reset",
        "menu": "Main Menu",
        "music": "Music",
        "sfx": "SFX"
    },

    "Chapter": {
        "choose": "Choose a chapter",
        "chapter": "Chapter",
        "title": [
            "",
            "Chapter 1: The Beginning",
            "Chapter 2: The Journey"
        ]
    }
};
```

### 6. glue/load/load.js

**Location:** `glue/load/load.js`

```javascript
var _LOADSCRIPTS2 = [
    // Engine
    "engine.js",

    // Configuration and data
    "media/text/customload.js",
    "media/text/strings.js",

    // Chapter files (loaded dynamically)
    // These will be loaded by the custom loader
];

// Load scripts synchronously
function loadScriptsSynchronously(scripts) {
    var currentScript = 0;

    function loadNext() {
        if(currentScript >= scripts.length) {
            onLoadComplete();
            return;
        }

        var script = document.createElement('script');
        script.src = scripts[currentScript];
        script.onload = function() {
            currentScript++;
            loadNext();
        };
        script.onerror = function() {
            console.error('Failed to load:', scripts[currentScript]);
            currentScript++;
            loadNext();
        };
        document.head.appendChild(script);
    }

    loadNext();
}

function onLoadComplete() {
    console.log('All scripts loaded');
    // Initialize game
    if(typeof ig !== 'undefined' && ig.main) {
        ig.main('#canvas', MyGame, 30, 1920, 1080, 1);
    }
}

// Start loading
loadScriptsSynchronously(_LOADSCRIPTS2);
```

---

## Asset Organization

### Graphics

#### Backgrounds

**Location:** `media/graphics/backgrounds/`

**Recommended:**
- Format: JPG (for photos/complex), PNG (for simple graphics)
- Resolution: 1920x1080 or higher
- File size: < 500KB each (optimized)
- Naming: lowercase, descriptive (e.g., `office_interior.jpg`)

**Example:**
```
backgrounds/
├── office_interior.jpg
├── cafe_exterior.jpg
├── park_daytime.jpg
└── bedroom_night.jpg
```

#### Character Sprites

**Location:** `media/graphics/sprites/{character_name}/`

**Structure:**
```
sprites/
├── amy/
│   ├── skin-fair/
│   │   ├── skin_01.png
│   │   └── skin_02.png
│   ├── face-almond-blue-eye/
│   ├── hair-long-brown/
│   └── ... (13 parts total)
└── jack/
    └── ... (same structure)
```

**13 Required Parts:**
1. skin
2. face
3. hair
4. top
5. bottom
6. shoes
7. glasses
8. earrings
9. hat
10. beard
11. anklet
12. bracelet
13. necklace

#### Objects/Props

**Location:** `media/graphics/object/`

**Recommended:**
- Format: PNG with transparency
- Size: Appropriate to scene (100-500px typical)
- Naming: descriptive (e.g., `desk_modern.png`, `phone_smartphone.png`)

**Example:**
```
object/
├── desk_modern.png
├── chair_office.png
├── laptop_open.png
├── phone_smartphone.png
└── cup_coffee.png
```

### Audio

#### Background Music

**Location:** `media/audio/bgm/`

**Recommended:**
- Format: MP3 (128kbps for size, 192kbps for quality)
- Length: 1-3 minutes (loopable)
- Naming: descriptive (e.g., `calm_morning.mp3`, `tense_moment.mp3`)

**Example:**
```
bgm/
├── calm_morning.mp3
├── happy_day.mp3
├── tense_moment.mp3
└── sad_theme.mp3
```

#### Sound Effects

**Location:** `media/audio/sfx/`

**Recommended:**
- Format: MP3 (96kbps for small size)
- Length: 0.5-3 seconds
- Naming: descriptive (e.g., `phone_ring.mp3`, `door_open.mp3`)

**Example:**
```
sfx/
├── phone_ring.mp3
├── door_open.mp3
├── door_close.mp3
├── footsteps.mp3
└── button_click.mp3
```

### Asset Optimization

**Images:**
```bash
# Optimize JPG (ImageMagick)
convert input.jpg -quality 85 -resize 1920x1080 output.jpg

# Optimize PNG (pngquant)
pngquant --quality=65-80 input.png --output output.png
```

**Audio:**
```bash
# Convert to MP3 (ffmpeg)
ffmpeg -i input.wav -codec:a libmp3lame -b:a 128k output.mp3

# Add fade in/out
ffmpeg -i input.mp3 -af "afade=t=in:d=2,afade=t=out:st=58:d=2" output.mp3
```

---

## Creating Your First Chapter

### Step 1: Plan Your Story

**Outline:**
- Who are the characters?
- What's the setting?
- What choices will the player make?
- What are the consequences?

**Example Outline:**
```
Chapter 1: Morning at Work

Characters:
- Amy (protagonist, office worker)
- Jack (colleague, friendly)

Locations:
- Office interior
- Office cafeteria

Story:
1. Amy arrives at work
2. Jack greets her
3. Amy has choice: chat with Jack or get coffee
4. Different dialogue based on choice
5. Boss calls, chapter ends
```

### Step 2: Gather Assets

**Required:**
- Background: `office_interior.jpg`
- Background: `office_cafeteria.jpg`
- Character sprites: Amy, Jack
- SFX: `footsteps.mp3`, `phone_ring.mp3`
- BGM: `calm_morning.mp3`

### Step 3: Write the Script

**File:** `media/text/scripts/chapter1.en.vnscript`

```vnscript
// ================================================
// CHAPTER 1: Morning at Work
// ================================================

// Scene 1: Fade in
ANIMEFFECT. trans1 #000000

// Scene 2: Office interior
BACKGROUND. office_interior center
BGM. calm_morning fadeIn 2

// Scene 3: Amy arrives
CHARACTERS. @Amy position center anim ANIM_WALK

SFX. footsteps

@NONE Amy arrives at the office, ready for another day of work.

SETCHAR. @Amy anim ANIM_IDLE emo EMO_NEUTRAL

// Scene 4: Jack enters
WALK_IN. @Jack to right from right faceTo left

@Jack anim ANIM_WAVE emo EMO_HAPPY Good morning, Amy!

@Amy anim ANIM_WAVE emo EMO_HAPPY Morning, Jack!

// Scene 5: Player choice
@Jack emo EMO_NEUTRAL Want to grab a coffee before the meeting?

CHOICE. Yes, let's go! { REWARD. friendship 5 } { JUMPTO. coffee_scene } ; No thanks, I'll get ready { JUMPTO. decline_scene }

// ================================================
// BRANCH: Coffee Scene
// ================================================

JUMPTO. coffee_scene

ANIMEFFECT. trans1 #FFFFFF

BACKGROUND. office_cafeteria center

WALK_IN. @Amy to left from left
WALK_IN. @Jack to right from right faceTo left

@Amy emo EMO_HAPPY Thanks for inviting me, Jack.

@Jack emo EMO_HAPPY No problem! It's nice to chat before work starts.

@NONE (You spend a few pleasant minutes chatting)

JUMPTO. meeting_call

// ================================================
// BRANCH: Decline Scene
// ================================================

JUMPTO. decline_scene

@Amy emo EMO_NEUTRAL I should probably get ready for the meeting.

@Jack emo EMO_NEUTRAL Alright, see you there!

WALK_OUT. @Jack to right speed 5

@NONE (You spend a few minutes preparing)

JUMPTO. meeting_call

// ================================================
// MERGE: Meeting Call
// ================================================

JUMPTO. meeting_call

SFX. phone_ring

@NONE (Your phone rings)

@Amy emo EMO_NEUTRAL The boss is calling. Time for the meeting!

ANIMEFFECT. trans1 #000000

@NONE To be continued...

// End of Chapter 1
```

### Step 4: Compile the Script

```bash
# Navigate to project directory
cd my-visual-novel

# Compile script
node script-converter/script-editor.js \
    media/text/scripts/chapter1.en.vnscript \
    media/text/translate/chapter1.en.js

# Check output
cat media/text/translate/chapter1.en.js
```

**Output:**
```javascript
_LANG["en"]["Chapter1"] = [
    {sceneID: 0, charTalk: "none", text: "", animEffect: {type: "trans1", color: "#000000"}},
    {sceneID: 1, charTalk: "none", text: "", bg: {name: "office_interior", pos: "center"}, bgm: {name: "calm_morning", fadeIn: 2}},
    // ... more scenes
];
```

### Step 5: Update Asset Manifest

**File:** `media/text/customload.js`

```javascript
{
    "chapterID": "Chapter1",
    "bg": ["office_interior", "office_cafeteria"],
    "character": ["Amy", "Jack"],
    "object": [],
    "sfx": ["footsteps", "phone_ring"],
    "bgm": ["calm_morning"],
    "duTheme": [],
    "outfit": [],
    "voiceover": []
}
```

### Step 6: Test!

```bash
# Open in browser
open dev.html

# Or use a local server (recommended)
python3 -m http.server 8000
# Then open: http://localhost:8000/dev.html
```

---

## Testing and Development

### Development Workflow

```
1. Write/edit .vnscript
   ↓
2. Compile to .js
   ↓
3. Refresh browser (Ctrl+R)
   ↓
4. Test scene
   ↓
5. Fix issues
   ↓
6. Repeat
```

### Testing Tools

#### 1. URL Parameters

**dev.html supports:**

```
# Start at specific chapter
?chapter=2

# Start at specific scene
?chapter=1&scene=10

# Enable debug mode
?debug=1

# Combination
?chapter=2&scene=5&debug=1
```

**Usage:**
```
http://localhost:8000/dev.html?chapter=1&scene=10
```

#### 2. Browser Console

**Open console:** F12 (Chrome/Firefox)

**Useful commands:**
```javascript
// Check current scene
console.log(ig.game.numChat);

// Check current chapter
console.log(ig.game.numChapter);

// Jump to scene
ig.game.numChat = 20;

// Check game state
console.log(ig.game.sessionData);

// Check loaded assets
console.log(_LANG["en"]["Chapter1"]);
```

#### 3. GTL (Generated Test Links)

**In vnscript:**
```vnscript
GTL. Test cafe scene

BACKGROUND. cafe center
@Amy Hello!
```

**Generates clickable link in compiled output for quick testing.**

### Common Issues

#### Issue: Assets not loading

**Solutions:**
1. Check file names match exactly (case-sensitive)
2. Verify paths in `_BASEPATH`
3. Check `customload.js` has correct asset names
4. Open browser console for errors

#### Issue: Character not showing

**Solutions:**
1. Verify character name in `settings.js` spriterData
2. Check character sprites exist in `media/graphics/sprites/{name}/`
3. Ensure all 13 parts defined

#### Issue: Script not compiling

**Solutions:**
1. Check vnscript syntax (periods after commands, spaces)
2. Verify bracket matching in OBJECT/CHOICE commands
3. Check for special characters in dialogue
4. Run parser with verbose output

#### Issue: Scene flow broken

**Solutions:**
1. Check sceneID sequence (should be continuous)
2. Verify JUMPTO labels exist
3. Check CHOICE sceneID references
4. Look for duplicate sceneIDs

---

## Adding Localization

### Step 1: Create Language File

**File:** `media/text/strings.es.js` (Spanish example)

```javascript
var _LANG = _LANG || {};
_LANG['es'] = {
    "lang": {
        "select": "Idioma",
        "ok": "Aceptar",
        "label": "ESPAÑOL"
    },

    "Button": {
        "play": "Jugar",
        "shop": "Tienda",
        "ok": "Aceptar",
        "cancel": "Cancelar"
    },

    "Settings": {
        "settings": "Configuración",
        "reset": "Reiniciar",
        "menu": "Menú Principal",
        "music": "Música",
        "sfx": "Efectos"
    },

    "Chapter": {
        "choose": "Elige un capítulo",
        "chapter": "Capítulo",
        "title": [
            "",
            "Capítulo 1: El Comienzo",
            "Capítulo 2: El Viaje"
        ]
    }
};
```

### Step 2: Translate Chapter

**Manual Translation:**

```javascript
// chapter1.es.js
_LANG["es"]["Chapter1"] = [
    {sceneID: 0, charTalk: "none", text: "", animEffect: {type: "trans1", color: "#000000"}},
    {sceneID: 1, charTalk: "Amy", text: "¡Buenos días, Jack!", char: [...]},
    // ... translated scenes
];
```

**Automated Translation:**

```bash
# Install translator
cd script-converter
npm install

# Translate chapter
node chatgpt-translate.js chapter1 es

# Output: media/text/translate/chapter1.es.js
```

### Step 3: Enable Language Selector

**In `lib/settings.js`:**

```javascript
_DATAGAME: {
    "enableLanguage": true,  // Show language selector
    // ...
}
```

### Step 4: Update Load Script

**In `glue/load/load.js`:**

```javascript
var _LOADSCRIPTS2 = [
    "engine.js",
    "media/text/customload.js",
    "media/text/strings.js",
    "media/text/strings.en.js",
    "media/text/strings.es.js",  // Add Spanish
    // Chapters loaded dynamically
];
```

### Step 5: Test

```
1. Open game
2. Click language selector
3. Choose "ESPAÑOL"
4. UI should change to Spanish
5. Dialogue should be in Spanish
```

---

## Build and Deployment

### Development vs Production

| Environment | Files | Minified | Obfuscated |
|-------------|-------|----------|------------|
| **Development** | dev.html | No | No |
| **Production** | index.html | Yes | Yes |

### Build Process

#### 1. Compile Scripts

```bash
# Combine all chapter files
cat media/text/translate/*.js > all-chapters.js

# Minify with Google Closure Compiler
java -jar compiler.jar \
    --js all-chapters.js \
    --js_output_file media/text/chapters.min.js \
    --compilation_level SIMPLE

# Or use online minifier
# https://closure-compiler.appspot.com/
```

#### 2. Optimize Assets

```bash
# Optimize images
for file in media/graphics/backgrounds/*.jpg; do
    convert "$file" -quality 85 -strip "$file"
done

for file in media/graphics/object/*.png; do
    pngquant --quality=65-80 "$file" --ext .png --force
done

# Optimize audio
for file in media/audio/bgm/*.mp3; do
    ffmpeg -i "$file" -b:a 128k "${file%.mp3}_opt.mp3"
    mv "${file%.mp3}_opt.mp3" "$file"
done
```

#### 3. Obfuscate (Optional)

```bash
# Install javascript-obfuscator
npm install -g javascript-obfuscator

# Obfuscate settings
javascript-obfuscator lib/settings.js \
    --output lib/settings.js \
    --compact true \
    --controlFlowFlattening true

# Obfuscate chapters
javascript-obfuscator media/text/chapters.min.js \
    --output media/text/chapters.min.js \
    --compact true
```

#### 4. Create Build

```bash
#!/bin/bash
# build.sh

echo "Building production version..."

# 1. Clean build directory
rm -rf build/
mkdir build

# 2. Copy essential files
cp index.html build/
cp engine.js build/
cp engine.css build/
cp -r media build/
cp -r glue build/
cp -r lib build/

# 3. Minify and combine scripts
# (Use above commands)

# 4. Create archive
zip -r my-vn-v1.0.0.zip build/

echo "Build complete: my-vn-v1.0.0.zip"
```

**Run:**
```bash
chmod +x build.sh
./build.sh
```

### Deployment Options

#### Option 1: Static Web Hosting

**Services:**
- Netlify (free)
- Vercel (free)
- GitHub Pages (free)
- AWS S3 + CloudFront

**Netlify Example:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd build
netlify deploy --prod

# Follow prompts
# Get URL: https://your-game.netlify.app
```

#### Option 2: Self-Hosted

**Requirements:**
- Web server (Apache, Nginx)
- HTTPS (for audio autoplay)

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/my-visual-novel;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### Option 3: Itch.io

```bash
# 1. Create zip of build folder
zip -r my-game.zip build/*

# 2. Upload to itch.io
# - Go to itch.io
# - Create new project
# - Upload my-game.zip
# - Set as HTML5 game
# - Set viewport: 1920x1080
```

### Pre-Deployment Checklist

- [ ] All assets load correctly
- [ ] All chapters playable
- [ ] Saves work correctly
- [ ] Audio plays (with user interaction)
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] All translations complete
- [ ] Version numbers updated
- [ ] Credits added

---

## Troubleshooting

### Common Problems

#### Problem: Game doesn't start

**Check:**
1. Browser console for errors
2. All script files loading (Network tab)
3. Canvas element exists
4. jQuery loaded before other scripts

**Fix:**
```javascript
// Add to dev.html before </body>
<script>
window.addEventListener('error', function(e) {
    console.error('Global error:', e.message, e.filename, e.lineno);
});
</script>
```

#### Problem: Black screen

**Possible causes:**
1. Background image not found
2. Background not set in first scene
3. Image path incorrect

**Fix:**
```vnscript
// Always start with background
BACKGROUND. background_name center
```

#### Problem: Character sprites broken

**Check:**
1. All 13 parts defined in settings.js
2. Sprite files exist for each part
3. Part names match exactly (case-sensitive)
4. Spriter data structure correct

**Debug:**
```javascript
// In console
console.log(_DATAGAME.spriterData.amy);
// Should show all 13 parts

// Check sprite images
console.log(ig.game.girls[0].spriter);
```

#### Problem: Audio not playing

**Common issues:**
1. Autoplay blocked by browser
2. File format not supported
3. File path incorrect
4. Audio not in customload.js

**Fix:**
```javascript
// User must interact first
document.addEventListener('click', function() {
    ig.soundHandler.unlockWebAudio();
}, {once: true});
```

#### Problem: Saves not working

**Check:**
1. localStorage enabled in browser
2. Correct storage key in settings.js
3. No private/incognito mode

**Debug:**
```javascript
// Check if saves exist
console.log(localStorage.getItem('my-vn-game-v1'));

// Manually save
ig.game.save('test', 'value');

// Manually load
console.log(ig.game.load('test'));
```

---

## Examples

### Example 1: Simple Linear Story

```vnscript
// Simple 5-scene linear story
BACKGROUND. park center
BGM. happy_music

CHARACTERS. @Amy position center anim ANIM_IDLE

@Amy emo EMO_HAPPY What a beautiful day!

@NONE (A bird chirps nearby)

SFX. bird_chirp

@Amy anim ANIM_WALK I think I'll take a walk.

WALK_OUT. @Amy to right

@NONE The End.
```

### Example 2: Branching with Consequences

```vnscript
BACKGROUND. street center
CHARACTERS. @Hero position center

@NONE You see a person being mugged.

CHOICE. Help them { REWARD. karma 10 } { SET_BOOLEAN. helped_person true } { JUMPTO. help } ; Walk away { REWARD. karma -5 } { JUMPTO. walk_away }

JUMPTO. help
@Hero anim ANIM_RUN Hey! Leave them alone!
SET_INTEGER. heroism += 1
JUMPTO. continue

JUMPTO. walk_away
@Hero emo EMO_GUILTY I... I can't get involved.
JUMPTO. continue

JUMPTO. continue
CHECK_BOOLEAN. helped_person true { JUMPTO. good_ending }
JUMPTO. bad_ending

JUMPTO. good_ending
@NONE The person thanks you. You feel good.

JUMPTO. bad_ending
@NONE You feel guilty for not helping.
```

### Example 3: Character Affection System

```vnscript
// Track affection across scenes
BACKGROUND. cafe center
CHARACTERS. @Love_Interest position right faceTo left ; @Player position left

@Love_Interest Would you like to get dinner sometime?

CHOICE. I'd love to! { REWARD. affection 15 } { JUMPTO. accept } ; Maybe another time { REWARD. affection -5 } { JUMPTO. decline }

JUMPTO. accept
@Love_Interest emo EMO_HAPPY Great! I know a wonderful place.
SET_INTEGER. dates += 1
JUMPTO. check_affection

JUMPTO. decline
@Love_Interest emo EMO_SAD Oh, okay...
JUMPTO. check_affection

JUMPTO. check_affection
CHECK_INTEGER. affection >= 50 { JUMPTO. romance_path }
JUMPTO. friend_path
```

### Example 4: Mini-game with Points

```vnscript
SET_INTEGER. score = 0

@NONE Round 1: Choose the correct answer.

CHOICE. Answer A { SET_INTEGER. score += 10 } { JUMPTO. round2 } ; Answer B { SET_INTEGER. score += 0 } { JUMPTO. round2 }

JUMPTO. round2
@NONE Round 2: Another question.

CHOICE. Answer A { SET_INTEGER. score += 10 } { JUMPTO. results } ; Answer B { SET_INTEGER. score += 0 } { JUMPTO. results }

JUMPTO. results
CHECK_INTEGER. score >= 20 { JUMPTO. perfect }
CHECK_INTEGER. score >= 10 { JUMPTO. good }
JUMPTO. bad

JUMPTO. perfect
@NONE Perfect score!

JUMPTO. good
@NONE Good job!

JUMPTO. bad
@NONE Try again!
```

---

## Conclusion

You now have everything you need to create a visual novel game!

### Next Steps

1. **Experiment** - Try different commands and effects
2. **Read Docs** - Review ENGINE_DOCUMENTATION.md and SCRIPT_EDITOR_DOCUMENTATION.md
3. **Join Community** - Share your work and get feedback
4. **Iterate** - Playtest and improve

### Resources

- **Documentation:** `docs/` folder
- **Example Project:** `first-world-problems/`
- **Script Reference:** `docs/SCRIPT_EDITOR_DOCUMENTATION.md`
- **Engine API:** `docs/ENGINE_DOCUMENTATION.md`

### Getting Help

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review example project
3. Check browser console for errors
4. Verify file paths and names

---

**Happy visual novel creating!**

**End of Project Setup Guide**
