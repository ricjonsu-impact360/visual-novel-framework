# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Visual Novel Game Project** called "First World Problems" built using the Visual Novel Engine (version 2.0.0). It is a game instance that uses the engine located at `../visual-novel-engine/`.

**Key Structure**: This repository contains game-specific content (story scripts, characters, settings), while the core engine resides in a separate repository (`../visual-novel-engine/`).

## Core Architecture

### Two-Repository Structure

1. **Game Project** (this repository): Contains game data, scripts, characters, assets
2. **Engine** (`../visual-novel-engine/`): Contains the core visual novel framework (ImpactJS-based)

The game references engine files via relative paths:
- `../2.0.0/engine.js` - Compiled game engine
- `../2.0.0/engine.css` - Engine stylesheet
- `lib/settings.js` - Engine configuration template (copied from engine repo)

### Key Files

**Configuration**:
- `settings.js` - Game configuration (obfuscated in production, human-readable template in `lib/settings.js`)
- `lib/settings.js` - Clean template with game settings: character outfits (spriterData), UI themes, chapter count, currency options
- `media/text/customload.js` - Auto-generated asset manifest (backgrounds, objects, sfx, bgm per chapter)

**Story Scripts**:
- `media/text/scripts/chapter*.en.vnscript` - Human-readable story scripts in custom DSL format
- `media/text/translate/chapter*.en.js` - Compiled JavaScript chapter data (generated from .vnscript files)
- `script.js` - Final compiled game script combining all chapters and text (obfuscated in production)

**UI Text**:
- `media/text/strings.js` - Core UI strings (buttons, dialogs, settings)
- `media/text/strings.en.js` - English translations for UI
- `media/text/strings.*.js` - Other language translations (es, de, cn, jp, kr, ru, nl, zh)

## Story Script Format (.vnscript)

The game uses a custom DSL for writing stories. Scripts are stored as `.vnscript` files and compiled to JavaScript.

**Example vnscript syntax**:
```
ANIMEFFECT. trans1 #ffffff
BACKGROUND. hd_home_office1 center
CHARACTERS. @Barney position center anim ANIM_SIT_TYPING_GENTLE_REAR faceTo left
OBJECT. desk desk_rear from { x:450,y:1720 } pivotX 0.5 pivotY 1 zIndex -1 persist true

@Barney Thank you, Martha. The new workflow helped a lot.
SETCHAR. @Barney anim ANIM_SIT_TYPING_GENTLE emo EMO_NEUTRAL
```

**Key Commands**:
- `BACKGROUND.` - Set background image
- `CHARACTERS.` - Position and animate characters
- `OBJECT.` - Place objects in scene
- `ANIMEFFECT.` - Scene transitions and effects
- `SETCHAR.` - Update character animation/emotion
- `@CharacterName` - Dialog line spoken by character
- `SETTINGS.` - Configure scene settings (nameTag, bubbleOffset, etc.)

## Development Workflow

### Building Scripts

**Convert vnscript to JavaScript** (after editing chapter scripts):
```bash
cd script-converter
bash convert-script.sh -b
```
This reads `.vnscript` files from `media/text/scripts/` and generates JavaScript files in `media/text/translate/`.

**Compile all chapters into script.js**:
```bash
bash build_script.sh
```
This compiles all chapter JavaScript files into a single `script.js` (with obfuscation for security).

**Full workflow after script changes**:
```bash
cd script-converter
bash convert-script.sh -b   # Convert vnscript to JS
cd ..
bash build_script.sh         # Compile and obfuscate
```

### Asset Management

**Copy assets from shared asset library**:
```bash
python copy_assets.py
# or
bash copy_assets.sh
```

This script reads `media/text/customload.js` and copies required assets from `../v2-visual-novel-assets/` to the game's `media/` directory. It copies:
- Backgrounds: `media/graphics/backgrounds/`
- Objects: `media/graphics/object/`
- Sound effects: `media/audio/sfx/`
- Background music: `media/audio/bgm/`

**Update script editor dependencies**:
```bash
bash update-script-editor.sh
```
Copies script editor files from engine repository.

### Character Management

**Character preview/editing** (web-based tool):
1. Open `character-preview.html` in browser
2. Adjust character outfits using the interface
3. Character data is automatically exported to `lib/settings.js` under `spriterData`

**Current Characters**:
- Barney (old man, brown beard, leather jacket)
- Amy (main character, purple skin, moss green hair)
- Souper Visor (blonde, orange padding)
- Scammer 1, 2, CEO (various antagonists)

**Character Definition Structure** (in `lib/settings.js`):
```javascript
"spriterData": {
  "barney": {
    "bgName": "#ffffff",
    "textName": "#000000",
    "boy": {
      "skin": "skin-fair-old",
      "face": "face-monolid-dark-brown-eye",
      "hair": "hair-none",
      "top": "top-leather-jacket-black",
      // ... more outfit parts
    }
  }
}
```

### Testing

**Local Development**:
1. Open `index.html` in browser (requires local web server)
2. Use `dev.html` for development mode with console logging enabled

**Test with specific chapter/scene**:
```
dev.html?nocache&directLoadChapter=2&startFromSceneID=50
```

### Translation

**Translate chapters using ChatGPT** (requires API setup):
```bash
cd script-converter
bash translate.sh -t "chapter1.en.js"
# or translate all chapters:
bash translate.sh -a
```

This uses `chatgpt-translate.js` to generate translations of dialog text.

## Important Configuration

### Game Settings (`lib/settings.js` and `settings.js`)

Key configuration options in `_GAMESETTING._DATAGAME`:
- `defaultName`: Player's default name if not entered
- `enableFullScreen`: Show fullscreen button
- `enableShop`: Enable shop and currency system
- `enableLanguage`: Show language selector
- `enableDemo`: Show demo version notice
- `enableURLParam`: Enable URL parameters for testing
- `enableConsoleLog`: Enable console logging
- `isLinearChapter`: Chapters must be played in order
- `uiTheme`: UI color theme ("pink", etc.)
- `chapters.totalChapter`: Total number of chapters (currently 3)
- `spriterData`: Character outfit definitions
- `neutral_boy`/`neutral_girl`: Lists of characters by gender
- `dynamic_name`: Characters whose names can change

### Asset Paths

Base paths configured in `_GAMESETTING._BASEPATH`:
- `text`: `"media/text/"`
- Backgrounds, objects, audio follow standard media folder structure

### Local Storage

Game saves are stored in browser localStorage with key: `"vn-game-testing"` (defined in `_GAMESETTING._LOCALSTORAGE_KEY`)

## Script Editor Tools

The `script-converter/` directory contains tools for managing game scripts:

**Files**:
- `script-editor.html` - Web interface for exporting scripts
- `script-editor.js` - Core script conversion logic (vnscript → JS)
- `script-export.js` - Handles batch export of all chapters
- `character-preview.js` - Character outfit editor logic
- `chatgpt-translate.js` - AI-powered translation tool
- `characters-data.js` - Character definitions for editor

**Opening Script Editor**:
1. Navigate to `script-converter/script-editor.html` in browser
2. Click "Export All Scripts" to compile all `.vnscript` files
3. Click "Update Characters" to edit character outfits

## Build and Deployment

### Production Build

The `push.sh` script (inherited from engine) handles deployment:
- Compiles scripts with Google Closure Compiler
- Applies code obfuscation for security
- Injects domain lock and anti-breakout measures
- Optionally uploads to S3 and invalidates CloudFront cache

**Note**: For this game project, primarily use `build_script.sh` rather than the full engine `push.sh`.

### Build Commands

```bash
# Compile game scripts (chapters + strings → script.js)
bash build_script.sh

# This script:
# 1. Compiles with Google Closure Compiler (compiler.jar)
# 2. Injects domain lock breakout protection
# 3. Obfuscates code with javascript-obfuscator
```

## Important Notes

### Code Obfuscation

Both `settings.js` and `script.js` are heavily obfuscated in production builds for security. Always edit:
- `lib/settings.js` (clean template) instead of `settings.js`
- `.vnscript` files instead of compiled `.js` files
- After editing, run the appropriate build script to regenerate obfuscated versions

### Asset References

Assets referenced in scripts must exist in:
- `media/graphics/backgrounds/` - Background images
- `media/graphics/object/` - Scene objects
- `media/audio/sfx/` - Sound effects
- `media/audio/bgm/` - Background music

Missing assets will be logged in `customload.js` during script compilation.

### Engine Dependencies

This game depends on the Visual Novel Engine repository. Key engine dependencies:
- `engine.js` - Core game engine (ImpactJS + plugins)
- `engine.css` - Engine styles
- See `../visual-novel-engine/CLAUDE.md` for engine architecture details

### Version Information

- Engine Version: `_ENGINE_VERSION = "2.0.0"` (in `lib/settings.js`)
- Game Version: `_VERSION = { Version: '1.0.0', Build: '455' }` (in `settings.js`)

## Common Tasks

**Add a new chapter**:
1. Create `media/text/scripts/chapterN.en.vnscript`
2. Write story using vnscript DSL
3. Run `cd script-converter && bash convert-script.sh -b`
4. Update `_GAMESETTING._DATAGAME.chapters.totalChapter` in `lib/settings.js`
5. Run `bash build_script.sh`

**Modify character outfit**:
1. Open `character-preview.html`
2. Select character and adjust outfit parts
3. Export updates to `lib/settings.js`
4. Rebuild game if needed

**Update UI text**:
1. Edit `media/text/strings.en.js` for English
2. Edit corresponding `strings.*.js` for other languages
3. Run `bash build_script.sh`

**Fix asset loading issues**:
1. Check `media/text/customload.js` for required assets
2. Run `python copy_assets.py` to copy from shared asset library
3. Or manually add missing assets to appropriate `media/` subdirectories
